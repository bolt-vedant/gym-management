import React from 'react';
import { ArrowLeft, Mail, Phone, Calendar, DollarSign, Clock, Activity, CreditCard, User, MapPin } from 'lucide-react';
import { Member, Payment } from '../types';

interface MemberDetailsProps {
  member: Member;
  payments: Payment[];
  onBack: () => void;
  onEdit: (member: Member) => void;
}

const MemberDetails: React.FC<MemberDetailsProps> = ({ member, payments, onBack, onEdit }) => {
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
          onClick={() => onEdit(member)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Edit Member
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
                <span className="text-gray-900">{member.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{member.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">Joined {new Date(member.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">${member.membershipPrice}/month</span>
              </div>
              {member.lastCheckIn && (
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">
                    Last check-in: {new Date(member.lastCheckIn).toLocaleDateString()}
                  </span>
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
                <span className="text-sm font-semibold text-green-600">${totalPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payments Made</span>
                <span className="text-sm font-semibold text-gray-900">{payments.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Next Payment</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date(new Date(member.joinDate).setMonth(new Date(member.joinDate).getMonth() + 1)).toLocaleDateString()}
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
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CreditCard className="h-4 w-4" />
                <span>{payments.length} transactions</span>
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
                      <p className="font-semibold text-gray-900">${payment.amount.toFixed(2)}</p>
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
    </div>
  );
};

export default MemberDetails;