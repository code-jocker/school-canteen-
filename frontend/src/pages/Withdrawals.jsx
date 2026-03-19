import { useState, useEffect } from 'react';
import { studentAPI, transactionAPI } from '../services/api';
import { ArrowUpRight } from 'lucide-react';

const Withdrawals = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('short-saving');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getStudents();
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleStudentChange = async (e) => {
    const studentId = e.target.value;
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
      await transactionAPI.createWithdrawal({
        studentId: selectedStudent,
        amount: parseFloat(amount),
        category,
        notes
      });

      setSuccess('Withdrawal successful!');
      setAmount('');
      setNotes('');
      
      // Refresh student data
      const response = await studentAPI.getStudents();
      setStudents(response.data.students);
      const updatedStudent = response.data.students.find(s => s._id === selectedStudent);
      setCurrentStudent(updatedStudent);
    } catch (err) {
      setError(err.response?.data?.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-rwanda-dark mb-4 md:mb-6">Withdraw Savings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Withdrawal Form */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="p-2 md:p-3 bg-rwanda-green rounded-lg">
              <ArrowUpRight className="w-5 md:w-6 h-5 md:h-6 text-white" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold">New Withdrawal</h2>
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
              <label className="block text-sm font-medium mb-2">Select Student</label>
              <select
                value={selectedStudent}
                onChange={handleStudentChange}
                className="select"
                required
              >
                <option value="">-- Select Student --</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.studentId}) - {student.class}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Savings Type</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select"
              >
                <option value="short-saving">Short Term Savings</option>
                <option value="long-saving">Long Term Savings</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Amount (RWF)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input"
                placeholder="Enter amount"
                min="1"
                required
              />
              {currentStudent && (
                <p className="text-sm text-gray-500 mt-1">
                  Available: {category === 'short-saving' 
                    ? currentStudent.shortSaving 
                    : currentStudent.longSaving
                  } RWF
                </p>
              )}
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
              className="w-full btn btn-success py-3 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Approve Withdrawal'}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-500">Short Saving</p>
                  <p className="text-lg font-bold text-yellow-700">
                    {currentStudent.shortSaving.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-500">Long Saving</p>
                  <p className="text-lg font-bold text-rwanda-green">
                    {currentStudent.longSaving.toLocaleString()}
                  </p>
                </div>
              </div>
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

export default Withdrawals;
