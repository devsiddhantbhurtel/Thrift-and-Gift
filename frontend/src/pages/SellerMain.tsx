import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaTshirt, FaHistory } from "react-icons/fa";

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
  donation_id?: number; // Optional field for donation products
  phonenumber: number;
  category: string;
  removed?: boolean;
  removal_reason?: string;
  removed_at?: string;  // Add this field
}

const SellerDashboard: React.FC = () => {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [donationProducts, setDonationProducts] = useState<Product[]>([]);
  const [removedProducts, setRemovedProducts] = useState<Product[]>([]);
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [removalReason, setRemovalReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const [removedDonations, setRemovedDonations] = useState<Product[]>([]);
  const [showDonationRemovalModal, setShowDonationRemovalModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Product | null>(null);
  const [donationRemovalReason, setDonationRemovalReason] = useState<string>("");
  const [donationOtherReason, setDonationOtherReason] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:8000/api/clothing/?seller_id=${user?.user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        // Separate removed and active products
        const activeProducts = data.filter((product: Product) => !product.removed);
        const removedItems = data.filter((product: Product) => product.removed);

        setProducts(activeProducts);
        setRemovedProducts(removedItems);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchDonationProducts = async () => {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:8000/api/clothing_bank/?donator_user=${user?.user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch donation products");
        const data = await response.json();

        // Separate active and removed donations
        const activeDonations = data.filter((donation: Product) => !donation.removed);
        const removedDonations = data.filter((donation: Product) => donation.removed);

        setDonationProducts(activeDonations);
        setRemovedDonations(removedDonations);
      } catch (error) {
        console.error("Error fetching donation products:", error);
      }
    };

    fetchProducts();
    fetchDonationProducts();
  }, [user, getToken]);

  const handleAddProduct = () => {
    navigate("/product-options");
  };

  const handleEditProduct = (product: Product) => {
    if (product.donation_id) {
      navigate("/edit-donation", { state: { product } });
    } else {
      navigate("/edit-product", { state: { product } });
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:8000/api/clothing/${productId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts(products.filter(product => product.item_id !== productId));
      setDonationProducts(donationProducts.filter(product => product.donation_id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleRemoveProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowRemovalModal(true);
  };

  const handleConfirmRemoval = async () => {
    if (!selectedProduct) return;

    try {
      const token = getToken();
      const finalReason = removalReason === "other" ? otherReason : removalReason;

      const response = await fetch(`http://localhost:8000/api/clothing/${selectedProduct.item_id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          removed: true,
          removal_reason: finalReason,
          removed_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove product");
      }

      const updatedProduct = await response.json();

      // Update the products state
      setProducts(products.filter(p => p.item_id !== selectedProduct.item_id));

      // Add to removed products
      setRemovedProducts(prevRemoved => [...prevRemoved, updatedProduct]);

      // Reset modal state
      setShowRemovalModal(false);
      setSelectedProduct(null);
      setRemovalReason("");
      setOtherReason("");
    } catch (error) {
      console.error("Error removing product:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleRemoveDonation = (donation: Product) => {
    setSelectedDonation(donation);
    setShowDonationRemovalModal(true);
  };

  const handleConfirmDonationRemoval = async () => {
    if (!selectedDonation) return;

    try {
      const token = getToken();
      const finalReason = donationRemovalReason === "other" ? donationOtherReason : donationRemovalReason;

      const response = await fetch(`http://localhost:8000/api/clothing_bank/${selectedDonation.donation_id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          removed: true,
          removal_reason: finalReason,
          removed_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove donation");
      }

      const updatedDonation = await response.json();

      // Update the donations state
      setDonationProducts(donationProducts.filter(p => p.donation_id !== selectedDonation.donation_id));

      // Add to removed donations
      setRemovedDonations(prevRemoved => [...prevRemoved, updatedDonation]);

      // Reset modal state
      setShowDonationRemovalModal(false);
      setSelectedDonation(null);
      setDonationRemovalReason("");
      setDonationOtherReason("");
    } catch (error) {
      console.error("Error removing donation:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Seller Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome, <span className="font-semibold text-indigo-600">{user?.name}</span>! You are logged in as a seller.
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddProduct}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        >
          <FaPlus className="mr-2" />
          Add a Product
        </button>
      </div>

      {/* Your Products Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Products</h2>
        <p className="text-lg text-gray-700">
          Total number of clothes for sale:{" "}
          <span className="font-semibold text-indigo-600">{products.length}</span>
        </p>
      </div>

      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {products.map((product) => (
            <div
              key={product.item_id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-semibold">Size:</span> {product.size}
                  </p>
                  <p>
                    <span className="font-semibold">Description:</span> {product.description}
                  </p>
                  {product.tags && (
                    <p>
                      <span className="font-semibold">Tag:</span> {product.tags}
                    </p>
                  )}
                  {product.location && (
                    <p>
                      <span className="font-semibold">Location:</span> {product.location}
                    </p>
                  )}
                  {product.price && (
                    <p>
                      <span className="font-semibold">Price:</span> {product.price}
                    </p>
                  )}
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                    onClick={() => handleEditProduct(product)}
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </button>
                  <button
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                    onClick={() => handleRemoveProduct(product)}
                  >
                    <FaTrash className="mr-2" />
                    Remove from Store
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Removed Products History Section */}
      {removedProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaHistory className="mr-2" />
            Removed Products History
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {removedProducts.map((product) => (
              <div
                key={product.item_id}
                className="bg-gray-50 rounded-xl shadow-lg overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <span className="font-semibold">Removal Reason:</span> {product.removal_reason}
                    </p>
                    <p>
                      <span className="font-semibold">Removed On:</span>{" "}
                      {product.removed_at ? new Date(product.removed_at).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Removal Confirmation Modal */}
      {showRemovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Remove Product</h3>
            <p className="text-gray-600 mb-4">Please select the reason for removing this product:</p>

            <div className="space-y-3 mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="removalReason"
                  value="unavailable"
                  checked={removalReason === "unavailable"}
                  onChange={(e) => setRemovalReason(e.target.value)}
                  className="form-radio"
                />
                <span>The products are no longer available</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="removalReason"
                  value="not_selling"
                  checked={removalReason === "not_selling"}
                  onChange={(e) => setRemovalReason(e.target.value)}
                  className="form-radio"
                />
                <span>I don't want to sell this product anymore</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="removalReason"
                  value="other"
                  checked={removalReason === "other"}
                  onChange={(e) => setRemovalReason(e.target.value)}
                  className="form-radio"
                />
                <span>Other</span>
              </label>
            </div>

            {removalReason === "other" && (
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Please specify the reason..."
                className="w-full p-2 border rounded-lg mb-4"
                rows={3}
              />
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowRemovalModal(false);
                  setSelectedProduct(null);
                  setRemovalReason("");
                  setOtherReason("");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoval}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Your Donations Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Donations</h2>
        <p className="text-lg text-gray-700">
          Total number of clothes for donation:{" "}
          <span className="font-semibold text-indigo-600">{donationProducts.filter(p => !p.removed).length}</span>
        </p>
      </div>

      {donationProducts.filter(p => !p.removed).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {donationProducts.filter(p => !p.removed).map((product) => (
            <div
              key={product.donation_id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={product.image}
                alt="Donation"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  <span><FaTshirt className="inline-block mr-2" /> Donation</span>
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-semibold">Size:</span> {product.size}
                  </p>
                  <p>
                    <span className="font-semibold">Description:</span> {product.description}
                  </p>
                  <p>
                    <span className="font-semibold">Category:</span> {product.category}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {product.phonenumber}
                  </p>
                  {product.tags && (
                    <p>
                      <span className="font-semibold">Tag:</span> {product.tags}
                    </p>
                  )}
                  {product.location && (
                    <p>
                      <span className="font-semibold">Location:</span> {product.location}
                    </p>
                  )}
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                    onClick={() => handleEditProduct(product)}
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </button>
                  <button
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                    onClick={() => handleRemoveDonation(product)}
                  >
                    <FaTrash className="mr-2" />
                    Remove from Store
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Removed Donations History Section */}
      {removedDonations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaHistory className="mr-2" />
            Removed Donations History
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {removedDonations.map((donation) => (
              <div
                key={donation.donation_id}
                className="bg-gray-50 rounded-xl shadow-lg overflow-hidden"
              >
                <img
                  src={donation.image}
                  alt={donation.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{donation.title}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <span className="font-semibold">Removal Reason:</span> {donation.removal_reason}
                    </p>
                    <p>
                      <span className="font-semibold">Removed On:</span>{" "}
                      {donation.removed_at ? new Date(donation.removed_at).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Donation Removal Confirmation Modal */}
      {showDonationRemovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Remove Donation</h3>
            <p className="text-gray-600 mb-4">Please select the reason for removing this donation:</p>

            <div className="space-y-3 mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="donationRemovalReason"
                  value="unavailable"
                  checked={donationRemovalReason === "unavailable"}
                  onChange={(e) => setDonationRemovalReason(e.target.value)}
                  className="form-radio"
                />
                <span>The items are no longer available</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="donationRemovalReason"
                  value="not_donating"
                  checked={donationRemovalReason === "not_donating"}
                  onChange={(e) => setDonationRemovalReason(e.target.value)}
                  className="form-radio"
                />
                <span>I don't want to donate these items anymore</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="donationRemovalReason"
                  value="other"
                  checked={donationRemovalReason === "other"}
                  onChange={(e) => setDonationRemovalReason(e.target.value)}
                  className="form-radio"
                />
                <span>Other</span>
              </label>
            </div>

            {donationRemovalReason === "other" && (
              <textarea
                value={donationOtherReason}
                onChange={(e) => setDonationOtherReason(e.target.value)}
                placeholder="Please specify the reason..."
                className="w-full p-2 border rounded-lg mb-4"
                rows={3}
              />
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDonationRemovalModal(false);
                  setSelectedDonation(null);
                  setDonationRemovalReason("");
                  setDonationOtherReason("");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDonationRemoval}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
