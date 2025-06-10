
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/authContext';
// import { chatService } from '../services/apiService';
// import NewCustomToast from '../components/NewCustomToast';
// import { toast } from 'react-toastify';
// import { io } from 'socket.io-client';

// // --- UI Components ---
// const LoadingSpinner = () => (
//     <div className="flex justify-center items-center py-16 h-full">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
//     </div>
// );

// const ErrorMessage = ({ message, onRetry }) => (
//     <div className="bg-red-900/30 border border-red-500/30 text-red-300 p-4 rounded-lg text-center my-6 mx-auto max-w-md">
//         <span>{message || 'Could not load conversations.'}</span>
//         {onRetry && (
//             <button
//                 onClick={onRetry}
//                 className="mt-2 sm:mt-0 ml-4 px-3 py-1 bg-red-700/50 rounded hover:bg-red-600/50 text-sm text-red-100"
//             >
//                 Retry
//             </button>
//         )}
//     </div>
// );

// const ThreeDotsIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//     </svg>
// );

// const UserRoleTag = ({ role }) => {
//     if (!role) return null;

//     let bgColor = 'bg-gray-500/50';
//     let textColor = 'text-gray-200';
//     let text = role.charAt(0).toUpperCase() + role.slice(1);

//     switch (role.toLowerCase()) {
//         case 'seller':
//             bgColor = 'bg-blue-500/50';
//             textColor = 'text-blue-100';
//             text = 'Seller';
//             break;
//         case 'buyer':
//             bgColor = 'bg-green-500/50';
//             textColor = 'text-green-100';
//             text = 'Buyer';
//             break;
//         case 'admin':
//             bgColor = 'bg-purple-500/50';
//             textColor = 'text-purple-100';
//             text = 'Admin';
//             break;
//         default: // Don't render a tag for a generic 'user' role or unknown roles
//             return null;
//     }

//     return (
//         <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${bgColor} ${textColor} ml-2 flex-shrink-0`}>
//             {text}
//         </span>
//     );
// };


// // Helper to get initials
// const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

// const ChatsListPage = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const [chats, setChats] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [openDropdownChatId, setOpenDropdownChatId] = useState(null);

//     const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || '').replace('/api', '');
//     const ADMIN_ID = '681a1c1c80f6185bd9b9c000'; // Your actual Admin User's MongoDB ObjectId

//     const dropdownRefs = useRef({});

//     const fetchChats = useCallback(async () => {
//         if (!user) return;
//         setLoading(true);
//         setError(null);
//         try {
//             const fetchedChats = await chatService.getMyChats();
//             const sortedChats = (fetchedChats || []).sort((a, b) =>
//                 new Date(b.latestMessage?.createdAt || b.updatedAt) - new Date(a.latestMessage?.createdAt || a.updatedAt)
//             );
//             setChats(sortedChats);
//         } catch (err) {
//             console.error("Error fetching chats:", err);
//             setError(err.message || 'Failed to load conversations.');
//         } finally {
//             setLoading(false);
//         }
//     }, [user]);

//     useEffect(() => {
//         fetchChats();
//     }, [fetchChats]);

//     useEffect(() => {
//         if (!user?._id) return;
//         const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
//         socket.on('connect', () => { console.log(`ChatsList Socket connected: ${socket.id}`); socket.emit('subscribe', user._id); });
//         socket.on('messageReceived', (newMessage) => {
//             setChats(prevChats => {
//                 let chatUpdated = false;
//                 const updatedChats = prevChats.map(chat => {
//                     const chatIdFromMessage = newMessage.chat?._id || newMessage.chat;
//                     if (chat._id === chatIdFromMessage) { chatUpdated = true; return { ...chat, latestMessage: newMessage, updatedAt: newMessage.createdAt }; }
//                     return chat;
//                 });
//                 if (chatUpdated) { return updatedChats.sort((a, b) => new Date(b.latestMessage?.createdAt || b.updatedAt) - new Date(a.latestMessage?.createdAt || a.updatedAt)); }
//                 return prevChats;
//             });
//         });
//         socket.on('newChat', (newChat) => {
//             setChats(prev => {
//                 if (prev.some(chat => chat._id === newChat._id)) { return prev; }
//                 const updated = [newChat, ...prev].sort((a, b) => new Date(b.latestMessage?.createdAt || b.updatedAt) - new Date(a.latestMessage?.createdAt || a.updatedAt));
//                 return updated;
//             });
//             toast(({ closeToast }) => <NewCustomToast type="info" headline="New Chat" text={`New conversation started.`} closeToast={closeToast} />);
//         });
//         socket.on('disconnect', (reason) => console.log(`ChatsList Socket disconnected: ${socket.id}, Reason: ${reason}`));
//         socket.on('connect_error', (err) => console.error(`ChatsList Socket connection error: ${err.message}`));
//         return () => { socket.disconnect(); };
//     }, [user?._id]);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (openDropdownChatId && dropdownRefs.current[openDropdownChatId] && !dropdownRefs.current[openDropdownChatId].contains(event.target)) {
//                 if (!event.target.closest(`button[data-dropdown-toggle='${openDropdownChatId}']`)) {
//                     setOpenDropdownChatId(null);
//                 }
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [openDropdownChatId]);


//     const getOtherParticipantInfo = (participants) => {
//         if (!user || !participants || participants.length === 0) {
//             return { id: null, name: 'Unknown Chat', avatar: null, initials: '?', role: null, isSelfChat: false };
//         }

//         const other = participants.find(p => p._id !== user._id);

//         if (!other) {
//             const adminParticipant = participants.find(p => p._id === ADMIN_ID || p.role?.toLowerCase() === 'admin');
//             if (adminParticipant && participants.length === 1 && adminParticipant._id === user._id) {
//                  return { id: user._id, name: 'Notes to Self', avatar: user.avatar, initials: getInitials(user.name), role: user.role, isSelfChat: true };
//             }
//             if (adminParticipant) { // This usually means the current user is chatting with the site Admin
//                 return { id: adminParticipant._id, name: adminParticipant.name || 'Admin Support', avatar: adminParticipant.avatar ? `${IMAGE_BASE_URL}/uploads/${adminParticipant.avatar}` : null, initials: 'AD', role: 'admin', isSelfChat: false };
//             }
//             if (participants.length === 1 && participants[0]?._id === user._id) { // Notes to self
//                 return { id: user._id, name: 'Notes to Self', avatar: user.avatar ? `${IMAGE_BASE_URL}/uploads/${user.avatar}` : null, initials: getInitials(user.name), role: user.role, isSelfChat: true };
//             }
//             return { id: null, name: 'Group Chat', avatar: null, initials: 'G', role: 'group', isSelfChat: false }; // Or some other default for unexpected cases
//         }
//         return { id: other._id, name: other.name || 'Unknown User', avatar: other.avatar ? `${IMAGE_BASE_URL}/uploads/${other.avatar}` : null, initials: getInitials(other.name), role: other.role || 'user', isSelfChat: false };
//     };


//     const handleInitiateChatWithAdmin = async () => {
//         if (ADMIN_ID === 'ADMIN_USER_ID_PLACEHOLDER' || !ADMIN_ID) {
//             toast(({ closeToast }) => <NewCustomToast type="error" headline="Error" text="Admin User ID not configured." closeToast={closeToast} />);
//             return;
//         }
//         if (ADMIN_ID.length !== 24 || !/^[0-9a-fA-F]+$/.test(ADMIN_ID)) {
//              toast(({ closeToast }) => <NewCustomToast type="error" headline="Error" text="Invalid Admin User ID format." closeToast={closeToast} />);
//              return;
//         }
//         try {
//             const response = await chatService.accessChat(ADMIN_ID);
//             if (response.success && response.data?._id) { navigate(`/chat/${response.data._id}`); }
//             else { throw new Error(response.message || "Could not start admin chat."); }
//         } catch (err) {
//             console.error("Error initiating admin chat:", err);
//             toast(({ closeToast }) => <NewCustomToast type="error" headline="Chat Error" text={err.message || "Could not start admin chat."} closeToast={closeToast} />);
//         }
//     };

//     const toggleDropdown = (chatId, event) => {
//         event.stopPropagation();
//         event.preventDefault();
//         setOpenDropdownChatId(prev => (prev === chatId ? null : chatId));
//     };

//     const handleDeleteChat = async (chatId, event) => {
//         event.stopPropagation();
//         event.preventDefault();
//         if (!window.confirm("Are you sure you want to delete this chat? This action cannot be undone.")) return;
        
//         setOpenDropdownChatId(null); // Close dropdown first
//         try {
//             // await chatService.deleteChat(chatId); // TODO: Uncomment when backend and service are ready
//             setChats(prev => prev.filter(c => c._id !== chatId));
//             toast(({ closeToast }) => <NewCustomToast type="success" headline="Chat Deleted" text="Conversation has been removed." closeToast={closeToast} />);
//         } catch (err) {
//             console.error("Error deleting chat:", err);
//             toast(({ closeToast }) => <NewCustomToast type="error" headline="Delete Failed" text={err.message || "Could not delete chat."} closeToast={closeToast} />);
//         }
//     };

//     const handleBlockUserInList = async (otherUserId, event) => {
//         event.stopPropagation();
//         event.preventDefault();
//         if (!otherUserId) {
//              toast(({closeToast}) => <NewCustomToast type="warning" headline="Cannot Block" text="User information is not available." closeToast={closeToast} />);
//              return;
//         }
//         if (!window.confirm(`Are you sure you want to block this user? You will no longer see their messages or be able to contact them.`)) return;
        
//         setOpenDropdownChatId(null);
//         try {
//             // await chatService.blockUser(otherUserId); // TODO: Uncomment when backend and service are ready
//             toast(({ closeToast }) => <NewCustomToast type="success" headline="User Blocked" text="User has been blocked successfully." closeToast={closeToast} />);
//             // OPTIONAL: Visually indicate block or remove chat from list after blocking
//             // setChats(prev => prev.filter(c => !c.participants.some(p => p._id === otherUserId)));
//         } catch (err) {
//             console.error("Error blocking user:", err);
//             toast(({ closeToast }) => <NewCustomToast type="error" headline="Block Failed" text={err.message || "Could not block user."} closeToast={closeToast} />);
//         }
//     };

//     const handleReportUserInList = async (otherUserId, event) => {
//         event.stopPropagation();
//         event.preventDefault();
//          if (!otherUserId) {
//              toast(({closeToast}) => <NewCustomToast type="warning" headline="Cannot Report" text="User information is not available." closeToast={closeToast} />);
//              return;
//         }
//         const reason = window.prompt("Please provide a reason for reporting this user (e.g., spam, harassment):");
//         if (!reason || reason.trim() === "") {
//             toast(({closeToast}) => <NewCustomToast type="info" headline="Report Cancelled" text="No reason provided." closeToast={closeToast} />);
//             setOpenDropdownChatId(null);
//             return;
//         }
        
//         setOpenDropdownChatId(null);
//         try {
//             // await chatService.reportUser(otherUserId, { reason }); // TODO: Uncomment when backend and service are ready
//             toast(({ closeToast }) => <NewCustomToast type="success" headline="User Reported" text="User has been reported. Thank you." closeToast={closeToast} />);
//         } catch (err) {
//             console.error("Error reporting user:", err);
//             toast(({ closeToast }) => <NewCustomToast type="error" headline="Report Failed" text={err.message || "Could not report user."} closeToast={closeToast} />);
//         }
//     };

//     const handleAvatarError = (e, initials, name) => {
//         const parent = e.target.parentNode;
//         if (parent) {
//             const span = parent.querySelector('.avatar-fallback-span');
//             if (span) {
//                 span.style.display = 'flex';
//             }
//         }
//         e.target.style.display = 'none';
//     };


//     return (
//         <>
//             <div className="wrapper">
//                 <div className="chat-list-container">
//                     <div className="p-3 md:p-4 border-b border-gray-600/50 flex items-center gap-3 flex-shrink-0 bg-black/30 sticky top-0 z-10">
//                         <h1 className="text-lg font-semibold text-gray-100 flex-grow">Your Conversations</h1>
//                     </div>

//                     {loading && <LoadingSpinner />}
//                     {!loading && error && <ErrorMessage message={error} onRetry={fetchChats} />}

//                     {!loading && !error && (
//                         <div className="chat-list-items">
//                             <button
//                                 onClick={handleInitiateChatWithAdmin}
//                                 disabled={ADMIN_ID === 'ADMIN_USER_ID_PLACEHOLDER' || !ADMIN_ID}
//                                 className="w-full block p-3 md:p-4 hover:bg-gray-700/40 transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed border-b border-gray-700/30"
//                             >
//                                 <div className="flex items-center">
//                                     <div className="w-10 h-10 rounded-full bg-purple-600/40 flex items-center justify-center mr-3 flex-shrink-0 ring-1 ring-purple-500/50">
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                                     </div>
//                                     <div>
//                                         <div className="flex items-center">
//                                             <h3 className="font-medium text-gray-100">Admin Support</h3>
//                                             <UserRoleTag role="admin" />
//                                         </div>
//                                         <p className="text-sm text-gray-400">Get help with your account</p>
//                                     </div>
//                                 </div>
//                             </button>

//                             {chats.length > 0 ? (
//                                 chats.map(chat => {
//                                     const otherUserInfo = chat.participants ? getOtherParticipantInfo(chat.participants) : { id: null, name: 'Loading...', avatar: null, initials: '?', role: null, isSelfChat: false };
//                                     const isSpecialChat = otherUserInfo.role === 'admin' || otherUserInfo.isSelfChat; // Simpler check for admin or self chat

