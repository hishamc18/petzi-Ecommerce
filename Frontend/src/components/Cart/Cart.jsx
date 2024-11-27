import React, { useContext } from "react";
import { ProductContext } from "../../Context/ProductContext";
import PaymentDetails from "./PaymentDetails";
import { MdDeleteForever } from "react-icons/md";
import "./cartStyle.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const Cart = () => {
    const { cart, removeFromCart, updateQuantity } = useContext(ProductContext);
    const navigate = useNavigate();

    return (
        <div className="cart-price">
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Slide}
            />

            <h1>
                Your <span className="carthead">Cart</span>
            </h1>
            <div className="homebtn">
                <button className="back-button" onClick={() => navigate("/")}>
                    <i className="bx bx-home"></i>
                </button>
            </div>
            <div className="cart-container">
                {cart.length === 0 ? ( //if nothing is added to the cart, it shows empty
                    <h3>Your cart is empty.</h3>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {cart.map((product) => (
                                <div className="cart-item" key={product.id}>
                                    <img src={product.image} alt={product.name} />
                                    <div className="cart-details">
                                        <h4>{product.name}</h4>
                                        <h5>Seller: {product.seller}</h5>
                                        <p>
                                            <span className="original-price">₹{product.oldPrice}</span>
                                            <span className="discounted-price"> ₹{product.price}</span>
                                        </p>
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(product.id, product.quantity - 1)}>
                                                -
                                            </button>
                                            <span>{product.quantity}</span>
                                            <button onClick={() => updateQuantity(product.id, product.quantity + 1)}>
                                                +
                                            </button>
                                        </div>
                                        <div className="cart-actions">
                                            <div onClick={() => removeFromCart(product.id)} className="del">
                                                <div>
                                                    <MdDeleteForever />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="delivery-info">
                                        <p>
                                            Delivery by {product.deliveryDate} | <span>Free</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="price-details">
                            {/* both payment details and cart are in same component */}
                            <PaymentDetails />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
