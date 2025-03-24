"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "token=; path=/; max-age=0;"; // Clear cookie
    router.push("/"); // Redirect to login page
  }

  return (
    <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:bg-red-700 hover:scale-105 active:scale-95"
>
      Logout
    </button>
  );
}
