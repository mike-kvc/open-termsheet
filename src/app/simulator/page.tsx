"use client";

import { useState } from "react";
import Link from "next/link";

interface Round {
  name: string;
  investment: number;
  preMoneyValuation: number;
  antiDilutionRatio: number;
}

function createEmptyRound(index: number): Round {
  const names = ["시리즈A", "시리즈B", "시리즈C"];
  return {
    name: names[index] ?? `라운드${index + 1}`,
    investment: 30,
    preMoneyValuation: 100,
    antiDilutionRatio: 1.0,
  };
}

interface ShareholderRow {
  label: string;
  percentages: number[];
}

function calculateResults(
  founderPct: number,
  existingInvestorPct: number,
  optionPoolPct: number,
  rounds: Round[]
): ShareholderRow[] {
  const rows: ShareholderRow[] = [
    { label: "창업자", percentages: [founderPct] },
    { label: "기존투자자", percentages: [existingInvestorPct] },
    { label: "옵션풀", percentages: [optionPoolPct] },
  ];

  for (let i = 0; i < rounds.length; i++) {
    rows.push({
      label: rounds[i].name || `라운드${i + 1}`,
      percentages: Array(i + 1).fill(0),
    });
  }

  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i];
    const postMoney = round.preMoneyValuation + round.investment;
    const newInvestorPct = (round.investment / postMoney) * 100;
    const dilutionFactor = 1 - newInvestorPct / 100;

    // Dilute all existing shareholders
    for (let r = 0; r < rows.length; r++) {
      const prevPct = rows[r].percentages[i] ?? 0;

      if (r === rows.length - rounds.length + i) {
        // This is the new investor for this round
        rows[r].percentages.push(newInvestorPct);
      } else {
        rows[r].percentages.push(prevPct * dilutionFactor);
      }
    }
  }

  return rows;
}

