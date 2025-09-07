import React, { useState } from 'react';
import { HistoryEntry, Member, DietPlan, WorkoutPlan } from '../types';
import { History, Calendar, Clock, RotateCcw, Eye, Download, Filter, Search, Apple, Target } from 'lucide-react';

const DietWorkoutHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diet' | 'workout'>('diet');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock data
  const [members] = useState<Member[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@email.com',
      phone: '+1234567890',
      membershipType: 'Premium',
      joinDate: '2024-01-15',
      membershipPrice: 2999,
      pricing: { monthly: 2999, quarterly: 8099, yearly: 29999 },
      status: 'Active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@email.com',
      phone: '+1234567891',
      membershipType: 'Basic',
      joinDate: '2024-02-01',
      membershipPrice: 1499,
      pricing: { monthly: 1499, quarterly: 4049, yearly: 14999 },
      status: 'Active'
    }
  ]);

  const [historyEntries] = useState<HistoryEntry[]>([
    {
      id: '1',
      memberId: '1',
      type: 'Diet',
      planData: {
        id: '1',
        memberId: '1',
        age: 28,
        gender: 'Male',
        dietaryPreference: 'Non-Vegetarian',
        weight: 75,
        height: 175,
        workoutDuration: 60,
        bodyGoal: 'Gain Weight',
        dailyCalories: 2800,
        macros: {
          carbs: 350,
          proteins: 140,
          fats: 93
        },
        meals: {
          breakfast: [
            { name: 'Oatmeal with berries', quantity: '1 bowl', calories: 300 },
            { name: 'Protein shake', quantity: '1 serving', calories: 200 }
          ],
          lunch: [
            { name: 'Chicken breast', quantity: '200g', calories: 330 },
            { name: 'Brown rice', quantity: '1 cup', calories: 220 }
          ],
          snacks: [
            { name: 'Greek yogurt', quantity: '1 cup', calories: 150 },
            { name: 'Almonds', quantity: '30g', calories: 170 }
          ],
          dinner: [
            { name: 'Salmon fillet', quantity: '150g', calories: 280 },
            { name: 'Sweet potato', quantity: '1 medium', calories: 100 }
          ]
        },
        createdAt: '2024-11-15T10:00:00Z'
      } as DietPlan,
      createdAt: '2024-11-15T10:00:00Z',
      isActive: false
    },
    {
      id: '2',
      memberId: '1',
      type: 'Workout',
      planData: {
        id: '2',
        memberId: '1',
        fitnessGoal: 'Muscle Gain',
        currentLevel: 'Intermediate',
        availableDays: 5,
        preferredWorkouts: ['Weight Training', 'Cardio'],
        weeklySchedule: {
          Monday: {
            focus: 'Chest & Triceps',
            exercises: [
              { name: 'Bench Press', sets: 4, reps: '8-10' },
              { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12' },
              { name: 'Tricep Dips', sets: 3, reps: '12-15' }
            ],
            restTime: '60-90 seconds'
          },
          Tuesday: {
            focus: 'Back & Biceps',
            exercises: [
              { name: 'Pull-ups', sets: 4, reps: '6-8' },
              { name: 'Barbell Rows', sets: 3, reps: '8-10' },
              { name: 'Bicep Curls', sets: 3, reps: '12-15' }
            ],
            restTime: '60-90 seconds'
          }
        },
        createdAt: '2024-11-10T14:00:00Z'
      } as WorkoutPlan,
      createdAt: '2024-11-10T14:00:00Z',
      isActive: true
    },
    {
      id: '3',
      memberId: '2',
      type: 'Diet',
      planData: {
        id: '3',
        memberId: '2',
        age: 25,
        gender: 'Female',
        dietaryPreference: 'Vegetarian',
        weight: 60,
        height: 165,
        workoutDuration: 45,
        bodyGoal: 'Lose Weight',
        dailyCalories: 1800,
        macros: {
          carbs: 180,
          proteins: 108,
          fats: 60
        },
        meals: {
          breakfast: [
            { name: 'Green smoothie', quantity: '1 glass', calories: 250 },
            { name: 'Whole grain toast', quantity: '2 slices', calories: 160 }
          ],
          lunch: [
            { name: 'Quinoa salad', quantity: '1 bowl', calories: 300 },
            { name: 'Paneer tikka', quantity: '100g', calories: 200 }
          ],
          snacks: [
            { name: 'Apple', quantity: '1 medium', calories: 80 },
            { name: 'Nuts mix', quantity: '20g', calories: 120 }
          ],
          dinner: [
            { name: 'Lentil curry', quantity: '1 bowl', calories: 180 },
            { name: 'Brown rice', quantity: '0.5 cup', calories: 110 }
          ]
        },
        createdAt: '2024-11-20T09:00:00Z'
      } as DietPlan,
      createdAt: '2024-11-20T09:00:00Z',
      isActive: true
    }
  ]);

  const filteredEntries = historyEntries.filter(entry => {
    const matchesType = entry.type.toLowerCase() === activeTab;
    const matchesMember = selectedMember === 'all' || entry.memberId === selectedMember;
    const matchesSearch = searchTerm === '' || 
      members.find(m => m.id === entry.memberId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const entryDate = new Date(entry.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'week':
          matchesDate = (now.getTime() - entryDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          matchesDate = (now.getTime() - entryDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
          break;
        case '3months':
          matchesDate = (now.getTime() - entryDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
          break;
      }
    }

    return matchesType && matchesMember && matchesSearch && matchesDate;
  });

  const handleRegeneratePlan = (entry: HistoryEntry) => {
    // In a real app, this would trigger the diet/workout planner with the member's current data
    console.log('Regenerating plan for:', entry);
  };

  const handleViewPlan = (entry: HistoryEntry) => {
    // In a real app, this would open a detailed view of the plan
    console.log('Viewing plan:', entry);
  };

  const exportPlan = (entry: HistoryEntry) => {
    const planData = JSON.stringify(entry.planData, null, 2);
    const blob = new Blob([planData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entry.type}_plan_${entry.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Diet & Workout History</h1>
        <p className="text-gray-600">Track and manage previously generated diet plans and workout schedules</p>
      </div>

      {/* Filters and Search */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Search</label>
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search by member name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Member</label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Members</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="3months">Last 3 Months</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
              <Filter className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 bg-white rounded-lg shadow-sm">
        <nav className="flex px-6 space-x-8" aria-label="Tabs">
          {[
            { id: 'diet', name: 'Diet Plans', icon: Apple },
            { id: 'workout', name: 'Workout Plans', icon: Target }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* History List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {activeTab === 'diet' ? 'Diet Plan' : 'Workout Plan'} History
            </h2>
            <div className="text-sm text-gray-500">
              {filteredEntries.length} plans found
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredEntries.length > 0 ? (
            <div className="space-y-4">
              {filteredEntries.map((entry) => {
                const member = members.find(m => m.id === entry.memberId);
                const planData = entry.planData;
                
                return (
                  <div key={entry.id} className="p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2 space-x-3">
                          <div className="flex items-center space-x-2">
                            <History className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold">{member?.name}</h3>
                          </div>
                          {entry.isActive && (
                            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                              Active
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-3 text-sm text-gray-600 md:grid-cols-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {new Date(entry.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {activeTab === 'diet' 
                                ? `${(planData as DietPlan).dailyCalories} cal/day`
                                : `${(planData as WorkoutPlan).availableDays} days/week`
                              }
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4" />
                            <span>
                              {activeTab === 'diet' 
                                ? (planData as DietPlan).bodyGoal
                                : (planData as WorkoutPlan).fitnessGoal
                              }
                            </span>
                          </div>
                        </div>

                        {activeTab === 'diet' ? (
                          <div className="p-3 rounded-md bg-gray-50">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Carbs:</span>
                                <span className="ml-1">{(planData as DietPlan).macros.carbs}g</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Protein:</span>
                                <span className="ml-1">{(planData as DietPlan).macros.proteins}g</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Fats:</span>
                                <span className="ml-1">{(planData as DietPlan).macros.fats}g</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded-md bg-gray-50">
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Focus Areas:</span>
                              <div className="mt-1">
                                {Object.values((planData as WorkoutPlan).weeklySchedule).slice(0, 3).map((day, index) => (
                                  <span key={index} className="inline-block px-2 py-1 mb-1 mr-2 text-xs text-blue-800 bg-blue-100 rounded-full">
                                    {day.focus}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col ml-4 space-y-2">
                        <button
                          onClick={() => handleViewPlan(entry)}
                          className="flex items-center px-3 py-1 space-x-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => exportPlan(entry)}
                          className="flex items-center px-3 py-1 space-x-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                          <Download className="w-3 h-3" />
                          <span>Export</span>
                        </button>
                        <button
                          onClick={() => handleRegeneratePlan(entry)}
                          className="flex items-center px-3 py-1 space-x-1 text-sm text-white bg-orange-600 rounded-md hover:bg-orange-700"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Regenerate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">No plans found</h3>
              <p className="text-gray-500">
                No {activeTab} plans match your current filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietWorkoutHistory;
