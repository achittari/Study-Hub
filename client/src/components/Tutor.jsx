import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Tutor() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    expertise: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString();
      if (!id) return;
      setIsNew(false);

      try {
        const response = await fetch(`http://localhost:5050/tutor/${id}`);
        if (!response.ok) {
          throw new Error(`An error has occurred: ${response.statusText}`);
        }

        const tutor = await response.json();
        if (!tutor) {
          console.warn(`tutor with id ${id} not found`);
          navigate("/");
          return;
        }

        setForm(tutor);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    return setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      let response;
      if (isNew) {
        response = await fetch("http://localhost:5050/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        response = await fetch(`http://localhost:5050/tutor/${params.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setForm({ name: "", email: "", expertise: "" });
      navigate("/");
    } catch (error) {
      console.error("A problem occurred with your fetch operation: ", error);
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Tutor Record</h3>
      <form onSubmit={onSubmit} className="border rounded-lg overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">Tutor Info</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full border rounded-md p-2"
                  placeholder="First Last"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block w-full border rounded-md p-2"
                  placeholder="@purdue.edu"
                  value={form.email}
                  onChange={(e) => updateForm({ email: e.target.value })}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="expertise" className="block text-sm font-medium leading-6 text-slate-900">
                Expertise
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="expertise"
                  id="expertise"
                  className="block w-full border rounded-md p-2"
                  placeholder="Computer Science"
                  value={form.expertise}
                  onChange={(e) => updateForm({ expertise: e.target.value })}
                />
              </div>
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
