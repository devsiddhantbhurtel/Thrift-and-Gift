import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaTshirt, FaTag, FaImage, FaUpload, FaArrowLeft } from "react-icons/fa";

const DonatorDashboard: React.FC = () => {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    phonenumber: "",
    category: "",
    size: "",
    description: "",
    image: null as File | null,
  });

  // State for image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, image: file });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("phonenumber", formData.phonenumber);
      data.append("category", formData.category);
      data.append("size", formData.size);
      data.append("description", formData.description);

      // Append the authenticated user's ID
      if (user) {
        data.append("donator_user", user.user_id.toString());
      }

      // Append the image if available
      if (formData.image) {
        data.append("image", formData.image);
      }

      const token = getToken();
      const response = await fetch("http://localhost:8000/api/clothing_bank/", {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend validation error:", errorData);
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log("Upload successful!", result);
      navigate("/clothing-bank"); // Redirect to the thrift store page after successful upload
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Donate Your Clothes</h2>
          <button
            onClick={() => navigate("/")}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Skip for now
          </button>
        </div>

        {/* Donator Guide Text */}
        <p className="text-gray-600 mb-6">
          As a donator, you can list your clothes for donation here. Fill out the form below to donate your clothes.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaTag className="inline-block mr-2" />
              Phone Number
            </label>
            <input
              type="text"
              name="phonenumber"
              placeholder="Enter phone number"
              value={formData.phonenumber}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaTshirt className="inline-block mr-2" />
              Category
            </label>
            <input
              type="text"
              name="category"
              placeholder="Enter category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaTshirt className="inline-block mr-2" />
              Size
            </label>
            <input
              type="text"
              name="size"
              placeholder="Enter size"
              value={formData.size}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaTshirt className="inline-block mr-2" />
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              rows={4}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaImage className="inline-block mr-2" />
              Product Image
            </label>
            <div className="mt-1 flex flex-col items-center">
              <label htmlFor="fileInput" className="cursor-pointer">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg shadow-md" />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
                    <FaUpload className="text-gray-400 text-2xl mx-auto" />
                    <p className="mt-2 text-sm text-gray-600">Upload an image</p>
                  </div>
                )}
              </label>
              <input
                id="fileInput"
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Donate Clothes
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonatorDashboard;