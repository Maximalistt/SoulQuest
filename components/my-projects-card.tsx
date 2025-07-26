import { Plus, Folder, Globe, Users, Lock, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useSupabaseUser } from "../contexts/supabase-user-context";
import { SupabaseAPI, Project } from "../utils/supabase/client";

interface MyProjectsCardProps {
  onProjectsClick: () => void;
}

const getPrivacyIcon = (privacyLevel: string) => {
  switch (privacyLevel) {
    case 'public_full':
    case 'public_project_only':
      return Globe;
    case 'friends_only':
      return Users;
    case 'private':
    default:
      return Lock;
  }
};

const getPrivacyLabel = (privacyLevel: string) => {
  switch (privacyLevel) {
    case 'public_full':
      return 'Публичный';
    case 'public_project_only':
      return 'Только название';
    case 'friends_only':
      return 'Для друзей';
    case 'private':
    default:
      return 'Приватный';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Активный';
    case 'completed':
      return 'Завершён';
    case 'paused':
      return 'Приостановлен';
    default:
      return 'Неизвестно';
  }
};

export function MyProjectsCard({ onProjectsClick }: MyProjectsCardProps) {
  const { user } = useSupabaseUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsWithTasks, setProjectsWithTasks] = useState<Array<Project & { taskCount: number; completedTasks: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if user has a valid UUID (database mode) or fallback to in-memory mode
      if (user.id.includes('-')) {
        const userProjects = await SupabaseAPI.getUserProjects(user.id);
        const activeProjects = userProjects
          .filter(project => project.status === 'active')
          .slice(0, 3); // Show only top 3 active projects
        
        setProjects(activeProjects);

        // Load task counts for each project
        const projectsWithTaskData = await Promise.all(
          activeProjects.map(async (project) => {
            try {
              const tasks = await SupabaseAPI.getProjectTasks(project.id);
              const completedTasks = tasks.filter(task => task.completed).length;
              return {
                ...project,
                taskCount: tasks.length,
                completedTasks
              };
            } catch (error) {
              console.error(`Ошибка загрузки задач для проекта ${project.id}:`, error);
              return {
                ...project,
                taskCount: 0,
                completedTasks: 0
              };
            }
          })
        );

        setProjectsWithTasks(projectsWithTaskData);
      } else {
        // In-memory mode fallback - create mock projects
        const mockProjects = [
          {
            id: 'mock-project-1',
            user_id: user.id,
            title: 'Изучение React',
            description: 'Освоение современного фронтенд-разработки',
            status: 'active' as const,
            privacy_level: 'private' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            taskCount: 5,
            completedTasks: 2
          },
          {
            id: 'mock-project-2',
            user_id: user.id,
            title: 'Фитнес программа',
            description: 'Поддержание здорового образа жизни',
            status: 'active' as const,
            privacy_level: 'friends_only' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            taskCount: 3,
            completedTasks: 1
          }
        ];
        
        setProjects(mockProjects);
        setProjectsWithTasks(mockProjects);
      }
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
      setError('Не удалось загрузить проекты');
      
      // Fallback to empty state
      setProjects([]);
      setProjectsWithTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-amber-400/5 rounded-lg blur-sm"></div>
      
      <div className="relative bg-gradient-to-r from-amber-100/10 via-amber-50/5 to-amber-100/10 border-2 border-cyan-400/30 rounded-lg p-6 backdrop-blur-sm">
        {/* Header */}
        <div className="relative mb-4">
          <div className="bg-gradient-to-r from-transparent via-amber-600/20 to-transparent border border-amber-400/40 rounded px-4 py-2 flex items-center justify-between">
            <h2 className="text-lg text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
              Мои Проекты
            </h2>
            <button
              onClick={onProjectsClick}
              className="h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-md transition-colors flex items-center justify-center"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-6">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-cyan-200 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Загрузка проектов...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <Folder className="w-12 h-12 text-red-400 mx-auto mb-3 opacity-50" />
              <p className="text-red-300 text-sm mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                {error}
              </p>
              <button
                onClick={loadProjects}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Попробовать снова
              </button>
            </div>
          ) : projectsWithTasks.length > 0 ? (
            projectsWithTasks.map((project, index) => {
              const PrivacyIcon = getPrivacyIcon(project.privacy_level);
              const progress = getProgressPercentage(project.completedTasks, project.taskCount);
              
              return (
                <div key={project.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-cyan-400/20 hover:border-cyan-400/40 transition-colors">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <Folder className={`w-5 h-5 ${
                        index === 0 ? 'text-amber-400' : 
                        index === 1 ? 'text-purple-400' : 'text-green-400'
                      }`} />
                      <PrivacyIcon className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-white truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {getStatusLabel(project.status)}
                        </p>
                        <span className="text-xs text-slate-500">•</span>
                        <p className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {getPrivacyLabel(project.privacy_level)}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {project.completedTasks}/{project.taskCount} задач выполнено
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    <div className="text-xs text-cyan-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {progress}%
                    </div>
                    <div className="w-16 h-1 bg-slate-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6">
              <Folder className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-50" />
              <p className="text-cyan-200 text-sm mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Пока нет активных проектов
              </p>
              <p className="text-slate-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                Создайте первый проект для достижения ваших целей!
              </p>
            </div>
          )}

          <button
            onClick={onProjectsClick}
            className="w-full py-3 border-2 border-dashed border-cyan-400/40 rounded-lg text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-400/5 transition-colors text-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {projectsWithTasks.length > 0 ? 'Посмотреть все проекты' : 'Создать первый проект'}
          </button>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-cyan-400/50"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-cyan-400/50"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-cyan-400/50"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-cyan-400/50"></div>
      </div>
    </div>
  );
}