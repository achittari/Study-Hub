import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SessionRow = ({ session, deleteSession }) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    {/* Render student's name and email */}
    <td className="p-4 align-middle">{session.student.name}</td>
    <td className="p-4 align-middle">{session.student.email}</td>
    {/* Render tutor's name and email */}
    <td className="p-4 align-middle">{session.tutor.name}</td>
    <td className="p-4 align-middle">{session.tutor.email}</td>
    <td className="p-4 align-middle">{session.subject}</td>
    <td className="p-4 align-middle">{session.time}</td>
    <td className="p-4 align-middle">{session.day}</td>
    <td className="p-4 align-middle">{session.duration}</td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-600 bg-blue-100 text-blue-800 hover:bg-blue-200 h-9 rounded-md px-3"
          to={`/edit-session/${session._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-700 bg-gray-300 text-whitegray-700 hover:bg-gray-600 h-9 rounded-md px-3"
          type="button"
          onClick={() => deleteSession(session._id)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function SessionList() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch("http://localhost:5050/session/");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSessions();
  }, []);

  async function deleteSession(id) {
    try {
      await fetch(`http://localhost:5050/session/${id}`, { method: "DELETE" });
      setSessions((prevSessions) => prevSessions.filter((session) => session._id !== id));
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Session Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Student
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Student Email
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Tutor
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Tutor Email
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Subject
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Time
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Date
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Duration
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {sessions.map((session) => (
                <SessionRow key={session._id} session={session} deleteSession={deleteSession} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
