import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Login({ onLogin, onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      // Save token
      localStorage.setItem("token", data.token);

      // Decode token
      const decoded = jwtDecode(data.token);

      localStorage.setItem("username", decoded.sub);
      localStorage.setItem("role", decoded.role);

      // Role-based redirect
      if (decoded.role === "ADMIN") {
        onLogin("ADMIN");
      } else {
        onLogin("USER");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Login to continue your journey 🚀
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm mt-6 text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer font-medium"
            onClick={onSwitch}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}