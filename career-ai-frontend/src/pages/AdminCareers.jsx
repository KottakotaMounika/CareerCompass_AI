import React, { useEffect, useState } from "react";

export default function AdminCareers({ goBack }) {

  const [careers, setCareers] = useState([]);
  const [newCareer, setNewCareer] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/careers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCareers(data);
    } catch (error) {
      console.error("Error fetching careers:", error);
    }
  };

  const addCareer = async () => {
    if (!newCareer.trim()) {
      alert("Career name cannot be empty");
      return;
    }

    try {
      await fetch("http://localhost:8080/api/admin/careers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCareer })
      });

      setNewCareer("");
      fetchCareers();

    } catch (error) {
      console.error("Error adding career:", error);
    }
  };

  const deleteCareer = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this career?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:8080/api/admin/careers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchCareers();

    } catch (error) {
      console.error("Error deleting career:", error);
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gray-100">

      <button
        onClick={goBack}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-6">Manage Careers</h2>

      {/* Add Career Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Career</h3>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Career Name"
            value={newCareer}
            onChange={(e) => setNewCareer(e.target.value)}
            className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={addCareer}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Careers Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4">ID</th>
              <th>Career Name</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {careers.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-6 text-gray-500">
                  No careers found
                </td>
              </tr>
            ) : (
              careers.map((career) => (
                <tr key={career.id} className="border-t">
                  <td className="p-4">{career.id}</td>
                  <td>{career.name}</td>
                  <td>
                    <button
                      onClick={() => deleteCareer(career.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}