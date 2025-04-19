
import { Shield, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface QuickLoginOptionsProps {
  onQuickLogin: (email: string, password: string) => Promise<void>;
  isSubmitting: boolean;
}

export function QuickLoginOptions({ onQuickLogin, isSubmitting }: QuickLoginOptionsProps) {
  return (
    <div className="space-y-4 pt-4">
      <Separator className="my-4" />
      <div className="text-sm text-center mb-4 text-slate-600">Quick Login Options</div>
      <div className="grid gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => onQuickLogin("admin@example.com", "admin123")}
          disabled={isSubmitting}
        >
          <Shield className="mr-2" />
          Login as Admin
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => onQuickLogin("management@example.com", "mgmt123")}
          disabled={isSubmitting}
        >
          <ShieldCheck className="mr-2" />
          Login as Management
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => onQuickLogin("john.smith@example.com", "teacher123")}
          disabled={isSubmitting}
        >
          <UserRound className="mr-2" />
          Login as Teacher
        </Button>
      </div>
    </div>
  );
}
