import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Folder, Globe, Users, Lock, Search, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useSupabaseUser } from "../contexts/supabase-user-context";
import { SupabaseAPI, Project } from "../utils/supabase/client";

interface ProjectsListPageProps {
  onBack: () => void;
  onProjectClick: (project: Project) => void;
}

const PRIVACY_OPTIONS = [
  { value: 'private', label: 'Приватный', description: 'Только вы видите проект', icon: Lock },
  { value: 'friends_only', label: 'Для друзей', description: 'Видят только ваши друзья', icon: Users },
  { value: 'public_project_only', label: 'Только название', description: 'Все видят название, но не задачи', icon: Globe },
  { value: 'public_full', label: 'Полностью публичный', description: 'Все видят проект и задачи', icon: Globe },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Активный' },
  { value: 'paused', label: 'Приостановлен' },
  { value: 'completed', label: 'Завершён' },
];

export function ProjectsListPage({ onBack, onProjectClick }: ProjectsListPageProps) {
  const { user } = useSupabaseUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    privacy_level: 'private' as const,
    status: 'active' as const,
  });

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, statusFilter]);

  const loadProjects = async () => {
    if (!user) return;
    
    try {
      const userProjects = await SupabaseAPI.getUserProjects(user.id);
      setProjects(userProjects);
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleCreateProject = async () => {
    if (!newProject.title.trim() || !user) return;

    setIsLoading(true);
    try {
      const projectData = {
        user_id: user.id,
        title: newProject.title,
        description: newProject.description || null,
        privacy_level: newProject.privacy_level,
        status: newProject.status,
      };

      await SupabaseAPI.createProject(projectData);
      await loadProjects();

      setNewProject({
        title: '',
        description: '',
        privacy_level: 'private',
        status: 'active',
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Ошибка создания проекта:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPrivacyIcon = (privacyLevel: string) => {
    const option = PRIVACY_OPTIONS.find(opt => opt.value === privacyLevel);
    return option?.icon || Lock;
  };

  const getPrivacyLabel = (privacyLevel: string) => {
    const option = PRIVACY_OPTIONS.find(opt => opt.value === privacyLevel);
    return option?.label || 'Приватный';
  };

  const getStatusLabel = (status: string) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status);
    return option?.label || 'Неизвестно';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'paused':
        return 'text-amber-400';
      case 'completed':
        return 'text-cyan-400';
      default:
        return 'text-slate-400';
    }
  };

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
            <h1 className="text-2xl text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
              Мои Проекты
            </h1>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-600 hover:bg-cyan-500 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Создать проект
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-cyan-400/30 text-white">
              <DialogHeader>
                <DialogTitle className="text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
                  Создать новый проект
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-cyan-300 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Название проекта
                  </label>
                  <Input
                    value={newProject.title}
                    onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Введите название проекта..."
                    className="bg-slate-700/50 border-cyan-400/30 text-white"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-sm text-cyan-300 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Описание
                  </label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Опишите ваш проект..."
                    className="bg-slate-700/50 border-cyan-400/30 text-white h-20 resize-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-sm text-cyan-300 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Приватность
                  </label>
                  <Select
                    value={newProject.privacy_level}
                    onValueChange={(value: any) => setNewProject(prev => ({ ...prev, privacy_level: value }))}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-cyan-400/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-cyan-400/30">
                      {PRIVACY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white">
                          <div className="flex items-center space-x-2">
                            <option.icon className="w-4 h-4" />
                            <div>
                              <div>{option.label}</div>
                              <div className="text-xs text-slate-400">{option.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-cyan-300 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Статус
                  </label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value: any) => setNewProject(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-cyan-400/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-cyan-400/30">
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleCreateProject}
                  className="w-full bg-cyan-600 hover:bg-cyan-500"
                  disabled={!newProject.title.trim() || isLoading}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {isLoading ? 'Создание...' : 'Создать проект'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="p-6 space-y-4">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск проектов..."
                className="pl-10 bg-slate-700/50 border-cyan-400/30 text-white"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-700/50 border-cyan-400/30 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-cyan-400/30">
                <SelectItem value="all" className="text-white">Все статусы</SelectItem>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 px-6 pb-6">
          {filteredProjects.length > 0 ? (
            <div className="space-y-4">
              {filteredProjects.map((project) => {
                const PrivacyIcon = getPrivacyIcon(project.privacy_level);
                
                return (
                  <div
                    key={project.id}
                    onClick={() => onProjectClick(project)}
                    className="bg-gradient-to-r from-slate-700/50 via-slate-800/50 to-slate-700/50 border border-cyan-400/30 rounded-lg p-4 hover:border-cyan-400/60 hover:bg-slate-700/60 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Folder className="w-6 h-6 text-amber-400 mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {project.title}
                            </h3>
                            <PrivacyIcon className="w-4 h-4 text-slate-400" />
                          </div>
                          {project.description && (
                            <p className="text-sm text-slate-300 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {project.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-xs">
                            <span className={`${getStatusColor(project.status)}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                              {getStatusLabel(project.status)}
                            </span>
                            <span className="text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {getPrivacyLabel(project.privacy_level)}
                            </span>
                            <span className="text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {new Date(project.created_at).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl text-cyan-300 mb-2" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
                {searchQuery || statusFilter !== 'all' ? 'Проекты не найдены' : 'Пока нет проектов'}
              </h3>
              <p className="text-slate-400 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                {searchQuery || statusFilter !== 'all' 
                  ? 'Попробуйте изменить критерии поиска'
                  : 'Создайте первый проект для достижения ваших целей!'
                }
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Создать первый проект
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}