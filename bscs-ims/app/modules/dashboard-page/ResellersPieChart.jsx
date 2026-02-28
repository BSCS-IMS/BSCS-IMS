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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body2" fontWeight={600} sx={{ color: PRIMARY_COLOR, flexShrink: 0 }}>
        Resellers by Products
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
          <Typography variant="body2">No reseller data available</Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
          <PieChart
            series={[
              {
                data: pieData,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 12, additionalRadius: -4, color: 'gray' },
                innerRadius: 18,
                outerRadius: 50,
                paddingAngle: 2,
                cornerRadius: 2,
                cx: 55
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
                itemGap: 3,
                labelStyle: {
                  fontSize: 8,
                  fill: '#6B7280'
                }
              }
            }}
            width={220}
            height={140}
          />
        </Box>
      )}
    </Box>
  )
}
