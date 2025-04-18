
import { User, Class, AttendanceRecord, Department } from "@/types";

// Mock users data
export const users: User[] = [
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    password: "admin123",
    profileImage: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
  },
  {
    id: "mgmt1",
    name: "Management User",
    email: "management@example.com",
    role: "management",
    password: "mgmt123",
    department: "dept1",
    profileImage: "https://ui-avatars.com/api/?name=Management+User&background=16A085&color=fff"
  },
  {
    id: "teacher1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "teacher",
    password: "teacher123",
    teacherId: "TCH001",
    department: "dept1",
    profileImage: "https://ui-avatars.com/api/?name=John+Smith&background=3498DB&color=fff"
  },
  {
    id: "teacher2",
    name: "Emma Davis",
    email: "emma.davis@example.com",
    role: "teacher",
    password: "teacher123",
    teacherId: "TCH002",
    department: "dept2",
    profileImage: "https://ui-avatars.com/api/?name=Emma+Davis&background=3498DB&color=fff"
  },
  {
    id: "student1",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    role: "student",
    password: "student123",
    studentId: "STU001",
    department: "dept1",
    profileImage: "https://ui-avatars.com/api/?name=Alice+Johnson&background=9B59B6&color=fff"
  },
  {
    id: "student2",
    name: "Bob Williams",
    email: "bob.w@example.com",
    role: "student",
    password: "student123",
    studentId: "STU002",
    department: "dept1",
    profileImage: "https://ui-avatars.com/api/?name=Bob+Williams&background=9B59B6&color=fff"
  },
  {
    id: "student3",
    name: "Charlie Brown",
    email: "charlie.b@example.com",
    role: "student",
    password: "student123",
    studentId: "STU003",
    department: "dept2",
    profileImage: "https://ui-avatars.com/api/?name=Charlie+Brown&background=9B59B6&color=fff"
  }
];

// Mock departments data
export const departments: Department[] = [
  {
    id: "dept1",
    name: "Computer Science",
    head: "teacher1"
  },
  {
    id: "dept2",
    name: "Electrical Engineering",
    head: "teacher2"
  }
];

// Mock classes data
export const classes: Class[] = [
  {
    id: "class1",
    name: "Introduction to Programming",
    teacherId: "teacher1",
    schedule: [
      { day: "Monday", startTime: "09:00", endTime: "11:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "11:00" }
    ],
    students: ["student1", "student2"],
    department: "dept1"
  },
  {
    id: "class2",
    name: "Data Structures",
    teacherId: "teacher1",
    schedule: [
      { day: "Tuesday", startTime: "13:00", endTime: "15:00" },
      { day: "Thursday", startTime: "13:00", endTime: "15:00" }
    ],
    students: ["student1", "student3"],
    department: "dept1"
  },
  {
    id: "class3",
    name: "Circuit Theory",
    teacherId: "teacher2",
    schedule: [
      { day: "Monday", startTime: "14:00", endTime: "16:00" },
      { day: "Friday", startTime: "14:00", endTime: "16:00" }
    ],
    students: ["student2", "student3"],
    department: "dept2"
  }
];

// Mock attendance records
export const attendanceRecords: AttendanceRecord[] = [
  {
    id: "att1",
    classId: "class1",
    date: "2023-04-10",
    attendees: [
      { studentId: "student1", status: "present" },
      { studentId: "student2", status: "present" }
    ]
  },
  {
    id: "att2",
    classId: "class1",
    date: "2023-04-12",
    attendees: [
      { studentId: "student1", status: "present" },
      { studentId: "student2", status: "absent", remarks: "Sick leave" }
    ]
  },
  {
    id: "att3",
    classId: "class2",
    date: "2023-04-11",
    attendees: [
      { studentId: "student1", status: "late", remarks: "10 minutes late" },
      { studentId: "student3", status: "present" }
    ]
  },
  {
    id: "att4",
    classId: "class3",
    date: "2023-04-10",
    attendees: [
      { studentId: "student2", status: "present" },
      { studentId: "student3", status: "present" }
    ]
  }
];

// Helper function to get user by role
export const getUsersByRole = (role: string): User[] => {
  return users.filter(user => user.role === role);
};

// Helper function to get classes by teacher
export const getClassesByTeacher = (teacherId: string): Class[] => {
  return classes.filter(cls => cls.teacherId === teacherId);
};

// Helper function to get classes by student
export const getClassesByStudent = (studentId: string): Class[] => {
  return classes.filter(cls => cls.students.includes(studentId));
};

// Helper function to get attendance for a class
export const getAttendanceByClass = (classId: string): AttendanceRecord[] => {
  return attendanceRecords.filter(record => record.classId === classId);
};

// Helper function to get attendance for a student
export const getAttendanceByStudent = (studentId: string): {classId: string, records: AttendanceRecord[]}[] => {
  const studentClasses = getClassesByStudent(studentId);
  
  return studentClasses.map(cls => ({
    classId: cls.id,
    records: attendanceRecords.filter(record => 
      record.classId === cls.id && 
      record.attendees.some(att => att.studentId === studentId)
    )
  }));
};

// Helper function to calculate attendance percentage
export const calculateAttendancePercentage = (studentId: string, classId: string): number => {
  const records = attendanceRecords.filter(record => record.classId === classId);
  if (records.length === 0) return 0;
  
  const totalClasses = records.length;
  const presentCount = records.filter(record => 
    record.attendees.some(att => 
      att.studentId === studentId && 
      (att.status === "present" || att.status === "late")
    )
  ).length;
  
  return (presentCount / totalClasses) * 100;
};
