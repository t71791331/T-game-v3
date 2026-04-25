import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { answer, history, availableCards, isFinal, isFirstStep } = await req.json();

    let prompt = "";

    if (isFirstStep) {
      // ИИ выбирает первую карту на основе входного запроса
      prompt = `Игрок пришел с запросом: "${answer}". Выбери из списка наиболее подходящую первую карту (ID), которая поможет начать работу с этим запросом.
      Список карт: ${JSON.stringify(availableCards.map((c:any) => ({id: c.id, q: c.question})))}
      Ответь ТОЛЬКО JSON: {"nextCardId": номер}`;
    } else if (isFinal) {
      // Финальный анализ: ИИ должен отвечать на "Вы" и разделять ответ на части
      prompt = `ЭТО ЗАВЕРШЕНИЕ ПУТИ. Проанализируйте ответы пользователя: ${JSON.stringify(history)}. 
      1. Напишите ОЧЕНЬ КОРОТКИЙ (1-2 предложения) комментарий к последнему (пятому) ответу.
      2. Напишите глубокое, мудрое и поддерживающее «Откровение» — комплексный анализ всего пройденного пути. 
      ВАЖНО: 
      - Обращайтесь к пользователю строго на «Вы». 
      - Выступайте в роли мудрого психолога-проводника. 
      - Дайте конкретные советы и напутствия лично пользователю.
      Ответь ТОЛЬКО JSON: {"comment": "короткий анализ 5-го шага", "fullAnalysis": "Ваше глубокое откровение и напутствие для пользователя"}`;
    } else {
      // Промежуточные шаги
      prompt = `Вы — мудрый психолог-проводник. Пользователь ответил на вопрос: "${answer}".
      1. Напишите короткий (1-2 предложения) инсайт или поддержку по этому ответу. Обращайтесь на «Вы».
      2. Выберите из списка ID следующей карты, которая логически продолжает исследование: ${JSON.stringify(availableCards.map((c:any) => ({id: c.id, q: c.question})))}
      Ответь ТОЛЬКО JSON: {"comment": "текст инсайта", "nextCardId": номер}`;
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
    const content = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(content);
  } catch (e) {
    return NextResponse.json({ comment: "Проводник погрузился в раздумья... Попробуйте еще раз." }, { status: 500 });
  }
}
