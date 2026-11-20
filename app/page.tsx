import Link from "next/link";
import { Noto_Sans_TC } from "next/font/google";
import SiteHeader from "./components/site-header";
import SiteFooter from "./components/site-footer";
import styles from "./landing.module.css";

const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "700", "900"],
  preload: false,
  display: "swap",
});

const TOOLS = [
  {
    href: "/lottery",
    emoji: "🎡",
    name: "抽獎轉盤",
    tagline: "輸入名單，轉出今天的幸運兒",
    description: "活動抽獎、決定誰請飲料、分配工作都適合。名單可以隨時新增、修改、刪除，轉盤即時更新。",
    points: ["名單逐筆編輯，可一次貼上多行", "抽中後可自動移除，避免重複中獎", "保留每一輪的中獎紀錄"],
    color: "#e5642a",
    soft: "#fde8d6",
    Art: WheelArt,
  },
  {
    href: "/pomodoro",
    emoji: "🍅",
    name: "番茄鐘",
    tagline: "專注 25 分鐘，再好好休息",
    description: "用番茄工作法幫你保持節奏。專注、短休息、長休息自動切換，時間到會有提示音和通知。",
    points: ["專注／休息時間都能自訂", "分頁標題同步顯示倒數", "記錄今天完成幾顆番茄"],
    color: "#e5483b",
    soft: "#fde3dc",
    Art: TomatoArt,
  },
  {
    href: "/fortune",
    emoji: "🎋",
    name: "好運抽籤",
    tagline: "搖一搖籤筒，看看今日運勢",
    description: "從大吉到大凶七種籤，附上籤詩、四大運勢與今日幸運小物，替每天加一點小儀式感。",
    points: ["大吉、中吉、小吉…依機率隨機抽出", "工作、財運、感情、健康星等", "幸運色、數字、方位、時段"],
    color: "#c48a14",
    soft: "#fbf0cf",
    Art: FortuneArt,
  },
  {
    href: "/quiz",
    emoji: "🔮",
    name: "心理測驗",
    tagline: "憑直覺作答，一分鐘認識自己",
    description: "動物性格、壓力指數、戀愛類型、工作風格、社交電量，五種趣味測驗任你挑，測完馬上看結果與小建議。",
    points: ["五種主題測驗，每個約 1 分鐘", "結果附性格組成或分數分析", "測完還能接著挑戰其他測驗"],
    color: "#8b5cc4",
    soft: "#ece3f7",
    Art: QuizArt,
  },
];

const FEATURES = [
  { icon: "⚡", title: "打開就能用", text: "不用下載、不用註冊，點開網頁馬上開始。" },
  { icon: "📱", title: "手機電腦都好用", text: "版面自動適應螢幕大小，隨時隨地都能用。" },
  { icon: "🔒", title: "資料不外流", text: "名單和設定只留在你的瀏覽器，不會上傳。" },
  { icon: "🎁", title: "完全免費", text: "所有工具都免費使用，之後還會加入更多。" },
];

const CONFETTI = [
  { left: "6%", top: "18%", w: 12, h: 6, color: "#f08a24", rotate: 25, delay: 0 },
  { left: "14%", top: "68%", w: 8, h: 8, color: "#47b36b", rotate: 10, delay: 0.8 },
  { left: "46%", top: "10%", w: 10, h: 5, color: "#e5642a", rotate: -30, delay: 1.4 },
  { left: "88%", top: "14%", w: 9, h: 9, color: "#ffffff", rotate: 45, delay: 0.3 },
  { left: "94%", top: "60%", w: 12, h: 5, color: "#ffc93c", rotate: -15, delay: 1.9 },
  { left: "52%", top: "88%", w: 8, h: 6, color: "#47b36b", rotate: 60, delay: 1.1 },
  { left: "30%", top: "30%", w: 6, h: 6, color: "#ffffff", rotate: 0, delay: 2.2 },
];

