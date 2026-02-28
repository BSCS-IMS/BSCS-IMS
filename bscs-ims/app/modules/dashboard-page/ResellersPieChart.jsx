'use client'

import { Box, Typography } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'

const PRIMARY_COLOR = '#1F384C'

// Color palette with variations of primary color
const COLORS = [
  '#1F384C',
  '#2E4A5E',
  '#3E5D72',
  '#507186',
  '#6A8A9E'
]

export default function ResellersPieChart({ data = [] }) {
  const hasData = data.length > 0

  const pieData = data.map((item, index) => ({
    id: index,
    value: item.productCount || 0,
    label: item.resellerName?.substring(0, 15) || 'Unknown',
    color: COLORS[index % COLORS.length]
  }))

  return (
    <Box>
      <Typography variant="body2" fontWeight={500} sx={{ color: PRIMARY_COLOR, mb: 1 }}>
        Resellers by Products
      </Typography>

      {!hasData ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            color: '#9CA3AF'
          }}
        >
          <Typography variant="body2">No reseller data available</Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <PieChart
            series={[
              {
                data: pieData,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 20, additionalRadius: -6, color: 'gray' },
                innerRadius: 28,
                outerRadius: 70,
                paddingAngle: 2,
                cornerRadius: 3
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
                itemGap: 5,
                labelStyle: {
                  fontSize: 9,
                  fill: '#6B7280'
                }
              }
            }}
            width={280}
            height={170}
          />
        </Box>
      )}
    </Box>
  )
}
