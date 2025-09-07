import React, { useState } from 'react';
import { Search, DollarSign, Calendar, CheckCircle, Clock, XCircle, Plus, User } from 'lucide-react';
import { Payment, Member } from '../types';

interface PaymentsProps {
  payments: Payment[];
  members: Member[];
  onAddPayment?: (payment: Omit<Payment, 'id'>) => void;
  onMemberClick?: (member: Member) => void;
}

const Payments: React.FC<PaymentsProps> = ({ payments, members, onAddPayment, onMemberClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    description: '',
    status: 'Completed' as 'Completed' | 'Pending' | 'Failed'
  });

  const filteredPayments = payments.filter(payment => {
    const member = members.find(m => m.id === payment.memberId);
    const memberName = member ? member.name.toLowerCase() : '';
    const matchesSearch = memberName.includes(searchTerm.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown Member';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Failed': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const failedAmount = payments
    .filter(p => p.status === 'Failed')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    const memberPayments = payments.filter(p => p.memberId === member.id);
    const lastPayment = memberPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    setNewPayment({
      amount: member.membershipPrice,
      description: `${member.membershipType} Monthly Membership`,
      status: 'Completed'
    });
    setShowPaymentModal(true);
  };

  const handleAddPayment = () => {
    if (selectedMember && onAddPayment) {
      const payment = {
        memberId: selectedMember.id,
        amount: newPayment.amount,
        date: new Date().toISOString().split('T')[0],
        status: newPayment.status,
        description: newPayment.description
      };
      onAddPayment(payment);
      setShowPaymentModal(false);
      setSelectedMember(null);
      setNewPayment({
        amount: 0,
        description: '',
        status: 'Completed'
      });
    }
  };

  const getMemberPaymentInfo = (member: Member) => {
    const memberPayments = payments.filter(p => p.memberId === member.id);
    const lastPayment = memberPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const nextPaymentDate = lastPayment 
      ? new Date(new Date(lastPayment.date).setMonth(new Date(lastPayment.date).getMonth() + 1))
      : new Date(new Date(member.joinDate).setMonth(new Date(member.joinDate).getMonth() + 1));
    
    const isOverdue = new Date() > nextPaymentDate;
    
    return {
      lastPayment,
      nextPaymentDate,
      isOverdue,
      dueAmount: member.membershipPrice
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
        <p className="text-gray-600">Track membership payments and revenue</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-700">₹{totalRevenue.toFixed(0)}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-700">₹{pendingAmount.toFixed(0)}</p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Payments</p>
              <p className="text-2xl font-bold text-red-700">₹{failedAmount.toFixed(0)}</p>
            </div>
            <div className="bg-red-100 rounded-lg p-3">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Add Payment</p>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Payment</span>
              </button>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Completed', 'Pending', 'Failed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                statusFilter === status
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200"
                        onClick={() => onMemberClick && onMemberClick(members.find(m => m.id === payment.memberId)!)}
                      >
                        <span className="text-sm font-medium text-blue-700">
                          {getMemberName(payment.memberId).charAt(0)}
                        </span>
                      </div>
                      <div 
                        className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                        onClick={() => onMemberClick && onMemberClick(members.find(m => m.id === payment.memberId)!)}
                      >
                        {getMemberName(payment.memberId)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">₹{payment.amount.toFixed(0)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(payment.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No payments found</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Add New Payment</h3>
                  <button
                    onClick={() => {setShowPaymentModal(false); setSelectedMember(null);}}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
                  {/* Member Selection Panel */}
                  <div className="border-r border-gray-200 bg-gray-50">
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        Select Member
                      </h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {members.map((member) => {
                          const paymentInfo = getMemberPaymentInfo(member);
                          return (
                            <div
                              key={member.id}
                              onClick={() => handleSelectMember(member)}
                              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                                selectedMember?.id === member.id 
                                  ? 'bg-blue-50 border-blue-300 shadow-md ring-2 ring-blue-200' 
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                                    selectedMember?.id === member.id ? 'bg-blue-500' : 'bg-gray-400'
                                  }`}>
                                    {member.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">{member.name}</p>
                                    <p className="text-sm text-gray-500">{member.membershipType} Member</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`font-bold text-lg ${paymentInfo.isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                                    ₹{paymentInfo.dueAmount.toFixed(0)}
                                  </p>
                                  <p className={`text-xs font-medium ${paymentInfo.isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                                    {paymentInfo.isOverdue ? 'OVERDUE' : 'Due Amount'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <p className="text-gray-500">Next Due</p>
                                  <p className={`font-medium ${paymentInfo.isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
                                    {paymentInfo.nextPaymentDate.toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Last Payment</p>
                                  <p className="font-medium text-gray-700">
                                    {paymentInfo.lastPayment ? new Date(paymentInfo.lastPayment.date).toLocaleDateString() : 'None'}
                                  </p>
                                </div>
                              </div>
                              
                              {paymentInfo.isOverdue && (
                                <div className="mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-md text-center">
                                  Payment Overdue
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Payment Form Panel */}
                  <div className="bg-white">
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                        Payment Details
                      </h4>
                      
                      {selectedMember ? (
                        <div className="space-y-6">
                          {/* Member Info Card */}
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {selectedMember.name.charAt(0)}
                              </div>
                              <div>
                                <h5 className="text-xl font-bold text-gray-900">{selectedMember.name}</h5>
                                <p className="text-blue-600 font-medium">{selectedMember.membershipType} Member</p>
                                <p className="text-sm text-gray-600">{selectedMember.email}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                              {(() => {
                                const paymentInfo = getMemberPaymentInfo(selectedMember);
                                return (
                                  <>
                                    <div className="bg-white p-3 rounded-lg">
                                      <p className="text-xs text-gray-500 mb-1">Due Amount</p>
                                      <p className="text-lg font-bold text-gray-900">₹{paymentInfo.dueAmount.toFixed(0)}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                      <p className="text-xs text-gray-500 mb-1">Next Due Date</p>
                                      <p className={`text-sm font-semibold ${paymentInfo.isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                                        {paymentInfo.nextPaymentDate.toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                      <p className="text-xs text-gray-500 mb-1">Status</p>
                                      <p className={`text-sm font-semibold ${paymentInfo.isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                                        {paymentInfo.isOverdue ? 'Overdue' : 'Current'}
                                      </p>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                          
                          {/* Payment Form */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
                              <input
                                type="number"
                                value={newPayment.amount}
                                onChange={(e) => setNewPayment({...newPayment, amount: parseFloat(e.target.value)})}
                                className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter amount"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                              <input
                                type="text"
                                value={newPayment.description}
                                onChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Payment description"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status</label>
                              <select
                                value={newPayment.status}
                                onChange={(e) => setNewPayment({...newPayment, status: e.target.value as 'Completed' | 'Pending' | 'Failed'})}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="Completed">✅ Completed</option>
                                <option value="Pending">⏳ Pending</option>
                                <option value="Failed">❌ Failed</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                          <h5 className="text-lg font-medium text-gray-500 mb-2">No Member Selected</h5>
                          <p className="text-gray-400">Please select a member from the left panel to proceed with payment</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {setShowPaymentModal(false); setSelectedMember(null);}}
                    className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPayment}
                    disabled={!selectedMember}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
                  >
                    Add Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;