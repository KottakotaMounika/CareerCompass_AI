import React, { useEffect, useState } from "react";

export default function AdminUsers({ goBack }) {

  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:8080/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(data);
  };

  const deleteUser = async (id) => {
    await fetch(`http://localhost:8080/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchUsers();
  };

  return (
    <div className="p-10">
      <button onClick={goBack} className="mb-6 text-blue-600">← Back</button>

      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

      <table className="w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="text-center border-t">
              <td className="p-3">{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}