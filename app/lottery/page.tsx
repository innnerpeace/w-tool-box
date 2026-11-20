import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import LotteryWheel from "./lottery-wheel";

const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "700", "900"],
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  title: "抽獎轉盤 | w-tools",
  description: "輸入名單，轉動轉盤抽出得獎者",
};

export default function LotteryPage() {
  return (
    <main className={`${notoSansTC.className} flex flex-1 justify-center bg-[#f3ead8]`}>
      <LotteryWheel />
    </main>
  );
}
