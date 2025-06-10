// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useParams, Link, useNavigate, Navigate } from "react-router-dom";
// import { useAuth } from "../context/authContext";
// import { chatService } from "../services/apiService";
// import NewCustomToast from "../components/NewCustomToast";
// import { toast } from "react-toastify";
// import { io } from "socket.io-client";
// import mongoose from "mongoose"; // Imported for ObjectId.isValid
// import EmojiPicker, { EmojiStyle, Theme as EmojiTheme } from "emoji-picker-react";
// import { ArrowLeft, Paperclip, Smile, Send, MoreVertical, UserX, AlertTriangle as AlertTriangleIcon } from 'lucide-react';

// // --- UI Components ---
// const LoadingSpinner = ({ text = "Loading Chat..." }) => (
//     <div className="flex flex-col justify-center items-center py-16 h-full text-gray-400">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400 mb-3"></div>
//         <p>{text}</p>
//     </div>
// );

// const ErrorMessage = ({ message }) => (
//     <div className="bg-red-900/30 border border-red-500/30 text-red-300 p-4 rounded-lg text-center my-6 mx-auto max-w-md">
//         {message || "Could not load chat details."}
//     </div>
// );

// const LoadingSpinnerSmall = () => (
//     <svg className="animate-spin h-4 w-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//     </svg>
// );

// const UserRoleTag = ({ role }) => {
//     if (!role) return null;
//     let bgColor = 'bg-gray-500/50'; let textColor = 'text-gray-200'; let text = role.charAt(0).toUpperCase() + role.slice(1);
//     switch (role.toLowerCase()) {
//         case 'seller': bgColor = 'bg-blue-500/50'; textColor = 'text-blue-100'; text = 'Seller'; break;
//         case 'buyer': bgColor = 'bg-green-500/50'; textColor = 'text-green-100'; text = 'Buyer'; break;
//         case 'admin': bgColor = 'bg-purple-500/50'; textColor = 'text-purple-100'; text = 'Admin'; break;
//         default: return null;
//     }
//     return (<span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${bgColor} ${textColor} ml-2 flex-shrink-0`}>{text}</span>);
// };

// // --- ChatPage Component ---
// const ChatPage = () => {
//     const { chatId: initialParam } = useParams();
//     const { user, loading: authLoadingFromContext } = useAuth();
//     const navigate = useNavigate();

//     const [messages, setMessages] = useState([]);
//     const [pageLoading, setPageLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [newMessage, setNewMessage] = useState("");
//     const [otherParticipant, setOtherParticipant] = useState(null);
//     const [currentChatId, setCurrentChatId] = useState(null);
//     const [isSending, setIsSending] = useState(false);
//     const [isChatAccessible, setIsChatAccessible] = useState(true);
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//     const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
//     const [isFileUploading, setIsFileUploading] = useState(false);

//     const socketRef = useRef(null);
//     const messagesEndRef = useRef(null);
//     const fileInputRef = useRef(null);
//     const optionsDropdownRef = useRef(null);
//     const emojiPickerRef = useRef(null);
//     const messagesContainerRef = useRef(null);

//     const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || "").replace("/api", "");
//     const ADMIN_ID = "681a1c1c80f6185bd9b9c000"; 

//     const getInitials = (name = "") => name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
//     const sensitiveInfoRegex = /(\+\d{1,3}[- ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}|[\w.-]+@[\w-]+\.[\w.-]+|\b(bank|account|iban|swift|bic|card number|credit card|cvv|pin)\b/i;

//     const getImageUrl = (msg) => {
//         if (!msg || !msg.content) return null;
//         if (msg.content.startsWith("blob:")) return msg.content;
//         if (msg.messageType === "image") return `${IMAGE_BASE_URL}/uploads/${msg.content}`;
//         return null;
//     };

//     const fetchChatData = useCallback(async (cIdToFetch) => {
//         console.log(`[ChatPage] fetchChatData called for chatId: ${cIdToFetch}`);
//         if (!cIdToFetch || !mongoose.Types.ObjectId.isValid(cIdToFetch)) {
//             setError("Invalid Chat ID for fetching data.");
//             setPageLoading(false); 
//             setIsChatAccessible(false); 
//             return;
//         }
//         setPageLoading(true); 
//         setError(null);

//         try {
//             const serviceResponse = await chatService.getMessages(cIdToFetch);
//             console.log("[ChatPage] Received from chatService.getMessages:", JSON.stringify(serviceResponse, null, 2));

//             if (!serviceResponse) {
//                 throw new Error("Failed to fetch chat data: No response from service.");
//             }
//             if (serviceResponse.success === false || !serviceResponse.data) {
//                 throw new Error(serviceResponse.message || "Failed to retrieve chat details.");
//             }

//             const chatDataFromService = serviceResponse.data;
//             if (typeof chatDataFromService.messages === 'undefined' || typeof chatDataFromService.chat === 'undefined') {
//                 throw new Error("Chat data structure from service is invalid (missing messages or chat).");
//             }
            
//             if (!Array.isArray(chatDataFromService.messages)) {
//                 setMessages([]); throw new Error(`Received non-array data for messages. Type: ${typeof chatDataFromService.messages}`);
//             } else {
//                 setMessages(chatDataFromService.messages);
//             }

//             const currentChatDetails = chatDataFromService.chat;
//             const currentChatParticipants = currentChatDetails.participants || [];
//             let determinedOtherParticipant = null;

//             if (user?._id) {
//                 const otherP = currentChatParticipants.find(p => p._id !== user._id);
//                 if (otherP) {
//                     determinedOtherParticipant = otherP;
//                 } else if (currentChatParticipants.length === 1 && currentChatParticipants[0]._id === user._id) {
//                     determinedOtherParticipant = { _id: user._id, name: "Notes to Self", avatar: user.avatar, role: user.role, isSelfChat: true };
//                 } else if (currentChatDetails.isGroupChat) {
//                     determinedOtherParticipant = { name: currentChatDetails.chatName || "Group Chat", isGroupChat: true, _id: currentChatDetails._id };
//                 } else {
//                     const adminAsParticipant = currentChatParticipants.find(p => p._id === ADMIN_ID);
//                     if (user._id === ADMIN_ID && otherP) {
//                         determinedOtherParticipant = otherP;
//                     } else if (adminAsParticipant && user._id !== ADMIN_ID) {
//                         determinedOtherParticipant = adminAsParticipant;
//                          if (!determinedOtherParticipant.name) determinedOtherParticipant.name = "Admin Support";
//                     } else {
//                         console.warn("[ChatPage] Could not determine other participant. Chat Participants:", currentChatParticipants, "User ID:", user._id);
//                         if (currentChatParticipants.length > 0) {
//                             determinedOtherParticipant = currentChatParticipants.find(p => p._id !== user._id) || { name: "Unknown User", _id:"unknown"};
//                         } else {
//                              determinedOtherParticipant = { name: "Unknown Chat", _id:"unknown_chat_no_participants"};
//                         }
//                     }
//                 }
//             }
            
//             if (!determinedOtherParticipant && currentChatDetails && !currentChatDetails.isGroupChat && !(currentChatParticipants.length === 1 && currentChatParticipants[0]._id === user._id)) {
//                  console.error("[ChatPage] Critical: Failed to determine other participant. Defaulting to 'Unknown User'.");
//                  determinedOtherParticipant = { name: "Unknown User", _id:"unknown_fallback" };
//             }

//             setOtherParticipant(determinedOtherParticipant);
//             setIsChatAccessible(true);
//         } catch (err) {
//             console.error("[ChatPage] Error in fetchChatData:", err);
//             setError(err.message || 'Failed to load chat. Check console.');
//             setMessages([]); setOtherParticipant(null); setIsChatAccessible(false);
//         } finally {
//             setPageLoading(false);
//         }
//     }, [user, ADMIN_ID]); 

//     useEffect(() => {
//         setPageLoading(true); 
//         setError(null); setMessages([]); setOtherParticipant(null); setIsChatAccessible(true); setCurrentChatId(null);

//         const initializeChatLogic = async () => {
//             if (authLoadingFromContext) {
//                 console.log("[ChatPage/Init] Auth context still loading.");
//                 return; 
//             }
//             if (!user?._id) {
//                 console.log("[ChatPage/Init] User not available from auth context yet. Page loading will be set to false if user remains null.");
//                 setPageLoading(false); 
//                 return;
//             }

//             console.log("[ChatPage/Init] Initializing chat logic with param:", initialParam);
//             let targetUserIdForAccessChat = null;
//             let directChatIdFromParam = null;

//             if (initialParam === "admin") {
//                 targetUserIdForAccessChat = ADMIN_ID;
//             } else if (initialParam?.startsWith("user_")) {
//                 const potentialUserId = initialParam.split("_")[1];
//                 if (mongoose.Types.ObjectId.isValid(potentialUserId)) {
//                     targetUserIdForAccessChat = potentialUserId;
//                 } else {
//                     setError("Invalid target user ID in URL.");
//                     setIsChatAccessible(false); setPageLoading(false); return;
//                 }
//             } else if (initialParam && mongoose.Types.ObjectId.isValid(initialParam)) {
//                 directChatIdFromParam = initialParam;
//             } else {
//                 setError(`Invalid chat identifier in URL: ${initialParam}`);
//                 setIsChatAccessible(false); setPageLoading(false); return;
//             }

