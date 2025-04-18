
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart, 
  Settings, 
  LogOut,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  href: string;
  roles: string[];
};

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
    roles: ["admin", "management", "teacher", "student"],
  },
  {
    title: "Students",
    icon: Users,
    href: "/students",
    roles: ["admin", "management", "teacher"],
  },
  {
    title: "Teachers",
    icon: User,
    href: "/teachers",
    roles: ["admin", "management"],
  },
  {
    title: "Classes",
    icon: BookOpen,
    href: "/classes",
    roles: ["admin", "management", "teacher"],
  },
  {
    title: "Attendance",
    icon: Calendar,
    href: "/attendance",
    roles: ["admin", "management", "teacher", "student"],
  },
  {
    title: "Reports",
    icon: BarChart,
    href: "/reports",
    roles: ["admin", "management", "teacher", "student"],
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    roles: ["admin", "management", "teacher", "student"],
  },
];

export function Sidebar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  
  if (!currentUser) return null;
  
  const filteredItems = sidebarItems.filter(
    (item) => item.roles.includes(currentUser.role)
  );

  return (
    <div className="h-screen w-64 bg-white border-r flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">AttendTrack</h2>
      </div>

      <div className="flex-1 px-4 space-y-1 overflow-auto">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src={currentUser.profileImage || "https://ui-avatars.com/api/?name=" + currentUser.name.replace(" ", "+")}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{currentUser.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{currentUser.role}</div>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
