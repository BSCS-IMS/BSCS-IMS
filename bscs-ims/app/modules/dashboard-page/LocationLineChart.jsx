'use client'

import { Box, Typography } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'

const PRIMARY_COLOR = '#1F384C'
const LINE_COLOR = '#1F384C'
const AREA_COLOR = 'rgba(31, 56, 76, 0.1)'

export default function LocationLineChart({ data = [] }) {
  const hasData = data.length > 0

  const locationNames = data.map(item => item.locationName?.substring(0, 10) || 'Unknown')
  const quantities = data.map(item => item.totalQuantity || 0)

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ color: PRIMARY_COLOR, mb: 0.5 }}>
        Inventory by Location
      </Typography>
      <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 1 }}>
        Total stock quantity per location
      </Typography>

      {!hasData ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 160,
            color: '#9CA3AF'
          }}
        >
          <Typography variant="body2">No location data available</Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: 170 }}>
          <LineChart
            xAxis={[{
              scaleType: 'point',
              data: locationNames,
              tickLabelStyle: {
                fontSize: 9,
                fill: '#6B7280'
              }
            }]}
            yAxis={[{
              tickLabelStyle: {
                fontSize: 9,
                fill: '#6B7280'
              }
            }]}
            series={[
              {
                data: quantities,
                area: true,
                color: LINE_COLOR,
                showMark: true
              }
            ]}
            grid={{ horizontal: true }}
            sx={{
              '.MuiChartsGrid-line': {
                stroke: '#E5E7EB',
                strokeDasharray: '3 3'
              },
              '.MuiChartsAxis-line': {
                stroke: '#E5E7EB'
              },
              '.MuiChartsAxis-tick': {
                stroke: '#E5E7EB'
              },
              '.MuiAreaElement-root': {
                fill: AREA_COLOR
              }
            }}
            slotProps={{
              legend: {
                hidden: true
              }
            }}
          />
        </Box>
      )}
    </Box>
  )
}
