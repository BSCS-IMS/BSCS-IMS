import { Suspense } from 'react'
import ProductPage from '@/app/modules/products/ProductPage'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProductPage />
    </Suspense>
  )
}
