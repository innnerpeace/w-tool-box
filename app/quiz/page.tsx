import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import QuizApp from "./quiz-app";

const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "700", "900"],
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  title: "心理測驗 | w-tools",
  description: "動物性格、壓力指數、戀愛類型、工作風格、社交電量，五種趣味心理測驗",
};

export default function QuizPage() {
  return (
    <main className={`${notoSansTC.className} flex flex-1 justify-center bg-[#f3ead8]`}>
      <QuizApp />
    </main>
  );
}
