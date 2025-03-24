"use client";

import { useState, useEffect } from "react";

export default function StudentDashboard() {
  const [recentExams, setRecentExams] = useState([]);

  async function fetchRecentExams() {
    const res = await fetch("/api/student/recent-exams");
    const data = await res.json();
    setRecentExams(data);
  }

  useEffect(() => {
    fetchRecentExams();
    const interval = setInterval(fetchRecentExams, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold">Recently Attempted Exams</h2>
        <ul className="list-disc ml-6 mt-2">
          {recentExams.map((exam, index) => (
            <li key={index}>{exam.subject} - {exam.score}%</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
