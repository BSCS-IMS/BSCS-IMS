"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-md"
      >
        Open Modal
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] bg-white rounded-xl shadow-lg p-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                📄 Add Modal
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-5">
              [Product Name - SKU]
            </p>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Location Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Quantity<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
