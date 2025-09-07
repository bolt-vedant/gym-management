import React from 'react';
import { Users, UserPlus, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { Member, Trainer, GymClass, Payment } from '../types';

interface DashboardProps {
  members: Member[];
  trainers: Trainer[];
  classes: GymClass[];
  payments: Payment[];
  onAddMember: () => void;
  onScheduleClass: () => void;
  onProcessPayment: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  members, 
  trainers, 
  classes, 
  payments,
  onAddMember,
  onScheduleClass,
  onProcessPayment
}) => {
  const stats = [
    {
      title: 'Total Members',
      value: members.length,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Trainers',
      value: trainers.filter(t => t.status === 'Active').length,
      icon: UserPlus,
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Classes Today',
      value: classes.length,
      icon: Calendar,
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Monthly Revenue',
      value: `$${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentCheckIns = members
    .filter(m => m.lastCheckIn)
    .sort((a, b) => new Date(b.lastCheckIn!).getTime() - new Date(a.lastCheckIn!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Welcome to your gym management overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 transition-all duration-200 hover:shadow-lg hover:scale-105`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Check-ins */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Check-ins</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentCheckIns.map((member) => (
              <div key={member.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">{member.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.membershipType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">
                    {new Date(member.lastCheckIn!).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(member.lastCheckIn!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {recentCheckIns.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent check-ins</p>
            )}
          </div>
        </div>

        {/* Popular Classes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Popular Classes</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {classes.map((gymClass) => (
              <div key={gymClass.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{gymClass.name}</p>
                  <p className="text-sm text-gray-500">{gymClass.schedule}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {gymClass.enrolled}/{gymClass.capacity}
                  </p>
                  <p className="text-xs text-gray-500">enrolled</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={onAddMember}
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            <Users className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-700">Add New Member</span>
          </button>
          <button 
            onClick={onScheduleClass}
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
          >
            <Calendar className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-700">Schedule Class</span>
          </button>
          <button 
            onClick={onProcessPayment}
            className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
          >
            <DollarSign className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-purple-700">Process Payment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;