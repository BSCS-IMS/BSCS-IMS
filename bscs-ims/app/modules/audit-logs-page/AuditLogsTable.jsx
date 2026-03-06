'use client'

import {
  Chip,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Tooltip
} from '@mui/material'

function formatDateTime(timestamp) {
  if (!timestamp) return '-'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getActionColor(action) {
  switch (action) {
    case 'CREATE':
      return { bgcolor: '#e8f5e9', color: '#2e7d32' }
    case 'UPDATE':
      return { bgcolor: '#e3f2fd', color: '#1565c0' }
    case 'DELETE':
      return { bgcolor: '#ffebee', color: '#c62828' }
    default:
      return { bgcolor: '#f5f5f5', color: '#616161' }
  }
}

function truncateText(text, maxLength = 20) {
  if (!text) return '-'
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

function formatChanges(log) {
  if (!log) return '-'
  
  const { action, oldData, newData, entityType } = log
  
  if (action === 'CREATE') {
    // Customize based on entity type
    switch (entityType) {
      case 'announcement':
        return `Created new announcement: "${newData?.title || 'Untitled'}"`
      case 'product':
        return `Added new product: "${newData?.name || newData?.productName || 'Unnamed'}"`
      case 'reseller':
        return `Added new reseller: "${newData?.businessName || newData?.ownerName || 'Unnamed'}"` // ✅ Fixed
      case 'inventory':
        return `Added new inventory item: "${newData?.itemName || newData?.name || newData?.productName || 'Unnamed'}"` // ✅ Fixed
      default:
        return 'New record created'
    }
  }
  
  if (action === 'DELETE') {
    // Customize based on entity type
    switch (entityType) {
      case 'announcement':
        return `Deleted announcement: "${oldData?.title || 'Untitled'}"`
      case 'product':
        return `Removed product: "${oldData?.name || oldData?.productName || 'Unnamed'}"`
      case 'reseller':
        return `Removed reseller: "${oldData?.businessName || oldData?.ownerName || 'Unnamed'}"` // ✅ Fixed
      case 'inventory':
        return `Removed inventory item: "${oldData?.itemName || oldData?.name || oldData?.productName || 'Unnamed'}"` // ✅ Fixed
      default:
        return 'Record deleted'
    }
  }
  
  if (action === 'UPDATE' && oldData && newData) {
    const changeDetails = []
    
    // Fields to completely ignore
    const ignoredFields = [
      'updatedAt', 
      'updatedByEmail', 
      'updatedById',
      'createdAt', 
      'createdByEmail', 
      'createdByUid',
      'createdById',
      'timestamp',
      'platform'
    ]
    
    Object.keys(newData).forEach(key => {
      // Skip ignored fields
      if (ignoredFields.includes(key)) {
        return
      }
      
      const oldValue = oldData[key]
      const newValue = newData[key]
      
      // Check if values actually changed
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        // Format specific field changes with user-friendly messages
        switch (key) {
          case 'title':
            changeDetails.push(`Renamed from "${oldValue}" to "${newValue}"`)
            break
            
          case 'name':
          case 'productName':
            changeDetails.push(`Name changed from "${oldValue}" to "${newValue}"`)
            break
            
          case 'businessName':
            changeDetails.push(`Business name changed from "${oldValue}" to "${newValue}"`)
            break
            
          case 'ownerName':
            changeDetails.push(`Owner name changed from "${oldValue}" to "${newValue}"`)
            break
            
          case 'content':
            changeDetails.push(`Updated description`)
            break
            
          case 'isPublished':
            if (newValue) {
              changeDetails.push(`Published announcement`)
            } else {
              changeDetails.push(`Changed to draft`)
            }
            break
            
          case 'publishAt':
            // Only show if actually changed and not during publish action
            if (oldValue && newValue) {
              changeDetails.push(`Changed publish date`)
            }
            break
            
          case 'price':
            const priceDiff = newValue - oldValue
            if (priceDiff > 0) {
              changeDetails.push(`Increased price by ₱${priceDiff.toFixed(2)} (₱${oldValue} → ₱${newValue})`)
            } else {
              changeDetails.push(`Decreased price by ₱${Math.abs(priceDiff).toFixed(2)} (₱${oldValue} → ₱${newValue})`)
            }
            break
            
          case 'quantity':
          case 'stock':
          case 'stockQuantity':
            const qtyDiff = newValue - oldValue
            if (qtyDiff > 0) {
              changeDetails.push(`Added ${qtyDiff} units (${oldValue} → ${newValue})`)
            } else {
              changeDetails.push(`Removed ${Math.abs(qtyDiff)} units (${oldValue} → ${newValue})`)
            }
            break
            
          case 'email':
            changeDetails.push(`Email updated to ${newValue}`)
            break
            
          case 'phone':
          case 'phoneNumber':
          case 'contactNumber':
            changeDetails.push(`Contact number updated to ${newValue}`)
            break
            
          case 'address':
            changeDetails.push(`Address updated`)
            break
            
          case 'status':
            changeDetails.push(`Status changed from ${oldValue} to ${newValue}`)
            break
            
          case 'category':
            changeDetails.push(`Category changed to ${newValue}`)
            break
            
          case 'description':
          case 'notes':
            changeDetails.push(`Updated notes`)
            break
            
          case 'unit':
            changeDetails.push(`Unit changed from ${oldValue} to ${newValue}`)
            break
            
          case 'weight':
            changeDetails.push(`Weight changed from ${oldValue} to ${newValue}`)
            break
            
          case 'discount':
            if (newValue > oldValue) {
              changeDetails.push(`Increased discount to ${newValue}%`)
            } else if (newValue < oldValue) {
              changeDetails.push(`Decreased discount to ${newValue}%`)
            }
            break
            
          case 'isActive':
          case 'active':
            if (newValue) {
              changeDetails.push(`Activated`)
            } else {
              changeDetails.push(`Deactivated`)
            }
            break
            
          case 'imageUrl':
            if (!oldValue && newValue) {
              changeDetails.push(`Image added`)
            } else if (oldValue && !newValue) {
              changeDetails.push(`Image removed`)
            } else if (oldValue && newValue) {
              changeDetails.push(`Image updated`)
            }
            break
            
          case 'itemName':
            changeDetails.push(`Item name changed from "${oldValue}" to "${newValue}"`)
            break
            
          default:
            // For any other field, show a generic user-friendly message
            const fieldName = key
              .replace(/([A-Z])/g, ' $1') // Add space before capital letters
              .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
              .trim()
            changeDetails.push(`${fieldName} updated`)
        }
      }
    })
    
    if (changeDetails.length === 0) {
      return 'No changes detected'
    }
    
    // Return detailed changes (show up to 3, then indicate more)
    if (changeDetails.length <= 3) {
      return changeDetails.join(' • ')
    } else {
      return `${changeDetails.slice(0, 3).join(' • ')} • +${changeDetails.length - 3} more changes`
    }
  }
  
  return '-'
}

export default function AuditLogsTable({ logs, loading, page, rowsPerPage, onChangePage, onChangeRowsPerPage }) {
  const paginatedLogs = logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <TableContainer component={Paper} sx={{ border: '1px solid #e5e7eb', boxShadow: 'none' }}>
      <Table sx={{ minWidth: 650, tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '15%',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Date/Time
            </TableCell>
            <TableCell
              align='center'
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '10%',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Action
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '12%',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Module
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '15%',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Record ID
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '28%',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Changes
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '20%',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Performed By
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={20} />
                </TableCell>
                <TableCell align='center' sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rounded' width={70} height={24} sx={{ mx: 'auto' }} />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={20} />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={20} />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={20} />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={20} />
                </TableCell>
              </TableRow>
            ))
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align='center' sx={{ py: 6, color: '#6b7280', fontSize: '0.8125rem', boxShadow: 'none' }}>
                No audit logs found
              </TableCell>
            </TableRow>
          ) : (
            paginatedLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell
                  sx={{
                    color: '#1F384C',
                    fontSize: '0.75rem',
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  {formatDateTime(log.timestamp)}
                </TableCell>
                <TableCell
                  align='center'
                  sx={{
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  <Chip
                    label={log.action}
                    size='small'
                    sx={{
                      ...getActionColor(log.action),
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      height: 24,
                      border: 'none'
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    color: '#374151',
                    fontSize: '0.75rem',
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none',
                    textTransform: 'capitalize'
                  }}
                >
                  {log.entityType || '-'}
                </TableCell>
                <TableCell
                  sx={{
                    color: '#374151',
                    fontSize: '0.75rem',
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none',
                    fontFamily: 'monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Tooltip title={log.entityId || '-'} arrow placement="top">
                    <span>{truncateText(log.entityId, 20)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell
                  sx={{
                    color: '#374151',
                    fontSize: '0.75rem',
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  {formatChanges(log)}
                </TableCell>
                <TableCell
                  sx={{
                    color: '#374151',
                    fontSize: '0.75rem',
                    py: 2,
                    boxShadow: 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Tooltip title={log.performedBy || 'SYSTEM'} arrow placement="top">
                    <span>{log.performedBy || 'SYSTEM'}</span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component='div'
        count={logs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        sx={{
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.75rem'
          },
          '& .MuiTablePagination-select': {
            fontSize: '0.75rem'
          }
        }}
      />
    </TableContainer>
  )
}