import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth(); // Get the user object from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // This already handles state update and redirect
  };

  return (
    <nav className="flex justify-between items-center p-4 border-b border-pink-500 bg-white shadow-sm">
      <Link to="/" className="text-2xl font-bold text-slate-800">
        DevPath
      </Link>
      <div className="flex items-center gap-4">
        {/* --- Conditional Rendering Logic --- */}
        {user ? (
          // If user is logged in, show their name and a Logout button
          <>
            <button
              onClick={handleLogout}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
          >
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;