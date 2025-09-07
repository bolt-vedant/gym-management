import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, Calendar, DollarSign, Clock, Activity, CreditCard, User, MapPin, Edit, Save, X, Plus } from 'lucide-react';
import { Member, Payment } from '../types';

interface MemberDetailsProps {
  member: Member;
  payments: Payment[];
  onBack: () => void;
  onEdit: (member: Member) => void;
  onAddPayment?: (payment: Omit<Payment, 'id'>) => void;
}

const MemberDetails: React.FC<MemberDetailsProps> = ({ member, payments, onBack, onEdit, onAddPayment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editedMember, setEditedMember] = useState(member);
  const [newPayment, setNewPayment] = useState({
    amount: member.membershipPrice,
    description: `${member.membershipType} Monthly Membership`,
    status: 'Completed' as 'Completed' | 'Pending' | 'Failed'
  });
  const getMembershipBadgeColor = (type: string) => {
    switch (type) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Premium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPaid = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const membershipDuration = Math.floor((new Date().getTime() - new Date(member.joinDate).getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate next payment date
  const lastPayment = payments.length > 0 ? payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;
  const nextPaymentDate = lastPayment 
    ? new Date(new Date(lastPayment.date).setMonth(new Date(lastPayment.date).getMonth() + 1))
    : new Date(new Date(member.joinDate).setMonth(new Date(member.joinDate).getMonth() + 1));
  
  const dueAmount = member.membershipPrice;
  const isDueToday = new Date().toDateString() === nextPaymentDate.toDateString();
  const isOverdue = new Date() > nextPaymentDate;

  const handleSaveMember = () => {
    onEdit(editedMember);
    setIsEditing(false);
  };

  const handleAddPayment = () => {
    if (onAddPayment) {
      const payment = {
        memberId: member.id,
        amount: newPayment.amount,
        date: new Date().toISOString().split('T')[0],
        status: newPayment.status,
        description: newPayment.description
      };
      onAddPayment(payment);
      setShowPaymentModal(false);
      setNewPayment({
        amount: member.membershipPrice,
        description: `${member.membershipType} Monthly Membership`,
        status: 'Completed'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Member Details</h2>
            <p className="text-gray-600">Complete member information and history</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">{member.name.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getMembershipBadgeColor(member.membershipType)}`}>
                  {member.membershipType}
                </span>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(member.status)}`}>
                  {member.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    value={editedMember.email}
                    onChange={(e) => setEditedMember({...editedMember, email: e.target.value})}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-gray-900">{member.email}</span>
                )}
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedMember.phone}
                    onChange={(e) => setEditedMember({...editedMember, phone: e.target.value})}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-gray-900">{member.phone}</span>
                )}
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">Joined {new Date(member.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <DollarSign className="h-4 w-4 text-gray-400" />
                {isEditing ? (
                  <input
                    type="number"
                    value={editedMember.membershipPrice}
                    onChange={(e) => setEditedMember({...editedMember, membershipPrice: parseFloat(e.target.value)})}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-gray-900">₹{member.membershipPrice}/month</span>
                )}
              </div>
              {member.lastCheckIn && (
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">
                    Last check-in: {new Date(member.lastCheckIn).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {isEditing && (
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={handleSaveMember}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center space-x-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {setIsEditing(false); setEditedMember(member);}}
                    className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center justify-center space-x-1"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member for</span>
                <span className="text-sm font-semibold text-gray-900">{membershipDuration} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Paid</span>
                <span className="text-sm font-semibold text-green-600">₹{totalPaid.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payments Made</span>
                <span className="text-sm font-semibold text-gray-900">{payments.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Next Payment</span>
                <div className="text-right">
                  <span className={`text-sm font-semibold ${isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : 'text-gray-900'}`}>
                    {nextPaymentDate.toLocaleDateString()}
                  </span>
                  {isOverdue && (
                    <div className="text-xs text-red-500">Overdue</div>
                  )}
                  {isDueToday && (
                    <div className="text-xs text-orange-500">Due Today</div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Due Amount</span>
                <span className={`text-sm font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                  ₹{dueAmount.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Payment History</h4>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CreditCard className="h-4 w-4" />
                  <span>{payments.length} transactions</span>
                </div>
                {onAddPayment && (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Payment</span>
                  </button>
                )}
              </div>
            </div>

            {payments.length > 0 ? (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{payment.description}</p>
                        <p className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{payment.amount.toFixed(0)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No payment history available</p>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Recent Activity</h4>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Member joined</p>
                  <p className="text-xs text-gray-500">{new Date(member.joinDate).toLocaleDateString()}</p>
                </div>
              </div>

              {member.lastCheckIn && (
                <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last check-in</p>
                    <p className="text-xs text-gray-500">{new Date(member.lastCheckIn).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {payments.length > 0 && (
                <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Latest payment</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payments[payments.length - 1].date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member</label>
                  <input
                    type="text"
                    value={member.name}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({...newPayment, amount: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newPayment.description}
                    onChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newPayment.status}
                    onChange={(e) => setNewPayment({...newPayment, status: e.target.value as 'Completed' | 'Pending' | 'Failed'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between text-sm">
                    <span>Due Amount:</span>
                    <span className="font-semibold">₹{dueAmount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Payment:</span>
                    <span>{lastPayment ? new Date(lastPayment.date).toLocaleDateString() : 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Next Due Date:</span>
                    <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>{nextPaymentDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPayment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetails;