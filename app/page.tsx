"use client";

import React, { useState } from 'react';

const CARDS = [
  { id: 1, question: "Какая старая привычка мешает Вам двигаться вперед?", image: "/card1.png" },
  { id: 2, question: "Что для Вас сейчас является самым главным источником силы?", image: "/card2.png" },
  { id: 3, question: "Какую роль в Вашей жизни играют Ваши отношения с близкими?", image: "/card3.png" },
  { id: 4, question: "Какой смелый шаг Вы откладываете уже долгое время?", image: "/card4.png" },
  { id: 5, question: "Если бы Ваш страх был Вашим учителем, чему бы он Вас научил?", image: "/card5.png" },
  { id: 6, question: "Какую часть себя Вы игнорируете ради одобрения окружающих?", image: "/card6.png" },
  { id: 7, question: "Что произойдет, если Вы перестанете всё контролировать?", image: "/card7.png" },
  { id: 8, question: "Какое событие из прошлого до сих пор забирает Вашу энергию?", image: "/card8.png" },
  { id: 9, question: "В чем Ваша истинная уникальность, которую Вы боитесь проявлять?", image: "/card9.png" },
  { id: 10, question: "Если бы успех был гарантирован, чем бы Вы занялись завтра?", image: "/card10.png" },
  { id: 11, question: "Кому или чему Вам нужно сказать твердое 'Нет' прямо сейчас?", image: "/card11.png" },
  { id: 12, question: "Какое маленькое действие сегодня принесет Вам радость?", image: "/card12.png" },
  { id: 13, question: "За что Вы можете поблагодарить свое тело сегодня?", image: "/card13.png" },
  { id: 14, question: "Что в Вашем окружении тянет Вас назад, а что вдохновляет?", image: "/card14.png" },
  { id: 15, question: "Если бы Вы были своим лучшим другом, какой совет Вы бы себе дали?", image: "/card15.png" },
  { id: 16, question: "Какой талант Вы зарыли в землю и почему?", image: "/card16.png" },
  { id: 17, question: "Что заставляет Вас чувствовать себя по-настоящему живым?", image: "/card17.png" },
  { id: 18, question: "Какую маску Вы носите чаще всего и что она скрывает?", image: "/card18.png" },
  { id: 19, question: "Что Вы готовы отпустить, чтобы освободить место для нового?", image: "/card19.png" },
  { id: 20, question: "Если бы Вы могли встретить себя через 10 лет, что бы Вы услышали?", image: "/card20.png" }
];

