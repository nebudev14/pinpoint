import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const schema = z.object({
  event: z.object({
    name: z.string(),
    description: z.string(),
    date: z.string(),
    time: z.string(),
    reason: z.string(),
    location: z.string(),
  }),
});

export async function POST(req: Request) {
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const parsedBody = JSON.parse(body);
  const eventHistory = parsedBody.eventHistory.map((event: any) => {
    return {
      name: event.event_name,
      description: event.event_desc
    }
  });

  const allEvents = parsedBody.allEvents.map((event: any) => {
    return {
      name: event.name,
      description: event.description
    }
  });


  async function generateRecommendations() {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });


    try {

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an event recommendation agent. You will be provided with a list of events that a user has viewed in the past (called `eventHistory`) and a list of current events they can attend (called `allEvents`). Your job is to suggest the single event from `currentEvents` that the user would be most interested in based on their viewing history. Use the event name and description to find patterns and make an informed recommendation. Based on the user’s preferences, recommend the best matching event from `allEvents`. Please provide only the name of the event and a brief reason for your choice. This reason should be phrased in the form of \"Based on your previous history, we think you'd like...\" Do not recommend an event that the user has already viewed.",
          },
          {
            role: "user",
            content: `Here is the user's event history: ${eventHistory.toString()} and here are the current events they can attend: ${allEvents.toString()}`
          }
        ],
        max_tokens: 750,
        temperature: 0.7,
        response_format: zodResponseFormat(schema, "recommendation")
      });

      console.log(completion.choices[0].message.content);
      return completion.choices[0].message?.content || '';

    } catch (error) {
      console.error("Error generating recommendations:", error);
      return NextResponse.json({ error: "Error generating recommendations" }, { status: 500 });
    }
  }

  const recommendation = await generateRecommendations();
  console.log(recommendation);

  return new Response(JSON.stringify(recommendation), { status: 200 });

}
