import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/apiService'; // Import admin service
import { toast } from 'react-toastify'; // For displaying notifications
import io from 'socket.io-client'; // For real-time updates
import { useAuth } from '../context/authContext'; // To potentially get admin info
import NewCustomToast from '../components/NewCustomToast'; // Import custom toast

// --- Reusable UI Components ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-400"></div>
    </div>
);

const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex justify-between items-center my-4">
        <span>{message || 'An error occurred.'}</span>
        {onRetry && (
            <button onClick={onRetry} className="ml-4 px-3 py-1 bg-red-500/30 rounded hover:bg-red-500/40 text-sm">
                Retry
            </button>
        )}
    </div>
);

/**
 * AdminApprovalPage Component
 * Fetches and displays listings pending approval, allowing admins to approve or reject them.
 */
const AdminApprovalPage = () => {
    const { user } = useAuth(); // Get current user (assuming it includes role)
    const [pendingListings, setPendingListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || '').replace('/api', '');
    // Helper function to get initials from name - NOW USED
    const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

    // --- Data Fetching ---
    const fetchPending = useCallback(async () => {
        console.log("Fetching pending listings for admin approval...");
        setLoading(true);
        setError(null);
        try {
            const data = await adminService.getPendingListings();
            setPendingListings(data || []);
            console.log(`Fetched ${data?.length || 0} pending listings.`);
        } catch (err) {
            console.error("Error fetching pending listings:", err);
            setError(err.message || 'Failed to fetch pending listings.');
            setPendingListings([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Action Handlers ---
    const handleApprove = async (id) => {
        if (processingId) return;
        setProcessingId(id);
        try {
            const response = await adminService.approveListing(id);
            toast(({closeToast}) => <NewCustomToast type="success" headline="Listing Approved" text={response.message || `Listing ${id.slice(-6)} approved.`} closeToast={closeToast} />);
            setPendingListings(prev => prev.filter(listing => listing._id !== id));
        } catch (err) {
            console.error(`Approval failed for listing ${id}:`, err);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        if (processingId) return;
        const reason = prompt("Enter reason for rejection (optional, will be sent to seller):");
        setProcessingId(id);
        try {
            const response = await adminService.rejectListing(id, reason || undefined);
            toast(({closeToast}) => <NewCustomToast type="warning" headline="Listing Rejected" text={response.message || `Listing ${id.slice(-6)} rejected.`} closeToast={closeToast} />);
            setPendingListings(prev => prev.filter(listing => listing._id !== id));
        } catch (err) {
            console.error(`Rejection failed for listing ${id}:`, err);
        } finally {
            setProcessingId(null);
        }
    };

    // --- Effects ---
    useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    useEffect(() => {
        if (user?.role !== 'admin') { return; } // Guard clause
        const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
        socket.on('connect', () => { socket.emit('join_admin_room'); console.log("Admin joined admin_room"); });
        socket.on('disconnect', (reason) => console.log(`Admin Socket disconnected: ${socket.id}, Reason: ${reason}`));
        socket.on('connect_error', (err) => { console.error(`Admin Socket connection error: ${err.message}`); toast(({closeToast}) => <NewCustomToast type="error" headline="Connection Error" text="Real-time admin updates failed." closeToast={closeToast} />); });
        socket.on('new_pending_listing', (newListing) => { toast(({closeToast}) => <NewCustomToast type="info" headline="New Submission" text={`New listing "${newListing.title}" requires approval.`} closeToast={closeToast} />); setPendingListings(prev => [newListing, ...prev]); });
        socket.on('listing_approved', (data) => { setPendingListings(prev => prev.filter(l => l._id !== data.listingId)); });
        socket.on('listing_rejected', (data) => { setPendingListings(prev => prev.filter(l => l._id !== data.listingId)); });
        return () => { socket.disconnect(); };
    }, [user?.role]);


    // --- Render ---
    return (
        <div className="min-h-screen bg-darker-bg text-white p-4 md:p-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-neon-yellow">Admin - Listing Approvals</h1>

                {loading && <LoadingSpinner />}
                {!loading && error && <ErrorMessage message={error} onRetry={fetchPending} />}
                {!loading && !error && pendingListings.length === 0 && (
                    <div className="bg-glass-dark border border-gray-700 rounded-xl p-8 text-center">
                        <p className="text-gray-300 text-lg">🎉 No listings currently pending approval.</p>
                    </div>
                )}
                {!loading && !error && pendingListings.length > 0 && (
                    <div className="space-y-6">
                        {pendingListings.map(listing => (
                            <div key={listing._id} className="bg-glass-dark border border-gray-700 rounded-xl p-5 backdrop-blur-lg shadow-md flex flex-col md:flex-row gap-5 transition-opacity duration-300 ease-in-out">
                                {/* Image */}
                                <div className="flex-shrink-0 w-full md:w-48 h-40 bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                                    <img
                                        src={listing.image ? `${IMAGE_BASE_URL}/uploads/${listing.image}` : 'https://placehold.co/400x300/2D3748/718096?text=Listing'}
                                        alt={listing.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x300/2D3748/718096?text=Error'; }}
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-grow">
                                    <h3 className="text-xl font-semibold text-white mb-1">{listing.title}</h3>
                                    <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                                         <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden text-xs font-bold text-white flex-shrink-0">
                                            {/* Seller Avatar or Initials */}
                                            {listing.sellerId?.avatar ? (
                                                <img
                                                    src={`${IMAGE_BASE_URL}/uploads/${listing.sellerId.avatar}`}
                                                    alt={listing.sellerId.name || 'Seller'}
                                                    className="w-full h-full object-cover border border-gray-500 rounded-full" // Added border and rounding
                                                    // --- UPDATED onError to use getInitials ---
                                                    onError={(e) => { e.target.onerror = null; e.target.outerHTML = `<span class="flex items-center justify-center w-full h-full" title="${listing.sellerId.name || ''}">${getInitials(listing.sellerId.name)}</span>`; }}
                                                />
                                            ) : (
                                                // --- UPDATED Fallback to use getInitials ---
                                                <span title={listing.sellerId?.name || 'Seller'}>{getInitials(listing.sellerId?.name)}</span>
                                            )}
                                        </div>
                                        <span>
                                            Submitted by: <span className="font-medium text-gray-300">{listing.sellerId?.name || 'Unknown'}</span>
                                            {listing.sellerId?.email && ` (${listing.sellerId.email})`}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-3 max-h-20 overflow-y-auto">{listing.description}</p>
                                     <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mb-4">
                                        <span className="text-gray-400">Price: <span className="font-semibold text-neon-green">${listing.price}</span></span>
                                        <span className="text-gray-400">Category: <span className="font-semibold text-white capitalize">{listing.category}</span></span>
                                        <span className="text-gray-400">Duration: <span className="font-semibold text-white">{listing.duration || 'N/A'}</span></span>
                                        <span className="text-gray-400">Submitted: <span className="font-semibold text-white">{new Date(listing.createdAt).toLocaleDateString()}</span></span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex-shrink-0 flex flex-col justify-center items-stretch gap-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-600 md:pl-5 min-w-[100px]">
                                    <button onClick={() => handleApprove(listing._id)} disabled={processingId === listing._id} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition duration-200 disabled:opacity-50 disabled:cursor-wait w-full flex items-center justify-center gap-2">
                                        {processingId === listing._id && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                        Approve
                                    </button>
                                    <button onClick={() => handleReject(listing._id)} disabled={processingId === listing._id} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition duration-200 disabled:opacity-50 disabled:cursor-wait w-full flex items-center justify-center gap-2">
                                         {processingId === listing._id && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminApprovalPage;
