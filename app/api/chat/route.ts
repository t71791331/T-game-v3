import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { answer, history, availableCards, isFinal } = await req.json();

    const prompt = isFinal 
      ? `Это финал трансформационной игры. Проанализируй 5 ответов игрока: ${JSON.stringify(history)}. Напиши глубокое психологическое заключение и дай совет на будущее.`
      : `Ты — проводник в психологической игре. Игрок ответил: "${answer}". 
         1. Напиши короткую поддерживающую фразу. 
         2. Выбери из списка ниже ОДИН ID следующей карты, которая лучше всего подходит к контексту.
         ВАЖНО: Выбирай ТОЛЬКО из этого списка (эти карты еще не использовались): ${JSON.stringify(availableCards.map((c:any) => ({id: c.id, q: c.question})))}
         Ответь ТОЛЬКО в формате JSON: {"comment": "фраза", "nextCardId": номер}`;

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
    return NextResponse.json({ comment: "Ошибка проводника" }, { status: 500 });
  }
}
