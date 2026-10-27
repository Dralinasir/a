
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  time: string;
};

type Topic = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  question: string;
};

const allRules = rules as Rule[];

const topics: Topic[] = [
  {
    id: "admission",
    title: "Admissions",
    subtitle: "Applications, eligibility & merit",
    icon: "🎓",
    color: "from-blue-500 to-indigo-600",
    question: "How can I apply for admission?",
  },
  {
    id: "fee",
    title: "Fees & Payments",
    subtitle: "Fee structure, challans & dues",
    icon: "💳",
    color: "from-emerald-500 to-teal-600",
    question: "Tell me about the fee structure",
  },
  {
    id: "exams",
    title: "Exams & Results",
    subtitle: "Date sheets, results & GPA",
    icon: "📝",
    color: "from-violet-500 to-purple-600",
    question: "How can I check my exam date sheet?",
  },
  {
    id: "library",
    title: "Library",
    subtitle: "Books, membership & timings",
    icon: "📚",
    color: "from-amber-500 to-orange-600",
    question: "Tell me about library services",
  },
  {
    id: "hostel",
    title: "Hostel",
    subtitle: "Accommodation & applications",
    icon: "🏠",
    color: "from-rose-500 to-pink-600",
    question: "How can I apply for a hostel?",
  },
  {
    id: "student",
    title: "Student Services",
    subtitle: "ID cards, certificates & support",
    icon: "🧑‍🎓",
    color: "from-cyan-500 to-sky-600",
    question: "How can I get a student ID card?",
  },
];

const quickQuestions = [
  "How can I apply for admission?",
  "What is the fee structure?",
  "When is the exam date sheet?",
  "How do I apply for a hostel?",
];

const welcomeMessage =
  "Assalam-o-Alaikum! 👋 Welcome to UOS Helpdesk Bot.\n\nI'm your virtual student assistant. Ask me about admissions, fees, exams, scholarships, library, hostel, transport, or student services.\n\nChoose a topic below or type your question to get started.";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\u0600-\u06FF\s'-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findReply(message: string): string {
  const query = normalize(message);

  // Common English and Roman Urdu question patterns.
  const aliases: Array<[RegExp, string]> = [
    [
      /\b(fees?|fee structure|semester fee|tuition fee|challan|dues|kitni fee|fees kitni|fees batao)\b/i,
      "fee",
    ],
    [
      /\b(admission|apply|dakhla|dakhil|merit list|eligibility|last date)\b/i,
      "admission",
    ],
    [
      /\b(timing|timings|waqt|university open|office hours|class schedule)\b/i,
      "timing",
    ],
    [
      /\b(library|kitab|books|book issue|library card)\b/i,
      "library",
    ],
    [
      /\b(hostel|rehayish|room|hostel fee|hostel application)\b/i,
      "hostel",
    ],
    [
      /\b(date sheet|datesheet|exam|exams|paper date|roll number slip)\b/i,
      "date_sheet",
    ],
    [
      /\b(result|results|marks|dmc|transcript)\b/i,
      "results",
    ],
    [
      /\b(scholarship|financial aid|fee concession|wazifa)\b/i,
      "scholarship",
    ],
    [
      /\b(transport|bus route|university bus|pick and drop)\b/i,
      "transport",
    ],
    [
      /\b(student id|id card|identity card|card gum|lost card)\b/i,
      "student_card",
    ],
    [/\b(gpa|cgpa|grade point)\b/i, "gpa"],
    [
      /\b(attendance|hazri|short attendance)\b/i,
      "attendance",
    ],
    [
      /\b(complaint|shikayat|harassment|grievance)\b/i,
      "complaint",
    ],
    [
      /\b(hello|hi|hey|salam|assalamualaikum|assalam o alaikum|aoa|good morning|good evening)\b/i,
      "greeting",
    ],
    [
      /\b(thanks|thank you|shukriya|jazakallah)\b/i,
      "thanks",
    ],
    [
      /\b(bye|goodbye|allah hafiz|khuda hafiz)\b/i,
      "goodbye",
    ],
  ];

  const aliasMatch = aliases.find(([pattern]) =>
    pattern.test(query)
  );

  if (aliasMatch) {
    const matchedRule = allRules.find(
      (rule) => rule.intent === aliasMatch[1]
    );

    if (matchedRule) return matchedRule.reply;
  }

  for (const rule of allRules) {
    if (rule.intent === "fallback") continue;

    const matched = rule.keywords.some((keyword) => {
      const normalizedKeyword = normalize(keyword);

      if (!normalizedKeyword) return false;

      const escaped = normalizedKeyword.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const pattern = new RegExp(
        `(^|[^a-z0-9\\u0600-\\u06FF])${escaped}(?=$|[^a-z0-9\\u0600-\\u06FF])`,
        "i"
      );

      return pattern.test(query);
    });

    if (matched) return rule.reply;
  }

  const fallback = allRules.find(
    (rule) => rule.intent === "fallback"
  );

  return (
    fallback?.reply ??
    "Sorry, I couldn't find a matching answer. Try asking about admissions, fees, exams, library, hostel or student services."
  );
}

