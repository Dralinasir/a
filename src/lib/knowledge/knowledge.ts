
export type KnowledgeDocument = {
  id: string;
  title: string;
  category: string;
  content: string;
  keywords: string[];
  sourceUrl?: string;
  verified: boolean;
};

export const UNIVERSITY_SOURCES = {
  website: "https://uos.edu.pk/",
};

export const knowledgeBase: KnowledgeDocument[] = [
  {
    id: "admissions-general",
    title: "Admissions and Eligibility",
    category: "Admissions",
    content:
      "Admission eligibility depends on the selected degree program, academic qualifications and the current university admission policy. Check the official University of Sargodha admission information for program-specific requirements, application deadlines and required documents. Do not assume that every program has the same eligibility criteria.",
    keywords: [
      "admission",
      "admissions",
      "eligibility",
      "apply",
      "application",
      "program",
      "degree",
      "dakhla",
      "admission kab",
      "admission requirements",
    ],
    sourceUrl: UNIVERSITY_SOURCES.website,
    verified: false,
  },
  {
    id: "fees-general",
    title: "Fees and Payments",
    category: "Fees",
    content:
      "University fees vary by program, semester and applicable charges. Consult the latest official fee schedule and your university-issued challan. Confirm payment methods and deadlines through the university's official channels. This assistant cannot verify a personal payment or access a student's fee account.",
    keywords: [
      "fee",
      "fees",
      "challan",
      "payment",
      "tuition",
      "semester fee",
      "dues",
      "fees kitni",
      "fee structure",
      "fee jama",
    ],
    sourceUrl: UNIVERSITY_SOURCES.website,
    verified: false,
  },
  {
    id: "scholarships-general",
    title: "Scholarships and Financial Aid",
    category: "Scholarships",
    content:
      "Scholarship availability, eligibility, required documents and deadlines depend on the specific scheme. Check official university announcements and confirm details with the relevant scholarship or financial-aid office. Do not assume that a scholarship is currently open without a current official notice.",
    keywords: [
      "scholarship",
      "financial aid",
      "financial assistance",
      "need based",
      "merit",
      "wazifa",
      "stipend",
      "scholarship apply",
    ],
    sourceUrl: UNIVERSITY_SOURCES.website,
    verified: false,
  },
  {
    id: "exams-general",
    title: "Examinations and Date Sheets",
    category: "Examinations",
    content:
      "Examination schedules and date sheets depend on the program, semester and examination session. Consult official university examination notices or the relevant student portal. Confirm the date, time, venue and any instructions from the official notice before attending an examination.",
    keywords: [
      "exam",
      "examination",
      "date sheet",
      "datesheet",
      "paper",
      "schedule",
      "midterm",
      "final",
      "imtihan",
      "paper kab hai",
    ],
    sourceUrl: UNIVERSITY_SOURCES.website,
    verified: false,
  },
  {
    id: "results-general",
    title: "Results and Transcripts",
    category: "Results",
    content:
      "Check examination results through the official university result or student portal. Result availability and transcript procedures may vary by program and examination session. This assistant cannot access or confirm an individual's private result, marks or transcript.",
    keywords: [
      "result",
      "results",
      "marks",
      "transcript",
      "gpa",
      "cgpa",
      "grades",
      "nateeja",
      "result check",
    ],
    sourceUrl: UNIVERSITY_SOURCES.website,
    verified: false,
  },
  {
    id: "library-general",
    title: "Library Services",
    category: "Library",
    content:
      "For library opening hours, membership, borrowing rules, available resources and fines, consult the university's official library information or contact the library directly. Opening hours and borrowing policies should not be assumed without current confirmation.",
    keywords: [
      "library",
      "books",
      "book issue",
      "library card",
      "return book",
      "fine",
      "kutub khana",
    ],
    sourceUrl: UNIVERSITY_SOURCES.website,
    verified: false,
  },
  {
    id: "hostel-transport-general",
    title: "Hostel and Transport",
    category: "Campus Services",
    content:
      "Hostel availability, accommodation eligibility, transport routes, schedules and charges can change. Confirm current arrangements, application procedures and deadlines with the relevant university office or official notice.",
    keywords: [
      "hostel",
      "accommodation",
      "room",
      "transport",
      "bus",
      "route",
      "pick and drop",
      "hostel apply",
      "rehaiysh",
      "sawari",
    ],
    sourceUrl: UNIVERSITY_SOURCES.website,
    verified: false,
  },
  {
    id: "student-support-general",
    title: "Student Support and Complaints",
    category: "Student Support",
    content:
      "For academic or administrative concerns, contact the relevant department or authorized university office. Keep any application reference, supporting documents and correspondence. This knowledge base does not submit a complaint or create a ticket by itself.",
    keywords: [
      "complaint",
      "support",
      "problem",
      "issue",
      "department",
      "contact",
      "application status",
      "shikayat",
      "masla",
      "help",
    ],
    sourceUrl: UNIVERSITY_SOURCES.website,
    verified: false,
  },
];

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize("NFKC")
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "to",
  "for",
  "of",
  "in",
  "on",
  "please",
  "tell",
  "me",
  "about",
  "what",
  "how",
  "can",
  "i",
  "my",
  "hai",
  "hain",
  "ka",
  "ki",
  "ke",
  "kya",
  "mujhe",
  "batao",
  "bata dein",
]);

function getTokens(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

export type KnowledgeMatch = {
  document: KnowledgeDocument;
  score: number;
};

export function searchKnowledge(
  question: string,
  limit = 3,
): KnowledgeMatch[] {
  const normalizedQuestion = normalizeText(question);

  if (!normalizedQuestion) {
    return [];
  }

  const questionTokens = new Set(getTokens(normalizedQuestion));

  const matches = knowledgeBase
    .map((document) => {
      const title = normalizeText(document.title);
      const category = normalizeText(document.category);
      const content = normalizeText(document.content);
      const keywords = document.keywords.map(normalizeText);

      let score = 0;

      if (title && normalizedQuestion.includes(title)) {
        score += 6;
      }

      if (category && normalizedQuestion.includes(category)) {
        score += 5;
      }

      for (const keyword of keywords) {
        if (
          keyword.length > 2 &&
          normalizedQuestion.includes(keyword)
        ) {
          score += keyword.includes(" ") ? 4 : 3;
        }
      }

      const contentTokens = new Set(getTokens(content));

      for (const token of questionTokens) {
        if (contentTokens.has(token)) {
          score += 0.25;
        }
      }

      return { document, score };
    })
    .filter((match) => match.score >= 3)
    .sort((a, b) => b.score - a.score);

  return matches.slice(0, Math.max(1, limit));
}

export function getKnowledgeFallback(): string {
  return (
    "I couldn't find a sufficiently reliable answer in my current " +
    "university knowledge base. Please check the official University " +
    "of Sargodha website at https://uos.edu.pk/ or contact the " +
    "relevant university office. I don't want to guess about official " +
    "policies, deadlines, fees or personal records."
  );
}
