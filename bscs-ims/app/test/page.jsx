"use client";

import InventoryTable from "@/app/modules/magicui/BasicTable";

export default function TestPage() {
  return (
    <div className="h-screen flex flex-col">
      {/* TOP NAV */}
      <header className="h-14 bg-blue-950 text-white flex items-center px-6">
        Top Navigation
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT NAV */}
        <aside className="w-56 bg-gray-100 border-r px-4 py-6">
          <p className="font-semibold mb-4">Sidebar</p>
          <ul className="space-y-2 text-sm">
            <li>Dashboard</li>
            <li className="font-semibold">Inventory</li>
            <li>Reports</li>
          </ul>
        </aside>

        {/* CENTER CONTENT */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <InventoryTable />
          </div>
        </main>
      </div>
    </div>
  );
}
