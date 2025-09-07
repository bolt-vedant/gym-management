import React, { useState } from 'react';
import { Notification, NotificationTemplate, Member, Trainer } from '../types';
import { 
  Bell, Send, Settings, Plus, Edit, Trash2, 
  Eye, Filter, Search, Mail, MessageSquare, Smartphone,
  AlertCircle, CheckCircle, Clock, X
} from 'lucide-react';

const NotificationSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'templates' | 'send'>('notifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

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

  const [trainers] = useState<Trainer[]>([
    {
      id: '1',
      name: 'Mike Wilson',
      specialization: 'Strength Training',
      email: 'mike@gym.com',
      phone: '+1-555-0200',
      status: 'Active',
      experience: '5 years'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'Payment Due',
      recipientId: '1',
      recipientName: 'John Doe',
      recipientType: 'Member',
      title: 'Payment Reminder',
      message: 'Your monthly membership payment of ₹2999 is due in 3 days.',
      priority: 'High',
      channels: ['Email', 'SMS'],
      status: 'Sent',
      scheduledFor: '2024-12-01T09:00:00Z',
      sentAt: '2024-12-01T09:00:00Z',
      createdAt: '2024-11-28T10:00:00Z',
      createdBy: 'System'
    },
    {
      id: '2',
      type: 'Class Booking',
      recipientId: '2',
      recipientName: 'Jane Smith',
      recipientType: 'Member',
      title: 'Class Confirmation',
      message: 'Your booking for Morning Yoga on Dec 2nd has been confirmed.',
      priority: 'Medium',
      channels: ['Email', 'Push'],
      status: 'Delivered',
      scheduledFor: '2024-12-01T08:00:00Z',
      sentAt: '2024-12-01T08:00:00Z',
      createdAt: '2024-11-30T14:00:00Z',
      createdBy: 'Admin'
    },
    {
      id: '3',
      type: 'Attendance Issue',
      recipientId: '1',
      recipientName: 'John Doe',
      recipientType: 'Member',
      title: 'We Miss You!',
      message: 'We noticed you haven\'t visited the gym in a while. Come back and continue your fitness journey!',
      priority: 'Low',
      channels: ['Email'],
      status: 'Pending',
      scheduledFor: '2024-12-05T10:00:00Z',
      createdAt: '2024-12-01T12:00:00Z',
      createdBy: 'System'
    }
  ]);

  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Payment Reminder',
      type: 'Payment Due',
      subject: 'Payment Reminder - {membershipType} Membership',
      message: 'Hi {memberName}, your {membershipType} membership payment of ₹{amount} is due on {dueDate}. Please complete your payment to avoid service interruption.',
      channels: ['Email', 'SMS'],
      variables: ['memberName', 'membershipType', 'amount', 'dueDate'],
      isActive: true,
      createdAt: '2024-11-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'Class Booking Confirmation',
      type: 'Class Booking',
      subject: 'Class Booking Confirmed - {className}',
      message: 'Dear {memberName}, your booking for {className} on {classDate} at {classTime} has been confirmed. See you there!',
      channels: ['Email', 'Push'],
      variables: ['memberName', 'className', 'classDate', 'classTime'],
      isActive: true,
      createdAt: '2024-11-01T10:00:00Z'
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    type: 'Custom',
    recipientType: 'Member' as 'Member' | 'Staff',
    recipientId: '',
    title: '',
    message: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Urgent',
    channels: [] as ('Email' | 'SMS' | 'Push')[],
    scheduledFor: ''
  });

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || notification.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSendNotification = () => {
    const recipient = newNotification.recipientType === 'Member' 
      ? members.find(m => m.id === newNotification.recipientId)
      : trainers.find(t => t.id === newNotification.recipientId);

    if (recipient) {
      const notification: Notification = {
        id: Date.now().toString(),
        type: newNotification.type as any,
        recipientId: newNotification.recipientId,
        recipientName: recipient.name,
        recipientType: newNotification.recipientType,
        title: newNotification.title,
        message: newNotification.message,
        priority: newNotification.priority,
        channels: newNotification.channels,
        status: 'Pending',
        scheduledFor: newNotification.scheduledFor || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        createdBy: 'Admin'
      };

      setNotifications([notification, ...notifications]);
      setNewNotification({
        type: 'Custom',
        recipientType: 'Member',
        recipientId: '',
        title: '',
        message: '',
        priority: 'Medium',
        channels: [],
        scheduledFor: ''
      });
      setShowCreateModal(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-700 bg-red-100';
      case 'High': return 'text-orange-700 bg-orange-100';
      case 'Medium': return 'text-yellow-700 bg-yellow-100';
      case 'Low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Sent': return <Send className="w-4 h-4 text-blue-500" />;
      case 'Delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Pending': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification & Reminder System</h1>
        <p className="text-gray-600">Send and manage notifications to members and staff</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {[
            { id: 'notifications', name: 'Notifications', icon: Bell },
            { id: 'templates', name: 'Templates', icon: Settings },
            { id: 'send', name: 'Send New', icon: Send }
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

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="Payment Due">Payment Due</option>
                  <option value="Class Booking">Class Booking</option>
                  <option value="Attendance Issue">Attendance Issue</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Apply Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Recent Notifications</h2>
            </div>
            
            <div className="p-6">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div key={notification.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getStatusIcon(notification.status)}
                            <h3 className="font-semibold">{notification.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {notification.type}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                            <div>
                              <span className="font-medium">Recipient:</span> {notification.recipientName} ({notification.recipientType})
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">Channels:</span>
                              <div className="flex space-x-1">
                                {notification.channels.includes('Email') && <Mail className="w-4 h-4" />}
                                {notification.channels.includes('SMS') && <MessageSquare className="w-4 h-4" />}
                                {notification.channels.includes('Push') && <Smartphone className="w-4 h-4" />}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Scheduled:</span> {new Date(notification.scheduledFor || '').toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => setSelectedNotification(notification)}
                            className="p-2 text-gray-400 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                  <p className="text-gray-500">No notifications match your current filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Notification Templates</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Template</span>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {template.type}
                        </span>
                        {template.isActive && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Active
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Subject:</span> {template.subject}
                      </p>
                      <p className="text-gray-600 mb-3">{template.message}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">Channels:</span>
                          <div className="flex space-x-1">
                            {template.channels.includes('Email') && <Mail className="w-4 h-4" />}
                            {template.channels.includes('SMS') && <MessageSquare className="w-4 h-4" />}
                            {template.channels.includes('Push') && <Smartphone className="w-4 h-4" />}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Variables:</span> {template.variables.join(', ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Send New Tab */}
      {activeTab === 'send' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Send New Notification</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Custom">Custom</option>
                  <option value="Payment Due">Payment Due</option>
                  <option value="Class Booking">Class Booking</option>
                  <option value="Attendance Issue">Attendance Issue</option>
                  <option value="Diet Update">Diet Update</option>
                  <option value="Workout Update">Workout Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Type</label>
                <select
                  value={newNotification.recipientType}
                  onChange={(e) => setNewNotification({...newNotification, recipientType: e.target.value as 'Member' | 'Staff', recipientId: ''})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Member">Member</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
                <select
                  value={newNotification.recipientId}
                  onChange={(e) => setNewNotification({...newNotification, recipientId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select recipient...</option>
                  {(newNotification.recipientType === 'Member' ? members : trainers).map((person) => (
                    <option key={person.id} value={person.id}>{person.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newNotification.priority}
                  onChange={(e) => setNewNotification({...newNotification, priority: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Channels</label>
                <div className="space-y-2">
                  {(['Email', 'SMS', 'Push'] as const).map((channel) => (
                    <label key={channel} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newNotification.channels.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewNotification({
                              ...newNotification, 
                              channels: [...newNotification.channels, channel]
                            });
                          } else {
                            setNewNotification({
                              ...newNotification, 
                              channels: newNotification.channels.filter(c => c !== channel)
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notification title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notification message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule For (Optional)</label>
                <input
                  type="datetime-local"
                  value={newNotification.scheduledFor}
                  onChange={(e) => setNewNotification({...newNotification, scheduledFor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleSendNotification}
                  disabled={!newNotification.recipientId || !newNotification.title || !newNotification.message || newNotification.channels.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Notification</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Notification Details</h3>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2">{selectedNotification.type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="ml-2">{selectedNotification.status}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Priority:</span>
                    <span className="ml-2">{selectedNotification.priority}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Recipient:</span>
                    <span className="ml-2">{selectedNotification.recipientName}</span>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Title:</span>
                  <p className="mt-1">{selectedNotification.title}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Message:</span>
                  <p className="mt-1">{selectedNotification.message}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Channels:</span>
                  <div className="flex space-x-2 mt-1">
                    {selectedNotification.channels.map((channel) => (
                      <span key={channel} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Created:</span>
                    <p>{new Date(selectedNotification.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Scheduled:</span>
                    <p>{new Date(selectedNotification.scheduledFor || '').toLocaleString()}</p>
                  </div>
                </div>
                
                {selectedNotification.sentAt && (
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Sent:</span>
                    <span className="ml-2">{new Date(selectedNotification.sentAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
