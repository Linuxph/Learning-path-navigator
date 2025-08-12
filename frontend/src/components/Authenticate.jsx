import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function Authenticate() {
  const [isLogin, setIsLogin] = useState(true);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    username: "",
  });

  // A single handler to update the form state dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Use fetch or your custom dataFetching function
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send only the necessary data as a flat object
        body: JSON.stringify({
          email: formState.email,
          password: formState.password,
        }),
      });

      // It's good practice to handle non-ok responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed.");
      }

      const data = await response.json();
      console.log("Login success:", data);
      toast.success("Login successful!");
      // Handle successful login (e.g., store token, redirect)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("login",true);
      window.location.href = "/";  
    } catch (error) {
      toast.error(error.message || "An error occurred during login.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the entire form state as a flat object
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sign up failed.");
      }
      
      const data = await response.json();
      toast.success("Sign up successful! Please log in.");
      setIsLogin(true); // Switch to login view
      localStorage.setItem("userId", JSON.stringify(data.userId));

      // Reset form fields for a better user experience
      setFormState({ email: "", password: "", username: "" }); 

    } catch (error) {
      toast.error(error.message || "An error occurred during sign up.");
    }
  };

  return (
    <div className="relative h-[91vh] w-full bg-slate-900 font-sans">
      <div className="relative z-10 flex items-center justify-center h-[91vh]">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-300 mt-2">
              {isLogin ? "Log in to your learning path" : "Start your journey today"}
            </p>
          </div>

          {/* Use onSubmit on the form for better accessibility */}
          <form onSubmit={isLogin ? handleLogin : handleSignUp} className="mt-8 space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formState.username}
                    onChange={handleChange}
                    className="auth-input" // Assuming this class is defined in your CSS
                    required 
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <input
              type="email"
              placeholder="Email Address"
              name="email" // name attribute is crucial
              value={formState.email}
              onChange={handleChange}
              className="auth-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password" // name attribute is crucial
              value={formState.password}
              onChange={handleChange}
              className="auth-input"
              required
            />

            {/* Changed from onClick to type="submit" */}
            <button
              type="submit"
              className="w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 shadow-lg shadow-blue-500/30 transition-all duration-300"
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-slate-300 hover:text-blue-400 transition-colors duration-300"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}