//             if (targetUserIdForAccessChat) {
//                 console.log("[ChatPage/Init] Accessing chat with target user:", targetUserIdForAccessChat);
//                 try {
//                     const response = await chatService.accessChat(targetUserIdForAccessChat);
//                     if (response.success && response.data?._id) {
//                         const actualChatId = response.data._id;
//                         if (initialParam !== actualChatId && (initialParam === "admin" || initialParam.startsWith("user_"))) {
//                             console.log(`[ChatPage/Init] Navigating from user-param '${initialParam}' to canonical chatId '${actualChatId}'`);
//                             navigate(`/chat/${actualChatId}`, { replace: true }); 
//                             return; 
//                         }
//                         setCurrentChatId(actualChatId);
//                     } else { 
//                         throw new Error(response.message || "Could not access or create chat."); 
//                     }
//                 } catch (err) {
//                     console.error("[ChatPage/Init] Error accessing/creating chat:", err);
//                     setError(err.message || "Failed to initialize chat session.");
//                     setIsChatAccessible(false); setPageLoading(false);
//                 }
//             } else if (directChatIdFromParam) {
//                 console.log("[ChatPage/Init] Using direct chatId from param:", directChatIdFromParam);
//                 setCurrentChatId(directChatIdFromParam);
//             } else {
//                 console.warn("[ChatPage/Init] No valid target for chat initialization.");
//                 setPageLoading(false);
//             }
//         };
//         initializeChatLogic();
//     }, [initialParam, user?._id, navigate, ADMIN_ID, authLoadingFromContext]); 

//     useEffect(() => {
//         if (currentChatId && mongoose.Types.ObjectId.isValid(currentChatId) && user?._id && !authLoadingFromContext) {
//             console.log(`[ChatPage/DataFetchEffect] Conditions met, calling fetchChatData for ${currentChatId}`);
//             fetchChatData(currentChatId);
//         } else {
//              console.log(`[ChatPage/DataFetchEffect] Conditions NOT met for fetchChatData. currentChatId: ${currentChatId}, user?._id: ${user?._id}, authLoading: ${authLoadingFromContext}`);
//              if (!authLoadingFromContext && !currentChatId) {
//                 setPageLoading(false);
//              }
//         }
//     }, [currentChatId, fetchChatData, user?._id, authLoadingFromContext]);

//     useEffect(() => {
//         if (!user?._id || !currentChatId || !mongoose.Types.ObjectId.isValid(currentChatId) || !isChatAccessible) {
//             if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
//             return;
//         }
//         if (!socketRef.current || socketRef.current.io.opts.query.chatId !== currentChatId) {
//             if (socketRef.current) socketRef.current.disconnect();
//             const socketUrl = process.env.REACT_APP_SOCKET_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : window.location.origin);
//             socketRef.current = io(socketUrl, {
//                 transports: ["websocket"], reconnectionAttempts: 5, query: { userId: user._id, chatId: currentChatId }
//             });
//             socketRef.current.on("connect", () => console.log(`[ChatPage] Socket connected: ${socketRef.current.id} for chat ${currentChatId}`));
//             socketRef.current.on("disconnect", (reason) => console.log(`[ChatPage] Socket disconnected from ${currentChatId}, Reason: ${reason}`));
//             socketRef.current.on("connect_error", (err) => console.error(`[ChatPage] Socket connection error for ${currentChatId}: ${err.message}, ${err.data}`));

//             socketRef.current.off("messageReceived"); 
//             socketRef.current.on("messageReceived", (incomingMessage) => {
//                 const messageActualChatId = incomingMessage.chat?._id || incomingMessage.chat;
//                 if (incomingMessage.tempIdUsedBySender && incomingMessage.sender?._id === user._id) {
//                     setMessages((prevMessages) =>
//                         prevMessages.map(msg =>
//                             msg._id === incomingMessage.tempIdUsedBySender
//                             ? { ...incomingMessage, isOptimistic: false, chat: msg.chat } : msg
//                         )); return;
//                 }
//                 if (messageActualChatId === currentChatId) {
//                     setMessages((prevMessages) => {
//                         if (prevMessages.some(msg => msg._id === incomingMessage._id)) {
//                             return prevMessages.map(msg => msg._id === incomingMessage._id ? incomingMessage : msg);
//                         }
//                         return [...prevMessages, incomingMessage];
//                     });
//                 } else {
//                     toast(({ closeToast }) => (<NewCustomToast type="info" headline="New Message" text={`New message in another chat.`} closeToast={closeToast} />));
//                 }
//             });
//         }
//         return () => { if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; } };
//     }, [currentChatId, user?._id, isChatAccessible]); 

//     useEffect(() => { scrollToBottom(); }, [messages]);
//     const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (optionsDropdownRef.current && !optionsDropdownRef.current.contains(event.target) && !event.target.closest("button[data-dropdown-toggle='chat-options']")) { setShowOptionsDropdown(false); }
//             if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && !event.target.closest("#emoji-toggle-button")) { setShowEmojiPicker(false); }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const handleEmojiClick = (emojiObject) => { setNewMessage((prevInput) => prevInput + emojiObject.emoji); };
//     const handleAttachmentClick = () => { fileInputRef.current?.click(); };

//     const handleFileChange = async (event) => {
//         const file = event.target.files[0];
//         if (!file) return;
//         if (!file.type.startsWith("image/")) { toast.error("Only image files are allowed."); if (fileInputRef.current) fileInputRef.current.value = null; return; }
//         if (file.size > 5 * 1024 * 1024) { toast.error("File too large (max 5MB)."); if (fileInputRef.current) fileInputRef.current.value = null; return; }
//         setIsFileUploading(true);
//         const formData = new FormData();
//         formData.append('chatImage', file);
//         try { await sendChatMessage(formData); } // No need to pass type here, sendChatMessage handles it for FormData
//         catch (err) { console.error("[ChatPage] File change: Error in sendChatMessage process", err); toast(({ closeToast }) => <NewCustomToast type="error" headline="Upload Failed" text={err.message || "Could not send image."} closeToast={closeToast} />); }
//         finally { setIsFileUploading(false); if (fileInputRef.current) fileInputRef.current.value = null; }
//     };

//     const sendChatMessage = async (payload) => {
//         if (!socketRef.current?.connected || !currentChatId || !mongoose.Types.ObjectId.isValid(currentChatId)) {
//             toast(({ closeToast }) => <NewCustomToast type="warning" headline="Cannot Send" text="Not connected to chat server." closeToast={closeToast} />); return false;
//         }
//         if (isSending || (isFileUploading && !(payload instanceof FormData))) {
//              toast(({ closeToast }) => <NewCustomToast type="warning" headline="Cannot Send" text="Operation already in progress." closeToast={closeToast} />); return false;
//         }
        
//         const isFormData = payload instanceof FormData;
//         let optimisticContent = "";
//         let messageTypeForOptimistic = "text"; // Default for text
//         const tempMessageId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

//         if (isFormData) {
//             messageTypeForOptimistic = "image";
//             const file = payload.get("chatImage");
//             optimisticContent = file ? URL.createObjectURL(file) : "[Uploading Image...]";
//             // Ensure messageType is in FormData; it's the standard field name now
//             if (!payload.has("messageType")) { // MODIFIED: Check and append "messageType"
//                 payload.append("messageType", "image");
//             }
//             payload.append("tempIdUsedBySender", tempMessageId);
//         } else if (typeof payload === "object" && payload.messageType === "text") { // MODIFIED: Check payload.messageType
//             optimisticContent = payload.content;
//             if (!optimisticContent || !optimisticContent.trim()) return false;
//             payload.tempIdUsedBySender = tempMessageId;
//             // messageTypeForOptimistic is already "text" (default), which is correct
//         } else {
//             console.error("Invalid payload for sendChatMessage", payload);
//             toast.error("Cannot send message due to invalid data.");
//             return false;
//         }

//         if (!isFormData) setIsSending(true);
//         const optimisticMessage = {
//             _id: tempMessageId, sender: { _id: user._id, name: user.name, avatar: user.avatar, role: user.role },
//             content: optimisticContent, messageType: messageTypeForOptimistic, // This uses the correct messageTypeForOptimistic
//             chat: { _id: currentChatId },
//             createdAt: new Date().toISOString(), isOptimistic: true
//         };
//         setMessages((prev) => [...prev, optimisticMessage]);
//         if (messageTypeForOptimistic === "text") setNewMessage("");

