import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./authStyle.css";

function Signin() {
    let navigate = useNavigate();

    // Define Yup validation schema
    const validationSchema = Yup.object({
        username: Yup.string().required("Username Required"),
        email: Yup.string().email("Invalid email address").required("Email Required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password Required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords Must Match")
            .required("Confirm Password Required"),
    });

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
            <Formik
                initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
                validationSchema={validationSchema}

                onSubmit={async (values, { setSubmitting, setFieldError }) => {
                    try {
                        const response = await axios.get("http://localhost:5001/users");
                        // const response = await axios.get("http://192.168.57.37:5001/users");
                        const users = response.data;
                        const userWithSameEmail = users.find((user) => user.email === values.email);
                
                        if (userWithSameEmail) {
                            setFieldError("email", "An account with this email already exists");
                            setSubmitting(false);
                        } else {
                            const newUser = {
                                ...values,
                                isBlocked: false, // Initialize isBlocked to false
                                cart: [],
                                orders: []
                            };
                
                            await axios.post("http://localhost:5001/users", newUser);
                            // await axios.post("http://192.168.57.37:5001/users", newUser);
                            toast.success("Account Created! You're ready to log in.");
                            setTimeout(() => {
                                navigate("/login");
                            }, 2000);
                        }
                    } catch (error) {
                        toast.error("🚨 Error creating account. Please try again.");
                        console.error("Error checking email or creating account:", error);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="form">
                        <div className="logo">
                            <img src="src/assets/logo/logo.png" alt="Logo" />
                        </div>
                        <Field type="text" name="username" placeholder="Username" />
                        <ErrorMessage name="username" className="error-message" />
                        <Field type="email" name="email" placeholder="Email" />
                        <ErrorMessage name="email" className="error-message"/>
                        <Field type="password" name="password" placeholder="Password" />
                        <ErrorMessage name="password" className="error-message" />
                        <Field type="password" name="confirmPassword" placeholder="Confirm Password" />
                        <ErrorMessage name="confirmPassword" className="error-message"/>
                        <button type="submit" disabled={isSubmitting}>
                            Register
                        </button>
                        <p>
                            Have an Account?{" "}
                            <Link className="link" to={"/login"}>
                                Please Login
                            </Link>
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Signin;