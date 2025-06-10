// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const EditSubscription = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: 'streaming',
//     price: '',
//     duration: '1 month',
//     deliveryMethod: 'manual',
//     deliveryDetails: '',
//     images: [],
//     isActive: true
//   });
  
//   const [loading, setLoading] = useState(true);
//   const [imageUploading, setImageUploading] = useState(false);

//   useEffect(() => {
//     const fetchSubscription = async () => {
//       try {
//         const { data } = await axios.get(`/api/subscriptions/${id}`);
//         setFormData({
//           title: data.title,
//           description: data.description,
//           category: data.category,
//           price: data.price,
//           duration: data.duration,
//           deliveryMethod: data.deliveryMethod,
//           deliveryDetails: data.deliveryDetails || '',
//           images: data.images || [],
//           isActive: data.isActive
//         });
//       } catch (err) {
//         toast.error(err.response?.data?.message || err.message);
//         navigate('/seller/dashboard');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubscription();
//   }, [id, navigate]);

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
//       await axios.put(`/api/subscriptions/${id}`, formData);
//       toast.success('Subscription updated successfully!');
//       navigate('/seller/dashboard');
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message);
//     }
//   };

//   if (loading) {
//     return <div className="container mx-auto px-4 py-8">Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-8 dark:text-white">Edit Subscription</h1>
      
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
          
//           <div className="flex items-center">
//             <input
//               id="isActive"
//               name="isActive"
//               type="checkbox"
//               checked={formData.isActive}
//               onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
//               className="h-4 w-4 text-primaryLight focus:ring-primaryLight border-gray-300 rounded"
//             />
//             <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//               Active Listing
//             </label>
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
        
//         <div className="mt-8 flex justify-end space-x-4">
//           <button
//             type="button"
//             onClick={() => navigate('/seller/dashboard')}
//             className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-primaryLight hover:bg-primaryDark text-white font-medium rounded-md transition-colors"
//           >
//             Save Changes
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditSubscription;


//from grok
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { listingService } from "../services/apiService";

const EditSubscription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "streaming",
    price: "",
    duration: "1 month",
    deliveryMethod: "manual",
    deliveryDetails: "",
    images: [],
    isActive: true,
    autoReply: "",
  });

  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await listingService.getById(id);
        if (response?.success && response.data) {
          setFormData({
            title: response.data.title || "",
            description: response.data.description || "",
            category: response.data.category || "streaming",
            price: response.data.price || "",
            duration: response.data.duration || "1 month",
            deliveryMethod: response.data.deliveryMethod || "manual",
            deliveryDetails: response.data.deliveryDetails || "",
            images: response.data.images || [],
            isActive: response.data.isActive !== false,
            autoReply: response.data.autoReply || "",
          });
        } else {
          throw new Error("Listing not found");
        }
      } catch (err) {
        toast.error(err.message || "Failed to fetch listing");
        navigate("/seller/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [id, navigate]);

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
    submitFormData.append("isActive", formData.isActive);
    submitFormData.append("autoReply", formData.autoReply);
    formData.images.forEach((img, index) => {
      submitFormData.append(`images[${index}]`, img);
    });

    try {
      await listingService.update(id, submitFormData);
      toast.success("Subscription updated successfully!");
      navigate("/seller/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to update subscription");
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 dark:text-white">Edit Subscription</h1>
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
          <div className="flex items-center">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-primaryLight focus:ring-primaryLight border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Active Listing
            </label>
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
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/seller/dashboard")}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primaryLight hover:bg-primaryDark text-white font-medium rounded-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSubscription;