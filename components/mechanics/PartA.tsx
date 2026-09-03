"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { DataSection, Task1Section } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";
import {
  computePartAAnswers,
  containsNumber,
  isRefusal,
  officeBTotalUnits,
  withinTolerance,
} from "@/lib/workBlock2";

/**
 * Substitutes the {token} placeholders in each question's prompt with live
 * numbers from `config` — the prompts in content.day3.json never carry a
 * second, hand-typed copy of these figures.
 */
function fillPrompt(prompt: string, config: DataSection["config"]): string {
  const { officeB } = config;
  const totalB = officeBTotalUnits(config);
  return prompt
    .replace(/\{officeA\}/g, config.office)
    .replace(/\{unitsA\}/g, String(config.unitsInOffice))
    .replace(/\{cycleA\}/g, String(config.partAQuizCycleYears))
    .replace(/\{officeB\}/g, officeB.name)
    .replace(/\{unitsBA\}/g, String(officeB.modelAUnits))
    .replace(/\{unitsBB\}/g, String(officeB.modelBUnits))
    .replace(/\{cycleB\}/g, String(officeB.cycleYears))
    .replace(/\{totalB\}/g, String(totalB))
    .replace(/\{fleetOffices\}/g, String(config.fleetOfficeCount));
}

export function PartA({
  section,
  diagnosisSection,
}: {
  section: DataSection;
  diagnosisSection: Task1Section;
}) {
  const hydrated = useHydrated();
  const { config, partA } = section;
  const notes = useProgress((s) => s.notes);
  const setNote = useProgress((s) => s.setNote);
  const checks = useProgress((s) => s.checks);
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const pickedCode = useProgress((s) => s.choices[diagnosisSection.id]);

  const answers = computePartAAnswers(config);
  const task1Done = hydrated && pickedCode === diagnosisSection.diagnosis.correct;

  return (
    <div className="card space-y-5 p-4">
      <div>
        <p className="text-caption font-semibold uppercase tracking-wide text-purple">
          {partA.kicker}
        </p>
        <h3 className="mt-0.5 text-h3 text-ink">{partA.title}</h3>
        <p className="mt-1 text-body text-ash">{partA.intro}</p>
      </div>

      {/* Reference table */}
      <div>
        <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-ash">
          {partA.tableTitle}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body">
            <thead>
              <tr>
                <th className="border border-line p-2 text-left text-caption font-semibold uppercase tracking-wide text-ash">
                  Item
                </th>
                <th className="border border-line p-2 text-left text-caption font-semibold uppercase tracking-wide text-ash">
                  Category
                </th>
                <th className="border border-line p-2 text-right text-caption font-semibold uppercase tracking-wide text-ash">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {partA.table.map((row) => (
                <tr key={row.item}>
                  <td className="border border-line p-2 text-ink">{row.item}</td>
                  <td className="border border-line p-2 text-ash">{row.category}</td>
                  <td className="border border-line p-2 text-right tabular-nums text-ink">
                    {config[row.configKey]} {row.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 rounded-xl border border-line bg-lilac/30 p-2.5 text-caption font-semibold text-navy">
          {partA.formulaLabel}
        </p>
      </div>

      {/* Calculator */}
      <Calculator title={partA.calculatorTitle} />

      {/* Questions */}
      <div className="space-y-4">
        {partA.questions.map((q, i) => {
          if (q.kind === "number") {
            const correct = (answers as Record<string, number>)[q.id];
            return (
              <NumberQuestion
                key={q.id}
                index={i + 1}
                prompt={fillPrompt(q.prompt, config)}
                unit={q.unit}
                placeholder={q.placeholder}
                value={hydrated ? notes[`workBlock2_${q.id}`] ?? "" : ""}
                onChange={(v) => setNote(`workBlock2_${q.id}`, v)}
                correct={correct}
                correctFeedback={partA.correctFeedback}
                retryFeedback={partA.retryFeedback}
              />
            );
          }
          return (
            <Q5
              key={q.id}
              index={i + 1}
              prompt={fillPrompt(q.prompt, config)}
              placeholder={q.placeholder}
              value={hydrated ? notes[`workBlock2_${q.id}`] ?? "" : ""}
              onChange={(v) => setNote(`workBlock2_${q.id}`, v)}
              flagged={hydrated ? checks["workBlock2_q5_flag"] ?? false : false}
              onFlag={(v) => toggleCheck("workBlock2_q5_flag", v)}
              hint={fillPrompt(partA.q5FlagHint, config)}
              task1Done={task1Done}
              task1Verdict={diagnosisSection.diagnosis.correctVerdict}
              noTaskYet={partA.q5NoTaskYet}
            />
          );
        })}
      </div>
    </div>
  );
}

function NumberQuestion({
  index,
  prompt,
  unit,
  placeholder,
  value,
  onChange,
  correct,
  correctFeedback,
  retryFeedback,
}: {
  index: number;
  prompt: string;
  unit?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  correct: number;
  correctFeedback: string;
  retryFeedback: string;
}) {
  const touched = value.trim().length > 0;
  const ok = touched && withinTolerance(value, correct);

  return (
    <label className="block">
      <span className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-body font-semibold text-ink">
          Q{index}. {prompt}
        </span>
      </span>
      <span className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={clsx(
            "w-full max-w-xs rounded-xl border bg-paper p-2.5 text-body text-ink placeholder:text-ash/70 focus:border-purple",
            ok ? "border-good" : "border-line",
          )}
        />
        {unit ? <span className="text-caption text-ash">{unit}</span> : null}
        {ok ? (
          <span aria-hidden="true" className="text-body text-good">
            ✓
          </span>
        ) : null}
      </span>
      <span className="mt-1 block text-caption text-ash">
        {ok ? correctFeedback : touched ? retryFeedback : ""}
      </span>
    </label>
  );
}

function Q5({
  index,
  prompt,
  placeholder,
  value,
  onChange,
  flagged,
  onFlag,
  hint,
  task1Done,
  task1Verdict,
  noTaskYet,
}: {
  index: number;
  prompt: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  flagged: boolean;
  onFlag: (v: boolean) => void;
  hint: string;
  task1Done: boolean;
  task1Verdict: string;
  noTaskYet: string;
}) {
  const touched = value.trim().length > 0;
  const refusal = touched && isRefusal(value);
  const numeric = touched && !refusal && containsNumber(value);

  // Flag "revisit" for trainer visibility the moment a specific-number
  // attempt appears — never gates progress, only records it.
  useEffect(() => {
    if (numeric !== flagged) onFlag(numeric);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numeric]);

  return (
    <label className="block">
      <span className="mb-1 block text-body font-semibold text-ink">
        Q{index}. {prompt}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder={placeholder}
        className={clsx(
          "w-full resize-y rounded-xl border bg-paper p-2.5 text-body text-ink placeholder:text-ash/70 focus:border-purple",
          refusal ? "border-good" : "border-line",
        )}
      />
      {refusal ? (
        <span className="mt-1 flex items-center gap-1.5 text-caption text-good">
          <span aria-hidden="true">✓</span> That's the right instinct.
        </span>
      ) : numeric ? (
        <div className="mt-1.5 rounded-xl border border-line bg-lilac/30 p-2.5 text-caption text-ash">
          {task1Done ? (
            <>
              <span className="font-semibold text-navy">Worth a second look — </span>
              {hint}
              <p className="mt-1 italic">"{task1Verdict}"</p>
            </>
          ) : (
            noTaskYet
          )}
        </div>
      ) : null}
    </label>
  );
}

function Calculator({ title }: { title: string }) {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<"+" | "−" | "×" | "÷" | null>(null);
  const [freshEntry, setFreshEntry] = useState(true);

  const inputDigit = (d: string) => {
    setDisplay((prev) => (freshEntry || prev === "0" ? d : prev + d));
    setFreshEntry(false);
  };

  const inputDecimal = () => {
    setDisplay((prev) => {
      if (freshEntry) return "0.";
      return prev.includes(".") ? prev : prev + ".";
    });
    setFreshEntry(false);
  };

  const applyOp = (a: number, b: number, op: typeof pendingOp): number => {
    switch (op) {
      case "+":
        return a + b;
      case "−":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  };

  const chooseOp = (op: "+" | "−" | "×" | "÷") => {
    const current = Number.parseFloat(display);
    if (stored !== null && pendingOp && !freshEntry) {
      setStored(applyOp(stored, current, pendingOp));
    } else {
      setStored(current);
    }
    setPendingOp(op);
    setFreshEntry(true);
  };

  const equals = () => {
    const current = Number.parseFloat(display);
    if (stored === null || !pendingOp) return;
    const result = applyOp(stored, current, pendingOp);
    setDisplay(Number.isNaN(result) ? "Error" : String(result));
    setStored(null);
    setPendingOp(null);
    setFreshEntry(true);
  };

  const clear = () => {
    setDisplay("0");
    setStored(null);
    setPendingOp(null);
    setFreshEntry(true);
  };

  return (
    <div className="max-w-xs rounded-xl border border-line bg-paper p-3">
      <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-ash">{title}</p>
      <div className="mb-2 rounded-lg bg-lilac/40 p-2.5 text-right text-h3 tabular-nums text-ink">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {["7", "8", "9"].map((d) => (
          <CalcButton key={d} label={d} onClick={() => inputDigit(d)} />
        ))}
        <CalcButton label="÷" variant="op" onClick={() => chooseOp("÷")} />
        {["4", "5", "6"].map((d) => (
          <CalcButton key={d} label={d} onClick={() => inputDigit(d)} />
        ))}
        <CalcButton label="×" variant="op" onClick={() => chooseOp("×")} />
        {["1", "2", "3"].map((d) => (
          <CalcButton key={d} label={d} onClick={() => inputDigit(d)} />
        ))}
        <CalcButton label="−" variant="op" onClick={() => chooseOp("−")} />
        <CalcButton label="0" onClick={() => inputDigit("0")} />
        <CalcButton label="." onClick={inputDecimal} />
        <CalcButton label="C" variant="clear" onClick={clear} />
        <CalcButton label="+" variant="op" onClick={() => chooseOp("+")} />
        <CalcButton label="=" variant="equals" onClick={equals} className="col-span-4" />
      </div>
    </div>
  );
}

function CalcButton({
  label,
  onClick,
  variant,
  className,
}: {
  label: string;
  onClick: () => void;
  variant?: "op" | "clear" | "equals";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-lg py-2 text-body font-semibold transition-colors duration-200",
        variant === "op" && "bg-lilac text-navy hover:bg-lilac/70",
        variant === "clear" && "bg-warn/15 text-warn hover:bg-warn/25",
        variant === "equals" && "bg-navy text-paper hover:bg-purple",
        !variant && "bg-lilac/40 text-ink hover:bg-lilac/70",
        className,
      )}
    >
      {label}
    </button>
  );
}
