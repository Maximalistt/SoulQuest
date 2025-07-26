import { useState, useRef, useEffect } from "react";
import { ProfileCard } from "./components/profile-card";
import { AchievementsCard } from "./components/achievements-card";
import { StatsCard } from "./components/stats-card";
import { DailyQuestsCard } from "./components/daily-quests-card";
import { AdvisorsCard, Advisor } from "./components/advisors-card";
import { MyProjectsCard } from "./components/my-projects-card";
import { ChatPage } from "./components/chat-page";
import { ProjectsListPage } from "./components/projects-list-page";
import { ProjectDetailPage } from "./components/project-detail-page";
import { CommunityPage } from "./components/community-page";
import { NavigationBar } from "./components/navigation-bar";
import { WelcomePage } from "./components/welcome-page";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { SupabaseUserProvider, useSupabaseUser } from "./contexts/supabase-user-context";
import { Camera } from "lucide-react";
import { Button } from "./components/ui/button";
import { Project } from "./utils/supabase/client";

type AppState = 'welcome' | 'home' | 'chat' | 'projects' | 'project-detail' | 'community';
type TabState = 'home' | 'profile' | 'skills' | 'knowledge' | 'community';

function AppContent() {
  const { user, isLoading, initializeUser, updateAvatar } = useSupabaseUser();
  const [currentView, setCurrentView] = useState<AppState>('welcome');
  const [activeTab, setActiveTab] = useState<TabState>('profile');
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user is already authenticated
    if (user) {
      setCurrentView('home');
      setActiveTab('profile');
    }
  }, [user]);

  const handleStartJourney = async () => {
    try {
      await initializeUser();
      setCurrentView('home');
      setActiveTab('profile');
    } catch (error) {
      console.error('Ошибка инициализации пользователя:', error);
    }
  };

  const handleAdvisorClick = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setCurrentView('chat');
  };

  const handleProjectsClick = () => {
    setCurrentView('projects');
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project-detail');
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    setSelectedProject(updatedProject);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAdvisor(null);
    setSelectedProject(null);
  };

  const handleBackToProjects = () => {
    setCurrentView('projects');
    setSelectedProject(null);
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'community') {
      setCurrentView('community');
      setActiveTab('community');
    } else {
      setCurrentView('home');
      setActiveTab(tab as TabState);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const result = e.target?.result as string;
          await updateAvatar(result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Ошибка загрузки аватарки:', error);
      }
    }
  };

  const getDisplayAvatar = () => {
    return user?.avatar_url || null;
  };

  const getDisplayName = () => {
    if (!user) return 'Загрузка...';
    return `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`.toUpperCase();
  };

  const getXPProgress = () => {
    if (!user) return { current: 0, next: 100, percentage: 0 };
    const currentLevelXP = (user.level - 1) * 100;
    const nextLevelXP = user.level * 100;
    const currentXP = user.total_xp - currentLevelXP;
    const neededXP = nextLevelXP - currentLevelXP;
    return {
      current: currentXP,
      next: neededXP,
      percentage: (currentXP / neededXP) * 100
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
            Загрузка вашего мистического профиля...
          </p>
        </div>
      </div>
    );
  }

  // Welcome page for unauthenticated users
  if (currentView === 'welcome' && !user) {
    return <WelcomePage onStartJourney={handleStartJourney} />;
  }

  // Chat Page
  if (currentView === 'chat' && selectedAdvisor) {
    return <ChatPage advisor={selectedAdvisor} onBack={handleBackToHome} />;
  }

  // Projects List Page
  if (currentView === 'projects') {
    return (
      <ProjectsListPage 
        onBack={handleBackToHome} 
        onProjectClick={handleProjectClick}
      />
    );
  }

  // Project Detail Page
  if (currentView === 'project-detail' && selectedProject) {
    return (
      <ProjectDetailPage 
        project={selectedProject} 
        onBack={handleBackToProjects}
        onProjectUpdate={handleProjectUpdate}
      />
    );
  }

  // Community Page
  if (currentView === 'community') {
    return (
      <CommunityPage 
        onBack={handleBackToHome}
      />
    );
  }

  const xpProgress = getXPProgress();

  // Home Page
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.15),transparent_60%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.1),transparent_50%)] pointer-events-none"></div>

      {/* Floating magical particles */}
      <div className="absolute top-10 left-8 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-12 w-1 h-1 bg-amber-400 rounded-full animate-pulse delay-300"></div>
      <div className="absolute top-64 left-16 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
      <div className="absolute bottom-32 right-8 w-1 h-1 bg-amber-400 rounded-full animate-pulse delay-500"></div>

      {/* Magical corner ornaments */}
      <div className="absolute top-6 left-6 w-8 h-8">
        <div className="absolute top-0 left-0 w-4 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
        <div className="absolute top-0 left-0 w-0.5 h-4 bg-gradient-to-b from-cyan-400 to-transparent"></div>
      </div>
      <div className="absolute top-6 right-6 w-8 h-8">
        <div className="absolute top-0 right-0 w-4 h-0.5 bg-gradient-to-l from-cyan-400 to-transparent"></div>
        <div className="absolute top-0 right-0 w-0.5 h-4 bg-gradient-to-b from-cyan-400 to-transparent"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header Section with Large Avatar */}
        <div className="px-6 pt-12 pb-8 text-center">
          {/* Large Avatar with Magical Frame */}
          <div className="relative mb-6 flex justify-center">
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-20 blur-xl scale-125 animate-pulse"></div>

              {/* Runic frame */}
              <div className="relative w-48 h-48 rounded-full border-4 border-cyan-400 p-3 bg-gradient-to-br from-cyan-400/20 via-transparent to-amber-400/10">
                {/* Runic corner decorations */}
                <div className="absolute -top-4 -left-4 w-12 h-12 border-2 border-cyan-400 rounded-full bg-slate-800 flex items-center justify-center">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 border-2 border-cyan-400 rounded-full bg-slate-800 flex items-center justify-center">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 border-2 border-cyan-400 rounded-full bg-slate-800 flex items-center justify-center">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse delay-400"></div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-2 border-cyan-400 rounded-full bg-slate-800 flex items-center justify-center">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse delay-600"></div>
                </div>

                {/* Connecting runic lines */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-9 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-9 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 h-9 w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 h-9 w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>

                {/* Avatar image */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-6xl shadow-2xl relative overflow-hidden">
                  <ImageWithFallback
                    src={getDisplayAvatar()}
                    alt="Аватар пользователя"
                    className="w-full h-full rounded-full object-cover"
                    fallback={
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-6xl">
                        🧙‍♂️
                      </div>
                    }
                  />
                  
                  {/* Avatar upload button */}
                  <Button
                    onClick={() => avatarFileInputRef.current?.click()}
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 w-10 h-10 bg-slate-800/80 hover:bg-slate-700 border-2 border-cyan-400/50 rounded-full"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                  </Button>
                  
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* User Name with magical styling */}
          <div className="relative mb-4">
            <div className="bg-gradient-to-r from-transparent via-slate-800/60 to-transparent border-2 border-cyan-400/30 rounded-lg py-3 px-6 backdrop-blur-sm">
              <h1
                className="text-2xl text-amber-300 tracking-wider"
                style={{
                  fontFamily: "'Loreley Antiqua', cursive",
                }}
              >
                {getDisplayName()}
              </h1>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="relative mb-6">
            <div className="bg-gradient-to-r from-transparent via-slate-800/40 to-transparent border border-cyan-400/20 rounded-lg py-4 px-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-cyan-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Уровень {user?.level || 1}
                </span>
                <span className="text-sm text-amber-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {xpProgress.current}/{xpProgress.next} XP
                </span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-500 rounded-full transition-all duration-500 relative"
                    style={{ width: `${Math.min(xpProgress.percentage, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
                
                {/* XP sparkles */}
                <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
                  <span className="text-xs text-cyan-400">✨</span>
                </div>
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                  <span className="text-xs text-amber-400">⚡</span>
                </div>
              </div>
              
              <div className="text-center mt-2">
                <span className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {xpProgress.next - xpProgress.current} XP до следующего уровня
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Cards */}
        <div className="flex-1 px-6 space-y-6 pb-8">
          <ProfileCard />
          <DailyQuestsCard />
          <MyProjectsCard onProjectsClick={handleProjectsClick} />
          <AdvisorsCard onAdvisorClick={handleAdvisorClick} />
          <AchievementsCard />
          <StatsCard />
        </div>

        {/* Navigation Bar */}
        <NavigationBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SupabaseUserProvider>
      <AppContent />
    </SupabaseUserProvider>
  );
}