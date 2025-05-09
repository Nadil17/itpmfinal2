import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { ShoppingCart } from 'lucide-react';
import ShoppingCartIcon from '../icons/shopping-cart.png';

function PlaceOrder() {
    const navigate = useNavigate();
    const [quantities, setQuantities] = useState({});
    const { userId } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8080/auth/products")
            .then((response) => {
                setProducts(response.data);
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // Copy previous quantity and add each product to value - value means quantity
    function handleQuantityChange(productId, value) {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: value,
        }));
    }

    function saveCart(userId, productId, quantity) {
        console.log({ userId, productId, quantity });

        const cartObject = {
            userId,
            productId,
            quantity,
            onCart: true,
        };

        axios
            .post("http://localhost:8080/api/orders/addOrder", cartObject)
            .then(() => {
                alert("Added to cart");
            })
            .catch((err) => {
                alert("Error: " + err.response?.data || "Failed to add to cart");
            });
    }

    function handleViewCartButton() {
        navigate(`/cart/${userId}`);
    }

    return (
        <div>
            <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 gap-6">
                {/* Cart Icon */}
                <div className="relative">
                    <div className="absolute top-0 right-0">
                        <button 
                            className="bg-gray-800 text-white flex items-center py-2 px-4 rounded-lg hover:bg-gray-900" 
                            onClick={handleViewCartButton}
                        >
                            <img src={ShoppingCartIcon} alt="Report" className="w-5 h-5 mr-2" />
                            View Cart
                        </button>
                    </div>
                </div>

                <br></br>

                {products.map((product) => (
                    <div key={product.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row">
                        {/* Product Image Section */}
                        <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                            {product.imageUrl ? (
                                <img
                                    src={`http://localhost:8080${product.imageUrl}`}
                                    alt={product.name}
                                    className="w-full h-auto rounded-lg shadow-md object-cover"
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500">No image available</span>
                                </div>
                            )}
                        </div>

                        {/* Product Information Section */}
                        <div className="md:w-2/3">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h2>

                            <p className="text-gray-600 mb-4">{product.description}</p>
                            <p className="text-xl font-bold text-green-600">Rs. {product.price}.00</p>

                            {/* Input for quantity */}
                            <input
                                type="number"
                                min="0"
                                value={quantities[product.id] || 0}
                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                className="border p-2 rounded my-4 w-24"
                                placeholder="Qty"
                            />

                            {/* Buttons container for View and Add to Cart */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {/* View button */}
                                <button
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
                                >
                                    View
                                </button>
                                
                                {/* Add to Cart button - disabled if quantity is 0 or empty */}
                                <button
                                    onClick={() => saveCart(userId, product.id, quantities[product.id])}
                                    disabled={!quantities[product.id] || quantities[product.id] <= 0}
                                    className={`py-2 px-4 ${quantities[product.id] > 0 ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"} rounded-lg transition-colors duration-300`}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default PlaceOrder