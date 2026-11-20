import Link from "next/link";
import Logo from "./logo";

const NAV = [
  { href: "/lottery", label: "抽獎轉盤" },
  { href: "/pomodoro", label: "番茄鐘" },
  { href: "/fortune", label: "好運抽籤" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#efe0c2]/70 bg-[#fbf4e4]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="W Tool Box 首頁">
          <Logo />
          <span className="text-lg font-black tracking-tight text-[#24180c]">
            W Tool Box
          </span>
        </Link>

        <nav aria-label="工具" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-bold text-[#5b4630] transition hover:bg-white hover:text-[#e5642a]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href="#tools"
          className="rounded-full bg-[#24180c] px-4 py-2 text-sm font-black text-white transition hover:bg-[#e5642a]"
        >
          開始使用
        </a>
      </div>
    </header>
  );
}
