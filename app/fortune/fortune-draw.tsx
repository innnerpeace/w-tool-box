"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./fortune.module.css";

// ---------- 籤的資料 ----------
type Level = {
  name: string;
  weight: number; // 抽中機率權重
  base: number; // 各項運勢的基本星數（1–5）
  color: string;
  soft: string;
  poem: [string, string, string, string];
  summary: string;
  advice: string;
};

const LEVELS: Level[] = [
  {
    name: "大吉",
    weight: 100,
    base: 5,
    color: "#d7392b",
    soft: "#fde3dc",
    poem: ["紅日破雲開", "春風滿路來", "心中所願事", "一一盡花開"],
    summary: "諸事順利，想做的事今天放膽去做！",
    advice: "好運當頭，把握機會主動出擊，也別忘了分享喜悅。",
  },
  {
    name: "中吉",
    weight: 15,
    base: 4,
    color: "#e5642a",
    soft: "#fde8d6",
    poem: ["細雨潤新芽", "枝頭漸見花", "耐心勤灌溉", "好運自到家"],
    summary: "運勢穩穩上升，努力會看到成果。",
    advice: "按部就班完成手上的事，小小的堅持會帶來好消息。",
  },
  {
    name: "小吉",
    weight: 18,
    base: 4,
    color: "#e98b1f",
    soft: "#fdeed2",
    poem: ["小舟過淺灣", "微浪不為難", "穩穩向前去", "回首已青山"],
    summary: "平順中帶點小確幸，留意身邊的好事。",
    advice: "今天適合整理與收尾，把小事做好就是好運。",
  },
  {
    name: "吉",
    weight: 20,
    base: 3,
    color: "#c48a14",
    soft: "#fbf0cf",
    poem: ["晴空無大風", "日子自從容", "守住平常心", "好事在其中"],
    summary: "平平安安的一天，保持節奏就很好。",
    advice: "不必急著求變，照自己的步調走，自然順順利利。",
  },
  {
    name: "末吉",
    weight: 15,
    base: 3,
    color: "#6f8f3a",
    soft: "#e8f0d6",
    poem: ["冬盡雪猶寒", "梅枝已露端", "莫嫌來得晚", "後福最綿長"],
    summary: "好運來得慢一些，但正在路上。",
    advice: "先蹲後跳，今天多做準備，之後會有回報。",
  },
  {
    name: "凶",
    weight: 14,
    base: 2,
    color: "#5b6b82",
    soft: "#e3e8ef",
    poem: ["夜路月微茫", "行前且細量", "慢行無大礙", "靜待曙天光"],
    summary: "小心謹慎，避開衝動的決定。",
    advice: "重要的事多確認一次，說話放慢半拍，就能化險為夷。",
  },
  {
    name: "大凶",
    weight: 8,
    base: 1,
    color: "#3f3f5a",
    soft: "#e2e1ea",
    poem: ["烏雲壓山頭", "風急浪難收", "守靜不妄動", "雲散見晴秋"],
    summary: "運勢觸底，接下來只會越來越好！",
    advice: "今天低調行事、早點休息。跌到谷底，下一步就是往上走。",
  },
];

const ASPECTS = [
  {
    key: "工作",
    icon: "💼",
    high: ["靈感不斷，提案容易被採納", "效率超高，適合挑戰難題", "貴人相助，合作很順利"],
    mid: ["穩定推進，照計畫進行就好", "適合整理資料、處理例行公事", "多和同事溝通，會有新想法"],
    low: ["容易分心，重要文件多檢查", "別急著做決定，先觀察再行動", "可能遇到小阻礙，耐心處理"],
  },
  {
    key: "財運",
    icon: "💰",
    high: ["可能有意外小收入", "適合規劃理財，眼光很準", "購物容易遇到好折扣"],
    mid: ["收支平衡，維持記帳好習慣", "小額花費帶來好心情", "量入為出，財運穩定"],
    low: ["避免衝動購物", "借貸、投資先緩一緩", "錢包收好，小心丟三落四"],
  },
  {
    key: "感情",
    icon: "💗",
    high: ["魅力大增，容易遇到好緣分", "和重要的人心意相通", "適合表白或約會"],
    mid: ["簡單的問候就能拉近距離", "和朋友聚聚，氣氛溫暖", "多聽少說，感情更穩定"],
    low: ["說話小心，避免誤會", "情緒起伏大，先冷靜再溝通", "給彼此一點空間"],
  },
  {
    key: "健康",
    icon: "🍀",
    high: ["精神飽滿，適合運動", "睡得好、吃得香", "身心都很輕盈"],
    mid: ["記得多喝水、起來走走", "作息規律就很健康", "適合散步放鬆"],
    low: ["注意休息，別熬夜", "飲食清淡一點", "久坐記得伸展肩頸"],
  },
];

