import type { MarketIntegration } from "@/types/market";

export const marketIntegrations: MarketIntegration[] = [
  {
    id: "k-startup-openapi",
    name: "K-Startup OpenAPI",
    category: "public-programs",
    priority: "now",
    integrationModel: "official-api",
    confidence: "high",
    sourceUrl: "https://www.data.go.kr/data/15125364/openapi.do",
    bestFor: ["정부지원사업", "창업공고", "모집기간", "지원대상"],
    founderUseCase:
      "펀딩 전후로 같이 검토해야 하는 정부지원금, 사업화 프로그램, 창업 패키지를 라운드 준비 체크리스트에 연결합니다.",
    dataCovered: [
      "사업명",
      "신청기간",
      "지원대상",
      "지원내용",
      "신청 URL",
    ],
    dynamicValue:
      "마감 임박 공고와 회사 단계에 맞는 지원사업을 자동으로 보여줄 수 있습니다.",
    implementationNotes:
      "공공데이터 API 키 기반으로 서버 라우트에서 캐싱하고, 사용자 입력 단계/업종과 매칭합니다.",
    risks: ["공고 분류 품질이 일정하지 않을 수 있음", "마감/변경 공고 재검증 필요"],
  },
  {
    id: "the-vc",
    name: "THE VC",
    category: "investor-database",
    priority: "now",
    integrationModel: "licensed-data",
    confidence: "medium",
    sourceUrl: "https://thevc.kr/pricing",
    bestFor: ["한국 VC", "투자자 탐색", "포트폴리오", "최근 투자"],
    founderUseCase:
      "한국 스타트업이 자기 단계와 섹터에 맞는 투자자 후보를 찾고, 해당 투자자의 최근 투자 패턴을 확인합니다.",
    dataCovered: [
      "투자자 프로필",
      "포트폴리오",
      "투자 라운드",
      "펀드/투자 동향",
    ],
    dynamicValue:
      "정적 VC 리스트보다 최신 투자 이력과 포트폴리오 기반 매칭을 제공할 수 있습니다.",
    implementationNotes:
      "공개 API가 명확하지 않으므로 크롤링보다 유료 데이터, 다운로드, 제휴 연동을 우선 검토합니다.",
    risks: ["라이선스 비용/범위 확인 필요", "재배포 가능 범위 확인 필요"],
  },
  {
    id: "open-dart",
    name: "OpenDART",
    category: "filings",
    priority: "now",
    integrationModel: "official-api",
    confidence: "high",
    sourceUrl: "https://opendart.fss.or.kr/",
    bestFor: ["CVC", "전략적 투자자", "상장사", "공시 검증"],
    founderUseCase:
      "전략적 투자자나 CVC 후보의 재무상태, 공시 이력, M&A/투자 관련 공개 정보를 확인합니다.",
    dataCovered: ["회사 개황", "정기공시", "주요사항보고", "사업보고서"],
    dynamicValue:
      "투자자 후보가 상장사 또는 상장사 계열이면 공식 공시 기반으로 리스크와 맥락을 확인할 수 있습니다.",
    implementationNotes:
      "DART API 키를 서버 환경변수로 관리하고, 투자자 상세 페이지의 검증 탭으로 연결합니다.",
    risks: ["비상장 VC 자체 정보는 제한적", "공시 해석은 별도 설명 레이어 필요"],
  },
  {
    id: "naver-search",
    name: "Naver Search API",
    category: "news-search",
    priority: "now",
    integrationModel: "public-search-api",
    confidence: "medium",
    sourceUrl: "https://developers.naver.com/products/service-api/search/search.md",
    bestFor: ["투자유치 뉴스", "VC 동향", "공고 모니터링", "경쟁사"],
    founderUseCase:
      "투자자명, 경쟁사명, 섹터 키워드로 최신 뉴스 신호를 모아 펀딩 타이밍과 아웃리치 우선순위를 판단합니다.",
    dataCovered: ["뉴스 제목", "요약", "링크", "발행일", "검색 키워드"],
    dynamicValue:
      "투자자와 섹터별 최신 움직임을 매일 갱신해 정적인 설명 페이지를 살아 있는 대시보드로 바꿉니다.",
    implementationNotes:
      "검색 결과는 사실 데이터가 아니라 candidate signal로 저장하고, 원문 링크와 수집일을 반드시 표시합니다.",
    risks: ["검색 결과 중복/광고성 기사", "투자금액과 투자자명 오인식 가능"],
  },
  {
    id: "crunchbase",
    name: "Crunchbase",
    category: "global-database",
    priority: "next",
    integrationModel: "licensed-data",
    confidence: "medium",
    sourceUrl: "https://about.crunchbase.com/products/crunchbase-api-2/",
    bestFor: ["글로벌 투자자", "해외 라운드", "경쟁사", "comparable"],
    founderUseCase:
      "해외 투자자나 글로벌 comparable round를 찾아 한국 라운드와 비교합니다.",
    dataCovered: ["회사", "투자자", "펀딩 라운드", "인수", "리더십"],
    dynamicValue:
      "해외 진출 또는 cross-border 라운드를 준비하는 회사에 글로벌 투자자 맵을 제공합니다.",
    implementationNotes:
      "유료 API/데이터 라이선스 범위가 확인된 뒤, 한국 데이터와 별도 confidence bucket으로 병합합니다.",
    risks: ["한국 초기 스타트업 커버리지 제한", "라이선스 비용"],
  },
  {
    id: "dealroom",
    name: "Dealroom",
    category: "global-database",
    priority: "next",
    integrationModel: "licensed-data",
    confidence: "medium",
    sourceUrl: "https://dealroom.co/",
    bestFor: ["글로벌 생태계", "투자자", "섹터 맵", "시장 신호"],
    founderUseCase:
      "특정 섹터의 글로벌 투자자와 생태계 데이터를 탐색하고, 해외 시장 진출 스토리를 보강합니다.",
    dataCovered: ["스타트업", "투자자", "펀딩 라운드", "섹터/생태계 데이터"],
    dynamicValue:
      "한국 중심 데이터가 놓치는 해외 생태계 신호를 보완합니다.",
    implementationNotes:
      "Crunchbase와 중복이 있으므로 둘 중 하나를 먼저 검증하고, 이후 coverage gap을 보고 추가합니다.",
    risks: ["상용 계약 필요", "국내 데이터와 taxonomy 정합성 필요"],
  },
  {
    id: "pe-vc-lp",
    name: "PE/VC/LP 출자 레퍼런스",
    category: "reference-signal",
    priority: "next",
    integrationModel: "candidate-source",
    confidence: "low",
    sourceUrl: "https://pe-vc-lp.com/",
    bestFor: ["LP 출자", "GP 선정", "공고", "숏리스트"],
    founderUseCase:
      "어떤 VC가 최근 어떤 LP 출자사업에서 선정되었는지 참고해 펀드 결성/운용 맥락을 이해합니다.",
    dataCovered: ["LP", "GP", "출자사업", "선정 현황", "공고"],
    dynamicValue:
      "투자자의 최근 펀드레이징 신호와 dry powder 가능성을 founder-facing 언어로 번역할 수 있습니다.",
    implementationNotes:
      "직접 복제하지 말고 원 공고/공식 발표로 역추적 가능한 항목만 낮은 confidence로 큐레이션합니다.",
    risks: ["데이터 권리 확인 필요", "AI 추출 오류 가능", "금액/선정상태 재검증 필요"],
  },
  {
    id: "openai-web-search",
    name: "AI Web Search Layer",
    category: "ai-discovery",
    priority: "later",
    integrationModel: "candidate-source",
    confidence: "low",
    sourceUrl: "https://platform.openai.com/docs/guides/tools-web-search",
    bestFor: ["비정형 출처 발견", "투자자 블로그", "보도자료", "공고 후보"],
    founderUseCase:
      "정형 API에 없는 투자자 글, 포트폴리오 페이지, 보도자료를 찾아 검토 후보로 올립니다.",
    dataCovered: ["웹 문서", "요약", "출처 링크", "발견 쿼리"],
    dynamicValue:
      "정형 데이터가 없는 영역을 탐색하되, 사람이 검증할 수 있는 후보 소스로 축적합니다.",
    implementationNotes:
      "자동 사실화 금지. 후보 소스 테이블에 넣고, 검증 전에는 추천/매칭 점수에 약하게만 반영합니다.",
    risks: ["환각/오요약 가능", "원문 확인 없는 자동 반영 금지", "비용 관리 필요"],
  },
];

export const integrationCategoryLabels: Record<
  MarketIntegration["category"],
  string
> = {
  "public-programs": "정부/공공 프로그램",
  "investor-database": "투자자 DB",
  filings: "공시/검증",
  "news-search": "뉴스/검색",
  "global-database": "글로벌 DB",
  "reference-signal": "레퍼런스 신호",
  "ai-discovery": "AI 발견",
};

export const integrationModelLabels: Record<
  MarketIntegration["integrationModel"],
  string
> = {
  "official-api": "공식 API",
  "licensed-data": "라이선스 데이터",
  "public-search-api": "검색 API",
  "manual-curation": "수동 큐레이션",
  "candidate-source": "후보 소스",
};

export const priorityLabels: Record<MarketIntegration["priority"], string> = {
  now: "1차",
  next: "2차",
  later: "후순위",
};

export const confidenceLabels: Record<
  MarketIntegration["confidence"],
  string
> = {
  high: "높음",
  medium: "중간",
  low: "낮음",
};
