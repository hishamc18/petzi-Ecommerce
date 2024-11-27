import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../Context/AdminContext";
import Modal from "./Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./admin.css";

const HandleProducts = () => {
    const { addProduct, deleteProduct, editProduct, products } = useContext(AdminContext);
    const [productData, setProductData] = useState({
        id: "",
        name: "",
        price: "",
        oldPrice: "",
        image: "",
        category: "",
        seller: "",
        stock:''
    });
    const [viewMode, setViewMode] = useState("table"); //view mode of the products (table/cards)
    const [selectedCategory, setSelectedCategory] = useState("all"); // State for selected category
    const [isModalOpen, setIsModalOpen] = useState(false); // modal visibility
    const [isEditing, setIsEditing] = useState(false); // for eiditing product details

    // Calculate product counts
    const totalProducts = products.length;
    const dogProducts = products.filter((product) => product.category === "dog").length;
    const catProducts = products.filter((product) => product.category === "cat").length;

    // Filter products by category
    const filteredProducts =
        selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    //to add products
    const handleAddProduct = () => {
        setIsEditing(false); // Open modal for adding a product
        setProductData({
            id: "",
            name: "",
            price: "",
            oldPrice: "",
            image: "",
            category: "",
            seller: "",
            stock: "",
        });
        setIsModalOpen(true); // Open the modal
    };

    //to save the edited details or added productes
    const handleSaveProduct = () => {
        if (productData.name && productData.price && productData.category && productData.seller) {
            if (isEditing) {
                editProduct(productData.id, {
                    name: productData.name,
                    price: parseFloat(productData.price),
                    oldPrice: parseFloat(productData.oldPrice),
                    image: productData.image,
                    category: productData.category,
                    seller: productData.seller,
                    stock: parseInt(productData.stock)
                });
                toast.success("Product updated successfully!");
            } else {
                const newProduct = {
                    id: Date.now().toString(),
                    name: productData.name,
                    price: parseFloat(productData.price),
                    oldPrice: parseFloat(productData.oldPrice) || null,
                    image: productData.image,
                    category: productData.category,
                    seller: productData.seller,
                    stock: parseInt(productData.stock)
                };
                addProduct(newProduct);
                toast.success("Product added successfully!");
            }
            setIsModalOpen(false); // Close modal after saving
        } else {
            toast.error("Please fill in all required fields.");
        }
    };

    //to delete a product
    const handleDeleteProduct = (id) => {
        toast(
            ({ closeToast }) => (
                <div className="productDeleteConfirm">
                    <p>Are you sure you want to delete this product?</p>
                    <div>
                        <button
                            onClick={() => {
                                deleteProduct(id);
                                toast.success("Product deleted successfully!");
                                closeToast();
                            }}
                            className="deleteconfirmButton"
                        >
                            Yes
                        </button>
                        <button onClick={closeToast} className="deletecancelButton">
                            No
                        </button>
                    </div>
                </div>
            ),
            {
                closeOnClick: false,
                autoClose: false,
            }
        );
    };
    
//to handling edit
    const handleEditProduct = (product) => {
        setIsEditing(true); // Open modal for editing a product
        setProductData({
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice,
            image: product.image,
            category: product.category,
            seller: product.seller,
            stock: product.stock,
        });
        setIsModalOpen(true); // Open the modal
    };

    return (
        <div className="handle-products">
            <div className="wrapHandleProductHead">
                <h2>Handle Products</h2>
                <div className="wrapAddBtnandCard">
                <div className="Admincard">
                        <div className="Cardcontent">
                            <h3 className="Cardheading">Product Overview</h3>
                            <p>
                                <strong>Total Products: </strong>
                                {totalProducts}
                            </p>
                            <p>
                                <strong>Cat Products: </strong>
                                {catProducts}
                            </p>
                            <p>
                                <strong>Dog Products: </strong>
                                {dogProducts}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleAddProduct} className="addEditbutton">
                        <span>Add Product</span>
                    </button>
                    <div className="Admincard">
                        <div className="Cardcontent">
                            <h4 className="Cardheading">Seller Overview</h4>
                            <p>
                                <strong>Total Sellers: </strong>
                                28
                            </p>
                            <p>
                                <strong>Cat: </strong>
                                11
                            </p>
                            <p>
                                <strong>Dog: </strong>
                                17
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product counts and view modes */}
            <div className="view-switch">
                <div className="wrapSelect">
                    <div>
                        <label>View Mode: </label>
                        <select onChange={(e) => setViewMode(e.target.value)} value={viewMode}>
                            <option value="table">Table</option>
                            <option value="cards">Cards</option>
                        </select>
                    </div>
                    <div>
                        <label>Category: </label>
                        <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
                            <option value="all">All</option>
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                        </select>
                    </div>
                </div>

                <div className="product-counts">
                    <span>
                        Total Products: <strong>{totalProducts}</strong>
                    </span>{" "}
                    |{" "}
                    <span>
                        Dog Products: <strong>{dogProducts}</strong>
                    </span>{" "}
                    |{" "}
                    <span>
                        Cat Products: <strong>{catProducts}</strong>
                    </span>
                </div>
            </div>

            {/* Products Table or Cards */}
            <div className="productsListing">
                <h2>Current Products</h2>
                {viewMode === "table" ? (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Old Price</th>
                                <th>Image</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Seller</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.slice().reverse().map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>${product.oldPrice}</td>
                                    <td>
                                        <img src={product.image} alt={product.name} style={{ width: "50px" }} />
                                    </td>
                                    <td>{product.category}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.seller}</td>
                                    <td>
                                        <div className="productActions">
                                            <button onClick={() => handleEditProduct(product)}>Edit</button>
                                            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="product-cards">
                        {filteredProducts.slice().reverse().map((product) => (
                            <div className="product-card" key={product.id}>
                                <img src={product.image} alt={product.name} />
                                <div className="product-details">
                                    <h4>{product.name}</h4>
                                    <p>
                                        <strong>Price:</strong> ${product.price.toFixed(2)}
                                    </p>
                                    <p>
                                        <strong>Old Price:</strong> $
                                        {product.oldPrice}
                                    </p>
                                    <p>
                                        <strong>Category:</strong> {product.category}
                                    </p>
                                    <p>
                                        <strong>Stock:</strong> {product.stock}
                                    </p>
                                    <p>
                                        <strong>Seller:</strong> {product.seller}
                                    </p>
                                    <div className="productActions">
                                        <button onClick={() => handleEditProduct(product)}>Edit</button>
                                        <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for Adding/Editing Products */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="product-form">
                    <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>
                    <div className="inputWrap">
                        <input
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            value={productData.name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Product Price"
                            value={productData.price}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="oldPrice"
                            placeholder="Old Price"
                            value={productData.oldPrice}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="image"
                            placeholder="Image URL"
                            value={productData.image}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={productData.category}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={productData.stock}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="seller"
                            placeholder="Seller"
                            value={productData.seller}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className="addEditbutton updateBtn" onClick={handleSaveProduct}>
                        {isEditing ? "Update" : "Add "}
                    </button>
                </div>
            </Modal>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={true} />
        </div>
    );
};

export default HandleProducts;
