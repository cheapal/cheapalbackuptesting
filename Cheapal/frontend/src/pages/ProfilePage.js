import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner"; // Adjust path as needed

// A smaller spinner for the upload button
const UploadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
);

// Image compression utility function
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(file.type, quality);
        const base64 = dataUrl.split(",")[1];
        const mimeType = dataUrl.split(",")[0].split(":")[1].split(";")[0];
        const byteCharacters = atob(base64);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i += 512) {
          const slice = byteCharacters.slice(i, i + 512);
          const byteNumbers = new Array(slice.length);
          for (let j = 0; j < slice.length; j++) {
            byteNumbers[j] = slice.charCodeAt(j);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: mimeType });
        resolve({
          blob: blob,
          dataUrl: dataUrl,
          type: mimeType,
          width: width,
          height: height,
        });
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}

const ProfilePage = () => {
  const { user, updateProfile, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const IMAGE_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace("/api", "") : "";

  const getAvatarColor = (name = "") => {
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-yellow-500"];
    if (!name) return colors[0];
    const hash = name.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        password: "",
        confirmPassword: "",
      });
      if (user.avatar && typeof user.avatar === "string") {
        if (user.avatar.startsWith("http") || user.avatar.startsWith("blob:")) {
          setAvatarPreview(user.avatar);
        } else {
          setAvatarPreview(IMAGE_BASE_URL ? `${IMAGE_BASE_URL}/uploads/${user.avatar}` : `/uploads/${user.avatar}`);
        }
      } else {
        setAvatarPreview("");
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, IMAGE_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, GIF, WEBP allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Original file is too large. Maximum 10MB allowed.");
      return;
    }

    setIsUploading(true);
    let localPreviewObjectUrl = "";

    try {
      localPreviewObjectUrl = URL.createObjectURL(file);
      setAvatarPreview(localPreviewObjectUrl);

      const compressedImage = await compressImage(file, 400, 400, 0.7);
      let finalImageBlob = compressedImage.blob;

      if (finalImageBlob.size > 1 * 1024 * 1024) {
        const furtherCompressed = await compressImage(file, 300, 300, 0.5);
        finalImageBlob = furtherCompressed.blob;
      }

      if (finalImageBlob.size > 2 * 1024 * 1024) {
        toast.error("Compressed image is still too large (max 2MB).");
        setIsUploading(false);
        if (user?.avatar) setAvatarPreview(user.avatar.startsWith("http") || user.avatar.startsWith("blob:") ? user.avatar : `${IMAGE_BASE_URL}/uploads/${user.avatar}`);
        else setAvatarPreview("");
        if (localPreviewObjectUrl) URL.revokeObjectURL(localPreviewObjectUrl);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        setIsUploading(false);
        navigate("/login");
        return;
      }

      const compressedFileForUpload = new File([finalImageBlob], file.name, { type: file.type, lastModified: Date.now() });
      const profileFormData = new FormData();
      profileFormData.append("avatar", compressedFileForUpload);
      profileFormData.append("name", formData.name);
      profileFormData.append("email", formData.email);
      profileFormData.append("bio", formData.bio || "");

      const response = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API_URL || '/api'}/users/me`,
        data: profileFormData,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Profile (including avatar) updated successfully!");
        // Check if user data and avatar path exist in response before using them
        if (response.data.user && typeof response.data.user === 'object') {
          if (response.data.user.avatar && typeof response.data.user.avatar === 'string') {
            const newAvatarRelativePath = response.data.user.avatar;
            const newAvatarFullUrl = IMAGE_BASE_URL ? `${IMAGE_BASE_URL}/uploads/${newAvatarRelativePath}` : `/uploads/${newAvatarRelativePath}`;
            setAvatarPreview(newAvatarFullUrl);
          }
          // Refresh user context
          if (refreshUser) {
            await refreshUser();
          } else if (updateProfile) {
            updateProfile(response.data.user);
          }
        } else {
          console.warn("User data was not found in the successful profile update response. Attempting general refresh if available.");
          if (refreshUser) {
            await refreshUser();
          }
        }
      } else {
        throw new Error(response.data.message || "Failed to update profile with avatar.");
      }
    } catch (err) {
      console.error("Avatar Upload / Profile Update Error:", err);
      let errorMessage = "Failed to update profile: ";
      if (err.response) {
        errorMessage += err.response.data?.message || err.message || "Server error";
      } else {
        errorMessage += err.message || "Unknown error";
      }
      toast.error(errorMessage);
      if (user?.avatar) {
        setAvatarPreview(user.avatar.startsWith("http") || user.avatar.startsWith("blob:") ? user.avatar : `${IMAGE_BASE_URL}/uploads/${user.avatar}`);
      } else {
        setAvatarPreview("");
      }
    } finally {
      setIsUploading(false);
      if (localPreviewObjectUrl) {
        URL.revokeObjectURL(localPreviewObjectUrl);
      }
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password.length > 0 && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password && formData.password.length > 0 && formData.password.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    try {
      const updatedData = { name: formData.name, email: formData.email, bio: formData.bio };
      if (formData.password && formData.password.length > 0) {
        updatedData.password = formData.password;
      }

      const token = localStorage.getItem("token");
      const response = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API_URL || '/api'}/users/me`,
        data: updatedData,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        // Check if user data exists in response before using it for context update
        if (response.data.user && typeof response.data.user === 'object') {
          if (refreshUser) {
            await refreshUser();
          } else if (updateProfile) {
            updateProfile(response.data.user);
          }
        } else {
            console.warn("User data was not found in the successful profile update response (text data). Attempting general refresh if available.");
            if (refreshUser) {
                await refreshUser();
            }
        }
      } else {
        throw new Error(response.data.message || "Failed to update profile (text data).");
      }
    } catch (err) {
      console.error("Profile Submit Error (text data):", err);
      toast.error(err.response?.data?.message || err.message || "Failed to update profile.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${process.env.REACT_APP_API_URL || '/api'}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Account deleted successfully. You will be logged out.");
        logout();
        navigate("/");
      } catch (err) {
        console.error("Delete Account Error:", err);
        toast.error(err.response?.data?.message || err.message || "Failed to delete account.");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-darker-bg flex items-center justify-center text-white p-4">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Access Denied</h2>
          <p className="mb-6">Please log in to view and manage your profile.</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-neon-green text-black font-semibold rounded-lg hover:bg-neon-green/80 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const hasValidAvatar = avatarPreview && !avatarPreview.includes("undefined") && !avatarPreview.endsWith("/uploads/");

  return (
    <div className="min-h-screen bg-darker-bg text-white overflow-hidden">
      <div className="h-screen flex flex-col">
        <div className="flex-grow overflow-auto py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-glass-dark rounded-xl shadow-2xl overflow-hidden border border-neon-green/20">
              <div className="p-6 sm:p-8">
                <h1 className="text-3xl font-bold mb-8 text-center sm:text-left text-neon-green">Profile Settings</h1>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div
                        className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center text-white
                          ${hasValidAvatar ? "bg-cover bg-center" : getAvatarColor(user.name)} 
                          border-2 border-gray-600 overflow-hidden shadow-lg`}
                        style={hasValidAvatar ? { backgroundImage: `url(${avatarPreview})` } : {}}
                      >
                        {!hasValidAvatar && (
                          <span className="text-5xl font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                          </span>
                        )}
                      </div>
                      <label
                        htmlFor="avatarUpload"
                        className="absolute -bottom-2 -right-2 bg-neon-green p-3 rounded-full shadow-md cursor-pointer hover:bg-neon-green/80 transition text-black"
                        title="Change Profile Picture"
                      >
                        {isUploading ? (
                          <UploadingSpinner />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                        <input
                          type="file"
                          id="avatarUpload"
                          className="hidden"
                          onChange={handleAvatarUpload}
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    <h2 className="text-2xl font-semibold text-center">{user.name}</h2>
                    <p className="text-gray-400 text-center">{user.email}</p>
                    <span
                      className={`mt-1 px-3 py-1 text-xs font-medium rounded-full capitalize ${
                        user.role === "admin" ? "bg-purple-500/30 text-purple-300"
                        : user.role === "seller" ? "bg-blue-500/30 text-blue-300"
                        : "bg-gray-500/30 text-gray-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="w-full md:w-2/3">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                          className="w-full px-4 py-2.5 bg-dark-bg/70 border border-neon-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-white placeholder-gray-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                          className="w-full px-4 py-2.5 bg-dark-bg/70 border border-neon-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-white placeholder-gray-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                        <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows="4"
                          className="w-full px-4 py-2.5 bg-dark-bg/70 border border-neon-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-white placeholder-gray-500"
                          placeholder="Tell us a little about yourself..."
                        />
                      </div>
                      <div className="pt-6 border-t border-neon-green/20">
                        <h3 className="text-lg font-medium mb-4 text-neon-green/80">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}
                              className="w-full px-4 py-2.5 bg-dark-bg/70 border border-neon-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-white placeholder-gray-500"
                              placeholder="Leave blank to keep current"
                            />
                          </div>
                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                              className="w-full px-4 py-2.5 bg-dark-bg/70 border border-neon-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green/50 text-white placeholder-gray-500"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-4 pt-6">
                        <button type="button" onClick={() => navigate(-1)}
                          className="px-6 py-2.5 border border-neon-green/50 text-neon-green rounded-lg hover:bg-neon-green/10 transition duration-150">
                          Cancel
                        </button>
                        <button type="submit"
                          className="px-6 py-2.5 bg-neon-green text-black font-semibold rounded-lg hover:bg-neon-green/80 hover:shadow-neon-green-glow transition duration-150">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-neon-green/20">
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h3>
                  <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="font-medium text-red-300">Delete Account</h4>
                        <p className="text-sm text-red-400/80 mt-1 max-w-md">
                          Once you delete your account, all your data will be permanently removed. This action cannot be undone.
                        </p>
                      </div>
                      <button type="button" onClick={handleDeleteAccount}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-150 whitespace-nowrap self-start sm:self-center">
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
