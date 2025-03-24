"use client";

import { useState, useEffect } from "react";

export default function StudentPerformance() {
  const [performance, setPerformance] = useState([]);

  async function fetchPerformance() {
    const res = await fetch("/api/admin/student-performance");
    const data = await res.json();
    setPerformance(data);
  }

  useEffect(() => {
    fetchPerformance();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Student Performance</h1>
      {performance.length === 0 ? (
        <p>No performance data available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Student</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Exam</th>
              <th className="border border-gray-300 px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {performance.map((p, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{p.student}</td>
                <td className="border border-gray-300 px-4 py-2">{p.email}</td>
                <td className="border border-gray-300 px-4 py-2">{p.examTitle}</td>
                <td className="border border-gray-300 px-4 py-2">{p.score}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
