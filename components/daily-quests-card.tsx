import { useState, useEffect } from "react";
import { Target, Settings, Check, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useSupabaseUser } from "../contexts/supabase-user-context";
import { SupabaseAPI, DailyQuest } from "../utils/supabase/client";

const DEFAULT_HABITS = [
  { title: "Утренняя зарядка", description: "10 минут физических упражнений", icon: "🏃‍♂️", xpReward: 25 },
  { title: "Медитация", description: "5 минут осознанности", icon: "🧘‍♂️", xpReward: 30 },
  { title: "Чтение", description: "30 минут полезной книги", icon: "📚", xpReward: 35 },
  { title: "Вода", description: "Выпить 8 стаканов воды", icon: "💧", xpReward: 20 },
  { title: "Планирование", description: "Запланировать день", icon: "📅", xpReward: 25 },
  { title: "Благодарность", description: "Записать 3 благодарности", icon: "🙏", xpReward: 30 },
  { title: "Творчество", description: "30 минут творческой деятельности", icon: "🎨", xpReward: 35 },
  { title: "Общение", description: "Позвонить близкому человеку", icon: "📞", xpReward: 25 },
  { title: "Изучение", description: "Изучить что-то новое", icon: "🎓", xpReward: 40 },
  { title: "Прогулка", description: "30 минут на свежем воздухе", icon: "🚶‍♂️", xpReward: 25 },
];

const HABIT_ICONS = [
  "⚡", "🌟", "🔥", "💎", "🎯", "🚀", "💪", "🧠", "❤️", "🌈",
  "🎨", "📚", "🎵", "🏃‍♂️", "🧘‍♂️", "💧", "🌱", "🎪", "🎭", "🏆",
  "🔮", "⭐", "🌙", "☀️", "🌸", "🦋", "🌊", "🗻", "🎪", "🎨",
  "📝", "💡", "🔧", "🎯", "🎪", "🎨", "🎵", "🎮", "🏅", "🎖️"
];

