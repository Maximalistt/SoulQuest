import { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface WelcomePageProps {
  onStartJourney: () => void;
}

export function WelcomePage({ onStartJourney }: WelcomePageProps) {
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const handleStartJourney = () => {
    if (agreedToPrivacy) {
      onStartJourney();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.15),transparent_60%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.1),transparent_50%)] pointer-events-none"></div>

      {/* Floating magical particles */}
      <div className="absolute top-10 left-8 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-12 w-1 h-1 bg-amber-400 rounded-full animate-pulse delay-300"></div>
      <div className="absolute top-64 left-16 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
      <div className="absolute bottom-32 right-8 w-1 h-1 bg-amber-400 rounded-full animate-pulse delay-500"></div>

      {/* Magical corner ornaments */}
      <div className="absolute top-6 left-6 w-8 h-8">
        <div className="absolute top-0 left-0 w-4 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
        <div className="absolute top-0 left-0 w-0.5 h-4 bg-gradient-to-b from-cyan-400 to-transparent"></div>
      </div>
      <div className="absolute top-6 right-6 w-8 h-8">
        <div className="absolute top-0 right-0 w-4 h-0.5 bg-gradient-to-l from-cyan-400 to-transparent"></div>
        <div className="absolute top-0 right-0 w-0.5 h-4 bg-gradient-to-b from-cyan-400 to-transparent"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Main Logo/Symbol */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-cyan-400 p-4 bg-gradient-to-br from-cyan-400/20 via-transparent to-amber-400/10 flex items-center justify-center">
            <div className="text-6xl">🌟</div>
            
            {/* Runic decorations */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-2 border-cyan-400 rounded-full bg-slate-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 border-2 border-cyan-400 rounded-full bg-slate-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-2 border-cyan-400 rounded-full bg-slate-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-400"></div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-2 border-cyan-400 rounded-full bg-slate-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-600"></div>
            </div>
          </div>
        </div>

        {/* Welcome Title */}
        <h1 
          className="text-4xl text-amber-300 mb-6 tracking-wider"
          style={{
            fontFamily: "'Loreley Antiqua', cursive",
          }}
        >
          Добро пожаловать в
        </h1>
        
        <h2 
          className="text-5xl text-cyan-400 mb-8 tracking-wider"
          style={{
            fontFamily: "'Loreley Antiqua', cursive",
          }}
        >
          SoulQuest
        </h2>

        {/* Description */}
        <div className="max-w-md mx-auto mb-8 space-y-4">
          <p className="text-lg text-cyan-200" style={{ fontFamily: "'Inter', sans-serif" }}>
            Магическая платформа для личностного роста и развития
          </p>
          
          <div className="bg-gradient-to-r from-transparent via-slate-800/40 to-transparent border border-cyan-400/20 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-cyan-300 text-sm mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Здесь вы найдёте:
            </p>
            <ul className="text-slate-300 text-sm space-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              <li>• Систему ежедневных квестов</li>
              <li>• Управление проектами и задачами</li>
              <li>• Круг мудрых советников</li>
              <li>• Достижения и прогресс</li>
              <li>• Социальные функции</li>
            </ul>
          </div>
        </div>

        {/* Privacy Agreement */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-lg border border-cyan-400/20">
            <Checkbox 
              id="privacy-agreement"
              checked={agreedToPrivacy}
              onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
              className="mt-1"
            />
            <label 
              htmlFor="privacy-agreement" 
              className="text-sm text-slate-300 cursor-pointer" 
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Я соглашаюсь с{" "}
              <a 
                href="/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                политикой конфиденциальности
              </a>
              {" "}и готов начать своё путешествие
            </label>
          </div>
        </div>

        {/* Start Journey Button */}
        <Button
          onClick={handleStartJourney}
          disabled={!agreedToPrivacy}
          className="bg-gradient-to-r from-cyan-600 to-amber-600 hover:from-cyan-500 hover:to-amber-500 text-white text-lg py-6 px-12 rounded-lg border-2 border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
          style={{
            fontFamily: "'Loreley Antiqua', cursive",
          }}
        >
          <span className="flex items-center space-x-2">
            <span>✨</span>
            <span>Начать Путешествие</span>
            <span>🌟</span>
          </span>
        </Button>

        {/* Decorative elements */}
        <div className="absolute bottom-20 left-10 w-3 h-3 border-2 border-amber-400/50 rounded-full"></div>
        <div className="absolute bottom-40 right-16 w-2 h-2 bg-cyan-400/50 rounded-full"></div>
        <div className="absolute top-40 left-20 w-2 h-2 bg-amber-400/50 rounded-full"></div>
      </div>

      {/* Bottom decorative line */}
      <div className="relative z-10 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
    </div>
  );
}