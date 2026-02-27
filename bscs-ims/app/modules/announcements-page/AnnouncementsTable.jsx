'use client'

import { useState } from 'react'
import {
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

function formatDate(timestamp) {
  if (!timestamp) return '-'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function truncateText(text, maxLength = 60) {
  if (!text) return '-'
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export default function AnnouncementsTable({ announcements, loading, onEdit, onDelete }) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (_, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const paginatedAnnouncements = announcements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
                width: '25%',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Title
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '35%',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Content
            </TableCell>
            <TableCell
              align='center'
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
              Status
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
              Created
            </TableCell>
            <TableCell
              align='center'
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '13%',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Actions
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
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={20} />
                </TableCell>
                <TableCell align='center' sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rounded' width={70} height={24} sx={{ mx: 'auto' }} />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={20} />
                </TableCell>
                <TableCell align='center' sx={{ py: 2 }}>
                  <Stack direction='row' spacing={0.75} justifyContent='center'>
                    <Skeleton variant='circular' width={28} height={28} />
                    <Skeleton variant='circular' width={28} height={28} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : announcements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align='center' sx={{ py: 6, color: '#6b7280', fontSize: '0.8125rem', boxShadow: 'none' }}>
                No announcements found
              </TableCell>
            </TableRow>
          ) : (
            paginatedAnnouncements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell
                  sx={{
                    color: '#374151',
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      color: '#1F384C'
                    }}
                  >
                    {announcement.title}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    color: '#374151',
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  <Typography sx={{ fontSize: '0.75rem', color: '#374151' }}>
                    {truncateText(announcement.content, 60)}
                  </Typography>
                </TableCell>
                <TableCell
                  align='center'
                  sx={{
                    color: '#374151',
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  <Chip
                    label={announcement.isPublished ? 'Published' : 'Draft'}
                    size='small'
                    sx={{
                      bgcolor: announcement.isPublished ? '#e8f5e9' : '#fff3e0',
                      color: announcement.isPublished ? '#2e7d32' : '#e65100',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      height: 24,
                      border: 'none'
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    color: '#1F384C',
                    fontSize: '0.75rem',
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  {formatDate(announcement.createdAt)}
                </TableCell>
                <TableCell align='center' sx={{ py: 2, boxShadow: 'none' }}>
                  <Stack direction='row' spacing={0.75} justifyContent='center'>
                    <Tooltip title='Edit Announcement'>
                      <IconButton
                        onClick={() => onEdit(announcement)}
                        size='small'
                        sx={{
                          bgcolor: '#e3f2fd',
                          color: '#1565c0',
                          width: 28,
                          height: 28,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: '#bbdefb'
                          }
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Delete Announcement'>
                      <IconButton
                        onClick={() => onDelete(announcement)}
                        size='small'
                        sx={{
                          bgcolor: '#ffebee',
                          color: '#c62828',
                          width: 28,
                          height: 28,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: '#ffcdd2'
                          }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component='div'
        count={announcements.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
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
