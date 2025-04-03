import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Navbar({ role }) {
  return (
    <nav className="bg-green-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Home Link */}
        <Link href="/">
          <span className="text-2xl font-bold tracking-wide hover:text-gray-200 transition">
            Exam Portal
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-6 text-lg font-medium">
          {role === "admin" ? (
            <>
              <li><Link href="/admin/dashboard" className="hover:text-gray-200 transition">Dashboard</Link></li>
              <li><Link href="/admin/exams" className="hover:text-gray-200 transition">Manage Exams</Link></li>
              <li><Link href="/admin/results" className="hover:text-gray-200 transition">Exam Results</Link></li>
              <li><Link href="/admin/monitoring" className="hover:text-gray-200 transition">Monitoring</Link></li>
              {/* <li><Link href="/admin/reports" className="hover:text-gray-200 transition">Reports</Link></li> */}
              <li><Link href="/admin/users" className="hover:text-gray-200 transition">Manage Users</Link></li>
            </>
          ) : (
            <>
              <li><Link href="/student/dashboard" className="hover:text-gray-200 transition">Dashboard</Link></li>
              <li><Link href="/student/exams" className="hover:text-gray-200 transition">Available Exams</Link></li>
              <li><Link href="/student/results" className="hover:text-gray-200 transition">Exam Results</Link></li>
              {/* <li><Link href="/student/submission" className="hover:text-gray-200 transition">Submissions</Link></li> */}
              <li><Link href="/student/profile" className="hover:text-gray-200 transition">Profile</Link></li>
            </>
          )}
        </ul>

        {/* Logout Button */}
        <LogoutButton />
      </div>
    </nav>
  );
}
