import React, { useState, useEffect } from 'react';
import { adminService, listingService } from '../services/apiService';
import GradientPicker from './GradientPicker';

const AdminHomepageFeatured = () => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState('');
  const [rank, setRank] = useState(1);
  const [gradient, setGradient] = useState('from-blue-600 via-purple-600 to-purple-700');
  const [border, setBorder] = useState('border-purple-700/30');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await listingService.getApproved();
        setListings(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to fetch listings');
      }
    };
    fetchListings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await adminService.addHomepageFeaturedSubscription(selectedListing, rank, gradient, border);
      setSuccess('Homepage featured subscription added successfully');
      setSelectedListing('');
      setRank(1);
    } catch (err) {
      setError(err.message || 'Failed to add featured subscription');
    }
  };

  const handleGradientChange = ({ gradient, border }) => {
    setGradient(gradient);
    setBorder(border);
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">Manage Homepage Featured Subscriptions</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Select Listing</label>
          <select
            value={selectedListing}
            onChange={(e) => setSelectedListing(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded"
            required
          >
            <option value="">Select a listing</option>
            {listings.map((listing) => (
              <option key={listing._id} value={listing._id}>
                {listing.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Rank (1-8)</label>
          <input
            type="number"
            value={rank}
            onChange={(e) => setRank(parseInt(e.target.value))}
            min="1"
            max="8"
            className="w-full p-2 bg-gray-800 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Gradient & Border</label>
          <GradientPicker onChange={handleGradientChange} />
        </div>
        {error && <p className="text-red-400">{error}</p>}
        {success && <p className="text-green-400">{success}</p>}
        <button type="submit" className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700">
          Add Featured Subscription
        </button>
      </form>
    </div>
  );
};

export default AdminHomepageFeatured;