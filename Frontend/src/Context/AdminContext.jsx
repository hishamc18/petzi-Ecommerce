import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [activeMenu, setActiveMenu] = useState("Dashboard");
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [totalUsers, setTotalUsers] = useState(0); //dashboard
    const [totalOrders, setTotalOrders] = useState(0); //dashbord //totalOrders
    const [users, setUsers] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [adminUser, setAdminUser] = useState();
    const [monthlyRevenue, setMonthlyRevenue] = useState({});
    const [weeklyRevenue, setWeeklyRevenue] = useState({});
    const [dailyRevenue, setDailyRevenue] = useState({});
    const [recentOrders, setRecentOrders] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5001/users");
            // const response = await fetch("http://192.168.57.37:5001/users");
            const data = await response.json();
            // Filter users without admin role
            const nonAdminUsers = data.filter((user) => user.role !== "admin");
            setTotalUsers(nonAdminUsers.length); // Count of non-admin users
            setUsers(nonAdminUsers);
            // Calculate total orders and total revenue
            let ordersCount = 0;
            let totalRevenue = 0;
            data.forEach((user) => {
                if (user.orders) {
                    ordersCount += user.orders.length;

                    // Sum of the total revenue from each order
                    user.orders.forEach((order) => {
                        totalRevenue += order.totalAmount; 
                    });
                }
            });
            setTotalOrders(ordersCount); // Set total orders
            setTotalRevenue(totalRevenue); // Set total revenue
            const admin = data.find((user) => user.role === "admin");
            setAdminUser(admin);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        const storedMenu = sessionStorage.getItem("activeMenu");
        if (storedMenu) {
            setActiveMenu(storedMenu); // Set active menu from storage
        }
        fetchData();
    }, []);

    useEffect(() => {
        const calculateMonthlyRevenue = () => {
            const revenueByMonth = {};
            users.forEach((user) => {
                if (user.orders) {
                    user.orders.forEach((order) => {
                        const month = new Date(order.date).toLocaleString("default", { month: "long" });
                        revenueByMonth[month] = (revenueByMonth[month] || 0) + order.totalAmount;
                    });
                }
            });
            setMonthlyRevenue(revenueByMonth);
        };
        calculateMonthlyRevenue();
    }, [users]);

    useEffect(() => {
        const calculateWeeklyRevenue = () => {
            const revenueByWeek = {};

            users.forEach((user) => {
                if (user.orders) {
                    user.orders.forEach((order) => {
                        const date = new Date(order.date);
                        const year = date.getFullYear();
                        const week = Math.ceil(
                            ((date - new Date(year, 0, 1)) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7
                        );
                        const weekKey = `${year}-W${week}`;

                        revenueByWeek[weekKey] = (revenueByWeek[weekKey] || 0) + order.totalAmount;
                    });
                }
            });

            setWeeklyRevenue(revenueByWeek);
        };
        // Call this function after fetching users
        calculateWeeklyRevenue();
    }, [users]);

    useEffect(() => {
        const calculateDailyRevenue = () => {
            const revenueByDay = {};

            users.forEach((user) => {
                if (user.orders) {
                    user.orders.forEach((order) => {
                        const date = new Date(order.date).toLocaleDateString(); // Format date to 'MM/DD/YYYY'
                        revenueByDay[date] = (revenueByDay[date] || 0) + order.totalAmount;
                    });
                }
            });

            setDailyRevenue(revenueByDay);
        };

        // Call this function after fetching users
        calculateDailyRevenue();
    }, [users]);

    useEffect(() => {
        // Count occurrences of each product ID from ordered items
        const productOccurrences = users.reduce((acc, user) => {
            if (user.orders && Array.isArray(user.orders)) {
                user.orders.forEach((order) => {
                    if (order.orderedItems && Array.isArray(order.orderedItems)) {
                        order.orderedItems.forEach((item) => {
                            acc[item.id] = (acc[item.id] || 0) + item.quantity; // Increment count by quantity for each product
                        });
                    }
                });
            }
            return acc;
        }, {});

        // Get top 5 products by sorting based on occurrences
        const topProducts = Object.entries(productOccurrences)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 4)
            .map(([productId]) => products.find((product) => product.id === productId));

        setTopSellingProducts(topProducts.filter(Boolean)); // Ensure no undefined values if products are missing
    }, [users, products]);

    useEffect(() => {
        const getRecentOrders = () => {
            let orders = [];

            users.forEach((user) => {
                if (user.orders) {
                    user.orders.forEach((order) => {
                        orders.push({
                            orderId: order.id,
                            amount: order.totalAmount,
                            date: new Date(order.date), // Ensure date is properly parsed
                            email: user.email,
                        });
                    });
                }
            });

            // Sort orders by date in descending order (latest first)
            const sortedOrders = orders.sort((a, b) => b.date - a.date).slice(0, 5);
            setRecentOrders(sortedOrders); // Set sorted orders to state
        };

        // Call this after users have been fetched
        getRecentOrders();
    }, [users]);

    const getUsersWithMostOrders = () => {
        const userOrderSummary = users.reduce((acc, user) => {
            if (user.orders) {
                const userEmail = user.email; // Assuming each user has a unique email
                if (!acc[userEmail]) {
                    acc[userEmail] = { count: 0, totalAmount: 0 };
                }

                acc[userEmail].count += user.orders.length; // Increment order count
                user.orders.forEach((order) => {
                    acc[userEmail].totalAmount += order.totalAmount; // Accumulate total amount
                });
            }
            return acc;
        }, {});

        // Convert to array, sort by count, and return top 5
        return Object.entries(userOrderSummary)
            .map(([email, { count, totalAmount }]) => ({ email, count, totalAmount }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);
    };

    // Function to select a user and open the modal
    const handleUserClick = (user) => {
        setSelectedUser(user); // Set the clicked user as selected
        setIsModalOpen(true);
        // console.log("hi, im modal");
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null); // Clearing selected user details to null
    };

    useEffect(() => {
        const adminSession = sessionStorage.getItem("isAdmin");
        if (adminSession === "true") {
            setIsAdmin(true);
            fetchProducts(); // Fetch products on admin login
        } else {
            setIsAdmin(false);
        }
    }, []);

    const adminLogin = (adminName) => {
        setIsAdmin(true);
        sessionStorage.setItem("isAdmin", "true");
        sessionStorage.setItem("adminName",adminName)
        navigate("/admin");
        window.location.reload()
    };

    const adminLogout = () => {
        setIsAdmin(false);
        sessionStorage.removeItem("isAdmin");
        sessionStorage.removeItem("activeMenu");
        sessionStorage.removeItem("adminName")
        navigate("/login");
    };

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        sessionStorage.setItem("activeMenu", menu); // Store the active menu
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5001/products");
            // const response = await axios.get("http://192.168.57.37:5001/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    const addProduct = async (newProduct) => {
        try {
            const response = await axios.post("http://localhost:5001/products", newProduct);
            // const response = await axios.post("http://192.168.57.37:5001/products", newProduct);
            setProducts([...products, response.data]); // Update state with the new product
            await fetchProducts();
        } catch (error) {
            console.error("Failed to add product:", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/products/${id}`);
            // await axios.delete(`http://192.168.57.37:5001/products/${id}`);
            setProducts(products.filter((product) => product.id !== id)); // Remove from state
            await fetchProducts();
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    const editProduct = async (id, updatedProduct) => {
        try {
            const response = await axios.put(`http://localhost:5001/products/${id}`, updatedProduct);
            // const response = await axios.put(`http://192.168.57.37:5001/products/${id}`, updatedProduct);
            setProducts(products.map((product) => (product.id === id ? response.data : product))); // Update product in state
            await fetchProducts();
        } catch (error) {
            console.error("Failed to edit product:", error);
        }
    };

    if (isAdmin === null) {
        return <div>Loading...</div>;
    }

    const blockUser = async (userId) => {
        try {
            // Find the selected user in the state
            const userToBlock = users.find((user) => user.id === userId);

            // Toggle the isBlocked status
            const updatedUser = { ...userToBlock, isBlocked: !userToBlock.isBlocked };

            // Update the user in the database
            await axios.patch(`http://localhost:5001/users/${userId}`, { isBlocked: updatedUser.isBlocked });
            // await axios.patch(`http://192.168.57.37:5001/users/${userId}`, { isBlocked: updatedUser.isBlocked });

            // Update state after successful API call
            setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? updatedUser : user)));
            toast.success(`User ${updatedUser.isBlocked ? "blocked" : "unblocked"} successfully.`);
        } catch (error) {
            toast.error("Error updating user status. Please try again.");
            console.error("Error blocking/unblocking user:", error);
        }
    };

    return (
        <AdminContext.Provider
            value={{
                isAdmin,
                adminUser,
                adminLogin,
                adminLogout,
                activeMenu,
                handleMenuClick,
                products,
                addProduct,
                deleteProduct,
                editProduct,
                totalUsers,
                totalOrders,
                totalRevenue,
                topSellingProducts,
                monthlyRevenue,
                weeklyRevenue,
                dailyRevenue,
                recentOrders,
                getUsersWithMostOrders,
                users,
                selectedUser,
                handleUserClick, // Function to handle user click
                closeModal,
                isModalOpen,
                blockUser,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};