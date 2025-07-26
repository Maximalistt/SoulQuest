import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
)

// Database Types
export interface User {
  id: string
  telegram_id: string
  username?: string
  first_name: string
  last_name?: string
  avatar_url?: string
  level: number
  total_xp: number
  streak_days: number
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  city?: string
  birth_date?: string
  zodiac_sign?: string
  profession?: string
  mbti_type?: string
  human_design_type?: string
  human_design_profile?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  description?: string
  status: 'active' | 'completed' | 'paused'
  privacy_level: 'private' | 'public_project_only' | 'public_full' | 'friends_only'
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id: string
  user_id: string
  title: string
  description?: string
  completed: boolean
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface DailyQuest {
  id: string
  user_id: string
  quest_type: string
  title: string
  description?: string
  completed: boolean
  xp_reward: number
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  user_id: string
  title: string
  description?: string
  category: string
  date_achieved: string
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  ai_plan?: string
  status: 'active' | 'completed' | 'paused'
  target_date?: string
  created_at: string
  updated_at: string
}

export interface Friendship {
  id: string
  requester_id: string
  addressee_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

// API Functions
export class SupabaseAPI {
  // User operations
  static async createUser(userData: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getUserByTelegramId(telegramId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // User Profile operations
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async createUserProfile(profileData: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profileData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Project operations
  static async getUserProjects(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async createProject(projectData: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateProject(projectId: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteProject(projectId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
    
    if (error) throw error
  }

  // Task operations
  static async getProjectTasks(projectId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async createTask(taskData: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateTask(taskId: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteTask(taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
    
    if (error) throw error
  }

  // Daily Quest operations
  static async getUserDailyQuests(userId: string) {
    const { data, error } = await supabase
      .from('daily_quests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async createDailyQuest(questData: Partial<DailyQuest>) {
    const { data, error } = await supabase
      .from('daily_quests')
      .insert([questData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateDailyQuest(questId: string, updates: Partial<DailyQuest>) {
    const { data, error } = await supabase
      .from('daily_quests')
      .update(updates)
      .eq('id', questId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteDailyQuest(questId: string) {
    const { error } = await supabase
      .from('daily_quests')
      .delete()
      .eq('id', questId)
    
    if (error) throw error
  }

  // Achievement operations
  static async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('date_achieved', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async createAchievement(achievementData: Partial<Achievement>) {
    const { data, error } = await supabase
      .from('achievements')
      .insert([achievementData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Goal operations
  static async getUserGoals(userId: string) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async createGoal(goalData: Partial<Goal>) {
    const { data, error } = await supabase
      .from('goals')
      .insert([goalData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateGoal(goalId: string, updates: Partial<Goal>) {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Friendship operations
  static async getUserFriends(userId: string) {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        *,
        requester:users!friendships_requester_id_fkey(*),
        addressee:users!friendships_addressee_id_fkey(*)
      `)
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', 'accepted')
    
    if (error) throw error
    return data || []
  }

  static async createFriendship(friendshipData: Partial<Friendship>) {
    const { data, error } = await supabase
      .from('friendships')
      .insert([friendshipData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateFriendship(friendshipId: string, updates: Partial<Friendship>) {
    const { data, error } = await supabase
      .from('friendships')
      .update(updates)
      .eq('id', friendshipId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}