export default function Home() {
  return (
    <div id="top" className={`${notoSansTC.className} flex flex-1 flex-col bg-[#fbf4e4] text-[#24180c]`}>
      <SiteHeader />

      <main className="flex-1">
        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf1d4] to-[#fbf4e4]">
          <div className={styles.rays} aria-hidden />
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              aria-hidden
              className={styles.confetti}
              style={{
                left: c.left,
                top: c.top,
                width: c.w,
                height: c.h,
                background: c.color,
                rotate: `${c.rotate}deg`,
                animationDelay: `${c.delay}s`,
              }}
            />
          ))}

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[1.05fr_1fr]">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold text-[#c4561b] shadow-sm ring-1 ring-[#f3dcb8]">
                <span className="h-2 w-2 rounded-full bg-[#47b36b]" />4 個工具已上線
              </span>
              <h1 className="mt-6 text-[2.6rem] font-black leading-[1.15] tracking-tight sm:text-6xl">
                日常小事，
                <br />
                交給<span className="relative whitespace-nowrap text-[#e5642a]">
                  工具箱
                  <svg
                    viewBox="0 0 200 16"
                    className="absolute -bottom-2 left-0 h-3 w-full"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path d="M3 11 Q 100 1 197 9" fill="none" stroke="#f0b429" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
                。
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-[#5b4630] lg:mx-0">
                W Tool Box 收集了抽獎、專注、占卜、心理測驗這些生活中用得到的小工具。打開網頁就能用，簡單、好看、又好玩。
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#tools"
                  className="w-full rounded-2xl bg-[#e9762b] px-8 py-4 text-center text-lg font-black tracking-wider text-white shadow-[0_5px_0_#c4561b] transition hover:brightness-105 active:translate-y-1 active:shadow-none sm:w-auto"
                >
                  看看有哪些工具
                </a>
                <Link
                  href="/fortune"
                  className="w-full rounded-2xl bg-white px-8 py-4 text-center text-lg font-black text-[#5b4630] shadow-[0_5px_0_#eadbc2] ring-1 ring-[#f0e2c8] transition hover:text-[#e5642a] active:translate-y-1 active:shadow-none sm:w-auto"
                >
                  🎋 先抽個籤
                </Link>
              </div>
            </div>

            {/* 主視覺：三張漂浮卡片 */}
            <div className="relative mx-auto h-[360px] w-full max-w-[460px] sm:h-[420px]" aria-hidden>
              <div
                className={`${styles.float} absolute left-0 top-4 w-[58%] rotate-[-6deg] rounded-3xl bg-white p-4 shadow-[0_18px_40px_rgba(150,90,20,0.18)]`}
              >
                <WheelArt />
                <p className="mt-2 text-center text-sm font-black">🎡 抽獎轉盤</p>
              </div>
              <div
                className={`${styles.floatSlow} absolute right-0 top-0 w-[46%] rotate-[5deg] rounded-3xl bg-white p-4 shadow-[0_18px_40px_rgba(150,90,20,0.18)]`}
                style={{ animationDelay: "1s" }}
              >
                <TomatoArt />
                <p className="mt-2 text-center text-sm font-black">🍅 番茄鐘</p>
              </div>
              <div
                className={`${styles.float} absolute bottom-0 right-[12%] w-[44%] rotate-[-2deg] rounded-3xl bg-white p-4 shadow-[0_18px_40px_rgba(150,90,20,0.18)]`}
                style={{ animationDelay: "2s" }}
              >
                <FortuneArt />
                <p className="mt-2 text-center text-sm font-black">🎋 好運抽籤</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 工具介紹 ===== */}
        <section id="tools" className="scroll-mt-16 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow="TOOLS" title="四個工具，四種好用" subtitle="點選卡片就能直接開始使用" />

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgba(120,80,20,0.07)] ring-1 ring-[#f0e2c8] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(150,90,20,0.16)]"
                >
                  <div className="relative flex h-52 items-center justify-center overflow-hidden" style={{ background: tool.soft }}>
                    <div className="w-40 transition duration-500 group-hover:scale-110">
                      <tool.Art />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-2xl font-black">
                      <span className="mr-2" aria-hidden>
                        {tool.emoji}
                      </span>
                      {tool.name}
                    </h3>
                    <p className="mt-1 font-bold" style={{ color: tool.color }}>
                      {tool.tagline}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#6b5a48]">{tool.description}</p>
                    <ul className="mb-6 mt-4 flex flex-col gap-2 text-sm">
                      {tool.points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span
                            className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                            style={{ background: tool.color }}
                          >
                            ✓
                          </span>
                          <span className="text-[#3b2a17]">{p}</span>
                        </li>
                      ))}
                    </ul>
                    <span
                      className="mt-auto inline-flex items-center justify-center gap-1 rounded-2xl py-3 font-black text-white transition group-hover:gap-3"
                      style={{ background: tool.color }}
                    >
                      開始使用 <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 特色 ===== */}
        <section id="features" className="scroll-mt-16 bg-white px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow="WHY" title="為什麼用 W Tool Box？" subtitle="小工具也要用得舒服" />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-3xl bg-[#fbf4e4] p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    {f.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-black">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#6b5a48]">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="px-4 py-20 sm:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f08a24] to-[#e5483b] px-6 py-14 text-center text-white shadow-[0_20px_50px_rgba(229,100,42,0.3)] sm:px-12">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" aria-hidden />
            <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10" aria-hidden />
            <h2 className="relative text-3xl font-black sm:text-4xl">今天想先用哪一個？</h2>
            <p className="relative mt-3 text-white/85">不管是抽獎、專注、看看運勢，還是測測自己，一鍵就開始。</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-2xl bg-white px-6 py-3 font-black text-[#24180c] shadow-[0_4px_0_rgba(0,0,0,0.15)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                >
                  {tool.emoji} {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <p className="text-sm font-black tracking-[0.3em] text-[#e5642a]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h2>
      <span className="mx-auto mt-4 block h-1.5 w-24 rounded-full bg-gradient-to-r from-[#f0b429] via-[#e5642a] to-[#f0b429]" />
      <p className="mt-4 text-[#6b5a48]">{subtitle}</p>
    </div>
  );
}

