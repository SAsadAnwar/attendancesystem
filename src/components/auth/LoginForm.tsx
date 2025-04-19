
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { QuickLoginOptions } from "./QuickLoginOptions";
import { Separator } from "@/components/ui/separator";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onQuickLogin: (email: string, password: string) => Promise<void>;
  isSubmitting: boolean;
}

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onQuickLogin,
  isSubmitting,
}: LoginFormProps) {
  const handleIndividualLogin = (role: string, defaultEmail: string) => {
    setEmail(defaultEmail);
    setPassword(role === "admin" ? "admin123" : role === "management" ? "mgmt123" : "teacher123");
  };

  return (
    <form onSubmit={onSubmit}>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleIndividualLogin("admin", "admin@example.com")}
            disabled={isSubmitting}
          >
            Login as Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleIndividualLogin("management", "management@example.com")}
            disabled={isSubmitting}
          >
            Login as Management
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleIndividualLogin("teacher", "john.smith@example.com")}
            disabled={isSubmitting}
          >
            Login as Teacher
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <QuickLoginOptions onQuickLogin={onQuickLogin} isSubmitting={isSubmitting} />
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </CardFooter>
    </form>
  );
}
