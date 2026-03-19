import { useState, useEffect } from 'react';
import { studentAPI, transactionAPI } from '../services/api';
import { ShoppingCart, Search } from 'lucide-react';

const Purchase = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getStudents();
      setStudents(response.data.students);
      setFilteredStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = students.filter(
      s => s.name.toLowerCase().includes(query) || s.studentId.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  const handleStudentSelect = async (studentId) => {
    setSelectedStudent(studentId);
    if (studentId) {
      const student = students.find(s => s._id === studentId);
      setCurrentStudent(student);
    } else {
      setCurrentStudent(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await transactionAPI.createPurchase({
        studentId: selectedStudent,
        amount: parseFloat(amount),
        notes
      });

      setSuccess('Purchase successful!');
      setAmount('');
      setNotes('');
      setSearchQuery('');
      setSelectedStudent('');
      setCurrentStudent(null);
      
      // Refresh student data
      const response = await studentAPI.getStudents();
      setStudents(response.data.students);
      setFilteredStudents(response.data.students);
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
      // Refresh student data to show current balance
      const response = await studentAPI.getStudents();
      setStudents(response.data.students);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 3000, 5000];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-rwanda-dark mb-4 md:mb-6">Process Purchase</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Purchase Form */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="p-2 md:p-3 bg-red-600 rounded-lg">
              <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 text-white" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold">New Purchase</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Search Student</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="input pl-10"
                  placeholder="Search by name or student ID..."
                />
              </div>
              {searchQuery && filteredStudents.length > 0 && !selectedStudent && (
                <div className="mt-2 border rounded-lg max-h-48 overflow-y-auto">
                  {filteredStudents.slice(0, 5).map((student) => (
                    <button
                      key={student._id}
                      type="button"
                      onClick={() => {
                        handleStudentSelect(student._id);
                        setSearchQuery(student.name);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                    >
                      <span className="font-medium">{student.name}</span>
                      <span className="text-gray-500 ml-2">({student.studentId})</span>
                      <span className="text-rwanda-blue ml-2">{student.canteenBalance.toLocaleString()} RWF</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Quick Select Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="select"
                required
              >
                <option value="">-- Select Student --</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.studentId}) - Balance: {student.canteenBalance.toLocaleString()} RWF
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Amount (RWF)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input text-lg"
                placeholder="Enter amount"
                min="1"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Quick Amounts</label>
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q)}
                    className="px-3 py-1 bg-rwanda-blue text-white rounded hover:bg-blue-800"
                  >
                    {q.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input"
                placeholder="Add notes..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || !selectedStudent || !amount}
              className="w-full btn btn-danger py-3 text-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Process Purchase'}
            </button>
          </form>
        </div>

        {/* Student Info */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Student Information</h2>
          {currentStudent ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-semibold">{currentStudent.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="text-lg font-mono">{currentStudent.studentId}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Class</p>
                <p className="text-lg font-medium">{currentStudent.class}</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-gray-500 mb-1">Current Canteen Balance</p>
                <p className="text-4xl font-bold text-rwanda-blue">
                  {currentStudent.canteenBalance.toLocaleString()}
                </p>
                <p className="text-gray-500">RWF</p>
              </div>
              {currentStudent.canteenBalance < 1000 && (
                <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
                  Warning: Low balance!
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a student to view their information
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Purchase;
