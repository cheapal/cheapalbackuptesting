"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import io from "socket.io-client"
import { toast } from "react-toastify"
import { useAuth } from "../context/authContext"
import { listingService, sellerService, notificationService, paymentService, chatService } from "../services/apiService"
import NewCustomToast from "../components/NewCustomToast"
import { loadStripe } from "@stripe/stripe-js"
import { stripeConnectService } from "../services/apiService"
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"
import PayoutDashboard from "../components/PayoutDashboard"

loadStripe('pk_test_your_stripe_key').then(stripe => console.log(stripe));

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const colors = {
  orange: "#ED7C30",
  blue: "#4473C5",
  grey: "#A4A5A4",
  yellow: "#F3B602",
  purple: "#8B5CF6",
  red: "#EF4444",
  cyan: "#06B6D4",
  gradientOrange: "rgba(236, 125, 48, 0.4)",
  gradientBlue: "rgba(66, 115, 197, 0.4)",
  green: "#10B981",
  turquoise: "#14B8A6",
  pink: "#EC4899",
  darkSecondary: "#374151",
  neonGreen: "#39FF14",
}

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
)

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
)

const AnalyticsIcon = () => (
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
      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
    />
  </svg>
)

const OrdersIcon = () => (
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
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
)

const PayoutsIcon = () => (
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
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
)

const AnimatedGradientBackground = () => {
  useEffect(() => {
    const particlesContainer = document.getElementById("particles-container-seller")
    if (!particlesContainer) return
    const particleCount = 30
    const existingParticles = particlesContainer.querySelectorAll(".particle")
    existingParticles.forEach((p) => p.remove())

    const createParticle = () => {
      const particle = document.createElement("div")
      particle.className = "particle"
      const size = Math.random() * 2.5 + 0.5
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      resetParticle(particle)
      particlesContainer.appendChild(particle)
      animateParticle(particle)
    }
    const resetParticle = (particle) => {
      const posX = Math.random() * 100
      const posY = Math.random() * 100
      particle.style.left = `${posX}%`
      particle.style.top = `${posY}%`
      particle.style.opacity = "0"
      particle.style.transform = "scale(0.5)"
      return { x: posX, y: posY }
    }
    const animateParticle = (particle) => {
      const duration = Math.random() * 18 + 12
      const delay = Math.random() * 12
      setTimeout(() => {
        if (!particlesContainer || !particlesContainer.contains(particle)) return
        particle.style.transition = `all ${duration}s linear`
        particle.style.opacity = (Math.random() * 0.2 + 0.03).toString()
        particle.style.transform = "scale(1)"
        const moveX = Number.parseFloat(particle.style.left) + (Math.random() * 40 - 20)
        const moveY = Number.parseFloat(particle.style.top) - (Math.random() * 50 + 15)
        particle.style.left = `${moveX}%`
        particle.style.top = `${moveY}%`
        setTimeout(() => {
          if (particlesContainer && particlesContainer.contains(particle)) {
            animateParticle(particle)
          }
        }, duration * 1000)
      }, delay * 1000)
    }
    for (let i = 0; i < particleCount; i++) createParticle()

    const spheres = document.querySelectorAll(".gradient-sphere-seller")
    let animationFrameId
    const handleMouseMove = (e) => {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = requestAnimationFrame(() => {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 15
        const moveY = (e.clientY / window.innerHeight - 0.5) * 15
        spheres.forEach((sphere) => {
          sphere.style.transform = `translate(${moveX}px, ${moveY}px)`
        })
      })
    }
    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
      if (particlesContainer) particlesContainer.innerHTML = ""
    }
  }, [])

  return (
    <>
      <div className="gradient-background">
        <div className="gradient-sphere sphere-1 gradient-sphere-seller"></div>
        <div className="gradient-sphere sphere-2 gradient-sphere-seller"></div>
        <div className="gradient-sphere sphere-3 gradient-sphere-seller"></div>
        <div className="glow"></div>
        <div className="grid-overlay"></div>
        <div className="noise-overlay"></div>
        <div className="particles-container" id="particles-container-seller"></div>
      </div>
    </>
  )
}

const LoadingSpinner = ({ size = "h-10 w-10", color = "border-neon-purple" }) => (
  <div className="flex justify-center items-center py-16 h-full">
    <div className={`animate-spin rounded-full ${size} border-t-2 border-b-2 ${color}`}></div>
  </div>
)

const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-700/10 border border-red-700/30 text-red-300 p-4 rounded-lg text-center my-6 mx-auto max-w-md shadow-lg">
    <p className="font-medium">Oops! Something went wrong.</p>
    <p className="text-sm">{message || "An error occurred."}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-3 px-4 py-1.5 bg-red-600/50 hover:bg-red-600/70 text-white text-xs font-semibold rounded-md transition-colors"
      >
        Retry
      </button>
    )}
  </div>
)

const SellerDashboard = () => {
  const { user: currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("listings")
  const [loading, setLoading] = useState({
    listings: true,
    analytics: true,
    payouts: true,
    orders: true,
    notifications: true,
  })
  const [error, setError] = useState({
    listings: null,
    analytics: null,
    payouts: null,
    orders: null,
    notifications: null,
  })

  // Listings State
  const [listings, setListings] = useState([])
  const [showNewListingModal, setShowNewListingModal] = useState(false)
  const [isSubmittingListing, setIsSubmittingListing] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState("")
  const [processedImageFile, setProcessedImageFile] = useState(null)
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    price: "",
    category: "streaming",
    duration: "1 month",
    image: null,
    id: null,
    autoReply: "",
  })

  const [isSubmittingBid, setIsSubmittingBid] = useState(false)
  const [showPromoteModal, setShowPromoteModal] = useState(false);
