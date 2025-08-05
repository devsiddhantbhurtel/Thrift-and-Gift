import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MessageCircle, ThumbsUp, Ruler, Wrench, RefreshCw, FileText, Share2, Heart, MapPin, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { Modal } from '../components/Modal'; // Import the Modal component

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
}

interface Review {
  reviewer_user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  product_item: number;
}

export function ProductPage() {
  const { item_id } = useParams<{ item_id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the authenticated user
  const { cartItems, addToCart } = useCart(); // Get cart items and addToCart function
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false); // State for seller modal
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);

  useEffect(() => {
    if (!item_id) {
      setError('Product ID is missing');
      setIsLoading(false);
      return;
    }

    api.get(`clothing/${item_id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch(() => {
        setError('Failed to load product');
      })
      .finally(() => {
        setIsLoading(false);
      });

    api.get(`reviews/?product_item=${item_id}`)
      .then((response) => {
        const filteredReviews = response.data.filter(
          (review: Review) => review.product_item === parseInt(item_id)
        );
        setReviews(filteredReviews);
      })
      .catch(() => {
        setError('Failed to load reviews');
      });
  }, [item_id]);

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    try {
      await api.post('cart/', {
        item_id: product.item_id,
        quantity: quantity,
      });

      addToCart({
        id: product.item_id.toString(),
        name: product.title,
        price: product.price,
        image: product.image,
      });

      alert(`Added ${quantity} ${product.title}(s) to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add the product to the cart.');
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

    // Check if cart is empty
    if (cartItems.length === 0) {
      setShowEmptyCartModal(true);
      return;
    }

    // Navigate to the Confirm Order Page for buyers
    navigate('/confirm-order', { state: { product, quantity } });
  };

  const handleShare = async () => {
    const productUrl = window.location.href;
    const shareData = {
      title: product?.title || 'Check out this product!',
      text: product?.description || 'Amazing product available for purchase.',
      url: productUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(productUrl);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share the product.');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setHoverPosition({ x, y });
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image Section */}
        <div
          className="relative overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full max-w-md rounded-lg shadow-lg transition-transform duration-300 ease-in-out"
            style={{
              transform: isHovered ? 'scale(1.5)' : 'scale(1)',
              transformOrigin: `${hoverPosition.x}% ${hoverPosition.y}%`,
            }}
          />
          {isHovered && (
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
          )}
        </div>

        {/* Product Details Section */}
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
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full px-6 py-3 rounded-lg transition-colors duration-300 ease-in-out ${
                isAdding ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
              <Heart className="w-5 h-5 text-gray-700" />
              <span>Wishlist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-500" />
          Customer Reviews
        </h2>

        <div className="space-y-6 mt-6">
          {reviews.map((review, index) => (
            <div key={index} className="border-t pt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 font-semibold">{review.reviewer_user_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Verified Purchase</span>
                  </div>
                  <span className="text-gray-400">·</span>
                  <p className="text-gray-400 text-sm">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-gray-600 mt-1">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seller Modal */}
      <Modal isOpen={showSellerModal} onClose={() => setShowSellerModal(false)}>
        <h2 className="text-xl font-bold mb-4">Restricted Action</h2>
        <p className="text-gray-600">Only buyers can purchase products. Sellers are not allowed to buy.</p>
      </Modal>

      {/* Empty Cart Modal */}
      <Modal isOpen={showEmptyCartModal} onClose={() => setShowEmptyCartModal(false)}>
        <h2 className="text-xl font-bold mb-4">Empty Cart</h2>
        <p className="text-gray-600">Please add items to your cart before proceeding to checkout.</p>
      </Modal>
    </div>
  );
}
