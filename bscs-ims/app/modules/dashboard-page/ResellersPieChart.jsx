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
    <Box sx={{ height: '100%' }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ color: PRIMARY_COLOR, mb: 0.5 }}>
        Resellers by Products
      </Typography>
      <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 1 }}>
        Top resellers with most assigned products
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
          <Typography variant="body2">No reseller data available</Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: 170, display: 'flex', justifyContent: 'center' }}>
          <PieChart
            series={[
              {
                data: pieData,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 15, additionalRadius: -5, color: 'gray' },
                innerRadius: 20,
                outerRadius: 55,
                paddingAngle: 2,
                cornerRadius: 3,
                cx: 60
              }
            ]}
            slotProps={{
              legend: {
                direction: 'column',
                position: { vertical: 'middle', horizontal: 'right' },
                padding: 0,
                itemMarkWidth: 6,
                itemMarkHeight: 6,
                markGap: 3,
                itemGap: 4,
                labelStyle: {
                  fontSize: 9,
                  fill: '#6B7280'
                }
              }
            }}
            width={240}
            height={170}
          />
        </Box>
      )}
    </Box>
  )
}
