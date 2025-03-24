export default function AvailableExams() {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Available Exams</h1>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Upcoming Exams</h2>
          <ul className="list-disc ml-6 mt-2">
            <li>Math Exam - <button className="text-blue-600 underline">Start</button></li>
            <li>Physics Exam - <button className="text-blue-600 underline">Start</button></li>
          </ul>
        </div>
      </div>
    );
  }
  