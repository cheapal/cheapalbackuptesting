import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage or as empty array
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Error reading cart from localStorage", error);
            return [];
        }
    });

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (error) {
            console.error("Error saving cart to localStorage", error);
        }
    }, [cartItems]);

    const addToCart = (itemToAdd) => {
        setCartItems(prevItems => {
            // Check if item already exists (based on listing ID)
            const existingItem = prevItems.find(item => item.listing === itemToAdd.listing);

            if (existingItem) {
                // If exists, update quantity (or replace if needed, depends on logic)
                // For simplicity, let's just update quantity here. Add checks for stock if necessary.
                return prevItems.map(item =>
                    item.listing === itemToAdd.listing
                        ? { ...item, quantity: item.quantity + itemToAdd.quantity }
                        : item
                );
            } else {
                // If new, add to cart
                return [...prevItems, itemToAdd];
            }
        });
        // Optionally show toast notification
        // toast.success(`${itemToAdd.title} added to cart`);
    };

    const removeFromCart = (listingId) => {
        setCartItems(prevItems => prevItems.filter(item => item.listing !== listingId));
        // toast.info(`Item removed from cart`);
    };

    const updateQuantity = (listingId, newQuantity) => {
        const quantity = Number(newQuantity);
        if (isNaN(quantity) || quantity < 1) {
            // Remove item if quantity is invalid or less than 1
            removeFromCart(listingId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.listing === listingId ? { ...item, quantity: quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems'); // Clear storage too
    };

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);


    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
