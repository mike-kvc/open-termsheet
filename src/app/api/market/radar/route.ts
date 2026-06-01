import { NextResponse } from "next/server";
import type {
  LiveMarketRadarResponse,
  LiveMarketSignal,
  LiveMarketSourceStatus,
} from "@/types/market";

export const dynamic = "force-dynamic";

const K_STARTUP_URL =
  "https://www.k-startup.go.kr/web/main/mainSectionChNaviList.do";
const PE_VC_LP_URL = "https://api.pe-vc-lp.com/announcements";

function cleanText(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#40;/g, "(")
    .replace(/&#41;/g, ")")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function createSourceStatus(
  id: string,
  name: string,
  sourceUrl: string,
  itemCount: number,
  status: LiveMarketSourceStatus["status"] = "live",
  message?: string
): LiveMarketSourceStatus {
  return { id, name, status, itemCount, message, sourceUrl };
}

async function fetchKStartupSignals(): Promise<{
  signals: LiveMarketSignal[];
  status: LiveMarketSourceStatus;
}> {
  try {
    const response = await fetch(K_STARTUP_URL, {
      headers: {
        "user-agent": "Open Termsheet market radar",
      },
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      return {
        signals: [],
        status: createSourceStatus(
          "k-startup",
          "K-Startup 모집중 공고",
          K_STARTUP_URL,
          0,
          "error",
          `HTTP ${response.status}`
        ),
      };
    }

    const html = await response.text();
    const matches = html.matchAll(
      /<span class="flag[^"]*">([\s\S]*?)<\/span>\s*<span class="bk_btn">\s*([\s\S]*?)<\/span>[\s\S]*?btnBizView\('([^']+)'[^)]*\)">([\s\S]*?)<\/a>/g
    );

    const signals = Array.from(matches)
      .map((match): LiveMarketSignal => {
        const category = cleanText(match[1]);
        const deadlineLabel = cleanText(match[2]);
        const pbancId = cleanText(match[3]);
        const title = cleanText(match[4]);

        return {
          id: `k-startup-${pbancId}`,
          type: "support-program",
          title,
          source: "K-Startup",
          url: `https://nidview.k-startup.go.kr/view/public/kisedKstartupService/announcementInformation?pbancId=${pbancId}`,
          deadlineLabel,
          category,
          summary: `${category} / ${deadlineLabel}`,
          relevance:
            "지원사업, 액셀러레이션, R&D, 글로벌, 공간, 멘토링 등 펀딩 전후에 같이 검토할 수 있는 공고입니다.",
          confidence: "official",
        };
      })
      .slice(0, 24);

    return {
      signals,
      status: createSourceStatus(
        "k-startup",
        "K-Startup 모집중 공고",
        K_STARTUP_URL,
        signals.length
      ),
    };
  } catch (error) {
    return {
      signals: [],
      status: createSourceStatus(
        "k-startup",
        "K-Startup 모집중 공고",
        K_STARTUP_URL,
        0,
        "error",
        error instanceof Error ? error.message : "Unknown error"
      ),
    };
  }
}

interface PeVcLpAnnouncement {
  id?: string;
  site?: string;
  title?: string;
  url?: string;
  detected_at?: string;
  attachments?: string[];
}

async function fetchPeVcLpSignals(): Promise<{
  signals: LiveMarketSignal[];
  status: LiveMarketSourceStatus;
}> {
  try {
    const response = await fetch(PE_VC_LP_URL, {
      headers: {
        "user-agent": "Open Termsheet market radar",
      },
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      return {
        signals: [],
        status: createSourceStatus(
          "pe-vc-lp",
          "PE/VC/LP 출자 공고",
          PE_VC_LP_URL,
          0,
          "error",
          `HTTP ${response.status}`
        ),
      };
    }

    const data = (await response.json()) as {
      count?: number;
      items?: PeVcLpAnnouncement[];
      updated_at?: string;
    };

    const signals = (data.items ?? [])
      .filter((item) => item.title && item.url)
      .slice(0, 24)
      .map((item): LiveMarketSignal => {
        const title = cleanText(item.title ?? "");
        const source = cleanText(item.site ?? "PE/VC/LP");
        const attachments = item.attachments?.length
          ? `첨부 ${item.attachments.length}개`
          : "첨부 없음";

        return {
          id: `pe-vc-lp-${item.id ?? title}`,
          type: "fund-of-funds",
          title,
          source,
          url: item.url ?? PE_VC_LP_URL,
          detectedAt: item.detected_at,
          summary: attachments,
          relevance:
            "LP 출자, 모태펀드, 정책성 펀드, 위탁운용사 선정 신호입니다. 투자자의 신규 펀드 결성 맥락을 볼 때 참고합니다.",
          confidence: "source",
        };
      });

    return {
      signals,
      status: createSourceStatus(
        "pe-vc-lp",
        "PE/VC/LP 출자 공고",
        "https://pe-vc-lp.com/",
        signals.length,
        "live",
        data.updated_at ? `updated ${data.updated_at}` : undefined
      ),
    };
  } catch (error) {
    return {
      signals: [],
      status: createSourceStatus(
        "pe-vc-lp",
        "PE/VC/LP 출자 공고",
        PE_VC_LP_URL,
        0,
        "error",
        error instanceof Error ? error.message : "Unknown error"
      ),
    };
  }
}

async function fetchNaverNewsSignals(query: string): Promise<{
  signals: LiveMarketSignal[];
  status: LiveMarketSourceStatus;
}> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  const sourceUrl =
    "https://developers.naver.com/products/service-api/search/search.md";

  if (!clientId || !clientSecret) {
    return {
      signals: [],
      status: createSourceStatus(
        "naver-news",
        "Naver 투자 뉴스",
        sourceUrl,
        0,
        "not-configured",
        "NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 미설정"
      ),
    };
  }

  try {
    const url = new URL("https://openapi.naver.com/v1/search/news.json");
    url.searchParams.set("query", query || "스타트업 투자유치");
    url.searchParams.set("display", "10");
    url.searchParams.set("sort", "date");

    const response = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        signals: [],
        status: createSourceStatus(
          "naver-news",
          "Naver 투자 뉴스",
          sourceUrl,
          0,
          "error",
          `HTTP ${response.status}`
        ),
      };
    }

    const data = (await response.json()) as {
      items?: { title: string; originallink?: string; link: string; pubDate: string }[];
    };

    const signals = (data.items ?? []).map((item, index): LiveMarketSignal => {
      const title = cleanText(item.title.replace(/<[^>]+>/g, ""));
      return {
        id: `naver-${index}-${item.pubDate}`,
        type: "funding-news",
        title,
        source: "Naver News",
        url: item.originallink || item.link,
        detectedAt: item.pubDate,
        summary: "뉴스 검색 결과",
        relevance:
          "투자유치, 경쟁사, VC 동향을 빠르게 확인하는 후보 신호입니다. 원문 확인 전에는 사실 데이터로 확정하지 않습니다.",
        confidence: "candidate",
      };
    });

    return {
      signals,
      status: createSourceStatus(
        "naver-news",
        "Naver 투자 뉴스",
        sourceUrl,
        signals.length
      ),
    };
  } catch (error) {
    return {
      signals: [],
      status: createSourceStatus(
        "naver-news",
        "Naver 투자 뉴스",
        sourceUrl,
        0,
        "error",
        error instanceof Error ? error.message : "Unknown error"
      ),
    };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  const [kStartup, peVcLp, naver] = await Promise.all([
    fetchKStartupSignals(),
    fetchPeVcLpSignals(),
    fetchNaverNewsSignals(query),
  ]);

  const q = query.toLowerCase();
  const signals = [...kStartup.signals, ...peVcLp.signals, ...naver.signals]
    .filter((signal) => {
      if (!q) return true;
      return [
        signal.title,
        signal.source,
        signal.category,
        signal.summary,
        signal.relevance,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    })
    .slice(0, 48);

  const payload: LiveMarketRadarResponse = {
    generatedAt: new Date().toISOString(),
    signals,
    sources: [kStartup.status, peVcLp.status, naver.status],
  };

  return NextResponse.json(payload);
}
