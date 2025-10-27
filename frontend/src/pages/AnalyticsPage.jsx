import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API } from '@/utils/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Filler } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Filler);

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [deptData, setDeptData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [roleData, setRoleData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [dept, company, trend, role] = await Promise.all([
        axios.get(`${API}/analytics/department-placements`),
        axios.get(`${API}/analytics/company-packages`),
        axios.get(`${API}/analytics/yearly-trends`),
        axios.get(`${API}/analytics/role-distribution`)
      ]);
      
      setDeptData(dept.data);
      setCompanyData(company.data);
      setTrendData(trend.data);
      setRoleData(role.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  const deptChartData = {
    labels: deptData?.labels || [],
    datasets: [{
      label: 'Placements',
      data: deptData?.values || [],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
    }]
  };

  const companyChartData = {
    labels: companyData?.labels || [],
    datasets: [{
      label: 'Average Package (LPA)',
      data: companyData?.values || [],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  const trendChartData = {
    labels: trendData?.labels || [],
    datasets: [{
      label: 'Placements',
      data: trendData?.values || [],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      tension: 0.4,
      fill: true,
    }]
  };

  const roleChartData = {
    labels: roleData?.labels || [],
    datasets: [{
      label: 'Offers',
      data: roleData?.values || [],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'],
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="analytics-title">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Visual insights and trends</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card data-testid="chart-department">
            <CardHeader>
              <CardTitle>Department-wise Placements</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={deptChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </CardContent>
          </Card>

          <Card data-testid="chart-company">
            <CardHeader>
              <CardTitle>Average Package by Company</CardTitle>
            </CardHeader>
            <CardContent>
              <Line data={companyChartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
            </CardContent>
          </Card>

          <Card data-testid="chart-trends">
            <CardHeader>
              <CardTitle>Placement Trends by Year</CardTitle>
            </CardHeader>
            <CardContent>
              <Line data={trendChartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
            </CardContent>
          </Card>

          <Card data-testid="chart-roles">
            <CardHeader>
              <CardTitle>Offer Distribution by Role</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie data={roleChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnalyticsPage;
