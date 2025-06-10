import React, { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from "react-toastify";
import { adminService } from "../services/apiService";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-toastify/dist/ReactToastify.css";

// --- Animated Background Component ---
const AnimatedGradientBackground = () => {
    useEffect(() => {
        const particlesContainer = document.getElementById('particles-container');
        if (!particlesContainer) return;

        const particleCount = 40;
        const existingParticles = particlesContainer.querySelectorAll('.particle');
        existingParticles.forEach(p => p.remove());

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
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
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0.5)';
            return { x: posX, y: posY };
        };

        const animateParticle = (particle) => {
            const duration = Math.random() * 18 + 12;
            const delay = Math.random() * 12;

            setTimeout(() => {
                if (!particlesContainer || !particlesContainer.contains(particle)) return;
                particle.style.transition = `all ${duration}s linear`;
                particle.style.opacity = (Math.random() * 0.2 + 0.03).toString();
                particle.style.transform = 'scale(1)';

                const moveX = parseFloat(particle.style.left) + (Math.random() * 40 - 20);
                const moveY = parseFloat(particle.style.top) - (Math.random() * 50 + 15);

                particle.style.left = `${moveX}%`;
                particle.style.top = `${moveY}%`;

                setTimeout(() => {
                    if (particlesContainer && particlesContainer.contains(particle)) {
                        if (parseFloat(particle.style.top) < -10 || parseFloat(particle.style.top) > 110 || parseFloat(particle.style.left) < -10 || parseFloat(particle.style.left) > 110) {
                            resetParticle(particle);
                        }
                        animateParticle(particle);
                    }
                }, duration * 1000);
            }, delay * 1000);
        };

        for (let i = 0; i < particleCount; i++) {
            createParticle();
        }

        const spheres = document.querySelectorAll('.gradient-sphere');
        let animationFrameId;
        const handleMouseMove = (e) => {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                const moveX = (e.clientX / window.innerWidth - 0.5) * 15;
                const moveY = (e.clientY / window.innerHeight - 0.5) * 15;
                spheres.forEach(sphere => {
                    sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
            });
        };
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            if (particlesContainer) {
                particlesContainer.innerHTML = '';
            }
        };
    }, []);

    return (
        <>
            <div className="gradient-background">
                <div className="gradient-sphere sphere-1"></div>
                <div className="gradient-sphere sphere-2"></div>
                <div className="gradient-sphere sphere-3"></div>
                <div className="glow"></div>
                <div className="grid-overlay"></div>
                <div className="noise-overlay"></div>
                <div className="particles-container" id="particles-container"></div>
            </div>
        </>
    );
};

// --- Reusable UI Components ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
    </div>
);

const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-700/20 border border-red-600/40 text-red-300 p-6 rounded-xl text-center my-8 shadow-lg max-w-lg mx-auto">
        <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-lg mb-1">Something went wrong</p>
            <span className="text-sm">{message || 'Could not load blogs.'}</span>
            {onRetry && (
                <button onClick={onRetry} className="mt-4 px-4 py-2 bg-red-500/30 text-red-200 rounded-lg hover:bg-red-500/40 transition-colors text-sm font-medium">
                    Try Again
                </button>
            )}
        </div>
    </div>
);

