import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../services/api';
import {
  Users,
  Wallet,
  ArrowDownLeft,
  ShoppingCart,
  TrendingUp,
  PiggyBank,
  Banknote
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user, isCanteen } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await transactionAPI.getDashboardStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const barChartData = {
    labels: stats?.last7Days?.map(d => d.date.slice(5)) || [],
    datasets: [
      {
        label: 'Daily Spending (RWF)',
        data: stats?.last7Days?.map(d => d.amount) || [],
        backgroundColor: '#002B7F',
        borderColor: '#002B7F',
        borderWidth: 1
      }
    ]
  };

  const pieChartData = {
    labels: ['Canteen', 'Short Saving', 'Long Saving'],
    datasets: [
      {
        data: [
          stats?.totalCanteen || 0,
          stats?.totalShortSaving || 0,
          stats?.totalLongSaving || 0
        ],
        backgroundColor: ['#002B7F', '#FFD100', '#007A33'],
        borderColor: ['#002B7F', '#FFD100', '#007A33'],
        borderWidth: 1
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Last 7 Days Spending'
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: {
            size: 11
          }
        }
      },
      title: {
        display: true,
        text: 'Money Distribution'
      }
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-rwanda-dark mb-4 md:mb-6">
        Dashboard - Welcome, {user?.name}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="card">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-rwanda-blue rounded-lg">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total Students</p>
              <p className="text-xl md:text-2xl font-bold text-rwanda-dark">
                {stats?.totalStudents || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-rwanda-green rounded-lg">
              <Wallet className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Canteen Money</p>
              <p className="text-xl md:text-2xl font-bold text-rwanda-dark">
                {stats?.totalCanteen?.toLocaleString() || 0} RWF
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-rwanda-yellow rounded-lg">
              <ArrowDownLeft className="w-5 h-5 md:w-6 md:h-6 text-rwanda-dark" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Today's Deposits</p>
              <p className="text-xl md:text-2xl font-bold text-rwanda-dark">
                {stats?.todayDeposits?.toLocaleString() || 0} RWF
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-red-600 rounded-lg">
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Today's Purchases</p>
              <p className="text-xl md:text-2xl font-bold text-rwanda-dark">
                {stats?.todayPurchases?.toLocaleString() || 0} RWF
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Canteen Staff - Simplified Dashboard */}
      {isCanteen() ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Purchases</span>
                <span className="font-bold text-rwanda-blue">
                  {stats?.todayPurchases?.toLocaleString() || 0} RWF
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transactions</span>
                <span className="font-bold text-rwanda-blue">
                  {stats?.todayPurchasesCount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Admin & Dean - Full Dashboard */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Bar Chart */}
          <div className="card">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Daily Spending</h3>
            <div className="h-48 md:h-64">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="card">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Money Distribution</h3>
            <div className="h-48 md:h-64">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>

          {/* Savings Summary */}
          <div className="card">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Savings Summary</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-yellow-50 rounded-lg gap-2">
                <div className="flex items-center gap-3">
                  <PiggyBank className="w-6 md:w-8 h-6 md:h-8 text-rwanda-yellow" />
                  <div>
                    <p className="font-medium text-sm md:text-base">Short Term Savings</p>
                    <p className="text-xs md:text-sm text-gray-500">Available for withdrawal</p>
                  </div>
                </div>
                <span className="text-lg md:text-xl font-bold text-rwanda-dark">
                  {stats?.totalShortSaving?.toLocaleString() || 0} RWF
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-green-50 rounded-lg gap-2">
                <div className="flex items-center gap-3">
                  <Banknote className="w-6 md:w-8 h-6 md:h-8 text-rwanda-green" />
                  <div>
                    <p className="font-medium text-sm md:text-base">Long Term Savings</p>
                    <p className="text-xs md:text-sm text-gray-500">Locked savings</p>
                  </div>
                </div>
                <span className="text-lg md:text-xl font-bold text-rwanda-dark">
                  {stats?.totalLongSaving?.toLocaleString() || 0} RWF
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Today's Deposits</span>
                <span className="font-bold text-rwanda-green">
                  {stats?.todayDeposits?.toLocaleString() || 0} RWF
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Deposit Count</span>
                <span className="font-bold text-rwanda-blue">
                  {stats?.todayDepositsCount || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Purchase Count</span>
                <span className="font-bold text-rwanda-blue">
                  {stats?.todayPurchasesCount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
