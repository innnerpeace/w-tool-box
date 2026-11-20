"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import styles from "./lottery.module.css";

// ---- 轉盤尺寸 ----
const SIZE = 340;
const CENTER = SIZE / 2;
const RING_R = 166; // 外圈
const BULB_R = 158; // 燈泡所在半徑
const RADIUS = 150; // 扇形半徑
const BULB_COUNT = 18;
const SPIN_MS = 5000;

// ---- 配色（橘黃暖色系） ----
const SLICES = [
  { fill: "#f08a24", text: "#ffffff" },
  { fill: "#ffd76a", text: "#5a3410" },
  { fill: "#e5642a", text: "#ffffff" },
  { fill: "#fff3d1", text: "#c4561b" },
];

// 彩紙碎片：固定位置，避免伺服器與瀏覽器畫面不一致
const CONFETTI = [
  { left: "8%", top: "14%", w: 10, h: 6, color: "#f08a24", rotate: 25, delay: 0 },
  { left: "20%", top: "6%", w: 7, h: 7, color: "#47b36b", rotate: 10, delay: 0.6 },
  { left: "78%", top: "8%", w: 12, h: 5, color: "#e5642a", rotate: -30, delay: 1.2 },
  { left: "90%", top: "20%", w: 8, h: 8, color: "#ffffff", rotate: 45, delay: 0.3 },
  { left: "4%", top: "40%", w: 9, h: 5, color: "#ffc93c", rotate: -15, delay: 1.8 },
  { left: "93%", top: "46%", w: 10, h: 6, color: "#47b36b", rotate: 60, delay: 0.9 },
  { left: "12%", top: "70%", w: 7, h: 7, color: "#ffffff", rotate: 20, delay: 1.5 },
  { left: "86%", top: "72%", w: 11, h: 5, color: "#f08a24", rotate: -50, delay: 0.4 },
  { left: "30%", top: "22%", w: 6, h: 6, color: "#ffffff", rotate: 0, delay: 2.1 },
  { left: "68%", top: "26%", w: 8, h: 5, color: "#ffc93c", rotate: 35, delay: 1.1 },
];

type Entry = { id: number; name: string };

const DEFAULT_ENTRIES: Entry[] = ["小明", "小華", "小美", "阿強", "小芳", "大雄"].map((name, i) => ({
  id: i + 1,
  name,
}));

