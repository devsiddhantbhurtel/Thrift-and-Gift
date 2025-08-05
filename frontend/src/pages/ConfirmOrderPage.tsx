import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, CreditCard, Truck, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { AxiosError } from 'axios';

interface ErrorResponse {
  error?: string;
}

interface SingleOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export function ConfirmOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, removeFromCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'khalti' | 'cod'>('khalti');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<SingleOrderItem[]>([]);

  useEffect(() => {
    // First check for Buy Now flow
    if (location.state?.isBuyNow && location.state?.buyNowItem) {
      const buyNowItem = location.state.buyNowItem;
      const formattedItem = {
        id: buyNowItem.id,
        cart_item_id: buyNowItem.cart_item_id || 'buy-now',
        name: buyNowItem.name,
        price: buyNowItem.price,
        quantity: buyNowItem.quantity || 1,
        image: buyNowItem.image
      };
      setOrderItems([formattedItem]);
    }
    // Only handle cart items if not in buy now flow
    else if (cartItems.length > 0) {
      setOrderItems(cartItems);
    }
    // Only redirect if we're not in buy now flow AND cart is empty
    else if (!location.state?.isBuyNow && cartItems.length === 0) {
      navigate('/thrift-store');
    }
  }, [location.state, cartItems, navigate]);

  // Calculate totals based on orderItems instead of cartItems
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 100;
  const totalAmount = subtotal + shippingCost;

  const createFileFromPath = async (imagePath: string): Promise<File> => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const filename = imagePath.split('/').pop() || 'image.jpg';
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    setError(null);
    setAddressError(null);

    if (!isAuthenticated || !user) {
      setError('You must be logged in to place an order.');
      navigate('/login');
      isValid = false;
    }

    if (orderItems.length === 0) {
      setError('No items to order. Please add items before checking out.');
      navigate('/thrift-store');
      isValid = false;
    }

    if (!shippingAddress.trim()) {
      setAddressError('Please enter your shipping address.');
      isValid = false;
    } else if (shippingAddress.trim().length < 10) {
      setAddressError('Please enter a more detailed shipping address.');
      isValid = false;
    }

    return isValid;
  };

  const clearCart = async () => {
    // Only clear cart items if we're not in Buy Now flow
    if (!location.state?.isBuyNow) {
      const removePromises = cartItems.map(item => removeFromCart(item.id));
      await Promise.all(removePromises);
    }
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create orders for each item
      const orderPromises = orderItems.map(async (item) => {
        const formData = new FormData();
        formData.append('total_amount', (item.price * item.quantity + shippingCost).toString());
        formData.append('shipping_address', shippingAddress);
        formData.append('payment_type', paymentMethod);
        formData.append('order_item', item.id);
        formData.append('order_name', item.name);
        formData.append('quantity', item.quantity.toString());

        try {
          const imageFile = await createFileFromPath(item.image);
          formData.append('order_image', imageFile);
        } catch (error) {
          console.error('Error handling image:', error);
          formData.append('order_image', item.image.split('/').pop() || '');
        }

        return api.post('/orders/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      const orderResponses = await Promise.all(orderPromises);
      const orderIds = orderResponses.map(response => response.data.order_id);

      // Clear the cart after successful order creation
      await clearCart();

      if (paymentMethod === 'khalti') {
        // Initiate Khalti payment for the total amount
        const response = await api.post('/payment/initiate-khalti/', {
          amount: totalAmount * 100,
          purchase_order_id: orderIds.join(','),
          purchase_order_name: orderItems.map(item => item.name).join(', '),
          customer_info: {
            name: user.name,
            email: user.email,
          },
          sender_id: user.user_id,
          item_id: orderItems.map(item => item.id).join(','),
          return_url: `${window.location.origin}/orders`,
          website_url: window.location.origin,
        });

        const paymentUrl = response.data.payment_url;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          throw new Error('Failed to get payment URL from Khalti.');
        }
      } else {
        // For COD, just navigate to orders page
        navigate('/orders');
      }
    } catch (err) {
      const error = err as Error;
      const axiosError = err as AxiosError<ErrorResponse>;
      console.error('Full error:', axiosError.response?.data);
      setError(
        axiosError.response?.data?.error ||
        error.message ||
        'An error occurred while processing your order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}
      
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Confirm Your Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
          <div className="space-y-4">
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 pb-4 border-b">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">NPR {item.price} x {item.quantity}</p>
                  <p className="text-gray-700 font-medium">Subtotal: NPR {item.price * item.quantity}</p>
                </div>
              </div>
            ))}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">NPR {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">NPR {shippingCost}</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="text-gray-600 font-bold">Total</span>
                <span className="font-semibold text-xl">NPR {totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping and Payment Details */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-500" />
              Shipping Address
            </h2>
            <div className="space-y-2">
              <textarea
                value={shippingAddress}
                onChange={(e) => {
                  setShippingAddress(e.target.value);
                  setAddressError(null);
                }}
                placeholder="Enter your detailed shipping address..."
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  addressError ? 'border-red-500' : ''
                }`}
                rows={4}
              />
              {addressError && (
                <p className="text-sm text-red-600">{addressError}</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-green-500" />
              Payment Method
            </h2>
            <div className="space-y-4">
              {/* Pay with Khalti */}
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="khalti"
                  checked={paymentMethod === 'khalti'}
                  onChange={() => setPaymentMethod('khalti')}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <img
                  src="https://th.bing.com/th/id/OIP._yF2a0dkNgF-lP6gY0KEBwHaHa?rs=1&pid=ImgDetMain"
                  alt="Khalti"
                  className="w-8 h-8 object-cover"
                />
                <span className="text-gray-700">Pay with Khalti</span>
              </label>

              {/* Cash on Delivery */}
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <Truck className="w-8 h-8 text-gray-700" />
                <span className="text-gray-700">Cash on Delivery</span>
              </label>
            </div>
          </div>

          {/* Proceed to Payment Button */}
          <button
            onClick={handleProceedToPayment}
            disabled={isSubmitting}
            className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
