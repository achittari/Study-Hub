import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Student = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.student.name}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.student.email}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.student.year}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 border border-blue-600 bg-blue-100 text-blue-800 hover:bg-blue-200 h-9 rounded-md px-3"
          
                    to={`/edit-student/${props.student._id}`}
        >
          Edit
        </Link>
        <button
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 
        disabled:pointer-events-none disabled:opacity-50 border border-gray-700 bg-gray-300 text-whitegray-700 hover:bg-gray-600 h-9 rounded-md px-3"
      
            type="button"
          onClick={() => {
            props.deleteStudent(props.student._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function StudentList() {
  const [students, setStudents] = useState([]);

  // This method fetches the students from the database.
  useEffect(() => {
    async function getStudents() {
      const response = await fetch(`http://localhost:5050/student/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const students = await response.json();
      setStudents(students);
    }
    getStudents();
    return;
  }, [students.length]);

  // This method will delete a student
  async function deleteStudent(id) {
    await fetch(`http://localhost:5050/student/${id}`, {
      method: "DELETE",
    });
    const newStudents = students.filter((el) => el._id !== id);
    setStudents(newStudents);
    window.dispatchEvent(new Event("membersUpdated"));
  }

  // This method will map out the students on the table
  function studentList() {
    return students.map((student) => {
      return (
        <Student
          student={student}
          deleteStudent={() => deleteStudent(student._id)}
          key={student._id}
        />
      );
    });
  }

  // This following section will display the table with the students of individuals.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Student Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Email
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Year
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {studentList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}