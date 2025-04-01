"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function TakeExam({ params }) {
  const examId = use(params).examId;
  const router = useRouter();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [lastFocusTime, setLastFocusTime] = useState(Date.now());

  useEffect(() => {
    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (exam) {
      setTimeLeft(exam.duration * 60);
    }
  }, [exam]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Add tab switching detection
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // Tab/window was switched away
        setLastFocusTime(Date.now());
        setTabSwitches(prev => prev + 1);

        try {
          console.log('Logging tab switch for exam:', examId);
          // Log the tab switch
          const response = await fetch('/api/student/exam/monitor', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              examId: examId,
              activityType: 'tab-switch'
            })
          });

          const data = await response.json();
          
          if (!response.ok) {
            console.error('Failed to log tab switch:', data);
          } else {
            console.log('Successfully logged tab switch:', data);
          }
        } catch (error) {
          console.error('Error logging tab switch:', error);
        }
      } else {
        // Tab/window was focused back
        const timeAway = Date.now() - lastFocusTime;
        if (timeAway > 1000) { // Only count if away for more than 1 second
          console.log(`Tab was switched for ${timeAway}ms`);
        }
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [examId, lastFocusTime]);

  const fetchExam = async () => {
    try {
      const response = await fetch(`/api/student/exam/${examId}`);
      const data = await response.json();
      
      if (response.ok) {
        setExam(data);
        const initialAnswers = {};
        data.questions.forEach(q => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);
      } else {
        setError(data.error || 'Failed to fetch exam');
      }
    } catch (error) {
      setError('Failed to fetch exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    console.log('Saving answer:', { questionId, value });
    setAnswers(prev => ({
      ...prev,
      [questionId]: value.toString() // Ensure value is string
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Validate answers before submission
      if (!answers || Object.keys(answers).length === 0) {
        throw new Error('Please select at least one answer before submitting');
      }

      // Log pre-submission state
      console.log('Pre-submission state:', {
        examId: examId,
        answersCount: Object.keys(answers).length,
        answers: answers
      });

      // Prepare submission data
      const submissionData = {
        examId: examId,
        answers: Object.fromEntries(
          Object.entries(answers).map(([key, value]) => [
            key,
            value.toString()
          ])
        )
      };

      console.log('Attempting submission with data:', submissionData);

      // Make the API call
      const response = await fetch('/api/student/exam/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submissionData)
      });

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      // Always try to get the response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Try to parse as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Server response was not valid JSON: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(
          data.error || 
          data.message || 
          `Server error (${response.status}): ${JSON.stringify(data)}`
        );
      }

      // Success case
      console.log('Submission successful:', data);
      alert(`Exam submitted successfully!\n\n` +
            `Exam: ${data.result.examTitle}\n` +
            `Subject: ${data.result.subject}\n` +
            `Score: ${data.result.score}/${data.result.totalMarks}\n` +
            `Percentage: ${data.result.percentage}%\n` +
            `Status: ${data.result.status.toUpperCase()}\n\n` +
            `Questions Attempted: ${data.result.answeredQuestions}/${data.result.totalQuestions}`);
      
      router.push('/student/results');

    } catch (error) {
      // Log the complete error
      console.error('Complete error object:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        examId: examId,
        answers: answers
      });

      // Set a user-friendly error message
      const errorMessage = error.message || 'An unexpected error occurred during submission';
      setError(errorMessage);
      alert(`Failed to submit exam: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
            <p className="text-gray-600">{exam.subject}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xl font-semibold text-red-600 mb-2">
              Time Left: {formatTime(timeLeft)}
            </div>
            {tabSwitches > 0 && (
              <div className="text-sm text-red-600">
                Tab Switches: {tabSwitches}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">
            Question {currentQuestion + 1} of {exam.questions.length}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(exam.questions.length - 1, prev + 1))}
              disabled={currentQuestion === exam.questions.length - 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg mb-4">{exam.questions[currentQuestion].question}</p>
          
          <div className="space-y-3">
            {exam.questions[currentQuestion].options.map((option, index) => (
              <label 
                key={index} 
                className={`flex items-center space-x-3 p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                  answers[exam.questions[currentQuestion].id] === index.toString() 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${exam.questions[currentQuestion].id}`}
                  value={index}
                  checked={answers[exam.questions[currentQuestion].id] === index.toString()}
                  onChange={(e) => handleAnswerChange(exam.questions[currentQuestion].id, e.target.value)}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700 text-lg">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
            <p className="mb-4">Are you sure you want to submit your exam? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add a display for current answers (for debugging) */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3>Debug Info:</h3>
        <pre className="text-sm">
          {JSON.stringify({
            examId,
            selectedAnswers: answers,
            questionCount: exam?.questions?.length || 0
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
