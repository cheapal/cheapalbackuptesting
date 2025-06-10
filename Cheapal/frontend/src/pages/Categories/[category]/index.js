import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSubscriptionsByCategory } from '../../../../api/subscriptions';
import SubscriptionList from '../../../components/subscriptions/SubscriptionList';
import FilterBar from '../../../components/UI/FilterBar';
import MainLayout from '../../../components/Layout/MainLayout';

function CategoryPage() {
  const { category } = useParams();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    sort: 'name-asc'
  });

  useEffect(function() {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchSubscriptionsByCategory(category);
        setSubscriptions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [category]);

  const filteredSubscriptions = subscriptions.filter(function(sub) {
    return sub.name.toLowerCase().includes(filters.search.toLowerCase());
  }).sort(function(a, b) {
    // Sorting logic based on filters.sort
    if (filters.sort === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (filters.sort === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <FilterBar 
          searchValue={filters.search}
          onSearchChange={function(e) { setFilters({...filters, search: e.target.value}); }}
          sortValue={filters.sort}
          onSortChange={function(e) { setFilters({...filters, sort: e.target.value}); }}
        />
        
        <SubscriptionList 
          subscriptions={filteredSubscriptions} 
          loading={loading}
          category={category}
        />
      </div>
    </MainLayout>
  );
}

export default CategoryPage;