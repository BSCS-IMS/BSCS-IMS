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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body2" fontWeight={600} sx={{ color: PRIMARY_COLOR, flexShrink: 0 }}>
        Inventory by Location
      </Typography>

      {!hasData ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            color: '#9CA3AF'
          }}
        >
          <Typography variant="body2">No location data available</Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', flex: 1, minHeight: 0 }}>
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
