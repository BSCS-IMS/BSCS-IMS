'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Skeleton,
  Stack
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

function truncateText(text, maxLength = 50) {
  if (!text) return '-'
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export default function AnnouncementsTable({ announcements, loading, onEdit, onDelete }) {
  const headerStyle = {
    fontWeight: 600,
    color: '#4A5568',
    fontSize: '0.8125rem',
    borderBottom: '1px solid #e5e7eb',
    bgcolor: '#f8f9fa',
    py: 1.5
  }

  const cellStyle = {
    borderBottom: '1px solid #e5e7eb',
    py: 2
  }

  if (loading) {
    return (
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Title</TableCell>
              <TableCell sx={headerStyle}>Content</TableCell>
              <TableCell sx={headerStyle}>Status</TableCell>
              <TableCell sx={headerStyle}>Created</TableCell>
              <TableCell sx={headerStyle} align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell sx={cellStyle}><Skeleton variant='text' width={120} /></TableCell>
                <TableCell sx={cellStyle}><Skeleton variant='text' width={200} /></TableCell>
                <TableCell sx={cellStyle}><Skeleton variant='rounded' width={70} height={24} /></TableCell>
                <TableCell sx={cellStyle}><Skeleton variant='text' width={100} /></TableCell>
                <TableCell sx={cellStyle} align='right'>
                  <Stack direction='row' spacing={1} justifyContent='flex-end'>
                    <Skeleton variant='circular' width={32} height={32} />
                    <Skeleton variant='circular' width={32} height={32} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  if (announcements.length === 0) {
    return (
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Title</TableCell>
              <TableCell sx={headerStyle}>Content</TableCell>
              <TableCell sx={headerStyle}>Status</TableCell>
              <TableCell sx={headerStyle}>Created</TableCell>
              <TableCell sx={headerStyle} align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} align='center' sx={{ py: 8, color: '#6b7280' }}>
                No announcements found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={headerStyle}>Title</TableCell>
            <TableCell sx={headerStyle}>Content</TableCell>
            <TableCell sx={headerStyle}>Status</TableCell>
            <TableCell sx={headerStyle}>Created</TableCell>
            <TableCell sx={headerStyle} align='right'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement.id} hover>
              <TableCell sx={cellStyle}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1F384C' }}>
                  {announcement.title}
                </Typography>
              </TableCell>
              <TableCell sx={cellStyle}>
                <Typography sx={{ fontSize: '0.75rem', color: '#374151' }}>
                  {truncateText(announcement.content, 60)}
                </Typography>
              </TableCell>
              <TableCell sx={cellStyle}>
                <Chip
                  label={announcement.isPublished ? 'Published' : 'Draft'}
                  size='small'
                  sx={{
                    bgcolor: announcement.isPublished ? '#dcfce7' : '#fef3c7',
                    color: announcement.isPublished ? '#166534' : '#92400e',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: 24
                  }}
                />
              </TableCell>
              <TableCell sx={cellStyle}>
                <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {formatDate(announcement.createdAt)}
                </Typography>
              </TableCell>
              <TableCell sx={cellStyle} align='right'>
                <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
                  <IconButton
                    size='small'
                    onClick={() => onEdit(announcement)}
                    sx={{ color: '#1F384C', '&:hover': { bgcolor: '#f3f4f6' } }}
                  >
                    <EditIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => onDelete(announcement)}
                    sx={{ color: '#991b1b', '&:hover': { bgcolor: '#fee2e2' } }}
                  >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
