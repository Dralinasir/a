
"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  HelpCircle,
  Home,
  Library,
  Menu,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Ticket,
  Wallet,
  X,
} from "lucide-react";

const services = [
  {
    title: "Admissions",
    description: "Programs, eligibility and application guidance",
    icon: GraduationCap,
    color: "bg-blue-50 text-blue-700",
    tags: "admission eligibility programs apply documents",
  },
  {
    title: "Fee & Scholarships",
    description: "Fee guidance, challans and financial assistance",
    icon: Wallet,
    color: "bg-emerald-50 text-emerald-700",
    tags: "fee fees challan scholarship payment",
  },
  {
    title: "Exams & Results",
    description: "Datesheets, results and examination guidance",
    icon: CalendarDays,
    color: "bg-violet-50 text-violet-700",
    tags: "exam exams results datesheet gpa",
  },
  {
    title: "Library Services",
    description: "Library access and learning resources",
    icon: Library,
    color: "bg-amber-50 text-amber-700",
    tags: "library books resources",
  },
  {
    title: "Student Support",
    description: "Complaints, student cards and certificates",
    icon: HelpCircle,
    color: "bg-rose-50 text-rose-700",
    tags: "support complaint card certificate help",
  },
  {
    title: "Campus Information",
    description: "Transport, hostel and university facilities",
    icon: Home,
    color: "bg-cyan-50 text-cyan-700",
    tags: "campus hostel transport location timing",
  },
];

const announcements = [
  {
    category: "ACADEMIC",
    title: "Academic calendar and examination updates",
    detail: "Check the official university notice board for verified dates.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    category: "STUDENT SUPPORT",
    title: "Need help with a university service?",
    detail: "Use the Helpdesk Assistant to find the right information.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    category: "IMPORTANT",
    title: "Verify deadlines before submitting applications",
    detail: "Official deadlines may change. Confirm them with the university.",
    color: "bg-amber-100 text-amber-800",
  },
];

const answers: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["hello", "hi", "salam", "assalam", "hey"],
    answer:
      "Assalam-o-Alaikum! Welcome to UOS Helpdesk. I can guide you about admissions, fees, scholarships, examinations, library services and campus facilities. What would you like to know?",
  },
  {
    keywords: ["admission", "apply", "eligibility", "program", "document"],
    answer:
      "For admission guidance, first select your desired program and check its eligibility criteria. Prepare the required academic documents and follow the official University of Sargodha admission portal for current application dates and requirements.",
  },
  {
    keywords: ["fee", "fees", "challan", "payment"],
    answer:
      "For fee information, check the official fee schedule for your program and semester. Use your university-issued challan or approved payment instructions. I cannot access your personal fee account or verify a payment.",
  },
  {
    keywords: ["scholarship", "financial aid", "financial assistance"],
    answer:
      "Scholarship eligibility and deadlines depend on the scheme. Check the university's official scholarship announcements and contact the relevant student or financial-aid office to confirm current requirements.",
  },
  {
    keywords: ["exam", "datesheet", "date sheet", "result", "gpa", "marks"],
    answer:
      "For examination schedules and results, consult the official university examination or student portal. Please verify your program, semester and examination session before relying on a date or result.",
  },
  {
    keywords: ["library", "book", "books"],
    answer:
      "For library access, ask the university library about membership, borrowing rules, opening hours and available digital resources. Please verify current timings with the official library service.",
  },
  {
    keywords: ["hostel", "transport", "bus", "timing", "location"],
    answer:
      "Hostel availability, transport routes, campus timings and facility details can change. Contact the relevant university office or consult official university notices for the latest information.",
  },
  {
    keywords: ["complaint", "ticket", "support", "help"],
    answer:
      "I can provide general guidance, but this demo does not submit a real support ticket. For an official complaint, use the university's designated complaint channel and keep any reference number you receive.",
  },
  {
    keywords: ["thank", "shukriya", "thanks"],
    answer:
      "You're welcome! I'm here to help you navigate university services. Feel free to ask another question.",
  },
];

function getAnswer(question: string) {
  const normalized = question.toLowerCase();

  const match = answers.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  return (
    match?.answer ??
    "I couldn't confidently match that question. Try asking about admissions, fee structure, scholarships, exam datesheets, results, library services, hostel or transport. For official records and current deadlines, please verify with the university."
  );
}

