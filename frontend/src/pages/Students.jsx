import { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

const Students = () => {
  const { isSuperAdmin } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    class: '',
    canteenBalance: 0,
    shortSaving: 0,
    longSaving: 0
  });

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getStudents({ search });
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentAPI.updateStudent(editingStudent._id, formData);
      } else {
        await studentAPI.createStudent(formData);
      }
      setShowModal(false);
      setEditingStudent(null);
      resetForm();
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      class: student.class,
      canteenBalance: student.canteenBalance,
      shortSaving: student.shortSaving,
      longSaving: student.longSaving
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await studentAPI.deleteStudent(id);
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting student');
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      name: '',
      class: '',
      canteenBalance: 0,
      shortSaving: 0,
      longSaving: 0
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rwanda-blue"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-rwanda-dark">Students</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingStudent(null);
            setShowModal(true);
          }}
          className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={20} />
          <span className="sm:inline">Add Student</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Class</th>
              <th>Canteen</th>
              <th>Short Saving</th>
              <th>Long Saving</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id}>
                  <td className="font-mono">{student.studentId}</td>
                  <td className="font-medium">{student.name}</td>
                  <td>{student.class}</td>
                  <td className="text-rwanda-blue font-medium">
                    {student.canteenBalance.toLocaleString()} RWF
                  </td>
                  <td className="text-rwanda-yellow-700">
                    {student.shortSaving.toLocaleString()} RWF
                  </td>
                  <td className="text-rwanda-green">
                    {student.longSaving.toLocaleString()} RWF
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-2 text-rwanda-blue hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      {isSuperAdmin() && (
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
          </div>
        </div>

        {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Student ID</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="input"
                  required
                  disabled={!!editingStudent}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Class</label>
                <input
                  type="text"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="input"
                  required
                />
              </div>
              {!editingStudent && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Initial Canteen Balance</label>
                    <input
                      type="number"
                      value={formData.canteenBalance}
                      onChange={(e) => setFormData({ ...formData, canteenBalance: parseFloat(e.target.value) || 0 })}
                      className="input"
                      min="0"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Initial Short Saving</label>
                    <input
                      type="number"
                      value={formData.shortSaving}
                      onChange={(e) => setFormData({ ...formData, shortSaving: parseFloat(e.target.value) || 0 })}
                      className="input"
                      min="0"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Initial Long Saving</label>
                    <input
                      type="number"
                      value={formData.longSaving}
                      onChange={(e) => setFormData({ ...formData, longSaving: parseFloat(e.target.value) || 0 })}
                      className="input"
                      min="0"
                    />
                  </div>
                </>
              )}
              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingStudent ? 'Update' : 'Add Student'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStudent(null);
                    resetForm();
                  }}
                  className="btn bg-gray-300 text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