const LUCKY_COLORS = ["朱紅", "金黃", "橘色", "薄荷綠", "天空藍", "象牙白", "櫻花粉", "薰衣草紫", "墨綠", "奶茶色"];
const LUCKY_DIRECTIONS = ["東", "南", "西", "北", "東南", "東北", "西南", "西北"];
const LUCKY_ITEMS = ["一杯熱茶", "筆記本", "耳機", "小盆栽", "手帕", "原子筆", "零錢包", "書籤", "保溫瓶", "鑰匙圈"];
const LUCKY_TIMES = ["早上 7–9 點", "早上 9–11 點", "中午 11–13 點", "下午 13–15 點", "下午 15–17 點", "傍晚 17–19 點", "晚上 19–21 點"];
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

type Result = {
  no: number;
  level: Level;
  date: string;
  aspects: { key: string; icon: string; stars: number; text: string }[];
  lucky: { color: string; number: number; direction: string; item: string; time: string };
};

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function pickLevel(): Level {
  const total = LEVELS.reduce((sum, l) => sum + l.weight, 0);
  let r = Math.random() * total;
  for (const level of LEVELS) {
    r -= level.weight;
    if (r < 0) return level;
  }
  return LEVELS[LEVELS.length - 1];
}

function drawFortune(): Result {
  const level = pickLevel();
  const now = new Date();
  return {
    no: 1 + Math.floor(Math.random() * 100),
    level,
    date: `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日（${WEEKDAYS[now.getDay()]}）`,
    aspects: ASPECTS.map((a) => {
      // 以籤的等級為基準，隨機上下浮動一顆星
      const stars = Math.min(5, Math.max(1, level.base + pick([-1, 0, 0, 1])));
      const pool = stars >= 4 ? a.high : stars === 3 ? a.mid : a.low;
      return { key: a.key, icon: a.icon, stars, text: pick(pool) };
    }),
    lucky: {
      color: pick(LUCKY_COLORS),
      number: 1 + Math.floor(Math.random() * 99),
      direction: pick(LUCKY_DIRECTIONS),
      item: pick(LUCKY_ITEMS),
      time: pick(LUCKY_TIMES),
    },
  };
}

const SHAKE_MS = 1600;
const STICK_MS = 700;

type Phase = "idle" | "shaking" | "out" | "result";

export default function FortuneDraw() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  function draw() {
    if (phase === "shaking" || phase === "out") return;
    const next = drawFortune();
    setResult(null);
    setPhase("shaking");
    timers.current.push(
      setTimeout(() => setPhase("out"), SHAKE_MS),
      setTimeout(() => {
        setResult(next);
        setPhase("result");
        // 捲到結果卡片
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      }, SHAKE_MS + STICK_MS),
    );
  }

  const busy = phase === "shaking" || phase === "out";

  return (
    <div className="flex w-full max-w-[480px] flex-col bg-[#f7efdd] pb-12 text-[#2b1d10] shadow-[0_0_40px_rgba(120,80,20,0.08)]">
      {/* ===== 主視覺 ===== */}
      <section className="relative overflow-hidden bg-[#fbf1d4] px-4 pb-8 pt-10">
        <div className={styles.rays} aria-hidden />
        <div className="relative text-center">
          <h1 className="text-[2.6rem] font-black leading-tight tracking-wide text-[#24180c] drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
            好運抽籤
          </h1>
          <p className="mt-1 text-lg font-bold text-[#3b2a17]">誠心默念・搖一搖・看看今天的運勢</p>
        </div>

        {/* 籤筒 */}
        <button
          type="button"
          onClick={draw}
          disabled={busy}
          aria-label="搖籤筒抽籤"
          className="relative mx-auto mt-6 block w-[200px] cursor-pointer disabled:cursor-wait"
        >
          <svg viewBox="0 0 200 260" className={`h-auto w-full ${phase === "shaking" ? styles.shaking : ""}`} aria-hidden>
            {/* 籤枝 */}
            {[-44, -30, -16, 16, 30, 44].map((dx, i) => (
              <rect
                key={dx}
                x={100 + dx - 5}
                y={30 + (i % 3) * 8}
                width={10}
                height={120}
                rx={3}
                fill="#e9c27a"
                stroke="#b88a3c"
                strokeWidth={1.5}
                transform={`rotate(${dx / 6} 100 150)`}
              />
            ))}
            {/* 跳出來的那一支 */}
            <g className={phase === "out" || phase === "result" ? styles.stickOut : ""}>
              <rect x={94} y={20} width={12} height={130} rx={3} fill="#f3d48e" stroke="#b88a3c" strokeWidth={1.5} />
              <rect x={94} y={20} width={12} height={22} rx={3} fill="#d7392b" />
            </g>
            {/* 筒身 */}
            <path d="M 46 100 L 154 100 L 146 248 Q 100 258 54 248 Z" fill="#d7392b" />
            <path d="M 46 100 L 154 100 L 153 116 L 47 116 Z" fill="#f0b429" />
            <path d="M 51 220 L 149 220 L 148 234 L 52 234 Z" fill="#f0b429" />
            <ellipse cx={100} cy={100} rx={54} ry={9} fill="#9e2418" />
            <circle cx={100} cy={168} r={30} fill="#fff6dc" stroke="#f0b429" strokeWidth={4} />
            <text
              x={100}
              y={170}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={34}
              fontWeight={900}
              fill="#d7392b"
              style={{ fontFamily: "var(--font-serif-tc), serif" }}
            >
              籤
            </text>
          </svg>
        </button>

        <div className="relative mt-6 flex justify-center">
          <button
            type="button"
            onClick={draw}
            disabled={busy}
            className="w-full max-w-[320px] rounded-2xl bg-[#e9762b] py-4 text-lg font-black tracking-widest text-white shadow-[0_4px_0_#c4561b] transition active:translate-y-1 active:shadow-none disabled:bg-[#d8c7ae] disabled:shadow-none"
          >
            {phase === "shaking" ? "搖籤中…" : phase === "out" ? "籤出來了！" : result ? "再抽一次" : "搖籤抽運勢"}
          </button>
        </div>
      </section>

      {/* ===== 結果 ===== */}
      <div ref={resultRef} className="scroll-mt-4 px-4 pt-8" aria-live="polite">
        {!result ? (
          <p className="text-center font-bold text-[#8a7560]">點籤筒或按鈕，抽出今天的運勢籤</p>
        ) : (
          <FortuneCard key={`${result.no}-${result.level.name}-${result.lucky.number}`} result={result} />
        )}
      </div>
    </div>
  );
}

