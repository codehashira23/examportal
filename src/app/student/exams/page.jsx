"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AvailableExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedInstructions, setExpandedInstructions] = useState({});

  useEffect(() => {
    fetchExams();
    
    // Refresh exams every 30 seconds to check for newly scheduled exams
    const interval = setInterval(fetchExams, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      console.log("Fetching available exams for student...");
      const response = await fetch('/api/student/exams', {
        // Add cache control to prevent caching
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        console.log(`Received ${data.length} exams from API`);
        setExams(data);
        setError('');
      } else {
        console.error("Failed to fetch exams:", data.error);
        setError(data.error || 'Failed to fetch exams');
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      setError('Failed to fetch exams. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleInstructions = (examId) => {
    setExpandedInstructions(prev => ({
      ...prev,
      [examId]: !prev[examId]
    }));
  };

  const handleRefresh = () => {
    fetchExams();
  };

  if (loading && exams.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Available Exams</h1>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Exams'}
          {loading && (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {exams.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No exams available at the moment.</p>
          <p className="text-gray-400 mt-2">Check back later or ask your administrator to schedule exams.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{exam.title}</h2>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">
                    <span className="font-medium">Subject:</span> {exam.subject}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Duration:</span> {exam.duration} minutes
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Max Marks:</span> {exam.maxMarks}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Questions:</span> {exam.questionCount || 'N/A'}
                  </p>
                </div>

                <div className="mb-4">
                  <button
                    onClick={() => toggleInstructions(exam.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {expandedInstructions[exam.id] ? 'Hide Instructions' : 'Show Instructions'}
                  </button>
                  {expandedInstructions[exam.id] && (
                    <div className="mt-2 text-gray-600 text-sm bg-gray-50 p-3 rounded">
                      {exam.instructions || 'No instructions provided.'}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  {exam.attempted ? (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      Already Attempted
                    </span>
                  ) : (
                    <Link
                      href={`/student/exam/${exam.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
                    >
                      Start Exam
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 