
import { NextResponse } from "next/server";
import {
  searchKnowledge,
  getKnowledgeFallback,
} from "@/lib/knowledge/knowledge";

export const runtime = "nodejs";

type ChatRequest = {
  question?: unknown;
  language?: unknown;
};

function isRomanUrdu(text: string): boolean {
  return /\b(kya|kaise|kaisa|hai|hain|mujhe|batao|bata|chahiye|karna|kahan|kab|kitna|kitni|mera|meri|apna|fee jama|dakhla|shikayat|nateeja|imtihaan)\b/i.test(
    text,
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;

    if (typeof body.question !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid question." },
        { status: 400 },
      );
    }

    const question = body.question.trim();

    if (question.length < 2) {
      return NextResponse.json(
        { error: "Please enter a question." },
        { status: 400 },
      );
    }

    if (question.length > 1000) {
      return NextResponse.json(
        { error: "Question must be 1000 characters or fewer." },
        { status: 400 },
      );
    }

    const matches = searchKnowledge(question, 3);

    if (matches.length === 0) {
      return NextResponse.json({
        answer: getKnowledgeFallback(),
        language: isRomanUrdu(question) ? "roman-urdu" : "english",
        mode: "knowledge-retrieval",
        sources: [],
        verified: false,
      });
    }

    const bestMatch = matches[0];

    if (!bestMatch) {
      return NextResponse.json({
        answer: getKnowledgeFallback(),
        language: "english",
        mode: "knowledge-retrieval",
        sources: [],
        verified: false,
      });
    }

    const answer = [
      bestMatch.document.content,
      "",
      "Important: This is general guidance, not a live university record. Confirm current requirements and deadlines with the official university.",
    ].join("\n");

    return NextResponse.json({
      answer,
      language: isRomanUrdu(question) ? "roman-urdu" : "english",
      mode: "knowledge-retrieval",
      sources: matches.map(({ document }) => ({
        title: document.title,
        category: document.category,
        url: document.sourceUrl ?? null,
      })),
      verified: bestMatch.document.verified,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process the question. Please try again." },
      { status: 400 },
    );
  }
}
