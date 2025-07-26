import { useState, useEffect } from "react";
import { ArrowLeft, Search, Users, UserPlus, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useSupabaseUser } from "../contexts/supabase-user-context";
import { SupabaseAPI, User } from "../utils/supabase/client";

interface CommunityPageProps {
  onBack: () => void;
}

export function CommunityPage({ onBack }: CommunityPageProps) {
  const { user } = useSupabaseUser();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [allUsers, searchQuery]);

  const loadUsers = async () => {
    try {
      // Note: This would need a custom API endpoint to get all users
      // For now, we'll create mock data to demonstrate the UI
      const mockUsers: User[] = [
        {
          id: '1',
          telegram_id: '123456',
          first_name: 'Алексей',
          last_name: 'Мудрый',
          username: 'alex_wise',
          avatar_url: null,
          level: 5,
          total_xp: 475,
          streak_days: 12,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T10:00:00Z'
        },
        {
          id: '2',
          telegram_id: '789012',
          first_name: 'Мария',
          last_name: 'Искательница',
          username: 'maria_seeker',
          avatar_url: null,
          level: 3,
          total_xp: 280,
          streak_days: 7,
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-19T10:00:00Z'
        },
        {
          id: '3',
          telegram_id: '345678',
          first_name: 'Дмитрий',
          last_name: 'Воин',
          username: 'dmitry_warrior',
          avatar_url: null,
          level: 7,
          total_xp: 680,
          streak_days: 25,
          created_at: '2024-01-05T10:00:00Z',
          updated_at: '2024-01-21T10:00:00Z'
        },
        {
          id: '4',
          telegram_id: '901234',
          first_name: 'Елена',
          last_name: 'Целительница',
          username: 'elena_healer',
          avatar_url: null,
          level: 4,
          total_xp: 360,
          streak_days: 15,
          created_at: '2024-01-12T10:00:00Z',
          updated_at: '2024-01-20T10:00:00Z'
        },
        {
          id: '5',
          telegram_id: '567890',
          first_name: 'Игорь',
          last_name: 'Странник',
          username: 'igor_wanderer',
          avatar_url: null,
          level: 6,
          total_xp: 580,
          streak_days: 30,
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-21T10:00:00Z'
        }
      ];

      // Filter out current user
      const otherUsers = mockUsers.filter(u => u.id !== user?.id);
      setAllUsers(otherUsers);
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(allUsers);
      return;
    }

    const filtered = allUsers.filter(u =>
      u.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  const handleAddFriend = async (userId: string) => {
    if (!user) return;

    try {
      await SupabaseAPI.createFriendship({
        requester_id: user.id,
        addressee_id: userId,
        status: 'pending'
      });
      
      // You might want to show a success message here
      console.log('Запрос на добавление в друзья отправлен');
    } catch (error) {
      console.error('Ошибка отправки запроса дружбы:', error);
    }
  };

  const getLevelTitle = (level: number) => {
    if (level <= 2) return 'Новичок';
    if (level <= 4) return 'Искатель';
    if (level <= 6) return 'Путешественник';
    if (level <= 8) return 'Мастер';
    return 'Мудрец';
  };

  const getLevelColor = (level: number) => {
    if (level <= 2) return 'text-slate-400';
    if (level <= 4) return 'text-green-400';
    if (level <= 6) return 'text-blue-400';
    if (level <= 8) return 'text-purple-400';
    return 'text-amber-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
            Загрузка сообщества...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.15),transparent_60%)] pointer-events-none"></div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-400/20">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
                Сообщество SoulQuest
              </h1>
              <p className="text-sm text-cyan-200" style={{ fontFamily: "'Inter', sans-serif" }}>
                Найдите единомышленников в вашем путешествии
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Users className="w-5 h-5" />
            <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              {allUsers.length} участников
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени или username..."
              className="pl-10 bg-slate-700/50 border-cyan-400/30 text-white"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 px-6 pb-6">
          {filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((otherUser) => (
                <div
                  key={otherUser.id}
                  className="bg-gradient-to-r from-slate-700/50 via-slate-800/50 to-slate-700/50 border border-cyan-400/30 rounded-lg p-4 hover:border-cyan-400/60 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-cyan-400/50 p-1">
                        <ImageWithFallback
                          src={otherUser.avatar_url}
                          alt={`${otherUser.first_name} ${otherUser.last_name || ''}`}
                          className="w-full h-full rounded-full object-cover"
                          fallback={
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-2xl">
                              🧙‍♂️
                            </div>
                          }
                        />
                      </div>
                      {/* Level indicator */}
                      <div className="absolute -bottom-1 -right-1 bg-slate-800 border-2 border-cyan-400 rounded-full px-2 py-1">
                        <span className="text-xs text-cyan-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {otherUser.level}
                        </span>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {otherUser.first_name} {otherUser.last_name || ''}
                        </h3>
                        <span className={`text-sm ${getLevelColor(otherUser.level)}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                          {getLevelTitle(otherUser.level)}
                        </span>
                      </div>
                      
                      {otherUser.username && (
                        <p className="text-sm text-slate-400 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                          @{otherUser.username}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <span style={{ fontFamily: "'Inter', sans-serif" }}>
                          XP: {otherUser.total_xp}
                        </span>
                        <span style={{ fontFamily: "'Inter', sans-serif" }}>
                          Серия: {otherUser.streak_days} дней
                        </span>
                        <span style={{ fontFamily: "'Inter', sans-serif" }}>
                          С нами с {new Date(otherUser.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleAddFriend(otherUser.id)}
                        size="sm"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Добавить
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-cyan-300 hover:bg-cyan-400/10"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl text-cyan-300 mb-2" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
                {searchQuery ? 'Пользователи не найдены' : 'Нет пользователей'}
              </h3>
              <p className="text-slate-400 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                {searchQuery 
                  ? 'Попробуйте изменить критерии поиска'
                  : 'Сообщество пока пустое. Пригласите друзей!'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}