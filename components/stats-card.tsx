import { useState, useEffect } from "react";
import { TrendingUp, Award, Target, Zap } from "lucide-react";
import { useSupabaseUser } from "../contexts/supabase-user-context";
import { SupabaseAPI } from "../utils/supabase/client";

export function StatsCard() {
  const { user } = useSupabaseUser();
  const [stats, setStats] = useState({
    completedQuests: 0,
    totalQuests: 0,
    achievements: 0,
    projects: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Check if user has valid UUID (database mode) or use fallback
      if (user.id.includes('-')) {
        const [quests, achievements, projects] = await Promise.all([
          SupabaseAPI.getUserDailyQuests(user.id),
          SupabaseAPI.getUserAchievements(user.id),
          SupabaseAPI.getUserProjects(user.id)
        ]);

        const completedQuests = quests.filter(q => q.completed).length;
        
        setStats({
          completedQuests,
          totalQuests: quests.length,
          achievements: achievements.length,
          projects: projects.length
        });
      } else {
        // In-memory mode - create mock stats
        const mockStats = {
          completedQuests: 3,
          totalQuests: 5,
          achievements: 2,
          projects: 2
        };
        setStats(mockStats);
      }
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
      
      // Fallback to basic stats based on user level
      const fallbackStats = {
        completedQuests: Math.max(0, (user?.level || 1) - 1),
        totalQuests: Math.max(1, user?.level || 1),
        achievements: Math.floor((user?.level || 1) / 2),
        projects: Math.max(0, Math.floor((user?.level || 1) / 3))
      };
      setStats(fallbackStats);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const completionRate = stats.totalQuests > 0 ? Math.round((stats.completedQuests / stats.totalQuests) * 100) : 0;

  const displayStats = [
    {
      icon: TrendingUp,
      label: "Уровень",
      value: user.level.toString(),
      color: "from-cyan-500/20 via-cyan-600/10 to-cyan-500/20",
      iconColor: "text-cyan-400",
      textColor: "text-cyan-300"
    },
    {
      icon: Zap,
      label: "Общий XP",
      value: user.total_xp.toString(),
      color: "from-amber-500/20 via-amber-600/10 to-amber-500/20",
      iconColor: "text-amber-400",
      textColor: "text-amber-300"
    },
    {
      icon: Target,
      label: "Квесты",
      value: `${stats.completedQuests}/${stats.totalQuests}`,
      color: "from-purple-500/20 via-purple-600/10 to-purple-500/20",
      iconColor: "text-purple-400",
      textColor: "text-purple-300"
    },
    {
      icon: Award,
      label: "Процент успеха",
      value: `${completionRate}%`,
      color: "from-green-500/20 via-green-600/10 to-green-500/20",
      iconColor: "text-green-400",
      textColor: "text-green-300"
    }
  ];

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-amber-400/5 rounded-lg blur-sm"></div>
      
      <div className="relative bg-gradient-to-r from-amber-100/10 via-amber-50/5 to-amber-100/10 border-2 border-cyan-400/30 rounded-lg p-6 backdrop-blur-sm">
        {/* Header */}
        <div className="relative mb-4">
          <div className="bg-gradient-to-r from-transparent via-amber-600/20 to-transparent border border-amber-400/40 rounded px-4 py-2 text-center">
            <h2 className="text-lg text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
              Мистическая Статистика
            </h2>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-amber-300 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Загрузка статистики...
            </p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {displayStats.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${stat.color} border border-cyan-400/20 rounded-lg p-4 text-center`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center border border-cyan-400/30`}>
                      <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <div className={`text-lg ${stat.textColor} mb-1`} style={{ fontFamily: "'Inter', sans-serif" }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="mt-4 pt-4 border-t border-cyan-400/20">
              <div className="text-center">
                <div className="text-xs text-cyan-300 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Сегодняшние достижения
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < Math.floor(completionRate / 20)
                            ? 'bg-amber-400'
                            : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-amber-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {completionRate}%
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-cyan-400/50"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-cyan-400/50"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-cyan-400/50"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-cyan-400/50"></div>
      </div>
    </div>
  );
}