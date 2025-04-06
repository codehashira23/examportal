// app/admin/exams/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ManageExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState({});
  const router = useRouter();

  const fetchExams = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching exams...');
      const response = await fetch('/api/admin/exams');
      if (!response.ok) {
        throw new Error(`Failed to fetch exams: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Check if data has the expected structure
      const examsList = data.exams || [];
      console.log('Exams list from API:', examsList);
      
      // Validate each exam has scheduled property
      const validatedExams = examsList.map(exam => {
        if (typeof exam.scheduled !== 'boolean') {
          console.warn(`Exam ${exam._id} has invalid scheduled value:`, exam.scheduled);
          // Ensure scheduled is a boolean
          return {...exam, scheduled: Boolean(exam.scheduled)};
        }
        return exam;
      });
      
      setExams(validatedExams);
      console.log('Exams with validated scheduled status:', validatedExams);
    } catch (err) {
      console.error('Error fetching exams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleScheduleExam = async (examId, currentStatus) => {
    // Set loading state for this specific exam
    setScheduleLoading(prev => ({ ...prev, [examId]: true }));
    
    try {
      const newStatus = !currentStatus;
      console.log(`Scheduling exam ${examId} to ${newStatus}`);
      
      const response = await fetch(`/api/admin/exams/${examId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduled: newStatus }),
      });

      console.log('Schedule response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update exam status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Schedule response data:', data);

      // Update the exam in the local state
      setExams(prevExams => 
        prevExams.map(exam => 
          exam._id === examId 
            ? { 
                ...exam, 
                scheduled: newStatus, 
                scheduledAt: newStatus ? new Date().toISOString() : null
              }
            : exam
        )
      );
      
      alert(`Exam ${newStatus ? 'scheduled' : 'unscheduled'} successfully`);
    } catch (err) {
      console.error('Error scheduling exam:', err);
      alert(`Error scheduling exam: ${err.message}`);
    } finally {
      // Clear loading state for this exam
      setScheduleLoading(prev => ({ ...prev, [examId]: false }));
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/exams/${examId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete exam');
      }
      
      setExams(exams.filter(exam => exam._id !== examId));
      alert('Exam deleted successfully');
    } catch (err) {
      console.error('Error deleting exam:', err);
      alert(`Error deleting exam: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Exams</h1>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push('/admin/exams/create')}
        >
          Create New Exam
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <button onClick={fetchExams} className="ml-4 underline">
            Retry
          </button>
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded">
          <p>No exams found. Create your first exam!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Subject</th>
                <th className="px-4 py-2 border">Duration (mins)</th>
                <th className="px-4 py-2 border">Questions</th>
                <th className="px-4 py-2 border">Max Marks</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam._id} className={exam.scheduled ? "bg-blue-50" : ""}>
                  <td className="px-4 py-2 border">{exam.title}</td>
                  <td className="px-4 py-2 border">{exam.subject}</td>
                  <td className="px-4 py-2 border">{exam.duration}</td>
                  <td className="px-4 py-2 border">{exam.questions?.length || 0}</td>
                  <td className="px-4 py-2 border">{exam.maxMarks}</td>
                  <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${exam.scheduled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {exam.scheduled ? 'Scheduled' : 'Not Scheduled'}
                    </span>
                    {exam.scheduledAt && (
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(exam.scheduledAt).toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex space-x-2">
                      <button
                        className={`px-2 py-1 rounded text-white text-xs font-bold ${
                          scheduleLoading[exam._id] 
                            ? 'bg-gray-400' 
                            : exam.scheduled 
                              ? 'bg-orange-500 hover:bg-orange-700' 
                              : 'bg-green-500 hover:bg-green-700'
                        }`}
                        onClick={() => handleScheduleExam(exam._id, exam.scheduled)}
                        disabled={scheduleLoading[exam._id]}
                      >
                        {scheduleLoading[exam._id] ? (
                          <span>Loading...</span>
                        ) : (
                          <span>{exam.scheduled ? 'Unschedule' : 'Schedule'}</span>
                        )}
                      </button>
                      <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                        onClick={() => handleDeleteExam(exam._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}