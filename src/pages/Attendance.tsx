
import { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar as CalendarIcon, 
  Plus,
  ChevronRight, 
  Download,
  BarChart
} from "lucide-react";
import { 
  classes, 
  getClassesByTeacher, 
  getClassesByStudent, 
  users, 
  attendanceRecords, 
  calculateAttendancePercentage 
} from "@/data/mockData";
import { User, AttendanceRecord, Class } from "@/types";
import { format, parseISO, isToday, isBefore } from "date-fns";

export default function Attendance() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [attendanceData, setAttendanceData] = useState<{
    studentId: string;
    status: "present" | "absent" | "late" | "excused";
    remarks?: string;
  }[]>([]);
  
  // Get accessible classes based on user role
  const accessibleClasses = currentUser?.role === "student"
    ? getClassesByStudent(currentUser.id)
    : currentUser?.role === "teacher"
      ? getClassesByTeacher(currentUser.id)
      : classes;
  
  useEffect(() => {
    if (accessibleClasses.length > 0 && !selectedClass) {
      setSelectedClass(accessibleClasses[0].id);
    }
  }, [accessibleClasses, selectedClass]);

  // Get class details
  const classDetails = classes.find(c => c.id === selectedClass);
  
  // Get existing attendance record for this class and date
  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const existingRecord = attendanceRecords.find(
    r => r.classId === selectedClass && r.date === formattedDate
  );
  
  // Initialize attendance data when class or date changes
  useEffect(() => {
    if (classDetails && selectedDate) {
      if (existingRecord) {
        setAttendanceData(existingRecord.attendees);
      } else {
        // Pre-populate with all students set to absent
        setAttendanceData(
          classDetails.students.map(studentId => ({
            studentId,
            status: "absent"
          }))
        );
      }
    }
  }, [classDetails, selectedDate, existingRecord]);

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    setAttendanceData(prev => 
      prev.map(item => 
        item.studentId === studentId 
          ? { ...item, status } 
          : item
      )
    );
  };

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setAttendanceData(prev => 
      prev.map(item => 
        item.studentId === studentId 
          ? { ...item, remarks } 
          : item
      )
    );
  };

  const handleSaveAttendance = () => {
    // In a real app, this would be an API call
    toast({
      title: "Success",
      description: "Attendance has been recorded successfully",
    });
    setIsMarkingAttendance(false);
  };

  const exportAttendance = () => {
    // This would generate a CSV file in a real app
    toast({
      title: "Export Successful",
      description: "Attendance records have been exported",
    });
  };
  
  // Determine if attendance can be marked (only teachers and admins)
  const canMarkAttendance = ["admin", "management", "teacher"].includes(currentUser?.role || "");
  
  // Determine if today's attendance can be marked
  const canMarkToday = isToday(selectedDate) || currentUser?.role === "admin";

  // Student specific view - get attendance percentage
  const studentAttendancePercentage = 
    currentUser?.role === "student" && selectedClass ? 
    calculateAttendancePercentage(currentUser.id, selectedClass) : 0;

  // Render different views based on user role
  const renderAttendanceView = () => {
    if (currentUser?.role === "student") {
      return renderStudentView();
    } else {
      return renderTeacherAdminView();
    }
  };

  const renderStudentView = () => {
    if (!classDetails) return null;
    
    // Get all attendance records for this class
    const classRecords = attendanceRecords.filter(r => r.classId === selectedClass);
    
    // Get student's attendance in this class
    const studentAttendance = classRecords.map(record => {
      const studentEntry = record.attendees.find(a => a.studentId === currentUser?.id);
      return {
        date: record.date,
        status: studentEntry?.status || "absent",
        remarks: studentEntry?.remarks
      };
    });
    
    // Calculate statistics
    const totalClasses = classRecords.length;
    const presentCount = studentAttendance.filter(a => a.status === "present").length;
    const lateCount = studentAttendance.filter(a => a.status === "late").length;
    const absentCount = studentAttendance.filter(a => a.status === "absent").length;
    const excusedCount = studentAttendance.filter(a => a.status === "excused").length;

    return (
      <>
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Attendance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(studentAttendancePercentage)}%</div>
              <p className="text-xs text-muted-foreground">
                Overall attendance percentage
              </p>
              <Progress 
                value={studentAttendancePercentage} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Present
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{presentCount}</div>
              <p className="text-xs text-muted-foreground">
                {totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0}% of classes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Late
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{lateCount}</div>
              <p className="text-xs text-muted-foreground">
                {totalClasses > 0 ? Math.round((lateCount / totalClasses) * 100) : 0}% of classes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Absent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{absentCount + excusedCount}</div>
              <p className="text-xs text-muted-foreground">
                {totalClasses > 0 ? Math.round(((absentCount + excusedCount) / totalClasses) * 100) : 0}% of classes
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>
              Your attendance record for {classDetails.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentAttendance.length > 0 ? (
                  studentAttendance.map((attendance, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {format(parseISO(attendance.date), "MMMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            attendance.status === "present"
                              ? "bg-green-100 text-green-800"
                              : attendance.status === "late"
                              ? "bg-amber-100 text-amber-800"
                              : attendance.status === "excused"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {attendance.status === "present" && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {attendance.status === "late" && (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {attendance.status === "absent" && (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{attendance.remarks || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderTeacherAdminView = () => {
    if (!classDetails) return null;
    
    // Get student info for the class
    const classStudents = classDetails.students.map(
      studentId => users.find(user => user.id === studentId)
    ).filter(Boolean) as User[];
    
    // Mark attendance view
    if (isMarkingAttendance) {
      return (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Mark Attendance</CardTitle>
                <CardDescription>
                  {classDetails.name} - {format(selectedDate, "MMMM d, yyyy")}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsMarkingAttendance(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveAttendance}>
                  Save Attendance
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classStudents.map((student) => {
                  const attendanceEntry = attendanceData.find(
                    a => a.studentId === student.id
                  );
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full overflow-hidden">
                            <img
                              src={student.profileImage || `https://ui-avatars.com/api/?name=${student.name.replace(" ", "+")}`}
                              alt={student.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          {student.name}
                        </div>
                      </TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>
                        <Select
                          value={attendanceEntry?.status || "absent"}
                          onValueChange={(value) => 
                            handleStatusChange(
                              student.id, 
                              value as "present" | "absent" | "late" | "excused"
                            )
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                            <SelectItem value="excused">Excused</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          placeholder="Optional remarks"
                          className="w-full p-2 rounded-md border border-gray-200"
                          value={attendanceEntry?.remarks || ""}
                          onChange={(e) => 
                            handleRemarkChange(student.id, e.target.value)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      );
    }

    // View attendance records
    // Find the attendance record for the selected date
    const attendanceRecord = attendanceRecords.find(
      record => record.classId === selectedClass && record.date === format(selectedDate, "yyyy-MM-dd")
    );

    return (
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily View</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <span>{format(selectedDate, "MMMM d, yyyy")}</span>
              </div>
              
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date || new Date())}
                  disabled={(date) => isBefore(date, new Date('2023-01-01'))}
                  className="rounded-md border"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportAttendance}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              {canMarkAttendance && canMarkToday && (
                <Button onClick={() => setIsMarkingAttendance(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {existingRecord ? "Edit Attendance" : "Mark Attendance"}
                </Button>
              )}
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Attendance Record</CardTitle>
              <CardDescription>
                {classDetails.name} - {format(selectedDate, "MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceRecord ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.map((student) => {
                      const attendanceEntry = attendanceRecord.attendees.find(
                        a => a.studentId === student.id
                      );
                      
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img
                                  src={student.profileImage || `https://ui-avatars.com/api/?name=${student.name.replace(" ", "+")}`}
                                  alt={student.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              {student.name}
                            </div>
                          </TableCell>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                attendanceEntry?.status === "present"
                                  ? "bg-green-100 text-green-800"
                                  : attendanceEntry?.status === "late"
                                  ? "bg-amber-100 text-amber-800"
                                  : attendanceEntry?.status === "excused"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {attendanceEntry?.status === "present" && (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              )}
                              {attendanceEntry?.status === "late" && (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {attendanceEntry?.status === "absent" && (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {(attendanceEntry?.status.charAt(0).toUpperCase() + attendanceEntry?.status.slice(1)) || "Absent"}
                            </Badge>
                          </TableCell>
                          <TableCell>{attendanceEntry?.remarks || "-"}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No attendance record found for this date.</p>
                  {canMarkAttendance && canMarkToday && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setIsMarkingAttendance(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Mark Attendance
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Attendance Summary</CardTitle>
                  <CardDescription>
                    Overview for {classDetails.name}
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={exportAttendance}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {classStudents.map((student) => {
                  const percentage = calculateAttendancePercentage(student.id, selectedClass);
                  
                  return (
                    <div key={student.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full overflow-hidden">
                            <img
                              src={student.profileImage || `https://ui-avatars.com/api/?name=${student.name.replace(" ", "+")}`}
                              alt={student.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.studentId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            percentage >= 75 
                              ? "text-green-600" 
                              : percentage >= 60 
                                ? "text-amber-600" 
                                : "text-red-600"
                          }`}>
                            {Math.round(percentage)}%
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
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
          <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">
            Track and manage class attendance
          </p>
        </div>
      </div>

      {accessibleClasses.length > 0 ? (
        <>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <Select
                value={selectedClass}
                onValueChange={setSelectedClass}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {accessibleClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedClass && renderAttendanceView()}
        </>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No classes available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
