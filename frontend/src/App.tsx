import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ThriftStore } from './pages/ThriftStore';
import { ClothingBank } from './pages/ClothingBank';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import SellerDashboard from './pages/SellerDashboard';
import DonatorDashboard from './pages/DonatorDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerMain from './pages/SellerMain';
import EditProduct from './pages/EditProduct';
import EditDonation from './pages/EditDonations';
import { ProductPage } from './pages/ProductsPage';
import ProductOptions from './pages/ProductOptions';
import { OrdersPage } from './pages/OrdersPage';
import { ConfirmOrderPage } from './pages/ConfirmOrderPage';
import ChatPage from './pages/ChatPage'; // Import the ChatPage
import AdminDashboard from './components/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <ToastContainer />
      <Router>
        <AuthProvider>
          <CartProvider>
            <Layout setSearchQuery={setSearchQuery}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/product/:item_id" element={<ProductPage />} />

                {/* Protected routes (accessible to all authenticated users) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/thrift-store" element={<ThriftStore searchQuery={searchQuery} />} />
                  <Route path="/clothing-bank" element={<ClothingBank searchQuery={searchQuery} />} />
                  <Route path="/chat/:otherUserId" element={<ChatPage />} />
                </Route>

                {/* Role-specific routes */}
                <Route element={<ProtectedRoute role="seller" />}>
                  <Route path="/seller-dashboard" element={<SellerDashboard />} />
                  <Route path="/seller-main" element={<SellerMain />} />
                  <Route path="/edit-product" element={<EditProduct />} />
                  <Route path="/product-options" element={<ProductOptions />} />
                  <Route path="/donator-dashboard" element={<DonatorDashboard />} />
                  <Route path="/edit-donation" element={<EditDonation />} />
                </Route>

                <Route element={<ProtectedRoute role="buyer" />}>
                  <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/confirm-order" element={<ConfirmOrderPage />} /> {/* Accessible only to buyers */}
                </Route>

                <Route element={<ProtectedRoute requireSuperuser={true} />}>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Route>
              </Routes>
            </Layout>
          </CartProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;