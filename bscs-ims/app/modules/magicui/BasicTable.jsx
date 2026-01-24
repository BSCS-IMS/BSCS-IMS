"use client"
import { useState } from "react";
import { Search, Funnel, ArrowUpNarrowWide, ArrowDownNarrowWide, Pencil, Trash2,Plus } from "lucide-react";

export default function InventoryTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data - replace with your actual data
const inventoryData = [
  { id: 1, location: "Warehouse A", products: ["Rice 25kg", "Rice 50kg", "Sugar 1kg"] },
  { id: 2, location: "Warehouse B", products: ["Rice 25kg", "Cooking Oil 1L"] },
  { id: 3, location: "Store 1", products: ["Rice 25kg", "Rice 50kg", "Sugar 1kg", "Salt 500g"] },
  { id: 4, location: "Store 2", products: ["Rice 25kg"] },
  { id: 5, location: "Warehouse C", products: ["Rice 25kg", "Rice 50kg", "Sugar 1kg", "Cooking Oil 1L", "Salt 500g"] },

  { id: 6, location: "Store 3", products: ["Rice 25kg", "Sugar 1kg"] },
  { id: 7, location: "Store 4", products: ["Rice 50kg", "Salt 500g"] },
  { id: 8, location: "Warehouse D", products: ["Rice 25kg", "Cooking Oil 1L"] },
  { id: 9, location: "Store 5", products: ["Rice 25kg", "Rice 50kg"] },
  { id: 10, location: "Warehouse E", products: ["Sugar 1kg", "Salt 500g"] },

  { id: 11, location: "Store 6", products: ["Rice 25kg", "Cooking Oil 1L"] },
  { id: 12, location: "Store 7", products: ["Rice 50kg", "Sugar 1kg"] },
  { id: 13, location: "Warehouse F", products: ["Rice 25kg", "Rice 50kg", "Salt 500g"] },
  { id: 14, location: "Store 8", products: ["Rice 25kg", "Sugar 1kg", "Salt 500g"] },
  { id: 15, location: "Warehouse G", products: ["Rice 50kg", "Cooking Oil 1L"] },

  { id: 16, location: "Store 9", products: ["Rice 25kg"] },
  { id: 17, location: "Store 10", products: ["Sugar 1kg", "Salt 500g"] },
  { id: 18, location: "Warehouse H", products: ["Rice 25kg", "Rice 50kg", "Cooking Oil 1L"] },
  { id: 19, location: "Store 11", products: ["Rice 25kg", "Rice 50kg", "Sugar 1kg"] },
  { id: 20, location: "Warehouse I", products: ["Rice 25kg", "Rice 50kg", "Sugar 1kg", "Salt 500g"] }
];


  const handleEdit = (id) => {
    console.log("Edit location:", id);
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    console.log("Delete location:", id);
    // Add your delete logic here
  };

  const filteredData = inventoryData.filter(item =>
    item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-blue-950">Inventory</h1>
        <button className="text-blue-950 px-3 py-1.5 rounded hover:bg-blue-200/50 transition flex flex-col items-center">
              <Plus className="w-4 h-4" strokeWidth={4} />
              <span className="text-xs">Add</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </button>
        </div>
        <button className="bg-blue-950 text-white px-4 py-1.5 rounded-lg hover:bg-blue-900 transition text-sm">
          Search
        </button>
        <button className="border text-blue-950 border-gray-300 px-2 py-1.5 rounded hover:bg-blue-200/50 transition flex flex-col items-center">
          <Funnel className="w-4 h-4" strokeWidth={3} />
          <span className="text-xs">Filter</span>
        </button>
        <button className="text-blue-950 border border-gray-300 px-2 py-1.5 rounded hover:bg-blue-200/50 transition flex flex-col items-center">
          <ArrowUpNarrowWide className="w-4 h-4" strokeWidth={3} />
          <span className="text-xs">Sort asc</span>
        </button>
        <button className="text-blue-950 border border-gray-300 px-2 py-1.5 rounded hover:bg-blue-200/50 transition flex flex-col items-center">
          <ArrowDownNarrowWide className="w-4 h-4" strokeWidth={3} />
          <span className="text-xs">Sort desc</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg drop-shadow-lg/20 overflow-hidden p-4 mb-4">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                Location Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                Products Associated
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300/80">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">
                  {item.location}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {item.products.map((product, index) => (
                    <div key={index}>{product}</div>
                  ))}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-indigo-600 hover:text-blue-950 transition"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-end">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <span className="text-gray-600 ml-2">
              {startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredData.length)} of {filteredData.length}
            </span>
            
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                &lt;
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}