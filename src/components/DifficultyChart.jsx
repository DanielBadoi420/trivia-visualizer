import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

export function DifficultyChart({ data }) {
  const counts = data.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));
  const colors = ["#f2f235ff", "#48f25cff", "#f02525ff"];

  return (
    <div>
      <h2>Questions by Difficulty</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
