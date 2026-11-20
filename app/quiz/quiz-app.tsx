"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./quiz.module.css";
import { QUIZZES, type Quiz, type Result } from "./quizzes";

type Outcome = {
  result: Result;
  // type 模式：各類型佔比；score 模式：總分
  breakdown?: { result: Result; percent: number }[];
  score?: { value: number; max: number };
};

function computeOutcome(quiz: Quiz, answers: number[]): Outcome {
  const chosen = answers.map((a, i) => quiz.questions[i].options[a]);

  if (quiz.mode === "score") {
    const value = chosen.reduce((sum, o) => sum + (o.score ?? 0), 0);
    const max = quiz.questions.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.score ?? 0)), 0);
    const result =
      quiz.results.find((r) => value >= (r.min ?? 0) && value <= (r.max ?? Infinity)) ?? quiz.results[quiz.results.length - 1];
    return { result, score: { value, max } };
  }

  const counts = new Map<string, number>();
  chosen.forEach((o) => o.type && counts.set(o.type, (counts.get(o.type) ?? 0) + 1));
  // 票數最高的類型；同票時以結果列表的順序為準
  const result = quiz.results.reduce((best, r) => ((counts.get(r.key) ?? 0) > (counts.get(best.key) ?? 0) ? r : best));
  const breakdown = quiz.results
    .map((r) => ({ result: r, percent: Math.round(((counts.get(r.key) ?? 0) / chosen.length) * 100) }))
    .sort((a, b) => b.percent - a.percent);
  return { result, breakdown };
}

type Phase = "list" | "question" | "result";

