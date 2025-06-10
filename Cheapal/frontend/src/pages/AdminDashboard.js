// import { useState, useEffect, useCallback } from "react";
// import { Link } from "react-router-dom";
// import io from "socket.io-client";
// import { toast } from "react-toastify";
// import { adminService } from "../services/apiService";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { Editor } from "react-draft-wysiwyg";
// import { EditorState, ContentState, convertToRaw } from "draft-js";
// import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import GradientPicker from '../components/GradientPicker';
// import NewCustomToast from '../components/NewCustomToast';
// import mongoose from "mongoose";


// const colors = {
//   orange: "#ED7C30",
//   blue: "#4473C5",
//   grey: "#A4A5A4",
//   yellow: "#F3B602",
//   purple: "#8B5CF6",
//   red: "#EF4444",
//   cyan: "#06B6D4",
//   gradientOrange: "rgba(236, 125, 48, 0.4)",
//   gradientBlue: "rgba(66, 115, 197, 0.4)",
//   green: "#10B981",
//   turquoise: "#14B8A6",
//   pink: "#EC4899",
//   darkSecondary: "#374151",
//   neonGreen: "#39FF14",
// };

// const BellIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-6 w-6"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//     />
//   </svg>
// );

// const ListingsIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-5 w-5 mr-2 group-hover:text-neon-purple transition-colors"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//     />
//   </svg>
// );

// const UsersIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-5 w-5 mr-2 group-hover:text-neon-purple transition-colors"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7"
//     />
//   </svg>
// );

// const NotificationsIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-5 w-5 mr-2 group-hover:text-neon-purple transition-colors"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//     />
//   </svg>
// );

// // --- Constants ---
// const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || "").replace("/api", "");
// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
// const VERIFICATION_STATUSES = {
//   VERIFIED: "verified",
//   PENDING: "pending",
//   NOT_VERIFIED: "not_verified",
// };
// const BLOG_STATUSES = {
//   PUBLISHED: "published",
//   DRAFT: "draft",
// };
// const GRADIENT_PRESETS = [
//     { name: 'NordVPN Blue', gradient: 'from-blue-600 via-purple-700 to-purple-800', border: 'border-purple-500/30' },
//   { name: 'Spotify Green', gradient: 'from-green-600 via-emerald-700 to-teal-800', border: 'border-green-500/30' },
//   { name: 'Apple TV Gray', gradient: 'from-gray-600 via-slate-700 to-zinc-800', border: 'border-gray-500/30' },
//   { name: 'Amazon Prime Blue', gradient: 'from-blue-600 via-indigo-700 to-violet-800', border: 'border-blue-500/30' },
//   { name: 'PlayStation Blue', gradient: 'from-blue-700 via-sky-800 to-cyan-900', border: 'border-blue-600/30' },
//   { name: 'Xbox Green', gradient: 'from-green-700 via-lime-800 to-emerald-900', border: 'border-green-600/30' },
//   { name: 'Apple Music Pink', gradient: 'from-pink-600 via-rose-700 to-fuchsia-800', border: 'border-pink-500/30' },
//   { name: 'Amazon Music Cyan', gradient: 'from-blue-500 via-cyan-600 to-sky-700', border: 'border-blue-400/30' },
//   { name: 'Sunset Glow', gradient: 'from-orange-500 via-red-600 to-pink-700', border: 'border-red-500/30' },
//   { name: 'Ocean Breeze', gradient: 'from-teal-500 via-cyan-600 to-blue-700', border: 'border-teal-500/30' },
//   { name: 'Forest Mist', gradient: 'from-green-600 via-lime-700 to-emerald-800', border: 'border-green-600/30' },
//   { name: 'Twilight Purple', gradient: 'from-purple-600 via-indigo-700 to-violet-800', border: 'border-purple-600/30' },
//   { name: 'Desert Heat', gradient: 'from-yellow-500 via-orange-600 to-red-700', border: 'border-orange-500/30' },
//   { name: 'Arctic Chill', gradient: 'from-blue-500 via-cyan-600 to-teal-700', border: 'border-blue-500/30' },
//   { name: 'Neon Pulse', gradient: 'from-pink-500 via-purple-600 to-blue-700', border: 'border-pink-500/30' },
//   { name: 'Lava Flow', gradient: 'from-red-600 via-orange-700 to-yellow-800', border: 'border-red-600/30' },
//   { name: 'Jungle Canopy', gradient: 'from-green-500 via-emerald-600 to-teal-700', border: 'border-green-500/30' },
//   { name: 'Cosmic Void', gradient: 'from-indigo-600 via-purple-700 to-blue-800', border: 'border-indigo-600/30' },
//   { name: 'Golden Hour', gradient: 'from-yellow-500 via-amber-600 to-orange-700', border: 'border-yellow-500/30' },
//   { name: 'Berry Bliss', gradient: 'from-pink-600 via-rose-700 to-red-800', border: 'border-pink-600/30' },
//   { name: 'Skyline Fade', gradient: 'from-blue-500 via-sky-600 to-cyan-700', border: 'border-blue-500/30' },
//   { name: 'Emerald Wave', gradient: 'from-teal-500 via-emerald-600 to-green-700', border: 'border-teal-500/30' },
//   { name: 'Ruby Spark', gradient: 'from-red-500 via-rose-600 to-pink-700', border: 'border-red-500/30' },
//   { name: 'Sapphire Glow', gradient: 'from-blue-600 via-indigo-700 to-purple-800', border: 'border-blue-600/30' },
//   { name: 'Citrus Burst', gradient: 'from-orange-500 via-yellow-600 to-lime-700', border: 'border-orange-500/30' },
//   { name: 'Midnight Sky', gradient: 'from-blue-700 via-indigo-800 to-black', border: 'border-blue-700/30' },
//   { name: 'Coral Reef', gradient: 'from-pink-500 via-orange-600 to-red-700', border: 'border-pink-500/30' },
//   { name: 'Frosty Mint', gradient: 'from-teal-500 via-cyan-600 to-green-700', border: 'border-teal-500/30' },
//   { name: 'Volcanic Ash', gradient: 'from-gray-600 via-slate-700 to-black', border: 'border-gray-600/30' },
//   { name: 'Tropical Sunset', gradient: 'from-orange-500 via-pink-600 to-purple-700', border: 'border-orange-500/30' },
//   { name: 'Aurora Green', gradient: 'from-green-500 via-teal-600 to-cyan-700', border: 'border-green-500/30' },
//   { name: 'Velvet Purple', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/30' },
//   { name: 'Saffron Spice', gradient: 'from-yellow-500 via-orange-600 to-red-700', border: 'border-yellow-500/30' },
//   { name: 'Glacial Blue', gradient: 'from-blue-500 via-cyan-600 to-teal-700', border: 'border-blue-500/30' },
//   { name: 'Cherry Blossom', gradient: 'from-pink-500 via-rose-600 to-red-700', border: 'border-pink-500/30' },
//   { name: 'Starlit Night', gradient: 'from-indigo-600 via-purple-700 to-blue-800', border: 'border-indigo-600/30' },
//   { name: 'Mango Tango', gradient: 'from-orange-500 via-yellow-600 to-red-700', border: 'border-orange-500/30' },
//   { name: 'Deep Sea', gradient: 'from-blue-600 via-teal-700 to-green-800', border: 'border-blue-600/30' },
//   { name: 'Crimson Tide', gradient: 'from-red-500 via-rose-600 to-pink-700', border: 'border-red-500/30' },
//   { name: 'Polar Light', gradient: 'from-cyan-500 via-teal-600 to-blue-700', border: 'border-cyan-500/30' },
//   { name: 'Dusk Amber', gradient: 'from-orange-500 via-amber-600 to-yellow-700', border: 'border-orange-500/30' },
//   { name: 'Violet Dream', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/30' },
//   { name: 'Lime Zest', gradient: 'from-lime-500 via-green-600 to-teal-700', border: 'border-lime-500/30' },
//   { name: 'Obsidian Flame', gradient: 'from-red-600 via-black to-purple-700', border: 'border-red-600/30' },
//   { name: 'Aqua Surge', gradient: 'from-teal-500 via-cyan-600 to-blue-700', border: 'border-teal-500/30' },
//   { name: 'Rose Quartz', gradient: 'from-pink-500 via-rose-600 to-red-700', border: 'border-pink-500/30' },
//   { name: 'Indigo Haze', gradient: 'from-indigo-500 via-purple-600 to-blue-700', border: 'border-indigo-500/30' },
//   { name: 'Sunkissed Gold', gradient: 'from-yellow-500 via-orange-600 to-amber-700', border: 'border-yellow-500/30' },
//   { name: 'Emerald Dusk', gradient: 'from-green-500 via-emerald-600 to-teal-700', border: 'border-green-500/30' },
//   { name: 'Ruby Dawn', gradient: 'from-red-500 via-pink-600 to-rose-700', border: 'border-red-500/30' },   { name: 'Netflix Crimson', gradient: 'from-red-600 via-rose-700 to-red-800', border: 'border-red-600/30' },
//   { name: 'Hulu Verdant', gradient: 'from-emerald-500 via-green-600 to-teal-700', border: 'border-emerald-500/30' },
//   { name: 'Disney Sapphire', gradient: 'from-blue-500 via-indigo-600 to-blue-700', border: 'border-blue-500/30' },
//   { name: 'YouTube Scarlet', gradient: 'from-red-500 via-red-600 to-rose-700', border: 'border-red-500/30' },
//   { name: 'Twitch Amethyst', gradient: 'from-purple-500 via-purple-600 to-violet-700', border: 'border-purple-500/30' },
//   { name: 'HBO Violet', gradient: 'from-violet-500 via-purple-600 to-indigo-700', border: 'border-violet-500/30' },
//   { name: 'Paramount Sky', gradient: 'from-sky-500 via-blue-600 to-cyan-700', border: 'border-sky-500/30' },
//   { name: 'Peacock Aqua', gradient: 'from-teal-500 via-cyan-600 to-teal-700', border: 'border-teal-500/30' },
//   { name: 'Starz Onyx', gradient: 'from-gray-700 via-black to-gray-800', border: 'border-gray-700/30' },
//   { name: 'Showtime Ruby', gradient: 'from-red-600 via-rose-700 to-pink-800', border: 'border-red-600/30' },
//   { name: 'Apple Cherry', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/30' },
//   { name: 'Google Azure', gradient: 'from-blue-500 via-blue-600 to-sky-700', border: 'border-blue-500/30' },
//   { name: 'Microsoft Cobalt', gradient: 'from-blue-600 via-sky-700 to-cyan-800', border: 'border-blue-600/30' },
//   { name: 'Adobe Vermilion', gradient: 'from-red-600 via-red-700 to-rose-800', border: 'border-red-600/30' },
//   { name: 'Slack Lavender', gradient: 'from-purple-500 via-violet-600 to-purple-700', border: 'border-purple-500/30' },
//   { name: 'Zoom Ocean', gradient: 'from-blue-500 via-sky-600 to-blue-700', border: 'border-blue-500/30' },
//   { name: 'Dropbox Navy', gradient: 'from-blue-500 via-blue-600 to-indigo-700', border: 'border-blue-500/30' },
//   { name: 'Trello Marine', gradient: 'from-blue-600 via-sky-700 to-blue-800', border: 'border-blue-600/30' },
//   { name: 'Asana Coral', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/30' },
//   { name: 'Notion Slate', gradient: 'from-gray-500 via-gray-600 to-slate-700', border: 'border-gray-500/30' },
//   { name: 'Canva Jade', gradient: 'from-green-500 via-teal-600 to-green-700', border: 'border-green-500/30' },
//   { name: 'Figma Indigo', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/30' },
//   { name: 'Miro Cyan', gradient: 'from-blue-500 via-cyan-600 to-sky-700', border: 'border-blue-500/30' },
//   { name: 'Airbnb Blush', gradient: 'from-pink-500 via-rose-600 to-pink-700', border: 'border-pink-500/30' },
//   { name: 'Uber Ebony', gradient: 'from-gray-700 via-black to-gray-800', border: 'border-gray-700/30' },
//   { name: 'Lyft Fuchsia', gradient: 'from-pink-500 via-fuchsia-600 to-pink-700', border: 'border-pink-500/30' },
//   { name: 'DoorDash Flame', gradient: 'from-red-500 via-red-600 to-rose-700', border: 'border-red-500/30' },
//   { name: 'Instacart Forest', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/30' },
//   { name: 'Grubhub Amber', gradient: 'from-orange-500 via-orange-600 to-amber-700', border: 'border-orange-500/30' },
//   { name: 'Postmates Shadow', gradient: 'from-gray-700 via-black to-slate-800', border: 'border-gray-700/30' },
//   { name: 'Shopify Lime', gradient: 'from-green-500 via-lime-600 to-green-700', border: 'border-green-500/30' },
//   { name: 'Stripe Indigo', gradient: 'from-blue-500 via-indigo-600 to-blue-700', border: 'border-blue-500/30' },
//   { name: 'PayPal Sky', gradient: 'from-blue-600 via-sky-700 to-blue-800', border: 'border-blue-600/30' },
//   { name: 'Square Teal', gradient: 'from-green-500 via-emerald-600 to-teal-700', border: 'border-green-500/30' },
//   { name: 'Venmo Ocean', gradient: 'from-blue-500 via-cyan-600 to-blue-700', border: 'border-blue-500/30' },
//   { name: 'Etsy Tangerine', gradient: 'from-orange-500 via-amber-600 to-yellow-700', border: 'border-orange-500/30' },
//   { name: 'eBay Crimson', gradient: 'from-red-500 via-red-600 to-rose-700', border: 'border-red-500/30' },
//   { name: 'Amazon Sunflower', gradient: 'from-yellow-500 via-amber-600 to-yellow-700', border: 'border-yellow-500/30' },
//   { name: 'Walmart Cobalt', gradient: 'from-blue-500 via-blue-600 to-sky-700', border: 'border-blue-500/30' },
//   { name: 'Target Scarlet', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/30' },
//   { name: 'Crimson Ember', gradient: 'from-red-500 via-red-600 to-orange-700', border: 'border-red-500/30' },
//   { name: 'Azure Mist', gradient: 'from-blue-500 via-cyan-600 to-blue-700', border: 'border-blue-500/30' },
//   { name: 'Jade Grove', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/30' },
//   { name: 'Amethyst Glow', gradient: 'from-purple-500 via-violet-600 to-purple-700', border: 'border-purple-500/30' },
//   { name: 'Topaz Shine', gradient: 'from-yellow-500 via-amber-600 to-orange-700', border: 'border-yellow-500/30' },
//   { name: 'Opal Gleam', gradient: 'from-pink-500 via-rose-600 to-pink-700', border: 'border-pink-500/30' },
//   { name: 'Onyx Abyss', gradient: 'from-gray-700 via-black to-gray-800', border: 'border-gray-700/30' },
//   { name: 'Quartz Sparkle', gradient: 'from-red-500 via-pink-600 to-rose-700', border: 'border-red-500/30' },
//   { name: 'Sapphire Tide', gradient: 'from-blue-500 via-teal-600 to-blue-700', border: 'border-blue-500/50' },
//   { name: 'Emerald Crest', gradient: 'from-green-500 via-lime-600 to-green-700', border: 'border-green-500/50' },
//   { name: 'Violet Mist', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/50' },
//   { name: 'Amber Dusk', gradient: 'from-orange-500 via-amber-600 to-yellow-700', border: 'border-orange-500/50' },
//   { name: 'Rose Bloom', gradient: 'from-pink-500 via-fuchsia-600 to-pink-700', border: 'border-pink-500/50' },
//   { name: 'Slate Tempest', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/50' },
//   { name: 'Coral Dawn', gradient: 'from-red-500 via-orange-600 to-pink-700', border: 'border-red-500/50' },
//   { name: 'Cyan Surge', gradient: 'from-cyan-500 via-teal-600 to-cyan-700', border: 'border-cyan-500/50' },
//   { name: 'Lime Flash', gradient: 'from-lime-500 via-green-600 to-lime-700', border: 'border-lime-500/50' },
//   { name: 'Indigo Veil', gradient: 'from-indigo-500 via-purple-600 to-indigo-700', border: 'border-indigo-500/50' },
//   { name: 'Gold Radiance', gradient: 'from-yellow-500 via-orange-600 to-amber-700', border: 'border-yellow-500/50' },
//   { name: 'Fuchsia Spark', gradient: 'from-pink-500 via-fuchsia-600 to-rose-700', border: 'border-pink-500/50' },
//   { name: 'Obsidian Veil', gradient: 'from-gray-700 via-black to-slate-800', border: 'border-gray-700/50' },
//   { name: 'Ruby Flame', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/50' },
//   { name: 'Sky Crest', gradient: 'from-blue-500 via-sky-600 to-blue-700', border: 'border-blue-500/50' },
//   { name: 'Teal Haven', gradient: 'from-teal-500 via-cyan-600 to-teal-700', border: 'border-teal-500/50' },
//   { name: 'Violet Shade', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/50' },
//   { name: 'Orange Blaze', gradient: 'from-orange-500 via-amber-600 to-orange-700', border: 'border-orange-500/50' },
//   { name: 'Pink Petal', gradient: 'from-pink-500 via-rose-600 to-pink-700', border: 'border-pink-500/50' },
//   { name: 'Gray Veil', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/50' },
//   { name: 'Red Crest', gradient: 'from-red-500 via-red-600 to-rose-700', border: 'border-red-500/50' },
//   { name: 'Blue Tide', gradient: 'from-blue-500 via-cyan-600 to-blue-700', border: 'border-blue-500/50' },
//   { name: 'Green Crest', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/50' },
//   { name: 'Purple Crest', gradient: 'from-purple-500 via-violet-600 to-purple-700', border: 'border-purple-500/50' },
//   { name: 'Yellow Crest', gradient: 'from-yellow-500 via-amber-600 to-yellow-700', border: 'border-yellow-500/50' },
//   { name: 'Rose Crest', gradient: 'from-pink-500 via-fuchsia-600 to-rose-700', border: 'border-pink-500/50' },
//   { name: 'Slate Crest', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/50' },
//   { name: 'Crimson Tide', gradient: 'from-red-500 via-orange-600 to-red-700', border: 'border-red-500/50' },
//   { name: 'Cyan Crest', gradient: 'from-cyan-500 via-teal-600 to-cyan-700', border: 'border-cyan-500/50' },
//   { name: 'Lime Crest', gradient: 'from-lime-500 via-green-600 to-lime-700', border: 'border-lime-500/50' },
//   { name: 'Indigo Crest', gradient: 'from-indigo-500 via-purple-600 to-indigo-700', border: 'border-indigo-500/50' },
//   { name: 'Amber Crest', gradient: 'from-orange-500 via-amber-600 to-yellow-700', border: 'border-orange-500/50' },
//   { name: 'Fuchsia Crest', gradient: 'from-pink-500 via-fuchsia-600 to-pink-700', border: 'border-pink-500/50' },
//   { name: 'Black Crest', gradient: 'from-gray-700 via-black to-gray-800', border: 'border-gray-700/50' },
//   { name: 'Scarlet Crest', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/50' },
//   { name: 'Ocean Crest', gradient: 'from-blue-500 via-teal-600 to-blue-700', border: 'border-blue-500/50' },
//   { name: 'Forest Crest', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/50' },
//   { name: 'Violet Crest', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/50' },
//   { name: 'Golden Crest', gradient: 'from-yellow-500 via-amber-600 to-orange-700', border: 'border-yellow-500/50' },
//   { name: 'Pink Crest', gradient: 'from-pink-500 via-rose-600 to-pink-700', border: 'border-pink-500/50' },
//   { name: 'Gray Crest', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/50' },
//   { name: 'Red Spark', gradient: 'from-red-500 via-red-600 to-rose-700', border: 'border-red-500/40' },
//   { name: 'Blue Spark', gradient: 'from-blue-500 via-cyan-600 to-blue-700', border: 'border-blue-500/40' },
//   { name: 'Green Spark', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/40' },
//   { name: 'Purple Spark', gradient: 'from-purple-500 via-violet-600 to-purple-700', border: 'border-purple-500/40' },
//   { name: 'Yellow Spark', gradient: 'from-yellow-500 via-amber-600 to-yellow-700', border: 'border-yellow-500/40' },
//   { name: 'Rose Spark', gradient: 'from-pink-500 via-fuchsia-600 to-rose-700', border: 'border-pink-500/40' },
//   { name: 'Slate Spark', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/40' },
//   { name: 'Crimson Spark', gradient: 'from-red-500 via-orange-600 to-red-700', border: 'border-red-500/40' },
//   { name: 'Cyan Spark', gradient: 'from-cyan-500 via-teal-600 to-cyan-700', border: 'border-cyan-500/40' },
//   { name: 'Lime Spark', gradient: 'from-lime-500 via-green-600 to-lime-700', border: 'border-lime-500/40' },
//   { name: 'Indigo Spark', gradient: 'from-indigo-500 via-purple-600 to-indigo-700', border: 'border-indigo-500/40' },
//   { name: 'Amber Spark', gradient: 'from-orange-500 via-amber-600 to-yellow-700', border: 'border-orange-500/40' },
//   { name: 'Fuchsia Spark', gradient: 'from-pink-500 via-fuchsia-600 to-pink-700', border: 'border-pink-500/40' },
//   { name: 'Black Spark', gradient: 'from-gray-700 via-black to-gray-800', border: 'border-gray-700/40' },
//   { name: 'Scarlet Spark', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/40' },
//   { name: 'Ocean Spark', gradient: 'from-blue-500 via-teal-600 to-blue-700', border: 'border-blue-500/40' },
//   { name: 'Forest Spark', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/40' },
//   { name: 'Violet Spark', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/40' },
//   { name: 'Golden Spark', gradient: 'from-yellow-500 via-amber-600 to-orange-700', border: 'border-yellow-500/40' },
//   { name: 'Pink Spark', gradient: 'from-pink-500 via-rose-600 to-pink-700', border: 'border-pink-500/40' },
//   { name: 'Gray Spark', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/40' },
//   { name: 'Red Glow', gradient: 'from-red-500 via-red-600 to-rose-700', border: 'border-red-500/40' },
//   { name: 'Blue Glow', gradient: 'from-blue-500 via-cyan-600 to-blue-700', border: 'border-blue-500/40' },
//   { name: 'Green Glow', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/40' },
//   { name: 'Purple Glow', gradient: 'from-purple-500 via-violet-600 to-purple-700', border: 'border-purple-500/40' },
//   { name: 'Yellow Glow', gradient: 'from-yellow-500 via-amber-600 to-yellow-700', border: 'border-yellow-500/40' },
//   { name: 'Rose Glow', gradient: 'from-pink-500 via-fuchsia-600 to-rose-700', border: 'border-pink-500/40' },
//   { name: 'Slate Glow', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/40' },
//   { name: 'Crimson Glow', gradient: 'from-red-500 via-orange-600 to-red-700', border: 'border-red-500/40' },
//   { name: 'Cyan Glow', gradient: 'from-cyan-500 via-teal-600 to-cyan-700', border: 'border-cyan-500/40' },
//   { name: 'Lime Glow', gradient: 'from-lime-500 via-green-600 to-lime-700', border: 'border-lime-500/40' },
//   { name: 'Indigo Glow', gradient: 'from-indigo-500 via-purple-600 to-indigo-700', border: 'border-indigo-500/40' },
//   { name: 'Amber Glow', gradient: 'from-orange-500 via-amber-600 to-yellow-700', border: 'border-orange-500/40' },
//   { name: 'Fuchsia Glow', gradient: 'from-pink-500 via-fuchsia-600 to-pink-700', border: 'border-pink-500/40' },
//   { name: 'Black Glow', gradient: 'from-gray-700 via-black to-gray-800', border: 'border-gray-700/40' },
//   { name: 'Scarlet Glow', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/40' },
//   { name: 'Ocean Glow', gradient: 'from-blue-500 via-teal-600 to-blue-700', border: 'border-blue-500/40' },
//   { name: 'Forest Glow', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/40' },
//   { name: 'Violet Glow', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/40' },
//   { name: 'Golden Glow', gradient: 'from-yellow-500 via-amber-600 to-orange-700', border: 'border-yellow-500/40' },
// ];

// // --- Animated Background Component ---
// const AnimatedGradientBackground = () => {
//   useEffect(() => {
//     const particlesContainer = document.getElementById("particles-container");
//     if (!particlesContainer) return;

//     const particleCount = 40;
//     particlesContainer.innerHTML = "";

//     const createParticle = () => {
//       const particle = document.createElement("div");
//       particle.className = "particle";
//       const size = Math.random() * 2.5 + 0.5;
//       particle.style.width = `${size}px`;
//       particle.style.height = `${size}px`;
//       resetParticle(particle);
//       particlesContainer.appendChild(particle);
//       animateParticle(particle);
//     };

//     const resetParticle = (particle) => {
//       const posX = Math.random() * 100;
//       const posY = Math.random() * 100;
//       particle.style.left = `${posX}%`;
//       particle.style.top = `${posY}%`;
//       particle.style.opacity = "0";
//       particle.style.transform = "scale(0.5)";
//       return { x: posX, y: posY };
//     };

