import { AttendanceRecord, Member, AttendanceAlert } from '../types';

// QR Code generation utility
export const generateMemberQR = (memberId: string): string => {
  return `GYM_MEMBER_${memberId}_${Date.now()}`;
};

// Check if member has irregular attendance
export const checkIrregularAttendance = (
  memberId: string, 
  attendanceRecords: AttendanceRecord[]
): boolean => {
  const memberRecords = attendanceRecords
    .filter(record => record.memberId === memberId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10); // Last 10 records

  if (memberRecords.length < 5) return false;

  // Check for irregular patterns (missing more than 2 days in a week)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const attendedDays = memberRecords.filter(record => 
    last7Days.includes(record.date)
  ).length;

  return attendedDays < 3;
};

// Check for long absence
export const checkLongAbsence = (
  memberId: string, 
  attendanceRecords: AttendanceRecord[]
): number => {
  const memberRecords = attendanceRecords
    .filter(record => record.memberId === memberId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (memberRecords.length === 0) return 999; // Never attended

  const lastAttendance = new Date(memberRecords[0].date);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastAttendance.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

// Generate attendance alerts
export const generateAttendanceAlerts = (
  members: Member[], 
  attendanceRecords: AttendanceRecord[]
): AttendanceAlert[] => {
  const alerts: AttendanceAlert[] = [];

  members.forEach(member => {
    // Check for long absence
    const daysSinceLastVisit = checkLongAbsence(member.id, attendanceRecords);
    if (daysSinceLastVisit >= 7) {
      alerts.push({
        id: `absence_${member.id}_${Date.now()}`,
        memberId: member.id,
        memberName: member.name,
        type: 'Long Absence',
        message: `Member has not checked in for ${daysSinceLastVisit} days`,
        createdAt: new Date().toISOString(),
        isRead: false
      });
    }

    // Check for irregular attendance
    if (checkIrregularAttendance(member.id, attendanceRecords)) {
      alerts.push({
        id: `irregular_${member.id}_${Date.now()}`,
        memberId: member.id,
        memberName: member.name,
        type: 'Irregular',
        message: 'Member has irregular attendance pattern',
        createdAt: new Date().toISOString(),
        isRead: false
      });
    }
  });

  return alerts;
};

// Calculate attendance statistics
export const calculateAttendanceStats = (
  memberId: string,
  attendanceRecords: AttendanceRecord[]
): {
  totalVisits: number;
  averageDuration: number;
  lastVisit: string | null;
  weeklyAverage: number;
} => {
  const memberRecords = attendanceRecords.filter(record => record.memberId === memberId);
  
  const totalVisits = memberRecords.length;
  const completedSessions = memberRecords.filter(record => record.duration);
  const averageDuration = completedSessions.length > 0
    ? completedSessions.reduce((sum, record) => sum + (record.duration || 0), 0) / completedSessions.length
    : 0;

  const lastVisit = memberRecords.length > 0 
    ? memberRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
    : null;

  // Calculate weekly average (last 4 weeks)
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  
  const recentVisits = memberRecords.filter(record => 
    new Date(record.date) >= fourWeeksAgo
  ).length;
  
  const weeklyAverage = recentVisits / 4;

  return {
    totalVisits,
    averageDuration: Math.round(averageDuration),
    lastVisit,
    weeklyAverage: Math.round(weeklyAverage * 10) / 10
  };
};

// Export attendance data to CSV
export const exportAttendanceToCSV = (attendanceRecords: AttendanceRecord[]): string => {
  const headers = ['Date', 'Member Name', 'Check In', 'Check Out', 'Duration (min)', 'Method'];
  const csvContent = [
    headers.join(','),
    ...attendanceRecords.map(record => [
      record.date,
      record.memberName,
      record.checkInTime,
      record.checkOutTime || 'N/A',
      record.duration?.toString() || 'N/A',
      record.method
    ].join(','))
  ].join('\n');

  return csvContent;
};