type ChatMessage = {
  role: "bot" | "user";
  text: string;
};

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [query, setQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Assalam-o-Alaikum! I'm your UOS Helpdesk Assistant. Ask me about admissions, fees, exams or student services.",
    },
  ]);

  const filteredServices = useMemo(
    () =>
      services.filter((service) =>
        `${service.title} ${service.description} ${service.tags}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  function askBot(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: trimmed },
      { role: "bot", text: getAnswer(trimmed) },
    ]);
    setQuestion("");
  }

  const navItems = [
    { name: "Overview", icon: Home },
    { name: "Student Services", icon: GraduationCap },
    { name: "Academic Calendar", icon: CalendarDays },
    { name: "Helpdesk Chat", icon: MessageCircle },
  ];

  function selectNav(name: string) {
    setActiveNav(name);
    setMobileMenu(false);

    if (name === "Helpdesk Chat") {
      setChatOpen(true);
    } else if (name === "Student Services") {
      document.getElementById("services")?.scrollIntoView({
        behavior: "smooth",
      });
    } else if (name === "Academic Calendar") {
      document.getElementById("announcements")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {mobileMenu && (
        <button
          aria-label="Close menu overlay"
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-[84px] items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#172554] text-white shadow-lg shadow-blue-950/15">
              <GraduationCap size={23} />
            </div>
            <div>
              <p className="text-[17px] font-extrabold tracking-tight">
                UOS <span className="text-blue-700">HELPDESK</span>
              </p>
              <p className="text-[11px] font-medium text-slate-400">
                Student assistance portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenu(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => selectNav(item.name)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-semibold transition ${
                    active
                      ? "bg-[#172554] text-white shadow-md shadow-blue-950/15"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                  {active && <ChevronRight className="ml-auto" size={16} />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 px-4">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Student resources
          </p>
          <div className="space-y-1">
            {[
              { label: "Admissions guide", icon: BookOpen },
              { label: "Fee information", icon: Wallet },
              { label: "Support centre", icon: Ticket },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setQuery(item.label.split(" ")[0]);
                    document.getElementById("services")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto p-4">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#172554] to-[#1d4ed8] p-4 text-white">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <Sparkles size={19} />
            </div>
            <p className="text-sm font-bold">Need quick assistance?</p>
            <p className="mt-1 text-xs leading-5 text-blue-100">
              Ask the helpdesk assistant for general university guidance.
            </p>
            <button
              onClick={() => setChatOpen(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-[#172554] transition hover:bg-blue-50"
            >
              Open assistant <ArrowRight size={15} />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 px-1 text-[10px] text-slate-400">
            <ShieldCheck size={14} />
            Student helpdesk concept project
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-7 xl:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenu(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">
                University of Sargodha
              </p>
              <h1 className="mt-0.5 text-sm font-bold sm:text-base">
                Student Helpdesk Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold text-emerald-700">
                Assistant available
              </span>
            </div>
            <button
              onClick={() => setChatOpen(true)}
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50"
              aria-label="Open helpdesk assistant"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-extrabold text-blue-800 ring-4 ring-blue-50">
              U
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 sm:py-9 xl:px-10">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[11px] font-bold text-blue-700 shadow-sm">
                <Sparkles size={14} />
                SMART STUDENT SERVICES
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Your university, <span className="text-blue-700">simplified.</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Find university guidance, explore student services and get
                answers to common academic questions in one place.
              </p>
            </div>
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center justify-center gap-2 self-start rounded-xl bg-[#172554] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/15 transition hover:bg-blue-900 sm:self-auto"
            >
              <MessageCircle size={17} />
              Chat with assistant
            </button>
          </div>

          <section className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-[#101b3d] via-[#172554] to-[#1d4ed8] p-6 text-white sm:p-9">
            <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full border-[42px] border-white/[0.06]" />
            <div className="pointer-events-none absolute -bottom-28 right-40 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-[1fr_230px] md:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-blue-100">
                  <Activity size={13} /> YOUR DIGITAL CAMPUS COMPANION
                </div>
                <h3 className="max-w-xl text-2xl font-extrabold leading-tight sm:text-3xl">
                  Everything you need to navigate student life.
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/80">
                  Explore academic guidance, student resources and common
                  university services through one simple portal.
                </p>
                <button
                  onClick={() => setChatOpen(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#172554] transition hover:bg-blue-50"
                >
                  Ask a question <ArrowRight size={15} />
                </button>
              </div>
              <div className="hidden rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur md:block">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Bot size={26} />
                </div>
                <p className="text-sm font-bold">UOS AI-style assistant</p>
                <p className="mt-2 text-xs leading-5 text-blue-100/75">
                  Rule-based question matching for common student enquiries.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-emerald-200">
                  <CheckCircle2 size={14} /> Ready for questions
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Help topics",
                value: "06",
                note: "Service categories",
                icon: BookOpen,
                style: "bg-blue-50 text-blue-700",
              },
              {
                label: "Quick assistance",
                value: "24/7*",
                note: "Demo interface access",
                icon: Clock3,
                style: "bg-emerald-50 text-emerald-700",
              },
              {
                label: "Response mode",
                value: "Instant",
                note: "Local rule matching",
                icon: Activity,
                style: "bg-violet-50 text-violet-700",
              },
              {
                label: "Student support",
                value: "Central",
                note: "One portal concept",
                icon: ShieldCheck,
                style: "bg-amber-50 text-amber-700",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold text-slate-500">
                      {stat.label}
                    </p>
                    <div className={`rounded-xl p-2.5 ${stat.style}`}>
                      <Icon size={18} />
                    </div>
                  </div>
                  <p className="mt-4 text-2xl font-extrabold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">{stat.note}</p>
                </div>
              );
            })}
          </section>

          <section id="services" className="mb-9 scroll-mt-24">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  Explore the portal
                </p>
                <h3 className="mt-1.5 text-xl font-extrabold tracking-tight">
                  Student services
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Find guidance by choosing a service category.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search services..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.title}
                    onClick={() => {
                      setQuestion(`Tell me about ${service.title}`);
                      setChatOpen(true);
                      setMessages((previous) => [
                        ...previous,
                        {
                          role: "user",
                          text: `Tell me about ${service.title}`,
                        },
                        {
                          role: "bot",
                          text: getAnswer(service.title),
                        },
                      ]);
                      setQuestion("");
                    }}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm shadow-slate-900/[0.02] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/[0.05]"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`rounded-2xl p-3 ${service.color}`}>
                        <Icon size={22} />
                      </div>
                      <ArrowRight
                        size={17}
                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700"
                      />
                    </div>
                    <h4 className="mt-5 text-sm font-bold">{service.title}</h4>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {service.description}
                    </p>
                    <p className="mt-4 text-[11px] font-bold text-blue-700">
                      Explore service <span aria-hidden="true">→</span>
                    </p>
                  </button>
                );
              })}
              {filteredServices.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:col-span-2 xl:col-span-3">
                  <Search className="mx-auto text-slate-400" size={24} />
                  <p className="mt-3 text-sm font-bold">No services found</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Try another search term.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section
            id="announcements"
            className="grid scroll-mt-24 gap-6 xl:grid-cols-[1.4fr_0.8fr]"
          >
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold">
                    Updates & information
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    General guidance for students
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                  <Bell size={18} />
                </div>
              </div>
              <div className="space-y-3">
                {announcements.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
                  >
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <CalendarDays size={16} />
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-[9px] font-extrabold tracking-wide ${item.color}`}
                      >
                        {item.category}
                      </span>
                      <h4 className="mt-2 text-xs font-bold leading-5">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[10px] leading-5 text-slate-400">
                These are general information cards, not live university
                announcements. Verify official dates and notices independently.
              </p>
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
                  <MessageCircle size={21} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Helpdesk assistant</h3>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Ask a common question
                  </p>
                </div>
              </div>
              <p className="mt-5 text-xs leading-6 text-slate-500">
                Need directions? Start with a suggested question. The assistant
                uses local rules and sample guidance rather than live university
                records.
              </p>
              <div className="mt-4 space-y-2">
                {[
                  "How can I apply for admission?",
                  "Where can I find the fee schedule?",
                  "How do I check exam results?",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setMessages((previous) => [
                        ...previous,
                        { role: "user", text: item },
                        { role: "bot", text: getAnswer(item) },
                      ]);
                      setChatOpen(true);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-3 text-left text-[11px] font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-800"
                  >
                    {item}
                    <ChevronRight size={15} className="shrink-0" />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setChatOpen(true)}
                className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-[#172554] px-4 py-3 text-xs font-bold text-white transition hover:bg-blue-900"
              >
                Open full chat <ArrowRight size={15} />
              </button>
            </div>
          </section>

          <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-[10px] text-slate-400 sm:flex-row sm:items-center">
            <p>UOS Helpdesk Portal · Academic project prototype</p>
            <p>Not an official university system · Demo responses only</p>
          </footer>
        </div>
      </div>

      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-5">
          <section className="flex h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:h-[660px] sm:rounded-3xl">
            <header className="flex items-center justify-between bg-[#172554] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Bot size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold">UOS Helpdesk Assistant</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[10px] text-blue-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Rule-based demo assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                aria-label="Close chat"
                className="rounded-xl p-2 text-blue-100 transition hover:bg-white/10 hover:text-white"
              >
                <X size={19} />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto bg-[#f7f9fd] p-4 sm:p-5">
              <div className="mx-auto mb-5 max-w-[250px] rounded-full border border-slate-200 bg-white px-3 py-2 text-center text-[9px] font-semibold text-slate-400">
                GENERAL GUIDANCE · NOT LIVE UNIVERSITY DATA
              </div>
              {messages.map((message, index) => (
                <div
                  key={`${index}-${message.role}`}
                  className={`flex items-end gap-2 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "bot" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                      <Bot size={15} />
                    </div>
                  )}
                  <div
                    className={`max-w-[84%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-xs leading-6 ${
                      message.role === "user"
                        ? "rounded-br-md bg-[#172554] text-white"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-2">
                {["Admission requirements", "Fee structure", "Exam results"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => askBot(item)}
                      className="rounded-full border border-blue-200 bg-white px-3 py-2 text-[10px] font-semibold text-blue-800 transition hover:bg-blue-50"
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                askBot(question);
              }}
              className="border-t border-slate-200 bg-white p-4"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">
                <input
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask about university services..."
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-xs outline-none placeholder:text-slate-400"
                  aria-label="Your question"
                />
                <button
                  type="submit"
                  disabled={!question.trim()}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#172554] text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={17} />
                </button>
              </div>
              <p className="mt-2 text-center text-[9px] text-slate-400">
                For official deadlines, results and fee records, consult UOS.
              </p>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
