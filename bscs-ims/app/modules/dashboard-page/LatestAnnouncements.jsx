'use client'

import { Box, Typography, Paper, Stack, Chip } from '@mui/material'
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
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 3,
        border: '1px solid #E5E7EB',
        bgcolor: '#FFFFFF'
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <CampaignIcon sx={{ color: PRIMARY_COLOR, fontSize: 24 }} />
        <Typography variant="h6" fontWeight={600} sx={{ color: PRIMARY_COLOR }}>
          Latest Announcements
        </Typography>
      </Stack>

      {!hasData ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 150,
            color: '#9CA3AF'
          }}
        >
          <Typography>No announcements yet</Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {data.map((announcement) => (
            <Box
              key={announcement.id}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                '&:hover': {
                  bgcolor: '#F3F4F6',
                  borderColor: PRIMARY_COLOR
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{
                    color: PRIMARY_COLOR,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '70%'
                  }}
                >
                  {announcement.title}
                </Typography>
                <Chip
                  label={announcement.isPublished ? 'Published' : 'Draft'}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    bgcolor: announcement.isPublished ? '#D1FAE5' : '#FEF3C7',
                    color: announcement.isPublished ? '#065F46' : '#92400E',
                    fontWeight: 500
                  }}
                />
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  color: '#6B7280',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.4,
                  mb: 1
                }}
              >
                {announcement.content}
              </Typography>
              <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                {formatDate(announcement.createdAt)}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  )
}
