import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the AuthContext
import { EnvelopeFill, LockFill } from "react-bootstrap-icons"; // Bootstrap Icons

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from AuthContext

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/login/", formData);
      console.log("Login successful:", response.data);

      // Call the login function from AuthContext
      login(response.data.access, response.data.user);

      // Redirect based on the user's role
      if (response.data.user.role === "seller") {
        navigate("/seller-dashboard"); // Redirect sellers to their dashboard
      } else if (response.data.user.role === "buyer") {
        navigate("/thrift-store"); // Redirect buyers to the thrift store
      } else {
        navigate("/"); // Fallback for other roles or unassigned roles
      }
    } catch (error: any) {
      console.error("Login failed:", error.response?.data);
      setError(error.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <EnvelopeFill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <LockFill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading} // Disable button when loading
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"} {/* Show loading text when submitting */}
          </button>
          {/* Display error message below the login button */}
          {error && (
            <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;