//     const animateParticle = (particle) => {
//       const duration = Math.random() * 18 + 12;
//       const delay = Math.random() * 12;
//       setTimeout(() => {
//         if (!particlesContainer.contains(particle)) return;
//         particle.style.transition = `all ${duration}s linear`;
//         particle.style.opacity = (Math.random() * 0.2 + 0.03).toString();
//         particle.style.transform = "scale(1)";
//         const moveX = Number.parseFloat(particle.style.left) + (Math.random() * 40 - 20);
//         const moveY = Number.parseFloat(particle.style.top) - (Math.random() * 50 + 15);
//         particle.style.left = `${moveX}%`;
//         particle.style.top = `${moveY}%`;
//         setTimeout(() => {
//           if (particlesContainer.contains(particle)) {
//             animateParticle(particle);
//           }
//         }, duration * 1000);
//       }, delay * 1000);
//     };

//     for (let i = 0; i < particleCount; i++) createParticle();

//     const spheres = document.querySelectorAll(".gradient-sphere");
//     let animationFrameId;

//     const handleMouseMove = (e) => {
//       cancelAnimationFrame(animationFrameId);
//       animationFrameId = requestAnimationFrame(() => {
//         const moveX = (e.clientX / window.innerWidth - 0.5) * 15;
//         const moveY = (e.clientY / window.innerHeight - 0.5) * 15;
//         spheres.forEach((sphere) => {
//           sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
//         });
//       });
//     };

//     document.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       cancelAnimationFrame(animationFrameId);
//       particlesContainer.innerHTML = "";
//     };
//   }, []);

//   return (
//     <div className="gradient-background">
//       <div className="gradient-sphere sphere-1"></div>
//       <div className="gradient-sphere sphere-2"></div>
//       <div className="gradient-sphere sphere-3"></div>
//       <div className="glow"></div>
//       <div className="grid-overlay"></div>
//       <div className="noise-overlay"></div>
//       <div className="particles-container" id="particles-container"></div>
//     </div>
//   );
// };

// // --- UI Components ---
// const LoadingSpinner = () => (
//   <div className="flex flex-col justify-center items-center py-20">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-neon-blue"></div>
//     <p className="mt-4 text-lg text-gray-300">Loading Data...</p>
//   </div>
// );

// const ErrorMessage = ({ message, onRetry }) => (
//   <div className="bg-red-800/30 border border-red-700/50 text-red-200 p-6 rounded-xl text-center my-8 shadow-xl max-w-lg mx-auto">
//     <div className="flex flex-col items-center">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-16 w-16 text-red-400 mb-4"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//         strokeWidth="2"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//         />
//       </svg>
//       <p className="font-semibold text-xl mb-2">An Error Occurred</p>
//       <span className="text-md">{message || "An error occurred."}</span>
//       {onRetry && (
//         <button
//           onClick={onRetry}
//           className="mt-6 px-5 py-2.5 bg-red-500/40 text-red-100 rounded-lg hover:bg-red-500/50 transition-colors text-sm font-medium"
//         >
//           Try Again
//         </button>
//       )}
//     </div>
//   </div>
// );

// // --- Blog Modal for Create/Edit ---
// const BlogModal = ({ isOpen, onClose, blog, onSave }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     content: EditorState.createEmpty(),
//     status: BLOG_STATUSES.DRAFT,
//     tags: [],
//   });
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showPreview, setShowPreview] = useState(false);
//   const [tagInput, setTagInput] = useState("");

//   useEffect(() => {
//     if (blog) {
//       const blocksFromHtml = htmlToDraft(blog.content || "");
//       const contentState = ContentState.createFromBlockArray(
//         blocksFromHtml.contentBlocks,
//         blocksFromHtml.entityMap
//       );
//       setFormData({
//         title: blog.title || "",
//         content: EditorState.createWithContent(contentState),
//         status: blog.status || BLOG_STATUSES.DRAFT,
//         tags: blog.tags || [],
//       });
//       if (blog.image) {
//         setImagePreview(`${IMAGE_BASE_URL}${blog.image}`);
//       }
//     } else {
//       setFormData({
//         title: "",
//         content: EditorState.createEmpty(),
//         status: BLOG_STATUSES.DRAFT,
//         tags: [],
//       });
//       setImage(null);
//       setImagePreview(null);
//     }
//   }, [blog]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: null }));
//   };

//   const handleContentChange = (editorState) => {
//     setFormData((prev) => ({ ...prev, content: editorState }));
//     setErrors((prev) => ({ ...prev, content: null }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//       setErrors((prev) => ({ ...prev, image: null }));
//     }
//   };

//   const handleTagInputChange = (e) => {
//     setTagInput(e.target.value);
//   };

//   const handleAddTag = (e) => {
//     if (e.key === "Enter" && tagInput.trim()) {
//       e.preventDefault();
//       setFormData((prev) => ({
//         ...prev,
//         tags: [...prev.tags, tagInput.trim()],
//       }));
//       setTagInput("");
//     }
//   };

//   const handleRemoveTag = (tagToRemove) => {
//     setFormData((prev) => ({
//       ...prev,
//       tags: prev.tags.filter((tag) => tag !== tagToRemove),
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.title.trim()) newErrors.title = "Title is required";
//     const contentText = formData.content.getCurrentContent().getPlainText();
//     if (!contentText.trim()) newErrors.content = "Content is required";
//     if (!image && !blog?.image) newErrors.image = "Image is required";
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const data = new FormData();
//       data.append("title", formData.title);
//       data.append(
//         "content",
//         draftToHtml(convertToRaw(formData.content.getCurrentContent()))
//       );
//       data.append("status", formData.status);
//       data.append("tags", JSON.stringify(formData.tags));
//       if (image) data.append("image", image);

//       await onSave(blog?._id, data);
//       setFormData({
//         title: "",
//         content: EditorState.createEmpty(),
//         status: BLOG_STATUSES.DRAFT,
//         tags: [],
//       });
//       setImage(null);
//       setImagePreview(null);
//       onClose();
//       toast.success(blog ? "Blog updated successfully" : "Blog created successfully");
//     } catch (err) {
//       toast.error(err.message || "Failed to save blog");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/20 rounded-2xl w-full h-full shadow-2xl glassmorphic overflow-hidden flex flex-col">
//         <div className="flex items-center justify-between p-6 border-b border-gray-700/20">
//           <h3 className="text-2xl font-semibold text-gray-100">
//             {blog ? "Edit Blog" : "Create Blog"}
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-200 transition-colors"
//             aria-label="Close modal"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
//           <div className="space-y-6">
//             <div className="form-group">
//               <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
//               <input
//                 type="text"
//                 className={`w-full bg-gray-700/20 backdrop-blur-sm border ${
//                   errors.title ? "border-red-500" : "border-gray-600/50"
//                 } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue outline-none transition-all glassmorphic-input text-lg`}
//                 name="title"
//                 placeholder="Enter blog title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 aria-label="Blog title"
//               />
//               {errors.title && <p className="text-red-400 text-xs mt-2">{errors.title}</p>}
//             </div>
//             <div className="form-group">
//               <label className="block text-sm font-medium text-gray-300 mb-2">Image (Required)</label>
//               <div className="input-group flex items-center gap-4">
//                 <span className="input-group-btn">
//                   <span className="btn btn-file bg-neon-blue/90 hover:bg-neon-blue text-white rounded-lg px-6 py-3 font-medium transition-all shadow-md hover:shadow-lg glassmorphic-button">
//                     Browse
//                     <input
//                       type="file"
//                       name="bimgs"
//                       accept="image/jpeg,image/jpg,image/png"
//                       onChange={handleImageChange}
//                       aria-label="Upload blog image"
//                     />
//                   </span>
//                 </span>
//                 <input
//                   type="text"
//                   className="flex-1 bg-gray-700/20 backdrop-blur-sm border border-gray-600/50 rounded-lg px-4 py-3 text-white text-lg"
//                   readOnly
//                   value={image ? image.name : blog?.image ? blog.image.split("/").pop() : ""}
//                   aria-label="Selected image name"
//                 />
//               </div>
//               {errors.image && <p className="text-red-400 text-xs mt-2">{errors.image}</p>}
//               {imagePreview && (
//                 <div className="mt-4">
//                   <img
//                     src={imagePreview}
//                     alt="Blog image"
//                     className="w-full max-h-80 object-contain rounded-lg border border-gray-700/50"
//                   />
//                 </div>
//               )}
//             </div>
//             <div className="form-group">
//               <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
//               <input
//                 type="text"
//                 className="w-full bg-gray-700/20 backdrop-blur-sm border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue outline-none transition-all glassmorphic-input text-lg"
//                 placeholder="Add a tag and press Enter"
//                 value={tagInput}
//                 onChange={handleTagInputChange}
//                 onKeyDown={handleAddTag}
//                 aria-label="Blog tags"
//               />
//               <div className="mt-3 flex flex-wrap gap-2">
//                 {formData.tags.map((tag, index) => (
//                   <span
//                     key={index}
//                     className="inline-flex items-center px-3 py-1 bg-gray-600/50 backdrop-blur-sm text-white text-sm rounded-full border border-gray-700/50 shadow-sm transition-all hover:bg-gray-600/70"
//                   >
//                     {tag}
//                     <button
//                       type="button"
//                       className="ml-2 text-red-400 hover:text-red-300"
//                       onClick={() => handleRemoveTag(tag)}
//                       aria-label={`Remove tag ${tag}`}
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <div className="form-group">
//               <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleInputChange}
//                 className="w-full bg-gray-700/20 backdrop-blur-sm border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue outline-none transition-all glassmorphic-input text-lg"
//                 aria-label="Blog status"
//               >
//                 <option value={BLOG_STATUSES.DRAFT}>Draft</option>
//                 <option value={BLOG_STATUSES.PUBLISHED}>Published</option>
//               </select>
//             </div>
//             <div className="form-group">
//               <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
//               <div className="flex justify-between items-center mb-3">
//                 <span className="text-lg font-medium text-gray-100">Editor</span>
//                 <button
//                   type="button"
//                   className="text-neon-blue hover:text-neon-blue/80 text-sm font-medium transition-colors"
//                   onClick={() => setShowPreview(!showPreview)}
//                   aria-label={showPreview ? "Show editor" : "Show preview"}
//                 >
//                   {showPreview ? "Edit" : "Preview"}
//                 </button>
//               </div>
//               {showPreview ? (
//                 <div
//                   className="bg-gray-700/20 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6 text-white prose prose-invert max-w-none min-h-[400px] overflow-y-auto glassmorphic"
//                   dangerouslySetInnerHTML={{
//                     __html: draftToHtml(convertToRaw(formData.content.getCurrentContent())),
//                   }}
//                 />
//               ) : (
//                 <div className="relative">
//                   <Editor
//                     editorState={formData.content}
//                     onEditorStateChange={handleContentChange}
//                     wrapperClassName="bg-gray-700/20 backdrop-blur-sm rounded-lg border border-gray-600/50 glassmorphic"
//                     editorClassName="text-white px-6 py-4 min-h-[400px] text-lg"
//                     toolbarClassName="bg-gray-800/30 backdrop-blur-sm border-b border-gray-600/50 sticky top-0 z-10"
//                     toolbar={{
//                       options: ["inline", "blockType", "list", "link", "history"],
//                       inline: { options: ["bold", "italic", "underline", "strikethrough"] },
//                       blockType: { options: ["Normal", "H1", "H2", "H3"] },
//                       list: { options: ["ordered", "unordered"] },
//                     }}
//                     aria-label="Blog content editor"
//                   />
//                 </div>
//               )}
//               {errors.content && <p className="text-red-400 text-xs mt-2">{errors.content}</p>}
//             </div>
//           </div>
//           <div className="mt-8 flex gap-4 justify-end sticky bottom-0 bg-gray-800/30 backdrop-blur-lg p-4 border-t border-gray-700/20">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-3 bg-gray-600/50 backdrop-blur-sm text-gray-200 rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg hover:bg-gray-600/70 glassmorphic-button"
//               disabled={isLoading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-3 bg-neon-blue/90 text-white rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg hover:bg-neon-blue disabled:opacity-50 glassmorphic-button"
//               disabled={isLoading}
//             >
//               {isLoading ? "Saving..." : blog ? "Update" : "Publish"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // --- Delete Blog Confirmation Modal ---
// const DeleteBlogModal = ({ isOpen, onClose, onConfirm, blog }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleConfirm = async () => {
//     setIsLoading(true);
//     try {
//       await onConfirm(blog._id);
//       onClose();
//     } catch (err) {
//       toast.error("Failed to delete blog");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-gray-800/90 border border-gray-700/50 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
//         <h3 className="text-lg font-semibold text-gray-100 mb-4">Delete Blog</h3>
//         <p className="text-sm text-gray-300 mb-6">
//           Are you sure you want to delete the blog <span className="font-medium">"{blog.title}"</span>? This action cannot be undone.
//         </p>
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirm}
//             disabled={isLoading}
//             className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
//           >
//             {isLoading ? "Deleting..." : "Delete"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Dashboard Chart Component ---
// const DashboardChart = () => {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return (
//       <div className="flex items-center justify-center h-[350px] w-full bg-gray-800/50 rounded-md">
//         <p className="text-gray-400">Loading chart...</p>
//       </div>
//     );
//   }

//   const data = [
//     { name: "Jan", total: 45000 },
//     { name: "Feb", total: 63500 },
//     { name: "Mar", total: 58200 },
//     { name: "Apr", total: 72800 },
//     { name: "May", total: 85600 },
//     { name: "Jun", total: 92400 },
//     { name: "Jul", total: 105200 },
//     { name: "Aug", total: 91000 },
//     { name: "Sep", total: 97500 },
//     { name: "Oct", total: 110800 },
//     { name: "Nov", total: 142500 },
//     { name: "Dec", total: 168000 },
//   ];

