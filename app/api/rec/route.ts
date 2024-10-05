import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json();
  const body = JSON.stringify(payload);

  async function generateRecommendations() {
    const eventHistory = [];
    const allEvents = [];

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });


    try {

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an event recommendation agent. You will be provided with a list of events that a user has viewed in the past (called `userHistory`) and a list of current events they can attend (called `currentEvents`). Your job is to suggest the single event from `currentEvents` that the user would be most interested in based on their viewing history. Use the event name and description to find patterns and make an informed recommendation. Based on the user’s preferences, recommend the best matching event from `currentEvents`. Please provide only the name of the event and a brief reason for your choice.",
          },
        ],
      });

    } catch (error) {
      console.error("Error generating recommendations:", error);
      return NextResponse.json({ error: "Error generating recommendations" }, { status: 500 });
    }
  }


  console.log(body);



  return new Response("", { status: 200 });
}
