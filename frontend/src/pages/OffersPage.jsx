import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Search } from 'lucide-react';
import { API, getAuthHeaders } from '@/utils/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ student_id: '', company_id: '', package: '', role: '', date: '' });

  useEffect(() => { fetchOffers(); fetchStudents(); fetchCompanies(); }, []);
  useEffect(() => {
    const filtered = offers.filter(o => o.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || o.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredOffers(filtered);
  }, [searchTerm, offers]);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${API}/offers`);
      setOffers(response.data);
      setFilteredOffers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API}/companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, package: parseFloat(formData.package) };
      await axios.post(`${API}/offers`, data, { headers: getAuthHeaders() });
      fetchOffers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.detail || 'Failed to save offer');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API}/offers/${id}`, { headers: getAuthHeaders() });
      fetchOffers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({ student_id: '', company_id: '', package: '', role: '', date: '' });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <div><h1 className="text-3xl font-bold text-gray-900" data-testid="offers-title">Placement Offers</h1><p className="text-gray-600 mt-2">Track student placement offers</p></div>
          <Button onClick={() => setDialogOpen(true)} className="flex items-center space-x-2" data-testid="add-offer-button"><Plus size={18} /><span>Add Offer</span></Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <Input placeholder="Search by student or company..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" data-testid="search-input" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="offers-table">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package (LPA)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOffers.map((offer) => (
                    <tr key={offer.id} data-testid={`offer-row-${offer.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{offer.student_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{offer.company_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{offer.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{offer.package}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{offer.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(offer.id)} data-testid={`delete-offer-${offer.id}`}><Trash2 size={16} /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOffers.length === 0 && <div className="text-center py-12 text-gray-500" data-testid="no-offers">No offers found</div>}
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="offer-dialog">
          <DialogHeader>
            <DialogTitle>Add New Offer</DialogTitle>
            <DialogDescription>Record a new placement offer</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <Select value={formData.student_id} onValueChange={(value) => setFormData({ ...formData, student_id: value })}>
                <SelectTrigger data-testid="offer-student-select"><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{students.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select value={formData.company_id} onValueChange={(value) => setFormData({ ...formData, company_id: value })}>
                <SelectTrigger data-testid="offer-company-select"><SelectValue placeholder="Select company" /></SelectTrigger>
                <SelectContent>{companies.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label htmlFor="role">Role</Label><Input id="role" data-testid="offer-role-input" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="package">Package (LPA)</Label><Input id="package" data-testid="offer-package-input" type="number" step="0.1" value={formData.package} onChange={(e) => setFormData({ ...formData, package: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" data-testid="offer-date-input" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" data-testid="offer-submit-button">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default OffersPage;
