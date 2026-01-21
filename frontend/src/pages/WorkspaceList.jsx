export default function WorkspaceList({ workspaces }) {
  if (!workspaces || workspaces.length === 0) {
    return <p className="text-gray-400">No workspaces found</p>;
  }

  return (
    <ul className="grid gap-4">
      {workspaces.map((ws) => (
        <li
          key={ws._id}
          className="bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col"
        >
          <p className="text-lg font-semibold text-blue-400">{ws.name}</p>
          <p className="text-gray-300">
            <strong>Owner:</strong> {ws.owner?.email || ws.owner}
          </p>
          <p className="text-gray-300">
            <strong>Members ({ws.members?.length || 0}):</strong>{" "}
            {ws.members?.map((m) => m.email).join(", ")}
          </p>
        </li>
      ))}
    </ul>
  );
}