//   return (
//     <div className="h-[350px] w-full">
//       <div className="text-center text-gray-400">
//         <div className="h-full w-full flex items-center justify-center">
//           <div className="space-y-4 w-full">
//             <div className="flex items-end w-full h-[300px] gap-2">
//               {data.map((item, index) => (
//                 <div key={index} className="relative flex-1 group">
//                   <div
//                     className="absolute bottom-0 w-full bg-neon-blue/70 hover:bg-neon-blue transition-all duration-200 rounded-t-sm"
//                     style={{ height: `${(item.total / 168000) * 100}%` }}
//                   ></div>
//                   <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                     R {item.total.toLocaleString()}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-between text-xs text-gray-400">
//               {data.map((item, index) => (
//                 <div key={index} className="flex-1 text-center">
//                   {item.name}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Recent Transactions Component ---
// const RecentTransactions = ({ transactions }) => {
//   return (
//     <div className="space-y-4">
//       {transactions.map((transaction) => (
//         <div key={transaction.id} className="flex items-center p-3 bg-gray-700/30 rounded-lg">
//           <div className="h-9 w-9 rounded-full flex items-center justify-center border border-gray-600 bg-gray-800">
//             {transaction.type === "credit" ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 text-green-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 text-red-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
//               </svg>
//             )}
//           </div>
//           <div className="ml-4 space-y-1 flex-1">
//             <p className="text-sm font-medium leading-none text-gray-100">{transaction.name}</p>
//             <p className="text-xs text-gray-400">{transaction.date}</p>
//           </div>
//           <div className={`font-medium ${transaction.type === "credit" ? "text-green-400" : "text-red-400"}`}>
//             {transaction.type === "credit" ? "+" : "-"}R {transaction.amount.toFixed(2)}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// // --- Verification Modal ---
// const VerificationModal = ({ user, isOpen, onClose, onConfirm }) => {
//   const [reason, setReason] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleConfirm = async () => {
//     setIsLoading(true);
//     try {
//       await onConfirm(user._id, reason);
//       setReason("");
//       onClose();
//     } catch (err) {
//       toast.error("Failed to update verification status.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-gray-800/90 border border-gray-700/50 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
//         <h3 className="text-lg font-semibold text-gray-100 mb-4">
//           {user.verificationStatus === VERIFICATION_STATUSES.VERIFIED ? "Revoke Verification" : "Grant Verification"}
//         </h3>
//         <p className="text-sm text-gray-300 mb-4">
//           {user.verificationStatus === VERIFICATION_STATUSES.VERIFIED
//             ? `Are you sure you want to revoke the verification status for ${user.name}?`
//             : `Are you sure you want to grant a blue tick verification to ${user.name}?`}
//         </p>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-300 mb-1">Reason (optional)</label>
//           <textarea
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none"
//             placeholder="Enter reason for this action..."
//             rows="4"
//           />
//         </div>
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirm}
//             disabled={isLoading}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//               user.verificationStatus === VERIFICATION_STATUSES.VERIFIED
//                 ? "bg-red-600 hover:bg-red-500 text-white"
//                 : "bg-blue-600 hover:bg-blue-500 text-white"
//             } disabled:opacity-50`}
//           >
//             {isLoading ? "Processing..." : user.verificationStatus === VERIFICATION_STATUSES.VERIFIED ? "Revoke" : "Grant"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Featured Subscription Modal ---
// const FeaturedSubscriptionModal = ({ isOpen, onClose, onSave, approvedListings = [], homepageFeaturedSubscriptions = [], listing, isHomepageFeatured = true }) => {
//   const [formData, setFormData] = useState({
//     listingId: '',
//     rank: '',
//     gradient: 'from-blue-600 via-purple-700 to-purple-800',
//     border: 'border-purple-500/30',
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   useEffect(() => {
//     if (listing) {
//       setFormData({
//         listingId: listing._id || '',
//         rank: listing.homepageFeaturedConfig?.rank || '',
//         gradient: listing.homepageFeaturedConfig?.gradient || 'from-blue-600 via-purple-700 to-purple-800',
//         border: listing.homepageFeaturedConfig?.border || 'border-purple-500/30',
//       });
//     }
//   }, [listing]);

//   const handleSelectListing = (listingId) => {
//     console.log("[FeaturedSubscriptionModal] Selected listingId:", listingId);
//     if (!listingId || listingId.length !== 24) {
//       console.error("[FeaturedSubscriptionModal] Invalid listingId:", listingId);
//       setErrors((prev) => ({ ...prev, listingId: "Please select a valid listing" }));
//       return;
//     }
//     setFormData((prev) => ({ ...prev, listingId }));
//     setErrors((prev) => ({ ...prev, listingId: null }));
//     setIsDropdownOpen(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: null }));
//   };

//   const handleGradientSelect = (gradient, border) => {
//     console.log("[FeaturedSubscriptionModal] Selected gradient:", { gradient, border });
//     setFormData((prev) => ({ ...prev, gradient, border }));
//     setErrors((prev) => ({ ...prev, gradient: null, border: null }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.listingId || formData.listingId.length !== 24) {
//       newErrors.listingId = "Listing ID is required";
//     }
//     if (!formData.rank || isNaN(formData.rank) || parseInt(formData.rank) < 1) {
//       newErrors.rank = "Rank is required and must be at least 1";
//     }
//     if (!formData.gradient) {
//       newErrors.gradient = "Gradient is required";
//     }
//     if (!formData.border) {
//       newErrors.border = "Border is required";
//     }
//     console.log("[FeaturedSubscriptionModal] Validation errors:", newErrors);
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("[FeaturedSubscriptionModal] Submitting formData:", formData);
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       console.error("[FeaturedSubscriptionModal] Validation errors:", validationErrors);
//       setErrors(validationErrors);
//       toast.error("Please correct the errors before submitting");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const data = new FormData();
//       data.append("listingId", formData.listingId);
//       data.append("rank", formData.rank);
//       data.append("gradient", formData.gradient);
//       data.append("border", formData.border);

//       console.log("[FeaturedSubscriptionModal] FormData entries:", Object.fromEntries(data));
//       await onSave(listing?._id, data);
//       setFormData({
//         listingId: '',
//         rank: '',
//         gradient: 'from-blue-600 via-purple-700 to-purple-800',
//         border: 'border-purple-500/30',
//       });
//       onClose();
//       toast.success(listing ? "Subscription updated" : "Subscription added");
//     } catch (err) {
//       console.error("[FeaturedSubscriptionModal] Error saving subscription:", err);
//       toast.error(err.message || "Failed to save subscription");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace("/api", "");

//   // Filter out already selected homepage featured listings, except the current listing being edited
//   const availableListings = approvedListings.filter((item) => 
//     !homepageFeaturedSubscriptions.some((featured) => 
//       featured._id === item._id && (!listing || listing._id !== item._id)
//     )
//   );

//   return (
//     <div className={`modal ${isOpen ? 'block' : 'hidden'} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
//       <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
//         <h2 className="text-2xl text-white mb-4">
//           {listing ? 'Edit Homepage Featured Subscription' : 'Add Homepage Featured Subscription'}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-white mb-1">Listing</label>
//             <div className="relative">
//               <button
//                 type="button"
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="w-full bg-gray-700 text-white p-2 rounded text-left flex items-center justify-between"
//               >
//                 <span>
//                   {formData.listingId ? availableListings.find(l => l._id === formData.listingId)?.title || approvedListings.find(l => l._id === formData.listingId)?.title || 'Select a listing' : 'Select a listing'}
//                 </span>
//                 <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>
//               {isDropdownOpen && (
//                 <div className="absolute z-50 bg-gray-700 rounded mt-1 w-full max-h-64 overflow-y-auto shadow-lg">
//                   {Array.isArray(availableListings) && availableListings.length > 0 ? (
//                     <>
//                       {console.log("[FeaturedSubscriptionModal] Rendering availableListings:", availableListings.map(l => ({ _id: l._id, title: l.title })))}
//                       {availableListings.map((item) => (
//                         <div
//                           key={item._id}
//                           onClick={() => handleSelectListing(item._id)}
//                           className="p-2 hover:bg-gray-600 cursor-pointer text-white flex items-center gap-2"
//                         >
//                           {item.image && (
//                             <img
//                               src={`${IMAGE_BASE_URL}/Uploads/${item.image}`}
//                               alt={item.title}
//                               className="w-8 h-8 object-cover rounded"
//                               onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
//                             />
//                           )}
//                           <div>
//                             <div className="text-sm">{item.title}</div>
//                             <div className="text-xs text-gray-400">{item.sellerId?.name || 'Unknown'}</div>
//                           </div>
//                         </div>
//                       ))}
//                     </>
//                   ) : (
//                     <div className="p-2 text-white">No available listings</div>
//                   )}
//                 </div>
//               )}
//             </div>
//             {errors.listingId && <p className="text-red-400 text-sm mt-1">{errors.listingId}</p>}
//           </div>
//           <div className="mb-4">
//             <label className="block text-white mb-1">Rank</label>
//             <input
//               type="number"
//               name="rank"
//               value={formData.rank}
//               onChange={handleInputChange}
//               className="w-full bg-gray-700 text-white p-2 rounded"
//               min="1"
//               required
//             />
//             {errors.rank && <p className="text-red-400 text-sm mt-1">{errors.rank}</p>}
//           </div>
//           <div className="mb-4">
//             <label className="block text-white mb-1">Gradient & Border Presets</label>
//             <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-700/50 rounded">
//               {GRADIENT_PRESETS.map((preset) => (
//                 <div key={preset.name} className="flex items-center gap-2">
//                   <button
//                     type="button"
//                     onClick={() => handleGradientSelect(preset.gradient, preset.border)}
//                     className={`flex-1 p-2 rounded text-left text-sm text-white border ${formData.gradient === preset.gradient ? 'border-purple-500' : 'border-gray-600'}`}
//                     style={{ background: `linear-gradient(to right, ${preset.gradient.replace(/from-|via-|to-/g, '')})` }}
//                   >
//                     {preset.name}
//                   </button>
//                   <div
//                     className={`w-12 h-16 rounded border-2 ${preset.border} bg-gradient-to-br ${preset.gradient} flex flex-col justify-between p-1`}
//                   >
//                     <div className="flex justify-end gap-1">
//                       <div className="w-1 h-1 rounded-full bg-white/50"></div>
//                       <div className="w-1 h-1 rounded-full bg-white/30"></div>
//                     </div>
//                     <div className="bg-white/10 rounded text-xs text-center text-white">Card</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {errors.gradient && <p className="text-red-400 text-sm mt-1">{errors.gradient}</p>}
//             {errors.border && <p className="text-red-400 text-sm mt-1">{errors.border}</p>}
//           </div>
//           <div className="flex justify-end space-x-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
//               disabled={isLoading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 transition-colors"
//               disabled={isLoading}
//             >
//               {isLoading ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // --- Delete Featured Subscription Modal ---
// const DeleteFeaturedSubscriptionModal = ({ isOpen, onClose, listing, onConfirm, isHomepageFeatured }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleConfirm = async () => {
//     setIsLoading(true);
//     try {
//       await onConfirm(listing._id);
//       onClose();
//     } catch (err) {
//       toast.error(`Failed to remove ${isHomepageFeatured ? "homepage featured" : "ranked"} subscription`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-gray-800/90 border border-gray-700/50 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
//         <h3 className="text-lg font-semibold text-gray-100 mb-4">
//           Remove {isHomepageFeatured ? "Homepage Featured" : "Ranked"} Subscription
//         </h3>
//         <p className="text-sm text-gray-300 mb-6">
//           Are you sure you want to remove <span className="font-medium">"{listing.title}"</span> from {isHomepageFeatured ? "homepage featured" : "ranked"} subscriptions?
//         </p>
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirm}
//             disabled={isLoading}
//             className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
//           >
//             {isLoading ? "Removing..." : "Remove"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Main Ranked Modal ---
// const MainRankedModal = ({ isOpen, onClose, onSave, approvedListings = [], homepageFeaturedSubscriptions = [], listing }) => {
//   const [formData, setFormData] = useState({
//     listingId: '',
//     mainRank: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   useEffect(() => {
//     if (listing) {
//       setFormData({
//         listingId: listing._id || '',
//         mainRank: listing.mainRank || '',
//       });
//     } else {
//       setFormData({
//         listingId: '',
//         mainRank: '',
//       });
//     }
//   }, [listing]);

//   const handleSelectListing = (listingId) => {
//     console.log("[MainRankedModal] Selected listingId:", listingId);
//     if (!listingId || listingId.length !== 24) {
//       console.error("[MainRankedModal] Invalid listingId:", listingId);
//       setErrors((prev) => ({ ...prev, listingId: "Please select a valid listing" }));
//       return;
//     }
//     setFormData((prev) => ({ ...prev, listingId }));
//     setErrors((prev) => ({ ...prev, listingId: null }));
//     setIsDropdownOpen(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: null }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.listingId || formData.listingId.length !== 24) {
//       newErrors.listingId = "Listing ID is required";
//     }
//     if (!formData.mainRank || isNaN(formData.mainRank) || parseInt(formData.mainRank) < 1) {
//       newErrors.mainRank = "Rank is required and must be at least 1";
//     }
//     console.log("[MainRankedModal] Validation errors:", newErrors);
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("[MainRankedModal] Submitting formData:", formData);
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       console.error("[MainRankedModal] Validation errors:", validationErrors);
//       setErrors(validationErrors);
//       toast.error("Please correct the errors before submitting");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const data = new FormData();
//       data.append("listingId", formData.listingId);
//       data.append("mainRank", formData.mainRank);

//       console.log("[MainRankedModal] FormData entries:", Object.fromEntries(data));
//       await onSave(listing?._id, data);
//       setFormData({
//         listingId: '',
//         mainRank: '',
//       });
//       onClose();
//       toast.success(listing ? "Rank updated" : "Rank added");
//     } catch (err) {
//       console.error("[MainRankedModal] Error saving rank:", err);
//       toast.error(err.message || "Failed to save rank");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace("/api", "");

//   // Allow all approved listings in dropdown, only exclude if already main-ranked (unless editing)
//   const availableListings = approvedListings.filter((item) => 
//     !approvedListings.some((other) => 
//       other._id === item._id && other.mainRank != null && (!listing || listing._id !== item._id)
//     )
//   );

//   console.log("[MainRankedModal] Approved listings:", approvedListings.map(l => ({ _id: l._id, title: l.title })));
//   console.log("[MainRankedModal] Available listings:", availableListings.map(l => ({ _id: l._id, title: l.title })));

//   return (
//     <div className={`modal ${isOpen ? 'block' : 'hidden'} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
//       <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
//         <h2 className="text-2xl text-white mb-4">
//           {listing ? 'Edit Main Rank' : 'Add Main Rank'}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-white mb-1">Listing</label>
//             <div className="relative">
//               <button
//                 type="button"
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="w-full bg-gray-700 text-white p-2 rounded text-left flex items-center justify-between"
//               >
//                 <span>
//                   {formData.listingId 
//                     ? availableListings.find(l => l._id === formData.listingId)?.title 
//                       || approvedListings.find(l => l._id === formData.listingId)?.title 
//                       || 'Select a listing' 
//                     : 'Select a listing'}
//                 </span>
//                 <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>
//               {isDropdownOpen && (
//                 <div className="absolute z-50 bg-gray-700 rounded mt-1 w-full max-h-64 overflow-y-auto shadow-lg">
//                   {Array.isArray(availableListings) && availableListings.length > 0 ? (
//                     <>
//                       {availableListings.map((item) => (
//                         <div
//                           key={item._id}
//                           onClick={() => handleSelectListing(item._id)}
//                           className="p-2 hover:bg-gray-600 cursor-pointer text-white flex items-center gap-2"
//                         >
//                           {item.image && (
//                             <img
//                               src={`${IMAGE_BASE_URL}/Uploads/${item.image}`}
//                               alt={item.title}
//                               className="w-8 h-8 object-cover rounded"
//                               onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
//                             />
//                           )}
//                           <div>
//                             <div className="text-sm">{item.title}</div>
//                             <div className="text-xs text-gray-400">{item.sellerId?.name || 'Unknown'}</div>
//                           </div>
//                         </div>
//                       ))}
//                     </>
//                   ) : (
//                     <div className="p-2 text-white">No available listings. Approve or add new listings.</div>
//                   )}
//                 </div>
//               )}
//             </div>
//             {errors.listingId && <p className="text-red-400 text-sm mt-1">{errors.listingId}</p>}
//           </div>
//           <div className="mb-4">
//             <label className="block text-white mb-1">Rank</label>
//             <input
//               type="number"
//               name="mainRank"
//               value={formData.mainRank}
//               onChange={handleInputChange}
//               className="w-full bg-gray-700 text-white p-2 rounded"
//               min="1"
//               required
//             />
//             {errors.mainRank && <p className="text-red-400 text-sm mt-1">{errors.mainRank}</p>}
//           </div>
//           <div className="flex justify-end space-x-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
//               disabled={isLoading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 transition-colors"
//               disabled={isLoading}
//             >
//               {isLoading ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // --- Ranking Main Section ---
// const RankingMainSection = ({ listings }) => {
//   const [mainRankedSubscriptions, setMainRankedSubscriptions] = useState([]);
//   const [approvedListings, setApprovedListings] = useState([]);
//   const [homepageFeaturedSubscriptions, setHomepageFeaturedSubscriptions] = useState([]);
//   const [loadingMainRanked, setLoadingMainRanked] = useState(false);
//   const [errorMainRanked, setErrorMainRanked] = useState(null);
//   const [isMainRankedModalOpen, setIsMainRankedModalOpen] = useState(false);
//   const [selectedMainRankedSubscription, setSelectedMainRankedSubscription] = useState(null);
//   const [isDeleteMainRankedModalOpen, setIsDeleteMainRankedModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchApprovedListings = async () => {
//       try {
//         const response = await adminService.getAllListings({ status: 'approved' });
//         console.log('[RankingMainSection] Fetched approved listings:', response);
//         if (!response?.success || !Array.isArray(response.data)) {
//           throw new Error('Invalid response from getAllListings');
//         }
//         setApprovedListings(response.data);
//       } catch (err) {
//         console.error('[RankingMainSection] Error fetching approved listings:', err.message, err.stack);
//         setApprovedListings([]);
//         toast.error('Failed to fetch approved listings: ' + (err.message || 'Unknown error'));
//       }
//     };
//     fetchApprovedListings();
//   }, []);

//   useEffect(() => {
//     const fetchHomepageFeaturedSubscriptions = async () => {
//       try {
//         const response = await adminService.getHomepageFeaturedSubscriptions();
//         console.log('[RankingMainSection] Fetched homepage featured subscriptions:', response);
//         if (!response?.success || !Array.isArray(response.data)) {
//           throw new Error('Invalid response from getHomepageFeaturedSubscriptions');
//         }
//         setHomepageFeaturedSubscriptions(response.data);
//       } catch (err) {
//         console.error('[RankingMainSection] Error fetching homepage featured subscriptions:', err.message, err.stack);
//         setHomepageFeaturedSubscriptions([]);
//         toast.error('Failed to fetch homepage featured subscriptions: ' + (err.message || 'Unknown error'));
//       }
//     };
//     fetchHomepageFeaturedSubscriptions();
//   }, []);

//   const fetchMainRankedSubscriptions = useCallback(async () => {
//     setLoadingMainRanked(true);
//     setErrorMainRanked(null);
//     try {
//       console.log("[RankingMainSection] Fetching main ranked subscriptions...");
//       const response = await adminService.getMainRankedSubscriptions();
//       console.log("[RankingMainSection] Main ranked subscriptions response:", response);
//       if (!response?.success || !Array.isArray(response.data)) {
//         throw new Error('Invalid response from getMainRankedSubscriptions');
//       }
//       const rankedListings = response.data
//         .filter(l => l.mainRank != null)
//         .sort((a, b) => {
//           const rankA = a.mainRank ?? Number.MAX_SAFE_INTEGER;
//           const rankB = b.mainRank ?? Number.MAX_SAFE_INTEGER;
//           return rankA - rankB;
//         });
//       console.log("[RankingMainSection] Filtered and sorted main ranked subscriptions:", rankedListings);
//       setMainRankedSubscriptions(rankedListings);
//     } catch (err) {
//       console.error("[RankingMainSection] Error fetching main ranked subscriptions:", err.message, err.stack);
//       setErrorMainRanked(err.message || "Failed to fetch main ranked subscriptions");
//       toast.error('Failed to fetch main ranked subscriptions: ' + (err.message || 'Unknown error'));
//     } finally {
//       setLoadingMainRanked(false);
//     }
//   }, []);

//   const handleSaveMainRankedSubscription = async (listingId, formData) => {
//     console.log("[RankingMainSection] Saving main ranked subscription with listingId:", listingId, "FormData:", Object.fromEntries(formData));
//     try {
//       let response;
//       if (listingId) {
//         response = await adminService.updateMainRankedSubscription(listingId, formData.get('mainRank'));
//         setMainRankedSubscriptions((prev) =>
//           prev.map((l) => (l._id === listingId ? { ...l, mainRank: parseInt(formData.get('mainRank')) } : l))
//         );
//       } else {
//         response = await adminService.addMainRankedSubscription(
//           formData.get('listingId'),
//           formData.get('mainRank')
//         );
//         setMainRankedSubscriptions((prev) => [...prev, response.data]);
//       }
//       toast.success(response.message || "Main ranked subscription saved successfully");
//       await fetchMainRankedSubscriptions();
//     } catch (err) {
//       console.error("[RankingMainSection] Failed to save main ranked subscription:", err.message, err.stack);
//       toast.error(err.message || "Failed to save main ranked subscription");
//       throw err;
//     }
//   };
//   const handleBotNotification = (notification) => {
//   setNotifications((prev) => [...prev, { id: Date.now(), message: notification.message, type: 'promotion' }]);
// };

//   const handleRemoveMainRankedSubscription = async (listingId) => {
//     try {
//       const response = await adminService.removeMainRankedSubscription(listingId);
//       setMainRankedSubscriptions((prev) => prev.filter((l) => l._id !== listingId));
//       toast.success(response.message || "Main ranked subscription removed successfully");
//       await fetchMainRankedSubscriptions();
//     } catch (err) {
//       console.error("[RankingMainSection] Failed to remove main ranked subscription:", err.message, err.stack);
//       toast.error(err.message || "Failed to remove main ranked subscription");
//       throw err;
//     }
//   };

//   useEffect(() => {
//     fetchMainRankedSubscriptions();
//   }, [fetchMainRankedSubscriptions]);

//   return (
//     <div>
//       {loadingMainRanked ? (
//         <LoadingSpinner />
//       ) : errorMainRanked ? (
//         <ErrorMessage message={errorMainRanked} onRetry={fetchMainRankedSubscriptions} />
//       ) : (
//         <div className="bg-gray-800/50 rounded-lg p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold text-gray-100">Main Ranked Subscriptions</h3>
//             <button
//               onClick={() => setIsMainRankedModalOpen(true)}
//               className="px-4 py-2 bg-neon-blue hover:bg-neon-blue/80 text-white rounded-lg text-sm font-medium transition-colors"
//             >
//               Add Main Ranked Subscription
//             </button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-700">
//               <thead>
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Seller</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-700">
//                 {mainRankedSubscriptions.length > 0 ? (
//                   mainRankedSubscriptions.map((listing) => (
//                     <tr key={listing._id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{listing.title}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{listing.sellerId?.name || "Unknown"}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{listing.mainRank ?? "N/A"}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <button
//                           onClick={() => {
//                             setSelectedMainRankedSubscription(listing);
//                             setIsMainRankedModalOpen(true);
//                           }}
//                           className="text-neon-blue hover:text-neon-blue/80 mr-4"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => {
//                             setSelectedMainRankedSubscription(listing);
//                             setIsDeleteMainRankedModalOpen(true);
//                           }}
//                           className="text-red-400 hover:text-red-300"
//                         >
//                           Remove
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="text-center py-10 text-gray-400">
//                       No main ranked subscriptions found. Add a subscription to start ranking.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <MainRankedModal
//             isOpen={isMainRankedModalOpen}
//             onClose={() => {
//               setIsMainRankedModalOpen(false);
//               setSelectedMainRankedSubscription(null);
//             }}
//             listing={selectedMainRankedSubscription}
//             onSave={handleSaveMainRankedSubscription}
//             approvedListings={approvedListings}
//             homepageFeaturedSubscriptions={homepageFeaturedSubscriptions}
//           />
//           <DeleteFeaturedSubscriptionModal
//             isOpen={isDeleteMainRankedModalOpen}
//             onClose={() => {
//               setIsDeleteMainRankedModalOpen(false);
//               setSelectedMainRankedSubscription(null);
//             }}
//             listing={selectedMainRankedSubscription}
//             onConfirm={handleRemoveMainRankedSubscription}
//             isHomepageFeatured={false}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// // --- Homepage Featured Section ---
// const HomepageFeaturedSection = ({ listings }) => {
//   const [homepageFeaturedSubscriptions, setHomepageFeaturedSubscriptions] = useState([]);
//   const [approvedListings, setApprovedListings] = useState([]);
//   const [loadingHomepageFeatured, setLoadingHomepageFeatured] = useState(false);
//   const [errorHomepageFeatured, setErrorHomepageFeatured] = useState(null);
//   const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
//   const [selectedFeaturedSubscription, setSelectedFeaturedSubscription] = useState(null);
//   const [isDeleteFeaturedModalOpen, setIsDeleteFeaturedModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchApprovedListings = async () => {
//       try {
//         const response = await adminService.getAllListings({ status: 'approved' });
//         console.log('[HomepageFeaturedSection] Fetched approved listings:', response.data);
//         setApprovedListings(Array.isArray(response.data) ? response.data : []);
//       } catch (err) {
//         console.error('[HomepageFeaturedSection] Error fetching approved listings:', err);
//         setApprovedListings([]);
//       }
//     };
//     fetchApprovedListings();
//   }, []);

//   const fetchHomepageFeaturedSubscriptions = useCallback(async () => {
//     setLoadingHomepageFeatured(true);
//     setErrorHomepageFeatured(null);
//     try {
//       console.log("[HomepageFeaturedSection] Fetching homepage featured subscriptions...");
//       const response = await adminService.getHomepageFeaturedSubscriptions();
//       console.log("[HomepageFeaturedSection] Homepage featured subscriptions response:", response);
//       setHomepageFeaturedSubscriptions(Array.isArray(response.data) ? response.data.sort((a, b) => {
//         const rankA = a.homepageFeaturedConfig?.rank || Number.MAX_SAFE_INTEGER;
//         const rankB = b.homepageFeaturedConfig?.rank || Number.MAX_SAFE_INTEGER;
//         return rankA - rankB;
//       }) : []);
//     } catch (err) {
//       console.error("[HomepageFeaturedSection] Error fetching homepage featured subscriptions:", err);
//       setErrorHomepageFeatured(err.message || "Failed to fetch homepage featured subscriptions");
//     } finally {
//       setLoadingHomepageFeatured(false);
//     }
//   }, []);

//   const handleSaveHomepageFeaturedSubscription = async (listingId, formData) => {
//     console.log("[HomepageFeaturedSection] Saving homepage featured subscription with listingId:", listingId, "FormData:", Object.fromEntries(formData));
//     try {
//       let response;
//       if (listingId) {
//         response = await adminService.updateHomepageFeaturedSubscription(listingId, formData.get('rank'), formData.get('gradient'), formData.get('border'));
//         setHomepageFeaturedSubscriptions((prev) =>
//           prev.map((l) => (l._id === listingId ? { ...l, homepageFeaturedConfig: {
//             rank: parseInt(formData.get('rank')),
//             gradient: formData.get('gradient'),
//             border: formData.get('border'),
//           }} : l))
//         );
//       } else {
//         response = await adminService.addHomepageFeaturedSubscription(
//           formData.get('listingId'),
//           formData.get('rank'),
//           formData.get('gradient'),
//           formData.get('border')
//         );
//         setHomepageFeaturedSubscriptions((prev) => [...prev, response.data]);
//       }
//       toast.success(response.message || "Homepage featured subscription saved successfully");
//       await fetchHomepageFeaturedSubscriptions();
//     } catch (err) {
//       console.error("[HomepageFeaturedSection] Failed to save homepage featured subscription:", err);
//       toast.error(err.message || "Failed to save homepage featured subscription");
//       throw err;
//     }
//   };

//   const handleRemoveHomepageFeaturedSubscription = async (listingId) => {
//     try {
//       const response = await adminService.removeHomepageFeaturedSubscription(listingId);
//       setHomepageFeaturedSubscriptions((prev) => prev.filter((l) => l._id !== listingId));
//       toast.success(response.message || "Homepage featured subscription removed successfully");
//       await fetchHomepageFeaturedSubscriptions();
//     } catch (err) {
//       console.error("[HomepageFeaturedSection] Failed to remove homepage featured subscription:", err);
//       toast.error(err.message || "Failed to remove homepage featured subscription");
//       throw err;
//     }
//   };

//   useEffect(() => {
//     fetchHomepageFeaturedSubscriptions();
//   }, [fetchHomepageFeaturedSubscriptions]);

//   return (
//     <div>
//       {loadingHomepageFeatured ? (
//         <LoadingSpinner />
//       ) : errorHomepageFeatured ? (
//         <ErrorMessage message={errorHomepageFeatured} onRetry={fetchHomepageFeaturedSubscriptions} />
//       ) : (
//         <div className="bg-gray-800/50 rounded-lg p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold text-gray-100">Homepage Featured Subscriptions</h3>
//             <button
//               onClick={() => setIsFeaturedModalOpen(true)}
//               className="px-4 py-2 bg-neon-blue hover:bg-neon-blue/80 text-white rounded-lg text-sm font-medium transition-colors"
//             >
//               Add Homepage Featured Subscription
//             </button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-700">
//               <thead>
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Seller</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gradient</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-700">
//                 {homepageFeaturedSubscriptions.length > 0 ? (
//                   homepageFeaturedSubscriptions.map((listing) => (
//                     <tr key={listing._id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{listing.title}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{listing.sellerId?.name || "Unknown"}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{listing.homepageFeaturedConfig?.rank || "N/A"}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
//                         <div
//                           className="w-12 h-4 rounded"
//                           style={{ background: `linear-gradient(to right, ${listing.homepageFeaturedConfig?.gradient.replace(/from-|via-|to-/g, "")})` }}
//                         ></div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <button
//                           onClick={() => {
//                             setSelectedFeaturedSubscription(listing);
//                             setIsFeaturedModalOpen(true);
//                           }}
//                           className="text-neon-blue hover:text-neon-blue/80 mr-4"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => {
//                             setSelectedFeaturedSubscription(listing);
//                             setIsDeleteFeaturedModalOpen(true);
//                           }}
//                           className="text-red-400 hover:text-red-300"
//                         >
//                           Remove
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="text-center py-10 text-gray-400">
//                       No homepage featured subscriptions found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <FeaturedSubscriptionModal
//             isOpen={isFeaturedModalOpen}
//             onClose={() => {
//               setIsFeaturedModalOpen(false);
//               setSelectedFeaturedSubscription(null);
//             }}
//             listing={selectedFeaturedSubscription}
//             onSave={handleSaveHomepageFeaturedSubscription}
//             approvedListings={approvedListings}
//             homepageFeaturedSubscriptions={homepageFeaturedSubscriptions}
//             isHomepageFeatured={true}
//           />
//           <DeleteFeaturedSubscriptionModal
//             isOpen={isDeleteFeaturedModalOpen}
//             onClose={() => {
//               setIsDeleteFeaturedModalOpen(false);
//               setSelectedFeaturedSubscription(null);
//             }}
//             listing={selectedFeaturedSubscription}
//             onConfirm={handleRemoveHomepageFeaturedSubscription}
//             isHomepageFeatured={true}
//           />
//         </div>
//       )}
//     </div>
//   );
// };
// // --- Main Admin Dashboard Component ---
// const AdminDashboard = () => {
//   const [userSearchTerm, setUserSearchTerm] = useState("");
//   const [blogSearchTerm, setBlogSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");
//     const [notifications, setNotifications] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [usersLoading, setUsersLoading] = useState(false);
//   const [usersError, setUsersError] = useState(null);
//   const [usersPagination, setUsersPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
//   const [userActionLoading, setUserActionLoading] = useState(null);
//   const [allListings, setAllListings] = useState([]);
//   const [listingsLoading, setListingsLoading] = useState(false);
//   const [listingsError, setListingsError] = useState(null);
//   const [listingsPagination, setListingsPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
//   const [listingActionLoading, setListingActionLoading] = useState(null);
//   const [blogs, setBlogs] = useState([]);
//   const [blogsLoading, setBlogsLoading] = useState(false);
//   const [blogsError, setBlogsError] = useState(null);
//   const [blogsPagination, setBlogsPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
//   const [blogActionLoading, setBlogActionLoading] = useState(null);
//   const [pendingCount, setPendingCount] = useState(0);
//   const [overviewLoading, setOverviewLoading] = useState(true);
//   const [showBlockModal, setShowBlockModal] = useState(false);
//   const [userToBlock, setUserToBlock] = useState(null);
//   const [showListingModal, setShowListingModal] = useState(false);
//   const [selectedListing, setSelectedListing] = useState(null);
//   const [showVerificationModal, setShowVerificationModal] = useState(false);
//   const [userToVerify, setUserToVerify] = useState(null);
//   const [showBlogModal, setShowBlogModal] = useState(false);
//   const [selectedBlog, setSelectedBlog] = useState(null);
//   const [showDeleteBlogModal, setShowDeleteBlogModal] = useState(false);
//   const [blogToDelete, setBlogToDelete] = useState(null);

//   const transactions = [
//     { id: "1", name: "Thabo Mbeki", amount: 250.0, date: "2023-11-14", type: "credit" },
//     { id: "2", name: "Nomzamo Mbatha", amount: 1000.0, date: "2023-11-13", type: "debit" },
//     { id: "3", name: "Siya Kolisi", amount: 500.0, date: "2023-11-12", type: "credit" },
//     { id: "4", name: "Trevor Noah", amount: 750.0, date: "2023-11-11", type: "debit" },
//     { id: "5", name: "Patrice Motsepe", amount: 2500.0, date: "2023-11-10", type: "credit" },
//   ];

//   const fetchUsers = useCallback(async (page = 1, limit = 15, search = "") => {
//     setUsersLoading(true);
//     setUsersError(null);
//     try {
//       const params = { page, limit, search };
//       const response = await adminService.getAllUsers(params);
//       const usersWithDefaultStatus = (response.data || []).map((user) => ({
//         ...user,
//         verificationStatus: user.verificationStatus || VERIFICATION_STATUSES.NOT_VERIFIED,
//       }));
//       setUsers(usersWithDefaultStatus);
//       setUsersPagination(response.pagination || { page, limit, total: 0, pages: 1 });
//     } catch (err) {
//       setUsersError(err.message || "Failed to fetch users.");
//     } finally {
//       setUsersLoading(false);
//     }
//   }, []);

//     const fetchNotifications = useCallback(async () => {
//     if (!currentUser) return;
//     setLoading((prev) => ({ ...prev, notifications: true }));
//     setError((prev) => ({ ...prev, notifications: null }));
//     try {
//       const response = await notificationService.getNotifications();
//       console.log("[AdminDashboard] fetchNotifications: Response:", JSON.stringify(response, null, 2));
//       if (response?.success && Array.isArray(response.notifications)) {
//         setNotifications(response.notifications);
//         setUnreadCount(response.notifications.filter((n) => !n.isRead).length);
//       } else {
//         setNotifications([]);
//         setUnreadCount(0);
//       }
//     } catch (err) {
//       console.error("[AdminDashboard] Failed to fetch notifications:", err);
//       setError((prev) => ({
//         ...prev,
//         notifications: err.responsePayload?.message || err.message || "Failed to fetch notifications.",
//       }));
//       setNotifications([]);
//       setUnreadCount(0);
//     } finally {
//       setLoading((prev) => ({ ...prev, notifications: false }));
//     }
//   }, [currentUser]);

//   const fetchAllListings = useCallback(async (page = 1, limit = 15) => {
//     setListingsLoading(true);
//     setListingsError(null);
//     try {
//       const params = { page, limit };
//       const response = await adminService.getAllListings(params);
//       setAllListings(response.data || []);
//       setListingsPagination(response.pagination || { page, limit, total: 0, pages: 1 });
//     } catch (err) {
//       setListingsError(err.message || "Failed to fetch listings.");
//     } finally {
//       setListingsLoading(false);
//     }
//   }, []);

//   const fetchBlogs = useCallback(async (page = 1, limit = 15, search = "") => {
//     setBlogsLoading(true);
//     setBlogsError(null);
//     try {
//       const params = { page, limit, search };
//       const response = await adminService.getBlogs(params);
//       setBlogs(response.data || []);
//       setBlogsPagination(response.pagination || { page, limit, total: 0, pages: 1 });
//     } catch (err) {
//       setBlogsError(err.message || "Failed to fetch blogs.");
//     } finally {
//       setBlogsLoading(false);
//     }
//   }, []);

//   const fetchPendingCount = useCallback(async () => {
//     setOverviewLoading(true);
//     try {
//       const pending = await adminService.getPendingListings();
//       setPendingCount(pending.length);
//     } catch (err) {
//       console.error("Failed to fetch pending count:", err);
//     } finally {
//       setOverviewLoading(false);
//     }
//   }, []);

//   const handleToggleVerification = async (userId, reason = "") => {
//     if (userActionLoading === userId) return;
//     setUserActionLoading(userId);
//     try {
//       const user = users.find((u) => u._id === userId);
//       if (!user) {
//         throw new Error("User not found in local state");
//       }
//       const newStatus =
//         user.verificationStatus === VERIFICATION_STATUSES.VERIFIED
//           ? VERIFICATION_STATUSES.NOT_VERIFIED
//           : VERIFICATION_STATUSES.VERIFIED;
//       const response = await adminService.toggleUserVerification(userId, newStatus, reason);
//       toast.success(response.message || `Verification status updated.`);
//       setUsers((prevUsers) =>
//         prevUsers.map((u) => (u._id === userId ? { ...u, verificationStatus: newStatus } : u))
//       );
//     } catch (err) {
//       console.error(`Failed to toggle verification for user ${userId}:`, {
//         message: err.message,
//         stack: err.stack,
//         response: err.response ? { status: err.response.status, data: err.response.data } : null,
//       });
//       toast.error(`Failed to toggle verification for user ${userId}: ${err.message || "Unknown error"}`);
//     } finally {
//       setUserActionLoading(null);
//     }
//   };

//   const handleToggleBlock = async (userId, currentBlockedStatus) => {
//     if (userActionLoading === userId) return;
//     setUserActionLoading(userId);
//     try {
//       const response = await adminService.toggleUserBlock(userId);
//       toast.success(response.message || `User status updated.`);
//       setUsers((prevUsers) => prevUsers.map((u) => (u._id === userId ? { ...u, isBlocked: !currentBlockedStatus } : u)));
//     } catch (err) {
//       console.error(`Failed to toggle block for user ${userId}:`, err);
//       toast.error(`Failed to toggle block for user ${userId}.`);
//     } finally {
//       setUserActionLoading(null);
//     }
//   };

//   const handleNotificationClick = async (notification) => {
//     if (!notification.isRead) {
//       try {
//         await notificationService.markAsRead(notification._id);
//         setNotifications((prev) =>
//           prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
//         );
//         setUnreadCount((prev) => Math.max(0, prev - 1));
//       } catch (err) {
//         console.error("[AdminDashboard] Failed to mark notification as read:", err);
//         toast(({ closeToast }) => (
//           <NewCustomToast
//             type="error"
//             headline="Error"
//             text="Could not update notification status."
//             closeToast={closeToast}
//           />
//         ));
//       }
//     }
//     setShowNotificationsDropdown(false);
//     if (notification.relatedEntityType === "Listing" && notification.relatedEntity) {
//       navigate(`/listing/${notification.relatedEntity}`);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   useEffect(() => {
//     if (activeTab === "listings") {
//       fetchPendingListings();
//     } else if (activeTab === "users") {
//       fetchUsers();
//     } else if (activeTab === "notifications") {
//       fetchNotifications();
//     }
//   }, [activeTab, fetchPendingListings, fetchUsers, fetchNotifications]);

//   useEffect(() => {
//     if (!currentUser?._id) return;

//     const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
//       query: { userId: currentUser._id, userType: "admin" },
//     });

//     socket.on("connect", () => {
//       console.log("Admin socket connected:", socket.id);
//     });
//     socket.on("disconnect", (reason) => console.log(`Admin socket disconnected: ${reason}`));

//     socket.on("connect_error", (err) => {
//       console.error("Socket connection error:", err);
//       toast(({ closeToast }) => (
//         <NewCustomToast
//           type="error"
//           headline="Connection Issue"
//           text={`Real-time connection failed: ${err.message}. Some features might be affected.`}
//           closeToast={closeToast}
//         />
//       ));
//     });

//     socket.on("new_notification", (notification) => {
//       setNotifications((prev) => [notification, ...prev].slice(0, 50));
//       if (!notification.isRead) setUnreadCount((prev) => prev + 1);
//       if (notification.type === "promotion_bid") {
//         toast(({ closeToast }) => (
//           <NewCustomToast
//             type="info"
//             headline="New Promotion Bid"
//             text={notification.message}
//             closeToast={closeToast}
//           />
//         ));
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [currentUser?._id]);

