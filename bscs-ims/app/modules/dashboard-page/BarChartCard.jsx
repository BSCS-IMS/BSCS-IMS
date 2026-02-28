'use client'

import { Box, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'

const PRIMARY_COLOR = '#1F384C'
const ADDED_COLOR = '#4CAF50'
const SUBTRACTED_COLOR = '#EF5350'

export default function BarChartCard({ data = [] }) {
  const hasData = data.length > 0

  const productNames = data.map(item => item.productName?.substring(0, 15) || 'Unknown')
  const addedValues = data.map(item => item.added || 0)
  const subtractedValues = data.map(item => item.subtracted || 0)

  return (
    <Box>
      <Typography variant="body2" fontWeight={500} sx={{ color: PRIMARY_COLOR, mb: 1 }}>
        Today&apos;s Inventory Changes
      </Typography>

      {!hasData ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 280,
            color: '#9CA3AF'
          }}
        >
          <Typography variant="body2">No inventory changes today</Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: 280 }}>
          <BarChart
            xAxis={[{
              scaleType: 'band',
              data: productNames,
              tickLabelStyle: {
                fontSize: 10,
                fill: '#6B7280'
              }
            }]}
            yAxis={[{
              tickLabelStyle: {
                fontSize: 10,
                fill: '#6B7280'
              }
            }]}
            series={[
              {
                data: addedValues,
                label: 'Added',
                color: ADDED_COLOR
              },
              {
                data: subtractedValues,
                label: 'Subtracted',
                color: SUBTRACTED_COLOR
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
              }
            }}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'top', horizontal: 'right' },
                padding: 0,
                itemMarkWidth: 8,
                itemMarkHeight: 8,
                markGap: 4,
                itemGap: 12,
                labelStyle: {
                  fontSize: 11,
                  fill: '#6B7280'
                }
              }
            }}
          />
        </Box>
      )}
    </Box>
  )
}
