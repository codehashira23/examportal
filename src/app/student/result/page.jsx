"use client";

import { useState, useEffect } from "react";

export default function StudentResults() {
  const [results, setResults] = useState([]);

  async function fetchResults() {
    const res = await fetch("/api/student/results");
    const data = await res.json();
    setResults(data);
  }

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Exam Results</h1>
      {results.length === 0 ? (
        <p>No results available.</p>
      ) : (
        <ul className="list-disc ml-6 mt-2">
          {results.map((result, index) => (
            <li key={index}>
              {result.examTitle} ({result.subject}) - <strong>{result.score}%</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
