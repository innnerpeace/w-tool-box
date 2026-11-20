import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import PomodoroTimer from "./pomodoro-timer";

const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "700", "900"],
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  title: "番茄鐘 | w-tools",
  description: "專注 25 分鐘、休息 5 分鐘，幫你保持工作節奏",
};

export default function PomodoroPage() {
  return (
    <main className={`${notoSansTC.className} flex flex-1 justify-center bg-[#f3ead8]`}>
      <PomodoroTimer />
    </main>
  );
}
