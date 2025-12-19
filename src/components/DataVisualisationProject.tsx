import { useState } from 'react';
import { ChevronLeft, Code2, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// ==================== TYPES ====================
type ChartType = 'line' | 'bar' | 'pie' | 'area';

// ==================== MOCK DATA ====================
const salesData = [
  { month: 'Jan', sales: 4000, revenue: 2400, profit: 1600 },
  { month: 'Fév', sales: 3000, revenue: 1398, profit: 1200 },
  { month: 'Mar', sales: 2000, revenue: 9800, profit: 2500 },
  { month: 'Avr', sales: 2780, revenue: 3908, profit: 2100 },
  { month: 'Mai', sales: 1890, revenue: 4800, profit: 2900 },
  { month: 'Juin', sales: 2390, revenue: 3800, profit: 2400 },
  { month: 'Juil', sales: 3490, revenue: 4300, profit: 3200 },
  { month: 'Août', sales: 4200, revenue: 5100, profit: 3800 },
  { month: 'Sep', sales: 3800, revenue: 4700, profit: 3400 },
  { month: 'Oct', sales: 4500, revenue: 5400, profit: 4000 },
  { month: 'Nov', sales: 5200, revenue: 6100, profit: 4700 },
  { month: 'Déc', sales: 6000, revenue: 7200, profit: 5500 },
];

const categoryData = [
  { name: 'Électronique', value: 400, color: '#0088FE' },
  { name: 'Vêtements', value: 300, color: '#00C49F' },
  { name: 'Alimentation', value: 300, color: '#FFBB28' },
  { name: 'Livres', value: 200, color: '#FF8042' },
  { name: 'Sports', value: 150, color: '#8884D8' },
];

const trafficData = [
  { date: '01/12', visitors: 1200, pageviews: 3400, bounceRate: 45 },
  { date: '02/12', visitors: 1400, pageviews: 3800, bounceRate: 42 },
  { date: '03/12', visitors: 1100, pageviews: 3100, bounceRate: 48 },
  { date: '04/12', visitors: 1600, pageviews: 4200, bounceRate: 40 },
  { date: '05/12', visitors: 1800, pageviews: 4800, bounceRate: 38 },
  { date: '06/12', visitors: 2000, pageviews: 5200, bounceRate: 35 },
  { date: '07/12', visitors: 2200, pageviews: 5800, bounceRate: 33 },
];

const performanceData = [
  { metric: 'Performance', value: 85 },
  { metric: 'Accessibilité', value: 92 },
  { metric: 'Meilleures pratiques', value: 88 },
  { metric: 'SEO', value: 95 },
];

// ==================== COMPOSANTS ====================

// Stats Cards
interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

function StatsCard({ title, value, change, icon: Icon, color }: StatsCardProps) {
  const isPositive = change >= 0;
  
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-lg">
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
          <TrendingUp size={16} className={isPositive ? '' : 'rotate-180'} />
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ==================== COMPOSANT PRINCIPAL ====================
export default function DataVisualizationProject({ onBack }: ProjectComponentProps) {
  const [selectedChart, setSelectedChart] = useState<ChartType>('line');

  const charts = [
    { type: 'line' as ChartType, label: 'Line Chart', icon: LineChartIcon },
    { type: 'bar' as ChartType, label: 'Bar Chart', icon: BarChart3 },
    { type: 'area' as ChartType, label: 'Area Chart', icon: TrendingUp },
    { type: 'pie' as ChartType, label: 'Pie Chart', icon: PieChartIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Data Visualization</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Charts", "Recharts", "Data Analysis"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Ventes Totales"
              value="42.5K"
              change={12.5}
              icon={BarChart3}
              color="from-blue-500 to-blue-600"
            />
            <StatsCard
              title="Revenus"
              value="128K€"
              change={8.2}
              icon={TrendingUp}
              color="from-green-500 to-green-600"
            />
            <StatsCard
              title="Visiteurs"
              value="18.2K"
              change={-3.4}
              icon={LineChartIcon}
              color="from-purple-500 to-purple-600"
            />
            <StatsCard
              title="Taux de conversion"
              value="3.2%"
              change={5.1}
              icon={PieChartIcon}
              color="from-orange-500 to-orange-600"
            />
          </div>

          {/* Chart Type Selector */}
          <div className="mb-8 flex flex-wrap gap-2">
            {charts.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setSelectedChart(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedChart === type
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          {/* Main Chart */}
          <div className="mb-8 bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-xl">
              {selectedChart === 'line' && 'Ventes Mensuelles - Line Chart'}
              {selectedChart === 'bar' && 'Performance Mensuelle - Bar Chart'}
              {selectedChart === 'area' && 'Revenus Cumulés - Area Chart'}
              {selectedChart === 'pie' && 'Ventes par Catégorie - Pie Chart'}
            </h3>

            <ResponsiveContainer width="100%" height={400}>
              {selectedChart === 'line' && (
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              )}

              {selectedChart === 'bar' && (
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                  <Bar dataKey="profit" fill="#ffc658" />
                </BarChart>
              )}

              {selectedChart === 'area' && (
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="sales" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="profit" stackId="1" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
              )}

              {selectedChart === 'pie' && (
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Secondary Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Traffic Chart */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">Trafic Hebdomadaire</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="visitors" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="pageviews" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Chart */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">Score de Performance</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={performanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="metric" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {performanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.value >= 90 ? '#10b981' : entry.value >= 70 ? '#f59e0b' : '#ef4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-blue-500" />
              Concepts Data Visualization :
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>Recharts</strong>: Bibliothèque de charts React composable
              </li>
              <li>
                • <strong>Responsive Charts</strong>: S'adaptent à la taille du container
              </li>
              <li>
                • <strong>Custom Tooltip</strong>: Info-bulles personnalisées
              </li>
              <li>
                • <strong>Multiple Chart Types</strong>: Line, Bar, Area, Pie
              </li>
              <li>
                • <strong>Data Formatting</strong>: Légendes, axes, grilles
              </li>
              <li>
                • <strong>Interactive</strong>: Hover effects et animations
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                &lt;LineChart data={'{'}salesData{'}'}&gt;
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                &lt;XAxis dataKey="month" /&gt;
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                &lt;YAxis /&gt;
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                &lt;Line dataKey="sales" stroke="#8884d8" /&gt;
              </p>
              <p className="text-sm text-gray-600 font-mono">
                &lt;/LineChart&gt;
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">💡 Types de Charts:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li><strong>Line Chart</strong>: Tendances temporelles</li>
                <li><strong>Bar Chart</strong>: Comparaisons entre catégories</li>
                <li><strong>Area Chart</strong>: Volumes cumulés</li>
                <li><strong>Pie Chart</strong>: Proportions et répartitions</li>
                <li><strong>Scatter Plot</strong>: Corrélations (non implémenté)</li>
                <li><strong>Radar Chart</strong>: Comparaisons multi-axes (non implémenté)</li>
              </ul>
            </div>

            <div className="mt-4 bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
              <p className="font-bold mb-2">🎯 Use Cases:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Dashboards analytics (Google Analytics)</li>
                <li>Rapports financiers (revenus, dépenses)</li>
                <li>Suivi de KPI (objectifs, performances)</li>
                <li>E-commerce (ventes par période/catégorie)</li>
                <li>Monitoring (serveurs, applications)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}