import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy, ChevronRight, ChevronLeft, Info } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/educationContent';

type AnswerState = 'unanswered' | 'correct' | 'wrong';

interface QuizState {
  currentIdx: number;
  selected: (number | null)[];
  submitted: boolean[];
  finished: boolean;
}

function getScore(selected: (number | null)[], submitted: boolean[]): number {
  return QUIZ_QUESTIONS.reduce((score, q, i) => {
    if (submitted[i] && selected[i] === q.correctIndex) return score + 1;
    return score;
  }, 0);
}

function getGrade(score: number, total: number): { label: string; color: string; desc: string } {
  const pct = score / total;
  if (pct >= 0.86) return { label: 'Luar Biasa!', color: '#059669', desc: 'Pemahaman ekosistem mangrove dan teknologi pemantauan Anda sangat baik.' };
  if (pct >= 0.71) return { label: 'Bagus!', color: '#174B32', desc: 'Anda memiliki pemahaman yang baik. Pelajari kembali topik yang masih kurang.' };
  if (pct >= 0.57) return { label: 'Cukup Baik', color: '#D97706', desc: 'Beberapa konsep perlu dipelajari lebih dalam. Coba baca ulang materi di atas.' };
  return { label: 'Perlu Belajar Lebih', color: '#DC2626', desc: 'Jangan menyerah! Baca kembali seluruh materi dan coba lagi.' };
}

const INITIAL_STATE: QuizState = {
  currentIdx: 0,
  selected: new Array(QUIZ_QUESTIONS.length).fill(null),
  submitted: new Array(QUIZ_QUESTIONS.length).fill(false),
  finished: false,
};

