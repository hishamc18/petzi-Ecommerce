import React, { useContext, useState, useEffect } from "react";
import { AdminContext } from "../../Context/AdminContext";
import "./admin.css";
import Dashboard from "./Dashboard";
import HandleProducts from './HandleProducts'
import UserDetails from "./UserDetails";
import LogoutModal from "../HomePage/LogoutModal";


const AdminHome = () => {
    const { activeMenu, handleMenuClick, adminLogout, isAdmin } = useContext(AdminContext);
    const adminName = sessionStorage.getItem("adminName")
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false)



   

    const handleProfileClick = () => {
        if (isAdmin) {
            setDropdownOpen(!dropdownOpen);
        }
    };

    const handleLogoutModal = () => {
        setShowConfirm(true)
    }

    const confirmLogout = () => {
        adminLogout();
        setShowConfirm(false);
    };
    const cancelLogout = () => {
        setShowConfirm(false);
    };


    return (
        <div className="admin-homepage">
            <nav className="adminNavbar">
                <div className="navbar-logo adminlogo">
                    <img src="src/assets/logo/logo1.png" alt="logo" />
                    <h1>Admin Panel</h1>
                </div>
                <div className="adminLogoutBtn" onClick={handleProfileClick}>
                    <i className="bx bx-user"></i>
                    <label>{adminName}</label>
                    {dropdownOpen && isAdmin &&(
                        <div className="dropdown-menu">
                            <div className="wrapDropDownIcons">
                                <button className="logout adminlgbtn" onClick={handleLogoutModal}>
                                    <i className="bx bx-log-out"></i>
                                    <span className="logoutText adminLogoutText">Logout</span>
                                </button>
                                </div>
                                </div>
                    )}
                </div>
            </nav>

            <div className="adminContainer">
                <div className="adminMenubar">
                    <ul>
                        <li
                            className={activeMenu === "Dashboard" ? "active" : ""}
                            onClick={() => handleMenuClick("Dashboard")}
                        >
                            Dashboard
                        </li>
                        <li
                            className={activeMenu === "HandleProducts" ? "active" : ""}
                            onClick={() => handleMenuClick("HandleProducts")}
                        >
                            Handle Products
                        </li>
                        <li
                            className={activeMenu === "UserDetails" ? "active" : ""}
                            onClick={() => handleMenuClick("UserDetails")}
                        >
                            User Details
                        </li>
                    </ul>
                </div>
                <div className="adminContent">
                    {activeMenu === "Dashboard" && <Dashboard />}
                    {activeMenu === "HandleProducts" && <HandleProducts />}
                    {activeMenu === "UserDetails" && <UserDetails />}
                </div>
            </div>
            {/* for showing the logout modal */}
            {showConfirm && <LogoutModal onConfirm={confirmLogout} onCancel={cancelLogout} />}
        </div>
    );
};

export default AdminHome;
