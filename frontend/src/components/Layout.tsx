import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, X, MessageCircle, Loader, Loader2, Plus, Minus } from 'lucide-react';
import { useCart, CartItem } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface LayoutProps {
  children: React.ReactElement<{ searchQuery?: string }>;
  setSearchQuery: (query: string) => void;
}

export function Layout({ children, setSearchQuery }: LayoutProps) {
  const { cartItems, updateQuantity, removeFromCart, isCartOpen, toggleCart, isLoading } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  const [searchQuery, setLocalSearchQuery] = useState('');
  const [updatingQuantities, setUpdatingQuantities] = useState<{ [key: string]: boolean }>({});
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Define otherUserId (replace with actual logic)
  const otherUserId = 2; // Example: Hardcoded for testing

  const handleLogout = () => {
    logout();
    setShowLogoutSuccess(true);
  };

  const closeLogoutSuccessModal = () => {
    setShowLogoutSuccess(false);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    setSearchQuery(query);
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleCart();
  };

  const handleQuantityChange = async (item: CartItem, change: number) => {
    const newQuantity = Math.max(1, item.quantity + change);
    if (newQuantity === item.quantity) return;

    setUpdatingQuantities(prev => ({ ...prev, [item.id]: true }));
    try {
      await updateQuantity(item.cart_item_id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdatingQuantities(prev => ({ ...prev, [item.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Thrift & Gift</span>
            </Link>
            <button className="md:hidden" onClick={handleCartClick}>
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          {/* Search Box */}
          <div className="flex-1 md:mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={handleSearchQueryChange}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center justify-between space-x-8">
            <Link to="/thrift-store" className="text-gray-700 hover:text-blue-600">
              Thrift Store
            </Link>
            <Link to="/clothing-bank" className="text-gray-700 hover:text-blue-600">
              Clothing Bank
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'seller' ? (
                  <Link to="/seller-main" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/orders" className="text-gray-700 hover:text-blue-600">
                    Orders
                  </Link>
                )}
                <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-blue-600">
                  Register
                </Link>
              </>
            )}

            <div className="flex items-center space-x-4">
              {/* Chat Icon */}
              {isAuthenticated && (
                <Link to={`/chat/${otherUserId}`} className="relative">
                  <MessageCircle className="w-6 h-6 text-gray-700 hover:text-blue-600" />
                </Link>
              )}

              {/* Cart Icon */}
              <button onClick={handleCartClick} className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleCart}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <button onClick={toggleCart}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                  <span className="ml-2">Loading cart items...</span>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Link
                    to="/thrift-store"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={toggleCart}
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600">NPR {item.price}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <button
                            onClick={() => handleQuantityChange(item, -1)}
                            disabled={updatingQuantities[item.id]}
                            className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {updatingQuantities[item.id] ? (
                              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, 1)}
                            disabled={updatingQuantities[item.id]}
                            className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          Subtotal: NPR {item.price * item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cart_item_id)}
                        disabled={updatingQuantities[item.id]}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">NPR {totalAmount}</span>
                </div>
                <Link
                  to="/confirm-order"
                  onClick={toggleCart}
                  className="block w-full bg-blue-600 text-white py-2 text-center rounded-full hover:bg-blue-700"
                >
                  Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout Success Modal */}
      {showLogoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Logout Successful</h2>
            <p className="text-gray-600 mb-6">You have been logged out successfully.</p>
            <div className="flex justify-end">
              <button
                onClick={closeLogoutSuccessModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {React.cloneElement(children, { searchQuery })}
      </main>
    </div>
  );
}