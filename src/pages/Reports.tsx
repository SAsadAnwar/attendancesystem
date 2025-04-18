
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Download, BarChart, PieChart, Calendar as CalendarIcon, Users } from "lucide-react";
import { 
  classes, 
  getClassesByTeacher, 
  getClassesByStudent, 
  users, 
  attendanceRecords, 
  departments,
  calculateAttendancePercentage 
} from "@/data/mockData";

export default function Reports() {
  const { currentUser } = useAuth();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("month");
  
  // Get accessible classes based on user role
  const accessibleClasses = currentUser?.role === "student"
    ? getClassesByStudent(currentUser.id)
    : currentUser?.role === "teacher"
      ? getClassesByTeacher(currentUser.id)
      : classes;
  
  // Set default class if none selected
  if (accessibleClasses.length > 0 && !selectedClass) {
    setSelectedClass(accessibleClasses[0].id);
  }

  // Get class details
  const classDetails = classes.find(c => c.id === selectedClass);
  
  // Calculate statistics based on role
  const renderStudentReports = () => {
    if (!selectedClass) return null;
    
    const percentage = calculateAttendancePercentage(currentUser?.id || "", selectedClass);
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Attendance Overview</CardTitle>
            <CardDescription>
              Detailed breakdown of your attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-medium mb-2">Overall Attendance</h4>
                <div className="flex items-center justify-between mb-2">
                  <span>{Math.round(percentage)}%</span>
                  <span className={`text-xs ${
                    percentage >= 75 ? "text-green-500" : "text-red-500"
                  }`}>
                    {percentage >= 75 ? "Good Standing" : "Requires Improvement"}
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-600 mb-1">Present</h4>
                  <p className="text-2xl font-bold text-green-700">
                    {attendanceRecords
                      .filter(r => r.classId === selectedClass)
                      .filter(r => r.attendees.some(a => 
                        a.studentId === currentUser?.id && a.status === "present"
                      ))
                      .length}
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-yellow-600 mb-1">Late</h4>
                  <p className="text-2xl font-bold text-yellow-700">
                    {attendanceRecords
                      .filter(r => r.classId === selectedClass)
                      .filter(r => r.attendees.some(a => 
                        a.studentId === currentUser?.id && a.status === "late"
                      ))
                      .length}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-600 mb-1">Absent</h4>
                  <p className="text-2xl font-bold text-red-700">
                    {attendanceRecords
                      .filter(r => r.classId === selectedClass)
                      .filter(r => r.attendees.some(a => 
                        a.studentId === currentUser?.id && 
                        (a.status === "absent" || a.status === "excused")
                      ))
                      .length}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-4">Trend Analysis</h4>
                <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Attendance trend chart will be displayed here</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Comparison Report</CardTitle>
                <CardDescription>
                  Your attendance compared to class average
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Comparison chart will be displayed here</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Your Attendance</span>
                  <span className="text-sm">{Math.round(percentage)}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Class Average</span>
                  <span className="text-sm">82%</span>
                </div>
                <Progress value={82} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Department Average</span>
                  <span className="text-sm">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTeacherAdminReports = () => {
    // Teachers can only see reports for their classes, admins see all
    const classes = currentUser?.role === "teacher" 
      ? getClassesByTeacher(currentUser.id)
      : accessibleClasses;

    return (
      <Tabs defaultValue="class" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="class">Class Reports</TabsTrigger>
          <TabsTrigger value="student">Student Reports</TabsTrigger>
          <TabsTrigger value="department">Department Reports</TabsTrigger>
        </TabsList>
        
        <div className="flex gap-4 items-center">
          <div className="w-64">
            <Select
              value={selectedTimeframe}
              onValueChange={setSelectedTimeframe}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="semester">This Semester</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
        
        <TabsContent value="class">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Class Attendance</CardTitle>
                  
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="h-10 w-10 mb-2 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Attendance rate chart will be displayed here</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="space-y-1 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedClass ? Math.round(
                        (attendanceRecords
                          .filter(r => r.classId === selectedClass)
                          .flatMap(r => r.attendees)
                          .filter(a => a.status === "present").length /
                        (attendanceRecords
                          .filter(r => r.classId === selectedClass)
                          .flatMap(r => r.attendees).length || 1)
                        ) * 100
                      ) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Present</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {selectedClass ? Math.round(
                        (attendanceRecords
                          .filter(r => r.classId === selectedClass)
                          .flatMap(r => r.attendees)
                          .filter(a => a.status === "late").length /
                        (attendanceRecords
                          .filter(r => r.classId === selectedClass)
                          .flatMap(r => r.attendees).length || 1)
                        ) * 100
                      ) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Late</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {selectedClass ? Math.round(
                        (attendanceRecords
                          .filter(r => r.classId === selectedClass)
                          .flatMap(r => r.attendees)
                          .filter(a => a.status === "absent" || a.status === "excused").length /
                        (attendanceRecords
                          .filter(r => r.classId === selectedClass)
                          .flatMap(r => r.attendees).length || 1)
                        ) * 100
                      ) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Absent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>
                  Attendance patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <CalendarIcon className="h-10 w-10 mb-2 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Attendance trends over time will be displayed here</p>
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Monday</p>
                      <p className="text-sm">85%</p>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Tuesday</p>
                      <p className="text-sm">92%</p>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Wednesday</p>
                      <p className="text-sm">78%</p>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Thursday</p>
                      <p className="text-sm">88%</p>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Friday</p>
                      <p className="text-sm">72%</p>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="student">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Performance Analysis</CardTitle>
                  <CardDescription>
                    Detailed attendance by student
                  </CardDescription>
                </div>
                
                <Select
                  value={selectedClass}
                  onValueChange={setSelectedClass}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {selectedClass && classDetails ? (
                <div className="space-y-8">
                  <div className="h-[300px] bg-slate-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Users className="h-10 w-10 mb-2 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">Student performance chart will be displayed here</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {classDetails.students.map(studentId => {
                      const student = users.find(u => u.id === studentId);
                      if (!student) return null;
                      
                      const percentage = calculateAttendancePercentage(studentId, selectedClass);
                      
                      return (
                        <div key={studentId} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img
                                  src={student.profileImage || `https://ui-avatars.com/api/?name=${student.name.replace(" ", "+")}`}
                                  alt={student.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{student.name}</p>
                                <p className="text-xs text-muted-foreground">{student.studentId}</p>
                              </div>
                            </div>
                            <p className={`text-sm font-medium ${
                              percentage >= 75 
                                ? "text-green-600" 
                                : percentage >= 60 
                                  ? "text-amber-600" 
                                  : "text-red-600"
                            }`}>
                              {Math.round(percentage)}%
                            </p>
                          </div>
                          <Progress 
                            value={percentage} 
                            className={`h-2 ${
                              percentage >= 75 
                                ? "bg-green-100" 
                                : percentage >= 60 
                                  ? "bg-amber-100" 
                                  : "bg-red-100"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Select a class to view student performance</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="department">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Department Analytics</CardTitle>
                  <CardDescription>
                    Attendance metrics by department
                  </CardDescription>
                </div>
                
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-[300px] bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-10 w-10 mb-2 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Department attendance distribution will be displayed here</p>
                  </div>
                </div>
                
                <div className="h-[300px] bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="h-10 w-10 mb-2 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Department comparison chart will be displayed here</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 mt-6">
                <div className="pb-4 border-b">
                  <h4 className="text-sm font-medium mb-4">Department Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">82%</p>
                      <p className="text-sm text-muted-foreground">Average Attendance</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-sm text-muted-foreground">Classes</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">156</p>
                      <p className="text-sm text-muted-foreground">Students</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-4">Top Performing Classes</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">Data Structures</p>
                        <p className="text-sm">95%</p>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">Introduction to Programming</p>
                        <p className="text-sm">88%</p>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">Circuit Theory</p>
                        <p className="text-sm">84%</p>
                      </div>
                      <Progress value={84} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Analytics and attendance statistics
          </p>
        </div>
      </div>

      {currentUser?.role === "student" ? renderStudentReports() : renderTeacherAdminReports()}
    </div>
  );
}
