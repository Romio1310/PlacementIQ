import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { API, getAuthHeaders } from '@/utils/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({ name: '', domain: '', package: '', location: '', website: '' });

  useEffect(() => { fetchCompanies(); }, []);
  useEffect(() => {
    const filtered = companies.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [searchTerm, companies]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API}/companies`);
      setCompanies(response.data);
      setFilteredCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, package: parseFloat(formData.package) };
      if (editingCompany) {
        await axios.put(`${API}/companies/${editingCompany.id}`, data, { headers: getAuthHeaders() });
      } else {
        await axios.post(`${API}/companies`, data, { headers: getAuthHeaders() });
      }
      fetchCompanies();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving company:', error);
      alert(error.response?.data?.detail || 'Failed to save company');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API}/companies/${id}`, { headers: getAuthHeaders() });
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({ name: company.name, domain: company.domain, package: company.package.toString(), location: company.location, website: company.website || '' });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCompany(null);
    setFormData({ name: '', domain: '', package: '', location: '', website: '' });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="companies-title">Companies</h1>
            <p className="text-gray-600 mt-2">Manage company records</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="flex items-center space-x-2" data-testid="add-company-button">
            <Plus size={18} /><span>Add Company</span>
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <Input placeholder="Search by name or domain..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" data-testid="search-input" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="companies-table">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Domain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package (LPA)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompanies.map((company) => (
                    <tr key={company.id} data-testid={`company-row-${company.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{company.domain}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{company.package}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{company.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(company)} data-testid={`edit-company-${company.id}`}><Edit size={16} /></Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(company.id)} data-testid={`delete-company-${company.id}`}><Trash2 size={16} /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCompanies.length === 0 && <div className="text-center py-12 text-gray-500" data-testid="no-companies">No companies found</div>}
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="company-dialog">
          <DialogHeader>
            <DialogTitle>{editingCompany ? 'Edit Company' : 'Add New Company'}</DialogTitle>
            <DialogDescription>{editingCompany ? 'Update company information' : 'Add a new company to the system'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="name">Company Name</Label><Input id="name" data-testid="company-name-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="domain">Domain</Label><Input id="domain" data-testid="company-domain-input" value={formData.domain} onChange={(e) => setFormData({ ...formData, domain: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="package">Package (LPA)</Label><Input id="package" data-testid="company-package-input" type="number" step="0.1" value={formData.package} onChange={(e) => setFormData({ ...formData, package: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" data-testid="company-location-input" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="website">Website</Label><Input id="website" data-testid="company-website-input" type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" data-testid="company-submit-button">{editingCompany ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default CompaniesPage;
