import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import { toast } from "react-toastify";

const NodeDetailView = () => {
  const { nodeId,pathId } = useParams();
  const { token } = useAuth();
  const [node, setNode] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quiz, setQuiz] = useState(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  const startQuiz = async () => {
    setIsLoadingQuiz(true);

    
    try {
      const response = await fetch(
        `http://localhost:3000/api/path/${pathId}/generate-quiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${token}` 
          },
        }
      );
      const quizData = await response.json();
      setQuiz(quizData);
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      toast.error("Could not generate quiz.");
    } finally {
      setIsLoadingQuiz(false);
    }
  };


  useEffect(() => {
    if (!token) return;

    const fetchNode = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/node/${nodeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        console.log("Fetched node data:", data.node); // Debugging line to check fetched data
        setNode(data.node);
      } catch (error) {
        console.error("Failed to fetch node details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNode();
  }, [nodeId, token]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!node) return <div className="p-8">Node not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <BackButton />
      <article className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
        {node.imageUrl && (
          <img
            src={node.imageUrl}
            alt={node.label}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            {node.label}
          </h1>
          <a
            href={node.data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-6 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Read on Original Site →
          </a>
          <div className="prose prose-lg max-w-none text-slate-700">
            <p>{node.summary}</p>
          </div>
        </div>
      </article>
      <button
        onClick={startQuiz}
        disabled={isLoadingQuiz}
        className="mt-2 px-4 py-2 bg-pink-500 text-white cursor-pointer rounded ..."
      >
      {isLoadingQuiz ? "Generating..." : "Start Quiz"}
      </button>
      {quiz && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-1/2">
            {/* You would build your interactive quiz UI here */}
            <h2 className="text-2xl font-bold mb-4">Quiz Time!</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(quiz, null, 2)}
            </pre>
            <button
              onClick={() => setQuiz(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeDetailView;
