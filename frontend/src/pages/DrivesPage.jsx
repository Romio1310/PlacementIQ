import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { API, getAuthHeaders } from '@/utils/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const DrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [formData, setFormData] = useState({ company_id: '', date: '', eligible_departments: [], role: '', description: '' });

  const departments = ['CSE', 'ECE', 'ME', 'EEE', 'IT', 'Civil'];

  useEffect(() => { fetchDrives(); fetchCompanies(); }, []);
  useEffect(() => {
    const filtered = drives.filter(d => d.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || d.role.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredDrives(filtered);
  }, [searchTerm, drives]);

  const fetchDrives = async () => {
    try {
      const response = await axios.get(`${API}/drives`);
      setDrives(response.data);
      setFilteredDrives(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
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
      if (editingDrive) {
        await axios.put(`${API}/drives/${editingDrive.id}`, formData, { headers: getAuthHeaders() });
      } else {
        await axios.post(`${API}/drives`, formData, { headers: getAuthHeaders() });
      }
      fetchDrives();
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.detail || 'Failed to save drive');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API}/drives/${id}`, { headers: getAuthHeaders() });
      fetchDrives();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (drive) => {
    setEditingDrive(drive);
    setFormData({ company_id: drive.company_id, date: drive.date, eligible_departments: drive.eligible_departments, role: drive.role, description: drive.description || '' });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDrive(null);
    setFormData({ company_id: '', date: '', eligible_departments: [], role: '', description: '' });
  };

  const toggleDepartment = (dept) => {
    setFormData(prev => ({
      ...prev,
      eligible_departments: prev.eligible_departments.includes(dept)
        ? prev.eligible_departments.filter(d => d !== dept)
        : [...prev.eligible_departments, dept]
    }));
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <div><h1 className="text-3xl font-bold text-gray-900" data-testid="drives-title">Placement Drives</h1><p className="text-gray-600 mt-2">Manage placement drive schedules</p></div>
          <Button onClick={() => setDialogOpen(true)} className="flex items-center space-x-2" data-testid="add-drive-button"><Plus size={18} /><span>Add Drive</span></Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <Input placeholder="Search by company or role..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" data-testid="search-input" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="drives-table">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eligible Depts</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDrives.map((drive) => (
                    <tr key={drive.id} data-testid={`drive-row-${drive.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{drive.company_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{drive.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{drive.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{drive.eligible_departments.join(', ')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(drive)} data-testid={`edit-drive-${drive.id}`}><Edit size={16} /></Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(drive.id)} data-testid={`delete-drive-${drive.id}`}><Trash2 size={16} /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredDrives.length === 0 && <div className="text-center py-12 text-gray-500" data-testid="no-drives">No drives found</div>}
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="drive-dialog" className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDrive ? 'Edit Drive' : 'Add New Drive'}</DialogTitle>
            <DialogDescription>{editingDrive ? 'Update drive information' : 'Schedule a new placement drive'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select value={formData.company_id} onValueChange={(value) => setFormData({ ...formData, company_id: value })}>
                <SelectTrigger data-testid="drive-company-select"><SelectValue placeholder="Select company" /></SelectTrigger>
                <SelectContent>{companies.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label htmlFor="role">Role</Label><Input id="role" data-testid="drive-role-input" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" data-testid="drive-date-input" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required /></div>
            <div className="space-y-2">
              <Label>Eligible Departments</Label>
              <div className="grid grid-cols-3 gap-2">
                {departments.map(dept => (
                  <label key={dept} className="flex items-center space-x-2">
                    <input type="checkbox" checked={formData.eligible_departments.includes(dept)} onChange={() => toggleDepartment(dept)} className="rounded" />
                    <span className="text-sm">{dept}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2"><Label htmlFor="description">Description</Label><Input id="description" data-testid="drive-description-input" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" data-testid="drive-submit-button">{editingDrive ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default DrivesPage;
