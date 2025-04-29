import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Order {
  order_id: number;
  user: {
    user_id: number;
    name: string;
  };
  order_date: string;
  total_amount: number;
  order_status: string;
  shipping_address: string;
  payment_type: string;
  order_name: string;
}

interface Payment {
  payment_id: number;
  amount: number;
  payment_date: string;
  payment_status: string;
  sender: {
    user_id: number;
    name: string;
  };
  item: {
    item_id: number;
    title: string;
    name: string;
  };
}

interface OrderStatus {
  value: string;
  label: string;
  color: string;
}

interface PaymentStatus {
  value: string;
  label: string;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const { user, getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderStatuses: OrderStatus[] = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  const paymentStatuses: PaymentStatus[] = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, paymentsResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/orders/admin-dashboard/', {
            headers: { Authorization: `Bearer ${getToken()}` }
          }),
          axios.get('http://localhost:8000/api/payment/admin-dashboard/', {
            headers: { Authorization: `Bearer ${getToken()}` }
          })
        ]);

        setOrders(ordersResponse.data);
        setPayments(paymentsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  const handleOrderStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      console.log('Sending status update:', { orderId, newStatus }); // Debug log
      
      await axios.put(
        `http://localhost:8000/api/orders/${orderId}/update_status/`,
        { order_status: newStatus }, // Changed from status to order_status
        { 
          headers: { 
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      setOrders(orders.map(order => 
        order.order_id === orderId 
          ? { ...order, order_status: newStatus }
          : order
      ));

      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data); // Debug log
      }
      toast.error('Failed to update order status');
    }
  };

  const handlePaymentStatusUpdate = async (paymentId: number, newStatus: string) => {
    try {
      console.log('Sending payment status update:', { paymentId, newStatus }); // Debug log

      await axios.put(
        `http://localhost:8000/api/payment/${paymentId}/update_status/`,
        { payment_status: newStatus }, // Changed from status to payment_status
        { 
          headers: { 
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      setPayments(payments.map(payment => 
        payment.payment_id === paymentId 
          ? { ...payment, payment_status: newStatus }
          : payment
      ));

      toast.success('Payment status updated successfully');
    } catch (error) {
      console.error('Error updating payment status:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data); // Debug log
      }
      toast.error('Failed to update payment status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals with safety checks
  const totalOrderAmount = Array.isArray(orders) 
    ? orders.reduce((sum, order) => sum + order.total_amount, 0)
    : 0;
    
  const totalPaymentAmount = Array.isArray(payments)
    ? payments.reduce((sum, payment) => sum + payment.amount, 0)
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Hello Admin, {user?.name}! 👋
        </h1>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            Welcome to your admin dashboard. As a superuser, you have access to special administrative privileges.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Orders Summary</h2>
            <div className="space-y-2">
              <p>Total Orders: {orders.length}</p>
              <p>Total Amount: NPR {totalOrderAmount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payments Summary</h2>
            <div className="space-y-2">
              <p>Total Payments: {payments.length}</p>
              <p>Total Amount: NPR {totalPaymentAmount}</p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            {orders.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.order_id}>
                      <td className="px-6 py-4 whitespace-nowrap">{order.order_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.user.name} (ID: {order.user.user_id})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.order_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">NPR {order.total_amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.order_status}
                          onChange={(e) => handleOrderStatusUpdate(order.order_id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs ${
                            orderStatuses.find(status => status.value === order.order_status)?.color
                          }`}
                        >
                          {orderStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.shipping_address}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.payment_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(order.order_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-4">No orders found</p>
            )}
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
          <div className="overflow-x-auto">
            {payments.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.payment_id}>
                      <td className="px-6 py-4 whitespace-nowrap">{payment.payment_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.sender.name} (ID: {payment.sender.user_id})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{payment.item.title || payment.item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">NPR {payment.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={payment.payment_status}
                          onChange={(e) => handlePaymentStatusUpdate(payment.payment_id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs ${
                            paymentStatuses.find(status => status.value === payment.payment_status)?.color
                          }`}
                        >
                          {paymentStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-4">No payments found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 