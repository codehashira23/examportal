"use client";

import { useState, useEffect } from "react";

export default function ManageExams() {
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({ title: "", subject: "", duration: "", questions: [] });

  async function fetchExams() {
    const res = await fetch("/api/admin/exams");
    const data = await res.json();
    setExams(data);
  }

  async function createExam() {
    const res = await fetch("/api/admin/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExam),
    });

    if (res.ok) {
      alert("Exam created!");
      fetchExams();
    } else {
      alert("Error creating exam.");
    }
  }

  async function deleteExam(id) {
    const res = await fetch("/api/admin/exams", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      alert("Exam deleted!");
      fetchExams();
    } else {
      alert("Error deleting exam.");
    }
  }

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Manage Exams</h1>

      <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold">Create Exam</h2>
        <input
          type="text"
          placeholder="Title"
          value={newExam.title}
          onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Subject"
          value={newExam.subject}
          onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Duration (mins)"
          value={newExam.duration}
          onChange={(e) => setNewExam({ ...newExam, duration: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <button onClick={createExam} className="bg-blue-600 text-white px-4 py-2 rounded-md">Create Exam</button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">All Exams</h2>
        <ul className="list-disc ml-6 mt-2">
          {exams.map((exam) => (
            <li key={exam._id} className="flex justify-between items-center p-2 bg-gray-200 rounded-md mb-2">
              {exam.title} ({exam.subject})
              <button onClick={() => deleteExam(exam._id)} className="bg-red-600 text-white px-2 py-1 rounded-md">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
