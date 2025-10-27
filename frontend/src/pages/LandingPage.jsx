import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Building2, TrendingUp, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <BarChart3 size={40} className="text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" data-testid="hero-title">
              PlacementIQ
            </h1>
            <p className="text-2xl md:text-3xl text-blue-600 font-semibold mb-4">
              Intelligent College Placement Management System
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" data-testid="hero-subtitle">
              Empowering campuses with data-driven placement insights and analytics.
              Track students, companies, drives, and placement analytics with real-time insights.
            </p>
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg transition-all hover:shadow-xl"
                data-testid="get-started-button"
              >
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Campus Placement Management
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-100" data-testid="feature-card-students">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Student Management</h3>
              <p className="text-gray-600">
                Comprehensive student profiles with academic records, placement status, and performance tracking.
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-xl border border-green-100" data-testid="feature-card-companies">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Company Database</h3>
              <p className="text-gray-600">
                Maintain detailed company profiles with package information, domains, and recruitment history.
              </p>
            </div>

            <div className="p-6 bg-purple-50 rounded-xl border border-purple-100" data-testid="feature-card-analytics">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Advanced Analytics</h3>
              <p className="text-gray-600">
                Real-time placement analytics with interactive charts, trends, and performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Placement Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join leading institutions using data-driven insights for placement success.
          </p>
          <Link to="/dashboard">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-lg shadow-lg"
              data-testid="cta-button"
            >
              Explore Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
