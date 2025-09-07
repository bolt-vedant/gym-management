import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Calendar, Clock, Users } from 'lucide-react';
import { GymClass, Trainer } from '../types';

interface ClassesProps {
  classes: GymClass[];
  setClasses: React.Dispatch<React.SetStateAction<GymClass[]>>;
  trainers: Trainer[];
}

const Classes: React.FC<ClassesProps> = ({ classes, setClasses, trainers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState<GymClass | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    trainerId: '',
    schedule: '',
    duration: 60,
    capacity: 20,
  });

  const filteredClasses = classes.filter(gymClass =>
    gymClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gymClass.schedule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClass) {
      setClasses(prev => prev.map(gymClass => 
        gymClass.id === editingClass.id 
          ? { ...gymClass, ...formData, enrolled: gymClass.enrolled }
          : gymClass
      ));
      setEditingClass(null);
    } else {
      const newClass: GymClass = {
        id: Date.now().toString(),
        ...formData,
        enrolled: 0,
      };
      setClasses(prev => [...prev, newClass]);
    }
    
    setFormData({ name: '', trainerId: '', schedule: '', duration: 60, capacity: 20 });
    setShowAddForm(false);
  };

  const handleEdit = (gymClass: GymClass) => {
    setEditingClass(gymClass);
    setFormData({
      name: gymClass.name,
      trainerId: gymClass.trainerId,
      schedule: gymClass.schedule,
      duration: gymClass.duration,
      capacity: gymClass.capacity,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(prev => prev.filter(gymClass => gymClass.id !== id));
    }
  };

  const getTrainerName = (trainerId: string) => {
    const trainer = trainers.find(t => t.id === trainerId);
    return trainer ? trainer.name : 'Unknown Trainer';
  };

  const getCapacityColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Classes</h2>
          <p className="text-gray-600">Manage gym classes and schedules</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingClass(null);
            setFormData({ name: '', trainerId: '', schedule: '', duration: 60, capacity: 20 });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Class</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingClass ? 'Edit Class' : 'Add New Class'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trainer</label>
              <select
                required
                value={formData.trainerId}
                onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a trainer</option>
                {trainers.filter(t => t.status === 'Active').map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.name} - {trainer.specialization}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
              <input
                type="text"
                required
                placeholder="e.g., Mon, Wed, Fri 8:00 AM"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                required
                min="15"
                max="180"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingClass(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {editingClass ? 'Update' : 'Add'} Class
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((gymClass) => (
          <div key={gymClass.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{gymClass.name}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(gymClass)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(gymClass.id)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{getTrainerName(gymClass.trainerId)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{gymClass.schedule}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{gymClass.duration} minutes</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Enrollment</span>
                <span className={`text-sm font-bold ${getCapacityColor(gymClass.enrolled, gymClass.capacity)}`}>
                  {gymClass.enrolled}/{gymClass.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (gymClass.enrolled / gymClass.capacity) * 100 >= 90 
                      ? 'bg-red-500' 
                      : (gymClass.enrolled / gymClass.capacity) * 100 >= 75 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${(gymClass.enrolled / gymClass.capacity) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No classes found</p>
        </div>
      )}
    </div>
  );
};

export default Classes;