'use client'

import Link from 'next/link'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" fontWeight={500} sx={{ color: PRIMARY_COLOR }}>
          Resellers by Products
        </Typography>
        <Link href="/resellers" passHref>
          <ArrowOutwardIcon sx={{ fontSize: 16, color: '#9CA3AF', '&:hover': { color: PRIMARY_COLOR } }} />
        </Link>
      </Box>

      {!hasData ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 230,
            color: '#9CA3AF'
          }}
        >
          <Typography variant="body2">No reseller data available</Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: 230, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                itemMarkWidth: 10,
                itemMarkHeight: 10,
                markGap: 5,
                itemGap: 12,
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
