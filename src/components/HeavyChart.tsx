// Composant lourd 2 - Chart
export default function HeavyChart() {
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    // eslint-disable-next-line react-hooks/purity
    value: Math.floor(Math.random() * 100)
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Graphiques (Composant Lourd)</h2>
      
      {/* Simple bar chart */}
      <div className="space-y-2 mb-6">
        {chartData.map((item) => (
          <div key={item.day} className="flex items-center gap-3">
            <div className="w-12 text-sm text-gray-600 text-right">J{item.day}</div>
            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
              <div
                className="bg-linear-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${item.value}%` }}
              >
                <span className="text-white text-xs font-bold">{item.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="text-blue-600 font-bold mb-1">Moyenne</div>
          <div className="text-2xl font-bold text-blue-800">
            {Math.floor(chartData.reduce((acc, item) => acc + item.value, 0) / chartData.length)}
          </div>
        </div>
        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="text-green-600 font-bold mb-1">Maximum</div>
          <div className="text-2xl font-bold text-green-800">
            {Math.max(...chartData.map(d => d.value))}
          </div>
        </div>
        <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="text-purple-600 font-bold mb-1">Minimum</div>
          <div className="text-2xl font-bold text-purple-800">
            {Math.min(...chartData.map(d => d.value))}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-purple-50 rounded p-4 text-sm text-purple-800">
        🚀 Chargement différé = Performance optimale !
      </div>
    </div>
  );
}