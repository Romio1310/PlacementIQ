from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client['placementiq_db']

# Create the main app
app = FastAPI(title="PlacementIQ API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
# CRITICAL: JWT_SECRET_KEY must be set in .env file - no default fallback for security
if "JWT_SECRET_KEY" not in os.environ:
    raise ValueError(
        "❌ SECURITY ERROR: JWT_SECRET_KEY is not set in environment variables!\n"
        "Create a .env file in the backend directory with a strong random secret.\n"
        "Example: JWT_SECRET_KEY=your-super-secret-random-string-min-32-characters"
    )
SECRET_KEY = os.environ["JWT_SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Security
security = HTTPBearer()

# ==================== MODELS ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Student(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    roll_number: str
    department: str
    cgpa: float
    email: str
    phone: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StudentCreate(BaseModel):
    name: str
    roll_number: str
    department: str
    cgpa: float
    email: str
    phone: str

class Company(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    domain: str
    package: float  # in LPA
    location: str
    website: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CompanyCreate(BaseModel):
    name: str
    domain: str
    package: float
    location: str
    website: Optional[str] = None

class Drive(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    company_name: str
    date: str
    eligible_departments: List[str]
    role: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DriveCreate(BaseModel):
    company_id: str
    date: str
    eligible_departments: List[str]
    role: str
    description: Optional[str] = None

class Offer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    student_name: str
    company_id: str
    company_name: str
    package: float
    role: str
    date: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OfferCreate(BaseModel):
    student_id: str
    company_id: str
    package: float
    role: str
    date: str

# ==================== AUTH HELPERS ====================

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"username": username}, {"_id": 0})
    if user is None:
        raise credentials_exception
    return user

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=Token)
async def register(user_input: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"username": user_input.username}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Create user
    user_dict = user_input.model_dump()
    password = user_dict.pop("password")
    user_obj = User(**user_dict, password_hash=get_password_hash(password))
    
    doc = user_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    # Create token
    access_token = create_access_token(data={"sub": user_obj.username})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/auth/login", response_model=Token)
async def login(user_input: UserLogin):
    user = await db.users.find_one({"username": user_input.username}, {"_id": 0})
    if not user or not verify_password(user_input.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {"username": current_user["username"], "email": current_user["email"]}

# ==================== STUDENT ROUTES ====================

@api_router.post("/students", response_model=Student)
async def create_student(student: StudentCreate, current_user: dict = Depends(get_current_user)):
    student_obj = Student(**student.model_dump())
    doc = student_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.students.insert_one(doc)
    return student_obj

@api_router.get("/students", response_model=List[Student])
async def get_students():
    students = await db.students.find({}, {"_id": 0}).to_list(1000)
    for s in students:
        if isinstance(s.get('created_at'), str):
            s['created_at'] = datetime.fromisoformat(s['created_at'])
    return students

@api_router.get("/students/{student_id}", response_model=Student)
async def get_student(student_id: str):
    student = await db.students.find_one({"id": student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if isinstance(student.get('created_at'), str):
        student['created_at'] = datetime.fromisoformat(student['created_at'])
    return student

@api_router.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: str, student: StudentCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.students.find_one({"id": student_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Student not found")
    
    update_data = student.model_dump()
    await db.students.update_one({"id": student_id}, {"$set": update_data})
    
    updated = await db.students.find_one({"id": student_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return updated

@api_router.delete("/students/{student_id}")
async def delete_student(student_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.students.delete_one({"id": student_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted successfully"}

# ==================== COMPANY ROUTES ====================

@api_router.post("/companies", response_model=Company)
async def create_company(company: CompanyCreate, current_user: dict = Depends(get_current_user)):
    company_obj = Company(**company.model_dump())
    doc = company_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.companies.insert_one(doc)
    return company_obj

@api_router.get("/companies", response_model=List[Company])
async def get_companies():
    companies = await db.companies.find({}, {"_id": 0}).to_list(1000)
    for c in companies:
        if isinstance(c.get('created_at'), str):
            c['created_at'] = datetime.fromisoformat(c['created_at'])
    return companies

@api_router.get("/companies/{company_id}", response_model=Company)
async def get_company(company_id: str):
    company = await db.companies.find_one({"id": company_id}, {"_id": 0})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    if isinstance(company.get('created_at'), str):
        company['created_at'] = datetime.fromisoformat(company['created_at'])
    return company

@api_router.put("/companies/{company_id}", response_model=Company)
async def update_company(company_id: str, company: CompanyCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.companies.find_one({"id": company_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Company not found")
    
    update_data = company.model_dump()
    await db.companies.update_one({"id": company_id}, {"$set": update_data})
    
    updated = await db.companies.find_one({"id": company_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return updated

@api_router.delete("/companies/{company_id}")
async def delete_company(company_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.companies.delete_one({"id": company_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Company not found")
    return {"message": "Company deleted successfully"}

# ==================== DRIVE ROUTES ====================

@api_router.post("/drives", response_model=Drive)
async def create_drive(drive: DriveCreate, current_user: dict = Depends(get_current_user)):
    # Get company name
    company = await db.companies.find_one({"id": drive.company_id}, {"_id": 0})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    drive_dict = drive.model_dump()
    drive_dict["company_name"] = company["name"]
    drive_obj = Drive(**drive_dict)
    
    doc = drive_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.drives.insert_one(doc)
    return drive_obj

@api_router.get("/drives", response_model=List[Drive])
async def get_drives():
    drives = await db.drives.find({}, {"_id": 0}).to_list(1000)
    for d in drives:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return drives

@api_router.get("/drives/{drive_id}", response_model=Drive)
async def get_drive(drive_id: str):
    drive = await db.drives.find_one({"id": drive_id}, {"_id": 0})
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")
    if isinstance(drive.get('created_at'), str):
        drive['created_at'] = datetime.fromisoformat(drive['created_at'])
    return drive

@api_router.put("/drives/{drive_id}", response_model=Drive)
async def update_drive(drive_id: str, drive: DriveCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.drives.find_one({"id": drive_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Drive not found")
    
    # Get company name
    company = await db.companies.find_one({"id": drive.company_id}, {"_id": 0})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    update_data = drive.model_dump()
    update_data["company_name"] = company["name"]
    await db.drives.update_one({"id": drive_id}, {"$set": update_data})
    
    updated = await db.drives.find_one({"id": drive_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return updated

@api_router.delete("/drives/{drive_id}")
async def delete_drive(drive_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.drives.delete_one({"id": drive_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Drive not found")
    return {"message": "Drive deleted successfully"}

# ==================== OFFER ROUTES ====================

@api_router.post("/offers", response_model=Offer)
async def create_offer(offer: OfferCreate, current_user: dict = Depends(get_current_user)):
    # Get student and company names
    student = await db.students.find_one({"id": offer.student_id}, {"_id": 0})
    company = await db.companies.find_one({"id": offer.company_id}, {"_id": 0})
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    offer_dict = offer.model_dump()
    offer_dict["student_name"] = student["name"]
    offer_dict["company_name"] = company["name"]
    offer_obj = Offer(**offer_dict)
    
    doc = offer_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.offers.insert_one(doc)
    return offer_obj

@api_router.get("/offers", response_model=List[Offer])
async def get_offers():
    offers = await db.offers.find({}, {"_id": 0}).to_list(1000)
    for o in offers:
        if isinstance(o.get('created_at'), str):
            o['created_at'] = datetime.fromisoformat(o['created_at'])
    return offers

@api_router.get("/offers/{offer_id}", response_model=Offer)
async def get_offer(offer_id: str):
    offer = await db.offers.find_one({"id": offer_id}, {"_id": 0})
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    if isinstance(offer.get('created_at'), str):
        offer['created_at'] = datetime.fromisoformat(offer['created_at'])
    return offer

@api_router.delete("/offers/{offer_id}")
async def delete_offer(offer_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.offers.delete_one({"id": offer_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Offer not found")
    return {"message": "Offer deleted successfully"}

# ==================== ANALYTICS ROUTES ====================

@api_router.get("/analytics/department-placements")
async def get_department_placements():
    """Get placement count by department"""
    offers = await db.offers.find({}, {"_id": 0}).to_list(1000)
    students = await db.students.find({}, {"_id": 0}).to_list(1000)
    
    # Count placed students by department
    placed_student_ids = {offer["student_id"] for offer in offers}
    dept_counts = {}
    
    for student in students:
        if student["id"] in placed_student_ids:
            dept = student["department"]
            dept_counts[dept] = dept_counts.get(dept, 0) + 1
    
    return {
        "labels": list(dept_counts.keys()),
        "values": list(dept_counts.values())
    }

@api_router.get("/analytics/company-packages")
async def get_company_packages():
    """Get average package by company"""
    companies = await db.companies.find({}, {"_id": 0}).to_list(1000)
    
    company_data = {}
    for company in companies:
        company_data[company["name"]] = company["package"]
    
    return {
        "labels": list(company_data.keys()),
        "values": list(company_data.values())
    }

@api_router.get("/analytics/yearly-trends")
async def get_yearly_trends():
    """Get placement trends by year"""
    offers = await db.offers.find({}, {"_id": 0}).to_list(1000)
    
    year_counts = {}
    for offer in offers:
        year = offer["date"][:4]  # Extract year from date
        year_counts[year] = year_counts.get(year, 0) + 1
    
    sorted_years = sorted(year_counts.keys())
    
    return {
        "labels": sorted_years,
        "values": [year_counts[year] for year in sorted_years]
    }

@api_router.get("/analytics/role-distribution")
async def get_role_distribution():
    """Get offer distribution by role"""
    offers = await db.offers.find({}, {"_id": 0}).to_list(1000)
    
    role_counts = {}
    for offer in offers:
        role = offer["role"]
        role_counts[role] = role_counts.get(role, 0) + 1
    
    return {
        "labels": list(role_counts.keys()),
        "values": list(role_counts.values())
    }

@api_router.get("/analytics/stats")
async def get_stats():
    """Get overall statistics"""
    total_students = await db.students.count_documents({})
    total_companies = await db.companies.count_documents({})
    total_drives = await db.drives.count_documents({})
    total_offers = await db.offers.count_documents({})
    
    # Calculate average package
    offers = await db.offers.find({}, {"_id": 0}).to_list(1000)
    avg_package = sum(offer["package"] for offer in offers) / len(offers) if offers else 0
    
    # Calculate placement rate
    placed_students = len(set(offer["student_id"] for offer in offers))
    placement_rate = (placed_students / total_students * 100) if total_students > 0 else 0
    
    return {
        "total_students": total_students,
        "total_companies": total_companies,
        "total_drives": total_drives,
        "total_offers": total_offers,
        "placed_students": placed_students,
        "placement_rate": round(placement_rate, 2),
        "average_package": round(avg_package, 2)
    }

# ==================== SEED DATA ====================

@api_router.post("/seed")
async def seed_data():
    """Populate database with sample data"""
    
    # Check if data already exists
    if await db.students.count_documents({}) > 0:
        return {"message": "Database already has data. Skipping seed."}
    
    departments = ["CSE", "ECE", "ME", "EEE", "IT", "Civil"]
    domains = ["IT Services", "Product", "Consulting", "Finance", "E-commerce", "Healthcare"]
    roles = ["Software Engineer", "Data Analyst", "Product Manager", "ML Engineer", "Full Stack Developer", "DevOps Engineer"]
    locations = ["Bangalore", "Hyderabad", "Pune", "Mumbai", "Delhi", "Chennai"]
    
    first_names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Rohan", "Neha", "Karan", "Pooja",
                   "Aditya", "Divya", "Arjun", "Riya", "Sanjay", "Kavya", "Nikhil", "Shreya", "Akash", "Tanvi",
                   "Varun", "Ananya", "Harsh", "Ishita", "Gaurav", "Meera", "Siddharth", "Nisha", "Manish", "Sakshi",
                   "Rajesh", "Preeti", "Abhishek", "Swati", "Deepak", "Ritika", "Suresh", "Pallavi", "Vishal", "Megha",
                   "Naveen", "Simran", "Ashish", "Aditi", "Mohit", "Kritika", "Sandeep", "Shweta", "Pankaj", "Aarti"]
    
    last_names = ["Sharma", "Verma", "Singh", "Kumar", "Reddy", "Gupta", "Patel", "Nair", "Iyer", "Rao"]
    
    companies_data = [
        {"name": "TechCorp Solutions", "domain": "IT Services", "package": 8.5, "location": "Bangalore"},
        {"name": "DataWorks Inc", "domain": "Product", "package": 12.0, "location": "Hyderabad"},
        {"name": "CloudNine Systems", "domain": "IT Services", "package": 7.5, "location": "Pune"},
        {"name": "InnovateTech", "domain": "Product", "package": 15.0, "location": "Bangalore"},
        {"name": "FinanceHub", "domain": "Finance", "package": 10.0, "location": "Mumbai"},
        {"name": "EcomGiant", "domain": "E-commerce", "package": 11.5, "location": "Bangalore"},
        {"name": "HealthTech Solutions", "domain": "Healthcare", "package": 9.0, "location": "Chennai"},
        {"name": "ConsultPro", "domain": "Consulting", "package": 13.5, "location": "Delhi"},
        {"name": "AI Innovations", "domain": "Product", "package": 16.0, "location": "Bangalore"},
        {"name": "WebDev Masters", "domain": "IT Services", "package": 6.5, "location": "Pune"}
    ]
    
    # Create 50 students
    students_list = []
    for i in range(50):
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        name = f"{first_name} {last_name}"
        roll = f"21{random.choice(departments)}{1000 + i}"
        dept = random.choice(departments)
        cgpa = round(random.uniform(6.5, 9.8), 2)
        email = f"{first_name.lower()}.{last_name.lower()}@college.edu"
        phone = f"+91{random.randint(7000000000, 9999999999)}"
        
        student = Student(
            name=name,
            roll_number=roll,
            department=dept,
            cgpa=cgpa,
            email=email,
            phone=phone
        )
        doc = student.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        students_list.append(doc)
    
    await db.students.insert_many(students_list)
    
    # Create 10 companies
    companies_list = []
    for comp_data in companies_data:
        company = Company(**comp_data, website=f"https://{comp_data['name'].lower().replace(' ', '')}.com")
        doc = company.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        companies_list.append(doc)
    
    await db.companies.insert_many(companies_list)
    
    # Get inserted data for reference
    students = await db.students.find({}, {"_id": 0}).to_list(1000)
    companies = await db.companies.find({}, {"_id": 0}).to_list(1000)
    
    # Create 20 drives
    drives_list = []
    for i in range(20):
        company = random.choice(companies)
        eligible_depts = random.sample(departments, random.randint(2, 4))
        date = f"202{random.randint(3, 5)}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"
        role = random.choice(roles)
        
        drive = Drive(
            company_id=company["id"],
            company_name=company["name"],
            date=date,
            eligible_departments=eligible_depts,
            role=role,
            description=f"Campus recruitment drive for {role} position"
        )
        doc = drive.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        drives_list.append(doc)
    
    await db.drives.insert_many(drives_list)
    
    # Create 30-40 offers (some students get placed)
    offers_list = []
    placed_students = random.sample(students, random.randint(30, 40))
    
    for student in placed_students:
        company = random.choice(companies)
        role = random.choice(roles)
        package = company["package"] + random.uniform(-1.0, 2.0)
        date = f"202{random.randint(3, 5)}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"
        
        offer = Offer(
            student_id=student["id"],
            student_name=student["name"],
            company_id=company["id"],
            company_name=company["name"],
            package=round(package, 2),
            role=role,
            date=date
        )
        doc = offer.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        offers_list.append(doc)
    
    await db.offers.insert_many(offers_list)
    
    return {
        "message": "Database seeded successfully!",
        "students": len(students_list),
        "companies": len(companies_list),
        "drives": len(drives_list),
        "offers": len(offers_list)
    }

# ==================== ROOT ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "PlacementIQ API - Intelligent College Placement Management System"}

@api_router.get("/health")
async def health():
    return {"status": "healthy", "service": "PlacementIQ"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Auto-seed on startup
@app.on_event("startup")
async def startup_seed():
    """Auto-seed database on first run"""
    try:
        count = await db.students.count_documents({})
        if count == 0:
            logger.info("No data found. Auto-seeding database...")
            await seed_data()
            logger.info("Database seeded successfully!")
    except Exception as e:
        logger.error(f"Error during auto-seed: {e}")
