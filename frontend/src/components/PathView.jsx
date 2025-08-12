import React, { useEffect } from 'react'

const PathView = () => {
  
  useEffect(() => {
    const fetchPath = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/path/${localStorage.getItem("pathId")}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch path");
        }
        const data = await response.json();
        console.log("Fetched path:", data);
      } catch (error) {
        console.error("An error occurred while fetching the path:", error);
      }
    };
    fetchPath();
    
  }, [])
  

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white shadow-md rounded-lg p-8 w-3/4">
          <h2 className="text-2xl font-bold mb-6 text-center">Path View</h2>
          <p className="text-gray-700 mb-4">This is where you can view the details of your selected path.</p>
          {/* Add more content here to display path details */}
          <p className="text-gray-500">Path ID: {localStorage.getItem("pathId")}</p>
        </div>
      </div>
    </div>
  )
}

export default PathView