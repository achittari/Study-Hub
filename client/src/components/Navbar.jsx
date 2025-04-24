/*import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-between items-center mb-6 bg-gray-600 h-20 w-full">
        <NavLink to="/" className="text-3xl font-bold pl-5 text-white">
          StudyHub
        </NavLink>

        <div className="flex items-center">
          {/* Links to show student list, tutor list, session list *///}
         /* <NavLink
            to="/students"
            className="inline-flex items-center justify-center text-md font-medium bg-white border border-gray-300 hover:bg-gray-100 text-black h-9 rounded-md px-3 mr-2"
          >
            Students
          </NavLink>

          <NavLink
            to="/tutors"
            className="inline-flex items-center justify-center text-md font-medium bg-white border border-gray-300 hover:bg-gray-100 text-black h-9 rounded-md px-3 mr-2"
          >
            Tutors
          </NavLink>

          <NavLink
            to="/sessions"
            className="inline-flex items-center justify-center text-md font-medium bg-white border border-gray-300 hover:bg-gray-100 text-black h-9 rounded-md px-3 mr-2"
          >
            Sessions
          </NavLink>

          {/* Links for creating new entries *///}
          /*<NavLink
            to="/create"
            className="inline-flex items-center justify-center text-md font-medium bg-white border border-gray-300 hover:bg-gray-100 text-black h-9 rounded-md px-3 mr-2"
          >
            Add Student
          </NavLink>

          <NavLink
            to="/create-tutor"
            className="inline-flex items-center justify-center text-md font-medium bg-white border border-gray-300 hover:bg-gray-100 text-black h-9 rounded-md px-3 mr-2"
          >
            Add Tutor
          </NavLink>

          <NavLink
            to="/create-session"
            className="inline-flex items-center justify-center text-md font-medium bg-white border border-gray-300 hover:bg-gray-100 text-black h-9 rounded-md px-3 mr-2"
          >
            Add Session
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
*/

import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-between items-center mb-6 px-5">
        {/* Left-aligned StudyHub */}
        <NavLink to="/" className="text-3xl font-bold">
          StudyHub
        </NavLink>

        {/* Right-aligned Buttons */}
        <div className="flex space-x-4">
          <NavLink
className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors 
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 
disabled:pointer-events-none disabled:opacity-50 border border-green-600 bg-green-100 text-green-800 hover:bg-green-200 h-9 rounded-md px-3"
            to="/create"
          >
            Add Student
          </NavLink>
          <NavLink
className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors 
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 
disabled:pointer-events-none disabled:opacity-50 border border-green-600 bg-green-100 text-green-800 hover:bg-green-200 h-9 rounded-md px-3"
            to="/create-tutor"
          >
            Add Tutor
          </NavLink>
          <NavLink
className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors 
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 
disabled:pointer-events-none disabled:opacity-50 border border-green-600 bg-green-100 text-green-800 hover:bg-green-200 h-9 rounded-md px-3"
            to="/create-session"
          >
            Add Session
          </NavLink>
          <NavLink
className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors 
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 
disabled:pointer-events-none disabled:opacity-50 border border-orange-600 bg-orange-100 text-orange-800 hover:bg-orange-200 h-9 rounded-md px-3"
            to="/filter-session"
          >
            Filter Sessions
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
