import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const UserProducts = () => {
  const { userId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/auth/products/user/${userId}`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Loading user's products...</p>;
  if (error) return <p>Error loading products.</p>;
  if (products.length === 0) return <p>No products found for this user.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User's Products</h1>
      <ul className="mt-4">
        {products.map(product => (
          <li key={product.id} className="border-b p-2">
            <Link to={`/product/${product.id}`} className="text-blue-600">{product.name}</Link>
            <span className="ml-4 text-gray-500">${product.price}</span>
          </li>
        ))}
      </ul>
      <Link to="/" className="mt-4 block text-blue-500">Back to Product List</Link>
    </div>
  );
};

export default UserProducts;
