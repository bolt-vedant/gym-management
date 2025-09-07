export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: 'Basic' | 'Premium' | 'VIP';
  joinDate: string;
  membershipPrice: number;
  pricing: {
    monthly: number;
    quarterly: number;
    yearly: number;
    discount?: number;
  };
  status: 'Active' | 'Inactive' | 'Suspended';
  lastCheckIn?: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  experience: string;
}

export interface GymClass {
  id: string;
  name: string;
  trainerId: string;
  schedule: string;
  duration: number;
  capacity: number;
  enrolled: number;
}

export interface Equipment {
  id: string;
  name: string;
  category: 'Cardio' | 'Strength' | 'Functional' | 'Other';
  status: 'Available' | 'In Use' | 'Maintenance' | 'Out of Order';
  lastMaintenance: string;
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  description: string;
}