//   useEffect(() => {
//     if (currentUser) {
//       fetchPendingListings();
//       fetchUsers();
//       fetchNotifications();
//     } else {
//       setListings([]);
//       setUsers([]);
//       setNotifications([]);
//       setUnreadCount(0);
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         notificationDropdownRef.current &&
//         !notificationDropdownRef.current.contains(event.target) &&
//         !event.target.closest("#notification-button-admin")
//       ) {
//         setShowNotificationsDropdown(false);
//       }
//       if (
//         userDropdownRef.current &&
//         !userDropdownRef.current.contains(event.target) &&
//         !event.target.closest("#user-menu-button-admin")
//       ) {
//         setShowUserDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const tabItems = [
//     { id: "listings", label: "Pending Listings", icon: ListingsIcon },
//     { id: "users", label: "Manage Users", icon: UsersIcon },
//     { id: "notifications", label: "Notifications", icon: NotificationsIcon },
//   ];

//   if (!currentUser || currentUser.role !== "admin") {
//     return (
//       <div className="min-h-screen text-gray-100 font-sans flex flex-col relative items-center justify-center">
//         <AnimatedGradientBackground />
//         <div className="relative z-10 p-8 bg-black/50 backdrop-blur-xl border border-gray-700/40 rounded-xl shadow-2xl text-center">
//           <LoadingSpinner />
//           <p className="mt-4 text-lg">Authenticating...</p>
//           <p className="text-sm text-gray-400">
//             Please wait or{" "}
//             <Link to="/login" className="text-neon-purple hover:underline">
//               login
//             </Link>{" "}
//             as an admin.
//           </p>
//         </div>
//       </div>
//     );
//   }

 
        
                  
//   const handleApproveListing = async (listingId) => {
//     if (listingActionLoading === listingId) return;
//     setListingActionLoading(listingId);
//     try {
//       const response = await adminService.approveListing(listingId);
//       toast.success(response.message || `Listing approved.`);
//       setAllListings((prev) => prev.map((l) => (l._id === listingId ? { ...l, status: "approved" } : l)));
//       if (selectedListing?._id === listingId)
//         setSelectedListing((prev) => (prev ? { ...prev, status: "approved" } : null));
//       setShowListingModal(false);
//       fetchPendingCount();
//     } catch (err) {
//       console.error(`Failed to approve listing ${listingId}:`, err);
//       toast.error(`Failed to approve listing ${listingId}.`);
//     } finally {
//       setListingActionLoading(null);
//     }
//   };

//   const handleRejectListing = async (listingId) => {
//     if (listingActionLoading === listingId) return;
//     const reason = prompt("Enter reason for rejection (optional, will be sent to seller):");
//     if (reason === null) return;

//     setListingActionLoading(listingId);
//     try {
//       const response = await adminService.rejectListing(listingId, reason || undefined);
//       toast.warn(response.message || `Listing rejected.`);
//       setAllListings((prev) =>
//         prev.map((l) => (l._id === listingId ? { ...l, status: "rejected", rejectionReason: reason } : l))
//       );
//       if (selectedListing?._id === listingId)
//         setSelectedListing((prev) => (prev ? { ...prev, status: "rejected", rejectionReason: reason } : null));
//       setShowListingModal(false);
//       fetchPendingCount();
//     } catch (err) {
//       console.error(`Failed to reject listing ${listingId}:`, err);
//       toast.error(`Failed to reject listing ${listingId}.`);
//     } finally {
//       setListingActionLoading(null);
//     }
//   };

//   const handleSaveBlog = async (blogId, data) => {
//     if (blogActionLoading) return;
//     setBlogActionLoading(blogId || "new");
//     try {
//       let response;
//       if (blogId) {
//         response = await adminService.updateBlog(blogId, data);
//         setBlogs((prev) =>
//           prev.map((b) => (b._id === blogId ? { ...b, ...response.data } : b))
//         );
//       } else {
//         response = await adminService.createBlog(data);
//         setBlogs((prev) => [response.data, ...prev]);
//         setBlogsPagination((prev) => ({ ...prev, total: prev.total + 1 }));
//       }
//       toast.success(response.message || `Blog ${blogId ? "updated" : "created"} successfully.`);
//     } catch (err) {
//       console.error(`Failed to ${blogId ? "update" : "create"} blog:`, err);
//       throw err;
//     } finally {
//       setBlogActionLoading(null);
//     }
//   };

//   const handleDeleteBlog = async (blogId) => {
//     if (blogActionLoading === blogId) return;
//     setBlogActionLoading(blogId);
//     try {
//       const response = await adminService.deleteBlog(blogId);
//       setBlogs((prev) => prev.filter((b) => b._id !== blogId));
//       setBlogsPagination((prev) => ({ ...prev, total: prev.total - 1 }));
//       toast.success(response.message || "Blog deleted successfully.");
//     } catch (err) {
//       console.error(`Failed to delete blog${blogId}:`, err);
//       throw err;
//     } finally {
//       setBlogActionLoading(null);
//     }
//   };

//   const handleUserSearchChange = (e) => {
//     setUserSearchTerm(e.target.value);
//     fetchUsers(1, usersPagination.limit, e.target.value);
//   };

//   const handleBlogSearchChange = (e) => {
//     setBlogSearchTerm(e.target.value);
//     fetchBlogs(1, blogsPagination.limit, e.target.value);
//   };

//   const viewListingDetails = (listing) => {
//     setSelectedListing(listing);
//     setShowListingModal(true);
//   };

//   const openBlogModal = (blog = null) => {
//     setSelectedBlog(blog);
//     setShowBlogModal(true);
//   };

//   const openDeleteBlogModal = (blog) => {
//     setBlogToDelete(blog);
//     setShowDeleteBlogModal(true);
//   };

//   const confirmBlockUser = async () => {
//     if (userToBlock) {
//       await handleToggleBlock(userToBlock._id, userToBlock.isBlocked);
//       setUserToBlock(null);
//     }
//     setShowBlockModal(false);
//   };

//   useEffect(() => {
//     if (activeTab === "overview") {
//       fetchPendingCount();
//       if (usersPagination.total === 0 && users.length === 0) fetchUsers(1, usersPagination.limit);
//       if (listingsPagination.total === 0 && allListings.length === 0) fetchAllListings(1, listingsPagination.limit);
//     } else if (activeTab === "users") {
//       fetchUsers(usersPagination.page, usersPagination.limit, userSearchTerm);
//     } else if (activeTab === "listings") {
//       fetchAllListings(listingsPagination.page, listingsPagination.limit);
//     } else if (activeTab === "blogs") {
//       fetchBlogs(blogsPagination.page, blogsPagination.limit, blogSearchTerm);
//     } else if (activeTab === "RankingMain") {
//       fetchAllListings(1, listingsPagination.limit);
//     } else if (activeTab === "HomepageFeatured") {
//       fetchAllListings(1, listingsPagination.limit);
//     }
//   }, [
//     activeTab,
//     fetchPendingCount,
//     fetchUsers,
//     fetchAllListings,
//     fetchBlogs,
//     usersPagination.page,
//     usersPagination.limit,
//     listingsPagination.page,
//     listingsPagination.limit,
//     blogsPagination.page,
//     blogsPagination.limit,
//     usersPagination.total,
//     listingsPagination.total,
//     blogsPagination.total,
//     users.length,
//     allListings.length,
//     blogs.length,
//     userSearchTerm,
//     blogSearchTerm,
//   ]);

//   useEffect(() => {
//     const socket = io(SOCKET_URL);
//     socket.on("connect", () => {
//       console.log("AdminDashboard Socket connected:", socket.id);
//       socket.emit("join_admin_room");
//     });
//     socket.on("new_pending_listing", (newListingData) => {
//       toast.info(`New listing "${newListingData.title}" requires approval.`);
//       setPendingCount((prev) => prev + 1);
//     });
//     socket.on("listing_approved", () => fetchPendingCount());
//     socket.on("listing_rejected", () => fetchPendingCount());
//     socket.on("user_verification_updated", (data) => {
//       setUsers((prevUsers) =>
//         prevUsers.map((u) => (u._id === data.userId ? { ...u, verificationStatus: data.status } : u))
//       );
//       toast.info(`User ${data.userName} verification status updated to ${data.status}.`);
//     });
//     return () => socket.disconnect();
//   }, [fetchPendingCount]);

//   return (
//     <div className="min-h-screen text-white flex flex-col relative font-sans">
//       <AnimatedGradientBackground />
//       <div className="relative z-10 flex flex-col flex-grow">
//         <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
//           <header className="bg-black/40 backdrop-blur-lg border border-gray-700/30 rounded-xl shadow-2xl p-6 mb-10">
//             <div className="flex flex-wrap justify-between items-center gap-4">
//               <h1
//                 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-neon-blue to-purple-400"
//                 style={{
//                   textShadow: "0 0 20px rgba(139, 92, 246, 0.3), 0 0 30px rgba(129, 140, 248, 0.2)",
//                 }}
//               >
//                 Admin Dashboard
//               </h1>
//               <Link
//                 to="/admin/approvals"
//                 className="px-5 py-2.5 bg-yellow-500/80 text-black font-semibold rounded-lg hover:bg-yellow-400/90 transition duration-300 hover:shadow-yellow-500/40 flex items-center gap-2 text-sm"
//               >
//                 Pending Approvals{" "}
//                 {pendingCount > 0 && (
//                   <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//                     {pendingCount}
//                   </span>
//                 )}
//               </Link>
//             </div>
//           </header>

//           <div className="mb-8">
//             <div className="sm:hidden">
//               <select
//                 id="admin-tabs-mobile"
//                 name="admin-tabs-mobile"
//                 className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-700/50 bg-gray-800/70 text-white focus:outline-none focus:ring-neon-blue focus:border-neon-blue sm:text-sm rounded-lg shadow-md backdrop-blur-sm"
//                 value={activeTab}
//                 onChange={(e) => setActiveTab(e.target.value)}
//               >
//                 {["overview", "users", "listings", "RankingMain", "HomepageFeatured", "blogs"].map((tab) => (
//                   <option key={tab} value={tab}>
//                     {tab === "RankingMain"
//                       ? "Ranking Main"
//                       : tab === "HomepageFeatured"
//                       ? "Homepage Featured"
//                       : tab.charAt(0).toUpperCase() + tab.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="hidden sm:block">
//               <div className="border-b border-gray-700/50">
//                 <nav className="-mb-px flex space-x-8" aria-label="Tabs">
//                   {["overview", "users", "listings", "RankingMain", "HomepageFeatured", "blogs"].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`group inline-flex items-center py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-150 ease-in-out focus:outline-none
//                         ${activeTab === tab ? "border-neon-blue text-neon-blue" : "border-transparent text-gray-400 hover:text-gray-100 hover:border-gray-500"}`}
//                     >
//                       {tab === "RankingMain"
//                         ? "Ranking Main"
//                         : tab === "HomepageFeatured"
//                         ? "Homepage Featured"
//                         : tab.charAt(0).toUpperCase() + tab.slice(1)}
//                     </button>
//                   ))}
//                 </nav>
//               </div>
//             </div>
//           </div>