//         try {
//             // The payload (whether FormData or object) now consistently uses/contains "messageType"
//             const response = await chatService.sendMessage(currentChatId, payload);
//             if (response.success && response.data) {
//                 const savedMessage = response.data;
//                 setMessages((prev) => prev.map((msg) => (msg._id === tempMessageId ? { ...savedMessage, isOptimistic: false } : msg)));
//                 if (messageTypeForOptimistic === "image" && optimisticContent.startsWith("blob:")) URL.revokeObjectURL(optimisticContent);
//                 return true;
//             } else { throw new Error(response.message || "Failed to send message."); }
//         } catch (err) {
//             console.error("[ChatPage] Error sending message via chatService:", err);
//             toast(({ closeToast }) => <NewCustomToast type="error" headline="Send Failed" text={err.message || "Could not send message."} closeToast={closeToast} />);
//             setMessages((prev) => prev.filter((msg) => msg._id !== tempMessageId));
//             if (messageTypeForOptimistic === "image" && optimisticContent.startsWith("blob:")) URL.revokeObjectURL(optimisticContent);
//             return false;
//         } finally { if (!isFormData) setIsSending(false); }
//     };

//     const handleSendMessage = async (e) => {
//         if (e) e.preventDefault(); const trimmedMessage = newMessage.trim(); if (!trimmedMessage) return;
//         if (user?.role !== "admin" && otherParticipant?._id !== ADMIN_ID && !otherParticipant?.isSelfChat && sensitiveInfoRegex.test(trimmedMessage)) {
//             toast(({ closeToast }) => (<NewCustomToast type="error" headline="Warning" text={"Sharing personal contact or payment details is prohibited."} closeToast={closeToast} />)); return;
//         }
//         // MODIFIED: Pass messageType instead of type
//         await sendChatMessage({ messageType: "text", content: trimmedMessage });
//     };

//     const handleBlockUser = async () => { /* TODO: Implement block user logic */ toast.info("Block user feature coming soon."); setShowOptionsDropdown(false); };
//     const handleReportUser = async () => { /* TODO: Implement report user logic */ toast.info("Report user feature coming soon."); setShowOptionsDropdown(false); };
//     const handleAvatarError = (e) => { e.target.style.display = 'none'; const fallback = e.target.nextSibling; if (fallback?.classList?.contains('avatar-fallback-span')) fallback.style.display = 'flex'; };

//     let chatPartnerHeaderName = "Loading Chat...";
//     if (!pageLoading && otherParticipant) chatPartnerHeaderName = otherParticipant.name || "Chat User";
//     else if (!pageLoading && !otherParticipant && currentChatId && !error) chatPartnerHeaderName = "Loading Participant...";
//     else if (!pageLoading && error) chatPartnerHeaderName = "Error Loading Chat";


//     if (authLoadingFromContext) return <div className="min-h-screen bg-darker-bg flex items-center justify-center"><LoadingSpinner text="Authenticating..." /></div>;
//     if (!user && !authLoadingFromContext) return <Navigate to="/login" replace />;

//     if (pageLoading) {
//         let loadingText = "Initializing chat session...";
//         if (currentChatId && !otherParticipant && !error) loadingText = "Loading participant details...";
//         else if (currentChatId && !error) loadingText = "Loading messages...";
//         return <div className="min-h-screen bg-darker-bg flex items-center justify-center"><LoadingSpinner text={loadingText} /></div>;
//     }

//     if (error || !isChatAccessible) {
//         return (<div className="min-h-screen bg-darker-bg p-8 flex flex-col items-center justify-center"> <ErrorMessage message={error || "Cannot access this chat."} /> <Link to="/chats" className="text-blue-400 hover:underline mt-4 inline-block"> Back to Chats </Link> </div>);
//     }
    
//     const isOtherParticipantLinkable = otherParticipant && 
//                                    otherParticipant._id && 
//                                    !otherParticipant.isSelfChat && 
//                                    !otherParticipant.isGroupChat && 
//                                    mongoose.Types.ObjectId.isValid(otherParticipant._id) &&
//                                    otherParticipant._id !== "unknown" && 
//                                    otherParticipant._id !== "unknown_fallback";


//     return (
//         <>
//             <div className="wrapper">
//                 <div className="chat">
//                     {/* Header */}
//                     <div className="p-3 md:p-4 border-b border-gray-600/50 flex items-center gap-3 flex-shrink-0 bg-black/30 sticky top-0 z-20">
//                         <Link to="/chats" className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"> <ArrowLeft size={20} /> </Link>
                        
//                         {isOtherParticipantLinkable ? (
//                             <Link to={`/profile/${otherParticipant._id}`} className="flex items-center gap-3 group flex-grow truncate">
//                                 <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden text-xs font-bold text-white flex-shrink-0 relative group-hover:ring-2 group-hover:ring-blue-400 transition-all">
//                                     {otherParticipant?.avatar ? (<img src={otherParticipant.avatar.startsWith('http') || otherParticipant.avatar.startsWith('blob:') ? otherParticipant.avatar : `${IMAGE_BASE_URL}/uploads/${otherParticipant.avatar}`} alt={otherParticipant.name || 'Avatar'} className="w-full h-full object-cover" onError={handleAvatarError} />)
//                                     : (<span className="avatar-fallback-span font-bold text-xs text-white items-center justify-center w-full h-full" style={{ display: 'flex' }}>{getInitials(otherParticipant?.name)}</span>)}
//                                 </div>
//                                 <div className="flex items-center flex-grow truncate">
//                                     <h2 className="text-md font-semibold truncate text-gray-100 group-hover:text-blue-300 transition-colors">{chatPartnerHeaderName}</h2>
//                                     {!otherParticipant.isSelfChat && !otherParticipant.isGroupChat && <UserRoleTag role={otherParticipant.role} />}
//                                 </div>
//                             </Link>
//                         ) : (
//                             <div className="flex items-center gap-3 flex-grow truncate">
//                                 <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden text-xs font-bold text-white flex-shrink-0 relative">
//                                     {otherParticipant?.avatar ? (<img src={otherParticipant.avatar.startsWith('http') || otherParticipant.avatar.startsWith('blob:') ? otherParticipant.avatar : `${IMAGE_BASE_URL}/uploads/${otherParticipant.avatar}`} alt={otherParticipant.name || 'Avatar'} className="w-full h-full object-cover" onError={handleAvatarError} />)
//                                     : (<span className="avatar-fallback-span font-bold text-xs text-white items-center justify-center w-full h-full" style={{ display: 'flex' }}>{getInitials(otherParticipant?.name)}</span>)}
//                                 </div>
//                                 <div className="flex items-center flex-grow truncate">
//                                     <h2 className="text-md font-semibold truncate text-gray-100">{chatPartnerHeaderName}</h2>
//                                     {otherParticipant && !otherParticipant.isSelfChat && !otherParticipant.isGroupChat && <UserRoleTag role={otherParticipant.role} />}
//                                 </div>
//                             </div>
//                         )}
                        
//                         {otherParticipant && otherParticipant._id !== ADMIN_ID && !otherParticipant.isSelfChat && !otherParticipant.isGroupChat && user?.role !== "admin" && (
//                             <div className="relative" ref={optionsDropdownRef}>
//                                 <button data-dropdown-toggle="chat-options" onClick={() => setShowOptionsDropdown(p => !p)} className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10"> <MoreVertical size={20} /> </button>
//                                 {showOptionsDropdown && (
//                                     <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-30 py-1 origin-top-right">
//                                         <button onClick={handleBlockUser} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"><UserX size={16}/> Block User</button>
//                                         <button onClick={handleReportUser} className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-500/20 transition-colors flex items-center gap-2"><AlertTriangleIcon size={16}/> Report User</button>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     {user && user.role !== "admin" && otherParticipant?._id !== ADMIN_ID && !otherParticipant?.isSelfChat && !otherParticipant?.isGroupChat && (
//                         <div className="p-2 bg-yellow-900/70 border-b border-yellow-700/60 text-yellow-100 text-xs text-center flex-shrink-0 backdrop-blur-sm sticky top-[57px] md:top-[65px] z-10">
//                             ⚠️ Sharing personal contact or payment details is strictly prohibited.
//                         </div>
//                     )}

//                     <div className="messages flex-grow overflow-y-auto p-4 space-y-2" ref={messagesContainerRef}>
//                         {Array.isArray(messages) && messages.map((msg, index) => {
//                             const isSelf = msg.sender?._id === user._id;
//                             const senderInfo = isSelf ? user : (otherParticipant && otherParticipant._id === msg.sender?._id ? otherParticipant : msg.sender);
//                             const prevMessage = messages[index - 1];
//                             const showAvatar = !isSelf && senderInfo && (index === 0 || prevMessage?.sender?._id !== msg.sender?._id || (new Date(msg.createdAt).getTime() - new Date(prevMessage?.createdAt || 0).getTime() > 300000));
//                             const imageUrl = getImageUrl(msg); // Relies on msg.messageType
//                             const isSenderLinkable = senderInfo && senderInfo._id && mongoose.Types.ObjectId.isValid(senderInfo._id) && senderInfo._id !== user._id;


