import { Suspense } from 'react'
import InventoryTable from '@/app/modules/inventory-page/InventoryPage'

export default function Inventory() {
  return (
    <Suspense fallback={null}>
      <InventoryTable />
    </Suspense>
  )
}
