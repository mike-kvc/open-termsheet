import type { DirectorySource } from "@/types/investor";

export const directorySources: DirectorySource[] = [
  {
    id: "kvca",
    name: "KVCA 회원사",
    bestFor: "국내 VC/운용사 기본 명부",
    status: "identified",
    url: "https://www.kvca.or.kr/",
  },
  {
    id: "k-startup-ac",
    name: "K-Startup 창업기획자 등록",
    bestFor: "등록 액셀러레이터/AC 확인",
    status: "identified",
    url: "https://www.k-startup.go.kr/",
  },
  {
    id: "tips",
    name: "TIPS 운영사",
    bestFor: "초기 투자·보육 운영사 확인",
    status: "identified",
    url: "https://www.jointips.or.kr/",
  },
  {
    id: "pe-vc-lp",
    name: "PE/VC/LP 출자 공고",
    bestFor: "신규 펀드/LP 출자 신호",
    status: "live",
    url: "https://pe-vc-lp.com/",
  },
  {
    id: "the-vc",
    name: "THE VC",
    bestFor: "투자 이력/포트폴리오/담당자 보강",
    status: "needs-license",
    url: "https://thevc.kr/",
  },
];