//                             return (
//                                 <div key={msg._id || msg.tempIdUsedBySender || msg.createdAt} className={`flex items-end gap-2 ${isSelf ? "justify-end" : "justify-start"}`}>
//                                     {!isSelf && (<div className="w-6 h-6 flex-shrink-0 self-end mb-0.5"> {showAvatar && senderInfo && (
//                                         isSenderLinkable ? (
//                                             <Link to={`/profile/${senderInfo._id}`} className="block w-full h-full rounded-full group">
//                                                 <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center overflow-hidden text-xxs font-bold text-white relative group-hover:ring-1 group-hover:ring-blue-400 transition-all">
//                                                     {senderInfo.avatar ? (<img src={senderInfo.avatar.startsWith('http') || senderInfo.avatar.startsWith('blob:') ? senderInfo.avatar : `${IMAGE_BASE_URL}/uploads/${senderInfo.avatar}`} alt={senderInfo.name} className="w-full h-full object-cover" onError={handleAvatarError} />)
//                                                     : (<span className="avatar-fallback-span font-bold text-xxs text-white items-center justify-center w-full h-full" style={{ display: 'flex' }}>{getInitials(senderInfo.name)}</span>)}
//                                                 </div>
//                                             </Link>
//                                         ) : (
//                                             <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center overflow-hidden text-xxs font-bold text-white relative">
//                                                 {senderInfo.avatar ? (<img src={senderInfo.avatar.startsWith('http') || senderInfo.avatar.startsWith('blob:') ? senderInfo.avatar : `${IMAGE_BASE_URL}/uploads/${senderInfo.avatar}`} alt={senderInfo.name} className="w-full h-full object-cover" onError={handleAvatarError} />)
//                                                 : (<span className="avatar-fallback-span font-bold text-xxs text-white items-center justify-center w-full h-full" style={{ display: 'flex' }}>{getInitials(senderInfo.name)}</span>)}
//                                             </div>
//                                         )
//                                     )} </div>
//                                     )}
//                                     <div className={`message max-w-[70%] md:max-w-[60%] p-0 overflow-hidden shadow-md ${isSelf ? "self bg-blue-600 text-white rounded-l-lg rounded-br-lg" : "other bg-gray-700 text-gray-100 rounded-r-lg rounded-bl-lg"} ${msg.isOptimistic ? "opacity-60 animate-pulse" : ""}`}>
//                                         {/* This rendering logic depends on msg.messageType */}
//                                         {msg.messageType === "image" && imageUrl ? (
//                                             <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block group relative">
//                                                 <img src={imageUrl} alt="Chat attachment" className="max-w-xs max-h-60 md:max-h-72 object-contain bg-black/20 block rounded-sm" />
//                                                 <div className="absolute bottom-1 right-1.5">
//                                                     <p className={`timestamp text-[0.6rem] px-1.5 py-0.5 rounded backdrop-blur-sm ${isSelf ? "bg-blue-800/50 text-blue-100/90" : "bg-gray-900/50 text-gray-300/90"}`}>
//                                                         {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                                                     </p>
//                                                 </div>
//                                             </a>
//                                         ) : (
//                                             <div className="px-3 py-2">
//                                                 <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
//                                                 <p className={`timestamp text-xs mt-1 ${isSelf ? "text-blue-200/80 text-right" : "text-gray-300/80 text-left"}`}>
//                                                     {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                                                 </p>
//                                             </div>
//                                         )}
//                                     </div>
//                                     {isSelf && <div className="w-6 flex-shrink-0"></div>}
//                                 </div>
//                             );
//                         })}
//                         <div ref={messagesEndRef} />
//                     </div>

//                     {isChatAccessible && !error && (
//                         <div className="write relative p-3 border-t border-gray-600/50 bg-black/20">
//                             {showEmojiPicker && (<div ref={emojiPickerRef} className="absolute bottom-full left-0 right-0 sm:left-2 sm:right-auto mx-auto sm:mx-0 mb-1 z-30 flex justify-center sm:justify-start"> <EmojiPicker onEmojiClick={handleEmojiClick} emojiStyle={EmojiStyle.NATIVE} lazyLoadEmojis={true} theme={EmojiTheme.DARK} searchPlaceholder="Search emoji" suggestedEmojisMode="recent" width="90%" maxWidth={350} height={380} /> </div>)}
//                             <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
//                                 <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
//                                 <button type="button" onClick={handleAttachmentClick} disabled={isFileUploading || isSending} className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 disabled:opacity-50"> {isFileUploading ? <LoadingSpinnerSmall /> : <Paperclip size={20}/>} </button>
//                                 <button id="emoji-toggle-button" type="button" onClick={() => setShowEmojiPicker(p => !p)} className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10"> <Smile size={20}/> </button>
//                                 <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Your message..." className="input flex-grow bg-gray-700/50 border-gray-600/70 rounded-full py-2 px-4 text-sm text-gray-100 placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" disabled={isSending || isFileUploading} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }} />
//                                 <button type="submit" disabled={!newMessage.trim() || isSending || isFileUploading} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 send-button"> {(isSending && !isFileUploading) || (isFileUploading && !isSending) ? <LoadingSpinnerSmall /> : <Send size={20} />} </button>
//                             </form>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             <style>
//                 {`
//                 body, html { margin: 0; padding: 0; line-height: 1.5; font-family: Helvetica, sans-serif; font-size: 1.0rem; }
//                 @media(max-width: 1000px) { body, html { font-size: 14px; } }
//                 *, *::before, *::after { box-sizing: border-box; }
//                 .wrapper {
//                     min-height: 100vh; width: 100%;
//                     background-image: url(https://images.unsplash.com/photo-1638272181967-7d3772a91265?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80);
//                     background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed;
//                     padding: 0; display: flex; justify-content: center; align-items: center;
//                 }
//                 .chat {
//                     height: 100%; max-height: 100vh; width: 100%; max-width: 800px; 
//                     display: flex; flex-direction: column; gap: 0px;
//                     background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
//                     border-radius: 0; border: 1px solid rgba(255, 255, 255, 0.1);
//                     box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2); overflow: hidden;
//                 }
//                 @media (min-width: 768px) { 
//                     .wrapper { padding: 2rem 10%; } 
//                     .chat { border-radius: 15px; max-height: calc(100vh - 4rem); } 
//                 }
//                 @media (min-width: 1024px) { 
//                     .wrapper { padding: 50px 15%; } 
//                     .chat { max-height: 85vh; } 
//                 }
//                 .write { padding: 10px 15px; border-top: 1px solid rgba(255, 255, 255, 0.1); background: rgba(0, 0, 0, 0.4); flex-shrink: 0; position: relative; }
//                 .input { flex-grow: 1; font: inherit; color: rgba(255, 255, 255, .9); outline: none; padding: 10px 15px; background: rgba(255, 255, 255, .10); box-shadow: 0 4px 15px 0 rgba(31, 38, 135, 0.1); backdrop-filter: blur(5px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); transition: background 200ms; font-size: 0.9rem; line-height: 1.3; }
//                 .input:focus { background: rgba(255, 255, 255, .15); }
//                 .input::placeholder { color: rgba(255, 255, 255, .5); }
//                 .messages { flex-grow: 1; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; padding: 15px; scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, .3) transparent; }
//                 .messages::-webkit-scrollbar { width: 6px; } 
//                 .messages::-webkit-scrollbar-track { background: transparent; }
//                 .messages::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, .3); border-radius: 3px; } 
//                 .message { display: flex; flex-direction: column; overflow-wrap: anywhere; background: rgba(255, 255, 255, .15); box-shadow: 0 1px 2px 0 rgba(0,0,0,0.1); border: 1px solid rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, .9); padding: 0; max-width: 70%; width: fit-content; font-size: 0.9rem; line-height: 1.4; border-radius: 10px; }
//                 .message p:not(.timestamp) { margin: 0; }
//                 .message.self { margin-left: auto; background: rgba(60, 90, 255, .6); border-color: rgba(60, 90, 255, 0.7); color: white; }
//                 .timestamp { font-size: 0.6rem; line-height: 0.8rem; margin-top: 2px; opacity: 0.8; } 
//                 .timestamp.self { color: rgba(220, 230, 255, .8); text-align: right; }
//                 .timestamp:not(.self) { color: rgba(255, 255, 255, .7); text-align: left; }
//                 .write form button { flex-shrink: 0; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.7); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s ease; }
//                 .write form button:hover:not(:disabled) { background-color: rgba(255, 255, 255, 0.2); color: white; }
//                 .write form button:disabled { opacity: 0.5; cursor: not-allowed; }
//                 .write form button.send-button { background-color: #3c5aff; color: white; }
//                 .write form button.send-button:hover:not(:disabled) { background-color: #4a6aff; }
//                 .text-xxs { font-size: 0.65rem; line-height: 0.8rem; }
//                 .avatar-fallback-span { display: flex; align-items: center; justify-content: center; }
//                 `}
//             </style>
//         </>
//     );
// };

