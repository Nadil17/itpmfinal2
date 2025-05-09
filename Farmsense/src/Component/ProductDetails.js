import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';
import EditFeedbackModal from '../Component/EditFeedbackModal'; // Import the modal component

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  
  // Get user data from AuthContext
  const { currentUser } = useContext(AuthContext);
  
  // Get userId from context first, fallback to localStorage if needed
  const userId = currentUser?.userId || localStorage.getItem("userId");
  
  const [newFeedback, setNewFeedback] = useState({
    comment: "",
    rating: 5,
    userId: userId || "1", // Use userId with fallback
    image: null // Add this line
  });
  const [submitting, setSubmitting] = useState(false);
  
  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFeedbackId, setEditFeedbackId] = useState(null);
  const [editFeedback, setEditFeedback] = useState({
    comment: "",
    rating: 5,
  });

  // State for feedback status messages
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

  useEffect(() => {
    // Log the current user ID
    console.log("User ID:", userId);
    
    if (currentUser) {
      console.log("Current user from context:", currentUser);
    } else {
      console.log("No user in context");
    }
    
    // Fetch product details
    axios.get(`http://localhost:8080/auth/products/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });

    // Fetch product feedbacks
    fetchFeedbacks();
    
    // Fetch average rating
    fetchAverageRating();
  }, [id, currentUser, userId]);

  const fetchFeedbacks = () => {
    axios.get(`http://localhost:8080/api/feedback/product/${id}`)
      .then(response => {
        setFeedbacks(response.data);
      })
      .catch(error => {
        console.error("Error fetching feedbacks:", error);
      });
  };

  const fetchAverageRating = () => {
    axios.get(`http://localhost:8080/api/feedback/product/${id}/rating`)
      .then(response => {
        setAverageRating(response.data.averageRating);
      })
      .catch(error => {
        console.error("Error fetching average rating:", error);
      });
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback(prev => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewFeedback(prev => ({
        ...prev,
        image: e.target.files[0]
      }));
    }
  };

  const handleEditFeedbackChange = (e) => {
    const { name, value } = e.target;
    setEditFeedback(prev => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value
    }));
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('productId', id);
    formData.append('userId', userId);
    formData.append('comment', newFeedback.comment);
    formData.append('rating', newFeedback.rating);
    if (newFeedback.image) {
      formData.append('image', newFeedback.image);
    }

    axios.post("http://localhost:8080/api/feedback", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log("Feedback submission successful:", response.data);
        // Reset form
        setNewFeedback({
          comment: "",
          rating: 5,
          userId: userId || "1",
          image: null
        });
        
        // Clear the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }
        
        setStatusMessage({
          type: "success",
          message: "Feedback submitted successfully!"
        });
        
        // Refresh feedbacks and average rating
        fetchFeedbacks();
        fetchAverageRating();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setStatusMessage({ type: "", message: "" });
        }, 3000);
      })
      .catch(error => {
        console.error("Error submitting feedback:", error);
        setStatusMessage({
          type: "error",
          message: "Error submitting feedback. Please try again."
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // Function to start editing a feedback
  const startEditFeedback = (feedback) => {
    setEditFeedbackId(feedback.id);
    setEditFeedback({
      comment: feedback.comment,
      rating: feedback.rating
    });
    setIsEditModalOpen(true);
  };

  // Function to cancel editing
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditFeedbackId(null);
    setEditFeedback({
      comment: "",
      rating: 5
    });
  };

  // Function to submit updated feedback
  const submitEditFeedback = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const feedbackData = {
      userId: userId,
      comment: editFeedback.comment,
      rating: editFeedback.rating
    };

    console.log('Submitting feedback update:', feedbackData); // Add this for debugging

    axios.put(`http://localhost:8080/api/feedback/${editFeedbackId}`, feedbackData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log("Feedback update successful:", response.data);
        
        setStatusMessage({
          type: "success",
          message: "Feedback updated successfully!"
        });
        
        closeEditModal();
        fetchFeedbacks();
        fetchAverageRating();
        
        setTimeout(() => {
          setStatusMessage({ type: "", message: "" });
        }, 3000);
      })
      .catch(error => {
        console.error("Error updating feedback:", error.response?.data || error);
        let errorMsg = "Error updating feedback. Please try again.";
        
        if (error.response?.status === 403) {
          errorMsg = error.response?.data?.error || "You are not authorized to update this feedback.";
        }
        
        setStatusMessage({
          type: "error",
          message: errorMsg
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // Function to delete feedback
  const deleteFeedback = (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    axios.delete(`http://localhost:8080/api/feedback/${feedbackId}?userId=${userId}`)
      .then(() => {
        setStatusMessage({
          type: "success",
          message: "Feedback deleted successfully!"
        });
        
        // Refresh feedbacks and average rating
        fetchFeedbacks();
        fetchAverageRating();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setStatusMessage({ type: "", message: "" });
        }, 3000);
      })
      .catch(error => {
        console.error("Error deleting feedback:", error);
        let errorMsg = "Error deleting feedback. Please try again.";
        
        if (error.response && error.response.status === 403) {
          errorMsg = "You are not authorized to delete this feedback.";
        }
        
        setStatusMessage({
          type: "error",
          message: errorMsg
        });
      });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xl ${i < rating ? "text-yellow-500" : "text-gray-300"}`}>
        ★
      </span>
    ));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>Error loading product details.</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="container mx-auto p-4">
      {/* User ID Display */}
      <div className="bg-blue-100 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold">Current User Information</h2>
        <p><strong>User ID:</strong> {userId || "Not available"}</p>
        <p><strong>Username:</strong> {currentUser?.username || localStorage.getItem("username") || "Not available"}</p>
      </div>

      {/* Status messages */}
      {statusMessage.message && (
        <div className={`rounded-lg p-4 mb-6 ${
          statusMessage.type === "success" 
            ? "bg-green-100 border-l-4 border-green-500 text-green-700" 
            : "bg-red-100 border-l-4 border-red-500 text-red-700"
        }`}>
          {statusMessage.message}
        </div>
      )}

      {/* Product Details Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="md:flex">
          {/* Product Image */}
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
          
          {/* Product Info */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="mr-2">{renderStars(Math.round(averageRating))}</div>
              <span className="text-lg font-semibold">({averageRating.toFixed(1)})</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="mb-2"><span className="font-semibold">Description:</span> {product.description}</p>
                <p className="mb-2"><span className="font-semibold">Type:</span> {product.type}</p>
                <p className="mb-2"><span className="font-semibold">Price:</span> ${product.price}</p>
                <p className="mb-2"><span className="font-semibold">Stock Quantity:</span> {product.stockQuantity}</p>
              </div>
              <div>
                <p className="mb-2"><span className="font-semibold">Manufacturing Date:</span> {formatDate(product.manufacturingDate)}</p>
                <p className="mb-2"><span className="font-semibold">Expiry Date:</span> {formatDate(product.expiryDate)}</p>
                <p className="mb-2"><span className="font-semibold">Manufacturer:</span> {product.manufacturer}</p>
                <p className="mb-2"><span className="font-semibold">Application Method:</span> {product.applicationMethod}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="text-lg font-semibold mb-2">Safety Instructions</h3>
              <p>{product.safetyInstructions}</p>
            </div>
            
            <div className="flex gap-3">
              <Link to={`/edit-product/${id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">Edit</Link>
              <Link to="/" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Back to List</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add Feedback Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Leave Your Feedback</h2>
        
        <form onSubmit={submitFeedback}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating" 
                    value={star} 
                    checked={newFeedback.rating === star}
                    onChange={handleFeedbackChange}
                    className="hidden"
                  />
                  <span 
                    className={`text-2xl ${newFeedback.rating >= star ? "text-yellow-500" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea 
              name="comment"
              value={newFeedback.comment}
              onChange={handleFeedbackChange}
              className="w-full border rounded p-2"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <input 
              type="file" 
              name="image" 
              onChange={handleImageChange}
              className="w-full border rounded p-2"
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>

      {/* Feedback List Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Customer Feedbacks</h2>
        {feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedbacks yet. Be the first to leave a feedback!</p>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <div className="mr-2">{renderStars(feedback.rating)}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-700">{feedback.comment}</p>
                {feedback.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={`http://localhost:8080${feedback.imageUrl}`} // Update image source
                      alt="Feedback" 
                      className="max-w-md h-auto rounded-lg shadow-md"
                      onClick={() => window.open(`http://localhost:8080${feedback.imageUrl}`, '_blank')} // Add click to enlarge
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                )}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">By: User #{feedback.user?.id || "Unknown"}</p>
                  
                  {/* Only show edit/delete options if the current user owns this feedback */}
                  {feedback.user && feedback.user.id.toString() === userId && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => startEditFeedback(feedback)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteFeedback(feedback.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Feedback Modal */}
      <EditFeedbackModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        feedback={editFeedback}
        onChange={handleEditFeedbackChange}
        onSubmit={submitEditFeedback}
        submitting={submitting}
      />
    </div>
  );
}; // Add closing brace for the ProductDetails component

export default ProductDetails;