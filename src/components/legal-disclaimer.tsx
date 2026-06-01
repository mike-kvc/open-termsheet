type LegalDisclaimerProps = {
  context?: "general" | "analysis" | "simulator" | "clause";
  className?: string;
};

const contextText = {
  general:
    "이 사이트는 한국 스타트업 투자계약을 이해하기 위한 일반 정보입니다. 법률 자문, 세무 자문, 투자 권유가 아니며, 특정 거래에 그대로 적용할 수 없습니다.",
  analysis:
    "분석기는 입력 문구와 사이트의 일반 설명을 키워드로 연결하는 도구입니다. 계약서 해석, 리스크 판단, 협상 전략에 대한 법률 의견이 아닙니다.",
  simulator:
    "시뮬레이션 결과는 단순 수치 모델입니다. 실제 지분율, 전환가격, 희석 효과, 세무·회계 처리는 정관, 계약서, 주주명부, 회계기준에 따라 달라질 수 있습니다.",
  clause:
    "아래 법률 검토는 조항별 쟁점 지도입니다. 실제 효력과 집행 가능성은 정관, 주주간계약, 투자계약, 주주 구성, 판례, 감독기관 실무, 사실관계에 따라 달라집니다.",
} as const;

export function LegalDisclaimer({
  context = "general",
  className = "",
}: LegalDisclaimerProps) {
  return (
    <div
      className={[
        "rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-500",
        className,
      ].join(" ")}
    >
      <p className="font-medium text-zinc-700">법률 안내 및 면책 고지</p>
      <p className="mt-1">{contextText[context]}</p>
      <p className="mt-1">
        법리상 가능한 구조라도 실무상 투자자 관행, 등기소·거래소·회계법인 검토,
        펀드 규약, 세무 효과 때문에 결론이 달라질 수 있으므로 실제 거래 전에는
        변호사, 회계사, 세무사의 개별 검토를 받아야 합니다.
      </p>
    </div>
  );
}
