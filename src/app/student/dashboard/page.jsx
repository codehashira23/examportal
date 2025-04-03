"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StudentDashboard() {
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchRecentExams();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      } else {
        setError('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data');
    }
  };

  const fetchRecentExams = async () => {
    try {
      const response = await fetch('/api/student/exams/recent');
      const data = await response.json();
      if (response.ok) {
        // Process exam data to determine pass/fail status
        const processedExams = data.map(exam => {
          // Extract score and max marks (ensure they're numbers)
          const score = Number(exam.score) || 0;
          const maxMarks = Number(exam.maxMarks) || 100;
          
          // Determine pass/fail status (typically 40% is passing, but can adjust)
          const passingThreshold = 0.4; // 40% passing threshold
          const isPassed = score >= (maxMarks * passingThreshold);
          
          return {
            ...exam,
            score: score, // Keep the original score
            maxMarks: maxMarks, // Keep the max marks
            status: isPassed ? 'Passed' : 'Failed'
          };
        });
        
        setRecentExams(processedExams);
        console.log('Processed exam data:', processedExams);
      } else {
        setError(data.error || 'Failed to fetch recent exams');
      }
    } catch (error) {
      console.error('Error fetching recent exams:', error);
      setError('Failed to fetch recent exams');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.name || 'Student'}!
        </h1>
        <p className="text-gray-600">
          You have attempted {recentExams.length} exams so far.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/student/exams" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-6 shadow-md transition duration-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📘</span>
            <div>
              <h3 className="font-semibold">Take an Exam</h3>
              <p className="text-sm text-blue-100">Start a new exam</p>
            </div>
          </div>
        </Link>

        <Link href="/student/results" className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-6 shadow-md transition duration-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📜</span>
            <div>
              <h3 className="font-semibold">View Results</h3>
              <p className="text-sm text-green-100">Check your exam scores</p>
            </div>
          </div>
        </Link>

        <Link href="/student/profile" className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-6 shadow-md transition duration-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">👤</span>
            <div>
              <h3 className="font-semibold">View Profile</h3>
              <p className="text-sm text-purple-100">Manage your account</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Exams Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently Attempted Exams</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {recentExams.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No exams attempted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentExams.map((exam) => (
                  <tr key={exam.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{exam.examName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{exam.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{exam.dateAttempted}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exam.score}/{exam.maxMarks}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        exam.status === 'Passed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {exam.status === 'Passed' ? '✅ Passed' : '❌ Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
