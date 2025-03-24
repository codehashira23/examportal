"use client";

import { useState, useEffect } from "react";
import { FaBook, FaUsers, FaChartLine, FaClipboardList, FaCog } from "react-icons/fa";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalExams: 0, totalStudents: 0, avgScore: 0 });

  async function fetchStats() {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  }

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <DashboardCard title="Total Exams" value={stats.totalExams} icon={<FaClipboardList />} />
        <DashboardCard title="Total Students" value={stats.totalStudents} icon={<FaUsers />} />
        <DashboardCard title="Avg Score Per Subject" value={`${stats.avgScore}%`} icon={<FaChartLine />} />
      </div>

      {/* Quick Links Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <QuickLinkCard title="Manage Exams" href="/admin/exams" icon={<FaBook />} />
          <QuickLinkCard title="Monitor Activity" href="/admin/monitoring" icon={<FaChartLine />} />
          <QuickLinkCard title="Manage Users" href="/admin/users" icon={<FaUsers />} />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 flex items-center gap-4">
      <div className="text-blue-600 text-4xl">{icon}</div>
      <div>
        <h2 className="text-xl font-medium text-gray-700">{title}</h2>
        <p className="text-4xl font-semibold text-blue-600 mt-2">{value}</p>
      </div>
    </div>
  );
}

function QuickLinkCard({ title, href, icon }) {
  return (
    <a href={href} className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 flex items-center gap-4 hover:bg-gray-50 transition">
      <div className="text-blue-600 text-3xl">{icon}</div>
      <h2 className="text-lg font-medium text-gray-700">{title}</h2>
    </a>
  );
}
