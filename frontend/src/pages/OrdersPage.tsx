import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, Clock, Package, XCircle } from 'lucide-react';
import { Modal } from "../components/Modal";
import { toast } from "react-hot-toast";
import { Star } from "lucide-react";

interface Order {
  order_id: number;
  user: {
    user_id: number;
    name: string;
  };
  order_date: string;
  total_amount: number;
  order_status: string;
  order_payment_id: number;
  shipping_address: string;
  order_name: string;
  order_image: string;
  order_item: number;
}

interface Review {
  rating: number;
  comment: string;
  product_item: number;
  order?: number;
}

export function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [newReview, setNewReview] = useState<Review>({
    rating: 0,
    comment: '',
    product_item: 0,
    order: undefined
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    // Fetch orders for the authenticated user
    api
      .get('orders/')
      .then((response) => {
        setOrders(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError('Failed to load orders');
        setIsLoading(false);
        console.error('Error fetching orders:', error);
      });

    // Verify payment if token and order_id are present
    const token = searchParams.get('token');
    const order_id = searchParams.get('order_id');
    if (token && order_id) {
      api
        .get(`/payment/verify-khalti/?token=${token}&order_id=${order_id}`)
        .then((response) => {
          console.log('Payment verified:', response.data);
          // Update the order status in the frontend
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.order_id === parseInt(order_id)
                ? { ...order, order_status: response.data.payment_status === 'Completed' ? 'paid' : 'payment_failed' }
                : order
            )
          );
        })
        .catch((error) => {
          console.error('Payment verification failed:', error);
        });
    }
  }, [isAuthenticated, navigate, searchParams]);

  const calculateDeliveryDate = (orderDate: string): string => {
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return deliveryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const checkDeliveryDate = (order: Order) => {
    const deliveryDate = new Date(order.order_date);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    
    const today = new Date();
    
    return (
      deliveryDate.getDate() === today.getDate() &&
      deliveryDate.getMonth() === today.getMonth() &&
      deliveryDate.getFullYear() === today.getFullYear() &&
      (order.order_status === 'pending' || order.order_status === 'shipped')
    );
  };

  const handleOrderStatusUpdate = async (orderId: number, status: string) => {
    try {
      const response = await api.put(`/orders/${orderId}/update_status/`, {
        order_status: status
      });
      
      if (response.status === 200) {
        // Update orders state with new status
        setOrders(orders.map(order => 
          order.order_id === orderId 
            ? { ...order, order_status: status }
            : order
        ));
        
        
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  useEffect(() => {
    orders.forEach(order => {
      if (checkDeliveryDate(order)) {
        setCurrentOrder(order);
        setOpenDialog(true);
      }
    });
  }, [orders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const handleAddReview = async (order: Order) => {
    try {
      // Add debug logs
      console.log('Starting review submission...', { order, newReview });

      // Validate required fields
      if (!order.order_item) {
        console.error('Order item ID is missing:', order);
        toast.error('Invalid order data. Please try again.');
        return;
      }

      if (!newReview.rating || !newReview.comment.trim()) {
        console.log('Validation failed:', { 
          hasRating: !!newReview.rating,
          hasComment: !!newReview.comment.trim()
        });
        toast.error('Please fill in all required fields');
        return;
      }

      const reviewData = {
        rating: parseInt(newReview.rating.toString()),
        comment: newReview.comment.trim(),
        product_item: order.order_item,
        order: order.order_id
      };

      console.log('Sending review data:', reviewData);

      const response = await api.post('reviews/', reviewData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Review submission response:', response);

      if (response.status === 201) {
        toast.success('Review added successfully');
        setShowReviewModal(false);
        setNewReview({
          rating: 0,
          comment: '',
          product_item: 0,
          order: undefined
        });
      }
    } catch (error: any) {
      console.error('Error adding review:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.data) {
        const errorMessage = typeof error.response.data === 'object' 
          ? Object.values(error.response.data).join('\n')
          : error.response.data;
        toast.error(errorMessage);
      } else {
        toast.error('Failed to add review. Please try again.');
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading orders...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">{error}</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.order_id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order #{order.order_id}</h2>
                <p className="text-gray-600">{new Date(order.order_date).toLocaleDateString()}</p>
              </div>
              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex items-center space-x-6">
                  <img
                    src={order.order_image}
                    alt={order.order_name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-medium">Order Name: {order.order_name}</h3>
                      </div>
                      <p className="text-lg font-semibold">Total: NPR {order.total_amount}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-600">
                        <span className="font-medium">Shipping Address:</span> {order.shipping_address}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Delivery Date:</span> {calculateDeliveryDate(order.order_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.order_status)}
                  <p className={`text-lg font-medium ${
                    order.order_status === 'cancelled' ? 'text-red-500' :
                    order.order_status === 'completed' ? 'text-green-500' :
                    order.order_status === 'shipped' ? 'text-blue-500' :
                    order.order_status === 'paid' ? 'text-green-500' :
                    'text-yellow-500'
                  }`}>
                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                  </p>
                </div>
                
                {order.order_status === 'completed' && (
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setNewReview({
                        rating: 0,
                        comment: '',
                        product_item: order.order_item,
                        order: order.order_id
                      });
                      setShowReviewModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Write Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Package className="w-16 h-16 text-gray-400" />
          <p className="text-xl font-semibold text-gray-600">No orders found</p>
        </div>
      )}

      

      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <div className="flex items-center gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${
                      star <= newReview.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                    }`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedOrder && handleAddReview(selectedOrder)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!newReview.rating || !newReview.comment}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
