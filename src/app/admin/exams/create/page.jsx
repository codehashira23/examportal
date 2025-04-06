"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateExam() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [examData, setExamData] = useState({
    title: '',
    subject: '',
    duration: 60,
    maxMarks: 100,
    instructions: '',
    rules: '',
    questions: []
  });
  
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', ''],
    correctOption: 0,
    marks: 1
  });

  const handleExamDataChange = (e) => {
    const { name, value } = e.target;
    setExamData({
      ...examData,
      [name]: name === 'duration' || name === 'maxMarks' ? Number(value) : value
    });
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question) {
      alert('Please provide a question');
      return;
    }

    // Filter out empty options
    const filledOptions = currentQuestion.options.filter(opt => opt.trim());
    
    if (filledOptions.length < 2) {
      alert('Please provide at least two options');
      return;
    }
    
    // Create a clean version of the question with only filled options
    const cleanQuestion = {
      ...currentQuestion,
      options: filledOptions,
      // Adjust correctOption index if needed
      correctOption: Math.min(currentQuestion.correctOption, filledOptions.length - 1)
    };

    setExamData(prev => ({
      ...prev,
      questions: [...prev.questions, cleanQuestion]
    }));

    // Reset current question
    setCurrentQuestion({
      question: '',
      options: ['', ''],
      correctOption: 0,
      marks: 1
    });
  };

  const handleRemoveQuestion = (index) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (examData.questions.length === 0) {
        // Check if current question form is filled but not added
        if (currentQuestion.question.trim()) {
          // Ask user if they want to add the current question before submitting
          if (window.confirm('You have a question in the form that has not been added. Would you like to add it before submitting?')) {
            handleAddQuestion();
            setLoading(false);
            return;
          }
        } else {
          alert('Please add at least one question');
          setLoading(false);
          return;
        }
      }

      // Calculate total marks from questions
      const totalMarks = examData.questions.reduce((sum, q) => sum + q.marks, 0);
      if (totalMarks !== examData.maxMarks) {
        alert(`Total marks from questions (${totalMarks}) does not match exam max marks (${examData.maxMarks})`);
        setLoading(false);
        return;
      }

      // Add admin identity info for the backend
      const examToSubmit = {
        ...examData,
        createdBy: "000000000000000000000000", // Use a string that MongoDB can convert to ObjectId
        questionSetId: 'default',
        scheduled: false,
        scheduledAt: null
      };

      console.log("Submitting exam data:", JSON.stringify(examToSubmit, null, 2));

      const response = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(examToSubmit)
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      // Try to parse JSON response or use text response if parsing fails
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Error parsing JSON response:", e);
        data = { error: "Invalid JSON response: " + responseText };
      }

      console.log("Parsed response data:", data);

      if (response.ok) {
        alert('Exam created successfully!');
        router.push('/admin/exams');
      } else {
        let errorMessage = data.error || data.message || 'Failed to create exam';
        if (data.details) {
          errorMessage += `: ${JSON.stringify(data.details)}`;
        }
        console.error('Error response data:', data);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      setError('Error: ' + (error.message || 'Failed to create exam. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Exam</h1>
        <Link 
          href="/admin/exams"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Exams
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1">Title</label>
            <input 
              type="text" 
              name="title"
              className="w-full border rounded p-2"
              value={examData.title}
              onChange={handleExamDataChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Subject</label>
            <input 
              type="text" 
              name="subject"
              className="w-full border rounded p-2"
              value={examData.subject}
              onChange={handleExamDataChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Duration (minutes)</label>
            <input 
              type="number" 
              name="duration"
              className="w-full border rounded p-2"
              value={examData.duration}
              onChange={handleExamDataChange}
              min="1"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Max Marks</label>
            <input 
              type="number" 
              name="maxMarks"
              className="w-full border rounded p-2"
              value={examData.maxMarks}
              onChange={handleExamDataChange}
              min="1"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1">Instructions</label>
            <textarea 
              name="instructions"
              className="w-full border rounded p-2"
              value={examData.instructions}
              onChange={handleExamDataChange}
              rows={3}
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1">Rules (Optional)</label>
            <textarea 
              name="rules"
              className="w-full border rounded p-2"
              value={examData.rules}
              onChange={handleExamDataChange}
              rows={3}
            />
          </div>
        </div>

        {/* Questions Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Add Questions</h3>
          
          {/* Current Question Form - Moved outside the main form */}
        </div>
          
        {/* Existing Questions */}
        <div className="space-y-4 mb-6">
          {examData.questions.map((question, index) => (
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

        <div className="flex justify-end space-x-2 mt-6">
          <Link 
            href="/admin/exams"
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={loading}
            className={`${loading ? 'bg-green-400' : 'bg-green-500 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded`}
          >
            {loading ? 'Creating...' : 'Create Exam'}
          </button>
        </div>
      </form>
      
      {/* Question Form - Separated from main form */}
      <div className="bg-gray-50 p-4 rounded mb-4 mt-4">
        <div className="mb-4">
          <label className="block mb-1">Question</label>
          <textarea
            className="w-full border rounded p-2"
            value={currentQuestion.question}
            onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
            rows={2}
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Options</label>
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
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
              />
              {index >= 2 && (
                <button
                  type="button"
                  onClick={() => {
                    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
                    setCurrentQuestion({...currentQuestion, options: newOptions});
                  }}
                  className="text-red-500"
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
              className="text-blue-500"
            >
              Add Option
            </button>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Marks</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={currentQuestion.marks}
            onChange={(e) => setCurrentQuestion({...currentQuestion, marks: Number(e.target.value)})}
            min="1"
          />
        </div>

        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Question
        </button>
      </div>
    </div>
  );
} 