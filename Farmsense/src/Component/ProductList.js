import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Loading products...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading products.</p>;

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Product List
      </h1>
      <br />

      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search product..."
          className="w-1/2 px-4 py-2 border-1 border-green-700 text-gray-900 font-semibold bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 shadow-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Product Table */}
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
        <table className="w-full border border-gray-300 shadow-md rounded-lg text-left">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-3 border-b">Product</th>
              <th className="px-6 py-3 border-b">Type</th>
              <th className="px-6 py-3 border-b">Manufacturer</th>
              <th className="px-6 py-3 border-b text-center">Stock</th>
              <th className="px-6 py-3 border-b text-center">Price</th>
              <th className="px-6 py-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-3">{product.name}</td>
                  <td className="px-6 py-3">{product.type}</td>
                  <td className="px-6 py-3">{product.manufacturer}</td>
                  <td className="px-6 py-3 text-center">
                    {product.stockQuantity}
                  </td>
                  <td className="px-6 py-3 text-center">${product.price}</td>
                  <td className="px-6 py-3 flex justify-center gap-2">
                    {/* Uniform Buttons */}
                    <Link
                      to={`/product/${product.id}`}
                      className="w-24 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center transition"
                    >
                      View
                    </Link>

                    <Link
                      to={`/product/edit/${product.id}`}
                      className="w-24 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-center transition"
                    >
                      Edit
                    </Link>

                    <button
                      className="w-24 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-center transition"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this product?"
                          )
                        ) {
                          // Handle delete logic here
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

{/* Add Product Button */}
<div className="flex justify-end mt-5">
  <Link
    to="/product/create"
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
  >
    Add Product
  </Link>
</div>



      </div>


    </div>
  );
};

export default ProductList;
