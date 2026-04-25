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

  const goldColor = "#D4AF37";

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
    } catch (e) { alert("Ошибка..."); }
    setLoading(false);
  };

  const btnStyle = {
    backgroundColor: goldColor,
    color: 'black',
    padding: '12px 30px',
    borderRadius: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
    transition: '0.3s'
  };

  return (
    <div style={{ minHeight: '100-vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', margin: 0, color: goldColor }}>
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '1000px', 
        aspectRatio: '16/9', 
        backgroundImage: "url('/bg.jpg')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}></div>

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '600px', padding: '20px', textAlign: 'center' }}>
          
          {gameState === 'welcome' && (
            <>
              <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Добро пожаловать в игру!</h1>
              <button onClick={() => { setGameState('playing'); setCurrentCard(CARDS[Math.floor(Math.random()*CARDS.length)]); }} style={btnStyle}>
                ВЫБРАТЬ КАРТУ
              </button>
            </>
          )}

          {gameState === 'playing' && currentCard && (
            <>
              <img src={currentCard.image} alt="Карта" style={{ width: '220px', borderRadius: '15px', border: `1px solid ${goldColor}55` }} />
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{currentCard.question}</h2>
              <textarea 
                style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.7)', border: `1px solid ${goldColor}88`, borderRadius: '20px', padding: '15px', color: 'white', textAlign: 'center', height: '80px', outline: 'none' }}
                placeholder="Ваш ответ..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <button 
                disabled={loading || !answer} 
                onClick={handleNextStep} 
                style={btnStyle}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.textShadow = '0 0 5px white'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'black'; e.currentTarget.style.textShadow = 'none'; }}
              >
                {loading ? "АНАЛИЗ..." : "ПРОДОЛЖИТЬ"}
              </button>
            </>
          )}

          {gameState === 'final' && (
            <>
              <h2 style={{ fontSize: '2rem' }}>Ваше заключение</h2>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '30px', border: `1px solid ${goldColor}33`, color: 'white' }}>
                <p style={{ fontStyle: 'italic' }}>{finalAnalysis}</p>
              </div>
              <button onClick={() => window.location.reload()} style={btnStyle}>НАЧАТЬ ЗАНОВО</button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