export function DailyQuestsCard() {
  const { user, addXP } = useSupabaseUser();
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    icon: '⚡',
    xpReward: 25,
  });

  useEffect(() => {
    if (user) {
      loadDailyQuests();
    }
  }, [user]);

  const loadDailyQuests = async () => {
    if (!user) return;
    
    try {
      const quests = await SupabaseAPI.getUserDailyQuests(user.id);
      setDailyQuests(quests);
    } catch (error) {
      console.error('Ошибка загрузки ежедневных квестов:', error);
      // Fallback to empty array if database fails
      setDailyQuests([]);
    }
  };

  const handleCreateCustomHabit = async () => {
    if (!newHabit.title.trim() || !user) return;

    setIsLoading(true);
    try {
      const questData = {
        user_id: user.id,
        quest_type: 'custom',
        title: newHabit.title,
        description: newHabit.description,
        completed: false,
        xp_reward: newHabit.xpReward,
      };

      await SupabaseAPI.createDailyQuest(questData);
      await loadDailyQuests();

      setNewHabit({
        title: '',
        description: '',
        icon: '⚡',
        xpReward: 25,
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Ошибка создания привычки:', error);
      // Show error to user or handle gracefully
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPresetHabit = async (presetHabit: typeof DEFAULT_HABITS[0]) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const questData = {
        user_id: user.id,
        quest_type: 'preset',
        title: presetHabit.title,
        description: presetHabit.description,
        completed: false,
        xp_reward: presetHabit.xpReward,
      };

      await SupabaseAPI.createDailyQuest(questData);
      await loadDailyQuests();
      setIsPresetDialogOpen(false);
    } catch (error) {
      console.error('Ошибка добавления привычки:', error);
      // Show error to user or handle gracefully
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuest = async (questId: string) => {
    if (!user) return;

    const quest = dailyQuests.find(q => q.id === questId);
    if (!quest) return;

    try {
      const completed = !quest.completed;
      await SupabaseAPI.updateDailyQuest(questId, { 
        completed,
        ...(completed && { completed_at: new Date().toISOString() })
      });

      // Add XP if quest is completed
      if (completed) {
        await addXP(quest.xp_reward);
      }

      await loadDailyQuests();
    } catch (error) {
      console.error('Ошибка обновления квеста:', error);
      // Fallback to local update
      setDailyQuests(prev => 
        prev.map(q => q.id === questId ? { ...q, completed: !q.completed } : q)
      );
    }
  };

  const completedQuests = dailyQuests.filter(quest => quest.completed).length;
  const totalQuests = dailyQuests.length;

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-amber-400/5 rounded-lg blur-sm"></div>
      
      <div className="relative bg-gradient-to-r from-amber-100/10 via-amber-50/5 to-amber-100/10 border-2 border-cyan-400/30 rounded-lg p-6 backdrop-blur-sm">
        {/* Header */}
        <div className="relative mb-4">
          <div className="bg-gradient-to-r from-transparent via-amber-600/20 to-transparent border border-amber-400/40 rounded px-4 py-2 flex items-center justify-between">
            <div>
              <h2 className="text-lg text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
                Ежедневные Квесты
              </h2>
              <p className="text-xs text-cyan-200 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                {completedQuests}/{totalQuests} выполнено сегодня
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <div className="inline-flex items-center justify-center rounded-md h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 transition-colors cursor-pointer">
                  <Settings className="h-4 w-4" />
                </div>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-cyan-400/30 text-white">
                <DialogHeader>
                  <DialogTitle className="text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
                    Настройка Ежедневных Квестов
                  </DialogTitle>
                  <DialogDescription className="text-cyan-200" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Добавьте новые привычки или выберите из готовых шаблонов.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Dialog open={isPresetDialogOpen} onOpenChange={setIsPresetDialogOpen}>
                      <DialogTrigger asChild>
                        <div className="flex-1 inline-flex items-center justify-center rounded-md border border-cyan-400/30 text-cyan-300 px-4 py-2 text-sm cursor-pointer hover:bg-cyan-400/10 transition-colors">
                          Выбрать Шаблон
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-cyan-400/30 text-white max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
                            Шаблоны Привычек
                          </DialogTitle>
                          <DialogDescription className="text-cyan-200" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Выберите из нашей коллекции проверенных привычек.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          {DEFAULT_HABITS.map((habit, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-cyan-400/20"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{habit.icon}</span>
                                <div>
                                  <h4 className="text-sm text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {habit.title}
                                  </h4>
                                  <p className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {habit.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-amber-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  +{habit.xpReward} XP
                                </span>
                                <Button
                                  onClick={() => handleAddPresetHabit(habit)}
                                  disabled={isLoading}
                                  size="sm"
                                  className="bg-cyan-600 hover:bg-cyan-500"
                                >
                                  Добавить
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div
                      className="flex-1 inline-flex items-center justify-center rounded-md bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 text-sm cursor-pointer transition-colors"
                      onClick={() => setIsPresetDialogOpen(false)}
                    >
                      Создать Свою
                    </div>
                  </div>

                  {/* Custom Habit Form */}
                  <div className="space-y-4 pt-4 border-t border-cyan-400/20">
                    <div>
                      <label className="block text-sm text-cyan-300 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Название привычки
                      </label>
                      <Input
                        value={newHabit.title}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Введите название привычки..."
                        className="bg-slate-700/50 border-cyan-400/30 text-white"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-cyan-300 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Описание
                      </label>
                      <Textarea
                        value={newHabit.description}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Опишите вашу привычку..."
                        className="bg-slate-700/50 border-cyan-400/30 text-white h-20 resize-none"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-cyan-300 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Выберите иконку
                      </label>
                      <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                        {HABIT_ICONS.map((icon, index) => (
                          <button
                            key={index}
                            onClick={() => setNewHabit(prev => ({ ...prev, icon }))}
                            className={`w-8 h-8 flex items-center justify-center rounded border-2 transition-colors ${
                              newHabit.icon === icon
                                ? 'border-cyan-400 bg-cyan-400/20'
                                : 'border-slate-600 hover:border-cyan-400/50'
                            }`}
                          >
                            <span className="text-lg">{icon}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-cyan-300 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Награда XP
                      </label>
                      <div className="flex space-x-2">
                        {[15, 25, 35, 50].map(xp => (
                          <button
                            key={xp}
                            onClick={() => setNewHabit(prev => ({ ...prev, xpReward: xp }))}
                            className={`px-3 py-1 rounded text-sm border transition-colors ${
                              newHabit.xpReward === xp
                                ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                                : 'border-slate-600 text-slate-400 hover:border-amber-400/50'
                            }`}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {xp} XP
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handleCreateCustomHabit}
                      className="w-full bg-cyan-600 hover:bg-cyan-500"
                      disabled={!newHabit.title.trim() || isLoading}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {isLoading ? 'Создание...' : 'Создать Привычку'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quests List */}
        <div className="space-y-3">
          {dailyQuests.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-50" />
              <p className="text-cyan-200 text-sm mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Пока нет ежедневных квестов
              </p>
              <p className="text-slate-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                Добавьте первую привычку, чтобы начать своё ежедневное приключение!
              </p>
            </div>
          ) : (
            dailyQuests.map((quest) => (
              <div
                key={quest.id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300 ${
                  quest.completed
                    ? 'bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 border-green-400/50'
                    : 'bg-gradient-to-r from-slate-700/50 via-slate-800/50 to-slate-700/50 border-cyan-400/30 hover:border-cyan-400/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <span className="text-2xl">⚡</span>
                    {quest.completed && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm ${quest.completed ? 'text-green-300 line-through' : 'text-white'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                      {quest.title}
                    </h3>
                    <p className={`text-xs ${quest.completed ? 'text-green-400/70' : 'text-slate-400'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                      {quest.description} • +{quest.xp_reward} XP
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleQuest(quest.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    quest.completed
                      ? 'bg-green-500 border-green-400 text-white'
                      : 'border-cyan-400 hover:bg-cyan-400/20 text-cyan-400'
                  }`}
                >
                  {quest.completed && <Check className="w-3 h-3" />}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Progress Summary */}
        {totalQuests > 0 && (
          <div className="mt-4 pt-4 border-t border-cyan-400/20">
            <div className="flex justify-between items-center text-xs text-cyan-300 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span>Ежедневный прогресс</span>
              <span>{Math.round((completedQuests / totalQuests) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedQuests / totalQuests) * 100}%` }}
              ></div>
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