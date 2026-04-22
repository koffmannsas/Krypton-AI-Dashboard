import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "./Card";

export default function RevenueChart({ data }: { data: any[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4 text-white">
        Revenue Overview
      </h3>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
            <XAxis dataKey="name" stroke="#A1A1AA" />
            <YAxis stroke="#A1A1AA" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111111",
                border: "1px solid #1F1F1F",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#FF2D2D"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}