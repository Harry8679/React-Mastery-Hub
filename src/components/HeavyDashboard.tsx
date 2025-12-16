// Composant lourd 1 - Dashboard
export default function HeavyDashboard() {
  // Simulation d'un composant lourd
  const data = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    // eslint-disable-next-line react-hooks/purity
    value: Math.random() * 1000
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Dashboard (Composant Lourd)</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">1,234</div>
          <div className="text-sm text-gray-600">Utilisateurs</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">$56.7k</div>
          <div className="text-sm text-gray-600">Revenus</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">89%</div>
          <div className="text-sm text-gray-600">Satisfaction</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">+23%</div>
          <div className="text-sm text-gray-600">Croissance</div>
        </div>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {data.slice(0, 20).map(item => (
          <div key={item.id} className="bg-gray-50 rounded p-3 flex justify-between">
            <span className="font-medium">{item.name}</span>
            <span className="text-gray-600">${item.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-blue-50 rounded p-4 text-sm text-blue-800">
        ✨ Ce composant a été chargé dynamiquement avec React.lazy !
      </div>
    </div>
  );
}