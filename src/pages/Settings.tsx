
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    attendanceAlerts: true,
    reportGeneration: false,
    systemUpdates: true,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (value: boolean, setting: string) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  const handleSaveNotifications = () => {
    // In a real app, this would be an API call
    toast({
      title: "Success",
      description: "Notification settings updated",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow">
                        <img
                          src={currentUser?.profileImage || `https://ui-avatars.com/api/?name=${currentUser?.name.replace(" ", "+")}`}
                          alt={currentUser?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                      >
                        <span className="sr-only">Change avatar</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                          <line x1="4" y1="22" x2="4" y2="15"></line>
                        </svg>
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
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
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        New Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={profileForm.password}
                        onChange={handleProfileChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="confirmPassword" className="text-right">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={profileForm.confirmPassword}
                        onChange={handleProfileChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Email Notifications</div>
                    <div className="text-xs text-muted-foreground">
                      Receive emails for important updates
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(value) => handleNotificationChange(value, "emailNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Attendance Alerts</div>
                    <div className="text-xs text-muted-foreground">
                      Get notified about attendance updates
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.attendanceAlerts}
                    onCheckedChange={(value) => handleNotificationChange(value, "attendanceAlerts")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Report Generation</div>
                    <div className="text-xs text-muted-foreground">
                      Receive periodic attendance reports
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.reportGeneration}
                    onCheckedChange={(value) => handleNotificationChange(value, "reportGeneration")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">System Updates</div>
                    <div className="text-xs text-muted-foreground">
                      Get notified about system changes
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(value) => handleNotificationChange(value, "systemUpdates")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveNotifications}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Role</p>
                    <p className="font-medium capitalize">{currentUser?.role}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">User ID</p>
                    <p className="font-medium">{currentUser?.id}</p>
                  </div>
                  {currentUser?.studentId && (
                    <div>
                      <p className="text-muted-foreground">Student ID</p>
                      <p className="font-medium">{currentUser.studentId}</p>
                    </div>
                  )}
                  {currentUser?.teacherId && (
                    <div>
                      <p className="text-muted-foreground">Teacher ID</p>
                      <p className="font-medium">{currentUser.teacherId}</p>
                    </div>
                  )}
                  {currentUser?.department && (
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium">{currentUser.department}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Danger Zone</h3>
                <div className="rounded-md border border-red-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-600">Log Out from All Devices</p>
                      <p className="text-sm text-muted-foreground">
                        This will log you out from all devices where you're currently logged in.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Log Out All</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will log you out from all devices. You'll need to log in again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={logout}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