//                                     return (
//                                         <div key={chat._id} className="chat-item-wrapper relative border-b border-gray-700/30">
//                                             <Link
//                                                 to={`/chat/${chat._id}`}
//                                                 className="block p-3 md:p-4 hover:bg-gray-700/40 transition-colors"
//                                             >
//                                                 <div className="flex items-center">
//                                                     <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3 overflow-hidden flex-shrink-0 ring-1 ring-gray-500/30 relative">
//                                                         {otherUserInfo.avatar ? (
//                                                             <img
//                                                                 src={otherUserInfo.avatar}
//                                                                 alt={otherUserInfo.name}
//                                                                 className="w-full h-full object-cover"
//                                                                 onError={(e) => handleAvatarError(e, otherUserInfo.initials, otherUserInfo.name)}
//                                                             />
//                                                         ) : null}
//                                                         <span
//                                                             className="avatar-fallback-span font-bold text-sm text-white items-center justify-center w-full h-full"
//                                                             title={otherUserInfo.name}
//                                                             style={{ display: otherUserInfo.avatar ? 'none' : 'flex' }}
//                                                         >
//                                                             {otherUserInfo.initials}
//                                                         </span>
//                                                     </div>
//                                                     <div className="flex-grow overflow-hidden">
//                                                         <div className="flex items-center">
//                                                             <h3 className="font-medium truncate text-gray-100">{otherUserInfo.name}</h3>
//                                                             {!otherUserInfo.isSelfChat && <UserRoleTag role={otherUserInfo.role} />}
//                                                         </div>
//                                                         <p className="text-sm text-gray-400 truncate">
//                                                             {chat.latestMessage?.sender?._id === user?._id ? <span className="text-gray-500">You: </span> : ''}
//                                                             {chat.latestMessage?.messageType === 'image' ? '📷 Photo' : (chat.latestMessage?.content || 'No messages yet')}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </Link>
//                                             {!isSpecialChat && (
//                                                 <div className="absolute top-1/2 right-2 md:right-3 transform -translate-y-1/2 z-20" ref={el => dropdownRefs.current[chat._id] = el}>
//                                                     <button
//                                                         data-dropdown-toggle={chat._id}
//                                                         onClick={(e) => toggleDropdown(chat._id, e)}
//                                                         className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 focus:outline-none"
//                                                         aria-label="Chat options"
//                                                         aria-haspopup="true"
//                                                         aria-expanded={openDropdownChatId === chat._id}
//                                                     >
//                                                         <ThreeDotsIcon />
//                                                     </button>
//                                                     {openDropdownChatId === chat._id && (
//                                                         <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-xl py-1 origin-top-right">
//                                                             <button
//                                                                 onClick={(e) => handleDeleteChat(chat._id, e)}
//                                                                 className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
//                                                             >
//                                                                 Delete Chat
//                                                             </button>
//                                                             <button
//                                                                 onClick={(e) => handleBlockUserInList(otherUserInfo.id, e)}
//                                                                 className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
//                                                             >
//                                                                 Block User
//                                                             </button>
//                                                             <button
//                                                                 onClick={(e) => handleReportUserInList(otherUserInfo.id, e)}
//                                                                 className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-500/20 transition-colors"
//                                                             >
//                                                                 Report User
//                                                             </button>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 })
//                             ) : (
//                                 !loading && !error && <div className="p-6 text-center text-gray-500">No conversations started yet.</div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             <style>
//                 {`
//                 body, html { margin: 0; padding: 0; line-height: 1.5; font-family: Helvetica, sans-serif; font-size: 1rem; }
//                 @media(max-width: 1000px) { body, html { font-size: 14px; } }
//                 *, *::before, *::after { box-sizing: border-box; }

//                 .wrapper {
//                     min-height: 100vh; width: 100%;
//                     background-image: url(https://images.unsplash.com/photo-1638272181967-7d3772a91265?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80);
//                     background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed;
//                     padding: 0; display: flex; justify-content: center; align-items: center;
//                 }

//                 .chat-list-container {
//                     height: 100%; max-height: 100vh; width: 100%; max-width: 800px;
//                     display: flex; flex-direction: column; gap: 0px;
//                     background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
//                     border: 1px solid rgba(255, 255, 255, 0.1);
//                     box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2); overflow: hidden;
//                 }
//                 @media (min-width: 768px) {
//                     .wrapper { padding: 2rem 10%; }
//                     .chat-list-container { border-radius: 15px; max-height: calc(100vh - 4rem); }
//                 }
//                 @media (min-width: 1024px) {
//                     .wrapper { padding: 50px 15%; }
//                     .chat-list-container { max-height: 85vh; }
//                 }

