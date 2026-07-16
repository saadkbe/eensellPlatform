"use client";

import { motion } from "framer-motion";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { format, parseISO } from "date-fns";

interface SnapshotData {
  date: string;
  revenue: number;
  paidStudents: number;
}

export function TrackingCharts({ data }: { data: SnapshotData[] }) {
  // Format data for recharts
  const chartData = data.map(d => ({
    ...d,
    displayDate: format(parseISO(d.date), "MMM d"),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm"
      >
        <div className="mb-6">
          <h3 className="text-lg font-black text-foreground">Revenue per Day</h3>
          <p className="text-sm text-muted-foreground font-medium">Daily income during this campaign</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
              <XAxis 
                dataKey="displayDate" 
                stroke="currentColor" 
                className="text-xs opacity-50"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="currentColor" 
                className="text-xs opacity-50"
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'hsl(var(--card))' }}
                formatter={(value: any) => [`${Number(value).toLocaleString()} MAD`, "Revenue"]}
                labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))', marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--card))" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Students Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm"
      >
        <div className="mb-6">
          <h3 className="text-lg font-black text-foreground">Students Enrolled per Day</h3>
          <p className="text-sm text-muted-foreground font-medium">Daily conversion performance</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
              <XAxis 
                dataKey="displayDate" 
                stroke="currentColor" 
                className="text-xs opacity-50"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="currentColor" 
                className="text-xs opacity-50"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'currentColor', opacity: 0.05 }}
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'hsl(var(--card))' }}
                formatter={(value: any) => [Number(value), "Students"]}
                labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))', marginBottom: '4px' }}
              />
              <Bar 
                dataKey="paidStudents" 
                fill="#FF6B4A" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
}