// export default ChatPage;



//from grok

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, Link, useNavigate, Navigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { chatService, orderService } from "../services/apiService"
import NewCustomToast from "../components/NewCustomToast"
import { toast } from "react-toastify"
import { io } from "socket.io-client"
import mongoose from "mongoose"
import EmojiPicker, { EmojiStyle, Theme as EmojiTheme } from "emoji-picker-react"
import moment from "moment"
import { ArrowLeft, Paperclip, Smile, Send, MoreVertical, UserX, AlertTriangleIcon } from "lucide-react"

// --- UI Components ---
const LoadingSpinner = ({ text = "Loading Chat..." }) => (
  <div className="flex flex-col justify-center items-center py-16 h-full text-gray-400">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400 mb-3"></div>
    <p>{text}</p>
  </div>
)

const ErrorMessage = ({ message }) => (
  <div className="bg-red-900/30 border border-red-500/30 text-red-300 p-4 rounded-lg text-center my-6 mx-auto max-w-md">
    {message || "Could not load chat details."}
  </div>
)

const LoadingSpinnerSmall = () => (
  <svg
    className="animate-spin h-4 w-4 text-gray-300"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

const UserRoleTag = ({ role }) => {
  if (!role) return null
  let bgColor = "bg-gray-500/50"
  let textColor = "text-gray-200"
  let text = role.charAt(0).toUpperCase() + role.slice(1)
  switch (role.toLowerCase()) {
    case "seller":
      bgColor = "bg-blue-500/50"
      textColor = "text-blue-100"
      text = "Seller"
      break
    case "buyer":
      bgColor = "bg-green-500/50"
      textColor = "text-green-100"
      text = "Buyer"
      break
    case "admin":
      bgColor = "bg-purple-500/50"
      textColor = "text-purple-100"
      text = "Admin"
      break
    default:
      return null
  }
  return (
    <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${bgColor} ${textColor} ml-2 flex-shrink-0`}>
      {text}
    </span>
  )
}

// --- ChatPage Component ---
const ChatPage = () => {
  const { chatId: initialParam } = useParams()
  const { user, loading: authLoadingFromContext } = useAuth()
  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [otherParticipant, setOtherParticipant] = useState(null)
  const [currentChatId, setCurrentChatId] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [isChatAccessible, setIsChatAccessible] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false)
  const [isFileUploading, setIsFileUploading] = useState(false)
  const [chatExpiration, setChatExpiration] = useState(null)
  const [isChatExpired, setIsChatExpired] = useState(false)
  const [autoReplyMessage, setAutoReplyMessage] = useState(null) // ADD THIS LINE

  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const optionsDropdownRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || "").replace("/api", "")
  const ADMIN_ID = "681a1c1c80f6185bd9b9c000"

  const getInitials = (name = "") =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  const sensitiveInfoRegex =
    /(\+\d{1,3}[- ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}|[\w.-]+@[\w-]+\.[\w.-]+|\b(bank|account|iban|swift|bic|card number|credit card|cvv|pin)\b/i

  const getImageUrl = (msg) => {
    if (!msg || !msg.content) return null
    if (msg.content.startsWith("blob:")) return msg.content
    if (msg.messageType === "image") return `${IMAGE_BASE_URL}/Uploads/${msg.content}`
    return null
  }

  const fetchChatData = useCallback(
    async (cIdToFetch) => {
      console.log(`[ChatPage] fetchChatData called for chatId: ${cIdToFetch}`)
      if (!cIdToFetch || !mongoose.Types.ObjectId.isValid(cIdToFetch)) {
        setError("Invalid Chat ID for fetching data.")
        setPageLoading(false)
        setIsChatAccessible(false)
        return
      }
      setPageLoading(true)
      setError(null)

      try {
        const serviceResponse = await chatService.getMessages(cIdToFetch)
        console.log("[ChatPage] Received from chatService.getMessages:", JSON.stringify(serviceResponse, null, 2))

        if (!serviceResponse) {
          throw new Error("Failed to fetch chat data: No response from service.")
        }
        if (serviceResponse.success === false || !serviceResponse.data) {
          throw new Error(serviceResponse.message || "Failed to retrieve chat details.")
        }

        const chatDataFromService = serviceResponse.data
        if (typeof chatDataFromService.messages === "undefined" || typeof chatDataFromService.chat === "undefined") {
          throw new Error("Chat data structure from service is invalid (missing messages or chat).")
        }

        if (!Array.isArray(chatDataFromService.messages)) {
          setMessages([])
          throw new Error(`Received non-array data for messages. Type: ${typeof chatDataFromService.messages}`)
        } else {
          setMessages(chatDataFromService.messages)
        }

        const currentChatDetails = chatDataFromService.chat
        setChatExpiration(currentChatDetails.expiresAt || null)
        setIsChatExpired(currentChatDetails.isExpired || false)

        const currentChatParticipants = currentChatDetails.participants || []
        let determinedOtherParticipant = null

        if (user?._id) {
          const otherP = currentChatParticipants.find((p) => p._id !== user._id)
          if (otherP) {
            determinedOtherParticipant = otherP
          } else if (currentChatParticipants.length === 1 && currentChatParticipants[0]._id === user._id) {
            determinedOtherParticipant = {
              _id: user._id,
              name: "Notes to Self",
              avatar: user.avatar,
              role: user.role,
              isSelfChat: true,
            }
          } else if (currentChatDetails.isGroupChat) {
            determinedOtherParticipant = {
              name: currentChatDetails.chatName || "Group Chat",
              isGroupChat: true,
              _id: currentChatDetails._id,
            }
          } else {
            const adminAsParticipant = currentChatParticipants.find((p) => p._id === ADMIN_ID)
            if (user._id === ADMIN_ID && otherP) {
              determinedOtherParticipant = otherP
            } else if (adminAsParticipant && user._id !== ADMIN_ID) {
              determinedOtherParticipant = adminAsParticipant
              if (!determinedOtherParticipant.name) determinedOtherParticipant.name = "Admin Support"
            } else {
              console.warn(
                "[ChatPage] Could not determine other participant. Chat Participants:",
                currentChatParticipants,
                "User ID:",
                user._id,
              )
              if (currentChatParticipants.length > 0) {
                determinedOtherParticipant = currentChatParticipants.find((p) => p._id !== user._id) || {
                  name: "Unknown User",
                  _id: "unknown",
                }
              } else {
                determinedOtherParticipant = { name: "Unknown Chat", _id: "unknown_chat_no_participants" }
              }
            }
          }
        }

        if (
          !determinedOtherParticipant &&
          currentChatDetails &&
          !currentChatDetails.isGroupChat &&
          !(currentChatParticipants.length === 1 && currentChatParticipants[0]._id === user._id)
        ) {
          console.error("[ChatPage] Critical: Failed to determine other participant. Defaulting to 'Unknown User'.")
          determinedOtherParticipant = { name: "Unknown User", _id: "unknown_fallback" }
        }

        setOtherParticipant(determinedOtherParticipant)
        setIsChatAccessible(true)

        // Fetch auto-reply message if it's the first time accessing the chat
        if (chatDataFromService.messages.length === 0 && currentChatDetails.orderId) {
          try {
            const orderDetails = await orderService.getOrderById(currentChatDetails.orderId)
            if (orderDetails?.success && orderDetails.data?.sellerMessage?.message) {
              setAutoReplyMessage(orderDetails.data.sellerMessage.message)
            }
          } catch (orderErr) {
            console.error("[ChatPage] Error fetching order details for auto-reply:", orderErr)
          }
        }
      } catch (err) {
        console.error("[ChatPage] Error in fetchChatData:", err)
        setError(err.message || "Failed to load chat. Check console.")
        setMessages([])
        setOtherParticipant(null)
        setIsChatAccessible(false)
      } finally {
        setPageLoading(false)
      }
    },
    [user, ADMIN_ID],
  )

  useEffect(() => {
    setPageLoading(true)
    setError(null)
    setMessages([])
    setOtherParticipant(null)
    setIsChatAccessible(true)
    setCurrentChatId(null)
    setChatExpiration(null)
    setIsChatExpired(false)
    setAutoReplyMessage(null) // ADD THIS LINE

    const initializeChatLogic = async () => {
      if (authLoadingFromContext) {
        console.log("[ChatPage/Init] Auth context still loading.")
        return
      }
      if (!user?._id) {
        console.log(
          "[ChatPage/Init] User not available from auth context yet. Page loading will be set to false if user remains null.",
        )
        setPageLoading(false)
        return
      }

      console.log("[ChatPage/Init] Initializing chat logic with param:", initialParam)
      let targetUserIdForAccessChat = null
      let directChatIdFromParam = null

      if (initialParam === "admin") {
        targetUserIdForAccessChat = ADMIN_ID
      } else if (initialParam?.startsWith("user_")) {
        const potentialUserId = initialParam.split("_")[1]
        if (mongoose.Types.ObjectId.isValid(potentialUserId)) {
          targetUserIdForAccessChat = potentialUserId
        } else {
          setError("Invalid target user ID in URL.")
          setIsChatAccessible(false)
          setPageLoading(false)
          return
        }
      } else if (initialParam && mongoose.Types.ObjectId.isValid(initialParam)) {
        directChatIdFromParam = initialParam
      } else {
        setError(`Invalid chat identifier in URL: ${initialParam}`)
        setIsChatAccessible(false)
        setPageLoading(false)
        return
      }

      if (targetUserIdForAccessChat) {
        console.log("[ChatPage/Init] Accessing chat with target user:", targetUserIdForAccessChat)
        try {
          const response = await chatService.accessChat(targetUserIdForAccessChat)
          if (response.success && response.data?._id) {
            const actualChatId = response.data._id
            if (initialParam !== actualChatId && (initialParam === "admin" || initialParam.startsWith("user_"))) {
              console.log(
                `[ChatPage/Init] Navigating from user-param '${initialParam}' to canonical chatId '${actualChatId}'`,
              )
              navigate(`/chat/${actualChatId}`, { replace: true })
              return
            }
            setCurrentChatId(actualChatId)
          } else {
            throw new Error(response.message || "Could not access or create chat.")
          }
        } catch (err) {
          console.error("[ChatPage/Init] Error accessing/creating chat:", err)
          setError(err.message || "Failed to initialize chat session.")
          setIsChatAccessible(false)
          setPageLoading(false)
        }
      } else if (directChatIdFromParam) {
        console.log("[ChatPage/Init] Using direct chatId from param:", directChatIdFromParam)
        setCurrentChatId(directChatIdFromParam)
      } else {
        console.warn("[ChatPage/Init] No valid target for chat initialization.")
        setPageLoading(false)
      }
    }
    initializeChatLogic()
  }, [initialParam, user?._id, navigate, ADMIN_ID, authLoadingFromContext])

  useEffect(() => {
    if (currentChatId && mongoose.Types.ObjectId.isValid(currentChatId) && user?._id && !authLoadingFromContext) {
      console.log(`[ChatPage/DataFetchEffect] Conditions met, calling fetchChatData for ${currentChatId}`)
      fetchChatData(currentChatId)
    } else {
      console.log(
        `[ChatPage/DataFetchEffect] Conditions NOT met for fetchChatData. currentChatId: ${currentChatId}, user?._id: ${user?._id}, authLoading: ${authLoadingFromContext}`,
      )
      if (!authLoadingFromContext && !currentChatId) {
        setPageLoading(false)
      }
    }
  }, [currentChatId, fetchChatData, user?._id, authLoadingFromContext])

  useEffect(() => {
    if (!user?._id || !currentChatId || !mongoose.Types.ObjectId.isValid(currentChatId) || !isChatAccessible) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      return
    }
    if (!socketRef.current || socketRef.current.io.opts.query.chatId !== currentChatId) {
      if (socketRef.current) socketRef.current.disconnect()
      const socketUrl =
        process.env.REACT_APP_SOCKET_URL ||
        (window.location.hostname === "localhost" ? "http://localhost:5000" : window.location.origin)
      socketRef.current = io(socketUrl, {
        transports: ["websocket"],
        reconnectionAttempts: 5,
        query: { userId: user._id, chatId: currentChatId },
      })
      socketRef.current.on("connect", () =>
        console.log(`[ChatPage] Socket connected: ${socketRef.current.id} for chat ${currentChatId}`),
      )
      socketRef.current.on("disconnect", (reason) =>
        console.log(`[ChatPage] Socket disconnected from ${currentChatId}, Reason: ${reason}`),
      )
      socketRef.current.on("connect_error", (err) =>
        console.error(`[ChatPage] Socket connection error for ${currentChatId}: ${err.message}, ${err.data}`),
      )

      socketRef.current.off("messageReceived")
      socketRef.current.on("messageReceived", (incomingMessage) => {
        const messageActualChatId = incomingMessage.chat?._id || incomingMessage.chat
        if (incomingMessage.tempIdUsedBySender && incomingMessage.sender?._id === user._id) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg._id === incomingMessage.tempIdUsedBySender
                ? { ...incomingMessage, isOptimistic: false, chat: msg.chat }
                : msg,
            ),
          )
          return
        }
        if (messageActualChatId === currentChatId) {
          setMessages((prevMessages) => {
            if (prevMessages.some((msg) => msg._id === incomingMessage._id)) {
              return prevMessages.map((msg) => (msg._id === incomingMessage._id ? incomingMessage : msg))
            }
            return [...prevMessages, incomingMessage]
          })
        } else {
          toast(({ closeToast }) => (
            <NewCustomToast
              type="info"
              headline="New Message"
              text={`New message in another chat.`}
              closeToast={closeToast}
            />
          ))
        }
      })
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [currentChatId, user?._id, isChatAccessible])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (chatExpiration && !isChatExpired) {
      const timer = setInterval(() => {
        const now = moment()
        const expires = moment(chatExpiration)
        if (expires.isBefore(now)) {
          setIsChatExpired(true)
          clearInterval(timer)
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [chatExpiration, isChatExpired])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionsDropdownRef.current &&
        !optionsDropdownRef.current.contains(event.target) &&
        !event.target.closest("button[data-dropdown-toggle='chat-options']")
      ) {
        setShowOptionsDropdown(false)
      }
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest("#emoji-toggle-button")
      ) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevInput) => prevInput + emojiObject.emoji)
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.")
      if (fileInputRef.current) fileInputRef.current.value = null
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB).")
      if (fileInputRef.current) fileInputRef.current.value = null
      return
    }
    setIsFileUploading(true)
    const formData = new FormData()
    formData.append("chatImage", file)
    try {
      await sendChatMessage(formData)
    } catch (err) {
      console.error("[ChatPage] File change: Error in sendChatMessage process", err)
      toast(({ closeToast }) => (
        <NewCustomToast
          type="error"
          headline="Upload Failed"
          text={err.message || "Could not send image."}
          closeToast={closeToast}
        />
      ))
    } finally {
      setIsFileUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = null
    }
  }

  const sendChatMessage = async (payload) => {
    if (!socketRef.current?.connected || !currentChatId || !mongoose.Types.ObjectId.isValid(currentChatId)) {
      toast(({ closeToast }) => (
        <NewCustomToast
          type="warning"
          headline="Cannot Send"
          text="Not connected to chat server."
          closeToast={closeToast}
        />
      ))
      return false
    }
    if (isSending || (isFileUploading && !(payload instanceof FormData))) {
      toast(({ closeToast }) => (
        <NewCustomToast
          type="warning"
          headline="Cannot Send"
          text="Operation already in progress."
          closeToast={closeToast}
        />
      ))
      return false
    }
    if (isChatExpired) {
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="Cannot Send" text="This chat has expired." closeToast={closeToast} />
      ))
      return false
    }

    const isFormData = payload instanceof FormData
    let optimisticContent = ""
    let messageTypeForOptimistic = "text"
    const tempMessageId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    if (isFormData) {
      messageTypeForOptimistic = "image"
      const file = payload.get("chatImage")
      optimisticContent = file ? URL.createObjectURL(file) : "[Uploading Image...]"
      if (!payload.has("messageType")) {
        payload.append("messageType", "image")
      }
      payload.append("tempIdUsedBySender", tempMessageId)
    } else if (typeof payload === "object" && payload.messageType === "text") {
      optimisticContent = payload.content
      if (!optimisticContent || !optimisticContent.trim()) return false
      payload.tempIdUsedBySender = tempMessageId
    } else {
      console.error("Invalid payload for sendChatMessage", payload)
      toast.error("Cannot send message due to invalid data.")
      return false
    }

    if (!isFormData) setIsSending(true)
    const optimisticMessage = {
      _id: tempMessageId,
      sender: { _id: user._id, name: user.name, avatar: user.avatar, role: user.role },
      content: optimisticContent,
      messageType: messageTypeForOptimistic,
      chat: { _id: currentChatId },
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    }
    setMessages((prev) => [...prev, optimisticMessage])
    if (messageTypeForOptimistic === "text") setNewMessage("")

    try {
      const response = await chatService.sendMessage(currentChatId, payload)
      if (response.success && response.data) {
        const savedMessage = response.data
        setMessages((prev) =>
          prev.map((msg) => (msg._id === tempMessageId ? { ...savedMessage, isOptimistic: false } : msg)),
        )
        if (messageTypeForOptimistic === "image" && optimisticContent.startsWith("blob:"))
          URL.revokeObjectURL(optimisticContent)
        return true
      } else {
        throw new Error(response.message || "Failed to send message.")
      }
    } catch (err) {
      console.error("[ChatPage] Error sending message via chatService:", err)
      toast(({ closeToast }) => (
        <NewCustomToast
          type="error"
          headline="Send Failed"
          text={err.message || "Could not send message."}
          closeToast={closeToast}
        />
      ))
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessageId))
      if (messageTypeForOptimistic === "image" && optimisticContent.startsWith("blob:"))
        URL.revokeObjectURL(optimisticContent)
      return false
    } finally {
      if (!isFormData) setIsSending(false)
    }
  }

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault()
    const trimmedMessage = newMessage.trim()
    if (!trimmedMessage) return
    if (
      user?.role !== "admin" &&
      otherParticipant?._id !== ADMIN_ID &&
      !otherParticipant?.isSelfChat &&
      !otherParticipant?.isGroupChat &&
      sensitiveInfoRegex.test(trimmedMessage)
    ) {
      toast(({ closeToast }) => (
        <NewCustomToast
          type="error"
          headline="Warning"
          text={"Sharing personal contact or payment details is prohibited."}
          closeToast={closeToast}
        />
      ))
      return
    }
    await sendChatMessage({ messageType: "text", content: trimmedMessage })
  }

  const handleBlockUser = async () => {
    toast.info("Block user feature coming soon.")
    setShowOptionsDropdown(false)
  }

  const handleReportUser = async () => {
    toast.info("Report user feature coming soon.")
    setShowOptionsDropdown(false)
  }

  const handleAvatarError = (e) => {
    e.target.style.display = "none"
    const fallback = e.target.nextSibling
    if (fallback?.classList?.contains("avatar-fallback-span")) fallback.style.display = "flex"
  }

  const renderExpirationWarning = () => {
    if (isChatExpired) {
      return (
        <div className="p-2 bg-red-900/70 border-b border-red-700/60 text-red-100 text-xs text-center">
          This chat has expired and is no longer active.
        </div>
      )
    }
    if (chatExpiration) {
      const timeLeft = moment(chatExpiration).diff(moment(), "hours")
      if (timeLeft <= 24) {
        return (
          <div className="p-2 bg-yellow-900/70 border-b border-yellow-700/60 text-yellow-100 text-xs text-center">
            Chat expires in {moment(chatExpiration).fromNow(true)}. Messages will be disabled after expiration.
          </div>
        )
      }
    }
    return null
  }

  let chatPartnerHeaderName = "Loading Chat..."
  if (!pageLoading && otherParticipant) chatPartnerHeaderName = otherParticipant.name || "Chat User"
  else if (!pageLoading && !otherParticipant && currentChatId && !error)
    chatPartnerHeaderName = "Loading Participant..."
  else if (!pageLoading && error) chatPartnerHeaderName = "Error Loading Chat"

  if (authLoadingFromContext)
    return (
      <div className="min-h-screen bg-darker-bg flex items-center justify-center">
        <LoadingSpinner text="Authenticating..." />
      </div>
    )
  if (!user && !authLoadingFromContext) return <Navigate to="/login" replace />

  if (pageLoading) {
    let loadingText = "Initializing chat session..."
    if (currentChatId && !otherParticipant && !error) loadingText = "Loading participant details..."
    else if (currentChatId && !error) loadingText = "Loading messages..."
    return (
      <div className="min-h-screen bg-darker-bg flex items-center justify-center">
        <LoadingSpinner text={loadingText} />
      </div>
    )
  }

  if (error || !isChatAccessible) {
    return (
      <div className="min-h-screen bg-darker-bg p-8 flex flex-col items-center justify-center">
        <ErrorMessage message={error || "Cannot access this chat."} />
        <Link to="/chats" className="text-blue-400 hover:underline mt-4 inline-block">
          Back to Chats
        </Link>
      </div>
    )
  }

  const isOtherParticipantLinkable =
    otherParticipant &&
    otherParticipant._id &&
    !otherParticipant.isSelfChat &&
    !otherParticipant.isGroupChat &&
    mongoose.Types.ObjectId.isValid(otherParticipant._id) &&
    otherParticipant._id !== "unknown" &&
    otherParticipant._id !== "unknown_fallback"

  return (
    <>
      <div className="wrapper">
        <div className="chat">
          <div className="p-3 md:p-4 border-b border-gray-600/50 flex items-center gap-3 flex-shrink-0 bg-black/30 sticky top-0 z-20">
            <Link to="/chats" className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10">
              <ArrowLeft size={20} />
            </Link>
            {isOtherParticipantLinkable ? (
              <Link
                to={`/profile/${otherParticipant._id}`}
                className="flex items-center gap-3 group flex-grow truncate"
              >
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden text-xs font-bold text-white flex-shrink-0 relative group-hover:ring-2 group-hover:ring-blue-400 transition-all">
                  {otherParticipant?.avatar ? (
                    <img
                      src={
                        otherParticipant.avatar.startsWith("http") || otherParticipant.avatar.startsWith("blob:")
                          ? otherParticipant.avatar
                          : `${IMAGE_BASE_URL}/Uploads/${otherParticipant.avatar}`
                      }
                      alt={otherParticipant.name || "Avatar"}
                      className="w-full h-full object-cover"
                      onError={handleAvatarError}
                    />
                  ) : (
                    <span
                      className="avatar-fallback-span font-bold text-xs text-white items-center justify-center w-full h-full"
                      style={{ display: "flex" }}
                    >
                      {getInitials(otherParticipant?.name)}
                    </span>
                  )}
                </div>
                <div className="flex items-center flex-grow truncate">
                  <h2 className="text-md font-semibold truncate text-gray-100 group-hover:text-blue-300 transition-colors">
                    {chatPartnerHeaderName}
                  </h2>
                  {!otherParticipant.isSelfChat && !otherParticipant.isGroupChat && (
                    <UserRoleTag role={otherParticipant.role} />
                  )}
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 flex-grow truncate">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden text-xs font-bold text-white flex-shrink-0 relative">
                  {otherParticipant?.avatar ? (
                    <img
                      src={
                        otherParticipant.avatar.startsWith("http") || otherParticipant.avatar.startsWith("blob:")
                          ? otherParticipant.avatar
                          : `${IMAGE_BASE_URL}/Uploads/${otherParticipant.avatar}`
                      }
                      alt={otherParticipant.name || "Avatar"}
                      className="w-full h-full object-cover"
                      onError={handleAvatarError}
                    />
                  ) : (
                    <span
                      className="avatar-fallback-span font-bold text-xs text-white items-center justify-center w-full h-full"
                      style={{ display: "flex" }}
                    >
                      {getInitials(otherParticipant?.name)}
                    </span>
                  )}
                </div>
                <div className="flex items-center flex-grow truncate">
                  <h2 className="text-md font-semibold truncate text-gray-100">{chatPartnerHeaderName}</h2>
                  {otherParticipant && !otherParticipant.isSelfChat && !otherParticipant.isGroupChat && (
                    <UserRoleTag role={otherParticipant.role} />
                  )}
                </div>
              </div>
            )}
            {otherParticipant &&
              otherParticipant._id !== ADMIN_ID &&
              !otherParticipant.isSelfChat &&
              !otherParticipant.isGroupChat &&
              user?.role !== "admin" && (
                <div className="relative" ref={optionsDropdownRef}>
                  <button
                    data-dropdown-toggle="chat-options"
                    onClick={() => setShowOptionsDropdown((p) => !p)}
                    className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {showOptionsDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-30 py-1 origin-top-right">
                      <button
                        onClick={handleBlockUser}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                      >
                        <UserX size={16} /> Block User
                      </button>
                      <button
                        onClick={handleReportUser}
                        className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-500/20 transition-colors flex items-center gap-2"
                      >
                        <AlertTriangleIcon size={16} /> Report User
                      </button>
                    </div>
                  )}
                </div>
              )}
          </div>
          {renderExpirationWarning()}
          {user &&
            user.role !== "admin" &&
            otherParticipant?._id !== ADMIN_ID &&
            !otherParticipant?.isSelfChat &&
            !otherParticipant?.isGroupChat && (
              <div className="p-2 bg-yellow-900/70 border-b border-yellow-700/60 text-yellow-100 text-xs text-center flex-shrink-0 backdrop-blur-sm sticky top-[57px] md:top-[65px] z-10">
                ⚠️ Sharing personal contact or payment details is strictly prohibited.
              </div>
            )}
          <div className="messages flex-grow overflow-y-auto p-4 space-y-2" ref={messagesContainerRef}>
            {autoReplyMessage && messages.length === 0 && (
              <div className="bg-gray-800/50 p-3 rounded-lg text-gray-300 text-sm italic">{autoReplyMessage}</div>
            )}
            {Array.isArray(messages) &&
              messages.map((msg, index) => {
                const isSelf = msg.sender?._id === user._id
                const senderInfo = isSelf
                  ? user
                  : otherParticipant && otherParticipant._id === msg.sender?._id
                    ? otherParticipant
                    : msg.sender
                const prevMessage = messages[index - 1]
                const showAvatar =
                  !isSelf &&
                  senderInfo &&
                  (index === 0 ||
                    prevMessage?.sender?._id !== msg.sender?._id ||
                    new Date(msg.createdAt).getTime() - new Date(prevMessage?.createdAt || 0).getTime() > 300000)
                const imageUrl = getImageUrl(msg)
                const isSenderLinkable =
                  senderInfo &&
                  senderInfo._id &&
                  mongoose.Types.ObjectId.isValid(senderInfo._id) &&
                  senderInfo._id !== user._id

                return (
                  <div
                    key={msg._id || msg.tempIdUsedBySender || msg.createdAt}
                    className={`flex items-end gap-2 ${isSelf ? "justify-end" : "justify-start"}`}
                  >
                    {!isSelf && (
                      <div className="w-6 h-6 flex-shrink-0 self-end mb-0.5">
                        {showAvatar &&
                          senderInfo &&
                          (isSenderLinkable ? (
                            <Link to={`/profile/${senderInfo._id}`} className="block w-full h-full rounded-full group">
                              <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center overflow-hidden text-xxs font-bold text-white relative group-hover:ring-1 group-hover:ring-blue-400 transition-all">
                                {senderInfo.avatar ? (
                                  <img
                                    src={
                                      senderInfo.avatar.startsWith("http") || senderInfo.avatar.startsWith("blob:")
                                        ? senderInfo.avatar
                                        : `${IMAGE_BASE_URL}/Uploads/${senderInfo.avatar}`
                                    }
                                    alt={senderInfo.name}
                                    className="w-full h-full object-cover"
                                    onError={handleAvatarError}
                                  />
                                ) : (
                                  <span
                                    className="avatar-fallback-span font-bold text-xxs text-white items-center justify-center w-full h-full"
                                    style={{ display: "flex" }}
                                  >
                                    {getInitials(senderInfo.name)}
                                  </span>
                                )}
                              </div>
                            </Link>
                          ) : (
                            <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center overflow-hidden text-xxs font-bold text-white relative">
                              {senderInfo.avatar ? (
                                <img
                                  src={
                                    senderInfo.avatar.startsWith("http") || senderInfo.avatar.startsWith("blob:")
                                      ? senderInfo.avatar
                                      : `${IMAGE_BASE_URL}/Uploads/${senderInfo.avatar}`
                                  }
                                  alt={senderInfo.name}
                                  className="w-full h-full object-cover"
                                  onError={handleAvatarError}
                                />
                              ) : (
                                <span
                                  className="avatar-fallback-span font-bold text-xxs text-white items-center justify-center w-full h-full"
                                  style={{ display: "flex" }}
                                >
                                  {getInitials(senderInfo.name)}
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                    <div
                      className={`message max-w-[70%] md:max-w-[60%] p-0 overflow-hidden shadow-md ${isSelf ? "self bg-blue-600 text-white rounded-l-lg rounded-br-lg" : "other bg-gray-700 text-gray-100 rounded-r-lg rounded-bl-lg"} ${msg.isOptimistic ? "opacity-60 animate-pulse" : ""}`}
                    >
                      {msg.messageType === "image" && imageUrl ? (
                        <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block group relative">
                          <img
                            src={imageUrl || "/placeholder.svg"}
                            alt="Chat attachment"
                            className="max-w-xs max-h-60 md:max-h-72 object-contain bg-black/20 block rounded-sm"
                          />
                          <div className="absolute bottom-1 right-1.5">
                            <p
                              className={`timestamp text-[0.6rem] px-1.5 py-0.5 rounded backdrop-blur-sm ${isSelf ? "bg-blue-800/50 text-blue-100/90" : "bg-gray-900/50 text-gray-300/90"}`}
                            >
                              {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <div className="px-3 py-2">
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          <p
                            className={`timestamp text-xs mt-1 ${isSelf ? "text-blue-200/80 text-right" : "text-gray-300/80 text-left"}`}
                          >
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                    {isSelf && <div className="w-6 flex-shrink-0"></div>}
                  </div>
                )
              })}
            <div ref={messagesEndRef} />
          </div>

          {isChatAccessible && !error && (
            <div className="write relative p-3 border-t border-gray-600/50 bg-black/20">
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-full left-0 right-0 sm:left-2 sm:right-auto mx-auto sm:mx-0 mb-1 z-30 flex justify-center sm:justify-start"
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    emojiStyle={EmojiStyle.NATIVE}
                    lazyLoadEmojis={true}
                    theme={EmojiTheme.DARK}
                    searchPlaceholder="Search emoji"
                    suggestedEmojisMode="recent"
                    width="90%"
                    maxWidth={350}
                    height={380}
                  />
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <button
                  type="button"
                  onClick={handleAttachmentClick}
                  disabled={isFileUploading || isSending || isChatExpired}
                  className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 disabled:opacity-50"
                >
                  {isFileUploading ? <LoadingSpinnerSmall /> : <Paperclip size={20} />}
                </button>
                <button
                  id="emoji-toggle-button"
                  type="button"
                  onClick={() => setShowEmojiPicker((p) => !p)}
                  className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10"
                  disabled={isChatExpired}
                >
                  <Smile size={20} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={isChatExpired ? "Chat expired" : "Your message..."}
                  className="input flex-grow bg-gray-700/50 border-gray-600/70 rounded-full py-2 px-4 text-sm text-gray-100 placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={isSending || isFileUploading || isChatExpired}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending || isFileUploading || isChatExpired}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 send-button"
                >
                  {(isSending && !isFileUploading) || (isFileUploading && !isSending) ? (
                    <LoadingSpinnerSmall />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
                    body, html { margin: 0; padding: 0; line-height: 1.5; font-family: Helvetica, sans-serif; font-size: 1.0rem; }
                    @media(max-width: 1000px) { body, html { font-size: 14px; } }
                    *, *::before, *::after { box-sizing: border-box; }
                    .wrapper {
                        min-height: 100vh; width: 100%;
                        background-image: url(https://images.unsplash.com/photo-1638272181967-7d3772a91265?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80);
                        background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed;
                        padding: 0; display: flex; justify-content: center; align-items: center;
                    }
                    .chat {
                        height: 100%; max-height: 100vh; width: 100%; max-width: 800px;
                        display: flex; flex-direction: column; gap: 0px;
                        background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                        border-radius: 0; border: 1px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2); overflow: hidden;
                    }
                    @media (min-width: 768px) {
                        .wrapper { padding: 2rem 10%; }
                        .chat { border-radius: 15px; max-height: calc(100vh - 4rem); }
                    }
                    @media (min-width: 1024px) {
                        .wrapper { padding: 50px 15%; }
                        .chat { max-height: 85vh; }
                    }
                    .write { padding: 10px 15px; border-top: 1px solid rgba(255, 255, 255, 0.1); background: rgba(0, 0, 0, 0.4); flex-shrink: 0; position: relative; }
                    .input { flex-grow: 1; font: inherit; color: rgba(255, 255, 255, .9); outline: none; padding: 10px 15px; background: rgba(255, 255, 255, .10); box-shadow: 0 4px 15px 0 rgba(31, 38, 135, 0.1); backdrop-filter: blur(5px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); transition: background 200ms; font-size: 0.9rem; line-height: 1.3; }
                    .input:focus { background: rgba(255, 255, 255, .15); }
                    .input::placeholder { color: rgba(255, 255, 255, .5); }
                    .messages { flex-grow: 1; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; padding: 15px; scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, .3) transparent; }
                    .messages::-webkit-scrollbar { width: 6px; }
                    .messages::-webkit-scrollbar-track { background: transparent; }
                    .messages::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, .3); border-radius: 3px; }
                    .message { display: flex; flex-direction: column; overflow-wrap: anywhere; background: rgba(255, 255, 255, .15); box-shadow: 0 1px 2px 0 rgba(0,0,0,0.1); border: 1px solid rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, .9); padding: 0; max-width: 70%; width: fit-content; font-size: 0.9rem; line-height: 1.4; border-radius: 10px; }
                    .message p:not(.timestamp) { margin: 0; }
                    .message.self { margin-left: auto; background: rgba(60, 90, 255, .6); border-color: rgba(60, 90, 255, 0.7); color: white; }
                    .timestamp { font-size: 0.6rem; line-height: 0.8rem; margin-top: 2px; opacity: 0.8; }
                    .timestamp.self { color: rgba(220, 230, 255, .8); text-align: right; }
                    .timestamp:not(.self) { color: rgba(255, 255, 255, .7); text-align: left; }
                    .write form button { flex-shrink: 0; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.7); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s ease; }
                    .write form button:hover:not(:disabled) { background-color: rgba(255, 255, 255, 0.2); color: white; }
                    .write form button:disabled { opacity: 0.5; cursor: not-allowed; }
                    .write form button.send-button { background-color: #3c5aff; color: white; }
                    .write form button.send-button:hover:not(:disabled) { background-color: #4a6aff; }
                    .text-xxs { font-size: 0.65rem; line-height: 0.8rem; }
                    .avatar-fallback-span { display: flex; align-items: center; justify-content: center; }
                `}
      </style>
    </>
  )
}

export default ChatPage
