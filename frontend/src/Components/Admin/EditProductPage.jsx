import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSingleProduct, updateProduct } from "../../services/productService";
import { toast } from "sonner";

const EditProductPage = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    subcategory: "",
    color: "",
    sizes: [],
    images: [],
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchSingleProduct(id);
        setProductData({
          ...data,
          sizes: data.sizes || [],
          images: data.image.map((url) => ({ url })), // convert image[] to images[]
        });
      } catch (err) {
        toast.error("Failed to load product data");
        console.error(err);
      }
    };

    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, { url, file }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");
    if (!token) return toast.error("Admin not authenticated");

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("stock", productData.stock);
    formData.append("category", productData.category);
    formData.append("subcategory", productData.subcategory);
    formData.append("color", productData.color);
    formData.append("sizes", JSON.stringify(productData.sizes));

    productData.images.forEach((imgObj, index) => {
      if (imgObj.file) {
        formData.append(`image${index + 1}`, imgObj.file);
      }
    });

    try {
      const res = await updateProduct(formData, token, id);
      if (res.success) {
        toast.success("✅ Product updated successfully!");
      } else {
        toast.error("❌ Failed to update product");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("❌ Server error while updating.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-2xl rounded-2xl mt-8">
      <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">Edit Product</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={5}
              value={productData.description}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={productData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={productData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
              >
                <option value="">Select</option>
                <option value="T-shirts">T-shirts</option>
                <option value="Shirts">Shirts</option>
                <option value="Jeans">Jeans</option>
                <option value="Shorts">Shorts</option>
                <option value="Jumpsuits">Jumpsuits</option>
                <option value="Dresses">Dresses</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Subcategory</label>
              <select
                name="subcategory"
                value={productData.subcategory}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
              >
                <option value="">Select</option>
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
                <option value="Sportswear">Sportswear</option>
                <option value="Partywear">Partywear</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Sizes (comma-separated)</label>
            <input
              type="text"
              value={productData.sizes.join(", ")}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  sizes: e.target.value.split(",").map((s) => s.trim().toUpperCase()),
                })
              }
              placeholder="e.g. S, M, L"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Color</label>
            <input
              type="text"
              name="color"
              value={productData.color}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Upload Images (up to 5)</label>
            <input type="file" onChange={handleImageUpload} accept="image/*" />
            <div className="flex flex-wrap gap-4 mt-4">
              {productData.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`preview-${index}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
