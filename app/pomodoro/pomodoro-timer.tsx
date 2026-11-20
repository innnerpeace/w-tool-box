"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Mode = "focus" | "short" | "long";

const MODES: Record<Mode, { label: string; title: string; color: string; dark: string; soft: string; bg: string }> = {
  focus: { label: "專注", title: "專注時間", color: "#e5483b", dark: "#b8301f", soft: "#fde3dc", bg: "#fbefe6" },
  short: { label: "短休息", title: "休息一下", color: "#2f9e6e", dark: "#1f7a52", soft: "#dcf3e6", bg: "#edf6ec" },
  long: { label: "長休息", title: "好好休息", color: "#3b82c4", dark: "#2a6299", soft: "#dceaf8", bg: "#ebf2f8" },
};

const MODE_ORDER: Mode[] = ["focus", "short", "long"];

const RING_R = 130;
const RING_C = 2 * Math.PI * RING_R;

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// 結束提示音（不需要音檔）
function playChime() {
  try {
    const AudioCtx =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    [0, 0.35, 0.7].forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = i === 2 ? 1046.5 : 784;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.55);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {
    // 瀏覽器不支援就略過
  }
}

function notify(title: string, body: string) {
  try {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  } catch {
    // 略過
  }
}

export default function PomodoroTimer() {
  const [durations, setDurations] = useState<Record<Mode, number>>({ focus: 25, short: 5, long: 15 });
  const [longEvery, setLongEvery] = useState(4);
  const [autoStart, setAutoStart] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [task, setTask] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const endAtRef = useRef<number | null>(null);
  const theme = MODES[mode];
  const total = durations[mode] * 60;
  const progress = total > 0 ? 1 - remaining / total : 0;

  const switchMode = useCallback(
    (next: Mode, start = false) => {
      const sec = durations[next] * 60;
      setMode(next);
      setRemaining(sec);
      endAtRef.current = start ? Date.now() + sec * 1000 : null;
      setRunning(start);
    },
    [durations],
  );

  const finish = useCallback(() => {
    if (soundOn) playChime();
    if (mode === "focus") {
      const done = completed + 1;
      setCompleted(done);
      const next: Mode = done % longEvery === 0 ? "long" : "short";
      notify("專注完成 🍅", `完成第 ${done} 顆番茄，${MODES[next].title}吧！`);
      switchMode(next, autoStart);
    } else {
      notify("休息結束", "準備好開始下一輪專注了嗎？");
      switchMode("focus", autoStart);
    }
  }, [soundOn, mode, completed, longEvery, autoStart, switchMode]);

  // 計時：用「結束時間」換算剩餘秒數，切到別的分頁也不會跑慢
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      if (endAtRef.current === null) return;
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        clearInterval(timer);
        finish();
      }
    }, 250);
    return () => clearInterval(timer);
  }, [running, finish]);

  // 分頁標題顯示倒數
  useEffect(() => {
    document.title = running || remaining !== total
      ? `${formatTime(remaining)} ${theme.label} | 番茄鐘`
      : "番茄鐘 | w-tools";
  }, [running, remaining, total, theme.label]);

  useEffect(() => {
    return () => {
      document.title = "w-tools";
    };
  }, []);

  function start() {
    if (remaining <= 0) return;
    endAtRef.current = Date.now() + remaining * 1000;
    setRunning(true);
    // 第一次開始時詢問是否允許通知
    try {
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    } catch {
      // 略過
    }
  }

  function pause() {
    if (endAtRef.current !== null) {
      setRemaining(Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000)));
    }
    endAtRef.current = null;
    setRunning(false);
  }

  function toggle() {
    if (running) pause();
    else start();
  }

  function reset() {
    switchMode(mode, false);
  }

  function skip() {
    if (mode === "focus") {
      const next: Mode = (completed + 1) % longEvery === 0 ? "long" : "short";
      switchMode(next, false);
    } else {
      switchMode("focus", false);
    }
  }

  function changeDuration(m: Mode, minutes: number) {
    const value = Math.min(120, Math.max(1, Math.round(minutes) || 1));
    setDurations((prev) => ({ ...prev, [m]: value }));
    // 目前這個模式還沒開始計時，就直接套用新時間
    if (m === mode && !running) {
      setRemaining(value * 60);
      endAtRef.current = null;
    }
  }

  // 空白鍵：開始 / 暫停（正在輸入文字時不觸發）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.code !== "Space" || ["INPUT", "TEXTAREA", "BUTTON", "SELECT"].includes(target.tagName)) return;
      e.preventDefault();
      if (running) pause();
      else start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const cycleIndex = completed % longEvery;

  return (
    <div
      className="flex w-full max-w-[480px] flex-col px-5 pb-10 pt-8 text-[#2b1d10] transition-colors duration-500"
      style={{ background: theme.bg }}
    >
      {/* 標題 */}
      <header className="text-center">
        <h1 className="text-[2.4rem] font-black leading-tight tracking-wide">番茄鐘</h1>
        <p className="mt-1 font-bold text-[#6b5a48]">專注一段時間，再好好休息</p>
      </header>

      {/* 模式切換 */}
      <div className="mt-6 grid grid-cols-3 gap-1 rounded-2xl bg-white/70 p-1 shadow-[0_2px_10px_rgba(120,80,20,0.06)]">
        {MODE_ORDER.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m, false)}
            className="rounded-xl py-2.5 text-sm font-black transition"
            style={
              m === mode
                ? { background: MODES[m].color, color: "#fff", boxShadow: `0 3px 0 ${MODES[m].dark}` }
                : { color: "#8a7560" }
            }
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      {/* 倒數圓環 */}
      <div className="relative mx-auto mt-8 w-full max-w-[300px]">
        <svg viewBox="0 0 300 300" className="h-auto w-full -rotate-90">
          <circle cx="150" cy="150" r={RING_R} fill="#ffffff" stroke={theme.soft} strokeWidth="16" />
          <circle
            cx="150"
            cy="150"
            r={RING_R}
            fill="none"
            stroke={theme.color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.3s linear, stroke 0.5s" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="rounded-full px-3 py-0.5 text-sm font-black text-white"
            style={{ background: theme.color }}
          >
            {theme.title}
          </span>
          <span className="mt-2 text-[4.2rem] font-black leading-none tabular-nums tracking-tight" aria-live="off">
            {formatTime(remaining)}
          </span>
          <span className="mt-2 text-sm font-bold text-[#8a7560]">
            {running ? "計時中…" : remaining === total ? "準備開始" : "已暫停"}
          </span>
        </div>
      </div>

      {/* 控制按鈕 */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          aria-label="重新開始"
          title="重新開始"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#8a7560] shadow-[0_3px_0_#e3d6c3] active:translate-y-0.5 active:shadow-none"
        >
          <ResetIcon />
        </button>
        <button
          type="button"
          onClick={toggle}
          className="h-16 w-44 rounded-2xl text-xl font-black tracking-widest text-white transition active:translate-y-1"
          style={{ background: theme.color, boxShadow: `0 5px 0 ${theme.dark}` }}
        >
          {running ? "暫停" : remaining === total ? "開始" : "繼續"}
        </button>
        <button
          type="button"
          onClick={skip}
          aria-label="跳過這一段"
          title="跳過這一段"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#8a7560] shadow-[0_3px_0_#e3d6c3] active:translate-y-0.5 active:shadow-none"
        >
          <SkipIcon />
        </button>
      </div>
      <p className="mt-3 text-center text-xs font-bold text-[#a8957e]">也可以按空白鍵開始 / 暫停</p>

      {/* 目前任務 */}
      <section className="mt-8 rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(120,80,20,0.06)]">
        <label htmlFor="task" className="text-sm font-black" style={{ color: MODES.focus.color }}>
          現在專注在
        </label>
        <input
          id="task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="例如：寫完週報"
          className="mt-2 w-full rounded-xl border-2 border-[#f1e4cf] bg-[#fffaf3] px-3 py-2.5 text-base font-bold outline-none placeholder:font-normal placeholder:text-[#c7b393] focus:border-[#e5483b]"
        />
      </section>

      {/* 今日進度 */}
      <section className="mt-4 rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(120,80,20,0.06)]">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-black" style={{ color: MODES.focus.color }}>
            今日完成
          </h2>
          <span className="text-sm font-bold text-[#8a7560]">
            共 <span className="text-lg font-black text-[#2b1d10]">{completed}</span> 顆番茄・
            {completed * durations.focus} 分鐘
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2" aria-label={`這一輪已完成 ${cycleIndex} / ${longEvery}`}>
          {Array.from({ length: longEvery }, (_, i) => (
            <span
              key={i}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-xl transition ${
                i < cycleIndex ? "bg-[#fde3dc]" : "bg-[#f4ede2] opacity-40 grayscale"
              }`}
            >
              🍅
            </span>
          ))}
          <span className="ml-1 text-xs font-bold text-[#a8957e]">集滿 {longEvery} 顆可以長休息</span>
        </div>
        {completed > 0 && (
          <button
            type="button"
            onClick={() => setCompleted(0)}
            className="mt-3 text-xs font-bold text-[#a8957e] hover:underline"
          >
            歸零
          </button>
        )}
      </section>

      {/* 設定 */}
      <section className="mt-4 rounded-2xl bg-white shadow-[0_2px_10px_rgba(120,80,20,0.06)]">
        <button
          type="button"
          onClick={() => setShowSettings((v) => !v)}
          aria-expanded={showSettings}
          className="flex w-full items-center justify-between p-4 text-sm font-black"
          style={{ color: MODES.focus.color }}
        >
          時間設定
          <span className={`text-[#a8957e] transition ${showSettings ? "rotate-180" : ""}`}>▾</span>
        </button>
        {showSettings && (
          <div className="flex flex-col gap-3 px-4 pb-4">
            {MODE_ORDER.map((m) => (
              <NumberRow
                key={m}
                label={`${MODES[m].label}（分鐘）`}
                value={durations[m]}
                min={1}
                max={120}
                onChange={(v) => changeDuration(m, v)}
              />
            ))}
            <NumberRow
              label="幾顆番茄後長休息"
              value={longEvery}
              min={2}
              max={8}
              onChange={(v) => setLongEvery(Math.min(8, Math.max(2, Math.round(v) || 4)))}
            />
            <Toggle label="時間到自動開始下一段" checked={autoStart} onChange={setAutoStart} />
            <Toggle label="時間到播放提示音" checked={soundOn} onChange={setSoundOn} />
          </div>
        )}
      </section>
    </div>
  );
}

function NumberRow({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-bold">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          aria-label={`${label} 減少`}
          className="h-9 w-9 rounded-full bg-[#f4ede2] text-lg font-black text-[#8a7560] disabled:opacity-40"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="w-14 rounded-lg border-2 border-[#f1e4cf] bg-[#fffaf3] py-1 text-center font-black tabular-nums outline-none focus:border-[#e5483b]"
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          aria-label={`${label} 增加`}
          className="h-9 w-9 rounded-full bg-[#f4ede2] text-lg font-black text-[#8a7560] disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="font-bold">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-[#e5483b]"
      />
    </label>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function SkipIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M5 5.5v13a1 1 0 0 0 1.5.86L17 13v5a1 1 0 0 0 2 0V6a1 1 0 0 0-2 0v5L6.5 4.64A1 1 0 0 0 5 5.5z" />
    </svg>
  );
}
