import { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FileText, Filter } from 'lucide-react';

const Transactions = () => {
  const { isCanteen } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getTransactions(filters);
      setTransactions(response.data.transactions);
      setPagination({
        total: response.data.total,
        pages: response.data.pages,
        currentPage: response.data.currentPage
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'deposit':
        return 'badge-success';
      case 'purchase':
        return 'badge-danger';
      case 'withdrawal':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'canteen':
        return 'Canteen';
      case 'short-saving':
        return 'Short Saving';
      case 'long-saving':
        return 'Long Saving';
      default:
        return category;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-rwanda-dark mb-4 md:mb-6">Transactions</h1>

      {/* Filters */}
      <div className="card mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
          <Filter size={20} className="text-rwanda-blue" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="select"
            >
              <option value="">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="purchase">Purchase</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="input"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ type: '', startDate: '', endDate: '', page: 1 })}
              className="btn bg-gray-300 text-gray-700"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rwanda-blue"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No transactions found</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Balance After</th>
                  <th>Handled By</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td className="text-sm">{formatDate(tx.date)}</td>
                    <td className="font-medium">{tx.studentName}</td>
                    <td>{tx.studentClass}</td>
                    <td>
                      <span className={`badge ${getTypeBadge(tx.type)}`}>
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </span>
                    </td>
                    <td>{getCategoryLabel(tx.category)}</td>
                    <td className={`font-medium ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString()} RWF
                    </td>
                    <td>{tx.balanceAfter.toLocaleString()} RWF</td>
                    <td className="text-sm">{tx.handledByName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 p-4 border-t">
                <button
                  onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="btn bg-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4">
                  Page {pagination.currentPage} of {pagination.pages}
                </span>
                <button
                  onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.pages}
                  className="btn bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
