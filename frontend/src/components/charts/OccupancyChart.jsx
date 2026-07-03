import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const OccupancyChart = ({ data = [] }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="block" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="occupied" name="Occupied Slots" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="capacity" name="Total Capacity" fill="#c7d2fe" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};