import React, { useState } from "react";
import { XMarkIcon, StarIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { addProductReview } from "../../services/reviewService";
import { toast } from "sonner";

const ReviewModal = ({ isOpen, onClose, orderItems, orderId }) => {
  const [reviews, setReviews] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      Object.values(reviews).forEach(review => {
        if (review.images) {
          review.images.forEach(image => {
            if (typeof image === 'object') {
              URL.revokeObjectURL(URL.createObjectURL(image));
            }
          });
        }
      });
    };
  }, [reviews]);

  const handleRatingChange = (productId, rating) => {
    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], rating }
    }));
  };

  const handleCommentChange = (productId, comment) => {
    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], comment }
    }));
  };

  const handleImageUpload = (productId, files) => {
    const fileArray = Array.from(files);
    if (fileArray.length > 5) {
      toast.error("Maximum 5 images allowed per review");
      return;
    }

    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], images: fileArray }
    }));
  };

  const removeImage = (productId, imageIndex) => {
    setReviews(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        images: prev[productId]?.images?.filter((_, index) => index !== imageIndex) || []
      }
    }));
  };

  const handleSubmitReview = async (productId) => {
    const review = reviews[productId];
    if (!review?.rating || !review?.comment?.trim()) {
      toast.error("Please provide both rating and comment");
      return;
    }

    try {
      setSubmitting(true);
      
      // Show immediate feedback
      toast.loading("Submitting your review...", { id: `review-${productId}` });
      
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('orderId', orderId);
      formData.append('rating', review.rating.toString());
      formData.append('comment', review.comment.trim());
      
      // Add images if any
      if (review.images && review.images.length > 0) {
        review.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      await addProductReview(formData);
      
      // Dismiss loading toast and show success
      toast.dismiss(`review-${productId}`);
      toast.success("Review submitted successfully!");
      
      // Mark as submitted
      setReviews(prev => ({
        ...prev,
        [productId]: { ...prev[productId], submitted: true }
      }));
      
      // Auto-close modal after a short delay if all reviews are submitted
      setTimeout(() => {
        const allSubmitted = orderItems.every(item => 
          reviews[item.product._id]?.submitted
        );
        if (allSubmitted) {
          onClose();
        }
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting review:", error);
      // Dismiss loading toast and show error
      toast.dismiss(`review-${productId}`);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (productId, currentRating = 0) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(productId, star)}
            className="focus:outline-none transition-colors"
            disabled={reviews[productId]?.submitted}
          >
            {star <= currentRating ? (
              <StarSolidIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <StarIcon className="h-6 w-6 text-gray-300 hover:text-yellow-400" />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">
              Review Your Products
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {orderItems?.filter(item => !item.hasReviewed).map((item, index) => {
              const productId = item.product?._id;
              const currentReview = reviews[productId] || {};
              
              return (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  {/* Product Info */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product?.image?.[0] || "/placeholder.png"}
                      alt={item.product?.name || "Product"}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.product?.name || "Product"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Size: {item.variant?.size || "N/A"} | Color: {item.variant?.color || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Rating *
                    </label>
                    {renderStars(productId, currentReview.rating)}
                    {currentReview.rating && (
                      <p className="text-sm text-gray-600">
                        {currentReview.rating} out of 5 stars
                      </p>
                    )}
                  </div>

                  {/* Comment */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Your Review *
                    </label>
                    <textarea
                      rows={3}
                      value={currentReview.comment || ""}
                      onChange={(e) => handleCommentChange(productId, e.target.value)}
                      placeholder="Share your experience with this product..."
                      disabled={currentReview.submitted}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Add Photos (Optional)
                    </label>
                    <div className="space-y-3">
                      {/* Upload Button */}
                      {!currentReview.submitted && (!currentReview.images || currentReview.images.length < 5) && (
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-2 pb-2">
                              <PhotoIcon className="w-6 h-6 mb-2 text-gray-400" />
                              <p className="text-xs text-gray-500">Click to upload images</p>
                              <p className="text-xs text-gray-400">Max 5 images, up to 10MB each</p>
                            </div>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleImageUpload(productId, e.target.files)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}

                      {/* Preview Images */}
                      {currentReview.images && currentReview.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {currentReview.images.map((image, imageIndex) => (
                            <div key={imageIndex} className="relative group">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${imageIndex + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                              {!currentReview.submitted && (
                                <button
                                  onClick={() => removeImage(productId, imageIndex)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <TrashIcon className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    {currentReview.submitted ? (
                      <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md">
                        ✓ Review Submitted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSubmitReview(productId)}
                        disabled={submitting || !currentReview.rating || !currentReview.comment?.trim()}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Order #{orderId?.slice(-8).toUpperCase()}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