// 支援一次貼上多行或用逗號分隔的名單
function splitNames(text: string) {
  return text
    .split(/[\n,，、]/)
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

// 角度以「正上方為 0 度、順時針增加」計算
function pointAt(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  // 四捨五入到小數 3 位，避免伺服器和瀏覽器算出的浮點數尾數不同而造成 hydration 錯誤
  const round = (n: number) => Math.round(n * 1000) / 1000;
  return { x: round(CENTER + r * Math.sin(rad)), y: round(CENTER - r * Math.cos(rad)) };
}

function slicePath(startDeg: number, endDeg: number) {
  const start = pointAt(startDeg, RADIUS);
  const end = pointAt(endDeg, RADIUS);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

function shorten(name: string, max: number) {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name;
}

function sliceStyle(index: number, total: number) {
  // 避免最後一格和第一格同色
  if (total > 1 && index === total - 1 && index % SLICES.length === 0) {
    return SLICES[1];
  }
  return SLICES[index % SLICES.length];
}

const BULBS = Array.from({ length: BULB_COUNT }, (_, i) => pointAt((360 / BULB_COUNT) * i, BULB_R));

export default function LotteryWheel() {
  const [entries, setEntries] = useState<Entry[]>(DEFAULT_ENTRIES);
  const [nextId, setNextId] = useState(DEFAULT_ENTRIES.length + 1);
  const [draft, setDraft] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [removeWinner, setRemoveWinner] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // 空白的列不放上轉盤
  const validEntries = useMemo(
    () => entries.filter((e) => e.name.trim().length > 0).map((e) => ({ ...e, name: e.name.trim() })),
    [entries],
  );
  const names = validEntries.map((e) => e.name);
  const count = names.length;

  function addNames(text: string) {
    const list = splitNames(text);
    if (list.length === 0) return;
    setEntries((prev) => [...prev, ...list.map((name, i) => ({ id: nextId + i, name }))]);
    setNextId((id) => id + list.length);
    setDraft("");
  }

  function updateName(id: number, name: string) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, name } : e)));
  }

  function removeEntry(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }
  const sliceDeg = count > 0 ? 360 / count : 360;
  const fontSize = count > 24 ? 9 : count > 14 ? 11 : count > 8 ? 13 : 16;
  // 從外圈排到中心按鈕前，最多放得下幾個字
  const maxChars = Math.max(2, Math.floor((RADIUS - 52) / (fontSize + 2)));

  // 中獎視窗開啟時可以按 Esc 關閉
  useEffect(() => {
    if (!showModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  function spin() {
    if (spinning || count === 0) return;

    const index = Math.floor(Math.random() * count);
    // 讓指針停在該格內的隨機位置（避開邊界）
    const offset = (Math.random() - 0.5) * sliceDeg * 0.7;
    const targetAngle = (index + 0.5) * sliceDeg + offset;

    // 轉盤順時針轉 R 度後，指針（正上方）指到的是轉盤上 -R 的位置
    const current = ((rotation % 360) + 360) % 360;
    const delta = (((-targetAngle - current) % 360) + 360) % 360;
    const extraSpins = 6 + Math.floor(Math.random() * 3);

    setShowModal(false);
    setWinner(null);
    setPendingIndex(index);
    setSpinning(true);
    setRotation(rotation + extraSpins * 360 + delta);
  }

  function handleSpinEnd() {
    if (!spinning || pendingIndex === null) return;
    const picked = validEntries[pendingIndex];
    setSpinning(false);
    setPendingIndex(null);
    setWinner(picked.name);
    setShowModal(true);
    setHistory((prev) => [picked.name, ...prev]);

    if (removeWinner) {
      removeEntry(picked.id);
    }
  }

  return (
    <div className="relative flex w-full max-w-[480px] flex-col bg-[#f7efdd] pb-36 text-[#2b1d10] shadow-[0_0_40px_rgba(120,80,20,0.08)]">
      {/* ===== 主視覺：光芒 + 標題 + 轉盤 ===== */}
      <section className="relative overflow-hidden bg-[#fbf1d4] px-4 pb-10 pt-10">
        <div className={styles.rays} aria-hidden />
        <div className={styles.glow} aria-hidden />
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className={styles.confetti}
            aria-hidden
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

        <div className="relative text-center">
          <h1 className="text-[2.6rem] font-black leading-tight tracking-wide text-[#24180c] drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
            幸運大抽獎
          </h1>
          <p className="mt-1 text-lg font-bold text-[#3b2a17]">輸入名單・轉動轉盤・抽出幸運兒</p>
        </div>

        <div className="relative mx-auto mt-8 w-full max-w-[340px]">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full drop-shadow-[0_10px_18px_rgba(190,90,20,0.35)]" role="img" aria-label="抽獎轉盤">
            {/* 外圈 */}
            <circle cx={CENTER} cy={CENTER} r={RING_R} fill="#e5642a" />
            <circle cx={CENTER} cy={CENTER} r={RADIUS + 2} fill="#ffffff" />
            {BULBS.map((b, i) => (
              <circle
                key={i}
                cx={b.x}
                cy={b.y}
                r={3.6}
                fill={i % 2 === 0 ? "#fff6c9" : "#ffd23f"}
                className={`${styles.bulb} ${spinning ? styles.bulbFast : ""}`}
                style={{ animationDelay: i % 2 === 0 ? "0s" : spinning ? "0.125s" : "0.5s" }}
              />
            ))}

            {/* 會旋轉的部分 */}
            <g
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: `${CENTER}px ${CENTER}px`,
                transformBox: "view-box",
                transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.15, 0.85, 0.2, 1)` : "none",
              }}
              onTransitionEnd={handleSpinEnd}
            >
              {count === 0 ? (
                <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#efe3c6" />
              ) : count === 1 ? (
                <circle cx={CENTER} cy={CENTER} r={RADIUS} fill={SLICES[0].fill} />
              ) : (
                names.map((_, i) => (
                  <path
                    key={`slice-${i}`}
                    d={slicePath(i * sliceDeg, (i + 1) * sliceDeg)}
                    fill={sliceStyle(i, count).fill}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))
              )}
              {names.map((name, i) => {
                const center = (i + 0.5) * sliceDeg;
                // 直書：每個字朝外站直，轉到指針下方時名字是正的
                const chars = Array.from(shorten(name, maxChars));
                const step = fontSize + 2;
                return (
                  <g key={`label-${i}`} transform={`rotate(${center} ${CENTER} ${CENTER})`}>
                    {chars.map((ch, k) => (
                      <text
                        key={k}
                        x={CENTER}
                        y={CENTER - RADIUS + 18 + k * step}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={sliceStyle(i, count).text}
                        fontSize={fontSize}
                        fontWeight={900}
                      >
                        {ch}
                      </text>
                    ))}
                  </g>
                );
              })}
            </g>

            {/* 中心按鈕 */}
            <g
              onClick={spin}
              className={count > 0 && !spinning ? "cursor-pointer" : "cursor-not-allowed"}
              role="button"
              aria-label="開始抽獎"
            >
              <circle cx={CENTER} cy={CENTER} r={34} fill="#ffffff" />
              <circle cx={CENTER} cy={CENTER} r={28} fill="#f08a24" />
              <circle cx={CENTER} cy={CENTER - 4} r={22} fill="#ffa443" />
              <text
                x={CENTER}
                y={CENTER + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize={18}
                fontWeight={900}
              >
                抽
              </text>
            </g>

            {/* 指針 */}
            <path
              d={`M ${CENTER - 16} 0 L ${CENTER + 16} 0 L ${CENTER} 40 Z`}
              fill="#e5642a"
              stroke="#ffffff"
              strokeWidth={4}
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {winner && !showModal && (
          <p className="relative mt-6 text-center text-base font-bold text-[#3b2a17]">
            上一位幸運兒：<span className="text-xl font-black text-[#e5642a]">{winner}</span>
          </p>
        )}
      </section>

      {/* ===== 名單區 ===== */}
      <section className="px-4 pt-8">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-black">抽獎設定</h2>
          <span className="mt-2 h-1.5 w-36 rounded-full bg-gradient-to-r from-[#f0b429] via-[#e5642a] to-[#f0b429]" />
        </div>

        <ol className="mt-6">
          <Step icon={<ListIcon />} title="輸入名單" note={`共 ${count} 人`}>
            <p className="text-sm text-[#7a6650]">點名字可以直接修改，按 × 刪除。</p>

            {entries.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2">
                {entries.map((entry, i) => (
                  <li key={entry.id} className="flex items-center gap-2">
                    <span className="w-6 shrink-0 text-right text-sm font-bold text-[#c7a77a] tabular-nums">{i + 1}</span>
                    <input
                      value={entry.name}
                      onChange={(e) => updateName(entry.id, e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value.trim() === "") removeEntry(entry.id);
                      }}
                      disabled={spinning}
                      aria-label={`第 ${i + 1} 位名字`}
                      className="min-w-0 flex-1 rounded-xl border-2 border-transparent bg-[#fffaf0] px-3 py-2 text-base font-bold outline-none hover:border-[#efdcb5] focus:border-[#f08a24] focus:bg-white disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => removeEntry(entry.id)}
                      disabled={spinning}
                      aria-label={`刪除 ${entry.name}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl leading-none text-[#c4561b] hover:bg-[#ffe9d1] disabled:opacity-40"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form
              className="mt-3 flex items-start gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                addNames(draft);
              }}
            >
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  // Enter 新增；Shift + Enter 換行；中文輸入法選字時不觸發
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    addNames(draft);
                  }
                }}
                disabled={spinning}
                rows={1}
                placeholder="輸入名字，按 Enter 新增"
                title="可一次貼上多行名單"
                className="min-w-0 flex-1 resize-none rounded-xl border-2 border-dashed border-[#efdcb5] bg-white px-3 py-2 text-base outline-none placeholder:text-[#c7b393] focus:border-solid focus:border-[#f08a24] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={spinning || draft.trim() === ""}
                className="shrink-0 rounded-xl bg-[#f08a24] px-4 py-2.5 font-black text-white disabled:bg-[#e6d6bd]"
              >
                新增
              </button>
            </form>

            <button
              type="button"
              onClick={() => setEntries([])}
              disabled={spinning || entries.length === 0}
              className="mt-3 rounded-full border border-[#e9cfa2] px-4 py-1 text-sm font-bold text-[#a8682c] hover:bg-[#fff1d6] disabled:opacity-40"
            >
              清空名單
            </button>
          </Step>

          <Step icon={<GearIcon />} title="抽獎方式">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#fff7e6] px-3 py-3">
              <input
                type="checkbox"
                checked={removeWinner}
                onChange={(e) => setRemoveWinner(e.target.checked)}
                disabled={spinning}
                className="h-5 w-5 accent-[#e5642a]"
              />
              <span>
                <span className="block font-bold">抽中後從名單移除</span>
                <span className="block text-sm text-[#7a6650]">避免同一個人重複中獎</span>
              </span>
            </label>
          </Step>

          <Step icon={<TrophyIcon />} title="中獎紀錄" last>
            {history.length === 0 ? (
              <p className="text-sm text-[#7a6650]">還沒有人中獎，按下方按鈕開始抽獎吧！</p>
            ) : (
              <>
                <ol className="flex flex-col gap-2">
                  {history.map((name, i) => (
                    <li
                      key={`${history.length - i}-${name}`}
                      className="flex items-center gap-3 rounded-xl bg-[#fff7e6] px-3 py-2"
                    >
                      <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#f08a24] px-1.5 text-xs font-black text-white tabular-nums">
                        {history.length - i}
                      </span>
                      <span className="font-bold">{name}</span>
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  onClick={() => setHistory([])}
                  disabled={spinning}
                  className="mt-2 text-sm font-bold text-[#a8682c] hover:underline"
                >
                  清除紀錄
                </button>
              </>
            )}
          </Step>
        </ol>
      </section>

      {/* ===== 底部固定按鈕 ===== */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center">
        <div className="w-full max-w-[480px] rounded-t-3xl bg-[#f4f1ec] px-5 pb-6 pt-3 shadow-[0_-6px_20px_rgba(120,80,20,0.12)]">
          <p className="text-center text-sm font-black">
            {count === 0 ? "請先輸入抽獎名單" : `共 ${count} 人參加！已抽出 ${history.length} 位`}
          </p>
          <button
            type="button"
            onClick={spin}
            disabled={spinning || count === 0}
            className="mt-2 w-full rounded-2xl bg-[#e9762b] py-4 text-lg font-black tracking-widest text-white shadow-[0_4px_0_#c4561b] transition active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:bg-[#d8c7ae] disabled:shadow-none"
          >
            {spinning ? "抽獎中…" : "開始抽獎"}
          </button>
        </div>
      </div>

      {/* ===== 中獎視窗 ===== */}
      {showModal && winner && (
        <div
          className={`${styles.backdrop} fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4`}
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="中獎結果"
        >
          <div
            className={`${styles.pop} relative w-full max-w-[360px] overflow-hidden rounded-3xl bg-[#fbf1d4] px-6 pb-6 pt-10 text-center`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.rays} style={{ top: "40%" }} aria-hidden />
            {CONFETTI.slice(0, 8).map((c, i) => (
              <span
                key={i}
                className={styles.confetti}
                aria-hidden
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
            <div className="relative">
              <span className="inline-block rounded-full bg-[#e5642a] px-4 py-1 text-sm font-black tracking-widest text-white">
                恭喜中獎
              </span>
              <div className="mx-auto mt-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-[#ffc94a] to-[#f08a24] text-4xl shadow-[0_6px_0_#c4561b]">
                🎁
              </div>
              <p className="mt-5 break-all text-4xl font-black text-[#24180c]">{winner}</p>
              <p className="mt-2 text-sm font-bold text-[#7a6650]">就是今天的幸運兒！</p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-2xl border-2 border-[#e9cfa2] bg-white py-3 font-black text-[#a8682c]"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={spin}
                  disabled={count === 0}
                  className="flex-1 rounded-2xl bg-[#e9762b] py-3 font-black text-white shadow-[0_4px_0_#c4561b] active:translate-y-1 active:shadow-none disabled:bg-[#d8c7ae] disabled:shadow-none"
                >
                  再抽一次
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- 時間軸步驟 ----
function Step({
  icon,
  title,
  note,
  last = false,
  children,
}: {
  icon: ReactNode;
  title: string;
  note?: string;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <li className="relative flex gap-4 pb-6">
      {!last && <span className="absolute left-[19px] top-10 bottom-0 w-[3px] bg-[#e9762b]" aria-hidden />}
      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9762b] text-white ring-4 ring-[#f7efdd]">
        {icon}
      </span>
      <div className="min-w-0 flex-1 rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(120,80,20,0.06)]">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-base font-black text-[#e5642a]">{title}</h3>
          {note && <span className="text-sm font-bold text-[#7a6650]">{note}</span>}
        </div>
        {children}
      </div>
    </li>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" />
      <circle cx="4.5" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" />
    </svg>
  );
}
