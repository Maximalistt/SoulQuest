import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Check, X, Edit3, Save, Trash2, Settings, Globe, Users, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useSupabaseUser } from "../contexts/supabase-user-context";
import { SupabaseAPI, Project, Task } from "../utils/supabase/client";

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  onProjectUpdate: (updatedProject: Project) => void;
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

export function ProjectDetailPage({ project: initialProject, onBack, onProjectUpdate }: ProjectDetailPageProps) {
  const { user } = useSupabaseUser();
  const [project, setProject] = useState<Project>(initialProject);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editedProject, setEditedProject] = useState({
    title: project.title,
    description: project.description || '',
    privacy_level: project.privacy_level,
    status: project.status,
  });
  const [editTaskText, setEditTaskText] = useState('');

  useEffect(() => {
    loadTasks();
  }, [project.id]);

  const loadTasks = async () => {
    try {
      const projectTasks = await SupabaseAPI.getProjectTasks(project.id);
      setTasks(projectTasks);
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !user) return;

    try {
      const taskData = {
        project_id: project.id,
        user_id: user.id,
        title: newTask.title,
        description: newTask.description || null,
        completed: false,
      };

      await SupabaseAPI.createTask(taskData);
      await loadTasks();

      setNewTask({ title: '', description: '' });
      setIsAddTaskDialogOpen(false);
    } catch (error) {
      console.error('Ошибка создания задачи:', error);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const completed = !task.completed;
      await SupabaseAPI.updateTask(taskId, { 
        completed,
        ...(completed && { completed_at: new Date().toISOString() })
      });
      await loadTasks();
    } catch (error) {
      console.error('Ошибка обновления задачи:', error);
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTaskId(taskId);
      setEditTaskText(task.title);
    }
  };

  const handleSaveTask = async (taskId: string) => {
    if (!editTaskText.trim()) return;

    try {
      await SupabaseAPI.updateTask(taskId, { title: editTaskText });
      await loadTasks();
      setEditingTaskId(null);
    } catch (error) {
      console.error('Ошибка сохранения задачи:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await SupabaseAPI.deleteTask(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Ошибка удаления задачи:', error);
    }
  };

  const handleUpdateProject = async () => {
    try {
      const updatedProject = await SupabaseAPI.updateProject(project.id, {
        title: editedProject.title,
        description: editedProject.description || null,
        privacy_level: editedProject.privacy_level,
        status: editedProject.status,
      });
      
      setProject(updatedProject);
      onProjectUpdate(updatedProject);
      setIsSettingsDialogOpen(false);
    } catch (error) {
      console.error('Ошибка обновления проекта:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.')) {
      try {
        await SupabaseAPI.deleteProject(project.id);
        onBack();
      } catch (error) {
        console.error('Ошибка удаления проекта:', error);
      }
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

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const PrivacyIcon = getPrivacyIcon(project.privacy_level);

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
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
                  {project.title}
                </h1>
                <PrivacyIcon className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`text-sm ${getStatusColor(project.status)}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                  {getStatusLabel(project.status)}
                </span>
                <span className="text-sm text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {getPrivacyLabel(project.privacy_level)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-cyan-300">
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-cyan-400/30 text-white">
                <DialogHeader>
                  <DialogTitle className="text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
                    Настройки проекта
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-cyan-300 mb-2">Название</label>
                    <Input
                      value={editedProject.title}
                      onChange={(e) => setEditedProject(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-slate-700/50 border-cyan-400/30 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cyan-300 mb-2">Описание</label>
                    <Textarea
                      value={editedProject.description}
                      onChange={(e) => setEditedProject(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-slate-700/50 border-cyan-400/30 text-white h-20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cyan-300 mb-2">Приватность</label>
                    <Select
                      value={editedProject.privacy_level}
                      onValueChange={(value: any) => setEditedProject(prev => ({ ...prev, privacy_level: value }))}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-cyan-400/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-cyan-400/30">
                        {PRIVACY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-white">
                            <div className="flex items-center space-x-2">
                              <option.icon className="w-4 h-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm text-cyan-300 mb-2">Статус</label>
                    <Select
                      value={editedProject.status}
                      onValueChange={(value: any) => setEditedProject(prev => ({ ...prev, status: value }))}
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

                  <div className="flex space-x-2 pt-4">
                    <Button 
                      onClick={handleUpdateProject}
                      className="flex-1 bg-cyan-600 hover:bg-cyan-500"
                    >
                      Сохранить изменения
                    </Button>
                    <Button 
                      onClick={handleDeleteProject}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Удалить проект
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-500 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить задачу
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-cyan-400/30 text-white">
                <DialogHeader>
                  <DialogTitle className="text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
                    Новая задача
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-cyan-300 mb-2">Название задачи</label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Введите название задачи..."
                      className="bg-slate-700/50 border-cyan-400/30 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cyan-300 mb-2">Описание (опционально)</label>
                    <Textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Опишите задачу..."
                      className="bg-slate-700/50 border-cyan-400/30 text-white h-20 resize-none"
                    />
                  </div>

                  <Button 
                    onClick={handleAddTask}
                    className="w-full bg-cyan-600 hover:bg-cyan-500"
                    disabled={!newTask.title.trim()}
                  >
                    Создать задачу
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Project Description */}
        {project.description && (
          <div className="p-6 border-b border-cyan-400/20">
            <p className="text-slate-300" style={{ fontFamily: "'Inter', sans-serif" }}>
              {project.description}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="p-6 border-b border-cyan-400/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-cyan-300" style={{ fontFamily: "'Inter', sans-serif" }}>
              Прогресс проекта
            </span>
            <span className="text-sm text-amber-300" style={{ fontFamily: "'Inter', sans-serif" }}>
              {completedTasks}/{totalTasks} задач ({progress}%)
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="flex-1 p-6">
          <h2 className="text-xl text-amber-300 mb-4" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
            Задачи
          </h2>
          
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300 ${
                    task.completed
                      ? 'bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 border-green-400/50'
                      : 'bg-gradient-to-r from-slate-700/50 via-slate-800/50 to-slate-700/50 border-cyan-400/30 hover:border-cyan-400/60'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        task.completed
                          ? 'bg-green-500 border-green-400 text-white'
                          : 'border-cyan-400 hover:bg-cyan-400/20 text-cyan-400'
                      }`}
                    >
                      {task.completed && <Check className="w-3 h-3" />}
                    </button>
                    
                    <div className="flex-1">
                      {editingTaskId === task.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editTaskText}
                            onChange={(e) => setEditTaskText(e.target.value)}
                            className="bg-slate-700/50 border-cyan-400/30 text-white"
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveTask(task.id)}
                          />
                          <Button
                            onClick={() => handleSaveTask(task.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-500"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => setEditingTaskId(null)}
                            size="sm"
                            variant="ghost"
                            className="text-slate-400"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <h3 className={`text-sm ${task.completed ? 'text-green-300 line-through' : 'text-white'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className={`text-xs ${task.completed ? 'text-green-400/70' : 'text-slate-400'} mt-1`} style={{ fontFamily: "'Inter', sans-serif" }}>
                              {task.description}
                            </p>
                          )}
                          {task.completed_at && (
                            <p className="text-xs text-green-500 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                              Выполнено: {new Date(task.completed_at).toLocaleDateString('ru-RU')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!task.completed && editingTaskId !== task.id && (
                    <div className="flex space-x-1">
                      <Button
                        onClick={() => handleEditTask(task.id)}
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-cyan-300"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteTask(task.id)}
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-dashed border-cyan-400/40 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-cyan-400/60" />
              </div>
              <h3 className="text-lg text-cyan-300 mb-2" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
                Пока нет задач
              </h3>
              <p className="text-slate-400 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Добавьте первую задачу для этого проекта!
              </p>
              <Button
                onClick={() => setIsAddTaskDialogOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить задачу
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}