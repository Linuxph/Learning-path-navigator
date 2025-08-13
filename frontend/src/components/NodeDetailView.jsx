import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

const NodeDetailView = () => {
  const { nodeId } = useParams();
  const { token } = useAuth();
  const [node, setNode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchNode = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/node/${nodeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
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
          <img src={node.imageUrl} alt={node.label} className="w-full h-64 object-cover" />
        )}
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">{node.label}</h1>
          <a
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-6 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Read on Original Site →
          </a>
          <div className="prose prose-lg max-w-none text-slate-700">
            <p>{node.notes}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NodeDetailView;