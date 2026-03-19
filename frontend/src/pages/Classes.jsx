import { useState, useEffect } from 'react';
import { classAPI } from '../services/api';
import { Plus, Trash2, Edit, Users } from 'lucide-react';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    level: 'S1',
    stream: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesRes, statsRes] = await Promise.all([
        classAPI.getClasses(),
        classAPI.getClassStats()
      ]);
      setClasses(classesRes.data.classes);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await classAPI.updateClass(editingClass._id, formData);
      } else {
        await classAPI.createClass(formData);
      }
      setShowModal(false);
      setEditingClass(null);
      resetForm();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving class');
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      level: cls.level,
      stream: cls.stream
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await classAPI.deleteClass(id);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting class');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', level: 'S1', stream: '' });
  };

  const getStatsForClass = (className) => {
    return stats.find(s => s.name === className) || {};
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
        <h1 className="text-xl md:text-2xl font-bold text-rwanda-dark">Classes</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingClass(null);
            setShowModal(true);
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Class
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {classes.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No classes found. Add a class to get started.
          </div>
        ) : (
          classes.map((cls) => {
            const classStats = getStatsForClass(cls.name);
            return (
              <div key={cls._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-rwanda-blue">{cls.name}</h3>
                    <p className="text-sm text-gray-500">Level: {cls.level}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cls)}
                      className="p-2 text-rwanda-blue hover:bg-blue-50 rounded"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(cls._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-gray-500" />
                    <span className="text-gray-600">Students:</span>
                    <span className="font-semibold">{classStats.studentCount || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Canteen:</span>
                    <span className="font-semibold text-rwanda-blue">
                      {(classStats.totalCanteen || 0).toLocaleString()} RWF
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Savings:</span>
                    <span className="font-semibold text-rwanda-green">
                      {((classStats.totalShortSaving || 0) + (classStats.totalLongSaving || 0)).toLocaleString()} RWF
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      <div className="card mt-6">
        <h2 className="text-lg font-semibold mb-4">Class Summary</h2>
        <div className="table-container">
          <table className="table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Students</th>
              <th>Canteen</th>
              <th>Short Saving</th>
              <th>Long Saving</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat._id}>
                <td className="font-medium">{stat.name}</td>
                <td>{stat.studentCount}</td>
                <td className="text-rwanda-blue">{(stat.totalCanteen || 0).toLocaleString()}</td>
                <td className="text-yellow-700">{(stat.totalShortSaving || 0).toLocaleString()}</td>
                <td className="text-rwanda-green">{(stat.totalLongSaving || 0).toLocaleString()}</td>
                <td className="font-bold">{(stat.totalMoney || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Class Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="e.g., S1A, S2B, S3C"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="select"
                >
                  <option value="S1">Senior 1</option>
                  <option value="S2">Senior 2</option>
                  <option value="S3">Senior 3</option>
                  <option value="S4">Senior 4</option>
                  <option value="S5">Senior 5</option>
                  <option value="S6">Senior 6</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Stream (Optional)</label>
                <input
                  type="text"
                  value={formData.stream}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  className="input"
                  placeholder="e.g., PCM, PCB, MEG"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingClass ? 'Update' : 'Add Class'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingClass(null);
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

export default Classes;
