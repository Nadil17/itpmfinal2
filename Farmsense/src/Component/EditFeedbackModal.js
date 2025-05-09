import React from 'react';

const EditFeedbackModal = ({ 
  isOpen, 
  onClose, 
  feedback, 
  onChange, 
  onSubmit, 
  submitting 
}) => {
  if (!isOpen) return null;

  const renderStarRating = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <label key={star} className="cursor-pointer">
            <input 
              type="radio" 
              name="rating" 
              value={star} 
              checked={feedback.rating === star}
              onChange={onChange}
              className="hidden"
            />
            <span 
              className={`text-2xl ${feedback.rating >= star ? "text-yellow-500" : "text-gray-300"}`}
            >
              ★
            </span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Edit Your Feedback</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rating</label>
            {renderStarRating()}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea 
              name="comment"
              value={feedback.comment}
              onChange={onChange}
              className="w-full border rounded p-2"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFeedbackModal;