import { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Download, Calendar } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { isCanteen } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getReports(filters);
      setReport(response.data.report);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!report?.transactions) return;

    const headers = ['Date', 'Student', 'Class', 'Type', 'Category', 'Amount', 'Handled By'];
    const rows = report.transactions.map(tx => [
      new Date(tx.date).toLocaleString(),
      tx.studentName,
      tx.studentClass,
      tx.type,
      tx.category,
      tx.amount,
      tx.handledByName
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${filters.startDate || 'all'}_${filters.endDate || 'all'}.csv`;
    a.click();
  };

  const chartData = {
    labels: ['Deposits', 'Purchases', 'Withdrawals'],
    datasets: [
      {
        label: 'Amount (RWF)',
        data: [
          report?.summary?.totalDeposits || 0,
          report?.summary?.totalPurchases || 0,
          report?.summary?.totalWithdrawals || 0
        ],
        backgroundColor: ['#007A33', '#002B7F', '#FFD100'],
        borderColor: ['#007A33', '#002B7F', '#FFD100'],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Transaction Summary'
      }
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-rwanda-dark">Reports</h1>
        <button
          onClick={exportCSV}
          disabled={loading || !report?.transactions?.length}
          className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
        >
          <Download size={20} />
          <span className="sm:inline">Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
          <Calendar size={20} className="text-rwanda-blue" />
          <h2 className="text-lg font-semibold">Date Range</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="input"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ startDate: '', endDate: '' })}
              className="btn bg-gray-300 text-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rwanda-blue"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="card">
              <p className="text-sm text-gray-500">Total Deposits</p>
              <p className="text-2xl font-bold text-rwanda-green">
                {report?.summary?.totalDeposits?.toLocaleString() || 0} RWF
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Total Purchases</p>
              <p className="text-2xl font-bold text-rwanda-blue">
                {report?.summary?.totalPurchases?.toLocaleString() || 0} RWF
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Total Withdrawals</p>
              <p className="text-2xl font-bold text-rwanda-yellow-700">
                {report?.summary?.totalWithdrawals?.toLocaleString() || 0} RWF
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Net Amount</p>
              <p className={`text-2xl font-bold ${(report?.summary?.netAmount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {report?.summary?.netAmount?.toLocaleString() || 0} RWF
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={20} className="text-rwanda-blue" />
              <h2 className="text-lg font-semibold">Transaction Overview</h2>
            </div>
            <div className="h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Transactions Table */}
          <div className="card overflow-hidden">
            <h2 className="text-lg font-semibold mb-4">
              Transactions ({report?.transactions?.length || 0})
            </h2>
            {report?.transactions?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No transactions found for the selected period
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Student</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Handled By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report?.transactions?.slice(0, 50).map((tx) => (
                      <tr key={tx._id}>
                        <td className="text-sm">
                          {new Date(tx.date).toLocaleString()}
                        </td>
                        <td className="font-medium">{tx.studentName}</td>
                        <td>
                          <span className={`badge ${
                            tx.type === 'deposit' ? 'badge-success' :
                            tx.type === 'purchase' ? 'badge-danger' :
                            'badge-warning'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td>{tx.category}</td>
                        <td className={`font-medium ${
                          tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString()} RWF
                        </td>
                        <td className="text-sm">{tx.handledByName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
