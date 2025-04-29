import React, { useEffect, useState } from 'react';
import {
  Star,
  Shirt,
  Ruler,
  CheckCircle,
  RefreshCw,
  Wrench,
  FileText,
  Frown,
  ShoppingCart,
} from 'lucide-react'; // Import ShoppingCart
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Product {
  item_id: number;
  title: string;
  price: number;
  size: string;
  condition: string;
  description: string;
  image: string;
  removed?: boolean;
  average_rating: number;
}

interface ProductQuantity {
  [key: number]: number;
}

interface ThriftStoreProps {
  searchQuery: string;
}

export function ThriftStore({ searchQuery }: ThriftStoreProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<ProductQuantity>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // State for filters
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('clothing/')
      .then((response) => {
        const activeProducts = response.data.filter((product: Product) => !product.removed);
        // Initialize quantities for all products to 1
        const initialQuantities = activeProducts.reduce((acc: ProductQuantity, product: Product) => {
          acc[product.item_id] = 1;
          return acc;
        }, {});
        setQuantities(initialQuantities);
        setProducts(activeProducts);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setIsLoading(false);
      });
  }, []);

  const handleQuantityChange = (productId: number, change: number) => {
    setQuantities(prev => {
      const newQuantity = Math.max(1, (prev[productId] || 1) + change);
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent product card click event
    
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setIsAdding(true);
    try {
      const quantity = quantities[product.item_id] || 1;
      await addToCart({
        id: product.item_id.toString(),
        name: product.title,
        price: product.price,
        image: product.image,
      }, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    setIsAdding(false);
  };

  const handleLoginPromptConfirm = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  const handleLoginPromptCancel = () => {
    setShowLoginPrompt(false);
  };

  const handleProductClick = (item_id: number) => {
    navigate(`/product/${item_id}`);
  };

  // Filter and sort products based on search query, condition, size, and price filter
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCondition = selectedCondition
        ? product.condition.toLowerCase() === selectedCondition.toLowerCase()
        : true;
      const matchesSize = selectedSize ? product.size.toLowerCase() === selectedSize.toLowerCase() : true;
      return matchesSearch && matchesCondition && matchesSize;
    })
    .sort((a, b) => {
      if (selectedPriceFilter === 'low-to-high') {
        return a.price - b.price; // Sort by price: lowest to highest
      } else if (selectedPriceFilter === 'high-to-low') {
        return b.price - a.price; // Sort by price: highest to lowest
      } else {
        return 0; // No sorting
      }
    });

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row p-4 md:p-8">
      {/* Filter Section */}
      <div className="md:w-1/5 lg:w-1/6 p-4 bg-white shadow-md rounded-lg mb-4 md:mb-0 md:mr-4">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        {/* Condition Filter */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Condition</h3>
          <select
            value={selectedCondition || ''}
            onChange={(e) => setSelectedCondition(e.target.value || null)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
        </div>

        {/* Size Filter */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Size</h3>
          <select
            value={selectedSize || ''}
            onChange={(e) => setSelectedSize(e.target.value || null)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="xl">XL</option>
          </select>
        </div>

        {/* Price Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Price</h3>
          <select
            value={selectedPriceFilter || ''}
            onChange={(e) => setSelectedPriceFilter(e.target.value || null)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">None</option>
            <option value="low-to-high">Lowest to Highest</option>
            <option value="high-to-low">Highest to Lowest</option>
          </select>
        </div>
      </div>

      {/* Product Section */}
      <div className="md:flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.item_id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer w-full"
              >
                <div onClick={() => handleProductClick(product.item_id)}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="p-6">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Shirt className="w-6 h-6 text-gray-700" /> {product.title}
                    </h1>
                    <h2 className="text-lg font-semibold text-gray-600 mt-2 flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-gray-600" /> {product.size}
                    </h2>
                    <h3 className="text-md font-medium text-gray-500 mt-2 flex items-center gap-2">
                      {product.condition.toLowerCase() === 'new' ? (
                        <Star className="w-5 h-5 text-yellow-500" />
                      ) : product.condition.toLowerCase() === 'used' ? (
                        <RefreshCw className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Wrench className="w-5 h-5 text-green-500" />
                      )}
                      {product.condition}
                    </h3>
                    <div className="flex items-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= product.average_rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">
                        ({product.average_rating.toFixed(1)})
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mt-4">NPR {product.price}</p>
                  </div>
                </div>

                {/* Quantity Controls and Add to Cart */}
                <div className="p-4 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => handleQuantityChange(product.item_id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="text-lg font-medium">{quantities[product.item_id] || 1}</span>
                      <button
                        onClick={(e) => handleQuantityChange(product.item_id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isAdding}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <Frown className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-xl text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">Please login to add items to your cart.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleLoginPromptCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleLoginPromptConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}