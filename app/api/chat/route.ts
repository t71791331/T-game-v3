import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { answer, history, availableCards, isFinal } = await req.json();

    const prompt = isFinal 
      ? `ЭТО ФИНАЛ. Проанализируй все 5 шагов: ${JSON.stringify(history)}. 
         Напиши комплексный психологический портрет игрока на основе его ответов. 
         Объедини всё в единый глубокий текст. В конце дай 3 конкретные рекомендации для трансформации жизни.`
      : `Ты — проводник. Игрок ответил: "${answer}". 
         1. Напиши ОЧЕНЬ КОРОТКИЙ (1-2 предложения) инсайт или поддержку по этому конкретному ответу.
         2. Выбери из списка ID следующей карты: ${JSON.stringify(availableCards.map((c:any) => ({id: c.id, q: c.question})))}
         Ответь ТОЛЬКО JSON: {"comment": "текст", "nextCardId": номер}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: prompt }],
        response_format: isFinal ? { type: "text" } : { type: "json_object" }
      })
    });

    const data = await res.json();
    const result = isFinal ? { comment: data.choices[0].message.content } : JSON.parse(data.choices[0].message.content);

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ comment: "Проводник задумался... Попробуйте еще раз." }, { status: 500 });
  }
}
