import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const dataTrends = [
  { month: 'Jan', subscriptions: 120, revenue: 2400 },
  { month: 'Feb', subscriptions: 98, revenue: 2210 },
  { month: 'Mar', subscriptions: 86, revenue: 2290 },
  { month: 'Apr', subscriptions: 99, revenue: 2000 },
  { month: 'May', subscriptions: 130, revenue: 2780 },
];

const revenueData = [
  { name: 'Netflix', revenue: 4000 },
  { name: 'Spotify', revenue: 3000 },
  { name: 'Disney+', revenue: 2000 },
  { name: 'Amazon Prime', revenue: 2780 },
];

const pieData = [
  { name: 'Active', value: 65 },
  { name: 'Expired', value: 25 },
  { name: 'Pending', value: 10 },
];

const COLORS = ['#34d399', '#f87171', '#facc15'];

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-glass-dark border border-neon-blue/20 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Subscriptions Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line type="monotone" dataKey="subscriptions" stroke="#6366f1" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-glass-dark border border-neon-blue/20 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Revenue by Platform</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-glass-dark border border-neon-blue/20 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Subscription Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
