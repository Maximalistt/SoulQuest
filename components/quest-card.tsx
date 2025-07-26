import { LucideIcon, Coins, Star, Package, Check } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

interface QuestReward {
  type: "gold" | "xp" | "item";
  amount?: number;
  name?: string;
}

interface Quest {
  id: number;
  title: string;
  icon: LucideIcon;
  rewards: QuestReward[];
  completed: boolean;
}

interface QuestCardProps {
  quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
  const { title, icon: Icon, rewards, completed } = quest;

  return (
    <div className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
      completed 
        ? 'border-emerald-500 bg-gradient-to-r from-emerald-900/20 to-emerald-800/20' 
        : 'border-cyan-400 bg-gradient-to-r from-cyan-900/20 to-slate-800/40 hover:border-cyan-300'
    }`}>
      {/* Background glow */}
      <div className={`absolute inset-0 rounded-lg opacity-10 blur-sm ${
        completed ? 'bg-emerald-400' : 'bg-cyan-400'
      }`}></div>
      
      <div className="relative flex items-center gap-4">
        {/* Quest Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 flex items-center justify-center ${
          completed 
            ? 'border-emerald-400 bg-emerald-900/30' 
            : 'border-cyan-400 bg-cyan-900/30'
        }`}>
          <Icon className={`w-6 h-6 ${
            completed ? 'text-emerald-400' : 'text-cyan-400'
          }`} />
        </div>
        
        {/* Quest Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm mb-2 ${
            completed ? 'text-emerald-300 line-through' : 'text-white'
          }`}>{title}</h3>
          
          {/* Rewards */}
          <div className="flex items-center gap-3 text-xs">
            {rewards.map((reward, index) => (
              <div key={index} className="flex items-center gap-1 text-amber-300">
                {reward.type === "gold" && (
                  <>
                    <Coins className="w-3 h-3" />
                    <span>{reward.amount}</span>
                  </>
                )}
                {reward.type === "xp" && (
                  <>
                    <Star className="w-3 h-3" />
                    <span>{reward.amount} XP</span>
                  </>
                )}
                {reward.type === "item" && (
                  <>
                    <Package className="w-3 h-3" />
                    <span className="truncate">{reward.name}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Checkbox */}
        <div className="flex-shrink-0">
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
            completed 
              ? 'border-emerald-400 bg-emerald-400' 
              : 'border-cyan-400 bg-transparent'
          }`}>
            {completed && <Check className="w-4 h-4 text-slate-900" />}
          </div>
        </div>
      </div>
      
      {/* Runic corner decorations */}
      <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-cyan-400 opacity-50"></div>
      <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-cyan-400 opacity-50"></div>
      <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-cyan-400 opacity-50"></div>
      <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-cyan-400 opacity-50"></div>
    </div>
  );
}