// --- Blog Card Component ---
const BlogCard = ({ blog, onClick }) => {
    const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
    const IMAGE_BASE_URL = (process.env.REACT_APP_API_URL || '').replace('/api', '');
    const glowColor = 'rgba(0, 188, 212, 0.4)';

    const getExcerpt = (content) => {
        if (typeof content === 'string') {
            // If content is already a string, create a simple excerpt
            const plainText = content.replace(/<[^>]*>/g, '');
            return plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText;
        }
        
        try {
            if (content && typeof content.getCurrentContent === 'function') {
                const text = content.getCurrentContent().getPlainText();
                return text.length > 150 ? text.substring(0, 150) + "..." : text;
            }
            
            return "";
        } catch (err) {
            console.error("[BlogCard] Error generating excerpt:", err);
            return "";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div 
            className="block group h-full cursor-pointer"
            onClick={() => onClick(blog)}
        >
            <div
                className="bg-gray-800/50 border border-gray-700/70 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_-5px_var(--glow-color)] transition-all duration-300 h-full flex flex-col transform hover:scale-[1.03]"
                style={{ '--glow-color': glowColor }}
            >
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-50 mb-2 truncate group-hover:text-cyan-400 transition-colors" title={blog.title}>{blog.title}</h3>
                    <p className="text-gray-400 text-sm mb-2 h-12 overflow-hidden text-ellipsis leading-relaxed" title={getExcerpt(blog.content)}>
                        {getExcerpt(blog.content)}
                    </p>
                    <div className="h-52 bg-gray-700/50 relative overflow-hidden rounded-lg mb-4">
                        <img
                            src={blog.image ? `${IMAGE_BASE_URL}${blog.image}` : 'https://placehold.co/600x400/2D3748/A0AEC0?text=Blog'}
                            alt={blog.title || 'Blog Image'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/2D3748/A0AEC0?text=Error'; }}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(blog.tags || []).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-600/50 backdrop-blur-sm text-white text-xs rounded-full border border-gray-700/50"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-700/60 flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden text-sm font-bold text-white flex-shrink-0 ring-1 ring-gray-500">
                            {blog.author?.avatar ? (
                                <img
                                    src={`${IMAGE_BASE_URL}${blog.author.avatar}`}
                                    alt={blog.author.name || 'Author Avatar'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.outerHTML = `<span className="text-xs" title="${blog.author.name || ''}">${getInitials(blog.author.name)}</span>`; }}
                                />
                            ) : (
                                <span className="text-xs" title={blog.author?.name || 'Author'}>{getInitials(blog.author?.name)}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-300">{blog.author?.name || 'Unknown Author'}</span>
                            <span className="text-xs text-gray-500">{formatDate(blog.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Blog Page Component ---
const BlogPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [viewingFullPost, setViewingFullPost] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [featuredBlogs, setFeaturedBlogs] = useState([]);

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!adminService.getPublicBlogs) {
                throw new Error("getPublicBlogs method is not defined in adminService");
            }
            const response = await adminService.getPublicBlogs();
            console.log("[BlogPage] Raw API Response:", JSON.stringify(response, null, 2));
            
            if (response && response.success && Array.isArray(response.data)) {
                console.log("[BlogPage] Setting blogs:", response.data);
                
                // Sort blogs by date (newest first)
                const sortedBlogs = response.data.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                
                setBlogs(sortedBlogs);
                
                // Set featured blogs (first 3)
                setFeaturedBlogs(sortedBlogs.slice(0, 3));
                
                // Extract unique categories from tags
                const allTags = sortedBlogs.reduce((acc, blog) => {
                    if (blog.tags && Array.isArray(blog.tags)) {
                        return [...acc, ...blog.tags];
                    }
                    return acc;
                }, []);
                
                const uniqueCategories = ["All", ...new Set(allTags)];
                setCategories(uniqueCategories);
                
            } else {
                console.warn("[BlogPage] Invalid response structure:", response);
                toast.error("Failed to fetch blogs: Invalid response format");
                setBlogs([]);
            }
        } catch (err) {
            console.error("[BlogPage] Fetch Blogs Error:", err.message, err.stack);
            setError(err.message || "Failed to fetch blogs");
            setBlogs([]);
        } finally {
            console.log("[BlogPage] Loading complete, blogs state:", blogs);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const openBlog = (blog) => {
        if (!blog || !blog.content) {
            console.warn("[BlogPage] Invalid blog data for modal:", blog);
            return;
        }
        try {
            const blocksFromHtml = htmlToDraft(blog.content || "");
            const contentState = ContentState.createFromBlockArray(
                blocksFromHtml.contentBlocks,
                blocksFromHtml.entityMap
            );
            setSelectedBlog({
                ...blog,
                content: EditorState.createWithContent(contentState),
            });
            setViewingFullPost(true);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Error parsing blog content:", error);
            setSelectedBlog(blog);
            setViewingFullPost(true);
        }
    };

    const closeBlog = () => {
        setViewingFullPost(false);
        setSelectedBlog(null);
    };

    const getReadingTime = (content) => {
        try {
            let text = "";
            if (typeof content === 'string') {
                text = content.replace(/<[^>]*>/g, '');
            } else if (content && typeof content.getCurrentContent === 'function') {
                text = content.getCurrentContent().getPlainText();
            }
            
            const words = text.split(/\s+/).length;
            const minutes = Math.ceil(words / 200); // 200 words per minute
            return `${minutes} min read`;
        } catch (error) {
            return "5 min read";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filteredBlogs = blogs.filter(blog => {
        // Filter by category
        const categoryMatch = selectedCategory === "All" || 
            (blog.tags && Array.isArray(blog.tags) && blog.tags.includes(selectedCategory));
        
        // Filter by search term
        const searchMatch = 
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (blog.content && typeof blog.content === 'string' && blog.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (blog.tags && Array.isArray(blog.tags) && blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
        
        return categoryMatch && searchMatch;
    });

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/placeholder.svg";
        
        // Check if the image path is already a full URL
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // Otherwise, construct the URL using the API base URL
        return `${process.env.REACT_APP_API_URL?.replace("/api", "") || ''}${imagePath}`;
    };

    return (
        <div className="min-h-screen text-white flex flex-col relative">
            <AnimatedGradientBackground />
            <div className="relative z-10 flex-grow flex flex-col">
                {viewingFullPost && selectedBlog ? (
                    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                        <div className="bg-black/40 backdrop-blur-lg border border-gray-700/30 rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8">
                            <button 
                                onClick={closeBlog} 
                                className="mb-6 flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back to all blogs
                            </button>
                            
                            <article className="max-w-4xl mx-auto">
                                <header className="mb-8">
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{selectedBlog.title}</h1>
                                    
                                    <div className="flex flex-wrap items-center gap-4 mb-6">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden mr-3">
                                                {selectedBlog.author?.avatar ? (
                                                    <img
                                                        src={getImageUrl(selectedBlog.author.avatar) || "/placeholder.svg"}
                                                        alt={selectedBlog.author.name || 'Author'}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs">{selectedBlog.author?.name?.charAt(0) || '?'}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-gray-300 font-medium">{selectedBlog.author?.name || 'Unknown Author'}</p>
                                                <p className="text-gray-500 text-sm">{formatDate(selectedBlog.createdAt)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="text-gray-400 text-sm flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {getReadingTime(selectedBlog.content)}
                                        </div>
                                    </div>
                                    
                                    {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {selectedBlog.tags.map((tag, index) => (
                                                <span key={index} className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {selectedBlog.image && (
                                        <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
                                            <img
                                                src={getImageUrl(selectedBlog.image) || "/placeholder.svg"}
                                                alt={selectedBlog.title}
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                    )}
                                </header>
                                
                                <div 
                                    className="prose prose-invert prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{ 
                                        __html: selectedBlog.content && typeof selectedBlog.content.getCurrentContent === 'function'
                                            ? draftToHtml(convertToRaw(selectedBlog.content.getCurrentContent()))
                                            : selectedBlog.content
                                    }}
                                ></div>
                                
                                <div className="mt-12 pt-6 border-t border-gray-700">
                                    <h3 className="text-xl font-semibold mb-4">Share this post</h3>
                                    <div className="flex gap-3">
                                        <button className="p-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-full transition-colors">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                            </svg>
                                        </button>
                                        <button className="p-2 bg-blue-800/30 hover:bg-blue-800/50 rounded-full transition-colors">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                                            </svg>
                                        </button>
                                        <button className="p-2 bg-blue-500/30 hover:bg-blue-500/50 rounded-full transition-colors">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                                            </svg>
                                        </button>
                                        <button className="p-2 bg-gray-600/30 hover:bg-gray-600/50 rounded-full transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </article>
                            
                            {/* Related Posts */}
                            {filteredBlogs.length > 1 && (
                                <div className="mt-16">
                                    <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {filteredBlogs
                                            .filter(blog => blog._id !== selectedBlog._id)
                                            .slice(0, 3)
                                            .map(blog => (
                                                <BlogCard key={blog._id} blog={blog} onClick={openBlog} />
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                ) : (
                    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                        <div className="mb-10 pt-8 text-center">
                            <h1
                                className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400"
                                style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.15), 0 0 35px rgba(200, 200, 255, 0.1)' }}
                            >
                                Cheapal Archive
                            </h1>
                            <br />
                            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                                Discover the latest insights, tutorials, and updates from our team.
                            </p>
                        </div>
                        
                        <div className="bg-black/40 backdrop-blur-lg border border-gray-700/30 rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8">
                            {/* Search and Filter */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="flex-1 min-w-[200px]">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search blogs..."
                                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category, index) => (
                                        <button
                                            key={index}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                selectedCategory === category
                                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                                    : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
                                            }`}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {loading ? (
                                <LoadingSpinner />
                            ) : error ? (
                                <ErrorMessage message={error} onRetry={fetchBlogs} />
                            ) : filteredBlogs.length > 0 ? (
                                <>
                                    {/* Featured Blogs (only show if not filtering) */}
                                    {selectedCategory === "All" && searchTerm === "" && featuredBlogs.length > 0 && (
                                        <div className="mb-12">
                                            <h2 className="text-2xl font-bold mb-6 text-white">Featured Posts</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {featuredBlogs.map(blog => (
                                                    <BlogCard key={blog._id} blog={blog} onClick={openBlog} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* All Blogs */}
                                    <div>
                                        <h2 className="text-2xl font-bold mb-6 text-white">
                                            {selectedCategory !== "All" 
                                                ? `${selectedCategory} Posts` 
                                                : searchTerm 
                                                    ? 'Search Results' 
                                                    : 'All Posts'}
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {filteredBlogs.map(blog => (
                                                <BlogCard key={blog._id} blog={blog} onClick={openBlog} />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 text-gray-400 bg-gray-800/50 rounded-lg border border-gray-700/50">
                                    <svg className="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                    <p className="text-xl font-semibold text-gray-300">No Blogs Found</p>
                                    <p className="text-sm text-gray-500 mt-1">Check back later or try refining your search.</p>
                                </div>
                            )}
                            
                            {/* Newsletter Section */}
                            <div className="mt-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-gray-700/50">
                                <div className="max-w-3xl mx-auto text-center">
                                    <h3 className="text-2xl font-bold mb-4">Subscribe to our newsletter</h3>
                                    <p className="text-gray-400 mb-6">Get the latest posts and updates delivered straight to your inbox.</p>
                                    <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                                        <input
                                            type="email"
                                            placeholder="Your email address"
                                            className="flex-1 bg-gray-800/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                        >
                                            Subscribe
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </main>
                )}
                
                {/* Footer */}
                <footer className="mt-auto py-8 border-t border-gray-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <h2 className="text-xl font-bold text-cyan-400">Cheapal Blogs</h2>
                                <p className="text-gray-500 text-sm mt-1">© {new Date().getFullYear()} Cheapal. All rights reserved.</p>
                            </div>
                            <div className="flex space-x-6">
                                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
            
            <ToastContainer position="bottom-right" theme="dark" />
            
            <style jsx global>{`
                body {
                    font-family: 'Inter', 'Helvetica Neue', sans-serif;
                    overflow-x: hidden;
                    background-color: #050505;
                    color: white;
                    min-height: 100vh;
                }
                .gradient-background {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                    overflow: hidden;
                }
                .gradient-sphere {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.6;
                    will-change: transform, opacity;
                }
                .sphere-1 {
                    width: 45vw; height: 45vw;
                    min-width: 300px; min-height: 300px;
                    background: linear-gradient(40deg, rgba(0, 188, 212, 0.6), rgba(0, 131, 176, 0.3));
                    top: -15%; left: -15%;
                    animation: float-1 20s ease-in-out infinite alternate;
                }
                .sphere-2 {
                    width: 50vw; height: 50vw;
                    min-width: 350px; min-height: 350px;
                    background: linear-gradient(240deg, rgba(0, 188, 212, 0.6), rgba(0, 131, 176, 0.3));
                    bottom: -25%; right: -15%;
                    animation: float-2 22s ease-in-out infinite alternate;
                }
                .sphere-3 {
                    width: 35vw; height: 35vw;
                    min-width: 250px; min-height: 250px;
                    background: linear-gradient(120deg, rgba(0, 188, 212, 0.4), rgba(98, 216, 249, 0.25));
                    top: 50%; left: 25%;
                    transform: translate(-50%, -50%);
                    animation: float-3 25s ease-in-out infinite alternate;
                }
                .noise-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    opacity: 0.03; z-index: 1;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }
                .grid-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-size: 50px 50px;
                    background-image:
                        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                    z-index: 0;
                }
                .glow {
                    position: absolute; width: 50vw; height: 50vh;
                    background: radial-gradient(circle, rgba(0, 188, 212, 0.1), transparent 70%);
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 0;
                    animation: pulse 10s infinite alternate;
                    filter: blur(50px);
                }
                @keyframes float-1 {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                    100% { transform: translate(15vw, 10vh) scale(1.15); opacity: 0.7; }
                }
                @keyframes float-2 {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
                    100% { transform: translate(-10vw, -15vh) scale(1.2); opacity: 0.4; }
                }
                @keyframes float-3 {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                    100% { transform: translate(calc(-50% + 5vw), calc(-50% - 10vh)) scale(1.1); opacity: 0.5; }
                }
                @keyframes pulse {
                    0% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.9); }
                    100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }
                }
                .particles-container {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    z-index: 1; pointer-events: none;
                }
                .particle {
                    position: absolute; background: white; border-radius: 50%;
                    opacity: 0; pointer-events: none;
                    will-change: transform, opacity, left, top;
                }
                
                /* Prose styles for blog content */
                .prose {
                    color: #f3f4f6;
                }
                .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                    color: #f9fafb;
                    margin-top: 2em;
                    margin-bottom: 1em;
                }
                .prose p {
                    margin-bottom: 1.5em;
                }
                .prose a {
                    color: #22d3ee;
                    text-decoration: underline;
                }
                .prose strong {
                    color: #f9fafb;
                }
                .prose ul, .prose ol {
                    margin-left: 1.5em;
                    margin-bottom: 1.5em;
                }
                .prose li {
                    margin-bottom: 0.5em;
                }
                .prose blockquote {
                    border-left: 4px solid #22d3ee;
                    padding-left: 1em;
                    font-style: italic;
                    color: #9ca3af;
                    margin: 1.5em 0;
                }
                .prose code {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 0.2em 0.4em;
                    border-radius: 0.25em;
                    font-size: 0.9em;
                }
                .prose pre {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 1em;
                    border-radius: 0.5em;
                    overflow-x: auto;
                    margin: 1.5em 0;
                }
                .prose pre code {
                    background: transparent;
                    padding: 0;
                }
                .prose img {
                    border-radius: 0.5em;
                    margin: 1.5em 0;
                }
                .prose hr {
                    border-color: #374151;
                    margin: 2em 0;
                }
            `}</style>
        </div>
    );
};

export default BlogPage;