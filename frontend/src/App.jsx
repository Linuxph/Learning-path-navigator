import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Authenticate from "./components/Authenticate";
import PathView from "./components/PathView";
import PathEditor from "./components/PathEditor";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NodeDetailView from "./components/NodeDetailView";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Authenticate />} />
          <Route path="/path/:pathId" element={<PathView />} />
          <Route
            path="/edit/new"
            element={
              <ProtectedRoute>
                <PathEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/path/:pathId/node/:nodeId"
            element={
              // <ProtectedRoute>
                <NodeDetailView />
              // </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
