import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Trainer } from '../types';

interface TrainersProps {
  trainers: Trainer[];
  setTrainers: React.Dispatch<React.SetStateAction<Trainer[]>>;
}

const Trainers: React.FC<TrainersProps> = ({ trainers, setTrainers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    experience: '',
  });

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTrainer) {
      setTrainers(prev => prev.map(trainer => 
        trainer.id === editingTrainer.id 
          ? { ...trainer, ...formData }
          : trainer
      ));
      setEditingTrainer(null);
    } else {
      const newTrainer: Trainer = {
        id: Date.now().toString(),
        ...formData,
        status: 'Active',
      };
      setTrainers(prev => [...prev, newTrainer]);
    }
    
    setFormData({ name: '', specialization: '', email: '', phone: '', experience: '' });
    setShowAddForm(false);
  };

  const handleEdit = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      specialization: trainer.specialization,
      email: trainer.email,
      phone: trainer.phone,
      experience: trainer.experience,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      setTrainers(prev => prev.filter(trainer => trainer.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setTrainers(prev => prev.map(trainer => 
      trainer.id === id 
        ? { ...trainer, status: trainer.status === 'Active' ? 'Inactive' : 'Active' }
        : trainer
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trainers</h2>
          <p className="text-gray-600">Manage your gym trainers and staff</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingTrainer(null);
            setFormData({ name: '', specialization: '', email: '', phone: '', experience: '' });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Trainer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search trainers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <input
                type="text"
                required
                placeholder="e.g., 5 years"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingTrainer(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {editingTrainer ? 'Update' : 'Add'} Trainer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.map((trainer) => (
          <div key={trainer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">{trainer.name.charAt(0)}</span>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                trainer.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {trainer.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{trainer.name}</h3>
              <p className="text-sm text-blue-600 font-medium">{trainer.specialization}</p>
              <p className="text-sm text-gray-500">{trainer.experience} experience</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="truncate">{trainer.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{trainer.phone}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                onClick={() => toggleStatus(trainer.id)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  trainer.status === 'Active'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {trainer.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(trainer)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(trainer.id)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrainers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No trainers found</p>
        </div>
      )}
    </div>
  );
};

export default Trainers;