
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Pencil, Trash2, SearchIcon, Users, BookOpen } from "lucide-react";
import { classes, departments, getUsersByRole } from "@/data/mockData";
import { Class, User } from "@/types";

export default function Classes() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [classesList, setClassesList] = useState<Class[]>(classes);
  const [formData, setFormData] = useState({
    name: "",
    teacherId: "",
    department: "",
    students: [] as string[],
    schedule: [{ day: "Monday", startTime: "09:00", endTime: "11:00" }],
  });

  const teachers = getUsersByRole("teacher");
  const allStudents = getUsersByRole("student");

  const filteredClasses = classesList.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      departments.find(d => d.id === cls.department)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teachers.find(t => t.id === cls.teacherId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentSelection = (studentId: string) => {
    setFormData((prev) => {
      if (prev.students.includes(studentId)) {
        return {
          ...prev,
          students: prev.students.filter(id => id !== studentId)
        };
      } else {
        return {
          ...prev,
          students: [...prev.students, studentId]
        };
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      teacherId: "",
      department: "",
      students: [],
      schedule: [{ day: "Monday", startTime: "09:00", endTime: "11:00" }],
    });
    setSelectedClass(null);
  };

  const handleAddClass = () => {
    // In a real app, this would be an API call
    const newClass: Class = {
      id: `class${classesList.length + 1}`,
      name: formData.name,
      teacherId: formData.teacherId,
      department: formData.department,
      students: formData.students,
      schedule: formData.schedule,
    };

    setClassesList((prev) => [...prev, newClass]);
    toast({
      title: "Success",
      description: "Class added successfully",
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditClick = (cls: Class) => {
    setSelectedClass(cls);
    setFormData({
      name: cls.name,
      teacherId: cls.teacherId,
      department: cls.department,
      students: cls.students,
      schedule: cls.schedule,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditClass = () => {
    if (!selectedClass) return;

    // In a real app, this would be an API call
    const updatedClasses = classesList.map((cls) =>
      cls.id === selectedClass.id
        ? {
            ...cls,
            name: formData.name,
            teacherId: formData.teacherId,
            department: formData.department,
            students: formData.students,
            schedule: formData.schedule,
          }
        : cls
    );

    setClassesList(updatedClasses);
    toast({
      title: "Success",
      description: "Class updated successfully",
    });
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteClick = (cls: Class) => {
    setSelectedClass(cls);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteClass = () => {
    if (!selectedClass) return;

    // In a real app, this would be an API call
    const updatedClasses = classesList.filter(
      (cls) => cls.id !== selectedClass.id
    );

    setClassesList(updatedClasses);
    toast({
      title: "Success",
      description: "Class deleted successfully",
    });
    setIsDeleteDialogOpen(false);
    resetForm();
  };

  // Determine if current user can edit/delete
  const canModify = currentUser?.role === "admin" || currentUser?.role === "management";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Classes</h2>
          <p className="text-muted-foreground">
            Manage courses and class schedules
          </p>
        </div>
        {canModify && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
                <DialogDescription>
                  Create a new class and assign teachers and students.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Class Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange(value, "department")}
                  >
                    <SelectTrigger className="col-span-3">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teacher" className="text-right">
                    Teacher
                  </Label>
                  <Select
                    value={formData.teacherId}
                    onValueChange={(value) => handleSelectChange(value, "teacherId")}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">
                    Students
                  </Label>
                  <div className="col-span-3 border rounded-md p-4 h-48 overflow-y-auto">
                    <div className="space-y-2">
                      {allStudents.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={`student-${student.id}`}
                            checked={formData.students.includes(student.id)}
                            onChange={() => handleStudentSelection(student.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label
                            htmlFor={`student-${student.id}`}
                            className="text-sm cursor-pointer flex items-center gap-2"
                          >
                            <div className="h-6 w-6 rounded-full overflow-hidden">
                              <img
                                src={student.profileImage || `https://ui-avatars.com/api/?name=${student.name.replace(" ", "+")}`}
                                alt={student.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            {student.name} ({student.studentId})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddClass}>Add Class</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Classes List</CardTitle>
              <CardDescription>
                Total {filteredClasses.length} classes
              </CardDescription>
            </div>
            <div className="relative w-64">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search classes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Schedule</TableHead>
                {canModify && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => {
                  const teacher = teachers.find(t => t.id === cls.teacherId);
                  const department = departments.find(d => d.id === cls.department);
                  
                  return (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          {cls.name}
                        </div>
                      </TableCell>
                      <TableCell>{department?.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {teacher && (
                            <>
                              <div className="h-6 w-6 rounded-full overflow-hidden">
                                <img
                                  src={teacher.profileImage || `https://ui-avatars.com/api/?name=${teacher.name.replace(" ", "+")}`}
                                  alt={teacher.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              {teacher.name}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{cls.students.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cls.schedule.map((sch, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {sch.day} {sch.startTime}-{sch.endTime}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      {canModify && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditClick(cls)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteClick(cls)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={canModify ? 6 : 5} className="text-center">
                    No classes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Class Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Update class information, teacher, and enrolled students.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Class Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-department" className="text-right">
                Department
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange(value, "department")}
              >
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-teacher" className="text-right">
                Teacher
              </Label>
              <Select
                value={formData.teacherId}
                onValueChange={(value) => handleSelectChange(value, "teacherId")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Students
              </Label>
              <div className="col-span-3 border rounded-md p-4 h-48 overflow-y-auto">
                <div className="space-y-2">
                  {allStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={`edit-student-${student.id}`}
                        checked={formData.students.includes(student.id)}
                        onChange={() => handleStudentSelection(student.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label
                        htmlFor={`edit-student-${student.id}`}
                        className="text-sm cursor-pointer flex items-center gap-2"
                      >
                        <div className="h-6 w-6 rounded-full overflow-hidden">
                          <img
                            src={student.profileImage || `https://ui-avatars.com/api/?name=${student.name.replace(" ", "+")}`}
                            alt={student.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {student.name} ({student.studentId})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditClass}>Update Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this class? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteClass}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
