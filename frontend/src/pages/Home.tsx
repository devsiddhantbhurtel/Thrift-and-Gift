import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Plus, Minus, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { ClothingBank } from './ClothingBank';

// Defining types for featured products and categories
interface Product {
  item_id: number;
  title: string;
  price: number;
  image: string;
  condition: string;
  size: string;
}

interface Category {
  name: string;
  image: string;
}

// const categories: Category[] = [
//   {
//     name: 'WINTER WEAR',
//     image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=400',
//   },
//   {
//     name: 'SUMMER WEAR',
//     image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=400',
//   },
//   {
//     name: 'CASUAL WEAR',
//     image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=400',
//   },
//   {
//     name: 'DRESSES',
//     image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=400',
//   },
//   {
//     name: 'JEANS',
//     image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=400',
//   },
//   {
//     name: 'UNIFORMS',
//     image: 'https://images.unsplash.com/photo-1580657018950-c7f7d6a6d990?auto=format&fit=crop&q=80&w=400',
//   },
// ];

interface ProductQuantity {
  [key: number]: number;
}

export function Home() {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<ProductQuantity>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingProduct, setUpdatingProduct] = useState<number | null>(null);

  useEffect(() => {
    const fetchRandomItems = async () => {
      try {
        const response = await api.get('clothing/random_items/');
        const products = response.data;
        setFeaturedProducts(products);
        // Initialize quantities
        const initialQuantities = products.reduce((acc: ProductQuantity, product: Product) => {
          acc[product.item_id] = 1;
          return acc;
        }, {});
        setQuantities(initialQuantities);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load featured items');
        setIsLoading(false);
      }
    };

    fetchRandomItems();
  }, []);

  const handleQuantityChange = (productId: number, change: number) => {
    setQuantities(prev => {
      const newQuantity = Math.max(1, (prev[productId] || 1) + change);
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleAddToCart = async (product: Product) => {
    setUpdatingProduct(product.item_id);
    try {
      await addToCart({
        id: product.item_id.toString(),
        name: product.title,
        price: product.price,
        image: product.image,
      }, quantities[product.item_id] || 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setUpdatingProduct(null);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Link to="/thrift-store" className="block">
          <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
              alt="Thrift Store"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Thrift Store</h2>
              <p className="text-gray-600 mb-4">
                Find affordable, high-quality second-hand clothes for every occasion. Shop sustainably and save money!
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                Explore Thrift Store
              </button>
            </div>
          </div>
        </Link>

        <Link to="/clothing-bank" className="block">
          <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <img
              src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=800"
              alt="Clothing Bank"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Clothing Bank</h2>
              <p className="text-gray-600 mb-4">
                Donate your unused clothes to those in need. Together, we can reduce waste and make a difference.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                Explore Clothing Bank
              </button>
            </div>
          </div>
        </Link>
      </div>

      {/* Categories */}
      {/* <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category: Category, index: number) => (
              <div key={index} className="flex-none w-64">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <img src={category.image} alt={category.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-center">{category.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section> */}

      {/* Featured Items */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Items</h2>
        {isLoading ? (
          <div className="text-center py-8">Loading featured items...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.item_id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">Size: {product.size}</span>
                    <span className="text-sm text-gray-600">• {product.condition}</span>
                  </div>
                  <p className="text-gray-600 mb-4">NPR {product.price}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(product.item_id, -1)}
                        disabled={updatingProduct === product.item_id}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-medium w-8 text-center">
                        {quantities[product.item_id] || 1}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product.item_id, 1)}
                        disabled={updatingProduct === product.item_id}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-600">
                      Total: NPR {(product.price * (quantities[product.item_id] || 1)).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={updatingProduct === product.item_id}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {updatingProduct === product.item_id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <span>Add to Cart</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Give Your Clothes a Second Life</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Have clothes you no longer need? Add them as donation posts and help those in need. Looking for clothes
          instead? Submit a request for items, and we'll connect you with donors.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/clothing-bank">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
            Donate Clothes
          </button>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-full border border-blue-600 hover:bg-blue-50 transition-colors">
            Request Clothes
          </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
