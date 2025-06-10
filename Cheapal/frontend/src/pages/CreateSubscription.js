// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const CreateSubscription = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: 'streaming',
//     price: '',
//     duration: '1 month',
//     deliveryMethod: 'manual',
//     deliveryDetails: '',
//     images: []
//   });
  
//   const [imageUploading, setImageUploading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setImageUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('image', file);

//       const { data } = await axios.post('/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       setFormData(prev => ({
//         ...prev,
//         images: [...prev.images, data.imageUrl]
//       }));
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message);
//     } finally {
//       setImageUploading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/subscriptions', formData);
//       toast.success('Subscription created successfully!');
//       navigate('/seller/dashboard');
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-8 dark:text-white">Create New Subscription</h1>
      
//       <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="md:col-span-2">
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               required
//             />
//           </div>
          
//           <div className="md:col-span-2">
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               rows={4}
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               required
//             />
//           </div>
          
//           <div>
//             <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Category
//             </label>
//             <select
//               id="category"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               required
//             >
//               <option value="streaming">Streaming</option>
//               <option value="productivity">Productivity</option>
//               <option value="ai">AI Tools</option>
//               <option value="music">Music</option>
//               <option value="gaming">Gaming</option>
//               <option value="vpn">VPN</option>
//               <option value="education">Education</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
          
//           <div>
//             <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Price (USD)
//             </label>
//             <input
//               type="number"
//               id="price"
//               name="price"
//               min="0"
//               step="0.01"
//               value={formData.price}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               required
//             />
//           </div>
          
//           <div>
//             <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Duration
//             </label>
//             <select
//               id="duration"
//               name="duration"
//               value={formData.duration}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               required
//             >
//               <option value="1 month">1 Month</option>
//               <option value="3 months">3 Months</option>
//               <option value="6 months">6 Months</option>
//               <option value="1 year">1 Year</option>
//             </select>
//           </div>
          
//           <div>
//             <label htmlFor="deliveryMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Delivery Method
//             </label>
//             <select
//               id="deliveryMethod"
//               name="deliveryMethod"
//               value={formData.deliveryMethod}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               required
//             >
//               <option value="manual">Manual</option>
//               <option value="auto">Automatic</option>
//             </select>
//           </div>
          
//           {formData.deliveryMethod === 'manual' && (
//             <div className="md:col-span-2">
//               <label htmlFor="deliveryDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Delivery Instructions
//               </label>
//               <textarea
//                 id="deliveryDetails"
//                 name="deliveryDetails"
//                 rows={3}
//                 value={formData.deliveryDetails}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 placeholder="Explain how you'll deliver the subscription after purchase"
//               />
//             </div>
//           )}
          
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Images
//             </label>
//             <div className="flex items-center space-x-4">
//               <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white">
//                 {imageUploading ? 'Uploading...' : 'Upload Image'}
//                 <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
//               </label>
//               <div className="flex space-x-2">
//                 {formData.images.map((img, index) => (
//                   <div key={index} className="relative">
//                     <img src={img} alt="" className="h-16 w-16 object-cover rounded" />
//                     <button
//                       type="button"
//                       onClick={() => setFormData(prev => ({
//                         ...prev,
//                         images: prev.images.filter((_, i) => i !== index)
//                       }))}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="mt-8 flex justify-end">
//           <button
//             type="submit"
//             className="px-4 py-2 bg-primaryLight hover:bg-primaryDark text-white font-medium rounded-md transition-colors"
//           >
//             Create Subscription
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateSubscription;


//from grok



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { listingService } from "../services/apiService";

const CreateSubscription = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "streaming",
    price: "",
    duration: "1 month",
    deliveryMethod: "manual",
    deliveryDetails: "",
    images: [],
    autoReply: "",
  });

  const [imageUploading, setImageUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("chatImage", file);
      const response = await listingService.uploadImage(uploadFormData);
      if (response?.success && response.data?.imageUrl) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, response.data.imageUrl],
        }));
      } else {
        throw new Error("Image upload failed");
      }
    } catch (err) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.autoReply.trim()) {
      toast.error("Auto-reply message is required. Please provide login details for the buyer.");
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("title", formData.title);
    submitFormData.append("description", formData.description);
    submitFormData.append("category", formData.category);
    submitFormData.append("price", formData.price);
    submitFormData.append("duration", formData.duration);
    submitFormData.append("deliveryMethod", formData.deliveryMethod);
    submitFormData.append("deliveryDetails", formData.deliveryDetails);
    submitFormData.append("autoReply", formData.autoReply);
    formData.images.forEach((img, index) => {
      submitFormData.append(`images[${index}]`, img);
    });

    try {
      await listingService.create(submitFormData);
      toast.success("Subscription created successfully!");
      navigate("/seller/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to create subscription");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 dark:text-white">Create New Subscription</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md dark:bg-gray-800"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="streaming">Streaming</option>
              <option value="productivity">Productivity</option>
              <option value="ai">AI Tools</option>
              <option value="music">Music</option>
              <option value="gaming">Gaming</option>
              <option value="vpn">VPN</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Price (USD)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="1 month">1 Month</option>
              <option value="3 months">3 Months</option>
              <option value="6 months">6 Months</option>
              <option value="1 year">1 Year</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="deliveryMethod"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Delivery Method
            </label>
            <select
              id="deliveryMethod"
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="manual">Manual</option>
              <option value="auto">Automatic</option>
            </select>
          </div>
          {formData.deliveryMethod === "manual" && (
            <div className="md:col-span-2">
              <label
                htmlFor="deliveryDetails"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Delivery Instructions
              </label>
              <textarea
                id="deliveryDetails"
                name="deliveryDetails"
                rows={3}
                value={formData.deliveryDetails}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Explain how you'll deliver the subscription after purchase"
              />
            </div>
          )}
          <div className="md:col-span-2">
            <div className="mb-2 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-md text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold">Why provide an auto-reply message?</p>
              <p>
                Including login details (e.g., username, password, access link) in the auto-reply message
                ensures buyers receive immediate access to their digital product upon payment. This saves
                time, reduces support queries, and enhances buyer satisfaction. Your message is securely
                stored and only shown to buyers after they complete their order, protecting sensitive
                information.
              </p>
            </div>
            <label
              htmlFor="autoReply"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Auto-Reply Message (Required)
            </label>
            <textarea
              id="autoReply"
              name="autoReply"
              rows={4}
              value={formData.autoReply}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryLight focus:border-primaryLight dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter login details for the buyer (e.g., Username: user123, Password: pass456, Access Link: https://example.com/login). This will be sent automatically after payment."
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Images
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white">
                {imageUploading ? "Uploading..." : "Upload Image"}
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
              <div className="flex space-x-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt="" className="h-16 w-16 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }))
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primaryLight hover:bg-primaryDark text-white font-medium rounded-md transition-colors"
          >
            Create Subscription
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubscription;