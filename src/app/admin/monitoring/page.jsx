"use client";

import { useState, useEffect } from "react";

export default function Monitoring() {
  const [logs, setLogs] = useState([]);

  async function fetchLogs() {
    const res = await fetch("/api/admin/monitoring");
    const data = await res.json();
    setLogs(data);
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Exam Monitoring Logs</h1>
      {
        logs.length === 0 ? (<p>No suspicious activities detected.</p>) : 
        (
            <table className="w-full border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Student</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Exam</th>
                <th className="border border-gray-300 px-4 py-2">Activity</th>
                <th className="border border-gray-300 px-4 py-2">Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {logs.map((log, index) => (
                <tr key={index} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{log.student}</td>
                    <td className="border border-gray-300 px-4 py-2">{log.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{log.examTitle}</td>
                    <td className="border border-gray-300 px-4 py-2 text-red-600">{log.activityType}</td>
                    <td className="border border-gray-300 px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
                ))}
            </tbody>
            </table>
        )
      }
    </div>
  );
}
