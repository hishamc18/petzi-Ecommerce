import React, { useContext } from "react";
import { ProductContext } from "../../Context/ProductContext";
import { useNavigate } from "react-router-dom";

const OrderSummary = () => {
    const { orderSummary } = useContext(ProductContext);
    const navigate = useNavigate();

    // Display a message if there's no order summary available
    if (!orderSummary) {
        return <div className="no-order-summary">No order summary available.</div>;
    }

    // Destructure orderSummary to extract shipping details, ordered items, and total amount
    const { shippingDetails, orderedItems, totalAmount } = orderSummary;

    // expected delivery date (current date + 7 days)
    const currentDate = new Date();
    const expectedDeliveryDate = new Date(currentDate);
    expectedDeliveryDate.setDate(currentDate.getDate() + 7);
    const formattedExpectedDate = expectedDeliveryDate.toISOString().slice(0, 10); // YYYY-MM-DD

    return (
        <div className="summary">
            <div className="order-summary-container">
                <h2>
                    Order <span className="carthead">Summary</span>
                </h2>
                <div className="summary-section">
                    <h3>Shipping Details</h3>
                    <p>
                        <strong>Full Name:</strong> {shippingDetails.fullName}
                    </p>
                    <p>
                        <strong>Address:</strong> {shippingDetails.streetAddress}, {shippingDetails.city},{" "}
                        {shippingDetails.state} - {shippingDetails.postalCode}
                    </p>
                    <p>
                        <strong>Phone:</strong> {shippingDetails.phoneNumber}
                    </p>
                </div>
                <div className="summary-section">
                    <h3>Ordered Items</h3>
                    <ul>
                        {orderedItems.map((item) => (
                            <li key={item.id}>
                                <strong>{item.name}</strong> - ₹{item.price} x {item.quantity}
                                <br />
                                <p className="deliveryDate">
                                    <strong>Expected Delivery:</strong> {formattedExpectedDate}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="summary-section total-amount">
                    <div className="wrapLogoTotal">
                        <img src="src/assets/logo/logo.png" alt="Logo" />
                        <h3>Total Amount:</h3>
                    </div>
                    <p>₹{Math.floor(totalAmount)}</p>
                </div>
                <button className="back-button" onClick={() => navigate("/")}>
                    <i className="bx bx-home"></i>
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;