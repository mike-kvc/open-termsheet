import { Clause } from "@/types/clause";

export const antiDilution: Clause = {
  id: "anti-dilution",
  name: "Anti-dilution",
  name_ko: "희석방지권",
  category: "economics",

  summary:
    "후속 라운드에서 더 낮은 가격에 투자가 들어올 때(다운라운드), 기존 투자자의 전환가격을 조정해주는 조항입니다. 쉽게 말해 '내가 투자할 때보다 싸게 투자받으면 내 지분을 보전해줘'라는 의미입니다.",

  variants: [
    {
      type: "Weighted Average (가중평균)",
      market_position: "founder-friendly",
      description:
        "다운라운드의 규모와 가격을 가중평균으로 반영하여 전환가격을 조정. 한국에서 가장 일반적인 방식입니다.",
    },
    {
      type: "Broad-based Weighted Average",
      market_position: "founder-friendly",
      description:
        "전환 시 전체 발행주식(옵션풀 포함)을 기준으로 가중평균 계산. 희석 효과가 가장 적어 창업자에게 유리.",
    },
    {
      type: "Narrow-based Weighted Average",
      market_position: "neutral",
      description:
        "우선주만을 기준으로 가중평균 계산. Broad-based보다 조정폭이 더 커 투자자에게 유리.",
    },
    {
      type: "Full Ratchet (완전 희석방지)",
      market_position: "investor-friendly",
      description:
        "다운라운드 가격 그대로 전환가격을 낮춤. 규모와 무관하게 가장 낮은 가격 적용. 창업자에게 매우 불리합니다.",
    },
  ],

  founder_perspective: `다운라운드 자체도 힘든 상황인데, full ratchet이면 기존 투자자 지분이 크게 늘어나 창업자 지분이 이중으로 희석됩니다.

예를 들어 시리즈A 투자자가 full ratchet을 갖고 있는 상태에서 시리즈B가 다운라운드로 들어오면, 시리즈A 투자자의 전환주식수가 늘어나면서 창업자 지분율이 예상보다 훨씬 떨어집니다.

Weighted average라도 narrow-based vs broad-based에 따라 차이가 크니 꼭 확인하세요.`,

  investor_perspective: `투자 시점에 합의한 밸류에이션이 시장에서 인정받지 못하는 상황(다운라운드)에서 투자자의 경제적 손실을 일부 보전하기 위한 장치입니다.

Full ratchet을 넣는 경우: 밸류에이션에 대한 확신이 낮을 때, 또는 브릿지론/컨버터블 노트에서 다운사이드 보호가 필요할 때 사용합니다. 다만 full ratchet은 다운라운드 시 후속 투자자 유치를 어렵게 만들 수 있어, 결과적으로 투자자 자신에게도 불리할 수 있습니다.

Weighted average가 표준인 이유: 다운라운드의 규모에 비례한 합리적 조정이 가능하고, 후속 투자 유치를 가로막지 않습니다.`,

  negotiation_tips: `- Full ratchet은 가능하면 피하되, 불가피하면 기간 제한(예: 투자 후 1년 이내 다운라운드에만 적용)을 협상
- Broad-based weighted average를 기본으로 요청
- Pay-to-play 조항과 연계: anti-dilution 보호를 받으려면 후속 라운드에도 참여해야 한다는 조건 추가 가능
- 다운라운드의 정의를 명확히 — 스톡옵션 행사, 소규모 발행은 제외하는 예외 조항 확인
- 가중평균 공식: NCP = OCP × (N + V) / (N + n). NCP=조정 후 전환가격, OCP=기존 전환가격, N=기발행 주식수, V=신규발행주식수×신규발행가격/OCP, n=신규 발행 주식수
- Anti-dilution은 다운라운드에서만 작동합니다. 업라운드에서는 조정이 발생하지 않습니다
- 주식분할, 무상증자, 스톡옵션 행사 등에 의한 희석과는 별도의 조정 메커니즘이 적용됨에 유의`,

  examples: [
    {
      title: "다운라운드 시 Full Ratchet vs Weighted Average",
      setup:
        "시리즈A: 주당 10,000원에 10억 투자 (10만주 발행). 시리즈B가 주당 5,000원에 진행됨 — 50% 다운라운드.",
      scenarios: [
        {
          condition: "Full Ratchet",
          investor_gets:
            "전환가격 10,000원 → 5,000원으로 조정. 10만주 → 20만주로 증가. 투자금 동일한데 주식수 2배.",
          founder_gets:
            "시리즈A 투자자 지분이 2배로 늘어난 만큼 창업자 지분 대폭 희석",
        },
        {
          condition: "Broad-based Weighted Average",
          investor_gets:
            "다운라운드 규모에 따라 전환가격이 10,000원 → 약 7,500원으로 조정 (시리즈B 규모에 따라 변동). 주식수 소폭 증가.",
          founder_gets:
            "희석은 있지만 full ratchet 대비 훨씬 완화된 수준",
        },
      ],
      takeaway:
        "같은 다운라운드인데 full ratchet이면 기존 투자자 주식수가 2배, weighted average면 약 33% 증가. 창업자 입장에서 희석 차이가 매우 큽니다.",
    },
    {
      title: "다운라운드 시 지분율 변동 시뮬레이션",
      setup:
        "시리즈A에서 투자자 20%, 창업자 80% (기발행 100,000주 중 투자자 20,000주). 시리즈B 다운라운드: 주당 5,000원에 50,000주 발행 (시리즈A 주당 10,000원의 절반).",
      scenarios: [
        {
          condition: "Anti-dilution 미적용",
          investor_gets:
            "시리즈A 투자자 전환주식수 20,000주 그대로. 총 150,000주 중 13.3%. 다운라운드만으로 20% → 13.3%로 희석.",
          founder_gets:
            "80,000주 / 150,000주 = 53.3%. 시리즈B 투자자가 33.3%.",
        },
        {
          condition: "가중평균 (Weighted Average) 적용",
          investor_gets:
            "전환가격 10,000원 → 약 8,333원으로 조정. 전환주식수 20,000주 → 24,000주. 총 154,000주 중 15.6%.",
          founder_gets:
            "80,000주 / 154,000주 = 51.9%. 시리즈B 투자자가 32.5%.",
        },
        {
          condition: "Full Ratchet 적용",
          investor_gets:
            "전환가격 10,000원 → 5,000원으로 조정. 전환주식수 20,000주 → 40,000주. 총 170,000주 중 23.5%.",
          founder_gets:
            "80,000주 / 170,000주 = 47.1%. 원래 80%에서 절반 가까이 희석. 시리즈B 투자자가 29.4%.",
        },
      ],
      takeaway:
        "Full ratchet은 창업자 지분을 80% → 47.1%로 대폭 희석합니다. 가중평균은 80% → 51.9%로 합리적 범위에서 조정됩니다. Full ratchet이 한국 시장에서 거의 사용되지 않는 이유입니다.",
    },
  ],

  legal_check: {
    applicable_laws: [
      {
        name: "상법 제346조 (전환주식)",
        relevance:
          "전환가격 조정의 법적 근거. 전환 조건은 정관에 기재 필요.",
      },
      {
        name: "벤처투자촉진에 관한 특별법",
        relevance:
          "벤처투자조합이 투자한 경우, 전환가격 조정에 관한 공시 및 보고 의무 존재.",
      },
      {
        name: "자본시장법 (상장 전환 시)",
        relevance:
          "IPO 시 과도한 anti-dilution 조항은 상장 심사에서 이슈가 될 수 있음.",
      },
    ],
    risk_level: "yellow",
    issues: [
      {
        type: "Full Ratchet의 상장 심사 리스크",
        description:
          "Full ratchet 조항이 있으면 IPO 심사 시 '기존 주주에게 과도하게 유리한 조건'으로 지적받을 수 있습니다. 상장 주관사가 해소를 요구하는 경우가 많습니다.",
        recommendation:
          "상장을 목표로 하는 회사라면 weighted average 방식을 채택하거나, full ratchet에 일몰(sunset) 조항을 추가.",
      },
      {
        type: "전환가격 조정 시 정관 변경 필요 여부",
        description:
          "전환가격 조정 공식이 정관에 명시되어 있지 않으면, 실제 다운라운드 발생 시 전환가격 조정의 법적 근거가 불명확해질 수 있습니다.",
        recommendation:
          "정관에 전환가격 조정 공식(weighted average formula)을 구체적으로 기재.",
      },
    ],
  },

  common_mistakes: [
    "Anti-dilution이 '내 지분율을 유지해준다'고 오해 — 전환가격 조정이지 지분율 보장이 아님",
    "다운라운드의 정의를 꼼꼼히 확인하지 않음 — 스톡옵션 행사도 다운라운드로 잡히면 문제",
    "여러 라운드의 anti-dilution이 연쇄적으로 발동될 때의 효과를 계산하지 않음",
    "Pay-to-play 조항 없이 anti-dilution만 부여하면 투자자가 후속 라운드 불참하면서 보호만 받는 구조 발생",
  ],
};