//           <div className="bg-black/50 backdrop-blur-xl border border-gray-700/40 rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 min-h-[60vh]">
//             {activeTab === "overview" && (
//               <div>
//                 <h2 className="text-3xl font-bold mb-8 text-gray-100">Dashboard Overview</h2>
//                 {overviewLoading ? (
//                   <LoadingSpinner />
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                     <div className="bg-gray-800/70 border border-neon-blue/20 rounded-xl p-6 backdrop-blur-lg shadow-lg">
//                       <h3 className="text-sm font-medium text-gray-400 mb-1">Pending Approvals</h3>
//                       <p className="text-4xl font-bold text-neon-blue">{pendingCount?.toLocaleString() ?? 0}</p>
//                       <Link to="/admin/approvals" className="text-xs text-neon-blue hover:underline mt-2 inline-block">
//                         View Pending
//                       </Link>
//                     </div>
//                     <div className="bg-gray-800/70 border border-gray-700/50 rounded-xl p-6 backdrop-blur-lg shadow-lg">
//                       <h3 className="text-sm font-medium text-gray-400 mb-1">Total Users</h3>
//                       <p className="text-4xl font-bold">
//                         {usersLoading && usersPagination.total === 0
//                           ? "..."
//                           : (usersPagination?.total ?? 0).toLocaleString()}
//                       </p>
//                     </div>
//                     <div className="bg-gray-800/70 border border-gray-700/50 rounded-xl p-6 backdrop-blur-lg shadow-lg">
//                       <h3 className="text-sm font-medium text-gray-400 mb-1">Revenue Today</h3>
//                       <p className="text-4xl font-bold">R 0</p>
//                     </div>
//                     <div className="bg-gray-800/70 border border-gray-700/50 rounded-xl p-6 backdrop-blur-lg shadow-lg">
//                       <h3 className="text-sm font-medium text-gray-400 mb-1">Active Subscriptions</h3>
//                       <p className="text-4xl font-bold">0</p>
//                     </div>
//                   </div>
//                 )}
//                 <div className="mt-10 grid grid-cols-1 lg:grid-cols-7 gap-6">
//                   <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-lg shadow-lg lg:col-span-4">
//                     <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
//                     <DashboardChart />
//                   </div>
//                   <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-lg shadow-lg lg:col-span-3">
//                     <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
//                     <RecentTransactions transactions={transactions} />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "users" && (
//               <div>
//                 <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
//                   <h2 className="text-3xl font-bold text-gray-100">User Management</h2>
//                   <div className="flex gap-3 items-center">
//                     <input
//                       type="text"
//                       placeholder="Search by name or email..."
//                       value={userSearchTerm}
//                       onChange={handleUserSearchChange}
//                       className="bg-gray-700/70 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none w-full sm:w-72"
//                     />
//                   </div>
//                 </div>
//                 {usersLoading ? (
//                   <LoadingSpinner />
//                 ) : usersError ? (
//                   <ErrorMessage message={usersError} onRetry={() => fetchUsers(1, usersPagination.limit, userSearchTerm)} />
//                 ) : (
//                   <>
//                     <div className="overflow-x-auto custom-scrollbar bg-gray-800/60 border border-gray-700/50 rounded-xl shadow-md">
//                       <table className="w-full min-w-[1200px] text-left">
//                         <thead className="border-b border-gray-700 bg-gray-700/40">
//                           <tr>
//                             <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
//                             <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
//                             <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Verification</th>
//                             <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
//                             <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
//                             <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-700/50">
//                           {users.length > 0 ? (
//                             users.map((user) => (
//                               <tr key={user._id} className="hover:bg-gray-700/40 transition-colors group">
//                                 <td className="px-5 py-4 whitespace-nowrap">
//                                   <div className="flex items-center">
//                                     <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-600 flex items-center justify-center text-neon-blue font-semibold">
//                                       {user.name ? user.name.charAt(0).toUpperCase() : "?"}
//                                     </div>
//                                     <div className="ml-4">
//                                       <div className="text-sm font-medium text-gray-100 flex items-center gap-2">
//                                         {user.name || "Unknown"}
//                                         {user.verificationStatus === VERIFICATION_STATUSES.VERIFIED && (
//                                           <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
//                                             <path
//                                               fillRule="evenodd"
//                                               d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                                               clipRule="evenodd"
//                                             />
//                                           </svg>
//                                         )}
//                                       </div>
//                                       <div className="text-xs text-gray-400">{user.email || "N/A"}</div>
//                                     </div>
//                                   </div>
//                                 </td>
//                                 <td className="px-5 py-4 whitespace-nowrap text-sm capitalize text-gray-300">{user.role || "N/A"}</td>
//                                 <td className="px-5 py-4 whitespace-nowrap text-sm">
//                                   <span
//                                     className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
//                                       user.verificationStatus === VERIFICATION_STATUSES.VERIFIED
//                                         ? "bg-blue-500/20 text-blue-300"
//                                         : user.verificationStatus === VERIFICATION_STATUSES.PENDING
//                                         ? "bg-yellow-500/20 text-yellow-300"
//                                         : "bg-gray-500/20 text-gray-300"
//                                     }`}
//                                   >
//                                     {user.verificationStatus ? user.verificationStatus.replace("_", " ") : "Not Verified"}
//                                   </span>
//                                 </td>
//                                 <td className="px-5 py-4 whitespace-nowrap text-sm">
//                                   <span
//                                     className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
//                                       user.isBlocked ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
//                                     }`}
//                                   >
//                                     {user.isBlocked ? "Blocked" : "Active"}
//                                   </span>
//                                 </td>
//                                 <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">
//                                   {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
//                                 </td>
//                                 <td className="px-5 py-4 whitespace-nowrap text-xs font-medium text-center">
//                                   <div className="flex items-center justify-center gap-1.5">
//                                     <button
//                                       onClick={() => {
//                                         setUserToVerify(user);
//                                         setShowVerificationModal(true);
//                                       }}
//                                       title={
//                                         user.verificationStatus === VERIFICATION_STATUSES.VERIFIED
//                                           ? "Revoke Verification"
//                                           : "Grant Verification"
//                                       }
//                                       className={`p-2 transition-colors rounded-md hover:bg-gray-700/50 ${
//                                         user.verificationStatus === VERIFICATION_STATUSES.VERIFIED
//                                           ? "text-red-400 hover:text-red-300"
//                                           : "text-blue-400 hover:text-blue-300"
//                                       }`}
//                                     >
//                                       <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                                         <path
//                                           fillRule="evenodd"
//                                           d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                                           clipRule="evenodd"
//                                         />
//                                       </svg>
//                                     </button>
//                                     <button
//                                       onClick={() => {
//                                         setUserToBlock(user);
//                                         setShowBlockModal(true);
//                                       }}
//                                       title={user.isBlocked ? "Unblock User" : "Block User"}
//                                       className={`p-2 transition-colors rounded-md hover:bg-gray-700/50 ${
//                                         user.isBlocked ? "text-green-400 hover:text-green-300" : "text-red-400 hover:text-red-300"
//                                       }`}
//                                     >
//                                       {user.isBlocked ? (
//                                         <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                                           <path
//                                             fillRule="evenodd"
//                                             d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                                             clipRule="evenodd"
//                                           />
//                                         </svg>
//                                       ) : (
//                                         <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                                           <path
//                                             fillRule="evenodd"
//                                             d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                                             clipRule="evenodd"
//                                           />
//                                         </svg>
//                                       )}
//                                     </button>
//                                   </div>
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="6" className="text-center py-10 text-gray-400">
//                                 No users found{userSearchTerm && " matching your search"}.
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                     {usersPagination.total > 0 && usersPagination.pages > 1 && (
//                       <div className="mt-6 flex justify-between items-center">
//                         <button
//                           onClick={() => fetchUsers(usersPagination.page - 1, usersPagination.limit, userSearchTerm)}
//                           disabled={usersPagination.page === 1 || usersLoading}
//                           className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           Previous
//                         </button>
//                         <span className="text-sm text-gray-300">
//                           Page {usersPagination.page} of {usersPagination.pages} (Total: {usersPagination.total})
//                         </span>
//                         <button
//                           onClick={() => fetchUsers(usersPagination.page + 1, usersPagination.limit, userSearchTerm)}
//                           disabled={usersPagination.page === usersPagination.pages || usersLoading}
//                           className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           Next
//                         </button>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             )}

//             {activeTab === "listings" && (
//               <div>
//                 <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
//                   <h2 className="text-2xl font-semibold text-gray-100">Listing Management</h2>
//                   <div className="flex gap-3">
//                     <input
//                       type="text"
//                       placeholder="Search listings..."
//                       className="bg-gray-700/70 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none w-full sm:w-72"
//                     />
//                     <Link
//                       to="/admin/approvals"
//                       className="px-4 py-2.5 bg-neon-blue/90 hover:bg-neon-blue text-white rounded-lg text-sm font-medium transition-colors"
//                     >
//                       View Pending Approvals
//                     </Link>
//                   </div>
//                 </div>
//                 {listingsLoading ? (
//                   <LoadingSpinner />
//                 ) : listingsError ? (
//                   <ErrorMessage
//                     message={listingsError}
//                     onRetry={() => fetchAllListings(listingsPagination.page, listingsPagination.limit)}
//                   />
//                 ) : (
//                   <div className="overflow-x-auto custom-scrollbar">
//                     <table className="w-full min-w-[800px] text-left">
//                       <thead className="border-b border-gray-700 bg-gray-700/30">
//                         <tr>
//                           <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
//                           <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
//                           <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
//                           <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Seller</th>
//                           <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
//                           <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-700/50">
//                         {allListings.map((listing) => (
//                           <tr key={listing._id} className="hover:bg-gray-700/40 transition-colors">
//                             <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{listing.title}</td>
//                             <td className="px-5 py-4 whitespace-nowrap text-sm capitalize text-gray-300">{listing.category}</td>
//                             <td className="px-5 py-4 whitespace-nowrap text-sm text-neon-green">R {listing.price}</td>
//                             <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">
//                               {listing.seller?.name || "Unknown"}
//                             </td>
//                             <td className="px-5 py-4 whitespace-nowrap text-sm">
//                               <span
//                                 className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
//                                   listing.status === "approved"
//                                     ? "bg-green-500/20 text-green-300"
//                                     : listing.status === "pending"
//                                     ? "bg-yellow-500/20 text-yellow-300"
//                                     : listing.status === "rejected"
//                                     ? "bg-red-500/20 text-red-300"
//                                     : "bg-gray-500/20 text-gray-300"
//                                 }`}
//                               >
//                                 {listing.status}
//                               </span>
//                             </td>
//                             <td className="px-5 py-4 whitespace-nowrap text-sm text-right">
//                               <button
//                                 onClick={() => viewListingDetails(listing)}
//                                 className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
//                               >
//                                 View
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                         {allListings.length === 0 && (
//                           <tr>
//                             <td colSpan="6" className="text-center py-10 text-gray-400">
//                               No listings found.
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//                 {listingsPagination.pages > 1 && (
//                   <div className="mt-6 flex justify-between items-center">
//                     <button
//                       onClick={() => fetchAllListings(listingsPagination.page - 1, listingsPagination.limit)}
//                       disabled={listingsPagination.page === 1}
//                       className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Previous
//                     </button>
//                     <span className="text-sm text-gray-300">
//                       Page {listingsPagination.page} of {listingsPagination.pages}
//                     </span>
//                     <button
//                       onClick={() => fetchAllListings(listingsPagination.page + 1, listingsPagination.limit)}
//                       disabled={listingsPagination.page === listingsPagination.pages}
//                       className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === "RankingMain" && <RankingMainSection listings={allListings} />}
//             {activeTab === "HomepageFeatured" && <HomepageFeaturedSection listings={allListings} />}

//             {activeTab === "blogs" && (
//               <div>
//                 <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
//                   <h2 className="text-2xl font-semibold text-gray-100">Blog Management</h2>
//                   <div className="flex gap-3 items-center">
//                     <input
//                       type="text"
//                       placeholder="Search blogs by title..."
//                       value={blogSearchTerm}
//                       onChange={handleBlogSearchChange}
//                       className="bg-gray-700/70 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none w-full sm:w-72"
//                     />
//                     <button
//                       onClick={() => openBlogModal()}
//                       className="px-4 py-2.5 bg-neon-blue/90 hover:bg-neon-blue text-white rounded-lg text-sm font-medium transition-colors"
//                     >
//                       Create Blog
//                     </button>
//                   </div>
//                 </div>
//                 {blogsLoading ? (
//                   <LoadingSpinner />
//                 ) : blogsError ? (
//                   <ErrorMessage
//                     message={blogsError}
//                     onRetry={() => fetchBlogs(blogsPagination.page, blogsPagination.limit, blogSearchTerm)}
//                   />
//                 ) : (
//                   <div className="overflow-x-auto custom-scrollbar bg-gray-800/60 border border-gray-700/50 rounded-xl shadow-md">
//                     <table className="w-full min-w-[800px] text-left">
//                       <thead className="border-b border-gray-700 bg-gray-700/30">
//                         <tr>
//                           <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
//                           <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Author</th>
//                           <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
//                           <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</th>
//                           <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-700/50">
//                         {blogs.length > 0 ? (
//                           blogs.map((blog) => (
//                             <tr key={blog._id} className="hover:bg-gray-700/40 transition-colors">
//                               <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{blog.title}</td>
//                               <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">
//                                 {blog.author?.name || "Admin"}
//                               </td>
//                               <td className="px-5 py-4 whitespace-nowrap text-sm">
//                                 <span
//                                   className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
//                                     blog.status === BLOG_STATUSES.PUBLISHED
//                                       ? "bg-green-500/20 text-green-300"
//                                       : "bg-yellow-500/20 text-yellow-300"
//                                   }`}
//                                 >
//                                   {blog.status}
//                                 </span>
//                               </td>
//                               <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">
//                                 {new Date(blog.createdAt).toLocaleDateString()}
//                               </td>
//                               <td className="px-5 py-4 whitespace-nowrap text-sm text-right flex gap-2 justify-end">
//                                 <button
//                                   onClick={() => openBlogModal(blog)}
//                                   className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
//                                 >
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() => openDeleteBlogModal(blog)}
//                                   className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
//                                 >
//                                   Delete
//                                 </button>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan="5" className="text-center py-10 text-gray-400">
//                               No blogs found{blogSearchTerm && " matching your search"}.
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//                 {blogsPagination.total > 0 && blogsPagination.pages > 1 && (
//                   <div className="mt-6 flex justify-between items-center">
//                     <button
//                       onClick={() => fetchBlogs(blogsPagination.page - 1, blogsPagination.limit, blogSearchTerm)}
//                       disabled={blogsPagination.page === 1 || blogsLoading}
//                       className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Previous
//                     </button>
//                     <span className="text-sm text-gray-300">
//                       Page {blogsPagination.page} of {blogsPagination.pages} (Total: {blogsPagination.total})
//                     </span>
//                     <button
//                       onClick={() => fetchBlogs(blogsPagination.page + 1, blogsPagination.limit, blogSearchTerm)}
//                       disabled={blogsPagination.page === blogsPagination.pages || blogsLoading}
//                       className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//       {/* Block User Confirmation Modal */}
//       {showBlockModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-gray-800/90 border border-gray-700/50 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
//             <h3 className="text-lg font-semibold text-gray-100 mb-4">
//               {userToBlock?.isBlocked ? "Unblock" : "Block"} User
//             </h3>
//             <p className="text-sm text-gray-300 mb-6">
//               Are you sure you want to {userToBlock?.isBlocked ? "unblock" : "block"}{" "}
//               <span className="font-medium">{userToBlock?.name}</span>?{" "}
//               {userToBlock?.isBlocked
//                 ? "This will restore their access to the platform."
//                 : "This will restrict their access to the platform."}
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowBlockModal(false)}
//                 className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmBlockUser}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   userToBlock?.isBlocked
//                     ? "bg-green-600 hover:bg-green-500 text-white"
//                     : "bg-red-600 hover:bg-red-500 text-white"
//                 }`}
//               >
//                 {userToBlock?.isBlocked ? "Unblock" : "Block"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Verification Modal */}
//       {showVerificationModal && userToVerify && (
//         <VerificationModal
//           user={userToVerify}
//           isOpen={showVerificationModal}
//           onClose={() => setShowVerificationModal(false)}
//           onConfirm={handleToggleVerification}
//         />
//       )}

//       {/* Listing Details Modal */}
//       {showListingModal && selectedListing && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-gray-800/90 border border-gray-700/50 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-100">Listing Details</h3>
//               <button onClick={() => setShowListingModal(false)} className="text-gray-400 hover:text-gray-200">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <h4 className="text-sm font-medium text-gray-400">Title</h4>
//                 <p className="text-gray-100">{selectedListing.title}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-gray-400">Category</h4>
//                 <p className="text-gray-100 capitalize">{selectedListing.category}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-gray-400">Price</h4>
//                 <p className="text-neon-green">R {selectedListing.price}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-gray-400">Seller</h4>
//                 <p className="text-gray-100">{selectedListing.seller?.name || "Unknown"}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-gray-400">Status</h4>
//                 <span
//                   className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
//                     selectedListing.status === "approved"
//                       ? "bg-green-500/20 text-green-300"
//                       : selectedListing.status === "pending"
//                       ? "bg-yellow-500/20 text-yellow-300"
//                       : selectedListing.status === "rejected"
//                       ? "bg-red-500/20 text-red-300"
//                       : "bg-gray-500/20 text-gray-300"
//                   }`}
//                 >
//                   {selectedListing.status}
//                 </span>
//               </div>
//               {selectedListing.status === "rejected" && selectedListing.rejectionReason && (
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-400">Rejection Reason</h4>
//                   <p className="text-gray-100">{selectedListing.rejectionReason}</p>
//                 </div>
//               )}
//               <div>
//                 <h4 className="text-sm font-medium text-gray-400">Description</h4>
//                 <p className="text-gray-100">{selectedListing.description || "No description provided."}</p>
//               </div>
//               {selectedListing.image && (
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-400 mb-2">Image</h4>
//                   <img
//                     src={`${IMAGE_BASE_URL}/Uploads/${selectedListing.image}`}
//                     alt="Listing image"
//                     className="w-full h-32 object-cover rounded-lg border border-gray-700"
//                     onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
//                   />
//                 </div>
//               )}
//             </div>
//             {selectedListing.status === "pending" && (
//               <div className="mt-6 flex justify-end gap-3">
//                 <button
//                   onClick={() => handleApproveListing(selectedListing._id)}
//                   disabled={listingActionLoading === selectedListing._id}
//                   className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
//                 >
//                   {listingActionLoading === selectedListing._id ? "Approving..." : "Approve"}
//                 </button>
//                 <button
//                   onClick={() => handleRejectListing(selectedListing._id)}
//                   disabled={listingActionLoading === selectedListing._id}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
//                 >
//                   {listingActionLoading === selectedListing._id ? "Rejecting..." : "Reject"}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Blog Modal */}
//       {showBlogModal && (
//         <BlogModal
//           isOpen={showBlogModal}
//           onClose={() => setShowBlogModal(false)}
//           blog={selectedBlog}
//           onSave={handleSaveBlog}
//         />
//       )}

//       {/* Delete Blog Confirmation Modal */}
//       {showDeleteBlogModal && blogToDelete && (
//         <DeleteBlogModal
//           isOpen={showDeleteBlogModal}
//           onClose={() => setShowDeleteBlogModal(false)}
//           onConfirm={handleDeleteBlog}
//           blog={blogToDelete}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;


import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { adminService } from "../services/apiService";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import NewCustomToast from '../components/NewCustomToast';

// Placeholder for notificationService
const notificationService = {
  getNotifications: async () => ({
    success: true,
    notifications: [],
  }),
  markAsRead: async (id) => ({ success: true }),
};

// --- Constants ---
const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || "").replace("/api", "");
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
const VERIFICATION_STATUSES = {
  VERIFIED: "verified",
  PENDING: "pending",
  NOT_VERIFIED: "not_verified",
};
const BLOG_STATUSES = {
  PUBLISHED: "published",
  DRAFT: "draft",
};
const GRADIENT_PRESETS = [
     { name: 'NordVPN Blue', gradient: 'from-blue-600 via-purple-700 to-purple-800', border: 'border-purple-500/30' },
  { name: 'Spotify Green', gradient: 'from-green-600 via-emerald-700 to-teal-800', border: 'border-green-500/30' },
  { name: 'Apple TV Gray', gradient: 'from-gray-600 via-slate-700 to-zinc-800', border: 'border-gray-500/30' },
  { name: 'Amazon Prime Blue', gradient: 'from-blue-600 via-indigo-700 to-violet-800', border: 'border-blue-500/30' },
  { name: 'PlayStation Blue', gradient: 'from-blue-700 via-sky-800 to-cyan-900', border: 'border-blue-600/30' },
  { name: 'Xbox Green', gradient: 'from-green-700 via-lime-800 to-emerald-900', border: 'border-green-600/30' },
  { name: 'Apple Music Pink', gradient: 'from-pink-600 via-rose-700 to-fuchsia-800', border: 'border-pink-500/30' },
  { name: 'Amazon Music Cyan', gradient: 'from-blue-500 via-cyan-600 to-sky-700', border: 'border-blue-400/30' },
  { name: 'Sunset Glow', gradient: 'from-orange-500 via-red-600 to-pink-700', border: 'border-red-500/30' },
  { name: 'Ocean Breeze', gradient: 'from-teal-500 via-cyan-600 to-blue-700', border: 'border-teal-500/30' },
  { name: 'Forest Mist', gradient: 'from-green-600 via-lime-700 to-emerald-800', border: 'border-green-600/30' },
  { name: 'Twilight Purple', gradient: 'from-purple-600 via-indigo-700 to-violet-800', border: 'border-purple-600/30' },
  { name: 'Desert Heat', gradient: 'from-yellow-500 via-orange-600 to-red-700', border: 'border-orange-500/30' },
  { name: 'Arctic Chill', gradient: 'from-blue-500 via-cyan-600 to-teal-700', border: 'border-blue-500/30' },
  { name: 'Neon Pulse', gradient: 'from-pink-500 via-purple-600 to-blue-700', border: 'border-pink-500/30' },
  { name: 'Lava Flow', gradient: 'from-red-600 via-orange-700 to-yellow-800', border: 'border-red-600/30' },
  { name: 'Jungle Canopy', gradient: 'from-green-500 via-emerald-600 to-teal-700', border: 'border-green-500/30' },
  { name: 'Cosmic Void', gradient: 'from-indigo-600 via-purple-700 to-blue-800', border: 'border-indigo-600/30' },
  { name: 'Golden Hour', gradient: 'from-yellow-500 via-amber-600 to-orange-700', border: 'border-yellow-500/30' },
  { name: 'Berry Bliss', gradient: 'from-pink-600 via-rose-700 to-red-800', border: 'border-pink-600/30' },
  { name: 'Skyline Fade', gradient: 'from-blue-500 via-sky-600 to-cyan-700', border: 'border-blue-500/30' },
  { name: 'Emerald Wave', gradient: 'from-teal-500 via-emerald-600 to-green-700', border: 'border-teal-500/30' },
  { name: 'Ruby Spark', gradient: 'from-red-500 via-rose-600 to-pink-700', border: 'border-red-500/30' },
  { name: 'Sapphire Glow', gradient: 'from-blue-600 via-indigo-700 to-purple-800', border: 'border-blue-600/30' },
  { name: 'Citrus Burst', gradient: 'from-orange-500 via-yellow-600 to-lime-700', border: 'border-orange-500/30' },
  { name: 'Midnight Sky', gradient: 'from-blue-700 via-indigo-800 to-black', border: 'border-blue-700/30' },
  { name: 'Coral Reef', gradient: 'from-pink-500 via-orange-600 to-red-700', border: 'border-pink-500/30' },
  { name: 'Frosty Mint', gradient: 'from-teal-500 via-cyan-600 to-green-700', border: 'border-teal-500/30' },
  { name: 'Volcanic Ash', gradient: 'from-gray-600 via-slate-700 to-black', border: 'border-gray-600/30' },
  { name: 'Tropical Sunset', gradient: 'from-orange-500 via-pink-600 to-purple-700', border: 'border-orange-500/30' },
  { name: 'Aurora Green', gradient: 'from-green-500 via-teal-600 to-cyan-700', border: 'border-green-500/30' },
  { name: 'Velvet Purple', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/30' },
  { name: 'Saffron Spice', gradient: 'from-yellow-500 via-orange-600 to-red-700', border: 'border-yellow-500/30' },
  { name: 'Glacial Blue', gradient: 'from-blue-500 via-cyan-600 to-teal-700', border: 'border-blue-500/30' },
  { name: 'Cherry Blossom', gradient: 'from-pink-500 via-rose-600 to-red-700', border: 'border-pink-500/30' },
  { name: 'Starlit Night', gradient: 'from-indigo-600 via-purple-700 to-blue-800', border: 'border-indigo-600/30' },
  { name: 'Mango Tango', gradient: 'from-orange-500 via-yellow-600 to-red-700', border: 'border-orange-500/30' },
  { name: 'Deep Sea', gradient: 'from-blue-600 via-teal-700 to-green-800', border: 'border-blue-600/30' },
  { name: 'Crimson Tide', gradient: 'from-red-500 via-rose-600 to-pink-700', border: 'border-red-500/30' },
  { name: 'Polar Light', gradient: 'from-cyan-500 via-teal-600 to-blue-700', border: 'border-cyan-500/30' },
  { name: 'Dusk Amber', gradient: 'from-orange-500 via-amber-600 to-yellow-700', border: 'border-orange-500/30' },
  { name: 'Violet Dream', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/30' },
  { name: 'Lime Zest', gradient: 'from-lime-500 via-green-600 to-teal-700', border: 'border-lime-500/30' },
  { name: 'Obsidian Flame', gradient: 'from-red-600 via-black to-purple-700', border: 'border-red-600/30' },
  { name: 'Aqua Surge', gradient: 'from-teal-500 via-cyan-600 to-blue-700', border: 'border-teal-500/30' },
  { name: 'Rose Quartz', gradient: 'from-pink-500 via-rose-600 to-red-700', border: 'border-pink-500/30' },
  { name: 'Indigo Haze', gradient: 'from-indigo-500 via-purple-600 to-blue-700', border: 'border-indigo-500/30' },
  { name: 'Sunkissed Gold', gradient: 'from-yellow-500 via-orange-600 to-amber-700', border: 'border-yellow-500/30' },
  { name: 'Emerald Dusk', gradient: 'from-green-500 via-emerald-600 to-teal-700', border: 'border-green-500/30' },
  { name: 'Ruby Dawn', gradient: 'from-red-500 via-pink-600 to-rose-700', border: 'border-red-500/30' },   { name: 'Netflix Crimson', gradient: 'from-red-600 via-rose-700 to-red-800', border: 'border-red-600/30' },
  { name: 'Hulu Verdant', gradient: 'from-emerald-500 via-green-600 to-teal-700', border: 'border-emerald-500/30' },
  { name: 'Disney Sapphire', gradient: 'from-blue-500 via-indigo-600 to-blue-700', border: 'border-blue-500/30' },
  { name: 'YouTube Scarlet', gradient: 'from-red-500 via-red-600 to-rose-700', border: 'border-red-500/30' },
  { name: 'Twitch Amethyst', gradient: 'from-purple-500 via-purple-600 to-violet-700', border: 'border-purple-500/30' },
  { name: 'HBO Violet', gradient: 'from-violet-500 via-purple-600 to-indigo-700', border: 'border-violet-500/30' },
  { name: 'Paramount Sky', gradient: 'from-sky-500 via-blue-600 to-cyan-700', border: 'border-sky-500/30' },
  { name: 'Peacock Aqua', gradient: 'from-teal-500 via-cyan-600 to-teal-700', border: 'border-teal-500/30' },
  { name: 'Starz Onyx', gradient: 'from-gray-700 via-black to-gray-800', border: 'border-gray-700/30' },
  { name: 'Showtime Ruby', gradient: 'from-red-600 via-rose-700 to-pink-800', border: 'border-red-600/30' },
  { name: 'Apple Cherry', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/30' },
  { name: 'Google Azure', gradient: 'from-blue-500 via-blue-600 to-sky-700', border: 'border-blue-500/30' },
  { name: 'Microsoft Cobalt', gradient: 'from-blue-600 via-sky-700 to-cyan-800', border: 'border-blue-600/30' },
  { name: 'Adobe Vermilion', gradient: 'from-red-600 via-red-700 to-rose-800', border: 'border-red-600/30' },
  { name: 'Slack Lavender', gradient: 'from-purple-500 via-violet-600 to-purple-700', border: 'border-purple-500/30' },
  { name: 'Zoom Ocean', gradient: 'from-blue-500 via-sky-600 to-blue-700', border: 'border-blue-500/30' },
  { name: 'Dropbox Navy', gradient: 'from-blue-500 via-blue-600 to-indigo-700', border: 'border-blue-500/30' },
  { name: 'Trello Marine', gradient: 'from-blue-600 via-sky-700 to-blue-800', border: 'border-blue-600/30' },
  { name: 'Asana Coral', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/30' },
  { name: 'Notion Slate', gradient: 'from-gray-500 via-gray-600 to-slate-700', border: 'border-gray-500/30' },
  { name: 'Canva Jade', gradient: 'from-green-500 via-teal-600 to-green-700', border: 'border-green-500/30' },
  { name: 'Figma Indigo', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/30' },
  { name: 'Miro Cyan', gradient: 'from-blue-500 via-cyan-600 to-sky-700', border: 'border-blue-500/30' },
  { name: 'Airbnb Blush', gradient: 'from-pink-500 via-rose-600 to-pink-700', border: 'border-pink-500/30' },
  { name: 'Uber Ebony', gradient: 'from-gray-700 via-black to-gray-800', border: 'border-gray-700/30' },
  { name: 'Lyft Fuchsia', gradient: 'from-pink-500 via-fuchsia-600 to-pink-700', border: 'border-pink-500/30' },
  { name: 'DoorDash Flame', gradient: 'from-red-500 via-red-600 to-rose-700', border: 'border-red-500/30' },
  { name: 'Instacart Forest', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/30' },
  { name: 'Grubhub Amber', gradient: 'from-orange-500 via-orange-600 to-amber-700', border: 'border-orange-500/30' },
  { name: 'Postmates Shadow', gradient: 'from-gray-700 via-black to-slate-800', border: 'border-gray-700/30' },
  { name: 'Shopify Lime', gradient: 'from-green-500 via-lime-600 to-green-700', border: 'border-green-500/30' },
  { name: 'Stripe Indigo', gradient: 'from-blue-500 via-indigo-600 to-blue-700', border: 'border-blue-500/30' },
  { name: 'PayPal Sky', gradient: 'from-blue-600 via-sky-700 to-blue-800', border: 'border-blue-600/30' },
  { name: 'Square Teal', gradient: 'from-green-500 via-emerald-600 to-teal-700', border: 'border-green-500/30' },
  { name: 'Venmo Ocean', gradient: 'from-blue-500 via-cyan-600 to-blue-700', border: 'border-blue-500/30' },
  { name: 'Etsy Tangerine', gradient: 'from-orange-500 via-amber-600 to-yellow-700', border: 'border-orange-500/30' },
  { name: 'eBay Crimson', gradient: 'from-red-500 via-red-600 to-rose-700', border: 'border-red-500/30' },
  { name: 'Amazon Sunflower', gradient: 'from-yellow-500 via-amber-600 to-yellow-700', border: 'border-yellow-500/30' },
  { name: 'Walmart Cobalt', gradient: 'from-blue-500 via-blue-600 to-sky-700', border: 'border-blue-500/30' },
  { name: 'Target Scarlet', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/30' },
  { name: 'Crimson Ember', gradient: 'from-red-500 via-red-600 to-orange-700', border: 'border-red-500/30' },
  { name: 'Azure Mist', gradient: 'from-blue-500 via-cyan-600 to-blue-700', border: 'border-blue-500/30' },
  { name: 'Jade Grove', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/30' },
  { name: 'Amethyst Glow', gradient: 'from-purple-500 via-violet-600 to-purple-700', border: 'border-purple-500/30' },
  { name: 'Topaz Shine', gradient: 'from-yellow-500 via-amber-600 to-orange-700', border: 'border-yellow-500/30' },
  { name: 'Opal Gleam', gradient: 'from-pink-500 via-rose-600 to-pink-700', border: 'border-pink-500/30' },
  { name: 'Onyx Abyss', gradient: 'from-gray-700 via-black to-gray-800', border: 'border-gray-700/30' },
  { name: 'Quartz Sparkle', gradient: 'from-red-500 via-pink-600 to-rose-700', border: 'border-red-500/30' },
  { name: 'Sapphire Tide', gradient: 'from-blue-500 via-teal-600 to-blue-700', border: 'border-blue-500/50' },
  { name: 'Emerald Crest', gradient: 'from-green-500 via-lime-600 to-green-700', border: 'border-green-500/50' },
  { name: 'Violet Mist', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/50' },
  { name: 'Amber Dusk', gradient: 'from-orange-500 via-amber-600 to-yellow-700', border: 'border-orange-500/50' },
  { name: 'Rose Bloom', gradient: 'from-pink-500 via-fuchsia-600 to-pink-700', border: 'border-pink-500/50' },
  { name: 'Slate Tempest', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/50' },
  { name: 'Coral Dawn', gradient: 'from-red-500 via-orange-600 to-pink-700', border: 'border-red-500/50' },
  { name: 'Cyan Surge', gradient: 'from-cyan-500 via-teal-600 to-cyan-700', border: 'border-cyan-500/50' },
  { name: 'Lime Flash', gradient: 'from-lime-500 via-green-600 to-lime-700', border: 'border-lime-500/50' },
  { name: 'Indigo Veil', gradient: 'from-indigo-500 via-purple-600 to-indigo-700', border: 'border-indigo-500/50' },
  { name: 'Gold Radiance', gradient: 'from-yellow-500 via-orange-600 to-amber-700', border: 'border-yellow-500/50' },
  { name: 'Fuchsia Spark', gradient: 'from-pink-500 via-fuchsia-600 to-rose-700', border: 'border-pink-500/50' },
  { name: 'Obsidian Veil', gradient: 'from-gray-700 via-black to-slate-800', border: 'border-gray-700/50' },
  { name: 'Ruby Flame', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/50' },
  { name: 'Sky Crest', gradient: 'from-blue-500 via-sky-600 to-blue-700', border: 'border-blue-500/50' },
  { name: 'Teal Haven', gradient: 'from-teal-500 via-cyan-600 to-teal-700', border: 'border-teal-500/50' },
  { name: 'Violet Shade', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/50' },
  { name: 'Orange Blaze', gradient: 'from-orange-500 via-amber-600 to-orange-700', border: 'border-orange-500/50' },
  { name: 'Pink Petal', gradient: 'from-pink-500 via-rose-600 to-pink-700', border: 'border-pink-500/50' },
  { name: 'Gray Veil', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/50' },
  { name: 'Red Crest', gradient: 'from-red-500 via-red-600 to-rose-700', border: 'border-red-500/50' },
  { name: 'Blue Tide', gradient: 'from-blue-500 via-cyan-600 to-blue-700', border: 'border-blue-500/50' },
  { name: 'Green Crest', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/50' },
  { name: 'Purple Crest', gradient: 'from-purple-500 via-violet-600 to-purple-700', border: 'border-purple-500/50' },
  { name: 'Yellow Crest', gradient: 'from-yellow-500 via-amber-600 to-yellow-700', border: 'border-yellow-500/50' },
  { name: 'Rose Crest', gradient: 'from-pink-500 via-fuchsia-600 to-rose-700', border: 'border-pink-500/50' },
  { name: 'Slate Crest', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/50' },
  { name: 'Crimson Tide', gradient: 'from-red-500 via-orange-600 to-red-700', border: 'border-red-500/50' },
  { name: 'Cyan Crest', gradient: 'from-cyan-500 via-teal-600 to-cyan-700', border: 'border-cyan-500/50' },
  { name: 'Lime Crest', gradient: 'from-lime-500 via-green-600 to-lime-700', border: 'border-lime-500/50' },
  { name: 'Indigo Crest', gradient: 'from-indigo-500 via-purple-600 to-indigo-700', border: 'border-indigo-500/50' },
  { name: 'Amber Crest', gradient: 'from-orange-500 via-amber-600 to-yellow-700', border: 'border-orange-500/50' },
  { name: 'Fuchsia Crest', gradient: 'from-pink-500 via-fuchsia-600 to-pink-700', border: 'border-pink-500/50' },
  { name: 'Black Crest', gradient: 'from-gray-700 via-black to-gray-800', border: 'border-gray-700/50' },
  { name: 'Scarlet Crest', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/50' },
  { name: 'Ocean Crest', gradient: 'from-blue-500 via-teal-600 to-blue-700', border: 'border-blue-500/50' },
  { name: 'Forest Crest', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/50' },
  { name: 'Violet Crest', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/50' },
  { name: 'Golden Crest', gradient: 'from-yellow-500 via-amber-600 to-orange-700', border: 'border-yellow-500/50' },
  { name: 'Pink Crest', gradient: 'from-pink-500 via-rose-600 to-pink-700', border: 'border-pink-500/50' },
  { name: 'Gray Crest', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/50' },
  { name: 'Red Spark', gradient: 'from-red-500 via-red-600 to-rose-700', border: 'border-red-500/40' },
  { name: 'Blue Spark', gradient: 'from-blue-500 via-cyan-600 to-blue-700', border: 'border-blue-500/40' },
  { name: 'Green Spark', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/40' },
  { name: 'Purple Spark', gradient: 'from-purple-500 via-violet-600 to-purple-700', border: 'border-purple-500/40' },
  { name: 'Yellow Spark', gradient: 'from-yellow-500 via-amber-600 to-yellow-700', border: 'border-yellow-500/40' },
  { name: 'Rose Spark', gradient: 'from-pink-500 via-fuchsia-600 to-rose-700', border: 'border-pink-500/40' },
  { name: 'Slate Spark', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/40' },
  { name: 'Crimson Spark', gradient: 'from-red-500 via-orange-600 to-red-700', border: 'border-red-500/40' },
  { name: 'Cyan Spark', gradient: 'from-cyan-500 via-teal-600 to-cyan-700', border: 'border-cyan-500/40' },
  { name: 'Lime Spark', gradient: 'from-lime-500 via-green-600 to-lime-700', border: 'border-lime-500/40' },
  { name: 'Indigo Spark', gradient: 'from-indigo-500 via-purple-600 to-indigo-700', border: 'border-indigo-500/40' },
  { name: 'Amber Spark', gradient: 'from-orange-500 via-amber-600 to-yellow-700', border: 'border-orange-500/40' },
  { name: 'Fuchsia Spark', gradient: 'from-pink-500 via-fuchsia-600 to-pink-700', border: 'border-pink-500/40' },
  { name: 'Black Spark', gradient: 'from-gray-700 via-black to-gray-800', border: 'border-gray-700/40' },
  { name: 'Scarlet Spark', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/40' },
  { name: 'Ocean Spark', gradient: 'from-blue-500 via-teal-600 to-blue-700', border: 'border-blue-500/40' },
  { name: 'Forest Spark', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/40' },
  { name: 'Violet Spark', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/40' },
  { name: 'Golden Spark', gradient: 'from-yellow-500 via-amber-600 to-orange-700', border: 'border-yellow-500/40' },
  { name: 'Pink Spark', gradient: 'from-pink-500 via-rose-600 to-pink-700', border: 'border-pink-500/40' },
  { name: 'Gray Spark', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/40' },
  { name: 'Red Glow', gradient: 'from-red-500 via-red-600 to-rose-700', border: 'border-red-500/40' },
  { name: 'Blue Glow', gradient: 'from-blue-500 via-cyan-600 to-blue-700', border: 'border-blue-500/40' },
  { name: 'Green Glow', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/40' },
  { name: 'Purple Glow', gradient: 'from-purple-500 via-violet-600 to-purple-700', border: 'border-purple-500/40' },
  { name: 'Yellow Glow', gradient: 'from-yellow-500 via-amber-600 to-yellow-700', border: 'border-yellow-500/40' },
  { name: 'Rose Glow', gradient: 'from-pink-500 via-fuchsia-600 to-rose-700', border: 'border-pink-500/40' },
  { name: 'Slate Glow', gradient: 'from-gray-600 via-slate-700 to-gray-800', border: 'border-gray-600/40' },
  { name: 'Crimson Glow', gradient: 'from-red-500 via-orange-600 to-red-700', border: 'border-red-500/40' },
  { name: 'Cyan Glow', gradient: 'from-cyan-500 via-teal-600 to-cyan-700', border: 'border-cyan-500/40' },
  { name: 'Lime Glow', gradient: 'from-lime-500 via-green-600 to-lime-700', border: 'border-lime-500/40' },
  { name: 'Indigo Glow', gradient: 'from-indigo-500 via-purple-600 to-indigo-700', border: 'border-indigo-500/40' },
  { name: 'Amber Glow', gradient: 'from-orange-500 via-amber-600 to-yellow-700', border: 'border-orange-500/40' },
  { name: 'Fuchsia Glow', gradient: 'from-pink-500 via-fuchsia-600 to-pink-700', border: 'border-pink-500/40' },
  { name: 'Black Glow', gradient: 'from-gray-700 via-black to-gray-800', border: 'border-gray-700/40' },
  { name: 'Scarlet Glow', gradient: 'from-red-500 via-rose-600 to-red-700', border: 'border-red-500/40' },
  { name: 'Ocean Glow', gradient: 'from-blue-500 via-teal-600 to-blue-700', border: 'border-blue-500/40' },
  { name: 'Forest Glow', gradient: 'from-green-500 via-emerald-600 to-green-700', border: 'border-green-500/40' },
  { name: 'Violet Glow', gradient: 'from-purple-500 via-violet-600 to-indigo-700', border: 'border-purple-500/40' },
  { name: 'Golden Glow', gradient: 'from-yellow-500 via-amber-600 to-orange-700', border: 'border-yellow-500/40' },
];


// --- Icons ---
const BellIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const ListingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2 group-hover:text-neon-purple transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2 group-hover:text-neon-purple transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7"
    />
  </svg>
);

const NotificationsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2 group-hover:text-neon-purple transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

// --- Animated Background Component ---
const AnimatedGradientBackground = () => {
  useEffect(() => {
    const particlesContainer = document.getElementById("particles-container");
    if (!particlesContainer) return;

    const particleCount = 40;
    particlesContainer.innerHTML = "";

    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className = "particle";
      const size = Math.random() * 2.5 + 0.5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      resetParticle(particle);
      particlesContainer.appendChild(particle);
      animateParticle(particle);
    };

    const resetParticle = (particle) => {
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.opacity = "0";
      particle.style.transform = "scale(0.5)";
      return { x: posX, y: posY };
    };

    const animateParticle = (particle) => {
      const duration = Math.random() * 18 + 12;
      const delay = Math.random() * 12;
      setTimeout(() => {
        if (!particlesContainer.contains(particle)) return;
        particle.style.transition = `all ${duration}s linear`;
        particle.style.opacity = (Math.random() * 0.2 + 0.03).toString();
        particle.style.transform = "scale(1)";
        const moveX = Number.parseFloat(particle.style.left) + (Math.random() * 40 - 20);
        const moveY = Number.parseFloat(particle.style.top) - (Math.random() * 50 + 15);
        particle.style.left = `${moveX}%`;
        particle.style.top = `${moveY}%`;
        setTimeout(() => {
          if (particlesContainer.contains(particle)) {
            animateParticle(particle);
          }
        }, duration * 1000);
      }, delay * 1000);
    };

    for (let i = 0; i < particleCount; i++) createParticle();

    const spheres = document.querySelectorAll(".gradient-sphere");
    let animationFrameId;

    const handleMouseMove = (e) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 15;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 15;
        spheres.forEach((sphere) => {
          sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      particlesContainer.innerHTML = "";
    };
  }, []);

  return (
    <div className="gradient-background">
      <div className="gradient-sphere sphere-1"></div>
      <div className="gradient-sphere sphere-2"></div>
      <div className="gradient-sphere sphere-3"></div>
      <div className="glow"></div>
      <div className="grid-overlay"></div>
      <div className="noise-overlay"></div>
      <div className="particles-container" id="particles-container"></div>
    </div>
  );
};

// --- UI Components ---
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-neon-blue"></div>
    <p className="mt-4 text-lg text-gray-300">Loading Data...</p>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-800/30 border border-red-700/50 text-red-200 p-6 rounded-xl text-center my-8 shadow-xl max-w-lg mx-auto">
    <div className="flex flex-col items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 text-red-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p className="font-semibold text-xl mb-2">An Error Occurred</p>
      <span className="text-md">{message || "An error occurred."}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 px-5 py-2.5 bg-red-500/40 text-red-100 rounded-lg hover:bg-red-500/50 transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

// --- Blog Modal for Create/Edit ---
const BlogModal = ({ isOpen, onClose, blog, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: EditorState.createEmpty(),
    status: BLOG_STATUSES.DRAFT,
    tags: [],
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (blog) {
      const blocksFromHtml = htmlToDraft(blog.content || "");
      const contentState = ContentState.createFromBlockArray(
        blocksFromHtml.contentBlocks,
        blocksFromHtml.entityMap
      );
      setFormData({
        title: blog.title || "",
        content: EditorState.createWithContent(contentState),
        status: blog.status || BLOG_STATUSES.DRAFT,
        tags: blog.tags || [],
      });
      if (blog.image) {
        setImagePreview(`${IMAGE_BASE_URL}${blog.image}`);
      }
    } else {
      setFormData({
        title: "",
        content: EditorState.createEmpty(),
        status: BLOG_STATUSES.DRAFT,
        tags: [],
      });
      setImage(null);
      setImagePreview(null);
    }
  }, [blog]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleContentChange = (editorState) => {
    setFormData((prev) => ({ ...prev, content: editorState }));
    setErrors((prev) => ({ ...prev, content: null }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    const contentText = formData.content.getCurrentContent().getPlainText();
    if (!contentText.trim()) newErrors.content = "Content is required";
    if (!image && !blog?.image) newErrors.image = "Image is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append(
        "content",
        draftToHtml(convertToRaw(formData.content.getCurrentContent()))
      );
      data.append("status", formData.status);
      data.append("tags", JSON.stringify(formData.tags));
      if (image) data.append("image", image);

      await onSave(blog?._id, data);
      setFormData({
        title: "",
        content: EditorState.createEmpty(),
        status: BLOG_STATUSES.DRAFT,
        tags: [],
      });
      setImage(null);
      setImagePreview(null);
      onClose();
      toast.success(blog ? "Blog updated successfully" : "Blog created successfully");
    } catch (err) {
      toast.error(err.message || "Failed to save blog");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/20 rounded-2xl w-full h-full shadow-2xl glassmorphic overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-700/20">
          <h3 className="text-2xl font-semibold text-gray-100">
            {blog ? "Edit Blog" : "Create Blog"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                className={`w-full bg-gray-700/20 backdrop-blur-sm border ${
                  errors.title ? "border-red-500" : "border-gray-600/50"
                } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue outline-none transition-all glassmorphic-input text-lg`}
                name="title"
                placeholder="Enter blog title"
                value={formData.title}
                onChange={handleInputChange}
                aria-label="Blog title"
              />
              {errors.title && <p className="text-red-400 text-xs mt-2">{errors.title}</p>}
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-300 mb-2">Image (Required)</label>
              <div className="input-group flex items-center gap-4">
                <span className="input-group-btn">
                  <span className="btn btn-file bg-neon-blue/90 hover:bg-neon-blue text-white rounded-lg px-6 py-3 font-medium transition-all shadow-md hover:shadow-lg glassmorphic-button">
                    Browse
                    <input
                      type="file"
                      name="bimgs"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageChange}
                      aria-label="Upload blog image"
                    />
                  </span>
                </span>
                <input
                  type="text"
                  className="flex-1 bg-gray-700/20 backdrop-blur-sm border border-gray-600/50 rounded-lg px-4 py-3 text-white text-lg"
                  readOnly
                  value={image ? image.name : blog?.image ? blog.image.split("/").pop() : ""}
                  aria-label="Selected image name"
                />
              </div>
              {errors.image && <p className="text-red-400 text-xs mt-2">{errors.image}</p>}
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Blog image"
                    className="w-full max-h-80 object-contain rounded-lg border border-gray-700/50"
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
              <input
                type="text"
                className="w-full bg-gray-700/20 backdrop-blur-sm border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue outline-none transition-all glassmorphic-input text-lg"
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleAddTag}
                aria-label="Blog tags"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-gray-600/50 backdrop-blur-sm text-white text-sm rounded-full border border-gray-700/50 shadow-sm transition-all hover:bg-gray-600/70"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-2 text-red-400 hover:text-red-300"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Remove tag ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-gray-700/20 backdrop-blur-sm border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue outline-none transition-all glassmorphic-input text-lg"
                aria-label="Blog status"
              >
                <option value={BLOG_STATUSES.DRAFT}>Draft</option>
                <option value={BLOG_STATUSES.PUBLISHED}>Published</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-medium text-gray-100">Editor</span>
                <button
                  type="button"
                  className="text-neon-blue hover:text-neon-blue/80 text-sm font-medium transition-colors"
                  onClick={() => setShowPreview(!showPreview)}
                  aria-label={showPreview ? "Show editor" : "Show preview"}
                >
                  {showPreview ? "Edit" : "Preview"}
                </button>
              </div>
              {showPreview ? (
                <div
                  className="bg-gray-700/20 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6 text-white prose prose-invert max-w-none min-h-[400px] overflow-y-auto glassmorphic"
                  dangerouslySetInnerHTML={{
                    __html: draftToHtml(convertToRaw(formData.content.getCurrentContent())),
                  }}
                />
              ) : (
                <div className="relative">
                  <Editor
                    editorState={formData.content}
                    onEditorStateChange={handleContentChange}
                    wrapperClassName="bg-gray-700/20 backdrop-blur-sm rounded-lg border border-gray-600/50 glassmorphic"
                    editorClassName="text-white px-6 py-4 min-h-[400px] text-lg"
                    toolbarClassName="bg-gray-800/30 backdrop-blur-sm border-b border-gray-600/50 sticky top-0 z-10"
                    toolbar={{
                      options: ["inline", "blockType", "list", "link", "history"],
                      inline: { options: ["bold", "italic", "underline", "strikethrough"] },
                      blockType: { options: ["Normal", "H1", "H2", "H3"] },
                      list: { options: ["ordered", "unordered"] },
                    }}
                    aria-label="Blog content editor"
                  />
                </div>
              )}
              {errors.content && <p className="text-red-400 text-xs mt-2">{errors.content}</p>}
            </div>
          </div>
          <div className="mt-8 flex gap-4 justify-end sticky bottom-0 bg-gray-800/30 backdrop-blur-lg p-4 border-t border-gray-700/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-600/50 backdrop-blur-sm text-gray-200 rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg hover:bg-gray-600/70 glassmorphic-button"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-neon-blue/90 text-white rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg hover:bg-neon-blue disabled:opacity-50 glassmorphic-button"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : blog ? "Update" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Delete Blog Confirmation Modal ---
const DeleteBlogModal = ({ isOpen, onClose, onConfirm, blog }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(blog._id);
      onClose();
    } catch (err) {
      toast.error("Failed to delete blog");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 border border-gray-700/50 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Delete Blog</h3>
        <p className="text-sm text-gray-300 mb-6">
          Are you sure you want to delete the blog <span className="font-medium">"{blog.title}"</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Dashboard Chart Component ---
const DashboardChart = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[350px] w-full bg-gray-800/50 rounded-md">
        <p className="text-gray-400">Loading chart...</p>
      </div>
    );
  }

  const data = [
    { name: "Jan", total: 45000 },
    { name: "Feb", total: 63500 },
    { name: "Mar", total: 58200 },
    { name: "Apr", total: 72800 },
    { name: "May", total: 85600 },
    { name: "Jun", total: 92400 },
    { name: "Jul", total: 105200 },
    { name: "Aug", total: 91000 },
    { name: "Sep", total: 97500 },
    { name: "Oct", total: 110800 },
    { name: "Nov", total: 142500 },
    { name: "Dec", total: 168000 },
  ];

  return (
    <div className="h-[350px] w-full">
      <div className="text-center text-gray-400">
        <div className="h-full w-full flex items-center justify-center">
          <div className="space-y-4 w-full">
            <div className="flex items-end w-full h-[300px] gap-2">
              {data.map((item, index) => (
                <div key={index} className="relative flex-1 group">
                  <div
                    className="absolute bottom-0 w-full bg-neon-blue/70 hover:bg-neon-blue transition-all duration-200 rounded-t-sm"
                    style={{ height: `${(item.total / 168000) * 100}%` }}
                  ></div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    R {item.total.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              {data.map((item, index) => (
                <div key={index} className="flex-1 text-center">
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Recent Transactions Component ---
const RecentTransactions = ({ transactions }) => {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center p-3 bg-gray-700/30 rounded-lg">
          <div className="h-9 w-9 rounded-full flex items-center justify-center border border-gray-600 bg-gray-800">
            {transaction.type === "credit" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
          </div>
          <div className="ml-4 space-y-1 flex-1">
            <p className="text-sm font-medium leading-none text-gray-100">{transaction.name}</p>
            <p className="text-xs text-gray-400">{transaction.date}</p>
          </div>
          <div className={`font-medium ${transaction.type === "credit" ? "text-green-400" : "text-red-400"}`}>
            {transaction.type === "credit" ? "+" : "-"}R {transaction.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Verification Modal ---
const VerificationModal = ({ user, isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(user._id, reason);
      setReason("");
      onClose();
    } catch (err) {
      toast.error("Failed to update verification status.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 border border-gray-700/50 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          {user.verificationStatus === VERIFICATION_STATUSES.VERIFIED ? "Revoke Verification" : "Grant Verification"}
        </h3>
        <p className="text-sm text-gray-300 mb-4">
          {user.verificationStatus === VERIFICATION_STATUSES.VERIFIED
            ? `Are you sure you want to revoke the verification status for ${user.name}?`
            : `Are you sure you want to grant a blue tick verification to ${user.name}?`}
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none"
            placeholder="Enter reason for this action..."
            rows="4"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              user.verificationStatus === VERIFICATION_STATUSES.VERIFIED
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            } disabled:opacity-50`}
          >
            {isLoading ? "Processing..." : user.verificationStatus === VERIFICATION_STATUSES.VERIFIED ? "Revoke" : "Grant"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Featured Subscription Modal ---
const FeaturedSubscriptionModal = ({ isOpen, onClose, onSave, approvedListings = [], homepageFeaturedSubscriptions = [], listing, isHomepageFeatured = true }) => {
  const [formData, setFormData] = useState({
    listingId: '',
    rank: '',
    gradient: 'from-blue-600 via-purple-700 to-purple-800',
    border: 'border-purple-500/30',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (listing) {
      setFormData({
        listingId: listing._id || '',
        rank: listing.homepageFeaturedConfig?.rank || '',
        gradient: listing.homepageFeaturedConfig?.gradient || 'from-blue-600 via-purple-700 to-purple-800',
        border: listing.homepageFeaturedConfig?.border || 'border-purple-500/30',
      });
    }
  }, [listing]);

  const handleSelectListing = (listingId) => {
    console.log("[FeaturedSubscriptionModal] Selected listingId:", listingId);
    if (!listingId || listingId.length !== 24) {
      console.error("[FeaturedSubscriptionModal] Invalid listingId:", listingId);
      setErrors((prev) => ({ ...prev, listingId: "Please select a valid listing" }));
      return;
    }
    setFormData((prev) => ({ ...prev, listingId }));
    setErrors((prev) => ({ ...prev, listingId: null }));
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleGradientSelect = (gradient, border) => {
    console.log("[FeaturedSubscriptionModal] Selected gradient:", { gradient, border });
    setFormData((prev) => ({ ...prev, gradient, border }));
    setErrors((prev) => ({ ...prev, gradient: null, border: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.listingId || formData.listingId.length !== 24) {
      newErrors.listingId = "Listing ID is required";
    }
    if (!formData.rank || isNaN(formData.rank) || parseInt(formData.rank) < 1) {
      newErrors.rank = "Rank is required and must be at least 1";
    }
    if (!formData.gradient) {
      newErrors.gradient = "Gradient is required";
    }
    if (!formData.border) {
      newErrors.border = "Border is required";
    }
    console.log("[FeaturedSubscriptionModal] Validation errors:", newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[FeaturedSubscriptionModal] Submitting formData:", formData);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.error("[FeaturedSubscriptionModal] Validation errors:", validationErrors);
      setErrors(validationErrors);
      toast.error("Please correct the errors before submitting");
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("listingId", formData.listingId);
      data.append("rank", formData.rank);
      data.append("gradient", formData.gradient);
      data.append("border", formData.border);

      console.log("[FeaturedSubscriptionModal] FormData entries:", Object.fromEntries(data));
      await onSave(listing?._id, data);
      setFormData({
        listingId: '',
        rank: '',
        gradient: 'from-blue-600 via-purple-700 to-purple-800',
        border: 'border-purple-500/30',
      });
      onClose();
      toast.success(listing ? "Subscription updated" : "Subscription added");
    } catch (err) {
      console.error("[FeaturedSubscriptionModal] Error saving subscription:", err);
      toast.error(err.message || "Failed to save subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const availableListings = approvedListings.filter((item) =>
    !homepageFeaturedSubscriptions.some((featured) =>
      featured._id === item._id && (!listing || listing._id !== item._id)
    )
  );

  return (
    <div className={`modal ${isOpen ? 'block' : 'hidden'} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl text-white mb-4">
          {listing ? 'Edit Homepage Featured Subscription' : 'Add Homepage Featured Subscription'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-1">Listing</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-gray-700 text-white p-2 rounded text-left flex items-center justify-between"
              >
                <span>
                  {formData.listingId ? availableListings.find(l => l._id === formData.listingId)?.title || approvedListings.find(l => l._id === formData.listingId)?.title || 'Select a listing' : 'Select a listing'}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-50 bg-gray-700 rounded mt-1 w-full max-h-64 overflow-y-auto shadow-lg">
                  {Array.isArray(availableListings) && availableListings.length > 0 ? (
                    <>
                      {availableListings.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => handleSelectListing(item._id)}
                          className="p-2 hover:bg-gray-600 cursor-pointer text-white flex items-center gap-2"
                        >
                          {item.image && (
                            <img
                              src={`${IMAGE_BASE_URL}/Uploads/${item.image}`}
                              alt={item.title}
                              className="w-8 h-8 object-cover rounded"
                              onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
                            />
                          )}
                          <div>
                            <div className="text-sm">{item.title}</div>
                            <div className="text-xs text-gray-400">{item.sellerId?.name || 'Unknown'}</div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="p-2 text-white">No available listings</div>
                  )}
                </div>
              )}
            </div>
            {errors.listingId && <p className="text-red-400 text-sm mt-1">{errors.listingId}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Rank</label>
            <input
              type="number"
              name="rank"
              value={formData.rank}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white p-2 rounded"
              min="1"
              required
            />
            {errors.rank && <p className="text-red-400 text-sm mt-1">{errors.rank}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Gradient & Border Presets</label>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-700/50 rounded">
              {GRADIENT_PRESETS.map((preset) => (
                <div key={preset.name} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGradientSelect(preset.gradient, preset.border)}
                    className={`flex-1 p-2 rounded text-left text-sm text-white border ${formData.gradient === preset.gradient ? 'border-purple-500' : 'border-gray-600'}`}
                    style={{ background: `linear-gradient(to right, ${preset.gradient.replace(/from-|via-|to-/g, '')})` }}
                  >
                    {preset.name}
                  </button>
                  <div
                    className={`w-12 h-16 rounded border-2 ${preset.border} bg-gradient-to-br ${preset.gradient} flex flex-col justify-between p-1`}
                  >
                    <div className="flex justify-end gap-1">
                      <div className="w-1 h-1 rounded-full bg-white/50"></div>
                      <div className="w-1 h-1 rounded-full bg-white/30"></div>
                    </div>
                    <div className="bg-white/10 rounded text-xs text-center text-white">Card</div>
                  </div>
                </div>
              ))}
            </div>
            {errors.gradient && <p className="text-red-400 text-sm mt-1">{errors.gradient}</p>}
            {errors.border && <p className="text-red-400 text-sm mt-1">{errors.border}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Delete Featured Subscription Modal ---
const DeleteFeaturedSubscriptionModal = ({ isOpen, onClose, listing, onConfirm, isHomepageFeatured }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(listing._id);
      onClose();
    } catch (err) {
      toast.error(`Failed to remove ${isHomepageFeatured ? "homepage featured" : "ranked"} subscription`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 border border-gray-700/50 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Remove {isHomepageFeatured ? "Homepage Featured" : "Ranked"} Subscription
        </h3>
        <p className="text-sm text-gray-300 mb-6">
          Are you sure you want to remove <span className="font-medium">"{listing.title}"</span> from {isHomepageFeatured ? "homepage featured" : "ranked"} subscriptions?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Ranked Modal ---
const MainRankedModal = ({ isOpen, onClose, onSave, approvedListings = [], homepageFeaturedSubscriptions = [], listing }) => {
  const [formData, setFormData] = useState({
    listingId: '',
    mainRank: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (listing) {
      setFormData({
        listingId: listing._id || '',
        mainRank: listing.mainRank || '',
      });
    } else {
      setFormData({
        listingId: '',
        mainRank: '',
      });
    }
  }, [listing]);

  const handleSelectListing = (listingId) => {
    console.log("[MainRankedModal] Selected listingId:", listingId);
    if (!listingId || listingId.length !== 24) {
      console.error("[MainRankedModal] Invalid listingId:", listingId);
      setErrors((prev) => ({ ...prev, listingId: "Please select a valid listing" }));
      return;
    }
    setFormData((prev) => ({ ...prev, listingId }));
    setErrors((prev) => ({ ...prev, listingId: null }));
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.listingId || formData.listingId.length !== 24) {
      newErrors.listingId = "Listing ID is required.";
    }
    if (!formData.mainRank || isNaN(formData.mainRank) || parseInt(formData.mainRank) < 1) {
      newErrors.mainRank = "Rank must be a positive integer.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[MainRankedModal] Submitting formData:", formData);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.error("[MainRankedModal] Validation errors:", validationErrors);
      setErrors(validationErrors);
      toast.error("Please correct the errors before submitting");
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("listingId", formData.listingId);
      data.append("mainRank", formData.mainRank);

      console.log("[MainRankedModal] FormData entries:", Object.fromEntries(data));
      await onSave(listing?._id, data);
      setFormData({
        listingId: '',
        mainRank: '',
      });
      onClose();
      toast.success(listing ? 'Rank updated successfully' : 'Rank added successfully');
    } catch (err) {
      console.error("[MainRankedModal] Error saving rank:", err);
      toast.error(err.message || "Failed to save rank");
    } finally {
      setIsLoading(false);
    }
  };

  const availableListings = approvedListings.filter((item) =>
    !approvedListings.some((other) =>
      other._id === item._id && other.mainRank != null && (!listing || listing._id !== item._id)
    )
  );

  return (
    <div className={`modal ${isOpen ? 'block' : 'hidden'} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl text-white mb-4">
          {listing ? 'Edit Main Rank' : 'Add Main Rank'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-1">Listing</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-gray-700 text-white p-2 rounded text-left flex items-center justify-between"
              >
                <span>
                  {formData.listingId
                    ? availableListings.find(l => l._id === formData.listingId)?.title
                      || approvedListings.find(l => l._id === formData.listingId)?.title
                      || 'Select a listing'
                    : 'Select a listing'}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-50 bg-gray-700 rounded mt-1 w-full max-h-64 overflow-y-auto shadow-lg">
                  {Array.isArray(availableListings) && availableListings.length > 0 ? (
                    <>
                      {availableListings.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => handleSelectListing(item._id)}
                          className="p-2 hover:bg-gray-600 cursor-pointer text-white flex items-center gap-2"
                        >
                          {item.image && (
                            <img
                              src={`${IMAGE_BASE_URL}/Uploads/${item.image}`}
                              alt={item.title}
                              className="w-8 h-8 object-cover rounded"
                              onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
                            />
                          )}
                          <div>
                            <div className="text-sm">{item.title}</div>
                            <div className="text-xs text-gray-400">{item.sellerId?.name || 'Unknown'}</div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="p-2 text-white">No available listings. Approve or add new listings.</div>
                  )}
                </div>
              )}
            </div>
            {errors.listingId && <p className="text-red-400 text-sm mt-1">{errors.listingId}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Rank</label>
            <input
              type="number"
              name="mainRank"
              value={formData.mainRank}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white p-2 rounded"
              min="1"
              required
            />
            {errors.mainRank && <p className="text-red-400 text-sm mt-1">{errors.mainRank}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Ranking Main Section ---
const RankingMainSection = ({ listings }) => {
  const [mainRankedSubscriptions, setMainRankedSubscriptions] = useState([]);
  const [approvedListings, setApprovedListings] = useState([]);
  const [homepageFeaturedSubscriptions, setHomepageFeaturedSubscriptions] = useState([]);
  const [loadingMainRanked, setLoadingMainRanked] = useState(false);
  const [errorMainRanked, setErrorMainRanked] = useState(null);
  const [isMainRankedModalOpen, setIsMainRankedModalOpen] = useState(false);
  const [selectedMainRankedSubscription, setSelectedMainRankedSubscription] = useState(null);
  const [isDeleteMainRankedModalOpen, setIsDeleteMainRankedModalOpen] = useState(false);

  useEffect(() => {
    const fetchApprovedListings = async () => {
      try {
        const response = await adminService.getAllListings({ status: 'approved' });
        console.log('[RankingMainSection] Fetched approved listings:', response);
        if (!response?.success || !Array.isArray(response.data)) {
          throw new Error('Invalid response from getAllListings');
        }
        setApprovedListings(response.data);
      } catch (err) {
        console.error('[RankingMainSection] Error fetching approved listings:', err.message, err.stack);
        setApprovedListings([]);
        toast.error('Failed to fetch approved listings: ' + (err.message || 'Unknown error'));
      }
    };
    fetchApprovedListings();
  }, []);

  useEffect(() => {
    const fetchHomepageFeaturedSubscriptions = async () => {
      try {
        const response = await adminService.getHomepageFeaturedSubscriptions();
        console.log('[RankingMainSection] Fetched homepage featured subscriptions:', response);
        if (!response?.success || !Array.isArray(response.data)) {
          throw new Error('Invalid response from getHomepageFeaturedSubscriptions');
        }
        setHomepageFeaturedSubscriptions(response.data);
      } catch (err) {
        console.error('[RankingMainSection] Error fetching homepage featured subscriptions:', err.message, err.stack);
        setHomepageFeaturedSubscriptions([]);
        toast.error('Failed to fetch homepage featured subscriptions: ' + (err.message || 'Unknown error'));
      }
    };
    fetchHomepageFeaturedSubscriptions();
  }, []);

  const fetchMainRankedSubscriptions = useCallback(async () => {
    setLoadingMainRanked(true);
    setErrorMainRanked(null);
    try {
      console.log("[RankingMainSection] Fetching main ranked subscriptions...");
      const response = await adminService.getMainRankedSubscriptions();
      console.log("[RankingMainSection] Main ranked subscriptions response:", response);
      if (!response?.success || !Array.isArray(response.data)) {
        throw new Error('Invalid response from getMainRankedSubscriptions');
      }
      const rankedListings = response.data
        .filter(l => l.mainRank != null)
        .sort((a, b) => {
          const rankA = a.mainRank ?? Number.MAX_SAFE_INTEGER;
          const rankB = b.mainRank ?? Number.MAX_SAFE_INTEGER;
          return rankA - rankB;
        });
      console.log("[RankingMainSection] Filtered and sorted main ranked subscriptions:", rankedListings);
      setMainRankedSubscriptions(rankedListings);
    } catch (err) {
      console.error("[RankingMainSection] Error fetching main ranked subscriptions:", err.message, err.stack);
      setErrorMainRanked(err.message || "Failed to fetch main ranked subscriptions");
      toast.error('Failed to fetch main ranked subscriptions: ' + (err.message || 'Unknown error'));
    } finally {
      setLoadingMainRanked(false);
    }
  }, []);

  const handleSaveMainRankedSubscription = async (listingId, formData) => {
    console.log("[RankingMainSection] Saving main ranked subscription with listingId:", listingId, "formData:", formData);
    try {
      let response;
      if (listingId) {
        response = await adminService.updateMainRankedSubscription(listingId, formData);
        setMainRankedSubscriptions((prev) =>
          prev.map((sub) => (sub._id === listingId ? { ...sub, ...response.data } : sub))
        );
      } else {
        response = await adminService.createMainRankedSubscription(formData);
        setMainRankedSubscriptions((prev) => [...prev, response.data]);
      }
      toast.success(response.message || `Main ranked subscription ${listingId ? "updated" : "added"} successfully.`);
      fetchMainRankedSubscriptions();
    } catch (err) {
      console.error("[RankingMainSection] Error saving main ranked subscription:", err);
      toast.error(err.message || "Failed to save main ranked subscription");
    }
  };

  const handleDeleteMainRankedSubscription = async (listingId) => {
    console.log("[RankingMainSection] Deleting main ranked subscription with listingId:", listingId);
    try {
      const response = await adminService.deleteMainRankedSubscription(listingId);
      setMainRankedSubscriptions((prev) => prev.filter((sub) => sub._id !== listingId));
      toast.success(response.message || "Main ranked subscription removed successfully.");
    } catch (err) {
      console.error("[RankingMainSection] Error deleting main ranked subscription:", err);
      toast.error(err.message || "Failed to remove main ranked subscription");
      throw err;
    }
  };

  useEffect(() => {
    fetchMainRankedSubscriptions();
  }, [fetchMainRankedSubscriptions]);

  const openMainRankedModal = (subscription = null) => {
    setSelectedMainRankedSubscription(subscription);
    setIsMainRankedModalOpen(true);
  };

  const openDeleteMainRankedModal = (subscription) => {
    setSelectedMainRankedSubscription(subscription);
    setIsDeleteMainRankedModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-100">Main Ranked Subscriptions</h2>
        <button
          onClick={() => openMainRankedModal()}
          className="px-4 py-2.5 bg-neon-blue bg-opacity-90 hover:bg-neon-blue text-white rounded-lg text-sm font-medium transition-colors"
        >
          Add Main Ranked Subscription
        </button>
      </div>
      {loadingMainRanked ? (
        <LoadingSpinner />
      ) : errorMainRanked ? (
        <ErrorMessage message={errorMainRanked} onRetry={fetchMainRankedSubscriptions} />
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[800px] text-left">
            <thead className="border-b border-gray-700 bg-gray-700 bg-opacity-30">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Listing</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Seller</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 divide-opacity-50">
              {mainRankedSubscriptions.length > 0 ? (
                mainRankedSubscriptions.map((subscription) => (
                  <tr key={subscription._id} className="hover:bg-gray-700 hover:bg-opacity-40 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      {subscription.title}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">
                      {subscription.sellerId?.name || "Unknown"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">
                      {subscription.mainRank}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-right flex gap-2 justify-end">
                      <button
                        onClick={() => openMainRankedModal(subscription)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteMainRankedModal(subscription)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400">
                    No main ranked subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {isMainRankedModalOpen && (
        <MainRankedModal
          isOpen={isMainRankedModalOpen}
          onClose={() => setIsMainRankedModalOpen(false)}
          onSave={handleSaveMainRankedSubscription}
          approvedListings={approvedListings}
          homepageFeaturedSubscriptions={homepageFeaturedSubscriptions}
          listing={selectedMainRankedSubscription}
        />
      )}
      {isDeleteMainRankedModalOpen && selectedMainRankedSubscription && (
        <DeleteFeaturedSubscriptionModal
          isOpen={isDeleteMainRankedModalOpen}
          onClose={() => setIsDeleteMainRankedModalOpen(false)}
          listing={selectedMainRankedSubscription}
          onConfirm={handleDeleteMainRankedSubscription}
          isHomepageFeatured={false}
        />
      )}
    </div>
  );
};

// --- Homepage Featured Section ---
const HomepageFeaturedSection = ({ listings }) => {
  const [homepageFeaturedSubscriptions, setHomepageFeaturedSubscriptions] = useState([]);
  const [approvedListings, setApprovedListings] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(false);
  const [errorFeatured, setErrorFeatured] = useState(null);
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [selectedFeaturedSubscription, setSelectedFeaturedSubscription] = useState(null);
  const [isDeleteFeaturedModalOpen, setIsDeleteFeaturedModalOpen] = useState(false);

  useEffect(() => {
    const fetchApprovedListings = async () => {
      try {
        const response = await adminService.getAllListings({ status: 'approved' });
        console.log('[HomepageFeaturedSection] Fetched approved listings:', response);
        if (!response?.success || !Array.isArray(response.data)) {
          throw new Error('Invalid response from getAllListings');
        }
        setApprovedListings(response.data);
      } catch (err) {
        console.error('[HomepageFeaturedSection] Error fetching approved listings:', err.message, err.stack);
        setApprovedListings([]);
        toast.error('Failed to fetch approved listings: ' + (err.message || 'Unknown error'));
      }
    };
    fetchApprovedListings();
  }, []);

  const fetchHomepageFeaturedSubscriptions = useCallback(async () => {
    setLoadingFeatured(true);
    setErrorFeatured(null);
    try {
      console.log("[HomepageFeaturedSection] Fetching homepage featured subscriptions...");
      const response = await adminService.getHomepageFeaturedSubscriptions();
      console.log("[HomepageFeaturedSection] Homepage featured subscriptions response:", response);
      if (!response?.success || !Array.isArray(response.data)) {
        throw new Error('Invalid response from getHomepageFeaturedSubscriptions');
      }
      const featuredListings = response.data
        .filter(l => l.homepageFeaturedConfig != null)
        .sort((a, b) => {
          const rankA = a.homepageFeaturedConfig?.rank ?? Number.MAX_SAFE_INTEGER;
          const rankB = b.homepageFeaturedConfig?.rank ?? Number.MAX_SAFE_INTEGER;
          return rankA - rankB;
        });
      console.log("[HomepageFeaturedSection] Filtered and sorted homepage featured subscriptions:", featuredListings);
      setHomepageFeaturedSubscriptions(featuredListings);
    } catch (err) {
      console.error("[HomepageFeaturedSection] Error fetching homepage featured subscriptions:", err.message, err.stack);
      setErrorFeatured(err.message || "Failed to fetch homepage featured subscriptions");
      toast.error('Failed to fetch homepage featured subscriptions: ' + (err.message || 'Unknown error'));
    } finally {
      setLoadingFeatured(false);
    }
  }, []);

  const handleSaveFeaturedSubscription = async (listingId, formData) => {
    console.log("[HomepageFeaturedSection] Saving homepage featured subscription with listingId:", listingId, "formData:", formData);
    try {
      let response;
      if (listingId) {
        response = await adminService.updateHomepageFeaturedSubscription(listingId, formData);
        setHomepageFeaturedSubscriptions((prev) =>
          prev.map((sub) => (sub._id === listingId ? { ...sub, homepageFeaturedConfig: response.data.homepageFeaturedConfig } : sub))
        );
      } else {
        response = await adminService.createHomepageFeaturedSubscription(formData);
        setHomepageFeaturedSubscriptions((prev) => [...prev, response.data]);
      }
      toast.success(response.message || `Homepage featured subscription ${listingId ? "updated" : "added"} successfully.`);
      fetchHomepageFeaturedSubscriptions();
    } catch (err) {
      console.error("[HomepageFeaturedSection] Error saving homepage featured subscription:", err);
      toast.error(err.message || "Failed to save homepage featured subscription");
      throw err;
    }
  };

  const handleDeleteFeaturedSubscription = async (listingId) => {
    console.log("[HomepageFeaturedSection] Deleting homepage featured subscription with listingId:", listingId);
    try {
      const response = await adminService.deleteHomepageFeaturedSubscription(listingId);
      setHomepageFeaturedSubscriptions((prev) => prev.filter((sub) => sub._id !== listingId));
      toast.success(response.message || "Homepage featured subscription removed successfully.");
    } catch (err) {
      console.error("[HomepageFeaturedSection] Error deleting homepage featured subscription:", err);
      toast.error(err.message || "Failed to remove homepage featured subscription");
      throw err;
    }
  };

  useEffect(() => {
    fetchHomepageFeaturedSubscriptions();
  }, [fetchHomepageFeaturedSubscriptions]);

  const openFeaturedModal = (subscription = null) => {
    setSelectedFeaturedSubscription(subscription);
    setIsFeaturedModalOpen(true);
  };

  const openDeleteFeaturedModal = (subscription) => {
    setSelectedFeaturedSubscription(subscription);
    setIsDeleteFeaturedModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-100">Homepage Featured Subscriptions</h2>
        <button
          onClick={() => openFeaturedModal()}
          className="px-4 py-2.5 bg-neon-blue bg-opacity-90 hover:bg-neon-blue text-white rounded-lg text-sm font-medium transition-colors"
        >
          Add Homepage Featured Subscription
        </button>
      </div>
      {loadingFeatured ? (
        <LoadingSpinner />
      ) : errorFeatured ? (
        <ErrorMessage message={errorFeatured} onRetry={fetchHomepageFeaturedSubscriptions} />
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[800px] text-left">
            <thead className="border-b border-gray-700 bg-gray-700 bg-opacity-30">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Listing</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Seller</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Gradient</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 divide-opacity-50">
              {homepageFeaturedSubscriptions.length > 0 ? (
                homepageFeaturedSubscriptions.map((subscription) => (
                  <tr key={subscription._id} className="hover:bg-gray-700 hover:bg-opacity-40 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      {subscription.title}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">
                      {subscription.sellerId?.name || "Unknown"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">
                      {subscription.homepageFeaturedConfig?.rank}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div
                        className="w-24 h-6 rounded"
                        style={{ background: `linear-gradient(to right, ${subscription.homepageFeaturedConfig?.gradient.replace(/from-|via-|to-/g, '')})` }}
                      ></div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-right flex gap-2 justify-end">
                      <button
                        onClick={() => openFeaturedModal(subscription)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteFeaturedModal(subscription)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400">
                    No homepage featured subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {isFeaturedModalOpen && (
        <FeaturedSubscriptionModal
          isOpen={isFeaturedModalOpen}
          onClose={() => setIsFeaturedModalOpen(false)}
          onSave={handleSaveFeaturedSubscription}
          approvedListings={approvedListings}
          homepageFeaturedSubscriptions={homepageFeaturedSubscriptions}
          listing={selectedFeaturedSubscription}
          isHomepageFeatured={true}
        />
      )}
      {isDeleteFeaturedModalOpen && selectedFeaturedSubscription && (
        <DeleteFeaturedSubscriptionModal
          isOpen={isDeleteFeaturedModalOpen}
          onClose={() => setIsDeleteFeaturedModalOpen(false)}
          listing={selectedFeaturedSubscription}
          onConfirm={handleDeleteFeaturedSubscription}
          isHomepageFeatured={true}
        />
      )}
    </div>
  );
};

// --- Main Admin Dashboard Component ---
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [usersPagination, setUsersPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    pages: 1,
  });
  const [userActionLoading, setUserActionLoading] = useState(null);
  const [allListings, setAllListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError,setListingsError] = useState(null);
  const [listingsPagination, setListingsPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    pages: 1,
  });
  const [listingActionLoading, setListingActionLoading] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState(null);
  const [blogsPagination, setBlogsPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    pages: 1,
  });
  const [blogActionLoading, setBlogActionLoading] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [showListingModal, setShowListingModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [userToVerify, setUserToVerify] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showDeleteBlogModal, setShowDeleteBlogModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState({ _id: 'admin123', role: 'admin', name: 'Admin User' }); // Placeholder
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const transactions = [
    { id: "1", name: "Thabo Mbeki", amount: 250.0, date: "2023-11-14", type: "credit" },
    { id: "2", name: "Nomzamo Mbatha", amount: 1000.0, date: "2023-11-13", type: "debit" },
    { id: "3", name: "Siya Kolisi", amount: 500.0, date: "2023-11-12", type: "credit" },
    { id: "4", name: "Trevor Noah", amount: 750.0, date: "2023-11-11", type: "debit" },
    { id: "5", name: "Patrice Motsepe", amount: 2500.0, date: "2023-11-10", type: "credit" },
  ];

  const logout = () => {
    setCurrentUser(null);
    // Additional logout logic (e.g., clear tokens)
  };

  const fetchUsers = useCallback(async (page = 1, limit = 15, search = "") => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const params = { page, limit, search };
      const response = await adminService.getAllUsers(params);
      const usersWithDefaultStatus = (response.data || []).map((user) => ({
        ...user,
        verificationStatus: user.verificationStatus || VERIFICATION_STATUSES.NOT_VERIFIED,
      }));
      setUsers(usersWithDefaultStatus);
      setUsersPagination(response.pagination || { page, limit, total: 0, pages: 1 });
    } catch (err) {
      setUsersError(err.message || "Failed to fetch users.");
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    try {
      const response = await notificationService.getNotifications();
      console.log("[AdminDashboard] fetchNotifications: Response:", JSON.stringify(response, null, 2));
      if (response?.success && Array.isArray(response.notifications)) {
        setNotifications(response.notifications);
        setUnreadCount(response.notifications.filter((n) => !n.isRead).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("[AdminDashboard] Failed to fetch notifications:", err);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser]);

  const fetchAllListings = useCallback(async (page = 1, limit = 15) => {
    setListingsLoading(true);
    setListingsError(null);
    try {
      const params = { page, limit };
      const response = await adminService.getAllListings(params);
      setAllListings(response.data || []);
      setListingsPagination(response.pagination || { page, limit, total: 0, pages: 1 });
    } catch (err) {
      setListingsError(err.message || "Failed to fetch listings.");
    } finally {
      setListingsLoading(false);
    }
  }, []);

  const fetchBlogs = useCallback(async (page = 1, limit = 15, search = "") => {
    setBlogsLoading(true);
    setBlogsError(null);
    try {
      const params = { page, limit, search };
      const response = await adminService.getBlogs(params);
      setBlogs(response.data || []);
      setBlogsPagination(response.pagination || { page, limit, total: 0, pages: 1 });
    } catch (err) {
      setBlogsError(err.message || "Failed to fetch blogs.");
    } finally {
      setBlogsLoading(false);
    }
  }, []);

  const fetchPendingCount = useCallback(async () => {
    setOverviewLoading(true);
    try {
      const pending = await adminService.getPendingListings();
      setPendingCount(pending.length);
    } catch (err) {
      console.error("Failed to fetch pending count:", err);
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  const handleToggleVerification = async (userId, reason = "") => {
    if (userActionLoading === userId) return;
    setUserActionLoading(userId);
    try {
      const user = users.find((u) => u._id === userId);
      if (!user) {
        throw new Error("User not found in local state");
      }
      const newStatus =
        user.verificationStatus === VERIFICATION_STATUSES.VERIFIED
          ? VERIFICATION_STATUSES.NOT_VERIFIED
          : VERIFICATION_STATUSES.VERIFIED;
      const response = await adminService.toggleUserVerification(userId, newStatus, reason);
      toast.success(response.message || `Verification status updated.`);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? { ...u, verificationStatus: newStatus } : u))
      );
    } catch (err) {
      console.error(`Failed to toggle verification for user ${userId}:`, {
        message: err.message,
        stack: err.stack,
        response: err.response ? { status: err.response.status, data: err.response.data } : null,
      });
      toast.error(`Failed to toggle verification for user ${userId}: ${err.message || "Unknown error"}`);
    } finally {
      setUserActionLoading(null);
    }
  };

  const handleToggleBlock = async (userId, currentBlockedStatus) => {
    if (userActionLoading === userId) return;
    setUserActionLoading(userId);
    try {
      const response = await adminService.toggleUserBlock(userId);
      toast.success(response.message || `User status updated.`);
      setUsers((prevUsers) => prevUsers.map((u) => (u._id === userId ? { ...u, isBlocked: !currentBlockedStatus } : u)));
    } catch (err) {
      console.error(`Failed to toggle block for user ${userId}:`, err);
      toast.error(`Failed to toggle block for user ${userId}.`);
    } finally {
      setUserActionLoading(null);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("[AdminDashboard] Failed to mark notification as read:", err);
        toast(({ closeToast }) => (
          <NewCustomToast
            type="error"
            headline="Error"
            text="Could not update notification status."
            closeToast={closeToast}
          />
        ));
      }
    }
    setShowNotificationsDropdown(false);
    if (notification.relatedEntityType === "Listing" && notification.relatedEntity) {
      navigate(`/listing/${notification.relatedEntity}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleApproveListing = async (listingId) => {
    if (listingActionLoading === listingId) return;
    setListingActionLoading(listingId);
    try {
      const response = await adminService.approveListing(listingId);
      toast.success(response.message || `Listing approved.`);
      setAllListings((prev) => prev.map((l) => (l._id === listingId ? { ...l, status: "approved" } : l)));
      if (selectedListing?._id === listingId)
        setSelectedListing((prev) => (prev ? { ...prev, status: "approved" } : null));
      setShowListingModal(false);
      fetchPendingCount();
    } catch (err) {
      console.error(`Failed to approve listing ${listingId}:`, err);
      toast.error(`Failed to approve listing ${listingId}.`);
    } finally {
      setListingActionLoading(null);
    }
  };

  const handleRejectListing = async (listingId) => {
    if (listingActionLoading === listingId) return;
    const reason = prompt("Enter reason for rejection (optional, will be sent to seller):");
    if (reason === null) return;

    setListingActionLoading(listingId);
    try {
      const response = await adminService.rejectListing(listingId, reason || undefined);
      toast.warn(response.message || `Listing rejected.`);
      setAllListings((prev) =>
        prev.map((l) => (l._id === listingId ? { ...l, status: "rejected", rejectionReason: reason } : l))
      );
      if (selectedListing?._id === listingId)
        setSelectedListing((prev) => (prev ? { ...prev, status: "rejected", rejectionReason: reason } : null));
      setShowListingModal(false);
      fetchPendingCount();
    } catch (err) {
      console.error(`Failed to reject listing ${listingId}:`, err);
      toast.error(`Failed to reject listing ${listingId}.`);
    } finally {
      setListingActionLoading(null);
    }
  };

  const handleSaveBlog = async (blogId, data) => {
    if (blogActionLoading) return;
    setBlogActionLoading(blogId || "new");
    try {
      let response;
      if (blogId) {
        response = await adminService.updateBlog(blogId, data);
        setBlogs((prev) =>
          prev.map((b) => (b._id === blogId ? { ...b, ...response.data } : b))
        );
      } else {
        response = await adminService.createBlog(data);
        setBlogs((prev) => [response.data, ...prev]);
        setBlogsPagination((prev) => ({ ...prev, total: prev.total + 1 }));
      }
      toast.success(response.message || `Blog ${blogId ? "updated" : "created"} successfully.`);
    } catch (err) {
      console.error(`Failed to ${blogId ? "update" : "create"} blog:`, err);
      throw err;
    } finally {
      setBlogActionLoading(null);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (blogActionLoading === blogId) return;
    setBlogActionLoading(blogId);
    try {
      const response = await adminService.deleteBlog(blogId);
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      setBlogsPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      toast.success(response.message || "Blog deleted successfully.");
    } catch (err) {
      console.error(`Failed to delete blog ${blogId}:`, err);
      throw err;
    } finally {
      setBlogActionLoading(null);
    }
  };

  const handleUserSearchChange = (e) => {
    setUserSearchTerm(e.target.value);
    fetchUsers(1, usersPagination.limit, e.target.value);
  };

  const handleBlogSearchChange = (e) => {
    setBlogSearchTerm(e.target.value);
    fetchBlogs(1, blogsPagination.limit, e.target.value);
  };

  const viewListingDetails = (listing) => {
    setSelectedListing(listing);
    setShowListingModal(true);
  };

  const openBlogModal = (blog = null) => {
    setSelectedBlog(blog);
    setShowBlogModal(true);
  };

  const openDeleteBlogModal = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteBlogModal(true);
  };

  const confirmBlockUser = async () => {
    if (userToBlock) {
      await handleToggleBlock(userToBlock._id, userToBlock.isBlocked);
      setUserToBlock(null);
    }
    setShowBlockModal(false);
  };

  useEffect(() => {
    if (activeTab === "overview") {
      fetchPendingCount();
      if (usersPagination.total === 0 && users.length === 0) fetchUsers(1, usersPagination.limit);
      if (listingsPagination.total === 0 && allListings.length === 0) fetchAllListings(1, listingsPagination.limit);
    } else if (activeTab === "users") {
      fetchUsers(usersPagination.page, usersPagination.limit, userSearchTerm);
    } else if (activeTab === "listings") {
      fetchAllListings(listingsPagination.page, listingsPagination.limit);
    } else if (activeTab === "blogs") {
      fetchBlogs(blogsPagination.page, blogsPagination.limit, blogSearchTerm);
    } else if (activeTab === "RankingMain" || activeTab === "HomepageFeatured") {
      fetchAllListings(1, listingsPagination.limit);
    }
  }, [
    activeTab,
    fetchPendingCount,
    fetchUsers,
    fetchAllListings,
    fetchBlogs,
    usersPagination.page,
    usersPagination.limit,
    listingsPagination.page,
    listingsPagination.limit,
    blogsPagination.page,
    blogsPagination.limit,
    usersPagination.total,
    listingsPagination.total,
    blogsPagination.total,
    users.length,
    allListings.length,
    blogs.length,
    userSearchTerm,
    blogSearchTerm,
  ]);

  useEffect(() => {
    if (!currentUser?._id) return;

    const socket = io(SOCKET_URL, {
      query: { userId: currentUser._id, userType: "admin" },
    });

    socket.on("connect", () => {
      console.log("Admin socket connected:", socket.id);
      socket.emit("join_admin_room");
    });
    socket.on("disconnect", (reason) => console.log(`Admin socket disconnected: ${reason}`));
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      toast(({ closeToast }) => (
        <NewCustomToast
          type="error"
          headline="Connection Issue"
          text={`Real-time connection failed: ${err.message}. Some features might be affected.`}
          closeToast={closeToast}
        />
      ));
    });
    socket.on("new_pending_listing", (newListingData) => {
      toast.info(`New listing "${newListingData.title}" requires approval.`);
      setPendingCount((prev) => prev + 1);
    });
    socket.on("listing_approved", () => fetchPendingCount());
    socket.on("listing_rejected", () => fetchPendingCount());
    socket.on("user_verification_updated", (data) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === data.userId ? { ...u, verificationStatus: data.status } : u))
      );
      toast.info(`User ${data.userName} verification status updated to ${data.status}.`);
    });
    socket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 50));
      if (!notification.isRead) setUnreadCount((prev) => prev + 1);
      if (notification.type === "promotion_bid") {
        toast(({ closeToast }) => (
          <NewCustomToast
            type="info"
            headline="New Promotion Bid"
            text={notification.message}
            closeToast={closeToast}
          />
        ));
      }
    });

    return () => socket.disconnect();
  }, [currentUser?._id, fetchPendingCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target) &&
        !event.target.closest("#notification-button-admin")
      ) {
        setShowNotificationsDropdown(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        !event.target.closest("#user-menu-button-admin")
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen text-gray-100 font-semibold flex flex-col relative items-center justify-center">
        <AnimatedGradientBackground />
        <div className="relative z-10 p-8 bg-black bg-opacity-50 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl text-center">
          <LoadingSpinner />
          <p className="mt-4 text-lg">Authenticating...</p>
          <p className="text-sm text-gray-400">
            Please wait or{" "}
            <Link to="/login" className="text-neon-purple hover:underline">
              login
            </Link>{" "}
            as an admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative font-sans">
      <AnimatedGradientBackground />
      <div className="relative z-10 flex flex-col flex-grow">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          <header className="bg-black bg-opacity-40 backdrop-blur-lg border border-gray-700 border-opacity-30 rounded-xl shadow-2xl p-6 mb-10">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h1
                className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-neon-blue to-purple-400"
                style={{
                  textShadow: "0 0 20px rgba(139, 92, 246, 0.3), 0 0 30px rgba(129, 140, 248, 0.2)",
                }}
              >
                Admin Dashboard
              </h1>
              <Link
                to="/admin/approvals"
                className="px-5 py-2.5 bg-yellow-500 bg-opacity-80 text-black font-semibold rounded-lg hover:bg-yellow-400 hover:bg-opacity-90 transition duration-300 hover:shadow-yellow-500 hover:shadow-opacity-40 flex items-center gap-2 text-sm"
              >
                Pending Approvals{" "}
                {pendingCount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>
            </div>
          </header>

          <div className="mb-8">
            <div className="sm:hidden">
              <select
                id="admin-tabs-mobile"
                name="admin-tabs-mobile"
                className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-700 border-opacity-50 bg-gray-800 bg-opacity-70 text-white focus:outline-none focus:ring-neon-blue focus:border-neon-blue sm:text-sm rounded-lg shadow-md backdrop-blur-sm"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                {["overview", "users", "listings", "RankingMain", "HomepageFeatured", "blogs"].map((tab) => (
                  <option key={tab} value={tab}>
                    {tab === "RankingMain"
                      ? "Ranking Main"
                      : tab === "HomepageFeatured"
                      ? "Homepage Featured"
                      : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-700 border-opacity-50">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {["overview", "users", "listings", "RankingMain", "HomepageFeatured", "blogs"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`group inline-flex items-center py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-150 ease-in-out focus:outline-none
                        ${activeTab === tab ? "border-neon-blue text-neon-blue" : "border-transparent text-gray-400 hover:text-gray-100 hover:border-gray-500"}`}
                    >
                      {tab === "RankingMain"
                        ? "Ranking Main"
                        : tab === "HomepageFeatured"
                        ? "Homepage Featured"
                        : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div className="bg-black bg-opacity-50 backdrop-blur-xl border border-gray-700 border-opacity-40 rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 min-h-[60vh]">
            {activeTab === "overview" && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-gray-100">Dashboard Overview</h2>
                {overviewLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-800 bg-opacity-70 border border-neon-blue border-opacity-20 rounded-xl p-6 backdrop-blur-lg shadow-lg">
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Pending Approvals</h3>
                      <p className="text-4xl font-bold text-neon-blue">{pendingCount?.toLocaleString() ?? 0}</p>
                      <Link to="/admin/approvals" className="text-xs text-neon-blue hover:underline mt-2 inline-block">
                        View Pending
                      </Link>
                    </div>
                    <div className="bg-gray-800 bg-opacity-70 border border-gray-700 border-opacity-50 rounded-xl p-6 backdrop-blur-lg shadow-lg">
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Total Users</h3>
                      <p className="text-4xl font-bold">
                        {usersLoading && usersPagination.total === 0
                          ? "..."
                          : (usersPagination?.total ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-800 bg-opacity-70 border border-gray-700 border-opacity-50 rounded-xl p-6 backdrop-blur-lg shadow-lg">
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Revenue Today</h3>
                      <p className="text-4xl font-bold">R 0</p>
                    </div>
                    <div className="bg-gray-800 bg-opacity-70 border border-gray-700 border-opacity-50 rounded-xl p-6 backdrop-blur-lg shadow-lg">
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Active Subscriptions</h3>
                      <p className="text-4xl font-bold">0</p>
                    </div>
                  </div>
                )}
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-7 gap-6">
                  <div className="bg-gray-800 bg-opacity-50 border border-gray-700 border-opacity-50 rounded-xl p-6 backdrop-blur-lg shadow-lg lg:col-span-4">
                    <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
                    <DashboardChart />
                  </div>
                  <div className="bg-gray-800 bg-opacity-50 border border-gray-700 border-opacity-50 rounded-xl p-6 backdrop-blur-lg shadow-lg lg:col-span-3">
                    <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                    <RecentTransactions transactions={transactions} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                  <h2 className="text-3xl font-bold text-gray-100">User Management</h2>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={userSearchTerm}
                      onChange={handleUserSearchChange}
                      className="bg-gray-700 bg-opacity-70 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none w-full sm:w-72"
                    />
                  </div>
                </div>
                {usersLoading ? (
                  <LoadingSpinner />
                ) : usersError ? (
                  <ErrorMessage message={usersError} onRetry={() => fetchUsers(1, usersPagination.limit, userSearchTerm)} />
                ) : (
                  <>
                    <div className="overflow-x-auto custom-scrollbar bg-gray-800 bg-opacity-60 border border-gray-700 border-opacity-50 rounded-xl shadow-md">
                      <table className="w-full min-w-[1200px] text-left">
                        <thead className="border-b border-gray-700 bg-gray-700 bg-opacity-40">
                          <tr>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Verification</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 divide-opacity-50">
                          {users.length > 0 ? (
                            users.map((user) => (
                              <tr key={user._id} className="hover:bg-gray-700 hover:bg-opacity-40 transition-colors group">
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-600 flex items-center justify-center text-neon-blue font-semibold">
                                      {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-100 flex items-center gap-2">
                                        {user.name || "Unknown"}
                                        {user.verificationStatus === VERIFICATION_STATUSES.VERIFIED && (
                                          <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                              fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-400">{user.email || "N/A"}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm capitalize text-gray-300">{user.role || "N/A"}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm">
                                  <span
                                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                      user.verificationStatus === VERIFICATION_STATUSES.VERIFIED
                                        ? "bg-blue-500 bg-opacity-20 text-blue-300"
                                        : user.verificationStatus === VERIFICATION_STATUSES.PENDING
                                        ? "bg-yellow-500 bg-opacity-20 text-yellow-300"
                                        : "bg-gray-500 bg-opacity-20 text-gray-300"
                                    }`}
                                  >
                                    {user.verificationStatus ? user.verificationStatus.replace("_", " ") : "Not Verified"}
                                  </span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm">
                                  <span
                                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                      user.isBlocked ? "bg-red-500 bg-opacity-20 text-red-300" : "bg-green-500 bg-opacity-20 text-green-300"
                                    }`}
                                  >
                                    {user.isBlocked ? "Blocked" : "Active"}
                                  </span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-xs font-medium text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        setUserToVerify(user);
                                        setShowVerificationModal(true);
                                      }}
                                      title={
                                        user.verificationStatus === VERIFICATION_STATUSES.VERIFIED
                                          ? "Revoke Verification"
                                          : "Grant Verification"
                                      }
                                      className={`p-2 transition-colors rounded-md hover:bg-gray-700 hover:bg-opacity-50 ${
                                        user.verificationStatus === VERIFICATION_STATUSES.VERIFIED
                                          ? "text-red-400 hover:text-red-300"
                                          : "text-blue-400 hover:text-blue-300"
                                      }`}
                                    >
                                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setUserToBlock(user);
                                        setShowBlockModal(true);
                                      }}
                                      title={user.isBlocked ? "Unblock User" : "Block User"}
                                      className={`p-2 transition-colors rounded-md hover:bg-gray-700 hover:bg-opacity-50 ${
                                        user.isBlocked ? "text-green-400 hover:text-green-300" : "text-red-400 hover:text-red-300"
                                      }`}
                                    >
                                      {user.isBlocked ? (
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      ) : (
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center py-10 text-gray-400">
                                No users found{userSearchTerm && " matching your search"}.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {usersPagination.total > 0 && usersPagination.pages > 1 && (
                      <div className="mt-6 flex justify-between items-center">
                        <button
                          onClick={() => fetchUsers(usersPagination.page - 1, usersPagination.limit, userSearchTerm)}
                          disabled={usersPagination.page === 1 || usersLoading}
                          className="px-4 py-2 bg-gray-700 bg-opacity-50 hover:bg-gray-700 hover:bg-opacity-70 text-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-300">
                          Page {usersPagination.page} of {usersPagination.pages} (Total: {usersPagination.total})
                        </span>
                        <button
                          onClick={() => fetchUsers(usersPagination.page + 1, usersPagination.limit, userSearchTerm)}
                          disabled={usersPagination.page === usersPagination.pages || usersLoading}
                          className="px-4 py-2 bg-gray-700 bg-opacity-50 hover:bg-gray-700 hover:bg-opacity-70 text-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "listings" && (
              <div>
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                  <h2 className="text-2xl font-semibold text-gray-100">Listing Management</h2>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Search listings..."
                      className="bg-gray-700 bg-opacity-70 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none w-full sm:w-72"
                    />
                    <Link
                      to="/admin/approvals"
                      className="px-4 py-2.5 bg-neon-blue bg-opacity-90 hover:bg-neon-blue text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      View Pending Approvals
                    </Link>
                  </div>
                </div>
                {listingsLoading ? (
                  <LoadingSpinner />
                ) : listingsError ? (
                  <ErrorMessage
                    message={listingsError}
                    onRetry={() => fetchAllListings(listingsPagination.page, listingsPagination.limit)}
                  />
                ) : (
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[800px] text-left">
                      <thead className="border-b border-gray-700 bg-gray-700 bg-opacity-30">
                        <tr>
                          <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                          <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                          <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                          <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Seller</th>
                          <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700 divide-opacity-50">
                        {allListings.map((listing) => (
                          <tr key={listing._id} className="hover:bg-gray-700 hover:bg-opacity-40 transition-colors">
                            <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{listing.title}</td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm capitalize text-gray-300">{listing.category}</td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-neon-green">R {listing.price}</td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">
                              {listing.seller?.name || "Unknown"}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  listing.status === "approved"
                                    ? "bg-green-500 bg-opacity-20 text-green-300"
                                    : listing.status === "pending"
                                    ? "bg-yellow-500 bg-opacity-20 text-yellow-300"
                                    : listing.status === "rejected"
                                    ? "bg-red-500 bg-opacity-20 text-red-300"
                                    : "bg-gray-500 bg-opacity-20 text-gray-300"
                                }`}
                              >
                                {listing.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-right">
                              <button
                                onClick={() => viewListingDetails(listing)}
                                className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                        {allListings.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center py-10 text-gray-400">
                              No listings found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {listingsPagination.pages > 1 && (
                  <div className="mt-6 flex justify-between items-center">
                    <button
                      onClick={() => fetchAllListings(listingsPagination.page - 1, listingsPagination.limit)}
                      disabled={listingsPagination.page === 1}
                      className="px-4 py-2 bg-gray-700 bg-opacity-50 hover:bg-gray-700 hover:bg-opacity-70 text-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-300">
                      Page {listingsPagination.page} of {listingsPagination.pages}
                    </span>
                    <button
                      onClick={() => fetchAllListings(listingsPagination.page + 1, listingsPagination.limit)}
                      disabled={listingsPagination.page === listingsPagination.pages}
                      className="px-4 py-2 bg-gray-700 bg-opacity-50 hover:bg-gray-700 hover:bg-opacity-70 text-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "RankingMain" && <RankingMainSection listings={allListings} />}
            {activeTab === "HomepageFeatured" && <HomepageFeaturedSection listings={allListings} />}

            {activeTab === "blogs" && (
              <div>
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                  <h2 className="text-2xl font-semibold text-gray-100">Blog Management</h2>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Search blogs by title..."
                      value={blogSearchTerm}
                      onChange={handleBlogSearchChange}
                      className="bg-gray-700 bg-opacity-70 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none w-full sm:w-72"
                    />
                    <button
                      onClick={() => openBlogModal()}
                      className="px-4 py-2.5 bg-neon-blue bg-opacity-90 hover:bg-neon-blue text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Create Blog
                    </button>
                  </div>
                </div>
                {blogsLoading ? (
                  <LoadingSpinner />
                ) : blogsError ? (
                  <ErrorMessage
                    message={blogsError}
                    onRetry={() => fetchBlogs(blogsPagination.page, blogsPagination.limit, blogSearchTerm)}
                  />
                ) : (
                  <div className="overflow-x-auto custom-scrollbar bg-gray-800 bg-opacity-60 border border-gray-700 border-opacity-50 rounded-xl shadow-md">
                    <table className="w-full min-w-[800px] text-left">
                      <thead className="border-b border-gray-700 bg-gray-700 bg-opacity-30">
                        <tr>
                          <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                          <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Author</th>
                          <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</th>
                          <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700 divide-opacity-50">
                        {blogs.length > 0 ? (
                          blogs.map((blog) => (
                            <tr key={blog._id} className="hover:bg-gray-700 hover:bg-opacity-40 transition-colors">
                              <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{blog.title}</td>
                              <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">
                                {blog.author?.name || "Admin"}
                              </td>
                              <td className="px-5 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    blog.status === BLOG_STATUSES.PUBLISHED
                                      ? "bg-green-500 bg-opacity-20 text-green-300"
                                      : "bg-yellow-500 bg-opacity-20 text-yellow-300"
                                  }`}
                                >
                                  {blog.status}
                                </span>
                              </td>
                              <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">
                                {new Date(blog.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-5 py-4 whitespace-nowrap text-sm text-right flex gap-2 justify-end">
                                <button
                                  onClick={() => openBlogModal(blog)}
                                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => openDeleteBlogModal(blog)}
                                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-10 text-gray-400">
                              No blogs found{blogSearchTerm && " matching your search"}.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {blogsPagination.total > 0 && blogsPagination.pages > 1 && (
                  <div className="mt-6 flex justify-between items-center">
                    <button
                      onClick={() => fetchBlogs(blogsPagination.page - 1, blogsPagination.limit, blogSearchTerm)}
                      disabled={blogsPagination.page === 1 || blogsLoading}
                      className="px-4 py-2 bg-gray-700 bg-opacity-50 hover:bg-gray-700 hover:bg-opacity-70 text-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-300">
                      Page {blogsPagination.page} of {blogsPagination.pages} (Total: {blogsPagination.total})
                    </span>
                    <button
                      onClick={() => fetchBlogs(blogsPagination.page + 1, blogsPagination.limit, blogSearchTerm)}
                      disabled={blogsPagination.page === blogsPagination.pages || blogsLoading}
                      className="px-4 py-2 bg-gray-700 bg-opacity-50 hover:bg-gray-700 hover:bg-opacity-70 text-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Block User Confirmation Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 bg-opacity-90 border border-gray-700 border-opacity-50 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              {userToBlock?.isBlocked ? "Unblock" : "Block"} User
            </h3>
            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to {userToBlock?.isBlocked ? "unblock" : "block"}{" "}
              <span className="font-medium">{userToBlock?.name}</span>?{" "}
              {userToBlock?.isBlocked
                ? "This will restore their access to the platform."
                : "This will restrict their access to the platform."}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 bg-gray-600 bg-opacity-50 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBlockUser}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userToBlock?.isBlocked
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-red-600 hover:bg-red-500 text-white"
                }`}
              >
                {userToBlock?.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && userToVerify && (
        <VerificationModal
          user={userToVerify}
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          onConfirm={handleToggleVerification}
        />
      )}

      {/* Listing Details Modal */}
      {showListingModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 bg-opacity-90 border border-gray-700 border-opacity-50 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Listing Details</h3>
              <button onClick={() => setShowListingModal(false)} className="text-gray-400 hover:text-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400">Title</h4>
                <p className="text-gray-100">{selectedListing.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">Category</h4>
                <p className="text-gray-100 capitalize">{selectedListing.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">Price</h4>
                <p className="text-neon-green">R {selectedListing.price}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">Seller</h4>
                <p className="text-gray-100">{selectedListing.seller?.name || "Unknown"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">Status</h4>
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                    selectedListing.status === "approved"
                      ? "bg-green-500 bg-opacity-20 text-green-300"
                      : selectedListing.status === "pending"
                      ? "bg-yellow-500 bg-opacity-20 text-yellow-300"
                      : selectedListing.status === "rejected"
                      ? "bg-red-500 bg-opacity-20 text-red-300"
                      : "bg-gray-500 bg-opacity-20 text-gray-300"
                  }`}
                >
                  {selectedListing.status}
                </span>
              </div>
              {selectedListing.status === "rejected" && selectedListing.rejectionReason && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Rejection Reason</h4>
                  <p className="text-gray-100">{selectedListing.rejectionReason}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-gray-400">Description</h4>
                <p className="text-gray-100">{selectedListing.description || "No description provided."}</p>
              </div>
              {selectedListing.image && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Image</h4>
                  <img
                    src={`${IMAGE_BASE_URL}/Uploads/${selectedListing.image}`}
                    alt="Listing image"
                    className="w-full h-32 object-cover rounded-lg border border-gray-700"
                    onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
                  />
                </div>
              )}
            </div>
            {selectedListing.status === "pending" && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => handleApproveListing(selectedListing._id)}
                  disabled={listingActionLoading === selectedListing._id}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {listingActionLoading === selectedListing._id ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={() => handleRejectListing(selectedListing._id)}
                  disabled={listingActionLoading === selectedListing._id}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {listingActionLoading === selectedListing._id ? "Rejecting..." : "Reject"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {showBlogModal && (
        <BlogModal
          isOpen={showBlogModal}
          onClose={() => setShowBlogModal(false)}
          blog={selectedBlog}
          onSave={handleSaveBlog}
        />
      )}

      {/* Delete Blog Confirmation Modal */}
      {showDeleteBlogModal && blogToDelete && (
        <DeleteBlogModal
          isOpen={showDeleteBlogModal}
          onClose={() => setShowDeleteBlogModal(false)}
          onConfirm={handleDeleteBlog}
          blog={blogToDelete}
        />
      )}
    </div>
  );
};

export default AdminDashboard;