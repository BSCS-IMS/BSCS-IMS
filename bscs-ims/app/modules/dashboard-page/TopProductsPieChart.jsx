'use client'

import Link from 'next/link'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" fontWeight={500} sx={{ color: PRIMARY_COLOR }}>
          Top 5 Products by Quantity
        </Typography>
        <Link href="/products" passHref>
          <ArrowOutwardIcon sx={{ fontSize: 16, color: '#9CA3AF', '&:hover': { color: PRIMARY_COLOR } }} />
        </Link>
      </Box>

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
          <Typography variant="body2">No product data available</Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: 280, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <PieChart
            series={[
              {
                data: pieData,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
                innerRadius: 45,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 4
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
            width={380}
            height={250}
          />
        </Box>
      )}
    </Box>
  )
}
