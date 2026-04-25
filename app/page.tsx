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

  // Общие стили
  const goldColor = "text-[#D4AF37]";
  const goldBtn = "bg-[#D4AF37] text-black font-bold py-3 px-8 rounded-2xl transition-all duration-300 hover:text-outline-white hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]";

  const handleNextStep = async () => {
    if (!answer) return;
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer, history, availableCards: CARDS.filter(c => !history.find(h => h.question === c.question)), isFinal: history.length === 4 }),
      });
      const data = await response.json();
      const updatedHistory = [...history, { question: currentCard.question, answer, comment: data.comment }];
      setHistory(updatedHistory);

      if (updatedHistory.length === 5) {
        setFinalAnalysis(data.comment);
        setGameState('final');
      } else {
        const nextCardId = data.nextCardId || CARDS[Math.floor(Math.random() * CARDS.length)].id;
        setCurrentCard(CARDS.find(c => c.id === nextCardId));
        setAnswer('');
      }
    } catch (e) { alert("Ошибка связи..."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black overflow-x-hidden">
      {/* Окно по размеру бэкграунда */}
      <div className="relative w-full max-w-[1200px] aspect-video flex flex-col items-center justify-center bg-cover bg-center shadow-2xl" style={{backgroundImage: "url('/bg.jpg')"}}>
        
        {/* Затемнение фона для читаемости */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        {/* Контентная область - все друг под другом */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-6 w-full max-w-2xl px-4 text-center">
          
          {gameState === 'welcome' && (
            <>
              <h1 className={`text-4xl font-serif ${goldColor}`}>Добро пожаловать в игру!</h1>
              <button onClick={() => { setGameState('playing'); setCurrentCard(CARDS[Math.floor(Math.random()*CARDS.length)]); }} className={goldBtn}>
                Выбрать карту
              </button>
            </>
          )}

          {gameState === 'playing' && currentCard && (
            <>
              <img src={currentCard.image} alt="Карта" className="w-64 h-auto rounded-xl border border-[#D4AF37]/30 shadow-lg" />
              <h2 className={`text-xl font-serif ${goldColor}`}>{currentCard.question}</h2>
              <textarea 
                className="w-full bg-black/60 text-white border border-[#D4AF37]/40 rounded-2xl p-4 h-24 outline-none focus:border-[#D4AF37] text-center resize-none"
                placeholder="Ваш ответ..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <button disabled={loading || !answer} onClick={handleNextStep} className={goldBtn}>
                {loading ? "Анализ..." : "Продолжить"}
              </button>
            </>
          )}

          {gameState === 'final' && (
            <>
              <h2 className={`text-3xl font-serif ${goldColor}`}>Ваше заключение</h2>
              <div className="bg-black/60 p-6 rounded-3xl border border-[#D4AF37]/20 text-white max-h-[40vh] overflow-y-auto">
                <p className="whitespace-pre-wrap italic">{finalAnalysis}</p>
              </div>
              <button onClick={() => window.location.reload()} className={goldBtn}>Начать заново</button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
