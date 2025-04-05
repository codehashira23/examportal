"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer({ role }) {
  return (
    <footer className="p-4 bg-green-700 text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image src="/favicon.ico" alt="Exam Portal Logo" width={30} height={30} />
              <span className="text-xl font-bold tracking-wide ml-2">Exam Portal</span>
            </Link>
            <p className="text-sm">
              A comprehensive platform for conducting and managing online examinations with enhanced security features.
            </p>
          </div>

          {/* Links - Different for admin and student */}
          {role === "admin" ? (
            <>
              <div className="col-span-1">
                <h2 className="text-lg font-semibold mb-4">Admin Tools</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href="/admin/dashboard" className="text-sm hover:underline">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/exams" className="text-sm hover:underline">
                      Manage Exams
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/users" className="text-sm hover:underline">
                      User Management
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-1">
                <h2 className="text-lg font-semibold mb-4">Resources</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href="/admin/monitoring" className="text-sm hover:underline">
                      Exam Monitoring
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/results" className="text-sm hover:underline">
                      Results Management
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="col-span-1">
                <h2 className="text-lg font-semibold mb-4">Student Tools</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href="/student/dashboard" className="text-sm hover:underline">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/student/exams" className="text-sm hover:underline">
                      Available Exams
                    </Link>
                  </li>
                  <li>
                    <Link href="/student/results" className="text-sm hover:underline">
                      My Results
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-1">
                <h2 className="text-lg font-semibold mb-4">Resources</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href="/student/profile" className="text-sm hover:underline">
                      My Profile
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Contact Info - Same for both roles */}
          <div className="col-span-1">
            <h2 className="text-lg font-semibold mb-4">Contact</h2>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>support@examportal.com</span>
              </li>
              <li className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 4a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 4zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span>Help Center</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-green-600 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Exam Portal. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-white hover:text-green-200">
              <span className="sr-only">Facebook</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-white hover:text-green-200">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-white hover:text-green-200">
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 