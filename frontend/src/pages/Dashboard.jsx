import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Calendar, FileText, TrendingUp, Award } from 'lucide-react';
import { API } from '@/utils/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/analytics/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.total_students || 0,
      icon: Users,
      color: 'blue',
      link: '/students',
      testId: 'stat-students'
    },
    {
      title: 'Total Companies',
      value: stats?.total_companies || 0,
      icon: Building2,
      color: 'green',
      link: '/companies',
      testId: 'stat-companies'
    },
    {
      title: 'Placement Drives',
      value: stats?.total_drives || 0,
      icon: Calendar,
      color: 'purple',
      link: '/drives',
      testId: 'stat-drives'
    },
    {
      title: 'Total Offers',
      value: stats?.total_offers || 0,
      icon: FileText,
      color: 'orange',
      link: '/offers',
      testId: 'stat-offers'
    },
    {
      title: 'Placed Students',
      value: stats?.placed_students || 0,
      icon: Award,
      color: 'indigo',
      link: '/offers',
      testId: 'stat-placed'
    },
    {
      title: 'Placement Rate',
      value: `${stats?.placement_rate || 0}%`,
      icon: TrendingUp,
      color: 'pink',
      link: '/analytics',
      testId: 'stat-rate'
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-100',
      green: 'bg-green-50 text-green-600 border-green-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-100',
      orange: 'bg-orange-50 text-orange-600 border-orange-100',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      pink: 'bg-pink-50 text-pink-600 border-pink-100',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="dashboard-title">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of placement statistics and metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} to={stat.link}>
                <Card className={`hover:shadow-lg transition-shadow cursor-pointer border ${getColorClasses(stat.color)}`} data-testid={stat.testId}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <Icon size={20} className={`text-${stat.color}-600`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Additional Info */}
        <Card data-testid="additional-info-card">
          <CardHeader>
            <CardTitle>Average Package</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-blue-600">
                ₹{stats?.average_package || 0}
              </span>
              <span className="text-gray-600">LPA</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Average package across all placed students
            </p>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900">Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                View detailed analytics with interactive charts and insights.
              </p>
              <Link to="/analytics">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" data-testid="view-analytics-button">
                  View Analytics
                </button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardHeader>
              <CardTitle className="text-green-900">Manage Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Add, edit, or delete students, companies, drives, and offers.
              </p>
              <Link to="/students">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" data-testid="manage-students-button">
                  Manage Students
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