//                 .chat-list-items {
//                     flex-grow: 1; overflow-y: auto;
//                     scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, .3) transparent;
//                 }
//                 .chat-list-items::-webkit-scrollbar { width: 5px; }
//                 .chat-list-items::-webkit-scrollbar-track { background: transparent; }
//                 .chat-list-items::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, .3); border-radius: 10px; }
//                 .chat-list-items::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, .35); }
//                 .chat-list-items::-webkit-scrollbar-thumb:active { background: rgba(255, 255, 255, .4); }

//                 .avatar-fallback-span {
//                     display: flex; /* Will be overridden by inline style if avatar exists */
//                     align-items: center;
//                     justify-content: center;
//                 }
//                 `}
//             </style>
//         </>
//     );
// };

// export default ChatsListPage;


//from grok

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { chatService } from '../services/apiService';
import NewCustomToast from '../components/NewCustomToast';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import moment from 'moment';

// UI Components (unchanged)
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-16 h-full">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-900/30 border border-red-500/30 text-red-300 p-4 rounded-lg text-center my-6 mx-auto max-w-md">
    <span>{message || 'Could not load conversations.'}</span>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 sm:mt-0 ml-4 px-3 py-1 bg-red-700/50 rounded hover:bg-red-600/50 text-sm text-red-100"
      >
        Retry
      </button>
    )}
  </div>
);

const ThreeDotsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const UserRoleTag = ({ role }) => {
  if (!role) return null;

  let bgColor = 'bg-gray-500/50';
  let textColor = 'text-gray-200';
  let text = role.charAt(0).toUpperCase() + role.slice(1);

  switch (role.toLowerCase()) {
    case 'seller':
      bgColor = 'bg-blue-500/50';
      textColor = 'text-blue-100';
      text = 'Seller';
      break;
    case 'buyer':
      bgColor = 'bg-green-500/50';
      textColor = 'text-green-100';
      text = 'Buyer';
      break;
    case 'admin':
      bgColor = 'bg-purple-500/50';
      textColor = 'text-purple-100';
      text = 'Admin';
      break;
    default:
      return null;
  }

  return (
    <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${bgColor} ${textColor} ml-2 flex-shrink-0`}>
      {text}
    </span>
  );
};

// Helper to get initials
const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

const ChatsListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdownChatId, setOpenDropdownChatId] = useState(null);

  const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || '').replace('/api', '');
  const ADMIN_ID = '681a1c1c80f6185bd9b9c000';

  const dropdownRefs = useRef({});

  const fetchChats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedChats = await chatService.getMyChats();
      const sortedChats = (fetchedChats || []).map(chat => ({
        ...chat,
        isExpired: chat.expiresAt ? moment().isAfter(moment(chat.expiresAt)) : false,
      })).sort((a, b) =>
        new Date(b.latestMessage?.createdAt || b.updatedAt) - new Date(a.latestMessage?.createdAt || a.updatedAt)
      );
      setChats(sortedChats);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError(err.message || 'Failed to load conversations.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (!user?._id) return;
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    socket.on('connect', () => {
      console.log(`ChatsList Socket connected: ${socket.id}`);
      socket.emit('subscribe', user._id);
    });
    socket.on('messageReceived', (newMessage) => {
      setChats(prevChats => {
        let chatUpdated = false;
        const updatedChats = prevChats.map(chat => {
          const chatIdFromMessage = newMessage.chat?._id || newMessage.chat;
          if (chat._id === chatIdFromMessage) {
            chatUpdated = true;
            return { ...chat, latestMessage: newMessage, updatedAt: newMessage.createdAt };
          }
          return chat;
        });
        if (chatUpdated) {
          return updatedChats.sort((a, b) =>
            new Date(b.latestMessage?.createdAt || b.updatedAt) - new Date(a.latestMessage?.createdAt || a.updatedAt)
          );
        }
        return prevChats;
      });
    });
    socket.on('newChat', (newChat) => {
      setChats(prev => {
        if (prev.some(chat => chat._id === newChat._id)) return prev;
        const updated = [{
          ...newChat,
          isExpired: newChat.expiresAt ? moment().isAfter(moment(newChat.expiresAt)) : false,
        }, ...prev].sort((a, b) =>
          new Date(b.latestMessage?.createdAt || b.updatedAt) - new Date(a.latestMessage?.createdAt || a.updatedAt)
        );
        return updated;
      });
      toast(({ closeToast }) => (
        <NewCustomToast type="info" headline="New Chat" text="New conversation started." closeToast={closeToast} />
      ));
    });
    socket.on('disconnect', (reason) => console.log(`ChatsList Socket disconnected: ${socket.id}, Reason: ${reason}`));
    socket.on('connect_error', (err) => console.error(`ChatsList Socket connection error: ${err.message}`));
    return () => { socket.disconnect(); };
  }, [user?._id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownChatId && dropdownRefs.current[openDropdownChatId] && !dropdownRefs.current[openDropdownChatId].contains(event.target)) {
        if (!event.target.closest(`button[data-dropdown-toggle='${openDropdownChatId}']`)) {
          setOpenDropdownChatId(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownChatId]);

  const getOtherParticipantInfo = (participants) => {
    if (!user || !participants || participants.length === 0) {
      return { id: null, name: 'Unknown Chat', avatar: null, initials: '?', role: null, isSelfChat: false };
    }

    const other = participants.find(p => p._id !== user._id);

    if (!other) {
      const adminParticipant = participants.find(p => p._id === ADMIN_ID || p.role?.toLowerCase() === 'admin');
      if (adminParticipant && participants.length === 1 && adminParticipant._id === user._id) {
        return { id: user._id, name: 'Notes to Self', avatar: user.avatar, initials: getInitials(user.name), role: user.role, isSelfChat: true };
      }
      if (adminParticipant) {
        return {
          id: adminParticipant._id,
          name: adminParticipant.name || 'Admin Support',
          avatar: adminParticipant.avatar ? `${IMAGE_BASE_URL}/Uploads/${adminParticipant.avatar}` : null,
          initials: 'AD',
          role: 'admin',
          isSelfChat: false
        };
      }
      if (participants.length === 1 && participants[0]?._id === user._id) {
        return {
          id: user._id,
          name: 'Notes to Self',
          avatar: user.avatar ? `${IMAGE_BASE_URL}/Uploads/${user.avatar}` : null,
          initials: getInitials(user.name),
          role: user.role,
          isSelfChat: true
        };
      }
      return { id: null, name: 'Group Chat', avatar: null, initials: 'G', role: 'group', isSelfChat: false };
    }
    return {
      id: other._id,
      name: other.name || 'Unknown User',
      avatar: other.avatar ? `${IMAGE_BASE_URL}/Uploads/${other.avatar}` : null,
      initials: getInitials(other.name),
      role: other.role || 'user',
      isSelfChat: false
    };
  };

  const handleInitiateChatWithAdmin = async () => {
    if (ADMIN_ID === 'ADMIN_USER_ID_PLACEHOLDER' || !ADMIN_ID) {
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="Error" text="Admin User ID not configured." closeToast={closeToast} />
      ));
      return;
    }
    if (ADMIN_ID.length !== 24 || !/^[0-9a-fA-F]+$/.test(ADMIN_ID)) {
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="Error" text="Invalid Admin User ID format." closeToast={closeToast} />
      ));
      return;
    }
    try {
      const response = await chatService.accessChat(ADMIN_ID);
      if (response.success && response.data?._id) {
        navigate(`/chat/${response.data._id}`);
      } else {
        throw new Error(response.message || "Could not start admin chat.");
      }
    } catch (err) {
      console.error("Error initiating admin chat:", err);
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="Chat Error" text={err.message || "Could not start admin chat."} closeToast={closeToast} />
      ));
    }
  };

  const toggleDropdown = (chatId, event) => {
    event.stopPropagation();
    event.preventDefault();
    setOpenDropdownChatId(prev => (prev === chatId ? null : chatId));
  };

  const handleDeleteChat = async (chatId, event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!window.confirm("Are you sure you want to delete this chat? This action cannot be undone.")) return;

    setOpenDropdownChatId(null);
    try {
      // TODO: Uncomment when backend endpoint and service are implemented
      // await chatService.deleteChat(chatId);
      setChats(prev => prev.filter(c => c._id !== chatId));
      toast(({ closeToast }) => (
        <NewCustomToast type="success" headline="Chat Deleted" text="Conversation has been removed." closeToast={closeToast} />
      ));
    } catch (err) {
      console.error("Error deleting chat:", err);
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="Delete Failed" text={err.message || "Could not delete chat."} closeToast={closeToast} />
      ));
    }
  };

  const handleBlockUserInList = async (otherUserId, event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!otherUserId) {
      toast(({ closeToast }) => (
        <NewCustomToast type="warning" headline="Cannot Block" text="User information is not available." closeToast={closeToast} />
      ));
      return;
    }
    if (!window.confirm(`Are you sure you want to block this user? You will no longer see their messages or be able to contact them.`)) return;

    setOpenDropdownChatId(null);
    try {
      // TODO: Uncomment when backend endpoint and service are implemented
      // await chatService.blockUser(otherUserId);
      toast(({ closeToast }) => (
        <NewCustomToast type="success" headline="User Blocked" text="User has been blocked successfully." closeToast={closeToast} />
      ));
      setChats(prev => prev.filter(c => !c.participants.some(p => p._id === otherUserId)));
    } catch (err) {
      console.error("Error blocking user:", err);
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="Block Failed" text={err.message || "Could not block user."} closeToast={closeToast} />
      ));
    }
  };

  const handleReportUserInList = async (otherUserId, event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!otherUserId) {
      toast(({ closeToast }) => (
        <NewCustomToast type="warning" headline="Cannot Report" text="User information is not available." closeToast={closeToast} />
      ));
      return;
    }
    const reason = window.prompt("Please provide a reason for reporting this user (e.g., spam, harassment):");
    if (!reason || reason.trim() === "") {
      toast(({ closeToast }) => (
        <NewCustomToast type="info" headline="Report Cancelled" text="No reason provided." closeToast={closeToast} />
      ));
      setOpenDropdownChatId(null);
      return;
    }

    setOpenDropdownChatId(null);
    try {
      // TODO: Uncomment when backend endpoint and service are implemented
      // await chatService.reportUser(otherUserId, { reason });
      toast(({ closeToast }) => (
        <NewCustomToast type="success" headline="User Reported" text="User has been reported. Thank you." closeToast={closeToast} />
      ));
    } catch (err) {
      console.error("Error reporting user:", err);
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="Report Failed" text={err.message || "Could not report user."} closeToast={closeToast} />
      ));
    }
  };

  const handleAvatarError = (e, initials, name) => {
    const parent = e.target.parentNode;
    if (parent) {
      const span = parent.querySelector('.avatar-fallback-span');
      if (span) {
        span.style.display = 'flex';
      }
    }
    e.target.style.display = 'none';
  };

  const renderExpirationStatus = (chat) => {
    if (chat.isExpired) {
      return (
        <span className="text-red-400 text-xs flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Expired
        </span>
      );
    }
    if (chat.expiresAt) {
      const timeLeft = moment(chat.expiresAt).diff(moment(), 'hours');
      if (timeLeft <= 24) {
        return (
          <span className="text-yellow-400 text-xs flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Expires in {moment(chat.expiresAt).fromNow(true)}
          </span>
        );
      }
    }
    return null;
  };

  return (
    <>
      <div className="wrapper">
        <div className="chat-list-container">
          <div className="p-3 md:p-4 border-b border-gray-600/50 flex items-center gap-3 flex-shrink-0 bg-black/30 sticky top-0 z-10">
            <h1 className="text-lg font-semibold text-gray-100 flex-grow">Your Conversations</h1>
          </div>

          {loading && <LoadingSpinner />}
          {!loading && error && <ErrorMessage message={error} onRetry={fetchChats} />}

          {!loading && !error && (
            <div className="chat-list-items">
              <button
                onClick={handleInitiateChatWithAdmin}
                disabled={ADMIN_ID === 'ADMIN_USER_ID_PLACEHOLDER' || !ADMIN_ID}
                className="w-full block p-3 md:p-4 hover:bg-gray-700/40 transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed border-b border-gray-700/30"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-600/40 flex items-center justify-center mr-3 flex-shrink-0 ring-1 ring-purple-500/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-100">Admin Support</h3>
                      <UserRoleTag role="admin" />
                    </div>
                    <p className="text-sm text-gray-400">Get help with your account</p>
                  </div>
                </div>
              </button>

              {chats.length > 0 ? (
                chats.map(chat => {
                  const otherUserInfo = chat.participants
                    ? getOtherParticipantInfo(chat.participants)
                    : { id: null, name: 'Loading...', avatar: null, initials: '?', role: null, isSelfChat: false };
                  const isSpecialChat = otherUserInfo.role === 'admin' || otherUserInfo.isSelfChat;

                  return (
                    <div
                      key={chat._id}
                      className="chat-item-wrapper relative border-b border-gray-700/30"
                    >
                      <Link
                        to={`/chat/${chat._id}`}
                        className={`block p-3 md:p-4 hover:bg-gray-700/40 transition-colors ${chat.isExpired ? 'opacity-60' : ''}`}
                        onClick={(e) => {
                          if (chat.isExpired) {
                            e.preventDefault();
                            toast(({ closeToast }) => (
                              <NewCustomToast type="warning" headline="Chat Expired" text="This conversation has expired and cannot be accessed." closeToast={closeToast} />
                            ));
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3 overflow-hidden flex-shrink-0 ring-1 ring-gray-500/30 relative">
                              {otherUserInfo.avatar ? (
                                <img
                                  src={otherUserInfo.avatar}
                                  alt={otherUserInfo.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => handleAvatarError(e, otherUserInfo.initials, otherUserInfo.name)}
                                />
                              ) : null}
                              <span
                                className="avatar-fallback-span font-bold text-sm text-white items-center justify-center w-full h-full"
                                title={otherUserInfo.name}
                                style={{ display: otherUserInfo.avatar ? 'none' : 'flex' }}
                              >
                                {otherUserInfo.initials}
                              </span>
                            </div>
                            <div className="flex-grow overflow-hidden">
                              <div className="flex items-center">
                                <h3 className="font-medium truncate text-gray-100">
                                  {otherUserInfo.name}
                                </h3>
                                {!otherUserInfo.isSelfChat && <UserRoleTag role={otherUserInfo.role} />}
                              </div>
                              <div className="flex items-center space-x-2">
                                <p className="text-sm text-gray-400 truncate">
                                  {chat.latestMessage?.sender?._id === user?._id ? (
                                    <span className="text-gray-500">You: </span>
                                  ) : (
                                    ''
                                  )}
                                  {chat.latestMessage?.messageType === 'image'
                                    ? 'ðŸ“· Photo'
                                    : (chat.latestMessage?.content || 'No messages yet')}
                                </p>
                                {renderExpirationStatus(chat)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      {!isSpecialChat && (
                        <div
                          className="absolute top-1/2 right-2 md:right-3 transform -translate-y-1/2 z-20"
                          ref={el => dropdownRefs.current[chat._id] = el}
                        >
                          <button
                            data-dropdown-toggle={chat._id}
                            onClick={(e) => toggleDropdown(chat._id, e)}
                            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 focus:outline-none"
                            aria-label="Chat options"
                            aria-haspopup="true"
                            aria-expanded={openDropdownChatId === chat._id}
                          >
                            <ThreeDotsIcon />
                          </button>
                          {openDropdownChatId === chat._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-xl py-1 origin-top-right">
                              <button
                                onClick={(e) => handleDeleteChat(chat._id, e)}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                              >
                                Delete Chat
                              </button>
                              <button
                                onClick={(e) => handleBlockUserInList(otherUserInfo.id, e)}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                              >
                                Block User
                              </button>
                              <button
                                onClick={(e) => handleReportUserInList(otherUserInfo.id, e)}
                                className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                              >
                                Report User
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                !loading && !error && <div className="p-6 text-center text-gray-500">No conversations started yet.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>
        {`
        body, html { margin: 0; padding: 0; line-height: 1.5; font-family: Helvetica, sans-serif; font-size: 1rem; }
        @media(max-width: 1000px) { body, html { font-size: 14px; } }
        *, *::before, *::after { box-sizing: border-box; }

        .wrapper {
            min-height: 100vh; width: 100%;
            background-image: url(https://images.unsplash.com/photo-1638272181967-7d3772a91265?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80);
            background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed;
            padding: 0; display: flex; justify-content: center; align-items: center;
        }

        .chat-list-container {
            height: 100%; max-height: 100vh; width: 100%; max-width: 800px;
            display: flex; flex-direction: column; gap: 0px;
            background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2); overflow: hidden;
        }
        @media (min-width: 768px) {
            .wrapper { padding: 2rem 10%; }
            .chat-list-container { border-radius: 15px; max-height: calc(100vh - 4rem); }
        }
        @media (min-width: 1024px) {
            .wrapper { padding: 50px 15%; }
            .chat-list-container { max-height: 85vh; }
        }

        .chat-list-items {
            flex-grow: 1; overflow-y: auto;
            scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, .3) transparent;
        }
        .chat-list-items::-webkit-scrollbar { width: 5px; }
        .chat-list-items::-webkit-scrollbar-track { background: transparent; }
        .chat-list-items::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, .3); border-radius: 10px; }
        .chat-list-items::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, .35); }
        .chat-list-items::-webkit-scrollbar-thumb:active { background: rgba(255, 255, 255, .4); }

        .avatar-fallback-span {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        `}
      </style>
    </>
  );
};

export default ChatsListPage;