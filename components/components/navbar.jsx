"use client"

import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useState } from "react";
import Image from "next/image";

export default function Navbar({ role }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="p-4 dark:bg-gray-800 dark:text-gray-100 bg-green-700 text-white">
      <div className="container flex justify-between h-8 mx-auto">
        {/* Logo / Home Link */}
        <Link href="/" className="flex items-center p-2">
        <Image src="/logo.png" alt="logo" width={30} height={30} />

          <span className="text-2xl font-bold tracking-wide ml-2">Exam Portal</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <ul className="items-stretch hidden space-x-3 md:flex">
          {role === "admin" ? (
            <>
              <li className="flex">
                <Link href="/admin/dashboard" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:border-white">
                  Dashboard
                </Link>
              </li>
              <li className="flex">
                <Link href="/admin/exams" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:border-white">
                  Manage Exams
                </Link>
              </li>
              <li className="flex">
                <Link href="/admin/results" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:border-white">
                  Exam Results
                </Link>
              </li>
              <li className="flex">
                <Link href="/admin/monitoring" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:border-white">
                  Monitoring
                </Link>
              </li>
              <li className="flex">
                <Link href="/admin/users" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:border-white">
                  Manage Users
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="flex">
                <Link href="/student/dashboard" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:border-white">
                  Dashboard
                </Link>
              </li>
              <li className="flex">
                <Link href="/student/exams" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:border-white">
                  Available Exams
                </Link>
              </li>
              <li className="flex">
                <Link href="/student/results" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:border-white">
                  Exam Results
                </Link>
              </li>
              <li className="flex">
                <Link href="/student/profile" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:border-white">
                  Profile
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="flex justify-end p-4 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        {/* Logout Button - Desktop */}
        <div className="hidden md:block">
          <LogoutButton />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <ul className="pt-4 pb-3 space-y-2">
            {role === "admin" ? (
              <>
                <li><Link href="/admin/dashboard" className="block px-4 py-2 hover:bg-green-600">Dashboard</Link></li>
                <li><Link href="/admin/exams" className="block px-4 py-2 hover:bg-green-600">Manage Exams</Link></li>
                <li><Link href="/admin/results" className="block px-4 py-2 hover:bg-green-600">Exam Results</Link></li>
                <li><Link href="/admin/monitoring" className="block px-4 py-2 hover:bg-green-600">Monitoring</Link></li>
                <li><Link href="/admin/users" className="block px-4 py-2 hover:bg-green-600">Manage Users</Link></li>
              </>
            ) : (
              <>
                <li><Link href="/student/dashboard" className="block px-4 py-2 hover:bg-green-600">Dashboard</Link></li>
                <li><Link href="/student/exams" className="block px-4 py-2 hover:bg-green-600">Available Exams</Link></li>
                <li><Link href="/student/results" className="block px-4 py-2 hover:bg-green-600">Exam Results</Link></li>
                <li><Link href="/student/profile" className="block px-4 py-2 hover:bg-green-600">Profile</Link></li>
              </>
            )}
            <li className="px-4 py-2 ">
              <LogoutButton />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
