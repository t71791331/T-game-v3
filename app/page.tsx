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

  const glowEffect = "transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-[1.02] active:scale-[0.98]";

  const handleNextStep = async () => {
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
      alert("Ошибка проводника. Попробуйте еще раз.");
    }
    setLoading(false);
  };

  if (gameState === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('/bg.jpg')"}}>
        <div className="bg-black/70 p-12 rounded-3xl backdrop-blur-md text-center border border-yellow-900/50 max-w-lg mx-4">
          <h1 className="text-4xl font-serif text-yellow-200 mb-4">Добро пожаловать в игру!</h1>
          <p className="text-blue-100 mb-8 italic">Раскройте тайны своего подсознания через символы и ответы.</p>
          <button 
            onClick={() => { setGameState('playing'); setCurrentCard(CARDS[Math.floor(Math.random()*CARDS.length)]); }}
            className={`bg-yellow-700 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest ${glowEffect}`}
          >
            Выбрать карту
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'final') {
    return (
      <div className="min-h-screen py-12 bg-cover bg-fixed overflow-y-auto" style={{backgroundImage: "url('/bg.jpg')"}}>
        <div className="max-w-2xl mx-auto bg-black/80 p-8 rounded-3xl backdrop-blur-xl border border-yellow-600/30 text-white shadow-2xl">
          <h2 className="text-3xl font-serif text-yellow-400 mb-8 text-center">Ваше откровение</h2>
          <div className="space-y-6 mb-10">
            {history.map((item, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-xl border-l-4 border-yellow-700">
                <p className="text-xs text-yellow-500 uppercase font-bold mb-1">Вопрос {i+1}</p>
                <p className="text-gray-300 italic mb-2">«{item.answer}»</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-6 rounded-2xl border border-blue-500/30">
            <h3 className="text-xl font-bold mb-4 text-blue-200">Анализ проводника:</h3>
            <p className="leading-relaxed text-blue-50 whitespace-pre-wrap">{finalAnalysis}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className={`mt-10 w-full bg-gray-800 py-4 rounded-xl font-bold hover:bg-gray-700 ${glowEffect}`}
          >
            Начать новое путешествие
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-fixed p-4" style={{backgroundImage: "url('/bg.jpg')"}}>
      {currentCard && (
        <div className="max-w-md w-full bg-black/60 p-8 rounded-[2rem] backdrop-blur-xl border border-white/10 shadow-2xl text-center">
          <div className="text-yellow-600 text-xs font-black tracking-[0.3em] mb-4">ЭТАП {history.length + 1} / 5</div>
          <img src={currentCard.image} alt="Карта" className="w-full h-72 object-cover rounded-2xl mb-6 border border-yellow-500/20" />
          <h2 className="text-xl text-white font-serif mb-6 leading-snug">{currentCard.question}</h2>
          <textarea 
            className="w-full bg-black/40 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-yellow-600 outline-none mb-6 h-32 resize-none border border-white/5"
            placeholder="Опишите ваши чувства..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button 
            disabled={loading || !answer}
            onClick={handleNextStep}
            className={`w-full py-4 rounded-xl font-bold text-white uppercase tracking-wider ${loading ? 'bg-gray-700' : 'bg-yellow-800'} ${glowEffect}`}
          >
            {loading ? "Считываю знаки..." : "Продолжить"}
          </button>
        </div>
      )}
    </div>
  );
}
