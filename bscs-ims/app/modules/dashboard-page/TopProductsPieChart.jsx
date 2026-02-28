'use client'

import { Box, Typography, Paper } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'

const PRIMARY_COLOR = '#1F384C'

// Color palette based on primary color
const COLORS = [
  '#1F384C',
  '#2D5A7B',
  '#3D7CA8',
  '#5A9BC9',
  '#8FBDDA'
]

export default function TopProductsPieChart({ data = [] }) {
  const hasData = data.length > 0

  const pieData = data.map((item, index) => ({
    id: index,
    value: item.quantity || 0,
    label: item.productName?.substring(0, 20) || 'Unknown',
    color: COLORS[index % COLORS.length]
  }))

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
      <Typography variant="h6" fontWeight={600} sx={{ color: PRIMARY_COLOR, mb: 2 }}>
        Top 5 Products by Quantity
      </Typography>

      {!hasData ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 250,
            color: '#9CA3AF'
          }}
        >
          <Typography>No product data available</Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center' }}>
          <PieChart
            series={[
              {
                data: pieData,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
                innerRadius: 40,
                outerRadius: 90,
                paddingAngle: 2,
                cornerRadius: 4,
                cx: 100
              }
            ]}
            slotProps={{
              legend: {
                direction: 'column',
                position: { vertical: 'middle', horizontal: 'right' },
                padding: 0,
                itemMarkWidth: 10,
                itemMarkHeight: 10,
                markGap: 5,
                itemGap: 8,
                labelStyle: {
                  fontSize: 11,
                  fill: '#6B7280'
                }
              }
            }}
            width={350}
            height={250}
          />
        </Box>
      )}
    </Paper>
  )
}
