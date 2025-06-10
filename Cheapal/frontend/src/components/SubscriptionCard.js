// import { Link } from 'react-router-dom';

// const SubscriptionCard = ({ subscription, accentColor = 'neon-blue' }) => {
//   return (
//     <div className={`glass-card rounded-xl overflow-hidden border border-${accentColor}/20 hover:shadow-neon transition-all duration-300`}>
//       <div className="p-5">
//         <div className="flex justify-between items-start mb-4">
//           <h3 className={`text-lg font-semibold text-${accentColor}`}>
//             {subscription.title}
//           </h3>
//           <span 
//             className={`text-xs px-2 py-1 rounded-full bg-${accentColor}/20 text-${accentColor}`}
//           >
//             {subscription.category}
//           </span>
//         </div>
        
//         <div className="flex justify-between items-center mt-6">
//           <div>
//             <span className={`text-xl font-bold text-${accentColor}`}>
//               ${subscription.price}
//             </span>
//             <span className="text-sm text-gray-400 ml-1">
//               /{subscription.duration}
//             </span>
//           </div>
          
//           <Link
//             to={`/subscriptions/${subscription.id}`}
//             className={`px-4 py-2 rounded-md text-sm font-medium bg-${accentColor} text-dark-bg hover:shadow-neon transition-all`}
//           >
//             View Details
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionCard;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';

const SubscriptionCard = ({ 
  subscription, 
  accentColor = 'neon-blue'
}) => {
  const { user, refreshAuth } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Verify server status
      const { data: status } = await axios.get('/api/auth/status');
      if (!status.ready) {
        throw new Error('Server is currently unavailable. Please try again later.');
      }

      // 2. Check if user needs to register
      if (!user) {
        throw new Error('Please login to subscribe');
      }

      // 3. Process subscription
      const { data } = await axios.post('/api/subscriptions', {
        userId: user._id,
        serviceId: subscription._id,
        price: subscription.price,
        billingCycle: subscription.duration
      });

      if (data.success) {
        setIsSubscribed(true);
        await refreshAuth(); // Refresh user data
        toast.success('Subscription successful!');
      }
    } catch (err) {
      let errorMessage = 'Subscription failed';
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Please login to subscribe';
            break;
          case 409:
            errorMessage = 'You already have an active subscription';
            setIsSubscribed(true);
            break;
          case 503:
            errorMessage = 'Server is currently unavailable';
            break;
          default:
            errorMessage = err.response.data?.message || errorMessage;
        }
      } else {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Add to your listing card
{listing.isPaused ? (
  <button 
    onClick={() => handleResumeListing(listing._id)}
    className="text-sm text-blue-400 hover:underline"
  >
    Resume
  </button>
) : (
  <button 
    onClick={() => handlePauseListing(listing._id)}
    className="text-sm text-yellow-400 hover:underline"
  >
    Pause
  </button>
)}

// Add these handler functions
const handlePauseListing = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/subscriptions/${id}/pause`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to pause listing');
    }

    fetchMySubscriptions();
  } catch (err) {
    setError(err.message);
  }
};

const handleResumeListing = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/subscriptions/${id}/resume`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to resume listing');
    }

    fetchMySubscriptions();
  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div className={`glass-card rounded-xl overflow-hidden border border-${accentColor}/20 hover:shadow-neon transition-all duration-300`}>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2">
          <p>{error}</p>
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-lg font-semibold text-${accentColor}`}>
            {subscription.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full bg-${accentColor}/20 text-${accentColor}`}>
            {subscription.category}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div>
            <span className={`text-xl font-bold text-${accentColor}`}>
              ${subscription.price}
            </span>
            <span className="text-sm text-gray-400 ml-1">
              /{subscription.duration}
            </span>
          </div>
          
          {!user ? (
            <Link
              to="/login"
              className={`px-4 py-2 rounded-md text-sm font-medium bg-${accentColor} text-dark-bg hover:shadow-neon transition-all`}
            >
              Login to Subscribe
            </Link>
          ) : isSubscribed ? (
            <span className="px-4 py-2 rounded-md text-sm font-medium bg-green-500 text-white">
              Subscribed ✓
            </span>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-sm font-medium bg-${accentColor} text-dark-bg hover:shadow-neon transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Subscribe'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;