export default function Game() {
  const [gameState, setGameState] = useState<'welcome' | 'playing' | 'feedback' | 'final'>('welcome');
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [usedCardIds, setUsedCardIds] = useState<number[]>([]);
  const [answer, setAnswer] = useState('');
  const [welcomeQuery, setWelcomeQuery] = useState('');
  const [history, setHistory] = useState<{question: string, answer: string, comment: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [finalAnalysis, setFinalAnalysis] = useState('');
  const [nextCardData, setNextCardData] = useState<any>(null);

  const goldColor = "#D4AF37";
  const elementWidth = "70%"; // Чуть уже (было 75%), чтобы гарантированно избежать горизонтального скролла

  const handleStartGame = async () => {
    if (!welcomeQuery) return;
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answer: welcomeQuery, 
          history: [], 
          availableCards: CARDS,
          isFirstStep: true 
        }),
      });
      const data = await response.json();
      const firstCard = CARDS.find(c => c.id === data.nextCardId) || CARDS[Math.floor(Math.random()*CARDS.length)];
      setCurrentCard(firstCard);
      setGameState('playing');
    } catch (e) { alert("Ошибка инициализации..."); }
    setLoading(false);
  };

  const handleSendAnswer = async () => {
    if (!answer) return;
    setLoading(true);
    const newUsedIds = [...usedCardIds, currentCard.id];
    setUsedCardIds(newUsedIds);
    const isLastCard = history.length === 4;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answer, 
          history: [...history, { question: currentCard.question, answer }], 
          availableCards: CARDS.filter(c => !newUsedIds.includes(c.id)),
          isFinal: isLastCard 
        }),
      });
      const data = await response.json();
      setCurrentComment(data.comment);
      if (isLastCard) setFinalAnalysis(data.fullAnalysis);
      else {
        const remainingCards = CARDS.filter(c => !newUsedIds.includes(c.id));
        const next = remainingCards.find(c => c.id === data.nextCardId) || remainingCards[0];
        setNextCardData(next);
      }
      setHistory([...history, { question: currentCard.question, answer, comment: data.comment }]);
      setGameState('feedback');
    } catch (e) { alert("Ошибка проводника..."); }
    setLoading(false);
  };

  const handleContinue = () => {
    if (history.length === 5) setGameState('final');
    else {
      setCurrentCard(nextCardData);
      setAnswer('');
      setGameState('playing');
    }
  };

  const btnStyle = {
    backgroundColor: goldColor,
    color: 'black',
    padding: '12px 35px',
    borderRadius: '20px',
    fontWeight: 'bold' as 'bold',
    cursor: 'pointer',
    border: 'none',
    transition: '0.3s',
    display: 'inline-block'
  };

  // CSS для стилизации скроллбара
  const scrollbarStyles = `
    .custom-scroll::-webkit-scrollbar { width: 8px; }
    .custom-scroll::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); border-radius: 10px; }
    .custom-scroll::-webkit-scrollbar-thumb { background: ${goldColor}; border-radius: 10px; border: 2px solid black; }
    .custom-scroll::-webkit-scrollbar-thumb:hover { background: #b8952e; }
  `;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', margin: 0, color: goldColor, overflow: 'hidden' }}>
      <style>{scrollbarStyles}</style>
      <div style={{ position: 'relative', width: '95vw', maxWidth: '1100px', minHeight:'85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 0 50px rgba(0,0,0,0.9)' }}>
        <div style={{ position: 'absolute', inset: '-50%', backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', transform: 'rotate(90deg)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1 }}></div>

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column' as 'column', alignItems: 'center', gap: '15px', width: '100%', textAlign: 'center', height: '100%', justifyContent: 'center' }}>
          
          {gameState === 'welcome' && (
            <>
              <h1 style={{ fontSize: '2.5rem', fontFamily: 'serif' }}>Добро пожаловать в игру!</h1>
              <p style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Что привело Вас сюда?</p>
              <textarea 
                style={{ width: elementWidth, backgroundColor: 'rgba(0,0,0,0.8)', border: `1px solid ${goldColor}77`, borderRadius: '15px', padding: '10px', color: 'white', textAlign: 'center', height: '80px', outline: 'none', resize: 'none' }}
                placeholder="Опишите Ваш запрос или состояние..." value={welcomeQuery} onChange={(e) => setWelcomeQuery(e.target.value)}
              />
              <button disabled={loading || !welcomeQuery} onClick={handleStartGame} style={btnStyle}>Начать</button>
            </>
          )}

          {gameState === 'playing' && currentCard && (
            <>
              <div style={{ width: elementWidth, display: 'flex', justifyContent: 'center' }}>
                <img src={currentCard.image} alt="Карта" style={{ width: '100%', height: 'auto', maxHeight: '40vh', objectFit: 'contain', borderRadius: '12px', border: `1px solid ${goldColor}44` }} />
              </div>
              <h2 style={{ fontSize: '1.2rem', margin: '5px 0', fontFamily: 'serif', width: elementWidth }}>{currentCard.question}</h2>
              <textarea 
                style={{ width: elementWidth, backgroundColor: 'rgba(0,0,0,0.8)', border: `1px solid ${goldColor}77`, borderRadius: '15px', padding: '10px', color: 'white', textAlign: 'center', height: '80px', outline: 'none', resize: 'none' }}
                placeholder="Ваш ответ..." value={answer} onChange={(e) => setAnswer(e.target.value)}
              />
              <button disabled={loading || !answer} onClick={handleSendAnswer} style={btnStyle}>Отправить ответ</button>
            </>
          )}

          {gameState === 'feedback' && (
            <>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'serif' }}>Мысли проводника</h2>
              <div style={{ width: elementWidth, backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '20px', border: `1px solid ${goldColor}33`, color: 'white', fontStyle: 'italic' }}>
                {currentComment}
              </div>
              <button onClick={handleContinue} style={btnStyle}>Продолжить</button>
            </>
          )}

          {gameState === 'final' && (
            <div className="custom-scroll" style={{ width: '95%', height: '85%', overflowY: 'auto', overflowX: 'hidden', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'serif' }}>Ваш путь</h2>
              
              <div style={{ width: '85%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {history.map((step, i) => (
                  <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', borderLeft: `4px solid ${goldColor}` }}>
                    <p style={{ color: goldColor, fontSize: '0.85rem', fontWeight: 'bold' }}>ШАГ {i + 1}: {step.question}</p>
                    <p style={{ color: 'white', marginBottom: '5px' }}>— {step.answer}</p>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', fontStyle: 'italic' }}>Анализ шага: {step.comment}</p>
                  </div>
                ))}
              </div>

              <div style={{ width: '85%', backgroundColor: 'rgba(212,175,55,0.1)', padding: '25px', borderRadius: '20px', border: `1px solid ${goldColor}`, color: 'white', marginTop: '10px' }}>
                <h3 style={{ color: goldColor, marginBottom: '10px', fontSize: '1.1rem' }}>ВАШЕ ОТКРОВЕНИЕ:</h3>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{finalAnalysis}</p>
              </div>

              <button onClick={() => window.location.reload()} style={btnStyle}>Начать заново</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
