'use client'

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042']

export function SalesFunnel({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          width={100}
        />
        <Tooltip
          cursor={{ fill: 'transparent' }}
          contentStyle={{ background: '#333', border: 'none', borderRadius: '8px', color: '#fff' }}
          itemStyle={{ color: '#fff' }}
        />
        <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
