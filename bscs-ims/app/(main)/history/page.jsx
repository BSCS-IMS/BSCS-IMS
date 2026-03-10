import { Suspense } from 'react'
import HistoryPage from '@/app/modules/history-page/HistoryPage'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HistoryPage />
    </Suspense>
  )
}