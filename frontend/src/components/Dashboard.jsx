import React, { useEffect, useState } from "react";
import {toast} from "react-toastify";
import Path from "./Path";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [paths, setpaths] = useState([]);
  const [activePanel, setActivePanel] = useState(null);

  const handleClick = () => {
    if( localStorage.getItem("login") === "true") {
      window.location.href = "/edit/new";
    }else{
      toast.error("Please login to create a new path.");
      return;
    }
  }

  
  
  
  return (
    useEffect( () => {
      localStorage.setItem("login", "false");
      const fetchPaths = async () => {
        try {
          const response = await fetch("http://localhost:3000/api/paths", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch paths");
          }
          const data = await response.json();
          console.log("Fetched paths:", data);
          setpaths(data);
        } catch (error) {
          toast.error("An error occurred while fetching paths.");
        }
      };

      fetchPaths();
      setActivePanel(1);
    }, []),

    // <div>
    //   <div className="main">
    //     <div className="main_functionalities flex gap-10 w-full">
    //       <div className="learning_path">
    //         <button className="border-black border-[3px] p-1 cursor-pointer w-[200px] m-5 hover:font-bold transition-all delay-200">
    //           Learning Paths
    //         </button>
    //       </div>
    //       <div className="prep_test">
    //         <button className="border-black border-[3px] p-1 cursor-pointer w-[200px] m-5 hover:font-bold transition-all delay-200">
    //           Prepare your Test
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className=" text-white font-sans">
    
    <div className="flex gap-6 px-4 py-8 z-10 relative">
        <AnimatedButton text="Learning Paths" onClick={() => setActivePanel(1)} />
        {/* <AnimatedButton text="Prepare Your Test" onClick={() => setActivePanel(2)} /> */}
      </div>

      {/* Panel Section */}
      {activePanel === 1 && (
        <div className="absolute top-[120px] left-0 w-full h-[calc(100%-120px)] text-black flex flex-col items-center justify-center px-6">
          {/* <div className="w-full h-1 bg-pink-500 animate-expand-origin-left  rounded-full mb-6"></div> */}
          <div className="text-lg">
            {/* <span className="text-pink-500">Learning Paths</span> are the steps to become a what you want to be. */}
            { paths.length > 0 ? (
              <div className="mt-4 w-full max-w-2xl">
                {paths.map((path, index) => (
                  <div key={index} className="path text-center w-[15vw] h-[5vh] rounded-2xl border-black border-2" >
                    <Link to={`/path/${path._id}`}>{path.title}</Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 text-gray-500"> Currently <span className="text-pink-500">there</span> is no path to show </div>
            )}
          </div>
          
        </div>
      )}
      {activePanel === 2 && (
        <div className="absolute top-[120px] left-0 w-full h-[calc(100%-120px)] text-black flex flex-col items-center justify-center px-6">
          {/* <div className="w-full h-1 bg-pink-500 animate-expand-origin-left  rounded-full mb-6"></div> */}
          <div className="text-lg">Currently <span className="text-pink-500">there</span> is no test scheduled</div>
        </div>
      )}

      {/* Plus Icon */}
      <div className="flex justify-end pr-8 mt-12 z-10 relative ">
        <button onClick={handleClick} className=" w-12 h-12 border-2 font-bold text-3xl border-pink-500 rounded-full flex items-center justify-center text-pink-500 text-xl hover:bg-pink-500 hover:text-white transition">
          +
        </button>
      </div>
    </div>

  );
};

export default Dashboard;



function AnimatedButton({ text, onClick }) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="px-6 py-2 bg-pink-500 rounded text-white font-medium"
      >
        {text}
      </button>
      <div className="absolute -bottom-2 left-0 w-full h-1 overflow-hidden">
        <div className="h-full w-full bg-pink-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out rounded-full"></div>
      </div>
    </div>
  );
}
