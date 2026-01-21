import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createWorkspace } from "../services/Api";

export default function CreateWorkspace() {
  const { token } = useContext(AuthContext);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) return alert("Please enter a company name");
    const data = await createWorkspace(name, token);
    if (data?.name) {
      alert("Workspace created successfully!");
      navigate("/dashboard");
    } else {
      alert(data.msg || "Failed to create workspace");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Create New Workspace
        </h1>

        <input
          type="text"
          placeholder="Company Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-100 transition               hover:-translate-y-0.5 hover:shadow-md"

        />

        <button
          onClick={handleCreate}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors shadow-md cursor-pointer"
        >
          Create
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-3 mt-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors shadow-md text-gray-300 cursor-pointer "
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
