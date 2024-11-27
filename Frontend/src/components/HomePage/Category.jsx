import React, { useContext } from "react";
import { ProductContext } from "../../Context/ProductContext";
import "./homeStyle.css";

const Category = ({ scrollToProducts }) => {
    const { setCategory } = useContext(ProductContext);

    const handleCategoryClick = (category) => {
        setCategory(category);
        scrollToProducts(); // Scroll to the Products section after selecting a category
    };

    return (
        <div className="category-container">
            <h2>Select Category</h2>
            <div className="category-buttons">
                <div className="pet">
                    <button
                        onClick={() => handleCategoryClick("dog")}
                        className="category-btn"
                    >
                        <img src="src/assets/category/dog.jpg" alt="Dog" />
                    </button>
                    <label>Dog</label>
                </div>
                <div className="pet">
                    <button
                        onClick={() => handleCategoryClick("cat")}
                        className="category-btn"
                    >
                        <img src="src/assets/category/Cat.png" alt="Cat" />
                    </button>
                    <label>Cat</label>
                </div>
            </div>
        </div>
    );
};

export default Category;