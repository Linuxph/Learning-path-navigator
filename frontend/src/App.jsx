import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Authenticate from "./components/Authenticate";
import PathView from "./components/PathView";
import PathEditor from "./components/PathEditor";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable pauseOnFocusLoss />
      <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/auth" element={<Authenticate/>} />
          <Route path="/paths/:pathname" element={<PathView/>} />
          <Route path="/edit/new" element={<PathEditor/>} />
      </Routes>
    </Router>
    
  );
};

export default App;