export default function QuizApp() {
  const [phase, setPhase] = useState<Phase>("list");
  const [quizId, setQuizId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const quiz = QUIZZES.find((q) => q.id === quizId) ?? null;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startQuiz(id: string) {
    setQuizId(id);
    setStep(0);
    setAnswers([]);
    setPicked(null);
    setPhase("question");
    scrollTop();
  }

  function choose(index: number) {
    if (!quiz || picked !== null) return;
    setPicked(index);
    const next = [...answers.slice(0, step), index];
    // 稍微停一下讓使用者看到選中的效果
    timer.current = setTimeout(() => {
      setAnswers(next);
      setPicked(null);
      if (step + 1 < quiz.questions.length) {
        setStep(step + 1);
      } else {
        setPhase("result");
        scrollTop();
      }
    }, 280);
  }

  function back() {
    if (picked !== null) return;
    if (step === 0) {
      setPhase("list");
      setQuizId(null);
    } else {
      setStep(step - 1);
    }
  }

  function backToList() {
    setPhase("list");
    setQuizId(null);
    scrollTop();
  }

  return (
    <div ref={topRef} className="flex w-full max-w-[480px] flex-col bg-[#f7efdd] pb-12 text-[#2b1d10] shadow-[0_0_40px_rgba(120,80,20,0.08)]">
      {phase === "list" && <QuizList onStart={startQuiz} />}

      {phase === "question" && quiz && (
        <QuestionView quiz={quiz} step={step} answers={answers} picked={picked} onChoose={choose} onBack={back} />
      )}

      {phase === "result" && quiz && (
        <ResultView
          quiz={quiz}
          outcome={computeOutcome(quiz, answers)}
          onRetry={() => startQuiz(quiz.id)}
          onList={backToList}
          onStart={startQuiz}
        />
      )}
    </div>
  );
}

// ---------- 測驗列表 ----------
function QuizList({ onStart }: { onStart: (id: string) => void }) {
  return (
    <>
      <section className="relative overflow-hidden bg-[#fbf1d4] px-4 pb-10 pt-10">
        <div className={styles.quizRays} aria-hidden />
        <div className="relative text-center">
          <span className="text-5xl" aria-hidden>
            🔮
          </span>
          <h1 className="mt-3 text-[2.6rem] font-black leading-tight tracking-wide text-[#24180c] drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
            心理測驗
          </h1>
          <p className="mt-1 text-lg font-bold text-[#3b2a17]">憑直覺作答・一分鐘認識自己</p>
        </div>
      </section>

      <section className="px-4 pt-8">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-black">選一個測驗開始</h2>
          <span className="mt-2 h-1.5 w-36 rounded-full bg-gradient-to-r from-[#f0b429] via-[#e5642a] to-[#f0b429]" />
        </div>

        <ul className="mt-6 flex flex-col gap-3">
          {QUIZZES.map((q) => (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => onStart(q.id)}
                className="group flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-[0_2px_10px_rgba(120,80,20,0.06)] ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(120,80,20,0.12)] active:translate-y-0"
              >
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl transition group-hover:scale-110"
                  style={{ background: q.soft }}
                  aria-hidden
                >
                  {q.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-black">{q.title}</span>
                  <span className="mt-0.5 block text-sm text-[#7a6650]">{q.subtitle}</span>
                  <span className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: q.soft, color: q.color }}>
                    {q.questions.length} 題・約 1 分鐘
                  </span>
                </span>
                <span className="text-xl font-black transition group-hover:translate-x-1" style={{ color: q.color }} aria-hidden>
                  →
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-xs text-[#a8957e]">測驗內容僅供娛樂參考，不代表專業心理評估。</p>
      </section>
    </>
  );
}

// ---------- 作答 ----------
function QuestionView({
  quiz,
  step,
  answers,
  picked,
  onChoose,
  onBack,
}: {
  quiz: Quiz;
  step: number;
  answers: number[];
  picked: number | null;
  onChoose: (i: number) => void;
  onBack: () => void;
}) {
  const question = quiz.questions[step];
  const total = quiz.questions.length;
  const progress = ((step + (picked !== null ? 1 : 0)) / total) * 100;
  const previous = answers[step];

  return (
    <section className="flex min-h-[70vh] flex-col px-4 pt-6">
      {/* 上方列 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full px-3 py-1.5 text-sm font-bold text-[#a8682c] hover:bg-[#fff1d6]"
        >
          ← {step === 0 ? "測驗列表" : "上一題"}
        </button>
        <span className="text-sm font-bold text-[#8a7560] tabular-nums">
          {step + 1} / {total}
        </span>
      </div>

      {/* 進度條 */}
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: quiz.color }} />
      </div>

      <p className="mt-6 text-center text-sm font-bold" style={{ color: quiz.color }}>
        {quiz.emoji} {quiz.title}
      </p>

      <div key={`${quiz.id}-${step}`} className={styles.quizEnter}>
        <h2 className="mt-3 text-center text-2xl font-black leading-snug">
          <span className="mr-1 text-[#c7a77a]">Q{step + 1}.</span>
          {question.q}
        </h2>

        <ul className="mt-8 flex flex-col gap-3">
          {question.options.map((o, i) => {
            const active = picked === i || (picked === null && previous === i);
            return (
              <li key={o.text}>
                <button
                  type="button"
                  onClick={() => onChoose(i)}
                  disabled={picked !== null}
                  className="flex w-full items-center gap-3 rounded-2xl border-2 bg-white px-4 py-4 text-left text-base font-bold shadow-[0_2px_10px_rgba(120,80,20,0.06)] transition hover:-translate-y-0.5 disabled:cursor-default"
                  style={{
                    borderColor: active ? quiz.color : "transparent",
                    background: active ? quiz.soft : "#ffffff",
                  }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black transition"
                    style={active ? { background: quiz.color, color: "#fff" } : { background: quiz.soft, color: quiz.color }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {o.text}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-auto pt-10 text-center text-xs text-[#a8957e]">憑第一直覺選擇最接近你的答案</p>
    </section>
  );
}

// ---------- 結果 ----------
function ResultView({
  quiz,
  outcome,
  onRetry,
  onList,
  onStart,
}: {
  quiz: Quiz;
  outcome: Outcome;
  onRetry: () => void;
  onList: () => void;
  onStart: (id: string) => void;
}) {
  const { result } = outcome;
  const others = QUIZZES.filter((q) => q.id !== quiz.id);

  return (
    <section className="px-4 pt-8">
      <p className="text-center text-sm font-bold" style={{ color: quiz.color }}>
        {quiz.emoji} {quiz.title}
      </p>

      <article className={`${styles.quizPop} mt-4 overflow-hidden rounded-3xl bg-[#fffaf0] shadow-[0_6px_24px_rgba(120,80,20,0.12)]`}>
        <div className="relative overflow-hidden px-6 pb-6 pt-8 text-center" style={{ background: quiz.soft }}>
          <p className="text-sm font-bold text-[#7a6650]">你的測驗結果是</p>
          <div className="mx-auto mt-4 flex h-24 w-24 items-center justify-center rounded-full bg-white text-5xl shadow-[0_6px_0_rgba(0,0,0,0.06)]">
            {result.emoji}
          </div>
          <h2 className="mt-4 text-3xl font-black" style={{ color: quiz.color }}>
            {result.title}
          </h2>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {result.traits.map((t) => (
              <li key={t} className="rounded-full bg-white px-3 py-1 text-sm font-bold" style={{ color: quiz.color }}>
                #{t}
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 pb-6 pt-5">
          <p className="leading-relaxed text-[#3b2a17]">{result.description}</p>

          {/* 分數 / 類型佔比 */}
          {outcome.score && (
            <div className="mt-6">
              <div className="flex items-baseline justify-between text-sm font-bold">
                <span className="text-[#7a6650]">你的分數</span>
                <span className="tabular-nums">
                  <span className="text-2xl font-black" style={{ color: quiz.color }}>
                    {outcome.score.value}
                  </span>
                  <span className="text-[#a8957e]"> / {outcome.score.max}</span>
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#f4ede2]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(outcome.score.value / outcome.score.max) * 100}%`, background: quiz.color }}
                />
              </div>
            </div>
          )}

          {outcome.breakdown && (
            <div className="mt-6">
              <p className="text-sm font-bold text-[#7a6650]">你的性格組成</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {outcome.breakdown.map(({ result: r, percent }) => (
                  <li key={r.key} className="flex items-center gap-3 text-sm">
                    <span className="w-6 text-center text-lg" aria-hidden>
                      {r.emoji}
                    </span>
                    <span className="w-32 shrink-0 truncate font-bold">{r.title}</span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#f4ede2]">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${percent}%`, background: r.key === result.key ? quiz.color : "#d8c7ae" }}
                      />
                    </span>
                    <span className="w-10 text-right font-bold tabular-nums text-[#7a6650]">{percent}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 rounded-2xl px-4 py-4" style={{ background: quiz.soft }}>
            <p className="text-sm font-black" style={{ color: quiz.color }}>
              給你的小建議
            </p>
            <p className="mt-1 font-bold leading-relaxed text-[#3b2a17]">{result.advice}</p>
          </div>
        </div>
      </article>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onList}
          className="flex-1 rounded-2xl border-2 border-[#e9cfa2] bg-white py-3.5 font-black text-[#a8682c]"
        >
          換個測驗
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 rounded-2xl py-3.5 font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.18)] active:translate-y-1 active:shadow-none"
          style={{ background: quiz.color }}
        >
          再測一次
        </button>
      </div>

      {/* 推薦其他測驗 */}
      <h3 className="mt-10 text-center text-base font-black">也試試這些測驗</h3>
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {others.map((q) => (
          <li key={q.id}>
            <button
              type="button"
              onClick={() => onStart(q.id)}
              className="flex h-full w-full flex-col items-start gap-2 rounded-2xl bg-white p-4 text-left shadow-[0_2px_10px_rgba(120,80,20,0.06)] transition hover:-translate-y-0.5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl" style={{ background: q.soft }} aria-hidden>
                {q.emoji}
              </span>
              <span className="text-sm font-black leading-snug">{q.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-xs text-[#a8957e]">測驗內容僅供娛樂參考，不代表專業心理評估。</p>
    </section>
  );
}
