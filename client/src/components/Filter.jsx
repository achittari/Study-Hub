import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FilterSessions() {
  const [form, setForm] = useState({
    student: "",
    tutor: "",
    subject: "",
    minDuration: "",
  });

  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const studentRes = await fetch("http://localhost:5050/student");
        const tutorRes = await fetch("http://localhost:5050/tutor");

        const studentsData = await studentRes.json();
        const tutorsData = await tutorRes.json();

        setStudents(studentsData);
        setTutors(tutorsData);
      } catch (error) {
        console.error("Failed to load students/tutors:", error);
      }
    }
    fetchData();
  }, []);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  function onSubmit(e) {
    e.preventDefault();

    const queryParams = new URLSearchParams();
    if (form.student) queryParams.append("student", form.student);
    if (form.tutor) queryParams.append("tutor", form.tutor);
    if (form.subject.trim()) queryParams.append("subject", form.subject.trim());
    if (form.minDuration) queryParams.append("minDuration", parseInt(form.minDuration));

    navigate(`/report?${queryParams.toString()}`);
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Filter Sessions</h3>
      <form onSubmit={onSubmit} className="border rounded-lg overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">Filter Options</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Use the fields to generate a filtered report of tutoring sessions.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium leading-6 text-slate-900">
                Student
              </label>
              <select
                value={form.student}
                onChange={(e) => updateForm({ student: e.target.value })}
                className="mt-2 block w-full border rounded-md p-2"
              >
                <option value="">All Students</option>
                {students.map((s) => (
                  <option key={s._id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-sm font-medium leading-6 text-slate-900">
                Tutor
              </label>
              <select
                value={form.tutor}
                onChange={(e) => updateForm({ tutor: e.target.value })}
                className="mt-2 block w-full border rounded-md p-2"
              >
                <option value="">All Tutors</option>
                {tutors.map((t) => (
                  <option key={t._id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-sm font-medium leading-6 text-slate-900">
                Subject
              </label>
              <input
                type="text"
                className="mt-2 block w-full border rounded-md p-2"
                value={form.subject}
                onChange={(e) => updateForm({ subject: e.target.value })}
                placeholder="e.g. Math, Physics"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-sm font-medium leading-6 text-slate-900">
                Minimum Duration (min)
              </label>
              <input
                type="number"
                className="mt-2 block w-full border rounded-md p-2"
                value={form.minDuration}
                onChange={(e) => updateForm({ minDuration: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900 border border-gray-800 text-gray-800 hover:bg-blue-200 h-9 rounded-md px-3"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 
            disabled:pointer-events-none disabled:opacity-50 border border-blue-600 bg-blue-100 text-blue-800 hover:bg-blue-200 h-9 rounded-md px-3"
          >
            Generate Report
          </button>
        </div>
      </form>
    </>
  );
}
