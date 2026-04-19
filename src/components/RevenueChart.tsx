'use client'

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function RevenueChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rp${value.toLocaleString('id-ID')}`}
        />
        <Tooltip
          contentStyle={{ background: '#333', border: 'none', borderRadius: '8px', color: '#fff' }}
          itemStyle={{ color: '#fff' }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
