import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/auth/products/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const generateReport = () => {
    if (!product) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Product Details Report", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Name: ${product.name}`, 20, 30);
    doc.text(`Description: ${product.description}`, 20, 40);
    doc.text(`Type: ${product.type}`, 20, 50);
    doc.text(`Price: $${product.price}`, 20, 60);
    doc.text(`Stock Quantity: ${product.stockQuantity}`, 20, 70);
    doc.text(`Manufacturing Date: ${product.manufacturingDate}`, 20, 80);
    doc.text(`Expiry Date: ${product.expiryDate}`, 20, 90);
    doc.text(`Manufacturer: ${product.manufacturer}`, 20, 100);
    doc.text(`Application Method: ${product.applicationMethod}`, 20, 110);
    doc.text(`Safety Instructions: ${product.safetyInstructions}`, 20, 120);
    doc.text(`Status: ${product.active ? "Active" : "Inactive"}`, 20, 130);
    doc.text(`Banned: ${product.banned ? "Yes" : "No"}`, 20, 140);

    doc.save(`Product_Report_${product.name}.pdf`);
  };

  if (loading) return <p className="text-center text-gray-500">Loading product details...</p>;
  if (error) return <p className="text-center text-red-500">Error loading product details.</p>;
  if (!product) return <p className="text-center text-gray-500">Product not found.</p>;

  return (
 <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
   <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
     <div className="px-4 py-6 sm:px-10 bg-green-600 text-white">
    <h1 className="text-3xl font-bold text-white-800 mb-4 text-center">{product.name}</h1>
    </div>

    <div className="max-w-3xl mx-auto p-6 border-gray-300">
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Description:</span>
            <span>{product.description}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Type:</span>
            <span>{product.type}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Price:</span>
            <span>${product.price}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Stock Quantity:</span>
            <span>{product.stockQuantity}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Manufacturing Date:</span>
            <span>{product.manufacturingDate}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Expiry Date:</span>
            <span>{product.expiryDate}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Manufacturer:</span>
            <span>{product.manufacturer}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Status:</span>
            <span className={`font-semibold ${product.active ? "text-green-600" : "text-red-600"}`}>
              {product.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4 bg-blue-50 p-4 rounded-lg">
        <div>
          <span className="font-semibold block mb-2">Application Method:</span>
          <p className="text-gray-700">{product.applicationMethod}</p>
        </div>
        <div>
          <span className="font-semibold block mb-2">Safety Instructions:</span>
          <p className="text-gray-700">{product.safetyInstructions}</p>
        </div>
        <div>
          <span className="font-semibold block mb-2">Banned:</span>
          <span className={`font-semibold ${product.banned ? "text-red-600" : "text-green-600"}`}>
            {product.banned ? "Yes" : "No"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-4">
        <div className="flex gap-4">
          <Link 
            to={`/product/edit/${product.id}`} 
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
          >
            Edit
          </Link>
          <Link 
            to={`/product/delete/${product.id}`} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          >
            Delete
          </Link>
        </div>
        
        <button 
          onClick={generateReport} 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
        >
          Download Report
        </button>
      </div>

      <Link 
        to="/products" 
        className="mt-6 block text-blue-500 hover:underline"
      >
        Back to Product Dashboard
      </Link>
    </div>
    </div>
    </div>
  );
};

export default ProductDetail;