export default function SimulatorPage() {
  const [founderPct, setFounderPct] = useState(70);
  const [existingInvestorPct, setExistingInvestorPct] = useState(20);
  const [optionPoolPct, setOptionPoolPct] = useState(10);
  const [preMoneyValuation, setPreMoneyValuation] = useState(50);
  const [rounds, setRounds] = useState<Round[]>([]);

  const totalPct = founderPct + existingInvestorPct + optionPoolPct;
  const isValid = Math.abs(totalPct - 100) < 0.01;

  const results = isValid ? calculateResults(founderPct, existingInvestorPct, optionPoolPct, rounds) : null;

  const founderFinal = results && results[0].percentages.length > 1
    ? results[0].percentages[results[0].percentages.length - 1]
    : null;
  const founderDilution = founderFinal !== null
    ? ((1 - founderFinal / founderPct) * 100)
    : null;

  const addRound = () => {
    if (rounds.length < 3) {
      setRounds([...rounds, createEmptyRound(rounds.length)]);
    }
  };

  const updateRound = (index: number, field: keyof Round, value: string | number) => {
    const updated = [...rounds];
    if (field === "name") {
      updated[index] = { ...updated[index], [field]: value as string };
    } else {
      updated[index] = { ...updated[index], [field]: Number(value) };
    }
    setRounds(updated);
  };

  const removeRound = (index: number) => {
    setRounds(rounds.filter((_, i) => i !== index));
  };

  const reset = () => {
    setFounderPct(70);
    setExistingInvestorPct(20);
    setOptionPoolPct(10);
    setPreMoneyValuation(50);
    setRounds([]);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors mb-6 inline-block"
      >
        &larr; 전체 조항 목록
      </Link>

      <header className="mb-12">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          희석 시뮬레이터
        </h1>
        <p className="text-zinc-500">
          현재 지분 구조를 입력하고 후속 투자 라운드를 추가하면, 각 라운드별
          지분 희석을 실시간으로 확인할 수 있습니다.
        </p>
      </header>

      {/* Section 1: 현재 지분 구조 */}
      <Section title="1. 현재 지분 구조 입력">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="창업자 지분율 (%)"
            value={founderPct}
            onChange={setFounderPct}
            min={0}
            max={100}
          />
          <InputField
            label="기존 투자자 지분율 (%)"
            value={existingInvestorPct}
            onChange={setExistingInvestorPct}
            min={0}
            max={100}
          />
          <InputField
            label="스톡옵션 풀 (%)"
            value={optionPoolPct}
            onChange={setOptionPoolPct}
            min={0}
            max={100}
          />
          <InputField
            label="현재 회사 가치 (프리밸류, 억원)"
            value={preMoneyValuation}
            onChange={setPreMoneyValuation}
            min={0}
          />
        </div>

        {!isValid && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            지분율 합계가 {totalPct.toFixed(1)}%입니다. 100%가 되어야 합니다.
          </div>
        )}
      </Section>

      {/* Section 2: 후속 라운드 */}
      <Section title="2. 후속 라운드 시뮬레이션">
        {rounds.length === 0 && (
          <p className="text-sm text-zinc-400 mb-4">
            아직 추가된 라운드가 없습니다. 아래 버튼을 눌러 라운드를
            추가하세요.
          </p>
        )}

        <div className="space-y-4 mb-4">
          {rounds.map((round, index) => (
            <div
              key={index}
              className="border border-zinc-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">
                  라운드 {index + 1}
                </h3>
                <button
                  onClick={() => removeRound(index)}
                  className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                >
                  삭제
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">
                    라운드명
                  </label>
                  <input
                    type="text"
                    value={round.name}
                    onChange={(e) =>
                      updateRound(index, "name", e.target.value)
                    }
                    className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  />
                </div>
                <InputField
                  label="투자금액 (억원)"
                  value={round.investment}
                  onChange={(v) => updateRound(index, "investment", v)}
                  min={0}
                />
                <InputField
                  label="프리밸류 (억원)"
                  value={round.preMoneyValuation}
                  onChange={(v) =>
                    updateRound(index, "preMoneyValuation", v)
                  }
                  min={0}
                />
                <InputField
                  label="Anti-dilution 전환비율 조정"
                  value={round.antiDilutionRatio}
                  onChange={(v) =>
                    updateRound(index, "antiDilutionRatio", v)
                  }
                  min={0}
                  step={0.1}
                />
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                투자자 지분율 ={" "}
                {round.preMoneyValuation + round.investment > 0
                  ? (
                      (round.investment /
                        (round.preMoneyValuation + round.investment)) *
                      100
                    ).toFixed(1)
                  : "0.0"}
                % (투자금 / 포스트밸류)
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {rounds.length < 3 && (
            <button
              onClick={addRound}
              className="px-4 py-2 bg-zinc-900 text-white text-sm rounded-md hover:bg-zinc-800 transition-colors"
            >
              라운드 추가
            </button>
          )}
          <button
            onClick={reset}
            className="px-4 py-2 border border-zinc-200 text-sm rounded-md hover:bg-zinc-50 transition-colors"
          >
            초기화
          </button>
        </div>
      </Section>

      {/* Section 3: 결과 */}
      {isValid && rounds.length > 0 && results && (
        <Section title="3. 결과">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-zinc-500">
                    구분
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-zinc-500">
                    현재
                  </th>
                  {rounds.map((round, i) => (
                    <th
                      key={i}
                      className="text-right py-2 px-3 text-xs font-semibold text-zinc-500"
                    >
                      {round.name || `라운드${i + 1}`} 후
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-zinc-100"
                  >
                    <td className="py-2 pr-4 font-medium text-zinc-700">
                      {row.label}
                    </td>
                    {row.percentages.map((pct, i) => (
                      <td
                        key={i}
                        className="text-right py-2 px-3 tabular-nums text-zinc-600"
                      >
                        {pct > 0 ? `${pct.toFixed(1)}%` : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 창업자 지분 변화 강조 */}
          {founderDilution !== null && founderFinal !== null && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-medium text-amber-900">
                창업자 지분 변화
              </p>
              <p className="text-lg font-bold text-amber-800 mt-1">
                {founderPct.toFixed(1)}% &rarr; {founderFinal.toFixed(1)}%
                <span className="text-sm font-normal ml-2">
                  ({founderDilution.toFixed(1)}% 희석)
                </span>
              </p>
            </div>
          )}

          {/* 각 라운드 투자자 지분율 요약 */}
          <div className="mt-4 space-y-2">
            {rounds.map((round, i) => {
              const postMoney = round.preMoneyValuation + round.investment;
              const investorPct =
                postMoney > 0
                  ? (round.investment / postMoney) * 100
                  : 0;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm border border-zinc-100 rounded-md px-3 py-2"
                >
                  <span className="text-zinc-600">
                    {round.name || `라운드${i + 1}`} 투자자 지분율
                  </span>
                  <span className="font-medium tabular-nums">
                    {round.investment}억 / ({round.preMoneyValuation}억 +{" "}
                    {round.investment}억) = {investorPct.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      <div className="mt-12 p-4 bg-zinc-50 rounded-lg text-xs text-zinc-400">
        이 시뮬레이터는 참고 목적으로 제공되며, 실제 투자 계약 시 반드시
        전문가(변호사, 세무사)의 검토를 받으시기 바랍니다. Anti-dilution
        전환비율 조정 등 복잡한 조건은 실제 계약서의 구체적 조항에 따라 달라질
        수 있습니다.
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      <h2 className="text-lg font-semibold tracking-tight mb-5 pb-2 border-b border-zinc-200">
        {title}
      </h2>
      {children}
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
      />
    </div>
  );
}
