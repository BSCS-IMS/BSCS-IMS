'use client'

import { Box, Typography, Paper } from '@mui/material'
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
    label: item.resellerName?.substring(0, 18) || 'Unknown',
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
      <Typography variant="h6" fontWeight={600} sx={{ color: PRIMARY_COLOR, mb: 1 }}>
        Resellers by Products
      </Typography>
      <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2 }}>
        Top resellers with most assigned products
      </Typography>

      {!hasData ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 180,
            color: '#9CA3AF'
          }}
        >
          <Typography>No reseller data available</Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: 180, display: 'flex', justifyContent: 'center' }}>
          <PieChart
            series={[
              {
                data: pieData,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 20, additionalRadius: -8, color: 'gray' },
                innerRadius: 30,
                outerRadius: 70,
                paddingAngle: 2,
                cornerRadius: 3,
                cx: 70
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
            width={300}
            height={180}
          />
        </Box>
      )}
    </Paper>
  )
}
