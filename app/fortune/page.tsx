import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import FortuneDraw from "./fortune-draw";

const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "700", "900"],
  preload: false,
  display: "swap",
});

const notoSerifTC = Noto_Serif_TC({
  weight: ["700", "900"],
  preload: false,
  display: "swap",
  variable: "--font-serif-tc",
});

export const metadata: Metadata = {
  title: "好運抽籤 | w-tools",
  description: "搖一搖籤筒，抽出今天的運勢",
};

export default function FortunePage() {
  return (
    <main className={`${notoSansTC.className} ${notoSerifTC.variable} flex flex-1 justify-center bg-[#f3ead8]`}>
      <FortuneDraw />
    </main>
  );
}
