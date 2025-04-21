import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Helper function to format time into a human-readable string
// Helper function to format time into a human-readable string
const formatTime = (time) => {
  if (!time) return "N/A"; // If the time is undefined or null
  const date = new Date(time); 
  return date instanceof Date && !isNaN(date) ? date.toLocaleTimeString() : "N/A";
};

const TutorRow = ({ tutor, deleteTutor }) => {
  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{tutor.name}</td>
      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{tutor.email}</td>
      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{tutor.expertise}</td>
      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
        <div className="flex gap-2">
          <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 border border-blue-600 bg-blue-100 text-blue-800 hover:bg-blue-200 h-9 rounded-md px-3"          
            to={`/edit-tutor/${tutor._id}`}
          >
            Edit
          </Link>
          <button
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 
        disabled:pointer-events-none disabled:opacity-50 border border-gray-700 bg-gray-300 text-whitegray-700 hover:bg-gray-600 h-9 rounded-md px-3"
      
            type="button"
            onClick={() => deleteTutor(tutor._id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};



const TutorList = () => {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    async function fetchTutors() {
      try {
        const response = await fetch("http://localhost:5050/tutor/");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setTutors(data);
      } catch (error) {
        console.error("Failed to fetch tutors:", error);
      }
    }

    fetchTutors();
  }, []);

  const deleteTutor = async (id) => {
    try {
      await fetch(`http://localhost:5050/tutor/${id}`, {
        method: "DELETE",
      });
      setTutors((prevTutors) => prevTutors.filter((tutor) => tutor._id !== id));
      window.dispatchEvent(new Event("membersUpdated"));
    } catch (error) {
      console.error("Failed to delete tutor:", error);
    }
  };

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Tutor Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Email
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Expertise
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tutors.map((tutor) => (
                <TutorRow tutor={tutor} deleteTutor={deleteTutor} key={tutor._id} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TutorList;
