"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Users, 
  BarChart2, 
  FileText,
  User,
  Monitor,
  Settings
} from 'lucide-react';

// Initial empty state
const initialData = {
  totalExams: 0,
  totalStudents: 0,
  averageScores: {},
  recentExams: []
};

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Key Metrics Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalExams}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
            <BarChart2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.overallAverage ? `${dashboardData.overallAverage.toFixed(1)}%` : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {dashboardData.averageScores && Object.keys(dashboardData.averageScores).length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Average Scores by Subject</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(dashboardData.averageScores).map(([subject, score]) => (
              <Card key={subject}>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-500">{subject}</p>
                  <h3 className="text-xl font-bold">{score.toFixed(1)}%</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
      
      <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Link href="/admin/exams">
          <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
            <CardContent className="p-4 flex items-center space-x-4">
              <BookOpen className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="font-medium">Manage Exams</h3>
                <p className="text-sm text-gray-500">Create and manage exams</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/results">
          <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
            <CardContent className="p-4 flex items-center space-x-4">
              <FileText className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="font-medium">Student Performance</h3>
                <p className="text-sm text-gray-500">View student results</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/monitoring">
          <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
            <CardContent className="p-4 flex items-center space-x-4">
              <Monitor className="h-6 w-6 text-purple-500" />
              <div>
                <h3 className="font-medium">Monitor Logs</h3>
                <p className="text-sm text-gray-500">Track exam activities</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/users">
          <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
            <CardContent className="p-4 flex items-center space-x-4">
              <User className="h-6 w-6 text-orange-500" />
              <div>
                <h3 className="font-medium">Manage Users</h3>
                <p className="text-sm text-gray-500">Manage student accounts</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}