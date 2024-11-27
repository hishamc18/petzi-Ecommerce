import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ProductContext } from "../../Context/ProductContext"; // For user login
import { AdminContext } from "../../Context/AdminContext";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./authStyle.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(ProductContext);
    const { adminLogin } = useContext(AdminContext);

    const validationSchema = Yup.object().shape({
        email: Yup.string().required("Email is required").email("Invalid email address"),
        password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await axios.get("http://localhost:5001/users");
            // const response = await axios.get("http://192.168.57.37:5001/users");
            const users = response.data;

            // Find the user by email and password
            const user = users.find((u) => u.email === values.email && u.password === values.password);

            if (user) {
                if (user.isBlocked) {
                    // Show alert if user is blocked
                    toast.error("You're blocked by admin, please contact admin.");
                } else if (user.email === "admin@gmail.com" && user.role == "admin") {
                    // Admin login
                    adminLogin(user.username); // Call admin login function
                } else {
                    // Regular user login
                    login(user.username, user.email); // Call user login function
                    navigate("/");
                }
            } else {
                // Invalid email or password error
                setErrors({ login: "Invalid email or password" });
            }
        } catch (error) {
            // General error handling
            setErrors({ login: "Something went wrong. Please try again later." });
        }
        setSubmitting(false);
    };

    useEffect(() => {
        toast.info("Please Login With Your Credentials");
    }, []);

    return (
        <div className="form-container">
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Slide}
            />
            <Formik initialValues={{ email: "", password: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, errors }) => (
                    <Form className="form">
                        <div className="logo">
                            <img src="src/assets/logo/logo.png" alt="Logo" />
                        </div>
                        <h2 id="welcomeMessage">Welcome Back!</h2>
                        <Field type="email" name="email" placeholder="Email" />
                        <ErrorMessage name="email" component="div" className="error-message" />
                        <Field type="password" name="password" placeholder="Password" />
                        <ErrorMessage name="password" component="div" className="error-message" />
                        <button type="submit" disabled={isSubmitting}>
                            Log In
                        </button>
                        {errors.login && <div className="error-message">{errors.login}</div>}
                        <p>
                            No Account?{" "}
                            <Link className="link" to={"/signin"}>
                                Create Account
                            </Link>
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Login;
