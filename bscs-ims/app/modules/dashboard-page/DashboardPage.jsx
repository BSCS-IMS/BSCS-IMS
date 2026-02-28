'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Typography, Skeleton } from '@mui/material'

import BarChartCard from './BarChartCard'
import TopProductsPieChart from './TopProductsPieChart'
import ResellersPieChart from './ResellersPieChart'
import LatestAnnouncements from './LatestAnnouncements'
import LocationLineChart from './LocationLineChart'

const PRIMARY_COLOR = '#1F384C'
const GRID_LINE_COLOR = '#E5E7EB'

function ChartSkeleton({ height = 280 }) {
  return (
    <Skeleton
      variant="rectangular"
      height={height}
      sx={{ bgcolor: '#F9FAFB' }}
    />
  )
}

export default function DashboardPage() {
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
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        {/* Header */}
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: PRIMARY_COLOR, mb: 5 }}
        >
          Dashboard
        </Typography>

        {/* Grid Layout with subtle inner separators only */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
          {/* Top Row: Bar Chart (main) */}
          <Box sx={{ p: 2, borderRight: { lg: `1px solid ${GRID_LINE_COLOR}` } }}>
            {loading ? (
              <ChartSkeleton height={280} />
            ) : (
              <BarChartCard data={analyticsData.todayInventoryChanges} />
            )}
          </Box>

          {/* Top Row: Top Products Pie Chart */}
          <Box sx={{ p: 2 }}>
            {loading ? (
              <ChartSkeleton height={280} />
            ) : (
              <TopProductsPieChart data={analyticsData.topProducts} />
            )}
          </Box>
        </Box>

        {/* Horizontal separator between rows */}
        <Box sx={{ borderTop: `1px solid ${GRID_LINE_COLOR}` }} />

        {/* Bottom Row: 3 tiles */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
          <Box sx={{ p: 2, borderRight: { md: `1px solid ${GRID_LINE_COLOR}` } }}>
            {loading ? (
              <ChartSkeleton height={220} />
            ) : (
              <ResellersPieChart data={analyticsData.topResellers} />
            )}
          </Box>

          <Box sx={{ p: 2, borderRight: { md: `1px solid ${GRID_LINE_COLOR}` } }}>
            {loading ? (
              <ChartSkeleton height={220} />
            ) : (
              <LatestAnnouncements data={analyticsData.latestAnnouncements} />
            )}
          </Box>

          <Box sx={{ p: 2 }}>
            {loading ? (
              <ChartSkeleton height={220} />
            ) : (
              <LocationLineChart data={analyticsData.locationData} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
