import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { reviewService } from '../services/apiService';

const RespondToReview = ({ reviewId, onResponseSubmitted }) => {
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!response.trim()) {
      toast.error('Response cannot be empty');
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.respondToReview({ reviewId, response });
      toast.success('Response submitted successfully');
      setResponse('');
      if (onResponseSubmitted) onResponseSubmitted();
    } catch (err) {
      toast.error(err.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        placeholder="Enter your response to the review"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-primaryLight hover:bg-primaryDark text-white font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Response'}
        </button>
      </div>
    </form>
  );
};

export default RespondToReview;