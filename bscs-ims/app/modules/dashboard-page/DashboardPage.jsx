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
    <Box sx={{ height: 'calc(100vh - 120px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* Header */}
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: PRIMARY_COLOR, mb: 1, flexShrink: 0 }}
        >
          Dashboard
        </Typography>

        {/* Grid Layout with subtle inner separators only */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, flex: '1 1 55%', minHeight: 0 }}>
          {/* Top Row: Bar Chart (main) */}
          <Box sx={{ p: 1.5, borderRight: { lg: `1px solid ${GRID_LINE_COLOR}` }, overflow: 'hidden' }}>
            {loading ? (
              <ChartSkeleton height={180} />
            ) : (
              <BarChartCard data={analyticsData.todayInventoryChanges} />
            )}
          </Box>

          {/* Top Row: Top Products Pie Chart */}
          <Box sx={{ p: 1.5, overflow: 'hidden' }}>
            {loading ? (
              <ChartSkeleton height={180} />
            ) : (
              <TopProductsPieChart data={analyticsData.topProducts} />
            )}
          </Box>
        </Box>

        {/* Horizontal separator between rows */}
        <Box sx={{ borderTop: `1px solid ${GRID_LINE_COLOR}`, flexShrink: 0 }} />

        {/* Bottom Row: 3 tiles */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, flex: '1 1 45%', minHeight: 0 }}>
          <Box sx={{ p: 1.5, borderRight: { md: `1px solid ${GRID_LINE_COLOR}` }, overflow: 'hidden' }}>
            {loading ? (
              <ChartSkeleton height={150} />
            ) : (
              <ResellersPieChart data={analyticsData.topResellers} />
            )}
          </Box>

          <Box sx={{ p: 1.5, borderRight: { md: `1px solid ${GRID_LINE_COLOR}` }, overflow: 'hidden' }}>
            {loading ? (
              <ChartSkeleton height={150} />
            ) : (
              <LatestAnnouncements data={analyticsData.latestAnnouncements} />
            )}
          </Box>

          <Box sx={{ p: 1.5, overflow: 'hidden' }}>
            {loading ? (
              <ChartSkeleton height={150} />
            ) : (
              <LocationLineChart data={analyticsData.locationData} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
