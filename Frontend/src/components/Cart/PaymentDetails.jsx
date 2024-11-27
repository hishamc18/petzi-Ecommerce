import React, { useContext, useState } from "react";
import { ProductContext } from "../../Context/ProductContext";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaRegCreditCard } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { SiGooglepay } from "react-icons/si";
import { FaAmazonPay, FaPaypal } from "react-icons/fa";
import "./cartStyle.css";

const PaymentDetails = () => {
    const { cart, setCart, setOrderDetails } = useContext(ProductContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [upiID, setUpiID] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // for passing shipping details to order summary
    const [shippingDetails, setShippingDetails] = useState({
        fullName: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        phoneNumber: "",
    });

    // for validating the shipping details form
    const validateForm = () => {
        let formErrors = {};

        Object.keys(shippingDetails).forEach((key) => {
            if (!shippingDetails[key]) {
                formErrors[key] = `Please enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`;
            }
        });

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0; // Return true if no errors
    };

    // for submitting shipping details form
    const submiting = (e) => {
        e.preventDefault();
        if (validateForm()) {
            openModal();
        }
    };

    // for storing the shipping details
    const handleInputChange = (e) => {
        setShippingDetails({
            ...shippingDetails,
            [e.target.name]: e.target.value,
        });
        // setErrors({ ...errors, [e.target.name]: "" }); // Clear error on input change
    };

    const totalPrice = Array.isArray(cart) ? cart.reduce((total, item) => total + item.price * item.quantity, 0) : 0;
    const securedPackagingFee = 39;
    const finalAmount = totalPrice + securedPackagingFee;

    const openModal = () => {
        setIsModalOpen(true);
        setIsLoading(false);
        setIsSuccess(false);
    };

    const handlePayment = () => {
        if (!selectedPaymentMethod) {
            toast.info("Please select a payment method");
            return;
        }
        if (selectedPaymentMethod === "UPI" && !upiID) {
            toast.info("Please enter UPI ID");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            // Passing order details to OrderSummary
            const orderDetails = {
                shippingDetails,
                orderedItems: cart,
                totalAmount: finalAmount,
            };

            setOrderDetails(orderDetails);
           
            setTimeout(() => {
                setIsModalOpen(false);
                setCart([]); // Clear cart after order
                navigate("/order-summary"); // Navigate to order summary
            }, 2200);
        }, 1000);
    };

    const handlePaymentMethodChange = (e) => {
        setSelectedPaymentMethod(e.target.value);
    };

    return (
        <>
            <div className="price-details">
                <h2>Price Details</h2>
                <div className="price-item">
                    <span>Price ({cart.reduce((total, item) => total + item.quantity, 0)} items)</span>
                    <span>₹{Math.floor(totalPrice)}</span>
                </div>
                <div className="price-item">
                    <span>Delivery Charges</span>
                    <h4>Free</h4>
                </div>
                <div className="price-item">
                    <span>Secured Packaging Fee</span>
                    <span>₹{securedPackagingFee}</span>
                </div>
                <hr />
                <div className="price-item total">
                    <span>Total Amount</span>
                    <span>₹{Math.floor(finalAmount)}</span>
                </div>
            </div>

            <div className="shippingDetails">
                <h2>Shipping Details</h2>
                <div className="address">
                    <form onSubmit={submiting}>
                        <input
                            type="text"
                            name="fullName"
                            placeholder={errors.fullName || "Full Name"}
                            value={shippingDetails.fullName}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="streetAddress"
                            placeholder={errors.streetAddress || "Street Address"}
                            value={shippingDetails.streetAddress}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder={errors.city || "City"}
                            value={shippingDetails.city}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="statePin">
                            <input
                                type="text"
                                name="state"
                                placeholder={errors.state || "State"}
                                value={shippingDetails.state}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="postalCode"
                                placeholder={errors.postalCode || "Postal Code"}
                                value={shippingDetails.postalCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder={errors.phoneNumber || "Phone Number"}
                            value={shippingDetails.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                        <button className="proceed-btn">Proceed To Payment</button>
                    </form>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Payment Modal"
                className="custom-modal"
                overlayClassName="custom-overlay"
            >
                {isLoading ? (
                    <div className="loading-container">
                        <FiLoader className="loading-icon" />
                        <h3 className="processingHead">Processing Payment...</h3>
                        <p className="loading-text">Please wait a moment</p>
                    </div>
                ) : isSuccess ? (
                    <div className="success-container">
                        <div className="animated-success-icon">
                            <FaCheckCircle className="success-icon" />
                        </div>
                        <h3 className="processingHead">Payment Successful!</h3>
                        <p className="success-text">Total Amount Paid: ₹{Math.floor(finalAmount)}</p>
                        <p className="redirect-text">Wait for your Order Summary...</p>
                    </div>
                ) : (
                    <div className="payment-container">
                                
                        <h2>Payment Details</h2>
                        <p>
                            Total Amount: <span>₹{Math.floor(finalAmount)}</span>
                        </p>
                        <h3>Select Payment Method:</h3>
                        <div className="payment-options">
                            <label>
                                <input
                                    type="radio"
                                    value="Credit Card"
                                    checked={selectedPaymentMethod === "Credit Card"}
                                    onChange={handlePaymentMethodChange}
                                />
                                Credit Card
                                <FaRegCreditCard className="debitcard" />
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="UPI"
                                    checked={selectedPaymentMethod === "UPI"}
                                    onChange={handlePaymentMethodChange}
                                />
                                UPI
                                <SiGooglepay className="payIcons" />
                                <FaAmazonPay className="payIcons" />
                                <FaPaypal className="payIcons" />
                            </label>

                            {/* Show UPI input when UPI is selected */}
                            {selectedPaymentMethod === "UPI" && (
                                <div className="upi-input">
                                    <label htmlFor="upiID">Enter UPI ID:</label>
                                    <input
                                        type="text"
                                        id="upiID"
                                        value={upiID}
                                        onChange={(e) => setUpiID(e.target.value)}
                                        placeholder="e.g. yourupi@bank"
                                    />
                                </div>
                            )}

                            <label>
                                <input
                                    type="radio"
                                    value="COD"
                                    checked={selectedPaymentMethod === "COD"}
                                    onChange={handlePaymentMethodChange}
                                />
                                Cash on Delivery
                            </label>
                        </div>
                        <button className="pay-now-btn" onClick={handlePayment} disabled={!selectedPaymentMethod}>
                            Pay Now
                        </button>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default PaymentDetails;