const [promoteListing, setPromoteListing] = useState(null);
const [bidData, setBidData] = useState({
  mainRank: "",
  homepageFeatured: "",
});


  // Analytics State
  const [analyticsData, setAnalyticsData] = useState({
    revenue: { value: 0, change: 0 },
    orders: { value: 0, change: 0 },
    customers: { value: 0, change: 0 },
    avgOrderValue: { value: 0, change: 0 },
    revenueByMonth: [],
    ordersByCategory: [],
    customerRetention: [],
  })
  const [analyticsDays, setAnalyticsDays] = useState(30)

  // Orders State
  const [orders, setOrders] = useState([])
  const [orderFilter, setOrderFilter] = useState("all")
  const [ordersPage, setOrdersPage] = useState(1)
  const [totalOrderPages, setTotalOrderPages] = useState(1)

  // Notifications State
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false)

  // Refs for dropdowns
  const notificationDropdownRef = useRef(null)
  const userDropdownRef = useRef(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace("/api", "")
  const TARGET_IMAGE_WIDTH = 800
  const TARGET_IMAGE_HEIGHT = 450
  const TARGET_ASPECT_RATIO = TARGET_IMAGE_WIDTH / TARGET_IMAGE_HEIGHT
  const IMAGE_QUALITY = 0.85

  const getInitials = (name = "") =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"

  const fetchMyListings = useCallback(async () => {
    if (!currentUser) return
    setLoading((prev) => ({ ...prev, listings: true }))
    setError((prev) => ({ ...prev, listings: null }))
    try {
      const response = await listingService.getMyListings()
      console.log("[SellerDashboard] fetchMyListings: Response:", JSON.stringify(response, null, 2))
      if (response?.success && Array.isArray(response.data)) {
        setListings(response.data)
      } else if (Array.isArray(response)) {
        setListings(response)
      } else {
        console.warn("[SellerDashboard] fetchMyListings: Unexpected response format:", response)
        setListings([])
        setError((prev) => ({ ...prev, listings: "No listings found or unexpected data format." }))
      }
    } catch (err) {
      console.error("[SellerDashboard] Failed to fetch listings:", err)
      setError((prev) => ({ ...prev, listings: err.responsePayload?.message || err.message || "Failed to fetch your listings." }))
      setListings([])
      toast(({ closeToast }) => (
        <NewCustomToast
          type="error"
          headline="Listings Error"
          text={err.responsePayload?.message || err.message || "Failed to load your listings."}
          closeToast={closeToast}
        />
      ))
    } finally {
      setLoading((prev) => ({ ...prev, listings: false }))
    }
  }, [currentUser])

  const fetchAnalytics = useCallback(
    async (days = 30) => {
      if (!currentUser) return
      setLoading((prev) => ({ ...prev, analytics: true }))
      setError((prev) => ({ ...prev, analytics: null }))
      const defaultAnalyticsData = {
        revenue: { value: 0, change: 0 },
        orders: { value: 0, change: 0 },
        customers: { value: 0, change: 0 },
        avgOrderValue: { value: 0, change: 0 },
        revenueByMonth: [],
        ordersByCategory: [],
        customerRetention: [],
      }
      try {
        const response = await sellerService.getAnalytics(days)
        console.log("[SellerDashboard] fetchAnalytics: Raw API response:", JSON.stringify(response, null, 2))
        if (response?.success && response.data && typeof response.data === "object") {
          const validatedData = {
            revenue:
              response.data.revenue && typeof response.data.revenue === "object"
                ? {
                    value: Number(response.data.revenue.value) || 0,
                    change: Number(response.data.revenue.change) || 0,
                  }
                : { value: 0, change: 0 },
            orders:
              response.data.orders && typeof response.data.orders === "object"
                ? {
                    value: Number(response.data.orders.value) || 0,
                    change: Number(response.data.orders.change) || 0,
                  }
                : { value: 0, change: 0 },
            customers:
              response.data.customers && typeof response.data.customers === "object"
                ? {
                    value: Number(response.data.customers.value) || 0,
                    change: Number(response.data.customers.change) || 0,
                  }
                : { value: 0, change: 0 },
            avgOrderValue:
              response.data.avgOrderValue && typeof response.data.avgOrderValue === "object"
                ? {
                    value: Number(response.data.avgOrderValue.value) || 0,
                    change: Number(response.data.avgOrderValue.change) || 0,
                  }
                : { value: 0, change: 0 },
            revenueByMonth: Array.isArray(response.data.revenueByMonth) ? response.data.revenueByMonth : [],
            ordersByCategory: Array.isArray(response.data.ordersByCategory) ? response.data.ordersByCategory : [],
            customerRetention: Array.isArray(response.data.customerRetention) ? response.data.customerRetention : [],
          }
          setAnalyticsData(validatedData)
        } else {
          setError((prev) => ({ ...prev, analytics: "No analytics data found or unexpected format." }))
          setAnalyticsData(defaultAnalyticsData)
        }
      } catch (err) {
        setError((prev) => ({
          ...prev,
          analytics: err.response?.data?.message || err.message || "Failed to fetch analytics data.",
        }))
        setAnalyticsData(defaultAnalyticsData)
      } finally {
        setLoading((prev) => ({ ...prev, analytics: false }))
      }
    },
    [currentUser],
  )

  const fetchOrdersData = useCallback(
    async (filter = "all", page = 1) => {
      if (!currentUser) return
      setLoading((prev) => ({ ...prev, orders: true }))
      setError((prev) => ({ ...prev, orders: null }))
      try {
        const response = await sellerService.getOrders(filter, page)
        console.log("[SellerDashboard] fetchOrdersData: Response:", JSON.stringify(response, null, 2))
        if (Array.isArray(response.orders)) {
          setOrders(response.orders)
          setTotalOrderPages(response.totalPages || 1)
        } else {
          setOrders([])
          setTotalOrderPages(1)
          setError((prev) => ({
            ...prev,
            orders: response?.message || "No orders found or unexpected data format.",
          }))
        }
      } catch (err) {
        setError((prev) => ({
          ...prev,
          orders: err.responsePayload?.message || err.message || "Failed to fetch orders. Please try again.",
        }))
        setOrders([])
        setTotalOrderPages(1)
      } finally {
        setLoading((prev) => ({ ...prev, orders: false }))
      }
    },
    [currentUser],
  )

  const handleChatWithBuyer = async (buyerId, orderId) => {
    if (!buyerId) {
      toast(({ closeToast }) => (
        <NewCustomToast
          type="warning"
          headline="Cannot Start Chat"
          text="Buyer information is missing."
          closeToast={closeToast}
        />
      ))
      return
    }
    try {
      const response = await chatService.accessChat(buyerId, { orderId })
      if (response?.success && response.data?._id) {
        navigate(`/chat/${response.data._id}`)
      } else {
        throw new Error(response?.message || "Could not initiate chat.")
      }
    } catch (err) {
      console.error("[SellerDashboard] handleChatWithBuyer: Error:", err)
      toast(({ closeToast }) => (
        <NewCustomToast
          type="error"
          headline="Chat Error"
          text={err.message || "Could not start chat with the buyer."}
          closeToast={closeToast}
        />
      ))
    }
  }

  useEffect(() => {
    fetchOrdersData()
  }, [fetchOrdersData])

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await sellerService.updateOrderStatus(orderId, status)
      toast(({ closeToast }) => (
        <NewCustomToast
          type="success"
          headline="Order Updated"
          text={`Order ${orderId.slice(-8)} status updated to ${status}.`}
          closeToast={closeToast}
        />
      ))
      fetchOrdersData(orderFilter, ordersPage)
    } catch (err) {
      console.error("[SellerDashboard] Failed to update order status:", err)
      toast(({ closeToast }) => (
        <NewCustomToast
          type="error"
          headline="Update Failed"
          text={err.response?.data?.message || err.message || "Could not update order status."}
          closeToast={closeToast}
        />
      ))
    }
  }

  const fetchNotificationsData = useCallback(async () => {
    if (!currentUser) return
    setLoading((prev) => ({ ...prev, notifications: true }))
    setError((prev) => ({ ...prev, notifications: null }))
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
      setError((prev) => ({
        ...prev,
        notifications: err.response?.data?.message || err.message || "Failed to fetch notifications.",
      }))
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading((prev) => ({ ...prev, notifications: false }))
    }
  }, [currentUser])

  const handleNewListingChange = (e) => {
    const { name, value } = e.target
    setNewListing((prev) => ({ ...prev, [name]: name === "autoReply" ? value.trim() : value }))
  }

  const resetNewListingForm = () => {
    setNewListing({
      title: "",
      description: "",
      price: "",
      category: "streaming",
      duration: "1 month",
      image: null,
      id: null,
      autoReply: "",
    })
    setIsSubmittingListing(false)
    setShowNewListingModal(false)
    setError((prev) => ({ ...prev, listings: null }))
    setImagePreviewUrl("")
    setProcessedImageFile(null)
    const fileInput = document.getElementById("image-upload-processed")
    if (fileInput) fileInput.value = ""
  }

  const handleImageFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      setImagePreviewUrl("")
      setProcessedImageFile(null)
      return
    }
    if (!file.type.startsWith("image/")) {
      toast(({ closeToast }) => (
        <NewCustomToast
          type="warning"
          headline="Invalid File"
          text="Please select an image file."
          closeToast={closeToast}
        />
      ))
      setImagePreviewUrl("")
      setProcessedImageFile(null)
      e.target.value = null
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        try {
          processImageToCanvas(img, canvas, TARGET_IMAGE_WIDTH, TARGET_IMAGE_HEIGHT, TARGET_ASPECT_RATIO)
          const dataUrl = canvas.toDataURL("image/png")
          setImagePreviewUrl(dataUrl)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                setProcessedImageFile(new File([blob], "processed_listing_image.png", { type: "image/png" }))
                toast(({ closeToast }) => (
                  <NewCustomToast
                    type="info"
                    headline="Image Ready"
                    text="Image processed for upload."
                    closeToast={closeToast}
                  />
                ))
              } else {
                toast(({ closeToast }) => (
                  <NewCustomToast
                    type="error"
                    headline="Processing Error"
                    text="Could not convert image to Blob."
                    closeToast={closeToast}
                  />
                ))
                setImagePreviewUrl("")
                setProcessedImageFile(null)
              }
            },
            "image/png",
            IMAGE_QUALITY,
          )
        } catch (error) {
          console.error("Error processing image:", error)
          toast(({ closeToast }) => (
            <NewCustomToast
              type="error"
              headline="Processing Error"
              text="Could not process image."
              closeToast={closeToast}
            />
          ))
          setImagePreviewUrl("")
          setProcessedImageFile(null)
        }
      }
      img.onerror = () => {
        toast(({ closeToast }) => (
          <NewCustomToast type="error" headline="Load Error" text="Could not load image." closeToast={closeToast} />
        ))
        setImagePreviewUrl("")
        setProcessedImageFile(null)
      }
      img.src = event.target.result
    }
    reader.onerror = () => {
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="File Read Error" text="Could not read file." closeToast={closeToast} />
      ))
      setImagePreviewUrl("")
      setProcessedImageFile(null)
    }
    reader.readAsDataURL(file)
    e.target.value = null
  }

  const handleNewListingSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      toast(({ closeToast }) => (
        <NewCustomToast
          type="error"
          headline="Not Authenticated"
          text="Please log in to create a listing."
          closeToast={closeToast}
        />
      ))
      return
    }
    setIsSubmittingListing(true)
    setError((prev) => ({ ...prev, listings: null }))

    const validationErrors = []
    if (!newListing.title?.trim()) validationErrors.push("Title is required.")
    if (!newListing.description?.trim()) validationErrors.push("Description is required.")
    if (!newListing.price || isNaN(Number.parseFloat(newListing.price)) || Number.parseFloat(newListing.price) <= 0) {
      validationErrors.push("Price must be a valid positive number.")
    }
    if (!newListing.duration) validationErrors.push("Duration is required.")
    if (!newListing.category) validationErrors.push("Category is required.")
    if (!newListing.autoReply || newListing.autoReply.length < 1) {
      validationErrors.push("Auto-reply message is required and cannot be empty.")
    }
    if (!newListing.id && !processedImageFile) validationErrors.push("Image is required for new listings.")

    if (validationErrors.length > 0) {
      toast(({ closeToast }) => (
        <NewCustomToast
          type="warning"
          headline="Missing Information"
          text={validationErrors.join(" ")}
          closeToast={closeToast}
        />
      ))
      setIsSubmittingListing(false)
      return
    }

    const formData = new FormData()
    formData.append("title", newListing.title.trim())
    formData.append("description", newListing.description.trim())
    formData.append("price", Number.parseFloat(newListing.price).toFixed(2))
    formData.append("category", newListing.category)
    formData.append("duration", newListing.duration)
    formData.append("autoReply", newListing.autoReply)

    if (processedImageFile) {
      formData.append("image", processedImageFile, processedImageFile.name)
    }

    try {
      let response
      if (newListing.id) {
        response = await listingService.update(newListing.id, formData)
        toast(({ closeToast }) => (
          <NewCustomToast
            type="success"
            headline="Update Successful"
            text={response.message || "Listing updated! It may require re-approval."}
            closeToast={closeToast}
          />
        ))
      } else {
        response = await listingService.create(formData)
        toast(({ closeToast }) => (
          <NewCustomToast
            type="success"
            headline="Listing Created"
            text={response.message || "Listing created! Awaiting approval."}
            closeToast={closeToast}
          />
        ))
      }
      resetNewListingForm()
      fetchMyListings()
    } catch (err) {
      const errorMsg = err.responsePayload?.message || err.message || "Failed to save listing."
      const validationErrors = err.responsePayload?.errors
        ? err.responsePayload.errors.map((e) => e.message || e.msg || e).join(", ")
        : ""
      setError((prev) => ({
        ...prev,
        listings: validationErrors ? `${errorMsg}: ${validationErrors}` : errorMsg,
      }))
      toast(({ closeToast }) => (
        <NewCustomToast
          type="error"
          headline="Submission Failed"
          text={validationErrors ? `${errorMsg}: ${validationErrors}` : errorMsg}
          closeToast={closeToast}
        />
      ))
    } finally {
      setIsSubmittingListing(false)
    }
  }

  

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return
    setError((prev) => ({ ...prev, listings: null }))
    try {
      const response = await listingService.delete(id)
      toast(({ closeToast }) => (
        <NewCustomToast
          type="success"
          headline="Deleted"
          text={response.message || "Listing deleted successfully."}
          closeToast={closeToast}
        />
      ))
      fetchMyListings()
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to delete listing."
      setError((prev) => ({ ...prev, listings: errorMsg }))
      toast(({ closeToast }) => (
        <NewCustomToast type="error" headline="Deletion Failed" text={errorMsg} closeToast={closeToast} />
      ))
    }
  }

  const handleEditListing = (listing) => {
    setError((prev) => ({ ...prev, listings: null }))
    setNewListing({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
      duration: listing.duration || "1 month",
      image: listing.image,
      id: listing._id,
      autoReply: listing.autoReply || "",
    })
    setImagePreviewUrl("")
    setProcessedImageFile(null)
    setShowNewListingModal(true)
  }

 const handlePromoteListing = (listing) => {
  if (listing.status !== 'approved') {
    toast(({ closeToast }) => (
      <NewCustomToast
        type="warning"
        headline="Cannot Promote"
        text="Only approved listings can be promoted."
        closeToast={closeToast}
      />
    ));
    return;
  }
  if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
    toast(({ closeToast }) => (
      <NewCustomToast
        type="error"
        headline="Promotion Unavailable"
        text="Payment system is not configured. Please contact support."
        closeToast={closeToast}
      />
    ));
    return;
  }
  setPromoteListing(listing);
  setBidData({
    mainRank: "",
    homepageFeatured: "",
  });
  setShowPromoteModal(true);
};

const handleBidChange = (e) => {
  const { name, value } = e.target;
  setBidData((prev) => ({ ...prev, [name]: value }));
};

const handlePromoteSubmit = async (e) => {
  e.preventDefault();
  if (!currentUser || !promoteListing) {
    toast(({ closeToast }) => (
      <NewCustomToast
        type="error"
        headline="Not Authenticated"
        text="Please log in to promote a listing."
        closeToast={closeToast}
      />
    ));
    return;
  }
  setIsSubmittingBid(true);

  const validationErrors = [];
  const mainRank = parseInt(bidData.mainRank, 10);
  const homepageFeatured = parseFloat(bidData.homepageFeatured);

  if (mainRank && (isNaN(mainRank) || mainRank < 1)) {
    validationErrors.push("Main Ranked rank must be a positive integer (e.g., 1, 2, 3).");
  }
  if (homepageFeatured && (isNaN(homepageFeatured) || homepageFeatured < 5)) {
    validationErrors.push("Homepage Featured bid must be at least $5/week.");
  }
  if (!mainRank && !homepageFeatured) {
    validationErrors.push("At least one promotion type is required.");
  }

  if (validationErrors.length > 0) {
    toast(({ closeToast }) => (
      <NewCustomToast
        type="warning"
        headline="Invalid Input"
        text={validationErrors.join(" ")}
        closeToast={closeToast}
      />
    ));
    setIsSubmittingBid(false);
    return;
  }

  try {
    const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
      throw new Error("Payment system is not configured. Please contact support.");
    }
    const stripe = await loadStripe(stripeKey);
    if (!stripe) {
      throw new Error("Failed to initialize payment system.");
    }

    let mainRankResponse, homepageFeaturedResponse;

    if (mainRank) {
      mainRankResponse = await stripeConnectService.submitMainRankedBid({
        listingId: promoteListing._id,
        mainRank,
      });
      if (!mainRankResponse?.success) {
        throw new Error(mainRankResponse?.message || "Failed to submit Main Ranked bid.");
      }
      // Update listing state optimistically
      setListings((prev) =>
        prev.map((l) =>
          l._id === promoteListing._id ? { ...l, mainRank } : l
        )
      );
    }

    if (homepageFeatured) {
      homepageFeaturedResponse = await stripeConnectService.submitHomepageFeaturedBid({
        listingId: promoteListing._id,
        bidAmount: homepageFeatured,
      });
      if (!homepageFeaturedResponse?.success || !homepageFeaturedResponse.sessionId) {
        throw new Error(homepageFeaturedResponse?.message || "Failed to initiate Homepage Featured payment.");
      }
      const { error } = await stripe.redirectToCheckout({
        sessionId: homepageFeaturedResponse.sessionId,
      });
      if (error) {
        throw new Error(error.message || "Failed to redirect to payment.");
      }
    }

    // Show success for Main Ranked bid if no Homepage Featured bid
    if (mainRankResponse && !homepageFeatured) {
      toast(({ closeToast }) => (
        <NewCustomToast
          type="success"
          headline="Bid Submitted"
          text="Your Main Ranked bid has been submitted successfully."
          closeToast={closeToast}
        />
      ));
      setShowPromoteModal(false);
      fetchMyListings();
    }
  } catch (err) {
    console.error("[SellerDashboard] Promotion bid failed:", err);
    const errorMessage = err.message || "Failed to submit promotion bid. Please try again or contact support.";
    toast(({ closeToast }) => (
      <NewCustomToast
        type="error"
        headline="Bid Failed"
        text={errorMessage}
        closeToast={closeToast}
      />
    ));
  } finally {
    setIsSubmittingBid(false);
  }
};
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification._id)
        setNotifications((prev) => prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (err) {
        console.error("Failed to mark notification as read:", err)
        toast(({ closeToast }) => (
          <NewCustomToast
            type="error"
            headline="Error"
            text="Could not update notification status."
            closeToast={closeToast}
          />
        ))
      }
    }
    setShowNotificationsDropdown(false)
    if (notification.link && navigate) navigate(notification.link)
  }

  const handleOrderFilterChange = (newFilter) => {
    setOrderFilter(newFilter)
    setOrdersPage(1)
    fetchOrdersData(newFilter, 1)
  }

  const handleOrderPageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalOrderPages) {
      setOrdersPage(newPage)
      fetchOrdersData(orderFilter, newPage)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  function processImageToCanvas(image, canvas, targetWidth, targetHeight, targetAspectRatio) {
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      throw new Error("No 2d context")
    }
    canvas.width = targetWidth
    canvas.height = targetHeight
    const originalWidth = image.naturalWidth
    const originalHeight = image.naturalHeight
    const originalAspectRatio = originalWidth / originalHeight
    let sourceX = 0,
      sourceY = 0,
      sourceWidth = originalWidth,
      sourceHeight = originalHeight

    if (originalAspectRatio > targetAspectRatio) {
      sourceWidth = originalHeight * targetAspectRatio
      sourceX = (originalWidth - sourceWidth) / 2
    } else if (originalAspectRatio < targetAspectRatio) {
      sourceHeight = originalWidth / targetAspectRatio
      sourceY = (originalHeight - sourceHeight) / 2
    }
    ctx.imageSmoothingQuality = "high"
    ctx.clearRect(0, 0, targetWidth, targetHeight)
    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target) &&
        !event.target.closest("#notification-button-seller")
      ) {
        setShowNotificationsDropdown(false)
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        !event.target.closest("#user-menu-button-seller")
      ) {
        setShowUserDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (activeTab === "listings") {
      fetchMyListings()
    } else if (activeTab === "analytics") {
      fetchAnalytics(analyticsDays)
    }
  }, [activeTab, fetchMyListings, fetchAnalytics, analyticsDays])

  useEffect(() => {
    if (!currentUser?._id) return

    const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
      query: { userId: currentUser._id, userType: "seller" },
    })

    socket.on("connect", () => {
      console.log("Seller socket connected:", socket.id)
    })
    socket.on("disconnect", (reason) => console.log(`Seller socket disconnected: ${reason}`))

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err)
      toast(({ closeToast }) => (
        <NewCustomToast
          type="error"
          headline="Connection Issue"
          text={`Real-time connection failed: ${err.message}. Some features might be affected.`}
          closeToast={closeToast}
        />
      ))
    })

    socket.on("listing_status_updated", (data) => {
      toast(({ closeToast }) => (
        <NewCustomToast
          type={data.status === "approved" ? "success" : "error"}
          headline={`Listing ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`}
          text={data.message || `Your listing "${data.title}" was ${data.status}.`}
          closeToast={closeToast}
        />
      ))
      setListings((prev) => prev.map((l) => (l._id === data.listingId ? { ...l, status: data.status } : l)))
      fetchNotificationsData()
    })

    socket.on("new_order_for_seller", (orderData) => {
      toast(({ closeToast }) => (
        <NewCustomToast
          type="info"
          headline="New Order Received"
          text={`You have a new order for "${orderData.listingTitle}".`}
          closeToast={closeToast}
        />
      ))
      fetchOrdersData(orderFilter, ordersPage)
      fetchAnalytics(analyticsDays)
      fetchMyListings()
      fetchNotificationsData()
    })

    socket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 50))
      if (!notification.isRead) setUnreadCount((prev) => prev + 1)
      toast(({ closeToast }) => (
        <NewCustomToast
          type="info"
          headline={notification.title || "Notification"}
          text={notification.message}
          closeToast={closeToast}
        />
      ))
    })

    return () => {
      socket.disconnect()
    }
  }, [
    currentUser?._id,
    fetchOrdersData,
    fetchAnalytics,
    fetchNotificationsData,
    fetchMyListings,
    orderFilter,
    ordersPage,
    analyticsDays,
  ])

  useEffect(() => {
    if (currentUser) {
      fetchMyListings()
      fetchAnalytics(analyticsDays)
      fetchOrdersData(orderFilter, ordersPage)
      fetchNotificationsData()
    } else {
      setListings([])
      setAnalyticsData({
        revenue: { value: 0, change: 0 },
        orders: { value: 0, change: 0 },
        customers: { value: 0, change: 0 },
        avgOrderValue: { value: 0, change: 0 },
        revenueByMonth: [],
        ordersByCategory: [],
        customerRetention: [],
      })
      setOrders([])
      setNotifications([])
      setUnreadCount(0)
    }
  }, [currentUser])

  const tabItems = [
    { id: "listings", label: "My Listings", icon: ListingsIcon },
    { id: "analytics", label: "Analytics", icon: AnalyticsIcon },
    { id: "orders", label: "Manage Orders", icon: OrdersIcon },
    { id: "payouts", label: "Payouts", icon: PayoutsIcon },
  ]

  if (!currentUser) {
    return (
      <div className="min-h-screen text-gray-100 font-sans flex flex-col relative items-center justify-center">
        <AnimatedGradientBackground />
        <div className="relative z-10 p-8 bg-black/50 backdrop-blur-xl border border-gray-700/40 rounded-xl shadow-2xl text-center">
          <LoadingSpinner />
          <p className="mt-4 text-lg">Authenticating...</p>
          <p className="text-sm text-gray-400">
            Please wait or{" "}
            <Link to="/login" className="text-neon-purple hover:underline">
              login
            </Link>{" "}
            if you're not redirected.
          </p>
        </div>
      </div>
    )
  }

  const revenueChartData = {
    labels: analyticsData.revenueByMonth.map((item) => item.label),
    datasets: [
      {
        label: "Revenue ($)",
        data: analyticsData.revenueByMonth.map((item) => item.value),
        borderColor: colors.blue,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 200)
          gradient.addColorStop(0, colors.gradientBlue)
          gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
          return gradient
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.blue,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: colors.blue,
      },
    ],
  }

  const ordersChartData = {
    labels: analyticsData.ordersByCategory.map((item) => item.label),
    datasets: [
      {
        label: "Digital",
        data: analyticsData.ordersByCategory.map((item) => item.digital),
        backgroundColor: colors.blue,
        hoverBackgroundColor: "#2563EB",
      },
      {
        label: "Software",
        data: analyticsData.ordersByCategory.map((item) => item.software),
        backgroundColor: colors.green,
        hoverBackgroundColor: "#059669",
      },
      {
        label: "Services",
        data: analyticsData.ordersByCategory.map((item) => item.services),
        backgroundColor: colors.purple,
        hoverBackgroundColor: "#7C3AED",
      },
      {
        label: "Other",
        data: analyticsData.ordersByCategory.map((item) => item.other),
        backgroundColor: colors.orange,
        hoverBackgroundColor: "#D97706",
      },
    ],
  }

  const retentionChartData = {
    labels: analyticsData.customerRetention.map((item) => item.label),
    datasets: [
      {
        data: analyticsData.customerRetention.map((item) => item.value),
        backgroundColor: [colors.red, colors.cyan],
        hoverBackgroundColor: ["#DC2626", "#0891B2"],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#D1D5DB",
          font: { size: 14 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#4B5563",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9CA3AF" },
      },
      y: {
        grid: { color: "#4B5563" },
        ticks: { color: "#9CA3AF" },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#D1D5DB",
          font: { size: 14 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    cutout: "70%",
  }

  return (
    <div className="min-h-screen text-gray-100 font-sans flex flex-col relative">
      <AnimatedGradientBackground />

      <header className="bg-black/30 backdrop-blur-md shadow-lg sticky top-0 z-30 border-b border-gray-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <Link to="/" className="text-3xl font-bold tracking-tight transition-transform hover:scale-105">
            <span className="text-white">Cheap</span>
            <span className="text-neon-purple">al</span>
          </Link>
          <div className="flex items-center space-x-3 sm:space-x-5">
            <div className="relative" ref={notificationDropdownRef}>
              <button
                id="notification-button-seller"
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className="p-2 text-gray-300 hover:text-neon-purple transition-colors rounded-full hover:bg-purple-500/20 focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
                aria-label="Notifications"
              >
                <BellIcon />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[0.6rem] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-gray-900">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotificationsDropdown && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-700 text-lg font-semibold text-neon-purple">
                    Notifications
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {loading.notifications ? (
                      <div className="p-4 text-center">
                        <LoadingSpinner size="h-6 w-6" />
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((note) => (
                        <div
                          key={note._id}
                          onClick={() => handleNotificationClick(note)}
                          className={`block p-4 border-b border-gray-700/50 hover:bg-purple-600/20 transition-colors cursor-pointer ${!note.isRead ? "bg-purple-700/10" : ""}`}
                        >
                          <p className="text-sm text-gray-100 leading-tight font-medium">
                            {note.title || "Notification"}
                          </p>
                          <p className="text-sm text-gray-300 leading-tight">{note.message}</p>
                          <p className="text-xs text-gray-400 mt-1.5">
                            {new Date(note.createdAt || Date.now()).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-400">No new notifications.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="group relative" ref={userDropdownRef}>
              <button
                id="user-menu-button-seller"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 p-1.5 pr-3 rounded-lg hover:bg-purple-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
              >
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold ring-2 ring-purple-500/50 overflow-hidden">
                  {currentUser?.avatar ? (
                    <img
                      src={`${IMAGE_BASE_URL}/Uploads/${currentUser.avatar}`}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(currentUser?.name)
                  )}
                </div>
                <span className="hidden md:inline text-sm font-medium group-hover:text-neon-purple">
                  {currentUser?.name || "Seller"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-gray-400 group-hover:text-neon-purple transition-transform ${showUserDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm text-gray-300 hover:bg-purple-600/30 hover:text-neon-purple transition-colors"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {!loading.user && currentUser && !currentUser.isVerified && (
        <div className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 backdrop-blur-md border-b border-purple-500/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-6">
            <div className="flex items-center text-center sm:text-left mb-3 sm:mb-0">
              <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-1.5 rounded-full mr-3 shadow-lg shadow-purple-500/20 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Get Verified!</h3>
                <p className="text-purple-200 text-sm">Add a verification badge to your profile for $10.</p>
              </div>
            </div>
            <button
              onClick={async () => {
                if (!currentUser || !currentUser._id) {
                  toast.error("You must be logged in to apply for verification.")
                  return
                }
                try {
                  const response = await paymentService.createVerificationCheckoutSession({
                    userId: currentUser._id,
                    email: currentUser.email,
                  })
                  if (response && response.success && response.sessionId) {
                    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
                    if (!stripe) {
                      throw new Error("Stripe.js failed to load.")
                    }
                    const { error } = await stripe.redirectToCheckout({
                      sessionId: response.sessionId,
                    })
                    if (error) {
                      throw new Error(error.message || "Failed to redirect to payment.")
                    }
                  } else {
                    throw new Error(response?.message || "Could not initiate verification payment.")
                  }
                } catch (err) {
                  console.error("Verification payment error:", err)
                  toast.error(err.message || "An error occurred during the verification process.")
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/20 font-medium flex items-center"
            >
              Apply for $10
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto p-4 sm:p-6 lg:px-8 flex-grow relative z-10">
        <div className="mb-8 mt-6">
          <div className="sm:hidden">
            <select
              id="seller-tabs-mobile"
              name="seller-tabs-mobile"
              className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-700/50 bg-gray-800/70 text-white focus:outline-none focus:ring-neon-purple focus:border-neon-purple sm:text-sm rounded-lg shadow-md backdrop-blur-sm"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              {tabItems.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-700/50">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabItems.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-neon-purple text-neon-purple"
                          : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon />
                        {tab.label}
                      </div>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>

        <div className="relative">
          {activeTab === "listings" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">My Listings</h2>
                  <p className="text-gray-400 mt-1">Manage your digital products and services</p>
                </div>
                <button
                  onClick={() => setShowNewListingModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/20 font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Listing
                </button>
              </div>

              {error.listings && <ErrorMessage message={error.listings} onRetry={fetchMyListings} />}

              {loading.listings ? (
                <LoadingSpinner />
              ) : listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <div
                      key={listing._id}
                      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all shadow-lg hover:shadow-purple-500/10"
                    >
                      <div className="relative">
                        <img
                          src={
                            listing.image
                              ? `${IMAGE_BASE_URL}/Uploads/${listing.image}`
                              : "/placeholder.svg?height=200&width=300"
                          }
                          alt={listing.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              listing.status === "approved"
                                ? "bg-green-950 text-green-300"
                                : listing.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {listing.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{listing.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{listing.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-2xl font-bold text-neon-purple">${listing.price}</span>
                          <span className="text-sm text-gray-400">{listing.duration}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEditListing(listing)}
                            className="flex-1 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing._id)}
                            className="flex-1 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handlePromoteListing(listing)}
                            className="flex-1 px-4 py-2 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors text-sm font-medium"
                            disabled={listing.status !== "approved"}
                          >
                            Promote
                          </button>
                        </div>
                        {(listing.mainRankBid || listing.homepageFeaturedBid) && (
                          <div className="mt-4 text-sm text-gray-400">
                            {listing.mainRankBid && (
                              <p>Main Ranked Bid: ${listing.mainRankBid}/week (Rank: {listing.mainRank || "N/A"})</p>
                            )}
                            {listing.homepageFeaturedBid && (
                              <p>Homepage Featured Bid: ${listing.homepageFeaturedBid}/week</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No listings yet</h3>
                  <p className="text-gray-400 mb-6">Create your first listing to start selling</p>
                  <button
                    onClick={() => setShowNewListingModal(true)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create Your First Listing
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Analytics</h2>
                  <p className="text-gray-400 mt-1">Track your performance and sales</p>
                </div>
                <select
                  value={analyticsDays}
                  onChange={(e) => {
                    const days = Number.parseInt(e.target.value)
                    setAnalyticsDays(days)
                    fetchAnalytics(days)
                  }}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </div>

              {error.analytics && (
                <ErrorMessage message={error.analytics} onRetry={() => fetchAnalytics(analyticsDays)} />
              )}

              {loading.analytics ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Total Revenue</p>
                          <p className="text-2xl font-bold text-white">${analyticsData.revenue.value}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-4">
                        <span
                          className={`text-sm ${analyticsData.revenue.change >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {analyticsData.revenue.change >= 0 ? "+" : ""}
                          {analyticsData.revenue.change}%
                        </span>
                        <span className="text-gray-400 text-sm ml-2">vs previous period</span>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Total Orders</p>
                          <p className="text-2xl font-bold text-white">{analyticsData.orders.value}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span
                            className={`text-sm ${analyticsData.orders.change >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {analyticsData.orders.change >= 0 ? "+" : ""}
                            {analyticsData.orders.change}%
                          </span>
                          <span className="text-gray-400 text-sm ml-2">vs previous period</span>
                        </div>
                      </div>

                      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Customers</p>
                            <p className="text-2xl font-bold text-white">{analyticsData.customers.value}</p>
                          </div>
                          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-purple-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span
                            className={`text-sm ${analyticsData.customers.change >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {analyticsData.customers.change >= 0 ? "+" : ""}
                            {analyticsData.customers.change}%
                          </span>
                          <span className="text-gray-400 text-sm ml-2">vs previous period</span>
                        </div>
                      </div>

                      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Avg Order Value</p>
                            <p className="text-2xl font-bold text-white">${analyticsData.avgOrderValue.value}</p>
                          </div>
                          <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-orange-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span
                            className={`text-sm ${analyticsData.avgOrderValue.change >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {analyticsData.avgOrderValue.change >= 0 ? "+" : ""}
                            {analyticsData.avgOrderValue.change}%
                          </span>
                          <span className="text-gray-400 text-sm ml-2">vs previous period</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Revenue Over Time</h3>
                        <div className="h-64">
                          {analyticsData.revenueByMonth.length > 0 ? (
                            <Line data={revenueChartData} options={chartOptions} />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              No revenue data available
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Orders by Category</h3>
                        <div className="h-64">
                          {analyticsData.ordersByCategory.length > 0 ? (
                            <Bar data={ordersChartData} options={chartOptions} />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              No order data available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Manage Orders</h2>
                    <p className="text-gray-400 mt-1">Track and update your customer orders</p>
                  </div>
                  <select
                    value={orderFilter}
                    onChange={(e) => handleOrderFilterChange(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {error.orders && (
                  <ErrorMessage message={error.orders} onRetry={() => fetchOrdersData(orderFilter, ordersPage)} />
                )}

                {loading.orders ? (
                  <LoadingSpinner />
                ) : orders.length > 0 ? (
                  <>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-700/50">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Order
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Customer
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Product
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700/50">
                            {orders.map((order) => (
                              <tr key={order._id} className="hover:bg-gray-700/30">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">#{order._id.slice(-8)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-white">{order.buyer?.name || "Unknown"}</div>
                                  <div className="text-sm text-gray-400">{order.buyer?.email || ""}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-white">
                                    {order.listingTitle || "Listing Data Missing"}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">${order.amount}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      order.status === "completed"
                                        ? "bg-green-500/20 text-green-400"
                                        : order.status === "processing"
                                          ? "bg-blue-500/20 text-blue-400"
                                          : order.status === "pending"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : "bg-red-500/20 text-red-400"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <select
                                    value={order.status}
                                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                    className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                  <button
                                    onClick={() => handleChatWithBuyer(order.buyer?._id, order._id)}
                                    className="ml-2 px-3 py-1 bg-purple-600/20 text-purple-400 rounded text-sm hover:bg-purple-600/30"
                                  >
                                    Chat
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {totalOrderPages > 1 && (
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleOrderPageChange(ordersPage - 1)}
                          disabled={ordersPage === 1}
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                        >
                          Previous
                        </button>
                        <span className="text-gray-400">
                          Page {ordersPage} of {totalOrderPages}
                        </span>
                        <button
                          onClick={() => handleOrderPageChange(ordersPage + 1)}
                          disabled={ordersPage === totalOrderPages}
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
                    <p className="text-gray-400">Orders will appear here when customers purchase your listings</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "payouts" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Payouts</h2>
                  <p className="text-gray-400 mt-1">Manage your payout settings and view payment history</p>
                </div>
                <PayoutDashboard />
              </div>
            )}
          </div>

          {showNewListingModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {newListing.id ? "Edit Listing" : "Create New Listing"}
                  </h2>
                  <button onClick={resetNewListingForm} className="text-gray-400 hover:text-white text-2xl">
                    ×
                  </button>
                </div>

                <form onSubmit={handleNewListingSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newListing.title}
                      onChange={handleNewListingChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter listing title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={newListing.description}
                      onChange={handleNewListingChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Describe your product or service"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price ($) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={newListing.price}
                        onChange={handleNewListingChange}
                        min="0.01"
                        step="0.01"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="category"
                        value={newListing.category}
                        onChange={handleNewListingChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="streaming">Streaming</option>
                        <option value="software">Software</option>
                        <option value="gaming">Gaming</option>
                        <option value="education">Education</option>
                        <option value="productivity">Productivity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="duration"
                      value={newListing.duration}
                      onChange={handleNewListingChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select duration</option>
                      <option value="1 month">1 Month</option>
                      <option value="3 months">3 Months</option>
                      <option value="6 months">6 Months</option>
                      <option value="1 year">1 Year</option>
                      <option value="lifetime">Lifetime</option>
                    </select>
                  </div>

                  <div>
                    <div className="mb-2 p-3 bg-blue-900/30 border border-blue-700 rounded-md text-sm text-blue-200">
                      <p className="font-semibold">Why provide an auto-reply message?</p>
                      <p>
                        Including login details (e.g., username, password, access link) ensures buyers receive immediate
                        access to their digital product upon payment, reducing support queries.
                      </p>
                    </div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Auto-Reply Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="autoReply"
                      value={newListing.autoReply}
                      onChange={handleNewListingChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter login details (e.g., Username: user123, Password: pass456, Access Link: https://example.com/login)"
                      required
                      onBlur={(e) => {
                        const value = e.target.value.trim()
                        if (!value) {
                          toast(({ closeToast }) => (
                            <NewCustomToast
                              type="warning"
                              headline="Invalid Input"
                              text="Auto-reply message cannot be empty or just whitespace."
                              closeToast={closeToast}
                            />
                          ))
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Image {!newListing.id && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="file"
                      id="image-upload-processed"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {imagePreviewUrl && (
                      <div className="mt-4">
                        <img
                          src={imagePreviewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {processedImageFile && (
                      <div className="mt-2 text-sm text-gray-400">Selected: {processedImageFile.name}</div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={resetNewListingForm}
                      className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingListing}
                      className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmittingListing ? "Saving..." : newListing.id ? "Update Listing" : "Create Listing"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

         {showPromoteModal && promoteListing && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Promote Listing: {promoteListing.title}</h2>
        <button
          onClick={() => setShowPromoteModal(false)}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <form onSubmit={handlePromoteSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Main Ranked Position (e.g., 1, 2, 3)
          </label>
          <input
            type="number"
            name="mainRank"
            value={bidData.mainRank}
            onChange={handleBidChange}
            min="1"
            step="1"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter desired rank (e.g., 1)"
          />
          <p className="text-xs text-gray-400 mt-1">
            Request a specific rank on SubscriptionPage and category pages. Lower numbers = higher placement.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Homepage Featured Bid ($/week, min $5)
          </label>
          <input
            type="number"
            name="homepageFeatured"
            value={bidData.homepageFeatured}
            onChange={handleBidChange}
            min="5"
            step="0.01"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter bid amount (e.g., 5.00)"
          />
          <p className="text-xs text-gray-400 mt-1">
            Bid for featured placement on the homepage. Higher bids secure higher ranks.
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setShowPromoteModal(false)}
            className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmittingBid || !process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
            className="flex-1 px-6 py-3 bg-neon-green text-black rounded-lg hover:bg-neon-green/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmittingBid ? "Submitting..." : "Submit Bid"}
          </button>
        </div>
      </form>
    </div>
  </div>  
)}
        </main>
      </div>
    )
  }

  export default SellerDashboard