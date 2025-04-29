import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h1>

        <LoginForm />

        <p className="mt-6 text-center text-gray-700">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
