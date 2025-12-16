/* eslint-disable react-hooks/purity */
// Composant lourd 3 - Table
export default function HeavyTable() {
  const users = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['Admin', 'User', 'Manager'][Math.floor(Math.random() * 3)],
    status: Math.random() > 0.5 ? 'Active' : 'Inactive'
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Table Utilisateurs (Composant Lourd)</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Nom</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Rôle</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.slice(0, 15).map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">#{user.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{user.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                    user.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Affichage de 15 sur {users.length} utilisateurs
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded text-sm">Précédent</button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Suivant</button>
        </div>
      </div>

      <div className="mt-4 bg-green-50 rounded p-4 text-sm text-green-800">
        💚 Code splitting = Bundle size réduit !
      </div>
    </div>
  );
}