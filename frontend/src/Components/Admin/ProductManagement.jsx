import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllProducts, removeProduct } from "../../services/productService";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      const res = await fetchAllProducts();
      setProducts(res);
    } catch (err) {
      console.error("❌ Error loading products:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await removeProduct(id, token);
      if (res.success) {
        alert("✅ Product deleted");
        loadProducts(); // Refresh
      } else {
        alert("❌ Failed to delete product");
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("❌ Server error while deleting");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="p-4">₹{product.price}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
