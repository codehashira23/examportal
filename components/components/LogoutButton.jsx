"use client";

import { useRouter } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";


export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "token=; path=/; max-age=0;"; // Clear cookie
    router.push("/"); // Redirect to login page
  }

  return (
    <button onClick={handleLogout} className="bg-green-700 text-white px-3 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-red-700 hover:scale-105 active:scale-95"
>
      <IoLogOutOutline className="size-5 "  />
    
    </button>
  );
}
