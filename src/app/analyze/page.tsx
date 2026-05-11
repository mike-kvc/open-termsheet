"use client";

import { useState } from "react";
import Link from "next/link";
import { clauses } from "@/data/clauses";
import type { Clause } from "@/types/clause";

interface MatchedClause {
  clause: Clause;
  matchedKeywords: string[];
  relevanceScore: number;
}

const clauseKeywords: Record<string, string[]> = {
  "liquidation-preference": [
    "잔여재산",
    "우선분배",
    "liquidation",
    "preference",
    "청산",
    "participating",
    "non-participating",
    "우선 분배",
    "매각 대금",
  ],
  "anti-dilution": [
    "희석방지",
    "anti-dilution",
    "전환가격 조정",
    "가중평균",
    "weighted average",
    "full ratchet",
    "다운라운드",
    "down round",
  ],
  "conversion-right": [
    "전환권",
    "전환가격",
    "전환비율",
    "보통주 전환",
    "conversion",
    "전환 청구",
    "자동전환",
  ],
  "redemption-right": [
    "상환권",
    "상환청구",
    "redemption",
    "상환가격",
    "연복리",
    "배당가능이익",
    "상환 청구",
  ],
  "protective-provisions": [
    "사전동의",
    "사전 동의",
    "서면 동의",
    "동의를 받아야",
    "veto",
    "protective",
    "사전 서면",
    "동의 없이",
  ],
  rofr: [
    "우선매수",
    "우선 매수",
    "ROFR",
    "right of first refusal",
    "선매권",
    "우선매수권",
  ],
  "tag-along": [
    "동반매각",
    "tag-along",
    "tag along",
    "공동매도",
    "co-sale",
    "동반 매각",
  ],
  "drag-along": [
    "동반매도청구",
    "drag-along",
    "drag along",
    "강제매각",
    "동반매도",
  ],
  "put-option": [
    "풋옵션",
    "put option",
    "주식매수청구",
    "매수청구",
    "연복리 15",
    "연복리 10",
    "위반 시",
  ],
  "deemed-liquidation": [
    "간주청산",
    "deemed liquidation",
    "경영권 이전",
    "영업양도",
    "합병",
    "M&A",
  ],
  "lock-up": [
    "처분제한",
    "lock-up",
    "lockup",
    "양도 제한",
    "담보제공",
    "처분 금지",
    "양도금지",
  ],
  vesting: [
    "베스팅",
    "vesting",
    "cliff",
    "클리프",
    "주식 회수",
    "역베스팅",
    "전업의무",
  ],
  "non-compete": [
    "경업금지",
    "겸업금지",
    "non-compete",
    "전업의무",
    "경쟁사업",
    "겸직",
  ],
  "reps-and-warranties": [
    "진술",
    "보장",
    "R&W",
    "representations",
    "warranties",
    "공개목록",
    "진술 및 보장",
  ],
  "conditions-precedent": [
    "선행조건",
    "CP",
    "conditions precedent",
    "거래종결",
    "closing",
    "정관 변경",
    "정관변경",
  ],
  "board-nomination": [
    "이사 지명",
    "이사지명",
    "board",
    "비상임이사",
    "옵저버",
    "observer",
    "이사회",
  ],
};

