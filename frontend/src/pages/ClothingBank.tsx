import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Shirt, Ruler, FileText, Phone, X, Frown } from 'lucide-react';

interface Donation {
  donation_id: number;
  donator_user: number;  // This should be the user_id of the donator
  username: string;
  phonenumber: string;
  category: string;
  size: string;
  description: string;
  image: string;
  removed?: boolean;  // Add this field
}

interface ClothingBankProps {
  searchQuery: string; // Add searchQuery prop
}

export function ClothingBank({ searchQuery }: ClothingBankProps) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchDonations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/clothing_bank/');
      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }
      const data: Donation[] = await response.json();
      // Filter out removed donations
      const activeDonations = data.filter(donation => !donation.removed);
      setDonations(activeDonations);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []); // Fetch data on component mount

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Filter donations based on searchQuery
  const filteredDonations = donations.filter((donation) =>
    donation.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading donations...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=1200"
            alt="Clothing Bank"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Give Clothes, Spread Warmth!</h1>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">Clothing Donations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredDonations.length > 0 ? (
          filteredDonations.map((donation) => (
            <div
              key={donation.donation_id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <User className="w-6 h-6 text-gray-500 mr-2" />
                  <span className="font-semibold text-gray-800">
                    {donation.username.charAt(0).toUpperCase() + donation.username.slice(1)}
                  </span>
                </div>

                <div className="mb-4 space-y-3">
                  <div className="flex items-center">
                    <Shirt className="w-5 h-5 text-gray-500 mr-2" />
                    <p className="text-gray-600">
                      <span className="font-semibold">Category:</span> {donation.category}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <Ruler className="w-5 h-5 text-gray-500 mr-2" />
                    <p className="text-gray-600">
                      <span className="font-semibold">Size:</span> {donation.size}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-500 mr-2" />
                    <p className="text-gray-600">
                      <span className="font-semibold">Description:</span> {donation.description}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-500 mr-2" />
                    <p className="text-gray-600">
                      <span className="font-semibold">Phone:</span> {donation.phonenumber}
                    </p>
                  </div>
                </div>

                {donation.image && (
                  <div
                    className="cursor-pointer"
                    onClick={() => openImageModal(donation.image)}
                  >
                    <img
                      src={`${donation.image}${donation.image.includes('?') ? '&' : '?'}auto=format&fit=crop&q=80&w=800`}
                      alt={donation.category}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  </div>
                )}

                <Link 
                  to={`/chat/${donation.donator_user}`}  // Use donator_user instead of hardcoded ID
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Chat with {donation.username}</span>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center space-y-4 py-12">
    <Frown className="w-16 h-16 text-gray-400" /> {/* Add an icon */}
    <p className="text-xl font-semibold text-gray-600">No donations match your search</p>
    <p className="text-gray-500 text-center">
      Try adjusting your search or check back later for new donations.
    </p>
  </div>

        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl relative">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <img
              src={selectedImage}
              alt="Full Size"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}