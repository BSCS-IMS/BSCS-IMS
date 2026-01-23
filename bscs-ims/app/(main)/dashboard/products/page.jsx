"use client";

import { useState } from "react";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/50",
      name: "Rice 5kg",
      quantity: 20,
      price: 250,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/50",
      name: "Rice 10kg",
      quantity: 15,
      price: 480,
    },
  ]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (!confirm("Delete this product?")) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-600">Products</h1>

        <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition">
          + Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No products found
                </td>
              </tr>
            )}

            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3">{product.quantity}</td>
                <td className="px-4 py-3">₱{product.price}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button className="px-3 py-1 text-xs bg-yellow-400 rounded hover:bg-yellow-500">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
