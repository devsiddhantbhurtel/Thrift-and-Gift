import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MessageCircle, ThumbsUp, Ruler, Wrench, RefreshCw, FileText, Share2, Heart, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface Product {
  item_id: number;
  title: string;
  price: number;
  size: string;
  condition: string;
  description: string;
  image: string;
  location: string;
  tags: string;
  average_rating: number;
}

interface Review {
  reviewer_user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export function ProductPage() {
  const { item_id } = useParams<{ item_id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);

  useEffect(() => {
    if (!item_id) {
      setError('Product ID is missing');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          api.get(`clothing/${item_id}`),
          api.get(`reviews/?product_item=${item_id}`)
        ]);

        setProduct(productRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        setError('Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [item_id]);

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      await addToCart({
        id: product.item_id.toString(),
        name: product.title,
        price: product.price,
        image: product.image,
      }, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // Check if the user is a seller
    if (user?.role === 'seller') {
      setShowSellerModal(true); // Show the seller modal
      return;
    }

    // Check if user is authenticated
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Navigate to individual confirm order page with product data
    navigate('/individual-confirm-order', {
      state: {
        product: {
          id: product.item_id.toString(),
          name: product.title,
          price: product.price,
          quantity: quantity,
          image: product.image
        }
      }
    });
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">{error}</div>;
  if (!product) return <div className="flex items-center justify-center h-screen">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-3xl font-semibold text-gray-700">NPR {product.price}</p>
          
          <div className="flex items-center gap-2">
            <Ruler className="w-6 h-6 text-gray-600" />
            <p className="text-lg text-gray-600">Size: {product.size}</p>
          </div>

          <div className="flex items-center gap-2">
            {product.condition.toLowerCase() === 'new' ? (
              <ThumbsUp className="w-6 h-6 text-green-500" />
            ) : product.condition.toLowerCase() === 'refurbished' ? (
              <Wrench className="w-6 h-6 text-orange-500" />
            ) : (
              <RefreshCw className="w-6 h-6 text-blue-500" />
            )}
            <p className="text-lg text-gray-600">Condition: {product.condition}</p>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-gray-500" />
            <p className="text-lg text-gray-600">Location: {product.location}</p>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-gray-500" />
            <p className="text-lg text-gray-600">Tags: {product.tags}</p>
          </div>

          {/* Rating Display */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= product.average_rating
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg text-gray-600">
              ({product.average_rating.toFixed(1)})
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-4">
            <p className="text-lg text-gray-600">Quantity:</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex-1 px-6 py-3 rounded-lg transition-colors duration-300 ease-in-out ${
                isAdding ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Proceed to checkoutdfsdf
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-500" />
          Customer Reviews
        </h2>

        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="border-t pt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 font-semibold">{review.reviewer_user_name}</p>
                </div>
                <p className="text-gray-400 text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 