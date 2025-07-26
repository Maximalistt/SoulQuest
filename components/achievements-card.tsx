import { useState, useEffect } from "react";
import { Star, Zap, Shield, Gem, Trophy, Crown } from "lucide-react";
import { useSupabaseUser } from "../contexts/supabase-user-context";
import { SupabaseAPI, Achievement } from "../utils/supabase/client";

export function AchievementsCard() {
  const { user } = useSupabaseUser();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Check if user has valid UUID (database mode) or use fallback
      if (user.id.includes('-')) {
        const userAchievements = await SupabaseAPI.getUserAchievements(user.id);
        setAchievements(userAchievements);
      } else {
        // In-memory mode - create some mock achievements
        const mockAchievements = [
          {
            id: 'mock-achievement-1',
            user_id: user.id,
            title: 'Первые шаги',
            description: 'Завершён первый квест',
            category: 'starter',
            date_achieved: new Date().toISOString(),
            created_at: new Date().toISOString()
          },
          {
            id: 'mock-achievement-2',
            user_id: user.id,
            title: 'Исследователь',
            description: 'Создан первый проект',
            category: 'exploration',
            date_achieved: new Date().toISOString(),
            created_at: new Date().toISOString()
          }
        ];
        setAchievements(mockAchievements);
      }
    } catch (error) {
      console.error('Ошибка загрузки достижений:', error);
      // Fallback to empty achievements
      setAchievements([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Default achievements for display
  const defaultAchievements = [
    { icon: Star, name: "Исследователь", category: "exploration" },
    { icon: Zap, name: "Мастер Энергии", category: "energy" },
    { icon: Shield, name: "Защитник", category: "defense" },
    { icon: Gem, name: "Коллекционер", category: "collection" },
    { icon: Trophy, name: "Чемпион", category: "achievement" },
    { icon: Crown, name: "Мастер", category: "mastery" },
  ];

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-amber-400/5 rounded-lg blur-sm"></div>
      
      <div className="relative bg-gradient-to-r from-amber-100/10 via-amber-50/5 to-amber-100/10 border-2 border-cyan-400/30 rounded-lg p-6 backdrop-blur-sm">
        {/* Header */}
        <div className="relative mb-6">
          <div className="bg-gradient-to-r from-transparent via-amber-600/20 to-transparent border border-amber-400/40 rounded px-4 py-2 text-center">
            <h2 className="text-lg text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
              Достижения
            </h2>
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-amber-300 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Загрузка достижений...
            </p>
          </div>
        ) : (
          <>
            {/* Achievements Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {defaultAchievements.map((achievement, index) => {
                const Icon = achievement.icon;
                const unlocked = index < achievements.length + 2; // Show some as unlocked for demo
                
                return (
                  <div key={index} className="flex flex-col items-center text-center">
                    {/* Achievement background */}
                    <div className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 mb-2 ${
                      unlocked 
                        ? 'border-amber-400 bg-gradient-to-br from-amber-600/30 to-amber-800/30' 
                        : 'border-slate-600 bg-slate-800/30'
                    }`}>
                      {/* Glow effect for unlocked achievements */}
                      {unlocked && (
                        <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-sm animate-pulse"></div>
                      )}
                      
                      {/* Icon */}
                      <Icon className={`w-8 h-8 relative z-10 ${
                        unlocked ? 'text-amber-400' : 'text-slate-500'
                      }`} />
                      
                      {/* Runic decorations for unlocked achievements */}
                      {unlocked && (
                        <>
                          <div className="absolute -top-1 -left-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                        </>
                      )}
                    </div>
                    
                    {/* Achievement name - centered and balanced */}
                    <p className={`text-center text-xs leading-tight min-h-[2.5rem] flex items-center justify-center px-1 ${
                      unlocked ? 'text-amber-300' : 'text-slate-500'
                    }`} style={{ fontFamily: "'Inter', sans-serif" }}>
                      {achievement.name}
                    </p>
                  </div>
                );
              })}
            </div>
            
            {/* Progress Summary */}
            <div className="pt-4 border-t border-cyan-400/20 text-center">
              <p className="text-xs text-cyan-300 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                Прогресс достижений
              </p>
              <div className="flex justify-center space-x-1 mb-2">
                {defaultAchievements.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index < achievements.length + 2 ? 'bg-amber-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                {Math.min(achievements.length + 2, defaultAchievements.length)}/{defaultAchievements.length} разблокировано
              </p>
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