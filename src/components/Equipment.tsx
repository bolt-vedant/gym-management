import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Wrench, AlertCircle } from 'lucide-react';
import { Equipment } from '../types';

interface EquipmentProps {
  equipment: Equipment[];
  setEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
}

const EquipmentComponent: React.FC<EquipmentProps> = ({ equipment, setEquipment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Cardio' as Equipment['category'],
  });

  const categories = ['All', 'Cardio', 'Strength', 'Functional', 'Other'];

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEquipment) {
      setEquipment(prev => prev.map(item => 
        item.id === editingEquipment.id 
          ? { ...item, ...formData }
          : item
      ));
      setEditingEquipment(null);
    } else {
      const newEquipment: Equipment = {
        id: Date.now().toString(),
        ...formData,
        status: 'Available',
        lastMaintenance: new Date().toISOString().split('T')[0],
      };
      setEquipment(prev => [...prev, newEquipment]);
    }
    
    setFormData({ name: '', category: 'Cardio' });
    setShowAddForm(false);
  };

  const handleEdit = (item: Equipment) => {
    setEditingEquipment(item);
    setFormData({
      name: item.name,
      category: item.category,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      setEquipment(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateStatus = (id: string, newStatus: Equipment['status']) => {
    setEquipment(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: newStatus }
        : item
    ));
  };

  const markMaintenance = (id: string) => {
    setEquipment(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            status: 'Available',
            lastMaintenance: new Date().toISOString().split('T')[0]
          }
        : item
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'In Use': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Order': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cardio': return '🏃';
      case 'Strength': return '💪';
      case 'Functional': return '🤸';
      default: return '⚡';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipment</h2>
          <p className="text-gray-600">Manage gym equipment and maintenance</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingEquipment(null);
            setFormData({ name: '', category: 'Cardio' });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Equipment</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                categoryFilter === category
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Equipment['category'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Cardio">Cardio</option>
                <option value="Strength">Strength</option>
                <option value="Functional">Functional</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingEquipment(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {editingEquipment ? 'Update' : 'Add'} Equipment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Wrench className="h-4 w-4" />
                <span>Last maintenance: {new Date(item.lastMaintenance).toLocaleDateString()}</span>
              </div>
            </div>

            {item.status === 'Out of Order' && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-2 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span>Equipment needs attention</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                {item.status === 'Available' && (
                  <button
                    onClick={() => updateStatus(item.id, 'In Use')}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                  >
                    Mark In Use
                  </button>
                )}
                {item.status === 'In Use' && (
                  <button
                    onClick={() => updateStatus(item.id, 'Available')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors duration-200"
                  >
                    Mark Available
                  </button>
                )}
                {(item.status === 'Maintenance' || item.status === 'Out of Order') && (
                  <button
                    onClick={() => markMaintenance(item.id)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors duration-200"
                  >
                    Fixed
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateStatus(item.id, 'Maintenance')}
                  className="text-yellow-600 hover:text-yellow-800 transition-colors duration-200"
                  title="Mark for Maintenance"
                >
                  <Wrench className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No equipment found</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentComponent;