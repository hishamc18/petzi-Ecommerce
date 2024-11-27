import React, { useContext, useRef, useEffect, useState } from "react";
import "./homeStyle.css";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import Products from "./Products";
import Category from "./Category";
import Caption from "./Caption";
import Footer from "./Footer";
import { ProductContext } from "../../Context/ProductContext";
import LogoutModal from "./LogoutModal";
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function HomePage() {
    const { searchTerm, showConfirm, cancelLogout, confirmLogout } = useContext(ProductContext);
    const productsRef = useRef(null);
    const [loading, setLoading] = useState(true);

    //offer toast
    // useEffect(() => {
    //     const offerInterval = setInterval(() => {
    //         toast.info("50% off on all products!");
    //     }, 4000); 

    //     return () => clearInterval(offerInterval);
    // }, []);

    //loading home page
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1600);
        return () => clearTimeout(timer);
    }, []);

    // Scroll to the Products component
    const scrollToProducts = () => {
        if (productsRef.current) {
            window.scrollTo({
                top: productsRef.current.offsetTop - 130,
                behavior: "smooth",
            });
        }
    };

    // Auto-scroll to top when search active
    useEffect(() => {
        if (searchTerm && productsRef.current) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [searchTerm]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader">
                    <div className="wrapDots">
                        <div className="loadingDot"></div>
                        <div className="loadingDot"></div>
                        <div className="loadingDot"></div>
                        <div className="loadingDot"></div>
                    </div>
                    <div className="caption">
                        <div className="forPc">
                            <h4>"Fuel their happiness with every bite - Shop the best food for your furry friends!”</h4>
                        </div>
                        <div className="forMobile">
                            <h4>"Fuel their happiness with every bite</h4>
                        </div>
                    </div>
                </div>
                <img className="loadingLogo" src="src/assets/logo/logo.png" alt="logo" />
            </div>
        );
    }

    return (
        <div className="homePage">
                        <ToastContainer
                position="top-center"
                autoClose={1300}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Slide}
            />
            <Navbar scrollToProducts={scrollToProducts} />
            <Caption />
            {/* conditional rednering based on searching */}
            {searchTerm ? (
                <>
                    <Category scrollToProducts={scrollToProducts} />
                    <Products ref={productsRef} />
                    <HeroSection />
                </>
            ) : (
                <>
                    <HeroSection />
                    <Category scrollToProducts={scrollToProducts} />
                    <Products ref={productsRef} />
                </>
            )}
            <Footer />
            {/* for showing the logout modal */}
            {showConfirm && <LogoutModal onConfirm={confirmLogout} onCancel={cancelLogout} />}
        </div>
    );
}

export default HomePage;