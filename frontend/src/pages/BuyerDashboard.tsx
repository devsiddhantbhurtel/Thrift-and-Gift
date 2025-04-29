// src/pages/BuyerDashboard.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const BuyerDashboard: React.FC = () => {
  const { user } = useAuth(); // Access the authenticated user

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Buyer Dashboard</h1>
      <p className="text-lg mb-4">
        Welcome, <span className="font-semibold">{user?.name}</span>! You are logged in as a buyer.
      </p>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Explore Products</h2>
        <p className="mb-4">
          Browse through our collection of clothes and find your next favorite piece!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example product cards */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Product Name</h3>
            <p className="text-sm text-gray-600">$20.00</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Product Name</h3>
            <p className="text-sm text-gray-600">$25.00</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Product Name</h3>
            <p className="text-sm text-gray-600">$30.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;