import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Report() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Helper: convert URL query string into object
  function getQueryParams() {
    const params = new URLSearchParams(location.search);
    const filters = {};
    for (const [key, value] of params.entries()) {
      filters[key] = value;
    }
    return filters;
  }

  useEffect(() => {
    async function fetchFilteredSessions() {
      try {
        setLoading(true);
        const query = location.search; // already starts with `?`
        const res = await fetch(`http://localhost:5050/session${query}`);
        const data = await res.json();
        setSessions(data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredSessions();
  }, [location.search]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Filtered Sessions Report</h2>
      </div>

      {loading ? (
        <p>Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p>No sessions found matching the criteria.</p>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-blue-100 text-left text-sm font-medium text-gray-700">
              <th className="py-2 px-4 border-b">Student</th>
              <th className="py-2 px-4 border-b">Student Email</th>
              <th className="py-2 px-4 border-b">Tutor</th>
              <th className="py-2 px-4 border-b">Tutor Email</th>
              <th className="py-2 px-4 border-b">Subject</th>
              <th className="py-2 px-4 border-b">Duration (min)</th>
              <th className="py-2 px-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
        {sessions.map((session) => (
            <tr key={session._id} className="hover:bg-gray-50">
            <td className="py-2 px-4 border-b">{session.student?.name || "N/A"}</td>
            <td className="py-2 px-4 border-b">{session.student?.email || "N/A"}</td>
            <td className="py-2 px-4 border-b">{session.tutor?.name || "N/A"}</td>
            <td className="py-2 px-4 border-b">{session.tutor?.email || "N/A"}</td>
            <td className="py-2 px-4 border-b">{session.subject}</td>
            <td className="py-2 px-4 border-b">{session.duration}</td>
            <td className="py-2 px-4 border-b">
                {session.day && !isNaN(new Date(session.day))
                ? new Date(session.day).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    })
                : "Invalid Date"}
            </td>
            </tr>
        ))}
        </tbody>

        </table>
      )}
    </div>
  );
}
