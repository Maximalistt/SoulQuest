import { useState, useEffect } from "react";
import { User, Swords, Shield, Zap, ChevronDown, ChevronUp, Edit3, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useSupabaseUser } from "../contexts/supabase-user-context";
import { SupabaseAPI } from "../utils/supabase/client";

export function ProfileCard() {
  const { user, userProfile, updateUserProfile } = useSupabaseUser();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [stats, setStats] = useState({
    quests: 0,
    achievements: 0,
    streak: 0
  });

  useEffect(() => {
    if (userProfile) {
      setEditText(userProfile.bio || '');
    }
  }, [userProfile]);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    
    try {
      // Load user stats from database
      const [quests, achievements] = await Promise.all([
        SupabaseAPI.getUserDailyQuests(user.id),
        SupabaseAPI.getUserAchievements(user.id)
      ]);

      setStats({
        quests: quests.filter(q => q.completed).length,
        achievements: achievements.length,
        streak: user.streak_days
      });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      await updateUserProfile({ bio: editText });
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
    }
  };

  const handleCancel = () => {
    setEditText(userProfile?.bio || '');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditText(userProfile?.bio || '');
    setIsEditing(true);
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-amber-400/5 rounded-lg blur-sm"></div>
      
      <div className="relative bg-gradient-to-r from-amber-100/10 via-amber-50/5 to-amber-100/10 border-2 border-cyan-400/30 rounded-lg backdrop-blur-sm">
        {/* Header */}
        <div className="relative p-4 border-b border-cyan-400/20">
          <div className="bg-gradient-to-r from-transparent via-amber-600/20 to-transparent border border-amber-400/40 rounded px-4 py-2 flex items-center justify-between">
            <h2 className="text-lg text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
              Обо мне
            </h2>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <Button
                  onClick={handleEdit}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              )}
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-4 space-y-4">
            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Расскажите о своём мистическом путешествии..."
                  className="bg-slate-700/50 border-cyan-400/30 text-white min-h-[100px] resize-none"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={handleCancel}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Отмена
                  </Button>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Сохранить
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-cyan-200 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {userProfile?.bio || 'Расскажите другим о себе и своём путешествии...'}
              </p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-cyan-400/20">
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-1 border border-amber-400/30">
                  <Swords className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xs text-amber-300" style={{ fontFamily: "'Inter', sans-serif" }}>Квесты</div>
                <div className="text-sm text-white" style={{ fontFamily: "'Inter', sans-serif" }}>{stats.quests}</div>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 via-cyan-600/10 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-1 border border-cyan-400/30">
                  <Shield className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xs text-cyan-300" style={{ fontFamily: "'Inter', sans-serif" }}>Достижения</div>
                <div className="text-sm text-white" style={{ fontFamily: "'Inter', sans-serif" }}>{stats.achievements}</div>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-1 border border-purple-400/30">
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs text-purple-300" style={{ fontFamily: "'Inter', sans-serif" }}>Серия</div>
                <div className="text-sm text-white" style={{ fontFamily: "'Inter', sans-serif" }}>{stats.streak} дней</div>
              </div>
            </div>
          </div>
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