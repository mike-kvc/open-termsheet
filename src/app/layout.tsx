import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open Termsheet",
  description:
    "투자 텀시트 조항을 창업자와 투자자 양쪽 관점에서 해석하는 오픈소스 가이드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <header className="border-b border-zinc-200">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Open Termsheet
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/guide"
                className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                가이드
              </Link>
              <Link
                href="/analyze"
                className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                분석기
              </Link>
              <Link
                href="/simulator"
                className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                시뮬레이터
              </Link>
              <Link
                href="/laws"
                className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                법령
              </Link>
              <Link
                href="/faq"
                className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                FAQ
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200">
          <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-zinc-400">
            <p>
              이 사이트의 내용은 법률 자문이 아니며, 실제 투자 계약 시 반드시
              전문가(변호사, 세무사)의 검토를 받으시기 바랍니다.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
