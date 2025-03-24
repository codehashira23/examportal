"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    
    setLoading(true);
    setRedirecting(false);
    const loginButton = document.getElementById("login-btn");
    if (loginButton) loginButton.disabled = true;

    try {
      console.log("Attempting login...");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        alert(data.message || "Invalid credentials");
        setLoading(false);
        if (loginButton) loginButton.disabled = false;
        return;
      }

      // Store token and role
      document.cookie = `token=${data.token}; path=/; max-age=3600; Secure; SameSite=Strict`;
      document.cookie = `role=${data.role}; path=/; max-age=3600; Secure; SameSite=Strict`;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      setRedirecting(true);
      console.log("Redirecting to:", data.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
      
      try {
        await router.push(data.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
      } catch (redirectError) {
        console.error("Redirection error:", redirectError);
        alert("Error during redirection. Please try again.");
        setRedirecting(false);
        setLoading(false);
        if (loginButton) loginButton.disabled = false;
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
      if (loginButton) loginButton.disabled = false;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            id="login-btn"
            type="submit"
            disabled={loading || redirecting}
            className={`w-full ${
              loading || redirecting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            } text-white font-medium py-2 rounded-lg transition duration-200`}
          >
            {loading ? "Logging in..." : redirecting ? "Redirecting..." : "Login"}
          </button>
        </form>
        <p className="text-gray-600 text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
