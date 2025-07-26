import { ImageWithFallback } from "./figma/ImageWithFallback";
import lianaImage from "figma:asset/343b269d6d9b3a58c2940c9b56c2397ebe472230.png";
import cassianImage from "figma:asset/5f9b659d21f2c28e10a8cb8207215ff461ed605b.png";
import orionImage from "figma:asset/990c4a41efa1abda12826038fbb083506e453c0d.png";
import terraImage from "figma:asset/284b38a7b6fa2b0289db2f2575e6c2fdc4531e21.png";

interface Advisor {
  id: number;
  name: string;
  title: string;
  description: string;
  image: string;
  fallback: string;
  specialty: string;
}

interface AdvisorsCardProps {
  onAdvisorClick: (advisor: Advisor) => void;
}

const advisors: Advisor[] = [
  {
    id: 1,
    name: "Лиана",
    title: "Хранительница Душевных Путей",
    description: "Мудрый Психолог",
    image: lianaImage,
    fallback: "🧝‍♀️",
    specialty: "psychology"
  },
  {
    id: 2,
    name: "Кассиан", 
    title: "Архитектор Судьбы",
    description: "Стратегический Советник",
    image: cassianImage,
    fallback: "🧙‍♂️",
    specialty: "strategy"
  },
  {
    id: 3,
    name: "Орион",
    title: "Звёздный Бард",
    description: "Мастер Личного Бренда",
    image: orionImage, 
    fallback: "🎭",
    specialty: "marketing"
  },
  {
    id: 4,
    name: "Терра",
    title: "Мастер Жизненной Силы",
    description: "Наставник Жизненного Баланса",
    image: terraImage,
    fallback: "🌿",
    specialty: "wellness"
  }
];

export function AdvisorsCard({ onAdvisorClick }: AdvisorsCardProps) {
  const handleAdvisorClick = (advisor: Advisor) => {
    onAdvisorClick(advisor);
  };

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-amber-400/5 rounded-lg blur-sm"></div>
      
      <div className="relative bg-gradient-to-r from-amber-100/10 via-amber-50/5 to-amber-100/10 border-2 border-cyan-400/30 rounded-lg p-6 backdrop-blur-sm">
        {/* Header */}
        <div className="relative mb-6">
          <div className="bg-gradient-to-r from-transparent via-amber-600/20 to-transparent border border-amber-400/40 rounded px-4 py-2 text-center">
            <h2 className="text-lg text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
              Круг Советников
            </h2>
          </div>
        </div>
        
        {/* Advisors Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          {advisors.map((advisor) => (
            <button
              key={advisor.id}
              onClick={() => handleAdvisorClick(advisor)}
              className="relative group aspect-[3/4] rounded-lg overflow-hidden border-2 border-cyan-400/30 bg-gradient-to-b from-slate-700 to-slate-800 transition-all duration-300 hover:border-cyan-400/60 hover:scale-105 active:scale-95"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              
              {/* Character Portrait - 80% */}
              <div className="relative h-4/5 w-full">
                <ImageWithFallback
                  src={advisor.image}
                  alt={`${advisor.name} - ${advisor.title}`}
                  className="w-full h-full object-cover"
                  fallback={
                    <div className="w-full h-full bg-gradient-to-br from-amber-600/30 via-cyan-600/20 to-slate-700 flex items-center justify-center text-6xl">
                      {advisor.fallback}
                    </div>
                  }
                />
                
                {/* Subtle magical particles */}
                <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
                <div className="absolute bottom-4 left-2 w-1 h-1 bg-amber-400 rounded-full animate-pulse delay-500 opacity-60"></div>
              </div>
              
              {/* Text Overlay - 20% */}
              <div className="relative h-1/5 w-full bg-gradient-to-t from-slate-900/95 via-slate-800/80 to-transparent flex flex-col justify-center px-3">
                <h3 className="text-amber-300 text-sm truncate" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
                  {advisor.name}
                </h3>
                <p className="text-cyan-300 text-xs truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {advisor.title}
                </p>
              </div>
              
              {/* Magical border decorations */}
              <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Glow effect on corners */}
              <div className="absolute top-0 left-0 w-3 h-3 bg-cyan-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 w-3 h-3 bg-amber-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 bg-amber-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          ))}
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

export type { Advisor };