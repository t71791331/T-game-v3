"use client";

import React, { useState } from 'react';

const CARDS = [
  { id: 1, question: "Какая старая привычка мешает вам двигаться вперед?", image: "/card1.png" },
  { id: 2, question: "Что для вас сейчас является самым главным источником силы?", image: "/card2.png" },
  { id: 3, question: "Какую роль в вашей жизни играют ваши отношения с близкими?", image: "/card3.png" },
  { id: 4, question: "Какой смелый шаг вы откладываете уже долгое время?", image: "/card4.png" },
  { id: 5, question: "Если бы ваш страх был вашим учителем, чему бы он вас научил?", image: "/card5.png" },
  { id: 6, question: "Какую часть себя вы игнорируете ради одобрения окружающих?", image: "/card6.png" },
  { id: 7, question: "Что произойдет, если вы перестанете всё контролировать?", image: "/card7.png" },
  { id: 8, question: "Какое событие из прошлого до сих пор забирает вашу энергию?", image: "/card8.png" },
  { id: 9, question: "В чем ваша истинная уникальность, которую вы боитесь проявлять?", image: "/card9.png" },
  { id: 10, question: "Если бы успех был гарантирован, чем бы вы занялись завтра?", image: "/card10.png" },
  { id: 11, question: "Кому или чему вам нужно сказать твердое 'Нет' прямо сейчас?", image: "/card11.png" },
  { id: 12, question: "Какое маленькое действие сегодня принесет вам радость?", image: "/card12.png" },
  { id: 13, question: "За что вы можете поблагодарить свое тело сегодня?", image: "/card13.png" },
  { id: 14, question: "Что в вашем окружении тянет вас назад, а что вдохновляет?", image: "/card14.png" },
  { id: 15, question: "Если бы вы были своим лучшим другом, какой совет вы бы себе дали?", image: "/card15.png" },
  { id: 16, question: "Какой талант вы зарыли в землю и почему?", image: "/card16.png" },
  { id: 17, question: "Что заставляет вас чувствовать себя по-настоящему живым?", image: "/card17.png" },
  { id: 18, question: "Какую маску вы носите чаще всего и что она скрывает?", image: "/card18.png" },
  { id: 19, question: "Что вы готовы отпустить, чтобы освободить место для нового?", image: "/card19.png" },
  { id: 20, question: "Если бы вы могли встретить себя через 10 лет, что бы вы услышали?", image: "/card20.png" }
];

export default function Game() {
  const [gameState, setGameState] = useState<'welcome' | 'playing' | 'final'>('welcome');
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState<{question: string, answer: string, comment: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [finalAnalysis, setFinalAnalysis] = useState('');

  // Стили для золотых элементов
  const goldText = "text-[#D4AF37] shadow-sm"; 
  const goldButton = "bg-[#D4AF37] text-black hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]";

  const handleNextStep = async () => {
    if (!answer) return;
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answer, 
          history, 
          availableCards: CARDS.filter(c => !history.find(h => h.question === c.question)),
          isFinal: history.length === 4
        }),
      });
      const data = await response.json();
      
      const newHistoryItem = { question: currentCard.question, answer, comment: data.comment };
      const updatedHistory = [...history, newHistoryItem];
      setHistory(updatedHistory);

      if (updatedHistory.length === 5) {
        setFinalAnalysis(data.comment);
        setGameState('final');
      } else {
        const nextCardId = data.nextCardId || CARDS[Math.floor(Math.random() * CARDS.length)].id;
        setCurrentCard(CARDS.find(c => c.id === nextCardId));
        setAnswer('');
      }
    } catch (e) {
      alert("Ошибка проводника.");
    }
    setLoading(false);
  };

  return (
    // Главный контейнер на весь экран
    <div className="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden">
      
      {/* Игровое окно: на 20% меньше экрана, сжатый фон внутри */}
      <div className="relative w-[80vw] h-[80vh] rounded-[2.5rem] overflow-hidden border border-yellow-900/30 shadow-2xl flex flex-col items-center justify-center">
        
        {/* Картинка бэкграунда, сжатая до размеров окна */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{backgroundImage: "url('/bg.jpg')"}}
        />

        {/* Контент поверх фона */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-sm">
          
          {gameState === 'welcome' && (
            <div className="text-center">
              <h1 className={`text-4xl font-serif mb-8 ${goldText}`}>Добро пожаловать в игру!</h1>
              <button 
                onClick={() => { setGameState('playing'); setCurrentCard(CARDS[Math.floor(Math.random()*CARDS.length)]); }}
                className={`px-12 py-4 rounded-2xl font-bold uppercase tracking-widest ${goldButton}`}
              >
                Выбрать карту
              </button>
            </div>
          )}

          {gameState === 'playing' && currentCard && (
            <div className="flex flex-col items-center w-full max-w-xl">
              <img 
                src={currentCard.image} 
                alt="Карта" 
                className="h-[35vh] w-auto object-contain rounded-2xl mb-6 border border-yellow-500/20 shadow-lg" 
              />
              
              {/* Вопрос: центр, под картой, золотой */}
              <h2 className={`text-xl font-serif text-center mb-6 leading-snug px-4 ${goldText}`}>
                {currentCard.question}
              </h2>

              {/* Окно ввода: под вопросом, центр, закруглено */}
              <textarea 
                className="w-full max-w-md bg-black/60 rounded-[1.5rem] p-4 text-white border border-yellow-900/40 focus:border-[#D4AF37] outline-none h-24 resize-none mb-6 text-center"
                placeholder="Ваш ответ..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />

              {/* Кнопка: под вводом, центр, золотая, текст черный -> белый */}
              <button 
                disabled={loading || !answer}
                onClick={handleNextStep}
                className={`w-full max-w-xs py-4 rounded-[1.2rem] font-bold uppercase tracking-wider ${goldButton} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? "Считываю..." : "Продолжить"}
              </button>
            </div>
          )}

          {gameState === 'final' && (
            <div className="w-full max-w-2xl text-center overflow-y-auto px-4">
              <h2 className={`text-3xl font-serif mb-6 ${goldText}`}>Ваше откровение</h2>
              <div className="bg-black/50 p-6 rounded-[2rem] border border-yellow-600/20 text-blue-50 mb-8">
                <p className="whitespace-pre-wrap">{finalAnalysis}</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className={`px-10 py-4 rounded-2xl font-bold ${goldButton}`}
              >
                Начать заново
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
