import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Advisor } from "./advisors-card";

interface ChatPageProps {
  advisor: Advisor;
  onBack: () => void;
}

export function ChatPage({ advisor, onBack }: ChatPageProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Приветствую, искатель! Я ${advisor.name}, ${advisor.title}. Как я могу направить тебя в твоём мистическом путешествии сегодня?`,
      isAdvisor: true,
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      isAdvisor: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    // Simulate advisor response
    setTimeout(() => {
      const responses = [
        "Я чувствую твою жажду мудрости. Позволь мне поразмыслить и дать тебе совет...",
        "Твой вопрос глубок и требует осмысления. Вот что я думаю...",
        "В древних свитках я нашёл ответ на твой вопрос...",
        "Звёзды шепчут мне о твоём пути. Слушай внимательно...",
        "Мудрость веков подсказывает мне следующее..."
      ];
      
      const response = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        isAdvisor: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.15),transparent_60%)] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b-2 border-cyan-400/30 bg-slate-900/80 backdrop-blur-sm">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="text-cyan-400 hover:text-cyan-300"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400/50">
            <ImageWithFallback
              src={advisor.image}
              alt={advisor.name}
              className="w-full h-full object-cover"
              fallback={
                <div className="w-full h-full bg-gradient-to-br from-amber-500 to-slate-700 flex items-center justify-center text-lg">
                  {advisor.fallback}
                </div>
              }
            />
          </div>
          <div>
            <h1 className="text-amber-300" style={{ fontFamily: "'Loreley Antiqua', cursive" }}>
              {advisor.name}
            </h1>
            <p className="text-xs text-cyan-300" style={{ fontFamily: "'Inter', sans-serif" }}>
              {advisor.title}
            </p>
          </div>
        </div>

        <div className="w-10"></div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isAdvisor ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.isAdvisor
                  ? 'bg-gradient-to-r from-amber-600/20 to-cyan-600/20 border border-amber-400/30 text-amber-100'
                  : 'bg-gradient-to-r from-cyan-600/20 to-slate-600/20 border border-cyan-400/30 text-cyan-100'
              }`}
            >
              <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                {msg.text}
              </p>
              <p className="text-xs opacity-60 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="relative z-10 p-4 border-t-2 border-cyan-400/30 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Задайте вопрос для получения совета..."
            className="flex-1 bg-slate-700/50 border-cyan-400/30 text-white"
            style={{ fontFamily: "'Inter', sans-serif" }}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-cyan-600 hover:bg-cyan-500"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}