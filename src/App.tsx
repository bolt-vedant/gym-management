import React, { useState } from 'react';
import { Users, Calendar, Dumbbell, CreditCard, BarChart3, UserPlus, Clock, Activity } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import MemberDetails from './components/MemberDetails';
import Trainers from './components/Trainers';
import Classes from './components/Classes';
import Equipment from './components/Equipment';
import Payments from './components/Payments';
import { Member, Trainer, GymClass, Equipment as EquipmentType, Payment } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  // Sample data
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1-555-0123',
      membershipType: 'Premium',
      joinDate: '2024-01-15',
      membershipPrice: 99.99,
      pricing: {
        monthly: 99.99,
        quarterly: 269.99,
        yearly: 999.99,
        discount: 10
      },
      status: 'Active',
      lastCheckIn: '2024-01-18T09:30:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1-555-0124',
      membershipType: 'Basic',
      joinDate: '2024-01-10',
      membershipPrice: 49.99,
      pricing: {
        monthly: 49.99,
        quarterly: 134.99,
        yearly: 499.99
      },
      status: 'Active',
      lastCheckIn: '2024-01-18T07:15:00Z'
    }
  ]);

  const [trainers, setTrainers] = useState<Trainer[]>([
    {
      id: '1',
      name: 'Mike Wilson',
      specialization: 'Strength Training',
      email: 'mike@gym.com',
      phone: '+1-555-0200',
      status: 'Active',
      experience: '5 years'
    },
    {
      id: '2',
      name: 'Lisa Davis',
      specialization: 'Yoga & Pilates',
      email: 'lisa@gym.com',
      phone: '+1-555-0201',
      status: 'Active',
      experience: '3 years'
    }
  ]);

  const [classes, setClasses] = useState<GymClass[]>([
    {
      id: '1',
      name: 'Morning Yoga',
      trainerId: '2',
      schedule: 'Mon, Wed, Fri 8:00 AM',
      duration: 60,
      capacity: 20,
      enrolled: 15
    },
    {
      id: '2',
      name: 'HIIT Training',
      trainerId: '1',
      schedule: 'Tue, Thu 6:00 PM',
      duration: 45,
      capacity: 15,
      enrolled: 12
    }
  ]);

  const [equipment, setEquipment] = useState<EquipmentType[]>([
    {
      id: '1',
      name: 'Treadmill',
      category: 'Cardio',
      status: 'Available',
      lastMaintenance: '2024-01-10'
    },
    {
      id: '2',
      name: 'Bench Press',
      category: 'Strength',
      status: 'In Use',
      lastMaintenance: '2024-01-05'
    }
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      memberId: '1',
      amount: 99.99,
      date: '2024-01-15',
      status: 'Completed',
      description: 'Premium Monthly Membership'
    },
    {
      id: '2',
      memberId: '2',
      amount: 49.99,
      date: '2024-01-10',
      status: 'Completed',
      description: 'Basic Monthly Membership'
    }
  ]);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'trainers', label: 'Trainers', icon: UserPlus },
    { id: 'classes', label: 'Classes', icon: Calendar },
    { id: 'equipment', label: 'Equipment', icon: Dumbbell },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  const renderContent = () => {
    if (selectedMember) {
      return (
        <MemberDetails 
          member={selectedMember} 
          payments={payments.filter(p => p.memberId === selectedMember.id)}
          onBack={() => setSelectedMember(null)}
          onEdit={(member) => {
            setSelectedMember(null);
            setActiveTab('members');
          }}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            members={members} 
            trainers={trainers} 
            classes={classes} 
            payments={payments}
            onAddMember={() => setActiveTab('members')}
            onScheduleClass={() => setActiveTab('classes')}
            onProcessPayment={() => setActiveTab('payments')}
          />
        );
      case 'members':
        return (
          <Members 
            members={members} 
            setMembers={setMembers}
            onMemberClick={setSelectedMember}
          />
        );
      case 'trainers':
        return <Trainers trainers={trainers} setTrainers={setTrainers} />;
      case 'classes':
        return <Classes classes={classes} setClasses={setClasses} trainers={trainers} />;
      case 'equipment':
        return <Equipment equipment={equipment} setEquipment={setEquipment} />;
      case 'payments':
        return <Payments payments={payments} members={members} />;
      default:
        return (
          <Dashboard 
            members={members} 
            trainers={trainers} 
            classes={classes} 
            payments={payments}
            onAddMember={() => setActiveTab('members')}
            onScheduleClass={() => setActiveTab('classes')}
            onProcessPayment={() => setActiveTab('payments')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FitnessPro</h1>
                <p className="text-sm text-gray-500">Gym Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;