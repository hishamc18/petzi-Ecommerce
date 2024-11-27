import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; // Import toast

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [wishList, setWishList] = useState([]);
    const [cart, setCart] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [orderSummary, setOrderSummary] = useState(null);
    const [orders, setOrders] = useState([]);
    const [toastMessage, setToastMessage] = useState(""); //for setting toastmessage withouusing toast library
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false); // For logout modal handling

    // Runs initially when component mounts and fetch username from localStorage
    useEffect(() => {
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email")
        if (username && email) {
            setIsLoggedIn(true);
            setCurrentUser(username);
            fetchUser(username, email);
        }
    }, []);

    // Fetching user details from the DB
    const fetchUser = async (email) => {
        try {
            const response = await axios.get(`http://localhost:5001/users?email=${email}`);
            // const response = await axios.get(`http://192.168.57.37:5001/users?email=${email}`);
            const user = response.data[0];
            setCurrentUser(user);
            setCart(user.cart || []);
            setOrders(user.orders || []);
            setWishList(user.wishlist || []);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Login
    const login = async (username, email) => {
        await fetchUser(email);
        setIsLoggedIn(true);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email)
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("email")
        localStorage.removeItem("orderSummary");
        setIsLoggedIn(false);
        setCart([]);
        setCurrentUser(null);
        navigate("/");
    };

    // Logout modal
    const handleLogoutClick = () => {
        setShowConfirm(true);
    };

    const confirmLogout = () => {
        logout();
        setShowConfirm(false);
    };

    const cancelLogout = () => {
        setShowConfirm(false);
    };

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5001/products");
                // const response = await axios.get("http://192.168.57.37:5001/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    }, []);

    // Filter products based on category or search term
    useEffect(() => {
        const filterProducts = () => {
            let filtered = products;

            // If search term exists, prioritize search over category filter
            if (searchTerm) {
                filtered = products.filter(
                    (product) =>
                        product.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            } else if (category) {
                // Only filter by category if no search term is provided
                filtered = products.filter((product) => product.category === category);
            }

            setFilteredProducts(filtered);
        };

        filterProducts();
    }, [category, searchTerm, products]);

    // adding item to wishlist
    const addToWishlist = async (product) => {
        const updatedWishlist = [...wishList];
        const existingItem = updatedWishlist.find((item) => item.id === product.id);
        if(!isLoggedIn){
            setToastMessage(<>Please log in to add items to your cart</>)
        }
        else if (!existingItem) {
            updatedWishlist.push(product);
            setWishList(updatedWishlist);
            await updateUserWishlistInDB(updatedWishlist);
            setToastMessage(
                <>
                    Added to your wishlist 😊 <br />
                    <span>Available under profile</span>
                </>
            );
        } else {
            setToastMessage(<>Item already in wishlist! 😊</>);
        }
    };

    // Close toast message after a specified time
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => {
                setToastMessage("");
            }, 2200);
            return () => clearTimeout(timer); // Cleanup timeout on unmount
        }
    }, [toastMessage]);

    // Remove items from wishlist
    const removeFromWishlist = async (productId) => {
        const updatedWishlist = wishList.filter((item) => item.id !== productId);
        setWishList(updatedWishlist);
        await updateUserWishlistInDB(updatedWishlist);
    };

    // Clear entire wishlist
    const clearWishlist = async () => {
        setWishList([]);
        await updateUserWishlistInDB([]);
    };

    // Function to update wishlist in the DB
    const updateUserWishlistInDB = async (updatedWishlist) => {
        if (currentUser) {
            try {
                await axios.patch(`http://localhost:5001/users/${currentUser.id}`, { wishlist: updatedWishlist });
                // await axios.patch(`http://192.168.57.37:5001/users/${currentUser.id}`, { wishlist: updatedWishlist });
            } catch (error) {
                console.error("Error updating wishlist:", error);
            }
        }
    };

    // Check if stock is available
    const isStockAvailable = (productId) => {
        const product = products.find((prod) => prod.id === productId);
        return product && product.stock > 0;
    };

    // Add items to cart
    const addToCart = async (product) => {
        const quantityToAdd = 1; // Set quantity to add
        // Check stock availability
        if (!isStockAvailable(product.id)) {
            toast.error("Currently Out of Stock");
            return;
        }

        const updatedCart = [...cart];
        const existingItem = updatedCart.find((item) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantityToAdd;
            toast.success("Increased the quantity of same item in your cart")
        } else {
            updatedCart.push({ ...product, quantity: quantityToAdd });
            toast.success("Item added to your cart")
        }

        setCart(updatedCart);
        await updateUserCartInDB(updatedCart);

        // Update stock in the product list only after cart is updated in DB
        await updateProductStock(product.id, quantityToAdd);
    };

    const updateProductStock = async (productId, quantity) => {
        const product = products.find((prod) => prod.id === productId);

        // Only update if product stock is available
        if (product && product.stock >= quantity) {
            const updatedProducts = products.map((prod) =>
                prod.id === productId ? { ...prod, stock: prod.stock - quantity } : prod
            );

            setProducts(updatedProducts); // Update local state

            // Save updated product stock to DB
            await saveProductsToDB(updatedProducts);
        } else {
            toast.error("Not enough stock available");
        }
    };

    // Save updated products to DB
    const saveProductsToDB = async (updatedProducts) => {
        try {
            await Promise.all(updatedProducts.map((product) =>
                axios.patch(`http://localhost:5001/products/${product.id}`, { stock: product.stock })
                // axios.patch(`http://192.168.57.37:5001/products/${product.id}`, { stock: product.stock })
            ));
        } catch (error) {
            console.error("Error saving products:", error);
        }
    };

    // Remove item from cart
    const removeFromCart = async (productId) => {
        const itemToRemove = cart.find((item) => item.id === productId);
        if (itemToRemove) {
            const updatedCart = cart.filter((item) => item.id !== productId);
            setCart(updatedCart);
            await updateUserCartInDB(updatedCart);
            await restoreProductStock(itemToRemove.id, itemToRemove.quantity);
        }
    };

    // Restore stock for removed item
    const restoreProductStock = async (productId, quantity) => {
        const product = products.find((prod) => prod.id === productId);
        if (product) {
            const updatedProducts = products.map((prod) =>
                prod.id === productId ? { ...prod, stock: prod.stock + quantity } : prod
            );

            setProducts(updatedProducts); // Update local state

            // Save updated product stock to DB
            await saveProductsToDB(updatedProducts);
        }
    };

    // Update quantity of items in cart
    const updateQuantity = async (productId, quantity) => {
        const itemToUpdate = cart.find((item) => item.id === productId);
        if (itemToUpdate) {
            const product = products.find((prod) => prod.id === productId);
        if (product && quantity > product.stock) {
            // Show toast alert if stock is not available
            toast.error("Stock not available for this quantity.");
            return; // Prevent updating quantity if stock is 0
        }

            const updatedCart = cart.map((item) =>
                item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
            );

            // Update stock based on new quantity
            const quantityDifference = quantity - itemToUpdate.quantity;
            if (quantityDifference > 0) {
                await updateProductStock(productId, quantityDifference);
            } else {
                await restoreProductStock(productId, -quantityDifference);
            }

            setCart(updatedCart);
            await updateUserCartInDB(updatedCart);
        }
    };

    // Update user cart in the DB
    const updateUserCartInDB = async (updatedCart) => {
        if (currentUser) {
            try {
                await axios.patch(`http://localhost:5001/users/${currentUser.id}`, { cart: updatedCart });
                // await axios.patch(`http://192.168.57.37:5001/users/${currentUser.id}`, { cart: updatedCart });
            } catch (error) {
                console.error("Error updating cart:", error);
            }
        }
    };

        // Set order details
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    const setOrderDetails = (details) => {
        const orderWithIdandDate = {
            ...details,
            id: Date.now().toString(),
            date: formattedDate,
        };
        setOrderSummary(orderWithIdandDate);
        localStorage.setItem("orderSummary", JSON.stringify(orderWithIdandDate)); // Save to localStorage
        saveOrder(orderWithIdandDate); // Passing order details into saveOrder function
        setTimeout(() => {
            clearCartAfterOrder();
        }, 3000);
    };

    // Clear cart after order completion
    const clearCartAfterOrder = async () => {
        setCart([]);
        await updateUserCartInDB([]);
    };

    // To save order in the user order array
    const saveOrder = async (order) => {
        const updatedOrders = [...orders, order];
        setOrders(updatedOrders);
        if (currentUser) {
            try {
                await axios.patch(`http://localhost:5001/users/${currentUser.id}`, { orders: updatedOrders });
                // await axios.patch(`http://192.168.57.37:5001/users/${currentUser.id}`, { orders: updatedOrders });
            } catch (error) {
                console.error("Error saving order:", error);
            }
        }
    };

    return (
        <ProductContext.Provider
            value={{
                currentUser,
                toastMessage,
                setToastMessage,
                products,
                filteredProducts,
                searchTerm,
                setSearchTerm,
                category,
                setCategory,
                wishList,
                addToWishlist,
                removeFromWishlist,
                clearWishlist,
                cart,
                setCart,
                addToCart,
                removeFromCart,
                updateQuantity,
                isLoggedIn,
                login,
                logout,
                orderSummary,
                setOrderSummary,
                setOrderDetails,
                orders,
                handleLogoutClick,
                confirmLogout,
                cancelLogout,
                showConfirm,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};