function currentTime() {
  return new Intl.DateTimeFormat("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function makeMessage(
  sender: "user" | "bot",
  text: string
): Message {
  return {
    id: Date.now() + Math.random(),
    sender,
    text,
    time: currentTime(),
  };
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: welcomeMessage,
      time: currentTime(),
    },
  ]);

  const [input, setInput] = useState("");
  const [activeTopic, setActiveTopic] = useState("all");
  const [isTyping, setIsTyping] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const visibleTopics = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) return topics;

    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(search) ||
        topic.subtitle.toLowerCase().includes(search) ||
        topic.question.toLowerCase().includes(search)
    );
  }, [searchText]);

  function sendMessage(text = input) {
    const trimmed = text.trim();

    if (!trimmed || isTyping) return;

    setMessages((previous) => [
      ...previous,
      makeMessage("user", trimmed),
    ]);

    setInput("");
    setIsTyping(true);

    timerRef.current = setTimeout(() => {
      const reply = findReply(trimmed);

      setMessages((previous) => [
        ...previous,
        makeMessage("bot", reply),
      ]);

      setIsTyping(false);
      inputRef.current?.focus();
    }, 450);
  }

  function startNewChat() {
    if (timerRef.current) clearTimeout(timerRef.current);

    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: welcomeMessage,
        time: currentTime(),
      },
    ]);

    setInput("");
    setIsTyping(false);
    setActiveTopic("all");
    setMobileMenuOpen(false);
    inputRef.current?.focus();
  }

  function chooseTopic(topic: Topic) {
    setActiveTopic(topic.id);
    setMobileMenuOpen(false);
    sendMessage(topic.question);
  }

  return (
    <main className="min-h-screen bg-[#eef2f8] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 flex w-[285px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
            mobileMenuOpen
              ? "translate-x-0 shadow-2xl"
              : "-translate-x-full"
          }`}
        >
          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-sm font-black tracking-wide text-white shadow-lg shadow-blue-900/20">
              UOS
            </div>

            <div>
              <p className="text-base font-extrabold tracking-tight text-slate-900">
                UOS Helpdesk
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Student assistance portal
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className="px-4 pt-5">
            <button
              type="button"
              onClick={startNewChat}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-700/20 transition hover:bg-blue-800"
            >
              <span className="text-lg leading-none">＋</span>
              New conversation
            </button>
          </div>

          <div className="px-4 pt-6">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Help topics
            </p>

            <nav className="mt-3 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTopic("all");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                  activeTopic === "all"
                    ? "bg-blue-50 text-blue-800"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-base shadow-sm">
                  ⌂
                </span>
                All help topics

                <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                  {topics.length}
                </span>
              </button>

              {topics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => chooseTopic(topic)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                    activeTopic === topic.id
                      ? "bg-blue-50 font-semibold text-blue-800"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-base">
                    {topic.icon}
                  </span>

                  <span className="min-w-0 flex-1 truncate">
                    {topic.title}
                  </span>

                  <span className="text-slate-300">›</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 p-4 text-white">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  ✦
                </span>
                <p className="text-sm font-semibold">
                  Need more help?
                </p>
              </div>

              <p className="mt-2 text-xs leading-5 text-blue-100/80">
                For official or time-sensitive details, contact the
                relevant university office.
              </p>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-blue-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Rule-based assistant available
              </div>
            </div>

            <p className="px-2 pt-4 text-center text-[10px] text-slate-400">
              UOS Helpdesk Bot · Student support
            </p>
          </div>
        </aside>

        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-20 bg-slate-950/40 lg:hidden"
          />
        )}

        {/* Main panel */}
        <section className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
                aria-label="Open menu"
              >
                ☰
              </button>

              <div className="min-w-0">
                <h1 className="truncate text-base font-extrabold text-slate-900 sm:text-lg">
                  UOS Helpdesk Bot
                </h1>

                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  University Student Assistance
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Assistant ready
            </div>

            <button
              type="button"
              onClick={startNewChat}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 sm:hidden"
            >
              New chat
            </button>
          </header>

          <div className="flex-1 px-3 py-6 sm:px-6 sm:py-8 lg:px-10">
            <div className="mx-auto max-w-4xl">
              {/* Welcome hero */}
              <div className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-950 p-6 text-white shadow-xl shadow-blue-950/10 sm:p-8">
                <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[28px] border-white/5" />
                <div className="pointer-events-none absolute -bottom-24 right-28 h-48 w-48 rounded-full bg-cyan-400/10 blur-2xl" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-blue-100">
                    <span>✦</span> YOUR CAMPUS COMPANION
                  </div>

                  <h2 className="mt-4 max-w-2xl text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                    Your university questions,
                    <br className="hidden sm:block" /> answered in one place.
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/85 sm:text-base">
                    Assalam-o-Alaikum! Get help with common UOS
                    student questions. Choose a topic or ask in your
                    own words.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 text-xs text-blue-100">
                    <span className="rounded-full bg-white/10 px-3 py-2">
                      🎓 Admissions
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-2">
                      📋 Academics
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-2">
                      🏫 Campus life
                    </span>
                  </div>
                </div>
              </div>

              {/* Topic cards */}
              <div className="mb-8">
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                      Browse help center
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                      What can we help you with?
                    </h3>
                  </div>

                  <span className="hidden text-xs text-slate-400 sm:block">
                    Select a topic to ask
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleTopics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => chooseTopic(topic)}
                      disabled={isTyping}
                      className={`group flex min-h-[116px] items-start gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 disabled:opacity-60 ${
                        activeTopic === topic.id
                          ? "border-blue-300 ring-2 ring-blue-100"
                          : "border-slate-200"
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${topic.color} text-xl shadow-sm`}
                      >
                        {topic.icon}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-slate-800">
                          {topic.title}
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          {topic.subtitle}
                        </span>

                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                          Ask a question{" "}
                          <span className="transition group-hover:translate-x-1">
                            →
                          </span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="topic-search"
                    className="mb-2 block text-xs font-medium text-slate-500"
                  >
                    Find a help topic
                  </label>

                  <input
                    id="topic-search"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search admissions, fees, library..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />

                  {visibleTopics.length === 0 && (
                    <p className="mt-2 text-sm text-slate-500">
                      No matching topic found. Try another word or
                      ask your question in the chat below.
                    </p>
                  )}
                </div>
              </div>

              {/* Chat window */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800 text-xs font-black text-white">
                      UOS
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Chat with Helpdesk
                      </h3>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        Ask a question to get started
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={startNewChat}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  >
                    ↻ Reset
                  </button>
                </div>

                <div className="max-h-[480px] min-h-[280px] space-y-5 overflow-y-auto bg-slate-50/70 px-3 py-5 sm:px-6 sm:py-6">
                  {messages.map((message) => {
                    const isUser = message.sender === "user";

                    return (
                      <div
                        key={message.id}
                        className={`flex items-end gap-2.5 ${
                          isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isUser && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-[9px] font-black text-white shadow-sm">
                            UOS
                          </div>
                        )}

                        <div
                          className={`flex max-w-[88%] flex-col sm:max-w-[78%] ${
                            isUser ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                              isUser
                                ? "rounded-br-md bg-blue-700 text-white"
                                : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                            }`}
                          >
                            {message.text}
                          </div>

                          <span className="mt-1 px-1 text-[10px] text-slate-400">
                            {isUser ? "You" : "UOS Assistant"} ·{" "}
                            {message.time}
                          </span>
                        </div>

                        {isUser && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-xs font-bold text-slate-600">
                            You
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isTyping && (
                    <div className="flex items-end gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-800 text-[9px] font-black text-white">
                        UOS
                      </div>

                      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-4">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
                      </div>
                    </div>
                  )}

                  <div ref={endRef} />
                </div>

                <div className="border-t border-slate-100 bg-white p-3 sm:p-5">
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      sendMessage();
                    }}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50"
                  >
                    <span className="hidden pl-3 text-lg text-slate-400 sm:block">
                      ⌕
                    </span>

                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      placeholder="Type your question here..."
                      aria-label="Type your question"
                      autoComplete="off"
                      disabled={isTyping}
                      className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
                    />

                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:px-5"
                    >
                      <span>Send</span>
                      <span aria-hidden="true">➤</span>
                    </button>
                  </form>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
                    <p className="text-[10px] text-slate-400">
                      Press Enter to send · No personal information needed
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Rule-based assistant
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {quickQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        disabled={isTyping}
                        onClick={() => sendMessage(question)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-[11px] font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <p className="py-6 text-center text-[11px] leading-5 text-slate-400">
                UOS Helpdesk Bot provides general guidance only.
                Confirm official policies, fees and deadlines with
                the relevant university office.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
