import { Suspense } from 'react'
import ResellersPage from '@/app/modules/resellers-page/ResellersPage'

export default function Resellers() {
  return (
    <Suspense fallback={null}>
      <ResellersPage />
    </Suspense>
  )
}
