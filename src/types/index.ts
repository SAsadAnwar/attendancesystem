
// Define types for our application

export type UserRole = 'admin' | 'management' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string; // In a real application, this would be hashed
  department?: string;
  studentId?: string;
  teacherId?: string;
  profileImage?: string;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  students: string[]; // User IDs of enrolled students
  department: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;
  attendees: {
    studentId: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
  }[];
}

export interface Department {
  id: string;
  name: string;
  head: string; // User ID of department head
}
