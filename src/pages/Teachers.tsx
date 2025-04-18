
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
import { PlusCircle, MoreHorizontal, Pencil, Trash2, SearchIcon } from "lucide-react";
import { getUsersByRole, departments } from "@/data/mockData";
import { User } from "@/types";

export default function Teachers() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<User[]>(getUsersByRole("teacher"));
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    teacherId: "",
    department: "",
    password: "",
  });

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (teacher.teacherId && teacher.teacherId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      teacherId: "",
      department: "",
      password: "",
    });
    setSelectedTeacher(null);
  };

  const handleAddTeacher = () => {
    // In a real app, this would be an API call
    const newTeacher: User = {
      id: `teacher${teachers.length + 1}`,
      name: formData.name,
      email: formData.email,
      role: "teacher",
      password: formData.password,
      teacherId: formData.teacherId,
      department: formData.department,
      profileImage: `https://ui-avatars.com/api/?name=${formData.name.replace(" ", "+")}&background=3498DB&color=fff`
    };

    setTeachers((prev) => [...prev, newTeacher]);
    toast({
      title: "Success",
      description: "Teacher added successfully",
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditClick = (teacher: User) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      teacherId: teacher.teacherId || "",
      department: teacher.department || "",
      password: teacher.password,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditTeacher = () => {
    if (!selectedTeacher) return;

    // In a real app, this would be an API call
    const updatedTeachers = teachers.map((teacher) =>
      teacher.id === selectedTeacher.id
        ? {
            ...teacher,
            name: formData.name,
            email: formData.email,
            teacherId: formData.teacherId,
            department: formData.department,
            password: formData.password,
          }
        : teacher
    );

    setTeachers(updatedTeachers);
    toast({
      title: "Success",
      description: "Teacher updated successfully",
    });
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteClick = (teacher: User) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTeacher = () => {
    if (!selectedTeacher) return;

    // In a real app, this would be an API call
    const updatedTeachers = teachers.filter(
      (teacher) => teacher.id !== selectedTeacher.id
    );

    setTeachers(updatedTeachers);
    toast({
      title: "Success",
      description: "Teacher deleted successfully",
    });
    setIsDeleteDialogOpen(false);
    resetForm();
  };

  // Determine if current user can edit/delete (only admin can edit teachers)
  const canModify = currentUser?.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teachers</h2>
          <p className="text-muted-foreground">
            Manage faculty and staff accounts
          </p>
        </div>
        {canModify && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new teacher account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
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
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teacherId" className="text-right">
                    Teacher ID
                  </Label>
                  <Input
                    id="teacherId"
                    name="teacherId"
                    value={formData.teacherId}
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
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTeacher}>Add Teacher</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Teachers List</CardTitle>
              <CardDescription>
                Total {filteredTeachers.length} teachers
              </CardDescription>
            </div>
            <div className="relative w-64">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search teachers..."
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
                <TableHead>Name</TableHead>
                <TableHead>Teacher ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                {canModify && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img
                            src={teacher.profileImage || `https://ui-avatars.com/api/?name=${teacher.name.replace(" ", "+")}`}
                            alt={teacher.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {teacher.name}
                      </div>
                    </TableCell>
                    <TableCell>{teacher.teacherId}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      {departments.find((dept) => dept.id === teacher.department)?.name}
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
                            <DropdownMenuItem onClick={() => handleEditClick(teacher)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteClick(teacher)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={canModify ? 5 : 4} className="text-center">
                    No teachers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Teacher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>
              Update teacher information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
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
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-teacherId" className="text-right">
                Teacher ID
              </Label>
              <Input
                id="edit-teacherId"
                name="teacherId"
                value={formData.teacherId}
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
              <Label htmlFor="edit-password" className="text-right">
                Password
              </Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTeacher}>Update Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this teacher? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTeacher}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