// ---------- 插圖 ----------
function slice(i: number, n: number, r: number, c: number) {
  const round = (v: number) => Math.round(v * 1000) / 1000;
  const a0 = ((i * 360) / n) * (Math.PI / 180);
  const a1 = (((i + 1) * 360) / n) * (Math.PI / 180);
  return `M ${c} ${c} L ${round(c + r * Math.sin(a0))} ${round(c - r * Math.cos(a0))} A ${r} ${r} 0 0 1 ${round(
    c + r * Math.sin(a1),
  )} ${round(c - r * Math.cos(a1))} Z`;
}

function WheelArt() {
  const colors = ["#f08a24", "#ffd76a", "#e5642a", "#fff3d1", "#f08a24", "#ffd76a", "#e5642a", "#fff3d1"];
  return (
    <svg viewBox="0 0 120 120" className="h-auto w-full">
      <circle cx="60" cy="60" r="56" fill="#e5642a" />
      <g className={styles.spin}>
        {colors.map((c, i) => (
          <path key={i} d={slice(i, colors.length, 48, 60)} fill={c} stroke="#fff" strokeWidth="1.5" />
        ))}
      </g>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={Math.round((60 + 52 * Math.sin(a)) * 100) / 100}
            cy={Math.round((60 - 52 * Math.cos(a)) * 100) / 100}
            r="1.8"
            fill={i % 2 ? "#ffd23f" : "#fff6c9"}
          />
        );
      })}
      <circle cx="60" cy="60" r="11" fill="#fff" />
      <circle cx="60" cy="60" r="8" fill="#f08a24" />
      <path d="M 53 0 L 67 0 L 60 16 Z" fill="#e5642a" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

function TomatoArt() {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="h-auto w-full">
      <circle cx="60" cy="60" r={r} fill="#fff" stroke="#fde3dc" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="#e5483b"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={Math.round(c * 100) / 100}
        strokeDashoffset={Math.round(c * 0.3 * 100) / 100}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="56" textAnchor="middle" fontSize="22" fontWeight="900" fill="#24180c">
        25:00
      </text>
      <text x="60" y="76" textAnchor="middle" fontSize="10" fontWeight="700" fill="#e5483b">
        專注時間
      </text>
    </svg>
  );
}

function FortuneArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-auto w-full">
      {[-22, -13, -4, 13, 22].map((dx, i) => (
        <rect
          key={dx}
          x={60 + dx - 3}
          y={14 + (i % 2) * 6}
          width="6"
          height="60"
          rx="2"
          fill="#e9c27a"
          stroke="#b88a3c"
          strokeWidth="1"
          transform={`rotate(${dx / 5} 60 70)`}
        />
      ))}
      <rect x="56" y="4" width="8" height="66" rx="2" fill="#f3d48e" stroke="#b88a3c" strokeWidth="1" />
      <rect x="56" y="4" width="8" height="12" rx="2" fill="#d7392b" />
      <path d="M 32 48 L 88 48 L 84 114 Q 60 119 36 114 Z" fill="#d7392b" />
      <path d="M 32 48 L 88 48 L 87.5 56 L 32.5 56 Z" fill="#f0b429" />
      <path d="M 35 100 L 85 100 L 84.6 106 L 35.4 106 Z" fill="#f0b429" />
      <ellipse cx="60" cy="48" rx="28" ry="5" fill="#9e2418" />
      <circle cx="60" cy="78" r="14" fill="#fff6dc" stroke="#f0b429" strokeWidth="2.5" />
      <text x="60" y="79" textAnchor="middle" dominantBaseline="central" fontSize="16" fontWeight="900" fill="#d7392b">
        籤
      </text>
    </svg>
  );
}

function QuizArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-auto w-full">
      <ellipse cx="60" cy="108" rx="34" ry="6" fill="#000" opacity="0.08" />
      <path d="M 34 96 L 86 96 L 80 108 L 40 108 Z" fill="#6b3fa0" />
      <rect x="30" y="90" width="60" height="8" rx="4" fill="#8b5cc4" />
      <circle cx="60" cy="56" r="38" fill="#b89be0" />
      <circle cx="60" cy="56" r="38" fill="url(#quizGlow)" />
      <ellipse cx="46" cy="40" rx="10" ry="6" fill="#fff" opacity="0.6" transform="rotate(-30 46 40)" />
      <path d="M 62 44 L 65 52 L 73 55 L 65 58 L 62 66 L 59 58 L 51 55 L 59 52 Z" fill="#fff" />
      <circle cx="76" cy="70" r="2.5" fill="#fff" opacity="0.8" />
      <circle cx="44" cy="68" r="1.8" fill="#fff" opacity="0.7" />
      <defs>
        <radialGradient id="quizGlow" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#f3ecff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#8b5cc4" stopOpacity="0.2" />
        </radialGradient>
      </defs>
    </svg>
  );
}
