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
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/student/exams');
      const data = await response.json();
      if (response.ok) {
        setExams(data);
      } else {
        setError(data.error || 'Failed to fetch exams');
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      setError('Failed to fetch exams');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Exams</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {exams.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No exams available at the moment.</p>
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
                </div>

                <div className="mb-4">
                  <button
                    onClick={() => toggleInstructions(exam.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {expandedInstructions[exam.id] ? 'Hide Instructions' : 'Show Instructions'}
                  </button>
                  {expandedInstructions[exam.id] && (
                    <p className="mt-2 text-gray-600 text-sm">
                      {exam.instructions || 'No instructions provided.'}
                    </p>
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