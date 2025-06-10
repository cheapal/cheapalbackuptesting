// src/context/SearchContext.js
import React, { createContext, useState, useCallback } from 'react';
import { orderService } from '../services/apiService';
import { toast } from 'react-toastify';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ subscriptions: [], sellers: [] });
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    timePeriod: 'all', // Options: 'all', '30days', '90days', 'year'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = useCallback(async (query, appliedFilters = filters) => {
    if (!query.trim()) {
      setSearchResults({ subscriptions: [], sellers: [] });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock API call; replace with actual orderService.search endpoint
      const response = await orderService.search({
        query,
        status: appliedFilters.status,
        category: appliedFilters.category,
        timePeriod: appliedFilters.timePeriod,
      });

      // Example response structure
      const results = {
        subscriptions: response.subscriptions || [],
        sellers: response.sellers || [],
      };

      setSearchResults(results);
    } catch (err) {
      setError(err.message || 'Failed to perform search.');
      toast.error('Search failed. Please try again.');
      setSearchResults({ subscriptions: [], sellers: [] });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    if (searchQuery) {
      performSearch(searchQuery, { ...filters, ...newFilters });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ subscriptions: [], sellers: [] });
    setFilters({ status: '', category: '', timePeriod: 'all' });
    setError(null);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        filters,
        updateFilters,
        performSearch,
        clearSearch,
        loading,
        error,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};