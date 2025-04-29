// frontend/src/pages/EditProduct.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

interface Product {
  item_id: number;
  title: string;
  description: string;
  size: string;
  price: number;
  condition: string;
  tags: string;
  location: string;
  image: string;
  clothing_user_id: number;
}

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product as Product;
  const { getToken } = useAuth(); // Use the getToken function from AuthContext

  const [formData, setFormData] = useState<Product>(product);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!product) {
      navigate("/seller-main");
    }
  }, [product, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const token = getToken(); // Get the JWT token
      const formDataToSend = new FormData();
  
      // Append all fields to the FormData object
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof Product];
        formDataToSend.append(key, typeof value === 'number' ? value.toString() : value);
      });
  
      // Append the image file if it exists
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }
  
      const response = await fetch(`http://localhost:8000/api/clothing/${formData.item_id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token in the headers
        },
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend validation error:", errorData); // Log detailed error
        throw new Error("Failed to update product");
      }
  
      navigate("/seller-main");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
          <button
            onClick={() => navigate("/seller-main")}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
