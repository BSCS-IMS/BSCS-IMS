import { Suspense } from 'react'
import AuditLogsPage from '@/app/modules/audit-logs-page/AuditLogsPage'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuditLogsPage />
    </Suspense>
  )
}