"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditExam() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctOption: 0,
    marks: 1,
  });

  useEffect(() => {
    if (id) {
      fetchExam();
    }
  }, [id]);

  const fetchExam = async () => {
    try {
      const response = await fetch(`/api/admin/exams/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch exam');
      }
      const data = await response.json();
      setExam(data.exam);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exam:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt)) {
      alert('Please fill in all question fields');
      return;
    }

    setExam(prev => ({
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
    setExam(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();
    try {
      if (exam.questions.length === 0) {
        alert('Please add at least one question');
        return;
      }

      // Calculate total marks from questions
      const totalMarks = exam.questions.reduce((sum, q) => sum + q.marks, 0);
      if (totalMarks !== exam.maxMarks) {
        alert(`Total marks from questions (${totalMarks}) does not match exam max marks (${exam.maxMarks})`);
        return;
      }

      const response = await fetch(`/api/admin/exams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exam),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        router.push('/admin/exams');
      } else {
        console.error('Error response:', data);
        alert(`Failed to update exam: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      alert('Failed to update exam. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!exam) {
    return <div className="p-4">Exam not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Exam</h1>
        <button 
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push('/admin/exams')}
        >
          Back to Exams
        </button>
      </div>

      <form onSubmit={handleUpdateExam} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1">Title</label>
            <input 
              type="text" 
              className="w-full border rounded p-2"
              value={exam.title}
              onChange={(e) => setExam({...exam, title: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Subject</label>
            <input 
              type="text" 
              className="w-full border rounded p-2"
              value={exam.subject}
              onChange={(e) => setExam({...exam, subject: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Duration (minutes)</label>
            <input 
              type="number" 
              className="w-full border rounded p-2"
              value={exam.duration}
              onChange={(e) => setExam({...exam, duration: Number(e.target.value)})}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Max Marks</label>
            <input 
              type="number" 
              className="w-full border rounded p-2"
              value={exam.maxMarks}
              onChange={(e) => setExam({...exam, maxMarks: Number(e.target.value)})}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1">Instructions</label>
            <textarea 
              className="w-full border rounded p-2"
              value={exam.instructions}
              onChange={(e) => setExam({...exam, instructions: e.target.value})}
              rows={3}
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1">Rules (Optional)</label>
            <textarea 
              className="w-full border rounded p-2"
              value={exam.rules}
              onChange={(e) => setExam({...exam, rules: e.target.value})}
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
                required
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

          {/* Existing Questions */}
          <div className="space-y-4">
            {exam.questions.map((question, index) => (
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
            onClick={() => router.push('/admin/exams')}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Update Exam
          </button>
        </div>
      </form>
    </div>
  );
} 