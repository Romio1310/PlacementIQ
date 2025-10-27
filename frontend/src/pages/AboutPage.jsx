import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Mail, Code, Database, BarChart3, Shield } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const AboutPage = () => {
  const features = [
    'Comprehensive student and company data management',
    'Real-time placement tracking and analytics',
    'Interactive charts and visualizations',
    'Secure JWT-based authentication',
    'RESTful API architecture',
    'Responsive mobile-friendly design',
    'Department-wise placement insights',
    'Company-wise package analysis',
  ];

  const techStack = [
    { name: 'FastAPI', category: 'Backend', icon: Code },
    { name: 'React', category: 'Frontend', icon: Code },
    { name: 'MongoDB', category: 'Database', icon: Database },
    { name: 'Chart.js', category: 'Visualization', icon: BarChart3 },
    { name: 'Tailwind CSS', category: 'Styling', icon: Code },
    { name: 'JWT', category: 'Authentication', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="about-title">About PlacementIQ</h1>
          <p className="text-gray-600 mt-2">Smart, Data-Driven College Placement Management System</p>
        </div>

        {/* Overview Section */}
        <Card className="mb-8" data-testid="overview-card">
          <CardHeader>
            <CardTitle>📘 Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              PlacementIQ is an intelligent college placement management system designed to streamline and optimize
              the campus recruitment process. Built with modern web technologies, it provides institutions with
              powerful tools to manage student data, track company interactions, organize placement drives, and
              gain valuable insights through advanced analytics.
            </p>
            <p className="text-gray-700">
              The system helps placement coordinators make data-driven decisions by providing real-time statistics,
              interactive visualizations, and comprehensive reporting capabilities. From tracking individual student
              progress to analyzing department-wise placement trends, PlacementIQ offers a complete solution for
              campus placement management.
            </p>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="mb-8" data-testid="features-card">
          <CardHeader>
            <CardTitle>✨ Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack Section */}
        <Card className="mb-8" data-testid="tech-stack-card">
          <CardHeader>
            <CardTitle>🧠 Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {techStack.map((tech) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={tech.name}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <Icon size={20} className="text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{tech.name}</div>
                      <div className="text-xs text-gray-600">{tech.category}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Purpose Section */}
        <Card className="mb-8" data-testid="purpose-card">
          <CardHeader>
            <CardTitle>🎯 Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              PlacementIQ was built to address the challenges faced by college placement cells in managing large
              volumes of student data, coordinating with multiple companies, and providing transparent placement
              statistics. The system aims to:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-gray-700">Centralize all placement-related data in one secure platform</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-gray-700">Provide real-time insights and analytics for better decision-making</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-gray-700">Streamline the recruitment process for both students and recruiters</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-gray-700">Enable data-driven strategies to improve placement outcomes</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Author Section */}
        <Card data-testid="author-card">
          <CardHeader>
            <CardTitle>👤 Developer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Anwesha Kar</h3>
                <p className="text-gray-600 mt-1">
                  Full Stack Developer | Data Analytics Enthusiast
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  data-testid="github-link"
                >
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  data-testid="linkedin-link"
                >
                  <Linkedin size={18} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="mailto:contact@example.com"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  data-testid="email-link"
                >
                  <Mail size={18} />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
