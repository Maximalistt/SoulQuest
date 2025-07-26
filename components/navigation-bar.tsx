import { Home, User, TreePine, BookOpen, Users } from "lucide-react";

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Главная" },
  { id: "profile", icon: User, label: "Профиль" },
  { id: "skills", icon: TreePine, label: "Навыки" },
  { id: "knowledge", icon: BookOpen, label: "Знания" },
  { id: "community", icon: Users, label: "Сообщество" },
];

export function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800 to-transparent"></div>
      
      <div className="relative border-t-2 border-cyan-400/30 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-around py-4 px-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-cyan-400' 
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                {/* Active glow effect */}
                {isActive && (
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-sm"></div>
                )}
                
                {/* Runic frame for active item */}
                {isActive && (
                  <div className="absolute inset-0 border border-cyan-400/50 rounded-lg"></div>
                )}
                
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {isActive && (
                    <div className="absolute inset-0 bg-cyan-400/30 blur-sm rounded-full"></div>
                  )}
                </div>
                
                <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {item.label}
                </span>
                
                {/* Runic dots for active item */}
                {isActive && (
                  <>
                    <div className="absolute -top-1 -left-1 w-1 h-1 bg-cyan-400 rounded-full"></div>
                    <div className="absolute -top-1 -right-1 w-1 h-1 bg-cyan-400 rounded-full"></div>
                    <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-cyan-400 rounded-full"></div>
                    <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-cyan-400 rounded-full"></div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}