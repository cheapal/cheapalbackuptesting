import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCompleteOrder = async () => {
    try {
      setLoadingComplete(true);
      await axios.put(`/api/orders/${id}/complete`);
      setOrder(prev => ({ ...prev, status: 'completed' }));
      toast.success('Order marked as completed!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoadingComplete(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Order Details</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-gray-800">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold dark:text-white">{order.subscription.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">Order #{order._id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
              order.status === 'paid' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-2 dark:text-white">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Price</span>
                  <span className="font-medium dark:text-white">${order.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Duration</span>
                  <span className="font-medium dark:text-white">{order.subscription.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Order Date</span>
                  <span className="font-medium dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 dark:text-white">Seller Information</h3>
              <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {order.seller.avatar ? (
                      <img src={order.seller.avatar} alt={order.seller.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-600">
                        {order.seller.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="font-medium dark:text-white">{order.seller.name}</span>
                </div>
                <div className="mt-2">
                  <Link 
                    to={`/chat/${order._id}`}
                    className="text-sm text-primaryLight hover:underline"
                  >
                    Contact Seller
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {order.status === 'delivered' && order.credentials && (
            <div className="mb-6">
              <h3 className="font-medium mb-2 dark:text-white">Subscription Credentials</h3>
              <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Username</label>
                    <p className="font-medium dark:text-white">{order.credentials.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Password</label>
                    <p className="font-medium dark:text-white">{order.credentials.password}</p>
                  </div>
                  {order.credentials.otherDetails && (
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-500 dark:text-gray-400">Additional Details</label>
                      <p className="font-medium dark:text-white">{order.credentials.otherDetails}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-4">
            {order.status === 'delivered' && (
              <button
                onClick={handleCompleteOrder}
                disabled={loadingComplete}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md disabled:opacity-50"
              >
                {loadingComplete ? 'Processing...' : 'Mark as Completed'}
              </button>
            )}
            <Link
              to={`/chat/${order._id}`}
              className="px-4 py-2 bg-primaryLight hover:bg-primaryDark text-white font-medium rounded-md"
            >
              View Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;