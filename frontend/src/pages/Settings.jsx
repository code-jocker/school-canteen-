import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Shield, Info } from 'lucide-react';

const Settings = () => {
  const { user, isSuperAdmin, isDeanAdmin, isCanteen } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-rwanda-dark mb-6">Settings</h1>

      {/* Profile Section */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-rwanda-blue" />
          <h2 className="text-xl font-semibold">Profile Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
            <p className="text-lg font-medium">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <p className="text-lg font-medium">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
            <p className="text-lg font-medium">
              {isSuperAdmin() ? 'Super Admin' :
               isDeanAdmin() ? 'Dean + Admin' :
               'Canteen Staff'}
            </p>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Info className="w-6 h-6 text-rwanda-blue" />
          <h2 className="text-xl font-semibold">System Information</h2>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-rwanda-blue">System Name</p>
            <p className="text-lg">Rwanda School Canteen Digital Wallet System</p>
            <p className="text-sm text-gray-500">Kageyo TSS</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-rwanda-blue">Version</p>
            <p className="text-lg">1.0.0</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-rwanda-blue">Official Colors</p>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-rwanda-blue rounded"></div>
                <span className="text-sm">Blue #002B7F</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-rwanda-yellow rounded"></div>
                <span className="text-sm">Yellow #FFD100</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-rwanda-green rounded"></div>
                <span className="text-sm">Green #007A33</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Permissions */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-rwanda-blue" />
          <h2 className="text-xl font-semibold">Role Permissions</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Super Admin</th>
                <th>Dean + Admin</th>
                <th>Canteen Staff</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dashboard</td>
                <td className="text-green-600">✓</td>
                <td className="text-green-600">✓</td>
                <td className="text-green-600">✓</td>
              </tr>
              <tr>
                <td>Students Management</td>
                <td className="text-green-600">✓</td>
                <td className="text-green-600">✓</td>
                <td className="text-red-600">✗</td>
              </tr>
              <tr>
                <td>Deposit</td>
                <td className="text-green-600">✓</td>
                <td className="text-green-600">✓</td>
                <td className="text-red-600">✗</td>
              </tr>
              <tr>
                <td>Purchase</td>
                <td className="text-green-600">✓</td>
                <td className="text-red-600">✗</td>
                <td className="text-green-600">✓</td>
              </tr>
              <tr>
                <td>Withdrawals</td>
                <td className="text-green-600">✓</td>
                <td className="text-green-600">✓</td>
                <td className="text-red-600">✗</td>
              </tr>
              <tr>
                <td>Transactions</td>
                <td className="text-green-600">✓</td>
                <td className="text-green-600">✓</td>
                <td className="text-green-600">✓ (Own)</td>
              </tr>
              <tr>
                <td>Reports</td>
                <td className="text-green-600">✓</td>
                <td className="text-green-600">✓</td>
                <td className="text-green-600">✓ (Own)</td>
              </tr>
              <tr>
                <td>User Management</td>
                <td className="text-green-600">✓</td>
                <td className="text-green-600">✓</td>
                <td className="text-red-600">✗</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Settings;
