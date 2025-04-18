
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarIcon, 
  ClockIcon, 
  UsersIcon, 
  BookIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon
} from "lucide-react";
import { 
  users, 
  getUsersByRole, 
  getClassesByTeacher, 
  getClassesByStudent,
  calculateAttendancePercentage,
  classes,
  attendanceRecords
} from "@/data/mockData";
import { Class, User } from "@/types";

// Stat card component
const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  colorClass 
}: { 
  title: string; 
  value: string | number; 
  description?: string; 
  icon: React.ReactNode;
  colorClass: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`rounded-full p-2 ${colorClass}`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

// Admin Dashboard Component
const AdminDashboard = () => {
  const studentCount = getUsersByRole("student").length;
  const teacherCount = getUsersByRole("teacher").length;
  const classCount = classes.length;
  
  // Calculate overall attendance
  const totalAttendances = attendanceRecords.reduce(
    (acc, record) => acc + record.attendees.length,
    0
  );
  
  const presentAttendances = attendanceRecords.reduce(
    (acc, record) => 
      acc + record.attendees.filter(a => 
        a.status === "present" || a.status === "late"
      ).length,
    0
  );
  
  const attendanceRate = totalAttendances > 0 
    ? Math.round((presentAttendances / totalAttendances) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={studentCount}
          description="Active students in the system"
          icon={<UsersIcon className="h-4 w-4 text-white" />}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Total Teachers"
          value={teacherCount}
          description="Faculty members"
          icon={<UsersIcon className="h-4 w-4 text-white" />}
          colorClass="bg-green-500"
        />
        <StatCard
          title="Total Classes"
          value={classCount}
          description="Active courses"
          icon={<BookIcon className="h-4 w-4 text-white" />}
          colorClass="bg-purple-500"
        />
        <StatCard
          title="Overall Attendance"
          value={`${attendanceRate}%`}
          description="Average across all classes"
          icon={<CalendarIcon className="h-4 w-4 text-white" />}
          colorClass="bg-orange-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceRecords.slice(0, 5).map((record) => {
                const classInfo = classes.find(c => c.id === record.classId);
                return (
                  <div key={record.id} className="flex items-center">
                    <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{classInfo?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()} | {record.attendees.length} students
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Class Distribution</CardTitle>
            <CardDescription>Students per department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.map((cls) => (
                <div key={cls.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{cls.name}</p>
                    <p className="text-sm text-muted-foreground">{cls.students.length} students</p>
                  </div>
                  <Progress value={cls.students.length * 20} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Teacher Dashboard Component
const TeacherDashboard = ({ teacherId }: { teacherId: string }) => {
  const teacherClasses = getClassesByTeacher(teacherId);
  const totalStudents = new Set(
    teacherClasses.flatMap(cls => cls.students)
  ).size;
  
  const classAttendance = teacherClasses.map(cls => {
    const records = attendanceRecords.filter(rec => rec.classId === cls.id);
    const totalAttendances = records.reduce(
      (acc, record) => acc + record.attendees.length,
      0
    );
    const presentAttendances = records.reduce(
      (acc, record) => 
        acc + record.attendees.filter(a => 
          a.status === "present" || a.status === "late"
        ).length,
      0
    );
    
    return {
      id: cls.id,
      name: cls.name,
      rate: totalAttendances > 0 
        ? Math.round((presentAttendances / totalAttendances) * 100) 
        : 0
    };
  });
  
  // Today's classes
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = teacherClasses.filter(cls => 
    cls.schedule.some(sch => sch.day === today)
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Classes"
          value={teacherClasses.length}
          description="Classes you're teaching"
          icon={<BookIcon className="h-4 w-4 text-white" />}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="My Students"
          value={totalStudents}
          description="Students in your classes"
          icon={<UsersIcon className="h-4 w-4 text-white" />}
          colorClass="bg-green-500"
        />
        <StatCard
          title="Today's Classes"
          value={todayClasses.length}
          description={today}
          icon={<ClockIcon className="h-4 w-4 text-white" />}
          colorClass="bg-purple-500"
        />
        <StatCard
          title="Average Attendance"
          value={`${classAttendance.reduce((sum, cls) => sum + cls.rate, 0) / classAttendance.length || 0}%`}
          description="Across all your classes"
          icon={<CalendarIcon className="h-4 w-4 text-white" />}
          colorClass="bg-orange-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>{today}'s classes</CardDescription>
          </CardHeader>
          <CardContent>
            {todayClasses.length > 0 ? (
              <div className="space-y-4">
                {todayClasses.map((cls) => {
                  const schedule = cls.schedule.find(sch => sch.day === today);
                  return (
                    <div key={cls.id} className="flex items-center">
                      <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <ClockIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{cls.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {schedule?.startTime} - {schedule?.endTime} | {cls.students.length} students
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No classes scheduled for today.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Class attendance rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classAttendance.map((cls) => (
                <div key={cls.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{cls.name}</p>
                    <p className="text-sm text-muted-foreground">{cls.rate}%</p>
                  </div>
                  <Progress value={cls.rate} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Student Dashboard Component
const StudentDashboard = ({ studentId }: { studentId: string }) => {
  const studentClasses = getClassesByStudent(studentId);
  
  const classAttendance = studentClasses.map(cls => {
    const percentage = calculateAttendancePercentage(studentId, cls.id);
    return {
      id: cls.id,
      name: cls.name,
      rate: percentage
    };
  });
  
  // Calculate overall attendance
  const overallAttendance = classAttendance.reduce(
    (sum, cls) => sum + cls.rate, 
    0
  ) / classAttendance.length || 0;
  
  // Today's classes
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = studentClasses.filter(cls => 
    cls.schedule.some(sch => sch.day === today)
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Classes"
          value={studentClasses.length}
          description="Classes you're enrolled in"
          icon={<BookIcon className="h-4 w-4 text-white" />}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Today's Classes"
          value={todayClasses.length}
          description={today}
          icon={<ClockIcon className="h-4 w-4 text-white" />}
          colorClass="bg-purple-500"
        />
        <StatCard
          title="Overall Attendance"
          value={`${Math.round(overallAttendance)}%`}
          description="Your attendance rate"
          icon={<CalendarIcon className="h-4 w-4 text-white" />}
          colorClass="bg-green-500"
        />
        <StatCard
          title="Attendance Status"
          value={overallAttendance >= 75 ? "Good" : "At Risk"}
          description={overallAttendance >= 75 ? "Keep it up!" : "Needs improvement"}
          icon={
            overallAttendance >= 75 
              ? <CheckCircleIcon className="h-4 w-4 text-white" />
              : <XCircleIcon className="h-4 w-4 text-white" />
          }
          colorClass={overallAttendance >= 75 ? "bg-green-500" : "bg-red-500"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Attendance</CardTitle>
          <CardDescription>Class-wise attendance percentages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classAttendance.map((cls) => (
              <div key={cls.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{cls.name}</p>
                  <div className="flex items-center">
                    {cls.rate >= 75 ? (
                      <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                    ) : cls.rate >= 60 ? (
                      <AlertCircleIcon className="h-4 w-4 mr-2 text-yellow-500" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 mr-2 text-red-500" />
                    )}
                    <p className="text-sm text-muted-foreground">{Math.round(cls.rate)}%</p>
                  </div>
                </div>
                <Progress 
                  value={cls.rate} 
                  className={`h-2 ${
                    cls.rate >= 75 
                      ? "bg-green-100" 
                      : cls.rate >= 60 
                        ? "bg-yellow-100" 
                        : "bg-red-100"
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>{today}'s classes</CardDescription>
        </CardHeader>
        <CardContent>
          {todayClasses.length > 0 ? (
            <div className="space-y-4">
              {todayClasses.map((cls) => {
                const schedule = cls.schedule.find(sch => sch.day === today);
                const teacher = users.find(user => user.id === cls.teacherId);
                return (
                  <div key={cls.id} className="flex items-center">
                    <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <ClockIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{cls.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {schedule?.startTime} - {schedule?.endTime} | Prof. {teacher?.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No classes scheduled for today.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  
  if (!currentUser) return null;

  const renderDashboard = () => {
    switch (currentUser.role) {
      case "admin":
      case "management":
        return <AdminDashboard />;
      case "teacher":
        return <TeacherDashboard teacherId={currentUser.id} />;
      case "student":
        return <StudentDashboard studentId={currentUser.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {currentUser.name}!
        </p>
      </div>
      {renderDashboard()}
    </div>
  );
}
