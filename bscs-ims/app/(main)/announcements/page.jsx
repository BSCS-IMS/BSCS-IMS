import { Suspense } from 'react'
import AnnouncementsPage from '@/app/modules/announcements-page/AnnouncementsPage'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AnnouncementsPage />
    </Suspense>
  )
}
