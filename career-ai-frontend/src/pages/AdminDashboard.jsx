import React, { useEffect, useState } from "react";
import AdminUsers from "./AdminUsers";
import AdminQuestions from "./AdminQuestions";
import AdminCareers from "./AdminCareers";

export default function AdminDashboard({ onLogout }) {

  const [view, setView] = useState("dashboard");
  const [stats, setStats] = useState({
    users: 0,
    questions: 0,
    careers: 0,
    popularCareer: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const users = await fetch("http://localhost:8080/api/admin/users/count", { headers });
      const questions = await fetch("http://localhost:8080/api/admin/questions/count", { headers });
      const careers = await fetch("http://localhost:8080/api/admin/careers/count", { headers });
      const popular = await fetch("http://localhost:8080/api/admin/analytics/popular-career", { headers });

      setStats({
        users: await users.json(),
        questions: await questions.json(),
        careers: await careers.json(),
        popularCareer: await popular.text()
      });

    } catch (err) {
      console.log(err);
    }
  };

  if (view === "users") return <AdminUsers goBack={() => setView("dashboard")} />;
  if (view === "questions") return <AdminQuestions goBack={() => setView("dashboard")} />;
  if (view === "careers") return <AdminCareers goBack={() => setView("dashboard")} />;

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold text-center mb-10">
        👑 Admin Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <Card title="Total Users" value={stats.users} />
        <Card title="Total Questions" value={stats.questions} />
        <Card title="Total Careers" value={stats.careers} />
        <Card title="Most Popular Career" value={stats.popularCareer} />
      </div>

      <div className="flex justify-center gap-6 mb-10">
  <button
    onClick={() => setView("users")}
    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
  >
    Manage Users
  </button>

  <button
    onClick={() => setView("questions")}
    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
  >
    Manage Questions
  </button>

  <button
    onClick={() => setView("careers")}
    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
  >
    Manage Careers
  </button>
</div>

      <div className="text-center">
        <button onClick={onLogout} className="bg-red-500 text-white px-6 py-2 rounded-lg">
          Logout
        </button>
      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl mt-2 font-bold">{value}</p>
    </div>
  );
}