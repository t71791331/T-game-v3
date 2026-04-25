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
  const [usedCardIds, setUsedCardIds] = useState<number[]>([]); // Следим за ID использованных карт
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState<{question: string, answer: string, comment: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [finalAnalysis, setFinalAnalysis] = useState('');

  const goldColor = "#D4AF37";

  const handleNextStep = async () => {
    if (!answer) return;
    setLoading(true);
    
    // Обновляем список использованных ID
    const newUsedIds = [...usedCardIds, currentCard.id];
    setUsedCardIds(newUsedIds);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answer, 
          history, 
          // Отправляем только те карты, которые ЕЩЕ НЕ были использованы
          availableCards: CARDS.filter(c => !newUsedIds.includes(c.id)),
          isFinal: history.length === 4 
        }),
      });
      const data = await response.json();
      const updatedHistory = [...history, { question: currentCard.question, answer, comment: data.comment }];
      setHistory(updatedHistory);

      if (updatedHistory.length === 5) {
        setFinalAnalysis(data.comment);
        setGameState('final');
      } else {
        // Выбираем следующую карту из предложенных ИИ или случайную из оставшихся
        const remainingCards = CARDS.filter(c => !newUsedIds.includes(c.id));
        const nextCard = remainingCards.find(c => c.id === data.nextCardId) || remainingCards[Math.floor(Math.random() * remainingCards.length)];
        
        setCurrentCard(nextCard);
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
    fontWeight: 'bold' as 'bold',
    cursor: 'pointer',
    border: 'none',
    transition: '0.3s',
    textTransform: 'uppercase' as 'uppercase',
    letterSpacing: '1px'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', margin: 0, color: goldColor, overflow: 'hidden' }}>
      <div style={{ 
        position: 'relative', 
        width: '90vw',
        maxWidth: '1200px',
        aspectRatio: '16 / 9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '2.5rem',
        overflow: 'hidden',
        boxShadow: '0 0 50px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.05)'
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: '-50%',
          backgroundImage: "url('/bg.jpg')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          transform: 'rotate(90deg)',
          zIndex: 0
        }}></div>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1 }}></div>

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', width: '100%', padding: '20px', textAlign: 'center' }}>
          {gameState === 'welcome' && (
            <>
              <h1 style={{ fontSize: '2.8rem', margin: '0', fontFamily: 'serif' }}>Добро пожаловать</h1>
              <button onClick={() => { setGameState('playing'); setCurrentCard(CARDS[Math.floor(Math.random()*CARDS.length)]); }} style={btnStyle}>Начать путь</button>
            </>
          )}

          {gameState === 'playing' && currentCard && (
            <>
              <img src={currentCard.image} alt="Карта" style={{ width: '220px', borderRadius: '12px', border: `1px solid ${goldColor}44` }} />
              <h2 style={{ fontSize: '1.2rem', margin: '5px 0', fontFamily: 'serif', maxWidth: '500px' }}>{currentCard.question}</h2>
              <textarea 
                style={{ width: '220px', backgroundColor: 'rgba(0,0,0,0.85)', border: `1px solid ${goldColor}77`, borderRadius: '15px', padding: '12px', color: 'white', textAlign: 'center', height: '100px', outline: 'none', resize: 'none' }}
                placeholder="Ваш ответ..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <button disabled={loading || !answer} onClick={handleNextStep} style={{...btnStyle, width: '220px'}} onMouseOver={(e) => { e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'black'; }}>
                {loading ? "Считываю..." : "Далее"}
              </button>
            </>
          )}

          {gameState === 'final' && (
            <div style={{maxWidth: '700px'}}>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'serif', marginBottom: '15px' }}>Ваше откровение</h2>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '25px', border: `1px solid ${goldColor}33`, color: 'white', maxHeight: '40vh', overflowY: 'auto' }}>
                <p style={{ fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>{finalAnalysis}</p>
              </div>
              <button onClick={() => window.location.reload()} style={{...btnStyle, marginTop: '20px'}}>Начать заново</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
