"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { CarbonTableRow, DataSection, Task1Section } from "@/lib/content";
import { useHydrated, useProgress } from "@/lib/store";
import {
  computePartAAnswers,
  containsNumber,
  isRefusal,
  officeBTotalUnits,
  parseLearnerNumber,
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
                  Ref
                </th>
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
                  <td className="border border-line p-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-lilac/60 text-caption font-bold text-navy">
                      {row.ref}
                    </span>
                  </td>
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

      {/* Auto-calculator: picks factors from the table above, computes live */}
      <Calculator table={partA.table} config={config} copy={partA.calculator} />

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

type CalcCopy = DataSection["partA"]["calculator"];

type CarbonRow = { units: string; cycleYears: string; factorRef: string };

/** Reads a table row's live value by its `ref` code — the one place a picked factor turns into a number. */
function factorValue(table: CarbonTableRow[], config: DataSection["config"], ref: string): number {
  const row = table.find((r) => r.ref === ref);
  return row ? config[row.configKey] : 0;
}

function newCarbonRow(table: CarbonTableRow[]): CarbonRow {
  return { units: "", cycleYears: "", factorRef: table[0]?.ref ?? "" };
}

/**
 * Not a general-purpose calculator: it computes the two formulas this block
 * actually uses (embodied carbon, disposal impact), fed by factors picked
 * from the table above by their `ref` code — there is nothing to retype or
 * mistype, only to select and read.
 */
function Calculator({
  table,
  config,
  copy,
}: {
  table: CarbonTableRow[];
  config: DataSection["config"];
  copy: CalcCopy;
}) {
  const [mode, setMode] = useState<"carbon" | "disposal">("carbon");
  const [rows, setRows] = useState<CarbonRow[]>([newCarbonRow(table)]);
  const [tonnes, setTonnes] = useState(false);

  const disposalFactorRefs = table.filter((r) => r.category === "Disposal").map((r) => r.ref);
  const [disposalUnits, setDisposalUnits] = useState("");
  const [factor1Ref, setFactor1Ref] = useState(disposalFactorRefs[0] ?? table[0]?.ref ?? "");
  const [factor2Ref, setFactor2Ref] = useState(disposalFactorRefs[1] ?? table[0]?.ref ?? "");

  const updateRow = (i: number, patch: Partial<CarbonRow>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const carbonRowResult = (row: CarbonRow): number | null => {
    const units = parseLearnerNumber(row.units);
    const cycle = parseLearnerNumber(row.cycleYears);
    if (Number.isNaN(units) || Number.isNaN(cycle) || cycle === 0) return null;
    return (units / cycle) * factorValue(table, config, row.factorRef);
  };

  const carbonResults = rows.map(carbonRowResult);
  const carbonTotal = carbonResults.every((r) => r !== null)
    ? (carbonResults as number[]).reduce((a, b) => a + b, 0)
    : null;

  const disposalUnitsNum = parseLearnerNumber(disposalUnits);
  const disposalResult =
    Number.isNaN(disposalUnitsNum) || !factor1Ref || !factor2Ref
      ? null
      : disposalUnitsNum *
        (factorValue(table, config, factor1Ref) - factorValue(table, config, factor2Ref));

  // Plain digits, no thousands grouping — this is exactly what should be
  // typed into the question fields below, so a copy-paste never breaks it.
  const formatResult = (v: number) =>
    tonnes ? `${(v / 1000).toFixed(3)} t CO₂e` : `${Math.round(v * 100) / 100} kg CO₂e`;

  return (
    <div className="rounded-xl border border-line bg-paper p-3">
      <p className="mb-1 text-caption font-semibold uppercase tracking-wide text-ash">{copy.title}</p>
      <p className="mb-3 text-caption text-ash">{copy.help}</p>

      <div className="mb-3 flex gap-2">
        <ModeButton active={mode === "carbon"} onClick={() => setMode("carbon")}>
          {copy.carbonModeLabel}
        </ModeButton>
        <ModeButton active={mode === "disposal"} onClick={() => setMode("disposal")}>
          {copy.disposalModeLabel}
        </ModeButton>
      </div>

      {mode === "carbon" ? (
        <div className="space-y-3">
          <p className="text-caption font-semibold text-navy">{copy.carbonFormula}</p>
          {rows.map((row, i) => {
            const result = carbonResults[i];
            const factor = factorValue(table, config, row.factorRef);
            return (
              <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:items-end">
                <NumberField
                  label={copy.unitsLabel}
                  value={row.units}
                  onChange={(v) => updateRow(i, { units: v })}
                />
                <NumberField
                  label={copy.cycleLabel}
                  value={row.cycleYears}
                  onChange={(v) => updateRow(i, { cycleYears: v })}
                />
                <FactorSelect
                  label={copy.factorLabel}
                  table={table}
                  value={row.factorRef}
                  onChange={(v) => updateRow(i, { factorRef: v })}
                />
                <p className="text-caption tabular-nums text-ash sm:pb-2.5">
                  {row.units && row.cycleYears
                    ? `(${row.units} ÷ ${row.cycleYears}) × ${factor} = ${result !== null ? formatResult(result) : "—"}`
                    : "—"}
                </p>
              </div>
            );
          })}

          <div className="flex flex-wrap items-center gap-3">
            {rows.length < 2 ? (
              <button
                type="button"
                onClick={() => setRows((prev) => [...prev, newCarbonRow(table)])}
                className="text-caption font-semibold text-purple hover:underline"
              >
                {copy.addModelLabel}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setRows((prev) => prev.slice(0, 1))}
                className="text-caption font-semibold text-ash hover:underline"
              >
                {copy.removeModelLabel}
              </button>
            )}
          </div>

          <TonnesToggle checked={tonnes} onChange={setTonnes} label={copy.tonnesToggleLabel} />

          <p className="rounded-lg bg-lilac/40 p-2.5 text-right text-h3 tabular-nums text-ink">
            {copy.totalLabel}: {carbonTotal !== null ? formatResult(carbonTotal) : "—"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-caption font-semibold text-navy">{copy.disposalFormula}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <NumberField label={copy.unitsLabel} value={disposalUnits} onChange={setDisposalUnits} />
            <FactorSelect
              label={copy.factor1Label}
              table={table}
              value={factor1Ref}
              onChange={setFactor1Ref}
            />
            <FactorSelect
              label={copy.factor2Label}
              table={table}
              value={factor2Ref}
              onChange={setFactor2Ref}
            />
          </div>
          <p className="text-caption tabular-nums text-ash">
            {disposalUnits
              ? `${disposalUnits} × (${factorValue(table, config, factor1Ref)} − ${factorValue(table, config, factor2Ref)})`
              : "—"}
          </p>
          <TonnesToggle checked={tonnes} onChange={setTonnes} label={copy.tonnesToggleLabel} />
          <p className="rounded-lg bg-lilac/40 p-2.5 text-right text-h3 tabular-nums text-ink">
            {copy.totalLabel}: {disposalResult !== null ? formatResult(disposalResult) : "—"}
          </p>
        </div>
      )}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-lg px-3 py-1.5 text-caption font-semibold transition-colors duration-200",
        active ? "bg-navy text-paper" : "bg-lilac/40 text-ash hover:bg-lilac/70",
      )}
    >
      {children}
    </button>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-caption text-ash">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-paper p-2 text-body text-ink focus:border-purple"
      />
    </label>
  );
}

function FactorSelect({
  label,
  table,
  value,
  onChange,
}: {
  label: string;
  table: CarbonTableRow[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-caption text-ash">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-paper p-2 text-body text-ink focus:border-purple"
      >
        {table.map((row) => (
          <option key={row.ref} value={row.ref}>
            {row.ref} — {row.item}
          </option>
        ))}
      </select>
    </label>
  );
}

function TonnesToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-caption text-ash">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-purple"
      />
      {label}
    </label>
  );
}
