import { Clause } from "@/types/clause";
import { liquidationPreference } from "./liquidation-preference";
import { antiDilution } from "./anti-dilution";
import { vesting } from "./vesting";

export const clauses: Clause[] = [
  liquidationPreference,
  antiDilution,
  vesting,
];

export const clauseMap = Object.fromEntries(
  clauses.map((c) => [c.id, c])
) as Record<string, Clause>;

export const categories = {
  economics: "경제적 조건",
  governance: "지배구조",
  protective: "투자자 보호",
  exit: "Exit 관련",
  founder: "창업자 관련",
} as const;
