'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Typography, Grid, Skeleton, useMediaQuery, useTheme } from '@mui/material'

import BarChartCard from './BarChartCard'
import TopProductsPieChart from './TopProductsPieChart'
import ResellersPieChart from './ResellersPieChart'
import LatestAnnouncements from './LatestAnnouncements'
import LocationLineChart from './LocationLineChart'

const PRIMARY_COLOR = '#1F384C'

function ChartSkeleton({ height = 300 }) {
  return (
    <Skeleton
      variant="rounded"
      height={height}
      sx={{ borderRadius: 3, bgcolor: '#F3F4F6' }}
    />
  )
}

export default function DashboardPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { ssrMatchMedia: () => ({ matches: true }) })
  const [mounted, setMounted] = useState(false)

  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState({
    todayInventoryChanges: [],
    topProducts: [],
    topResellers: [],
    latestAnnouncements: [],
    locationData: []
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/dashboard/analytics')
      if (res.data.success) {
        setAnalyticsData(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (!mounted) return null

  return (
    <Box sx={{ minHeight: '100vh', py: 4, px: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: PRIMARY_COLOR, mb: 4 }}
        >
          Dashboard
        </Typography>

        {/* Main Grid Layout */}
        <Grid container spacing={3}>
          {/* Top Row: Bar Chart (main) + Top Products Pie Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {loading ? (
              <ChartSkeleton height={380} />
            ) : (
              <BarChartCard data={analyticsData.todayInventoryChanges} />
            )}
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            {loading ? (
              <ChartSkeleton height={380} />
            ) : (
              <TopProductsPieChart data={analyticsData.topProducts} />
            )}
          </Grid>

          {/* Bottom Row: 3 tiles */}
          <Grid size={{ xs: 12, md: 4 }}>
            {loading ? (
              <ChartSkeleton height={320} />
            ) : (
              <ResellersPieChart data={analyticsData.topResellers} />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            {loading ? (
              <ChartSkeleton height={320} />
            ) : (
              <LatestAnnouncements data={analyticsData.latestAnnouncements} />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            {loading ? (
              <ChartSkeleton height={320} />
            ) : (
              <LocationLineChart data={analyticsData.locationData} />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
