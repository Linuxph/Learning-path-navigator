import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext"; 

const Dashboard = () => {
  const [paths, setPaths] = useState([]);
  const [activePanel, setActivePanel] = useState(1);
  
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaths = async () => {
      if (!token) return;

      try {
        const response = await fetch("http://localhost:3000/api/path/all", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch paths");
        }
        const data = await response.json();
        console.log("Fetched paths:", data);
        setPaths(data|| []);
      } catch (error) {
        console.error("Error fetching paths:", error);
        toast.error("An error occurred while fetching paths.");
      }
    };

    fetchPaths();
  }, [token]); 

  // FIX: Corrected handleClick function
  const handleClick = () => {
    if (user) { // Check for the user object from context
      navigate("/edit/new"); // Use navigate for smooth routing
    } else {
      toast.error("Please login to create a new path.");
    }
  };

  return (
    <div className="text-white font-sans">
      <div className="flex gap-6 px-4 py-8 z-10 relative">
        <AnimatedButton
          text="Learning Paths"
          onClick={() => setActivePanel(1)}
        />
        {/* You can re-enable this when the AI feature is ready */}
        {/* <AnimatedButton text="Prepare Your Test" onClick={() => setActivePanel(2)} /> */}
      </div>

      {/* Panel Section */}
      {activePanel === 1 && (
        <div className="absolute top-[120px] left-0 w-full h-[calc(100%-120px)] text-black py-6 px-6">
          {paths.length > 0 ? (
            paths.map((path) => (
              <div key={path._id} className="py-2">
                <Link
                  to={`/path/${path._id}`}
                  className="block max-w-md p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                >
                  <h2 className="text-xl font-semibold">{path.title}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${path.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-slate-700">
                      {path.progress || 0}%
                    </span>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="mt-4 text-gray-500">
              You haven't created any paths yet. Click the '+' to start.
            </div>
          )}
        </div>
      )}

      {/* Plus Icon to create a new path */}
      <div className="fixed bottom-8 right-8 z-20">
        <button
          onClick={handleClick}
          className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white text-4xl hover:bg-pink-600 transition shadow-lg"
        >
          +
        </button>
      </div>
    </div>
  );
};

// This component can stay the same
function AnimatedButton({ text, onClick }) {
  // ... (no changes needed here)
  return (
    <div className="relative group">
      <button onClick={onClick} className="px-6 py-2 bg-pink-500 rounded text-white font-medium">
        {text}
      </button>
      <div className="absolute -bottom-2 left-0 w-full h-1 overflow-hidden">
        <div className="h-full w-full bg-pink-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out rounded-full"></div>
      </div>
    </div>
  );
}

export default Dashboard;