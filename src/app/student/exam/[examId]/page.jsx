"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function TakeExam() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [isTabSwitched, setIsTabSwitched] = useState(false);

  async function fetchExam() {
    const res = await fetch(`/api/exams?id=${examId}`);
    const data = await res.json();
    setExam(data);
  }

  useEffect(() => {
    fetchExam();

    function handleVisibilityChange() {
      if (document.hidden) {
        setIsTabSwitched(true);
        logSuspiciousActivity("tab-switch");
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  async function logSuspiciousActivity(type) {
    await fetch("/api/student/log-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examId, activityType: type }),
    });
  }

  if (!exam) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold">{exam.title}</h1>
      {isTabSwitched && <p className="text-red-600 font-bold">⚠️ Tab Switching Detected!</p>}
      {exam.questions.map((q, index) => (
        <div key={index} className="mt-4 p-4 bg-white shadow-md rounded-lg">
          <p className="font-semibold">{q.questionText}</p>
          {q.options.map((option) => (
            <div key={option}>
              <input type="radio" name={`question-${index}`} value={option} />
              <label className="ml-2">{option}</label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
