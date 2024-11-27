import React, { useState, useContext, useRef, useEffect } from "react";
import "./homeStyle.css";
import { ProductContext } from "../../Context/ProductContext";
import { useNavigate } from "react-router-dom";
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { MdOutlinePets } from "react-icons/md";

const Navbar = ({ scrollToProducts }) => {
    const {
        setSearchTerm,
        products,
        cart,
        isLoggedIn,
        currentUser,
        toastMessage,
        setToastMessage,
        handleLogoutClick,
        setCategory,
    } = useContext(ProductContext);
    const [suggestions, setSuggestions] = useState([]); //for using the search suggestion
    const [dropdownOpen, setDropdownOpen] = useState(false); // for dropdown button in profile for logout and orders
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    //access entry to cart only when the user is loged.
    const handleCartAccess = () => {
        if (!isLoggedIn) {
            // alert("Please log in to access your cart.");
            setToastMessage("Please Login to Access Your Cart.");
        } else {
            navigate("/cart");
            setSearchTerm("");
        }
    };

    //when clicking profile, navigate to login page if user not loged else show option for logout
    const handleProfileClick = () => {
        if (!isLoggedIn) {
            navigate("/login");
        } else {
            toggleDropdown();
        }
    };

    const handleOrderAccess = () => {
        if (!isLoggedIn) {
            setToastMessage("Please Login to Access Your Cart Orders.");
        } else {
            navigate("/orders");
        }
    };

    const handlePetFoods = () => {
        setSearchTerm("");
        setCategory("");
        scrollToProducts();
    };

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);

        if (searchValue.length > 0) {
            const filteredSuggestions = products.filter(
                (product) =>
                    product.name.toLowerCase().includes(searchValue) || product.category.toLowerCase().includes(searchValue) // Search by both product name and category
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    //for clicking the searched product from the suggestion list
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name.toLowerCase());
        setSuggestions([]); // used to remove suggestion list, once a product is cliciked
    };

    // suggestions close when searchbar out of focus
    const handleBlur = () => {
        setSuggestions([]);
    };

    // for toggle conditon to active the dropdown only when user is logined.
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    //for handling the dropdown btns goes when user click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false); // Close dropdown if clicked outside
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    //refresh when logo clicks
    const refresh = () => {
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div onClick={refresh} className="navbar-logo">
                <img src="src/assets/logo/logo1.png" alt="logo" />
            </div>
            {toastMessage && <div className="toast">{toastMessage}</div>}
            <div className="navbar-icons">
                <div className="navbar-icon orders petFood" onClick={handlePetFoods}>
                    <MdOutlinePets />
                    <label>Pet Foods</label>
                </div>
                <div onClick={handleOrderAccess} className="navbar-iconCart orders orders1">
                    <TbTruckDelivery className="orderIcon" />
                    <label>Orders</label>
                </div>
                {/* Cart icon */}
                <div className="navbar-iconCart" onClick={handleCartAccess}>
                    <div className="cartlogoname">
                        <i className="bx bx-cart"></i>
                        <label>Cart</label>
                    </div>
                    <div className="count">{cart.length > 0 && <span className="cart-badge">{cart.length}</span>}</div>
                </div>
                {/* Profile icon */}
                <div className="navbar-icon" onClick={handleProfileClick} ref={dropdownRef}>
                    <i className="bx bx-user"></i>
                    <label> {isLoggedIn ? currentUser.username : "Login"} </label>
                    {dropdownOpen && isLoggedIn && (
                        <div className="dropdown-menu">
                            <div className="wrapDropDownIcons">
                                <button className="logout" onClick={handleLogoutClick}>
                                    <i className="bx bx-log-out"></i>
                                    <span className="logoutText">Logout</span>
                                </button>
                                <button
                                    className="logout-button"
                                    onClick={() => {
                                        navigate("/wishlist");
                                    }}
                                >
                                    <MdOutlineFavoriteBorder className="wishIcon" />
                                    <span className="wishListText">Wishlist</span>
                                </button>
                            </div>
                            <div
                                onClick={() => {
                                    navigate("orders");
                                }}
                                className="navbar-iconCart orders"
                            >
                                <TbTruckDelivery className="orderIcon" />
                                <label>Orders</label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="navbar-search">
                <input type="text" onBlur={handleBlur} placeholder="Search for products..." onChange={handleSearch}></input>
                <div className="searchIcon">
                    <i className="bx bx-search-alt-2"></i>
                </div>
                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion) => (
                            <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