const glossary: Record<string, string> = {
  "RCPS": "상환전환우선주. 전환권+상환권이 모두 있는 우선주로 한국 VC 투자의 표준",
  "participating": "참가적. 원금 우선 회수 후 남은 금액에서도 지분만큼 추가 수령 (이중 취식)",
  "non-participating": "비참가적. 원금 우선 회수 또는 지분 비례 배분 중 택 1",
  "liquidation": "청산/잔여재산분배. 회사 매각·청산 시 투자금을 먼저 돌려받는 권리",
  "anti-dilution": "희석방지. 다운라운드 시 기존 투자자의 전환가격을 조정하는 조항",
  "full ratchet": "완전 희석방지. 다운라운드 가격 그대로 전환가격 적용. 창업자에게 매우 불리",
  "가중평균": "Weighted Average. 다운라운드의 규모를 반영하여 전환가격 조정. 한국 표준",
  "전환가격": "우선주를 보통주로 바꿀 때 적용되는 가격. Anti-dilution으로 조정될 수 있음",
  "상환권": "투자자가 회사에 투자금 반환을 청구할 수 있는 권리. 배당가능이익 범위 내",
  "풋옵션": "계약 위반 시 투자원금+연복리15%로 매수 청구. 배당가능이익 제한 없음",
  "사전동의": "회사의 주요 경영사항에 대해 투자자의 서면 동의가 필요한 권리 (거부권)",
  "ROFR": "Right of First Refusal. 주식 양도 시 투자자가 동일 조건으로 우선 매수할 수 있는 권리",
  "Tag-Along": "동반매각요구권. 창업자가 주식을 팔 때 투자자도 같은 조건으로 함께 팔 수 있는 권리",
  "Drag-Along": "동반매도청구권. 다수 주주가 소수 주주에게 매도를 강제할 수 있는 권리",
  "Lock-up": "주식처분제한. 창업자가 동의 없이 주식을 팔거나 담보로 잡을 수 없는 조항",
  "베스팅": "지분이 일정 기간에 걸쳐 확정되는 조건. 조기 퇴사 시 미확정 분 회수",
  "클리프": "Cliff. 베스팅 시작 전 최소 근무 기간 (보통 1년). 이 기간 내 퇴사 시 지분 0",
  "R&W": "Representations & Warranties. 회사 상태가 진실함을 보장하는 조항",
  "CP": "Conditions Precedent. 선행조건. Closing 전에 충족해야 하는 전제조건",
  "Closing": "거래종결. 투자금 납입 + 주권 교부 + 등기 완료",
  "배당가능이익": "상법상 상환이 가능한 이익 범위. 초기 스타트업은 대부분 0원",
  "간주청산": "M&A 등을 청산과 동일하게 취급하여 우선분배를 적용하는 조항",
  "경업금지": "창업자가 회사와 경쟁하는 사업에 종사하는 것을 금지하는 조항",
  "정관": "회사의 기본 규칙. 우선주 권리는 정관에 규정해야 법적 효력 발생",
  "Pre-money": "투자 유치 전 기업가치. Post-money = Pre-money + 투자금",
  "Post-money": "투자 유치 후 기업가치. 투자자 지분율 = 투자금 / Post-money",
};

function GlossaryTooltip({ keyword }: { keyword: string }) {
  const explanation = glossary[keyword] || glossary[keyword.toLowerCase()];
  if (!explanation) {
    return (
      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
        {keyword}
      </span>
    );
  }
  return (
    <span className="relative group inline-block">
      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full cursor-help border-b border-dashed border-blue-300">
        {keyword}
      </span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 max-w-xs">
        {explanation}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
      </span>
    </span>
  );
}

function analyzeText(text: string): MatchedClause[] {
  const normalizedText = text.toLowerCase();
  const results: MatchedClause[] = [];

  for (const clause of clauses) {
    const keywords = clauseKeywords[clause.id] || [];
    const matchedKeywords: string[] = [];

    for (const keyword of keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
      }
    }

    if (matchedKeywords.length > 0) {
      results.push({
        clause,
        matchedKeywords,
        relevanceScore: matchedKeywords.length,
      });
    }
  }

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

const riskColor = {
  green: "bg-emerald-100 text-emerald-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
} as const;

const riskLabel = {
  green: "낮음",
  yellow: "주의",
  red: "높음",
} as const;

async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "txt" || ext === "md") {
    return file.text();
  }

  if (ext === "pdf") {
    // PDF.js로 텍스트 추출
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      pages.push(
        content.items
          .filter((item) => "str" in item)
          .map((item) => (item as { str: string }).str)
          .join(" ")
      );
    }
    return pages.join("\n\n");
  }

  if (ext === "docx") {
    // DOCX는 ZIP 안의 XML에서 텍스트 추출
    const JSZip = (await import("jszip")).default;
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const docXml = await zip.file("word/document.xml")?.async("string");
    if (!docXml) return "";
    // XML에서 텍스트만 추출
    return docXml
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // HTML 파일
  if (ext === "html" || ext === "htm") {
    const html = await file.text();
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || "";
  }

  return file.text();
}

