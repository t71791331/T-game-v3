import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { answer, history, availableCards, isFinal, isFirstStep } = await req.json();

    let prompt = "";

    if (isFirstStep) {
      prompt = `Игрок пришел с запросом: "${answer}". Выбери из списка наиболее подходящую первую карту (ID), которая поможет начать работу с этим запросом.
      Список карт: ${JSON.stringify(availableCards.map((c:any) => ({id: c.id, q: c.question})))}
      Ответь ТОЛЬКО JSON: {"nextCardId": номер}`;
    } else if (isFinal) {
      prompt = `ЭТО ФИНАЛ. Проанализируй путь игрока: ${JSON.stringify(history)}. 
      1. Напиши ОЧЕНЬ КОРОТКИЙ комментарий к последнему ответу.
      2. Напиши глубокий комплексный анализ ВСЕГО ПУТИ. 
      ВАЖНО: Общайся с игроком напрямую (на "ты" или "вы"), как психолог на приеме. Давай советы и интерпретации лично ему.
      Ответь ТОЛЬКО JSON: {"comment": "короткий коммент к 5 шагу", "fullAnalysis": "весь глубокий анализ и советы"}`;
    } else {
      prompt = `Ты — проводник-психолог. Игрок ответил на вопрос: "${answer}".
      1. Напиши КОРОТКИЙ (1-2 предложения) инсайт по этому ответу.
      2. Выбери из списка ID следующей карты: ${JSON.stringify(availableCards.map((c:any) => ({id: c.id, q: c.question})))}
      Ответь ТОЛЬКО JSON: {"comment": "текст", "nextCardId": номер}`;
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const data = await res.json();
    return NextResponse.json(JSON.parse(data.choices[0].message.content));
  } catch (e) {
    return NextResponse.json({ comment: "Проводник задумался..." }, { status: 500 });
  }
}
