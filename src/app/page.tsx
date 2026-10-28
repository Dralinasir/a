"use client";

import { useEffect, useRef, useState } from "react";
import rules from "./rules.json";

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const chatbotRules = rules as Rule[];

const greeting: Message = {
  id: 1,
  sender: "bot",
  text:
    "Assalam-o-Alaikum! 👋 Welcome to UOS Helpdesk Bot.\n\nI'm here to help you with university fees, admissions, timings, library services, and hostel information.\n\nHow can I help you today?",
};

const fallbackMessage =
  "I'm sorry, I couldn't find an answer to your question. Please try asking about fees, admissions, university timings, the library, or hostels. You can also contact the relevant University of Sargodha office for assistance.";

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function getBotReply(userMessage: string): string {
  const normalizedMessage = normalizeText(userMessage);

  for (const rule of chatbotRules) {
    const matchedKeyword = rule.keywords.some((keyword) => {
      const normalizedKeyword = normalizeText(keyword);

      if (!normalizedKeyword) {
        return false;
      }

      const escapedKeyword = normalizedKeyword.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const keywordPattern = new RegExp(
        `(^|[^a-z0-9])${escapedKeyword}(?=$|[^a-z0-9])`,
        "i"
      );

      return keywordPattern.test(normalizedMessage);
    });

    if (matchedKeyword) {
      return rule.reply;
    }
  }

  return fallbackMessage;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextMessageId = useRef(2);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  async function handleSend() {
    const trimmedInput = input.trim();

    if (!trimmedInput || isTyping) {
      return;
    }

    const userMessage: Message = {
      id: nextMessageId.current++,
      sender: "user",
      text: trimmedInput,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedInput,
        }),
      });

      const data: {
        answer?: string;
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Helpdesk request failed."
        );
      }

      const reply =
        typeof data.answer === "string" && data.answer.trim()
          ? data.answer
          : getBotReply(trimmedInput);

      const botMessage: Message = {
        id: nextMessageId.current++,
        sender: "bot",
        text: reply,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        botMessage,
      ]);
    } catch (error) {
      console.error("UOS Helpdesk API error:", error);

      // If the API fails, use the local rules as a fallback.
      const botMessage: Message = {
        id: nextMessageId.current++,
        sender: "bot",
        text: getBotReply(trimmedInput),
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        botMessage,
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }

  function handleClearChat() {
    setMessages([
      {
        ...greeting,
        id: nextMessageId.current++,
      },
    ]);

    setInput("");
    setIsTyping(false);
    inputRef.current?.focus();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-3 sm:p-6">
      <section className="flex h-[90vh] min-h-[500px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:h-[85vh]">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 bg-blue-800 px-4 py-4 text-white sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold text-blue-800">
              UOS
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold sm:text-xl">
                UOS Helpdesk Bot
              </h1>

              <p className="mt-1 flex items-center gap-2 text-xs text-blue-100 sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                University Student Assistance
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            disabled={isTyping}
            className="shrink-0 rounded-lg border border-blue-500 px-3 py-2 text-xs font-medium transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            aria-label="Clear conversation"
          >
            New Chat
          </button>
        </header>

        {/* Chat messages */}
        <div
          className="flex-1 space-y-5 overflow-y-auto bg-slate-50 px-3 py-5 sm:px-6 sm:py-6"
          aria-label="Chat messages"
          aria-live="polite"
        >
          <div className="mb-5 text-center">
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-600">
              UOS Student Helpdesk
            </span>
          </div>

          {messages.map((message) => {
            const isUser = message.sender === "user";

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-800 text-[10px] font-bold text-white">
                    UOS
                  </div>
                )}

                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] ${
                    isUser
                      ? "rounded-br-sm bg-blue-800 text-white"
                      : "rounded-bl-sm border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {message.text}
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-300 text-sm font-bold text-slate-700">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-800 text-[10px] font-bold text-white">
                UOS
              </div>

              <div
                className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-4"
                aria-label="Bot is typing"
              >
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        <div className="border-t border-slate-200 bg-white px-3 py-3 sm:px-5">
          <p className="mb-2 text-xs font-medium text-slate-500">
            Suggested questions
          </p>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              "Fee structure",
              "Admission requirements",
              "University timings",
              "Library services",
              "Hostel information",
            ].map((question) => (
              <button
                key={question}
                type="button"
                disabled={isTyping}
                onClick={() => {
                  setInput(question);
                  inputRef.current?.focus();
                }}
                className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-800 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Message input */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSend();
          }}
          className="border-t border-slate-200 bg-white p-3 sm:p-5"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about fees, admissions, library..."
              aria-label="Type your message"
              autoComplete="off"
              disabled={isTyping}
              className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-xl bg-blue-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-300 sm:px-6"
            >
              Send
            </button>
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-400">
            UOS Helpdesk Bot · Rule-based student assistance
          </p>
        </form>
      </section>
    </main>
  );
}