export const MangroveQuiz: React.FC = () => {
  const [state, setState] = useState<QuizState>(INITIAL_STATE);

  const q = QUIZ_QUESTIONS[state.currentIdx];
  const isSubmitted = state.submitted[state.currentIdx];
  const selectedOpt = state.selected[state.currentIdx];
  const isLast = state.currentIdx === QUIZ_QUESTIONS.length - 1;
  const allAnswered = state.submitted.every(Boolean);

  const selectOption = (idx: number) => {
    if (isSubmitted) return;
    setState(prev => {
      const selected = [...prev.selected];
      selected[prev.currentIdx] = idx;
      return { ...prev, selected };
    });
  };

  const submitAnswer = () => {
    if (selectedOpt === null) return;
    setState(prev => {
      const submitted = [...prev.submitted];
      submitted[prev.currentIdx] = true;
      return { ...prev, submitted };
    });
  };

  const navigate = (dir: 1 | -1) => {
    setState(prev => ({
      ...prev,
      currentIdx: Math.max(0, Math.min(QUIZ_QUESTIONS.length - 1, prev.currentIdx + dir)),
    }));
  };

  const finish = () => setState(prev => ({ ...prev, finished: true }));
  const restart = () => setState(INITIAL_STATE);

  const score = getScore(state.selected, state.submitted);
  const grade = getGrade(score, QUIZ_QUESTIONS.length);

  // ── Results Screen ──────────────────────────────────────────────────────────
  if (state.finished) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2EAE2] p-6 sm:p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-full border-4 mx-auto flex items-center justify-center" style={{ borderColor: grade.color }}>
          <Trophy size={28} style={{ color: grade.color }} />
        </div>
        <div>
          <h3 className="text-xl font-extrabold" style={{ color: grade.color }}>{grade.label}</h3>
          <p className="text-sm text-[#718075] mt-1">{grade.desc}</p>
        </div>
        <div className="inline-flex items-baseline gap-1">
          <span className="text-5xl font-black" style={{ color: grade.color }}>{score}</span>
          <span className="text-2xl text-[#A8BFA5] font-bold">/ {QUIZ_QUESTIONS.length}</span>
        </div>

        {/* Per-question summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-xs">
          {QUIZ_QUESTIONS.map((q, i) => {
            const correct = state.submitted[i] && state.selected[i] === q.correctIndex;
            const answered = state.submitted[i];
            return (
              <div key={q.id} className={`flex items-start gap-2 p-2.5 rounded-xl border ${correct ? 'bg-[#ECFDF5] border-[#A7F3D0]' : answered ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-[#F5F8F5] border-[#E2EAE2]'}`}>
                {correct ? <CheckCircle2 size={14} className="text-[#059669] flex-shrink-0 mt-0.5" /> : answered ? <XCircle size={14} className="text-[#DC2626] flex-shrink-0 mt-0.5" /> : <Info size={14} className="text-[#A8BFA5] flex-shrink-0 mt-0.5" />}
                <div>
                  <span className="font-semibold text-[#1D2A22]">S{i + 1}.</span>{' '}
                  <span className="text-[#718075]">{q.topic}</span>
                  {!answered && <span className="ml-1 text-[10px] text-[#A8BFA5]">(tidak dijawab)</span>}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={restart}
          className="inline-flex items-center gap-2 bg-[#174B32] hover:bg-[#103D2B] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
        >
          <RotateCcw size={15} /> Ulangi Kuis
        </button>
      </div>
    );
  }

  // ── Question Screen ─────────────────────────────────────────────────────────
  const getOptionState = (optIdx: number): AnswerState => {
    if (!isSubmitted) return 'unanswered';
    if (optIdx === q.correctIndex) return 'correct';
    if (optIdx === selectedOpt) return 'wrong';
    return 'unanswered';
  };

  const optionStyle = (optIdx: number) => {
    const s = getOptionState(optIdx);
    const isSelected = selectedOpt === optIdx;
    if (s === 'correct') return 'border-[#059669] bg-[#ECFDF5] text-[#065F46]';
    if (s === 'wrong') return 'border-[#DC2626] bg-[#FEF2F2] text-[#991B1B]';
    if (!isSubmitted && isSelected) return 'border-[#174B32] bg-[#F0FDF4] text-[#174B32]';
    return 'border-[#E2EAE2] bg-white text-[#1D2A22] hover:border-[#A8BFA5]';
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2EAE2] overflow-hidden">
      {/* Progress bar */}
      <div className="h-1.5 bg-[#E2EAE2]">
        <div
          className="h-full bg-[#174B32] transition-all duration-500"
          style={{ width: `${((state.submitted.filter(Boolean).length) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#174B32] bg-[#F0FDF4] border border-[#A7F3D0] px-2.5 py-1 rounded-full">
              {q.topic}
            </span>
          </div>
          <span className="text-xs font-semibold text-[#718075]">
            {state.currentIdx + 1} / {QUIZ_QUESTIONS.length}
          </span>
        </div>

        {/* Dots nav */}
        <div className="flex gap-1.5 mb-5">
          {QUIZ_QUESTIONS.map((_, i) => {
            const done = state.submitted[i];
            const correct = done && state.selected[i] === QUIZ_QUESTIONS[i].correctIndex;
            const active = i === state.currentIdx;
            return (
              <button
                key={i}
                onClick={() => setState(prev => ({ ...prev, currentIdx: i }))}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  active ? 'bg-[#174B32]' :
                  !done ? 'bg-[#E2EAE2]' :
                  correct ? 'bg-[#059669]' : 'bg-[#DC2626]'
                }`}
              />
            );
          })}
        </div>

        {/* Question */}
        <p className="text-sm sm:text-base font-bold text-[#1D2A22] leading-snug mb-4">
          {q.question}
        </p>

        {/* Options */}
        <div className="space-y-2.5 mb-5">
          {q.options.map((opt, i) => {
            const s = getOptionState(i);
            return (
              <button
                key={i}
                onClick={() => selectOption(i)}
                disabled={isSubmitted}
                className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border-2 text-sm transition-all ${optionStyle(i)} disabled:cursor-default`}
              >
                <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 transition-colors ${
                  s === 'correct' ? 'border-[#059669] bg-[#059669] text-white' :
                  s === 'wrong' ? 'border-[#DC2626] bg-[#DC2626] text-white' :
                  selectedOpt === i && !isSubmitted ? 'border-[#174B32] bg-[#174B32] text-white' :
                  'border-current'
                }`}>
                  {s === 'correct' ? <CheckCircle2 size={12} /> : s === 'wrong' ? <XCircle size={12} /> : String.fromCharCode(65 + i)}
                </span>
                <span className="font-medium leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isSubmitted && (
          <div className={`p-3.5 rounded-xl border mb-5 text-xs leading-relaxed ${
            selectedOpt === q.correctIndex
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
              : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
          }`}>
            <div className="flex items-center gap-1.5 font-bold mb-1">
              {selectedOpt === q.correctIndex
                ? <><CheckCircle2 size={13} className="text-[#059669]" /> Benar!</>
                : <><XCircle size={13} className="text-[#DC2626]" /> Jawaban kurang tepat</>
              }
            </div>
            <p>{q.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            disabled={state.currentIdx === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2EAE2] text-xs font-semibold text-[#718075] hover:bg-[#F5F8F5] transition-colors disabled:opacity-30"
          >
            <ChevronLeft size={14} /> Sebelumnya
          </button>

          <div className="flex items-center gap-2">
            {!isSubmitted ? (
              <button
                onClick={submitAnswer}
                disabled={selectedOpt === null}
                className="px-5 py-2 rounded-xl bg-[#174B32] hover:bg-[#103D2B] text-white text-xs font-bold transition-colors disabled:opacity-40"
              >
                Jawab
              </button>
            ) : isLast ? (
              <button
                onClick={finish}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-colors"
              >
                Lihat Hasil <Trophy size={13} />
              </button>
            ) : (
              <button
                onClick={() => navigate(1)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#174B32] hover:bg-[#103D2B] text-white text-xs font-bold transition-colors"
              >
                Lanjut <ChevronRight size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Score live counter */}
        <div className="mt-4 pt-4 border-t border-[#E2EAE2] flex items-center justify-between text-[11px] text-[#718075]">
          <span>Terjawab: {state.submitted.filter(Boolean).length}/{QUIZ_QUESTIONS.length}</span>
          <span>Benar: <strong className="text-[#059669]">{score}</strong> · Salah: <strong className="text-[#DC2626]">{state.submitted.filter((s, i) => s && state.selected[i] !== QUIZ_QUESTIONS[i].correctIndex).length}</strong></span>
        </div>
      </div>
    </div>
  );
};