export default function AnalyzePage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<MatchedClause[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleAnalyze() {
    if (!input.trim()) return;
    setResults(analyzeText(input));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setFileName(file.name);
    try {
      const text = await extractTextFromFile(file);
      setInput(text);
      setResults(analyzeText(text));
    } catch {
      alert("파일을 읽을 수 없습니다. 텍스트를 직접 붙여넣어 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors mb-6 inline-block"
      >
        &larr; 전체 조항 목록
      </Link>

      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          텀시트 분석기
        </h1>
        <p className="text-zinc-500">
          투자 텀시트 또는 계약서 텍스트를 붙여넣으면 포함된 조항을 자동으로
          식별하고, 각 조항에 대한 해석과 주의점을 보여드립니다.
        </p>
      </header>

      {/* File Upload */}
      <div className="mb-4">
        <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-zinc-200 rounded-lg cursor-pointer hover:border-zinc-400 transition-colors">
          <input
            type="file"
            accept=".pdf,.docx,.doc,.txt,.md,.html,.htm"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="text-center">
            {loading ? (
              <p className="text-sm text-zinc-400">파일 읽는 중...</p>
            ) : (
              <>
                <p className="text-sm text-zinc-500">
                  PDF, DOCX, TXT 파일을 드래그하거나 클릭하여 업로드
                </p>
                {fileName && (
                  <p className="text-xs text-zinc-400 mt-1">{fileName}</p>
                )}
              </>
            )}
          </div>
        </label>
      </div>

      {/* Text Input */}
      <div className="mb-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="또는 텀시트/투자계약서 텍스트를 여기에 직접 붙여넣으세요..."
          className="w-full h-48 px-4 py-3 border border-zinc-200 rounded-lg text-sm font-mono leading-relaxed focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 placeholder:text-zinc-300 resize-y"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-zinc-400">
            {input.length > 0 ? `${input.length}자` : ""}
          </span>
          <button
            onClick={handleAnalyze}
            disabled={!input.trim()}
            className="px-5 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            분석하기
          </button>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="mb-8 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700">
        이 분석은 브라우저에서만 실행됩니다. 입력한 텍스트는 서버로 전송되지
        않으며, 어디에도 저장되지 않습니다.
      </div>

      {/* Results */}
      {results !== null && (
        <div>
          {results.length === 0 ? (
            <div className="text-center py-12 border border-zinc-200 rounded-lg">
              <p className="text-zinc-400 text-lg mb-2">
                매칭되는 조항을 찾지 못했습니다
              </p>
              <p className="text-zinc-300 text-sm">
                텀시트 전문을 붙여넣으면 더 정확한 분석이 가능합니다
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-zinc-50 rounded-lg">
                <p className="text-sm font-medium text-zinc-700">
                  {results.length}개 조항이 식별되었습니다
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  관련도 순으로 정렬됩니다. 각 조항을 클릭하면 상세 해석을
                  확인할 수 있습니다.
                </p>
              </div>

              {/* Critical alerts */}
              {results.length > 0 && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-red-800 mb-3">
                    이것만 확인하세요
                  </h3>
                  <div className="space-y-2">
                    {results
                      .filter(({ clause }) => clause.legal_check.risk_level !== "green")
                      .slice(0, 3)
                      .map(({ clause }) => (
                        <div key={clause.id} className="flex items-start gap-2">
                          <span className="text-red-500 shrink-0 mt-0.5">●</span>
                          <div>
                            <span className="text-sm font-medium text-red-800">
                              {clause.name_ko}
                            </span>
                            <span className="text-xs text-red-600 ml-2">
                              {clause.war_stories?.[0]?.title || clause.common_mistakes[0]}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {results.map(({ clause, matchedKeywords }) => (
                  <div
                    key={clause.id}
                    className="border border-zinc-200 rounded-lg overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-semibold text-base">
                            {clause.name_ko}
                            <span className="ml-2 text-sm font-normal text-zinc-400">
                              {clause.name}
                            </span>
                          </h3>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {matchedKeywords.map((kw) => (
                              <GlossaryTooltip key={kw} keyword={kw} />
                            ))}
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full shrink-0 ${riskColor[clause.legal_check.risk_level]}`}
                        >
                          리스크: {riskLabel[clause.legal_check.risk_level]}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-500 mb-4">
                        {clause.summary}
                      </p>

                      {/* Key warnings */}
                      {clause.war_stories && clause.war_stories.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                          <p className="text-xs font-medium text-red-700 mb-1">
                            주의
                          </p>
                          <p className="text-xs text-red-600">
                            {clause.war_stories[0].lesson}
                          </p>
                        </div>
                      )}

                      {/* Top negotiation tip */}
                      <div className="bg-zinc-50 rounded-md p-3 mb-3">
                        <p className="text-xs font-medium text-zinc-500 mb-1">
                          협상 포인트
                        </p>
                        <p className="text-xs text-zinc-600">
                          {clause.negotiation_tips.split("\n")[0].replace(
                            /^- /,
                            ""
                          )}
                        </p>
                      </div>

                      <Link
                        href={`/clauses/${clause.id}`}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        상세 해석 보기 →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-12 p-4 bg-zinc-50 rounded-lg text-xs text-zinc-400">
        이 분석 결과는 참고용이며 법률 자문을 대체하지 않습니다. 실제 투자
        계약 시 반드시 전문가의 검토를 받으시기 바랍니다.
      </div>
    </div>
  );
}
