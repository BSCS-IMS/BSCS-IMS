'use client'

import Link from 'next/link'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import { Box, Typography, Stack, Chip } from '@mui/material'
import CampaignIcon from '@mui/icons-material/Campaign'

const PRIMARY_COLOR = '#1F384C'

function formatDate(timestamp) {
  if (!timestamp) return ''

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export default function LatestAnnouncements({ data = [] }) {
  const hasData = data.length > 0

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
        <CampaignIcon sx={{ color: PRIMARY_COLOR, fontSize: 16 }} />
        <Typography variant="body2" fontWeight={500} sx={{ color: PRIMARY_COLOR }}>
          Latest Announcements
        </Typography>
      </Stack>

      {!hasData ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 230,
            color: '#9CA3AF'
          }}
        >
          <Typography variant="body2">No announcements yet</Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {data.map((announcement) => (
            <Box
              key={announcement.id}
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: '#F9FAFB',
                '&:hover': {
                  bgcolor: '#F3F4F6'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{
                    color: PRIMARY_COLOR,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '70%',
                    fontSize: 11
                  }}
                >
                  {announcement.title}
                </Typography>
                <Chip
                  label={announcement.isPublished ? 'Published' : 'Draft'}
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: 8,
                    bgcolor: announcement.isPublished ? '#D1FAE5' : '#FEF3C7',
                    color: announcement.isPublished ? '#065F46' : '#92400E',
                    fontWeight: 500
                  }}
                />
              </Stack>
              <Typography
                variant="caption"
                sx={{
                  color: '#9CA3AF',
                  fontSize: 9
                }}
              >
                {formatDate(announcement.createdAt)}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  )
}
