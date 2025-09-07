import React, { useState, useEffect } from 'react';
import { AttendanceRecord, Member, StaffAttendance, AttendanceAlert } from '../types';
import { Clock, Users, AlertTriangle, CheckCircle, User, Search, Filter, Download, QrCode } from 'lucide-react';
import QRScanner from './QRScanner';
import { generateAttendanceAlerts, calculateAttendanceStats, exportAttendanceToCSV } from '../utils/attendanceUtils';

const Attendance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checkin' | 'members' | 'staff' | 'alerts' | 'qr'>('checkin');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkInMethod, setCheckInMethod] = useState<'Manual' | 'QR Code' | 'Biometric'>('Manual');

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

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      memberId: '1',
      memberName: 'John Doe',
      checkInTime: '08:30',
      checkOutTime: '10:00',
      date: '2024-12-01',
      method: 'QR Code',
      duration: 90
    },
    {
      id: '2',
      memberId: '2',
      memberName: 'Jane Smith',
      checkInTime: '09:15',
      date: '2024-12-01',
      method: 'Manual'
    }
  ]);

  const [staffAttendance] = useState<StaffAttendance[]>([
    {
      id: '1',
      staffId: 'T001',
      staffName: 'Mike Wilson',
      staffType: 'Trainer',
      checkInTime: '07:00',
      checkOutTime: '19:00',
      date: '2024-12-01',
      hoursWorked: 12
    },
    {
      id: '2',
      staffId: 'R001',
      staffName: 'Sarah Johnson',
      staffType: 'Reception',
      checkInTime: '08:00',
      date: '2024-12-01'
    }
  ]);

  const [alerts, setAlerts] = useState<AttendanceAlert[]>([
    {
      id: '1',
      memberId: '3',
      memberName: 'Bob Brown',
      type: 'Long Absence',
      message: 'Member has not checked in for 10 days',
      createdAt: '2024-12-01T10:00:00Z',
      isRead: false
    },
    {
      id: '2',
      memberId: '4',
      memberName: 'Alice Green',
      type: 'Irregular',
      message: 'Member has irregular attendance pattern',
      createdAt: '2024-12-01T09:30:00Z',
      isRead: false
    }
  ]);

  const handleQRScan = (memberId: string) => {
    handleCheckIn(memberId, 'QR Code');
  };

  const exportTodayAttendance = () => {
    const csvContent = exportAttendanceToCSV(todayAttendance);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate alerts for demo
  useEffect(() => {
    const newAlerts = generateAttendanceAlerts(members, attendanceRecords);
    if (newAlerts.length > alerts.length) {
      setAlerts(newAlerts);
    }
  }, [attendanceRecords, members, alerts.length]);

  const handleCheckIn = (memberId: string, method: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        memberId,
        memberName: member.name,
        checkInTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        method: method as 'Manual' | 'QR Code' | 'Biometric'
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }
  };

  const handleCheckOut = (recordId: string) => {
    setAttendanceRecords(prev => prev.map(record => 
      record.id === recordId 
        ? {
            ...record,
            checkOutTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            duration: Math.floor((Date.now() - new Date(`${record.date} ${record.checkInTime}`).getTime()) / (1000 * 60))
          }
        : record
    ));
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayAttendance = attendanceRecords.filter(record => record.date === selectedDate);
  const activeCheckIns = todayAttendance.filter(record => !record.checkOutTime);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Tracking</h1>
        <p className="text-gray-600">Monitor member and staff attendance with real-time tracking</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {[
            { id: 'checkin', name: 'Check-in/out', icon: Clock },
            { id: 'qr', name: 'QR Scanner', icon: QrCode },
            { id: 'members', name: 'Member Attendance', icon: Users },
            { id: 'staff', name: 'Staff Attendance', icon: User },
            { id: 'alerts', name: 'Alerts', icon: AlertTriangle }
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

      {/* Check-in/out Tab */}
      {activeTab === 'checkin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Check-in</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Method</label>
              <div className="flex space-x-4">
                {['Manual', 'QR Code', 'Biometric'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setCheckInMethod(method as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      checkInMethod === method
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Member</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.membershipType}</p>
                  </div>
                  <button
                    onClick={() => handleCheckIn(member.id, checkInMethod)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    Check In
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Active Check-ins</h2>
            <div className="space-y-3">
              {activeCheckIns.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div>
                    <p className="font-medium">{record.memberName}</p>
                    <p className="text-sm text-gray-600">Checked in at {record.checkInTime}</p>
                    <p className="text-xs text-gray-500">{record.method}</p>
                  </div>
                  <button
                    onClick={() => handleCheckOut(record.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    Check Out
                  </button>
                </div>
              ))}
            </div>

            {activeCheckIns.length === 0 && (
              <p className="text-gray-500 text-center py-8">No active check-ins</p>
            )}
          </div>
        </div>
      )}

      {/* QR Scanner Tab */}
      {activeTab === 'qr' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QRScanner onScan={handleQRScan} />
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recent QR Check-ins</h3>
            <div className="space-y-3">
              {attendanceRecords
                .filter(record => record.method === 'QR Code')
                .slice(0, 10)
                .map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div>
                      <p className="font-medium">{record.memberName}</p>
                      <p className="text-sm text-gray-600">{record.date} at {record.checkInTime}</p>
                      {record.checkOutTime && (
                        <p className="text-xs text-gray-500">Duration: {record.duration} min</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        QR Code
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Member Attendance Tab */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold">Member Attendance Log</h2>
              <div className="mt-4 sm:mt-0 flex space-x-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={exportTodayAttendance}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todayAttendance.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.memberName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkInTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.checkOutTime || <span className="text-yellow-600">Active</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.duration ? `${record.duration} min` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        record.method === 'QR Code' ? 'bg-blue-100 text-blue-800' :
                        record.method === 'Biometric' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Attendance Tab */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Staff Attendance</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours Worked</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffAttendance.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.staffName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        record.staffType === 'Trainer' ? 'bg-blue-100 text-blue-800' :
                        record.staffType === 'Admin' ? 'bg-purple-100 text-purple-800' :
                        record.staffType === 'Reception' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.staffType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkInTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.checkOutTime || <span className="text-green-600">On duty</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.hoursWorked ? `${record.hoursWorked}h` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Attendance Alerts</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-md border-l-4 ${
                  alert.type === 'Long Absence' ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'
                } ${alert.isRead ? 'opacity-60' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className={`w-5 h-5 mr-3 ${
                        alert.type === 'Long Absence' ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{alert.memberName}</h3>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!alert.isRead && (
                      <button
                        onClick={() => markAlertAsRead(alert.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center space-x-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Read</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {alerts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500">No alerts at the moment</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
