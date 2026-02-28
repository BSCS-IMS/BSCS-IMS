'use client'

import { Box, Typography } from '@mui/material'
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
    label: item.productName?.substring(0, 18) || 'Unknown',
    color: COLORS[index % COLORS.length]
  }))

  return (
    <Box>
      <Typography variant="body2" fontWeight={500} sx={{ color: PRIMARY_COLOR, mb: 1 }}>
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
          <Typography variant="body2">No product data available</Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <PieChart
            series={[
              {
                data: pieData,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 25, additionalRadius: -8, color: 'gray' },
                innerRadius: 35,
                outerRadius: 85,
                paddingAngle: 2,
                cornerRadius: 4
              }
            ]}
            slotProps={{
              legend: {
                direction: 'column',
                position: { vertical: 'middle', horizontal: 'right' },
                padding: 0,
                itemMarkWidth: 8,
                itemMarkHeight: 8,
                markGap: 4,
                itemGap: 6,
                labelStyle: {
                  fontSize: 10,
                  fill: '#6B7280'
                }
              }
            }}
            width={320}
            height={200}
          />
        </Box>
      )}
    </Box>
  )
}