function Stars({ count, color }: { count: number; color: string }) {
  return (
    <span className="tracking-[0.1em]" aria-label={`${count} 顆星`}>
      <span style={{ color }}>{"★".repeat(count)}</span>
      <span className="text-[#e6dccb]">{"★".repeat(5 - count)}</span>
    </span>
  );
}

function FortuneCard({ result }: { result: Result }) {
  const { level } = result;
  const serif = { fontFamily: "var(--font-serif-tc), serif" };

  return (
    <article className={`${styles.reveal} overflow-hidden rounded-3xl bg-[#fffaf0] shadow-[0_6px_24px_rgba(120,80,20,0.12)]`}>
      {/* 籤頭 */}
      <div className="flex items-center justify-between px-5 py-3 text-white" style={{ background: level.color }}>
        <span className="font-black tracking-widest" style={serif}>
          第 {result.no} 籤
        </span>
        <span className="text-sm font-bold opacity-90">{result.date}</span>
      </div>

      <div className="border-x-4 border-b-4 px-5 pb-6 pt-6" style={{ borderColor: level.soft }}>
        {/* 等級 + 籤詩 */}
        <div className="flex items-center justify-center gap-6">
          <div
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 text-5xl font-black"
            style={{ ...serif, color: level.color, borderColor: level.color, background: level.soft }}
          >
            {level.name}
          </div>
          {/* 直書，由右往左讀 */}
          <div className="flex flex-row-reverse gap-3 text-xl font-bold leading-none text-[#3b2a17]" style={serif}>
            {level.poem.map((line) => (
              <span key={line} className={styles.vertical}>
                {line}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-lg font-black" style={{ color: level.color }}>
          {level.summary}
        </p>

        {/* 各項運勢 */}
        <ul className="mt-5 flex flex-col gap-2">
          {result.aspects.map((a) => (
            <li key={a.key} className="rounded-2xl bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-black">
                  <span className="mr-1.5" aria-hidden>
                    {a.icon}
                  </span>
                  {a.key}
                </span>
                <Stars count={a.stars} color={level.color} />
              </div>
              <p className="mt-1 text-sm text-[#6b5a48]">{a.text}</p>
            </li>
          ))}
        </ul>

        {/* 幸運小物 */}
        <h3 className="mt-6 text-center text-base font-black">今日幸運</h3>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-center">
          {[
            ["幸運色", result.lucky.color],
            ["幸運數字", String(result.lucky.number)],
            ["幸運方位", result.lucky.direction],
            ["幸運小物", result.lucky.item],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white px-3 py-3">
              <dt className="text-xs font-bold text-[#a8957e]">{label}</dt>
              <dd className="mt-0.5 text-lg font-black" style={{ color: level.color }}>
                {value}
              </dd>
            </div>
          ))}
          <div className="col-span-2 rounded-2xl bg-white px-3 py-3">
            <dt className="text-xs font-bold text-[#a8957e]">幸運時段</dt>
            <dd className="mt-0.5 text-lg font-black" style={{ color: level.color }}>
              {result.lucky.time}
            </dd>
          </div>
        </dl>

        {/* 建議 */}
        <div className="mt-6 rounded-2xl px-4 py-4" style={{ background: level.soft }}>
          <p className="text-sm font-black" style={{ color: level.color }}>
            今日建議
          </p>
          <p className="mt-1 font-bold leading-relaxed text-[#3b2a17]">{level.advice}</p>
        </div>

        <p className="mt-4 text-center text-xs text-[#a8957e]">籤詩僅供娛樂參考，好運掌握在自己手中 ✨</p>
      </div>
    </article>
  );
}
