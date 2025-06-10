import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const fetchSubscriptionsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/subscriptions?category=${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};

export const fetchSubscriptionDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/subscriptions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    throw error;
  }
};