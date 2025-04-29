import React from "react";
import { useNavigate } from "react-router-dom";

// Import images directly (make sure these files exist in your public folder)
import sellImage from "../assets/sell-clothes.jpg"; // Create this file path in your project
import donateImage from "../assets/donate-clothes.jpg"; // Create this file path in your project

const ProductOptions: React.FC = () => {
  const navigate = useNavigate();

  const handleSellOption = () => {
    navigate("/seller-dashboard");
  };

  const handleDonateOption = () => {
    navigate("/donator-dashboard");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">What would you like to do?</h1>
        <p className="text-lg text-gray-600">Choose an option below</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {/* Sell Option */}
        <div 
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          onClick={handleSellOption}
        >
          <div className="h-64 bg-indigo-100 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
              alt="Sell your product" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/400x300/indigo/white?text=Sell+Your+Products";
              }}
            />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Sell Your Products</h3>
            <p className="text-gray-600">List your items for sale and earn money</p>
            <button 
              className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 w-full"
            >
              Sell Now
            </button>
          </div>
        </div>

        {/* Donate Option */}
        <div 
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          onClick={handleDonateOption}
        >
          <div className="h-64 bg-green-100 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
              alt="Donate your product" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/400x300/green/white?text=Donate+Your+Products";
              }}
            />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Donate Your Products</h3>
            <p className="text-gray-600">Help others by donating your clothes</p>
            <button 
              className="mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg shadow-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 w-full"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOptions;