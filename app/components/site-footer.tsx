import Link from "next/link";
import Logo from "./logo";

export default function SiteFooter() {
  return (
    <footer className="bg-[#24180c] text-[#e9dcc6]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Logo />
            <span className="text-lg font-black text-white">W Tool Box</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#bfae95]">
            一個裝滿日常小工具的工具箱。打開網頁就能用，不用安裝、不用註冊。
          </p>
        </div>

        <div>
          <h2 className="text-sm font-black tracking-widest text-white">工具</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/lottery" className="transition hover:text-[#f0b429]">
                🎡 抽獎轉盤
              </Link>
            </li>
            <li>
              <Link href="/pomodoro" className="transition hover:text-[#f0b429]">
                🍅 番茄鐘
              </Link>
            </li>
            <li>
              <Link href="/fortune" className="transition hover:text-[#f0b429]">
                🎋 好運抽籤
              </Link>
            </li>
            <li>
              <Link href="/quiz" className="transition hover:text-[#f0b429]">
                🔮 心理測驗
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-black tracking-widest text-white">關於</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            <li>
              <a href="#features" className="transition hover:text-[#f0b429]">
                特色
              </a>
            </li>
            <li>
              <a href="#tools" className="transition hover:text-[#f0b429]">
                全部工具
              </a>
            </li>
            <li>
              <a href="#top" className="transition hover:text-[#f0b429]">
                回到頂端 ↑
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-[#9c8b73] sm:flex-row sm:px-6">
          <p>© 2026 W Tool Box. All rights reserved.</p>
          <p>用 Next.js + Tailwind CSS 打造</p>
        </div>
      </div>
    </footer>
  );
}
