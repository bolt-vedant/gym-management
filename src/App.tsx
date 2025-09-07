import React, { useState } from 'react';
import { Users, Calendar, Dumbbell, CreditCard, BarChart3, UserPlus, Clock, Activity, Apple, Target, ClipboardCheck, History, Bell } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import MemberDetails from './components/MemberDetails';
import Trainers from './components/Trainers';
import Classes from './components/Classes';
import Equipment from './components/Equipment';
import Payments from './components/Payments';
import DietPlanner from './components/DietPlanner';
import WorkoutPlanner from './components/WorkoutPlanner';
import Attendance from './components/Attendance';
import DietWorkoutHistory from './components/DietWorkoutHistory';
import NotificationSystem from './components/NotificationSystem';
import { Member, Trainer, GymClass, Equipment as EquipmentType, Payment, DietPlan, WorkoutPlan } from './types';

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
      membershipPrice: 2999,
      pricing: {
        monthly: 2999,
        quarterly: 8099,
        yearly: 29999,
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
      membershipPrice: 1499,
      pricing: {
        monthly: 1499,
        quarterly: 4049,
        yearly: 14999
      },
      status: 'Active',
      lastCheckIn: '2024-01-18T07:15:00Z'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      phone: '+1-555-0125',
      membershipType: 'VIP',
      joinDate: '2023-12-20',
      membershipPrice: 4499,
      pricing: {
        monthly: 4499,
        quarterly: 12149,
        yearly: 44999,
        discount: 15
      },
      status: 'Active',
      lastCheckIn: '2024-01-17T18:45:00Z'
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      phone: '+1-555-0126',
      membershipType: 'Premium',
      joinDate: '2024-01-05',
      membershipPrice: 2999,
      pricing: {
        monthly: 2999,
        quarterly: 8099,
        yearly: 29999,
        discount: 10
      },
      status: 'Active',
      lastCheckIn: '2024-01-18T14:20:00Z'
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+1-555-0127',
      membershipType: 'Basic',
      joinDate: '2023-11-15',
      membershipPrice: 1499,
      pricing: {
        monthly: 1499,
        quarterly: 4049,
        yearly: 14999
      },
      status: 'Suspended',
      lastCheckIn: '2024-01-10T10:30:00Z'
    },
    {
      id: '6',
      name: 'Lisa Thompson',
      email: 'lisa.t@example.com',
      phone: '+1-555-0128',
      membershipType: 'VIP',
      joinDate: '2023-10-08',
      membershipPrice: 4499,
      pricing: {
        monthly: 4499,
        quarterly: 12149,
        yearly: 44999,
        discount: 15
      },
      status: 'Active',
      lastCheckIn: '2024-01-18T16:15:00Z'
    },
    {
      id: '7',
      name: 'James Brown',
      email: 'james@example.com',
      phone: '+1-555-0129',
      membershipType: 'Premium',
      joinDate: '2024-01-12',
      membershipPrice: 2999,
      pricing: {
        monthly: 2999,
        quarterly: 8099,
        yearly: 29999,
        discount: 10
      },
      status: 'Active',
      lastCheckIn: '2024-01-18T12:00:00Z'
    },
    {
      id: '8',
      name: 'Anna Martinez',
      email: 'anna@example.com',
      phone: '+1-555-0130',
      membershipType: 'Basic',
      joinDate: '2023-12-01',
      membershipPrice: 1499,
      pricing: {
        monthly: 1499,
        quarterly: 4049,
        yearly: 14999
      },
      status: 'Active',
      lastCheckIn: '2024-01-17T08:45:00Z'
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
      amount: 2999,
      date: '2024-01-15',
      status: 'Completed',
      description: 'Premium Monthly Membership'
    },
    {
      id: '2',
      memberId: '2',
      amount: 1499,
      date: '2024-01-10',
      status: 'Completed',
      description: 'Basic Monthly Membership'
    },
    {
      id: '3',
      memberId: '3',
      amount: 4499,
      date: '2023-12-20',
      status: 'Completed',
      description: 'VIP Monthly Membership'
    },
    {
      id: '4',
      memberId: '4',
      amount: 2999,
      date: '2024-01-05',
      status: 'Completed',
      description: 'Premium Monthly Membership'
    },
    {
      id: '5',
      memberId: '5',
      amount: 1499,
      date: '2023-11-15',
      status: 'Failed',
      description: 'Basic Monthly Membership'
    },
    {
      id: '6',
      memberId: '6',
      amount: 4499,
      date: '2023-10-08',
      status: 'Completed',
      description: 'VIP Monthly Membership'
    },
    {
      id: '7',
      memberId: '7',
      amount: 2999,
      date: '2024-01-12',
      status: 'Pending',
      description: 'Premium Monthly Membership'
    },
    {
      id: '8',
      memberId: '8',
      amount: 1499,
      date: '2023-12-01',
      status: 'Completed',
      description: 'Basic Monthly Membership'
    }
  ]);

  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'trainers', label: 'Trainers', icon: UserPlus },
    { id: 'classes', label: 'Classes', icon: Calendar },
    { id: 'equipment', label: 'Equipment', icon: Dumbbell },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
    { id: 'history', label: 'History', icon: History },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'diet-planner', label: 'Diet Planner', icon: Apple },
    { id: 'workout-planner', label: 'Workout Planner', icon: Target },
  ];

  const handleAddPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString()
    };
    setPayments([...payments, newPayment]);
  };

  const handleDietPlanGenerated = (plan: DietPlan) => {
    setDietPlans(prev => [...prev, plan]);
  };

  const handleWorkoutPlanGenerated = (plan: WorkoutPlan) => {
    setWorkoutPlans(prev => [...prev, plan]);
  };

  const renderContent = () => {
    if (selectedMember) {
      return (
        <MemberDetails 
          member={selectedMember} 
          payments={payments.filter(p => p.memberId === selectedMember.id)}
          onBack={() => setSelectedMember(null)}
          onEdit={(updatedMember) => {
            setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
            setSelectedMember(updatedMember);
          }}
          onAddPayment={handleAddPayment}
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
        return <Payments payments={payments} members={members} onAddPayment={handleAddPayment} onMemberClick={setSelectedMember} />;
      case 'attendance':
        return <Attendance />;
      case 'history':
        return <DietWorkoutHistory />;
      case 'notifications':
        return <NotificationSystem />;
      case 'diet-planner':
        return <DietPlanner onPlanGenerated={handleDietPlanGenerated} />;
      case 'workout-planner':
        return <WorkoutPlanner onPlanGenerated={handleWorkoutPlanGenerated} />;
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
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FitnessPro</h1>
                <p className="text-sm text-gray-500">Gym Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm">
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
                      <Icon className="w-5 h-5" />
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