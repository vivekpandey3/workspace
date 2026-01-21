import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
} from "../services/Api";

export default function Dashboard() {
  const { token, logout } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const navigate = useNavigate();

  // Fetch Workspaces
  const fetchWorkspaces = async () => {
    try {
      const res = await getWorkspace(token);
      setWorkspaces(res?.workspaces || []);
    } catch (err) {
      console.error("Failed to fetch workspaces", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchWorkspaces();
  }, [token]);

  // Edit Workspace
  const handleEdit = async (id, currentName) => {
    const newName = window.prompt("Enter new workspace name:", currentName);
    if (!newName || newName.trim() === "") return;

    try {
      const res = await updateWorkspace(id, newName.trim(), token);
      setWorkspaces((prev) =>
        prev.map((ws) =>
          ws._id === id
            ? { ...ws, name: res.name || newName.trim() }
            : ws
        )
      );
      alert("Workspace updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update workspace");
    }
  };

  // Delete Workspace
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workspace?")) return;

    try {
      await deleteWorkspace(id, token);
      setWorkspaces((prev) => prev.filter((ws) => ws._id !== id));
      alert("Workspace deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete workspace");
    }
  };

  // Manual Member Add
  const handleAddMember = async (workspaceId) => {
    if (!newMemberEmail.trim()) return alert("Enter user ID or email");

    try {
      const res = await addMember(workspaceId, newMemberEmail.trim(), token);
      alert(res.msg || "Member added successfully");
      fetchWorkspaces();
      setNewMemberEmail("");
    } catch (err) {
      console.error(err);
      alert(err.msg || "Failed to add member");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <p className="text-lg animate-pulse">Loading workspaces...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">Welcome to Dashboard</h1>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Workspaces</h2>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/create-workspace")}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow transition hover:-translate-y-0.5"
            >
              Create Workspace
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold shadow transition"
            >
              Logout
            </button>
          </div>
        </div>

        {workspaces.length === 0 ? (
          <p className="text-gray-400">No workspace found</p>
        ) : (
          <ul className="grid gap-4">
            {workspaces.map((ws) => (
              <li
                key={ws._id}
                className="bg-gray-800 p-6 rounded-xl shadow hover:-translate-y-0.5 hover:shadow-md transition"
              >
                {/* Company Name */}
                <p className="text-lg">
                  <strong>Company:</strong> {ws.name}
                </p>

                {/* Owner */}
                <p className="mt-2">
                  <strong>Owner:</strong> {ws.owner || "N/A"}
                </p>

                {/* Members - Card Style */}
                <div className="mt-4">
                  <strong className="block mb-3 text-gray-300">
                    Members ({ws.members?.length || 0}):
                  </strong>
                  {ws.members?.length ? (
                    <div className="space-y-2">
                      {ws.members.map((m, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition"
                        >
                          <span className="text-gray-200">{m.email || "Unknown"}</span>
                          <span className="text-xs px-3 py-1 bg-blue-500 rounded-full font-semibold">
                            {m.role || "MEMBER"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 ml-2">No members</p>
                  )}
                </div>

                {/* Manual Member Add */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter email to add member"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="flex-1 p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  />
                  <button
                    onClick={() => handleAddMember(ws._id)}
                    className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition font-semibold"
                  >
                    Add Member
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(ws._id, ws.name)}
                    className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(ws._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}