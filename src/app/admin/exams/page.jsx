// app/admin/exams/page.jsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ManageExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    subject: '',
    duration: 60,
    instructions: '',
    rules: '',
    maxMarks: 100,
    questions: [], // Array to store MCQ questions
    createdBy: '65f8a7b2c4e8f3a1b2c3d4e5', // Replace with actual user ID from your auth system
    questionSetId: 'SET-' + Date.now(), // Generate a unique question set ID
  });

  // State for managing questions in the form
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctOption: 0,
    marks: 1,
  });

  useEffect(() => {
    // Fetch exams when component mounts
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      // Replace with actual API endpoint
      const response = await fetch('/api/admin/exams');
      const data = await response.json();
      setExams(data.exams || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt)) {
      alert('Please fill in all question fields');
      return;
    }

    setNewExam(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion }]
    }));

    // Reset current question
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctOption: 0,
      marks: 1,
    });
  };

  const handleRemoveQuestion = (index) => {
    setNewExam(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      if (newExam.questions.length === 0) {
        alert('Please add at least one question');
        return;
      }

      // Calculate total marks from questions
      const totalMarks = newExam.questions.reduce((sum, q) => sum + q.marks, 0);
      if (totalMarks !== newExam.maxMarks) {
        alert(`Total marks from questions (${totalMarks}) does not match exam max marks (${newExam.maxMarks})`);
        return;
      }

      console.log('Sending exam data:', newExam);

      const response = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExam),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNewExam({
          title: '',
          subject: '',
          duration: 60,
          instructions: '',
          rules: '',
          maxMarks: 100,
          questions: [],
          createdBy: '65f8a7b2c4e8f3a1b2c3d4e5', // Reset with default values
          questionSetId: 'SET-' + Date.now(),
        });
        setShowCreateModal(false);
        fetchExams();
      } else {
        console.error('Error response:', data);
        alert(`Failed to create exam: ${data.error}\n${data.details ? JSON.stringify(data.details, null, 2) : ''}`);
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Failed to create exam. Please try again.');
    }
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        const response = await fetch(`/api/admin/exams/${examId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchExams(); // Refresh list
        } else {
          const error = await response.json();
          alert('Failed to delete exam: ' + error.message);
        }
      } catch (error) {
        console.error('Error deleting exam:', error);
        alert('Failed to delete exam. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Exams</h1>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Exam
        </button>
      </div>

      {loading ? (
        <p>Loading exams...</p>
      ) : exams.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Subject</th>
                <th className="px-4 py-2 border">Duration (mins)</th>
                <th className="px-4 py-2 border">Questions</th>
                <th className="px-4 py-2 border">Max Marks</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam._id}>
                  <td className="px-4 py-2 border">{exam.title}</td>
                  <td className="px-4 py-2 border">{exam.subject}</td>
                  <td className="px-4 py-2 border">{exam.duration}</td>
                  <td className="px-4 py-2 border">{exam.questions?.length || 0}</td>
                  <td className="px-4 py-2 border">{exam.maxMarks}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex space-x-2">
                      <Link href={`/admin/exams/edit/${exam._id}`}>
                        <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded">
                          Edit
                        </button>
                      </Link>
                      <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
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
      ) : (
        <div className="bg-gray-100 p-4 rounded">
          <p>No exams found. Create your first exam!</p>
        </div>
      )}

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Exam</h2>
            <form onSubmit={handleCreateExam}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-1">Title</label>
                  <input 
                    type="text" 
                    className="w-full border rounded p-2"
                    value={newExam.title}
                    onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Subject</label>
                  <input 
                    type="text" 
                    className="w-full border rounded p-2"
                    value={newExam.subject}
                    onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Duration (minutes)</label>
                  <input 
                    type="number" 
                    className="w-full border rounded p-2"
                    value={newExam.duration}
                    onChange={(e) => setNewExam({...newExam, duration: Number(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Max Marks</label>
                  <input 
                    type="number" 
                    className="w-full border rounded p-2"
                    value={newExam.maxMarks}
                    onChange={(e) => setNewExam({...newExam, maxMarks: Number(e.target.value)})}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1">Instructions</label>
                  <textarea 
                    className="w-full border rounded p-2"
                    value={newExam.instructions}
                    onChange={(e) => setNewExam({...newExam, instructions: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1">Rules (Optional)</label>
                  <textarea 
                    className="w-full border rounded p-2"
                    value={newExam.rules}
                    onChange={(e) => setNewExam({...newExam, rules: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Add Questions</h3>
                
                {/* Current Question Form */}
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <div className="mb-4">
                    <label className="block mb-1">Question</label>
                    <textarea
                      className="w-full border rounded p-2"
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                      rows={2}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-1">Options</label>
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={currentQuestion.correctOption === index}
                          onChange={() => setCurrentQuestion({...currentQuestion, correctOption: index})}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          className="flex-1 border rounded p-2"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options];
                            newOptions[index] = e.target.value;
                            setCurrentQuestion({...currentQuestion, options: newOptions});
                          }}
                          placeholder={`Option ${index + 1}`}
                          required
                        />
                        {index >= 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = currentQuestion.options.filter((_, i) => i !== index);
                              setCurrentQuestion({...currentQuestion, options: newOptions});
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    {currentQuestion.options.length < 4 && (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentQuestion({
                            ...currentQuestion,
                            options: [...currentQuestion.options, '']
                          });
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                      >
                        Add Option
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1">Marks for this question</label>
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                      value={currentQuestion.marks}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, marks: Number(e.target.value)})}
                      min="1"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Add Question
                  </button>
                </div>

                {/* List of Added Questions */}
                <div className="space-y-4">
                  {newExam.questions.map((question, index) => (
                    <div key={index} className="bg-white border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold">Question {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="mb-2">{question.question}</p>
                      <div className="ml-4">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={question.correctOption === optIndex}
                              disabled
                              className="mr-2"
                            />
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Marks: {question.marks}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button 
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}