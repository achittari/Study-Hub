import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Session() {
  const [form, setForm] = useState({
    student: "",
    studentEmail: "",
    tutor: "",
    tutorEmail: "",
    subject: "",
    time: "",
    day: "",
    duration: "",
  });
  const [isNew, setIsNew] = useState(true);
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  {/*useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString();
      if (!id) return;
      setIsNew(false);
      const response = await fetch(`http://localhost:5050/session/${id}`);
      if (!response.ok) {
        console.error(`An error has occurred: ${response.statusText}`);
        return;
      }
      const session = await response.json();
      if (!session) {
        console.warn(`Session with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(session);

        // Fetch students data
      try {
        const studentRes = await fetch("http://localhost:5050/api/students"); // Adjust endpoint if needed
        const students = await studentRes.json();
        setStudents(students); // Assuming students is an array of objects with a 'name' property
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    }
    fetchData();
  }, [params.id, navigate]);*/}
  useEffect(() => {
    async function fetchData() {
      // Fetch session data
      const id = params.id?.toString();
      if (!id) return;
  
      setIsNew(false);
      const response = await fetch(`http://localhost:5050/session/${id}`);
      if (!response.ok) {
        console.error(`An error has occurred: ${response.statusText}`);
        return;
      }
  
      const session = await response.json();
      if (!session) {
        console.warn(`Session with id ${id} not found`);
        navigate("/");
        return;
      }
  
      setForm(session); // Set session data in state
  
      // Fetch students data
      try {
        const studentRes = await fetch("http://localhost:5050/students"); // Adjust endpoint if needed
        const students = await studentRes.json();
        setStudents(students); // Assuming students is an array of objects with a 'name' property
      } catch (err) {
        console.error("Failed to fetch students", err);
      }

      // Fetch students data
      try {
        const tutorRes = await fetch("http://localhost:5050/tutors"); // Adjust endpoint if needed
        const tutors = await tutorRes.json();
        setStudents(tutors); // Assuming tutors is an array of objects with a 'name' property
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    }
  
    fetchData();
  }, [params.id, navigate]);  // This will rerun the effect if `params.id` or `navigate` changes
  

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        isNew ? "http://localhost:5050/session" : `http://localhost:5050/session/${params.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error("A problem occurred with your fetch operation: ", error);
    } finally {
      setForm({
        student: "",
        studentEmail: "",
        tutor: "",
        tutorEmail: "",
        subject: "",
        time: "",
        day: "",
        duration: "",
      });
      navigate("/");
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Session</h3>
      <form onSubmit={onSubmit} className="border rounded-lg overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">Session Info</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">This information will be displayed publicly, so be careful what you share.</p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
            {/*<div className="sm:col-span-4">
              <label htmlFor="student" className="block text-sm font-medium leading-6 text-slate-900">Student</label>
              <input
                type="text"
                id="student"
                className="block w-full rounded-md border-0 bg-transparent py-1.5 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-600"
                placeholder="First Last"
                value={form.student}
                onChange={(e) => updateForm({ student: e.target.value })}
              />
  </div>*/}
              <div className="sm:col-span-4">
              <label htmlFor="student" className="block text-sm font-medium leading-6 text-slate-900">Student</label>
              <select
                id="student"
                className="block w-full rounded-md border-0 bg-transparent py-1.5 text-slate-900 focus:ring-indigo-600"
                value={form.student}
                onChange={(e) => updateForm({ student: e.target.value })}
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student._id || student.name} value={student.name}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>


            <div className="sm:col-span-4">
              <label htmlFor="studentEmail" className="block text-sm font-medium leading-6 text-slate-900">Student Email</label>
              <input
                type="email"
                id="studentEmail"
                className="block w-full rounded-md border-0 bg-transparent py-1.5 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-600"
                placeholder="student@example.com"
                value={form.studentEmail}
                onChange={(e) => updateForm({ studentEmail: e.target.value })}
              />
            </div>

           {/*} <div className="sm:col-span-4">
              <label htmlFor="tutor" className="block text-sm font-medium leading-6 text-slate-900">Tutor</label>
              <input
                type="text"
                id="tutor"
                className="block w-full rounded-md border-0 bg-transparent py-1.5 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-600"
                placeholder="@purdue.edu"
                value={form.tutor}
                onChange={(e) => updateForm({ tutor: e.target.value })}
              />
                </div>*/}
             <div className="sm:col-span-4">
              <label htmlFor="tutor" className="block text-sm font-medium leading-6 text-slate-900">Tutor</label>
              <select
                id="tutor"
                className="block w-full rounded-md border-0 bg-transparent py-1.5 text-slate-900 focus:ring-indigo-600"
                value={form.tutor}
                onChange={(e) => updateForm({ tutor: e.target.value })}
              >
                <option value="">Select a tutor</option>
                {tutors.map((tutor) => (
                  <option key={tutor._id || tutor.name} value={tutor.name}>
                    {tutor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="tutorEmail" className="block text-sm font-medium leading-6 text-slate-900">Tutor Email</label>
              <input
                type="email"
                id="tutorEmail"
                className="block w-full rounded-md border-0 bg-transparent py-1.5 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-600"
                placeholder="tutor@example.com"
                value={form.tutorEmail}
                onChange={(e) => updateForm({ tutorEmail: e.target.value })}
              />
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="subject" className="block text-sm font-medium leading-6 text-slate-900">Subject</label>
              <input
                type="text"
                id="subject"
                className="block w-full rounded-md border-0 bg-transparent py-1.5 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-600"
                placeholder="Computer Science"
                value={form.subject}
                onChange={(e) => updateForm({ subject: e.target.value })}
              />
            </div>

            {/* Time Picker: 12-hour format */}
            <div className="sm:col-span-4">
              <label htmlFor="time" className="block text-sm font-medium leading-6 text-slate-900">Time</label>
              <input
                type="time"
                id="time"
                className="block w-full rounded-md border-0 bg-transparent py-1.5 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-600"
                value={form.time}
                onChange={(e) => updateForm({ time: e.target.value })}
                min="00:00" // 12 AM
                max="23:59" // 11:59 PM (since HTML time input uses 24-hour format)
              />
            </div>

            {/* Day Picker: Date input */}
            <div className="sm:col-span-4">
              <label htmlFor="day" className="block text-sm font-medium leading-6 text-slate-900">Day</label>
              <input
                type="date"
                id="day"
                className="block w-full rounded-md border-0 bg-transparent py-1.5 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-600"
                value={form.day}
                onChange={(e) => updateForm({ day: e.target.value })}
              />
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="duration" className="block text-sm font-medium leading-6 text-slate-900">Duration</label>
              <input
                type="text"
                id="duration"
                className="block w-full rounded-md border-0 bg-transparent py-1.5 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-600"
                placeholder="Duration in minutes"
                value={form.duration}
                onChange={(e) => updateForm({ duration: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900 border border-gray-800 text-gray-800 hover:bg-blue-200 h-9 rounded-md px-3" onClick={() => navigate("/")}>Cancel</button>
          <button type="submit" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 border border-blue-600 bg-blue-100 text-blue-800 hover:bg-blue-200 h-9 rounded-md px-3"
          >Save</button>
        </div>
      </form>
    </>
  );
}
