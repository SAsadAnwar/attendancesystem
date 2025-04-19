
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoggedIn } = useAuth();
  const { toast } = useToast();

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");

  const handleQuickLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (!success) {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (!success) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: fullName,
            student_id: studentId,
            department: department,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data) {
        toast({
          title: "Sign Up Successful",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-2">AttendTrack</h1>
          <p className="text-slate-600">Attendance Management System</p>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </TabsContent>

              <TabsContent value="signup">
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Register as a new student
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <Tabs defaultValue="login" className="w-full">
            <TabsContent value="login">
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSubmit={handleLogin}
                onQuickLogin={handleQuickLogin}
                isSubmitting={isSubmitting}
              />
            </TabsContent>

            <TabsContent value="signup">
              <SignupForm
                signupEmail={signupEmail}
                setSignupEmail={setSignupEmail}
                signupPassword={signupPassword}
                setSignupPassword={setSignupPassword}
                fullName={fullName}
                setFullName={setFullName}
                studentId={studentId}
                setStudentId={setStudentId}
                department={department}
                setDepartment={setDepartment}
                onSubmit={handleSignup}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-8 text-center text-sm text-slate-600">
          <div className="mb-4">
            <p>Use one of the following demo accounts:</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-2 rounded-md shadow-sm">
              <p className="font-semibold mb-1">Admin</p>
              <p>admin@example.com</p>
              <p>admin123</p>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <p className="font-semibold mb-1">Management</p>
              <p>management@example.com</p>
              <p>mgmt123</p>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <p className="font-semibold mb-1">Teacher</p>
              <p>john.smith@example.com</p>
              <p>teacher123</p>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <p className="font-semibold mb-1">Student</p>
              <p>alice.j@example.com</p>
              <p>student123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
