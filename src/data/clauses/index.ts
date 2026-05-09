import { Clause } from "@/types/clause";
import { liquidationPreference } from "./liquidation-preference";
import { antiDilution } from "./anti-dilution";
import { conversionRight } from "./conversion-right";
import { redemptionRight } from "./redemption-right";
import { vesting } from "./vesting";
import { protectiveProvisions } from "./protective-provisions";
import { rofr } from "./rofr";
import { tagAlong } from "./tag-along";
import { dragAlong } from "./drag-along";
import { putOption } from "./put-option";
import { deemedLiquidation } from "./deemed-liquidation";
import { lockUp } from "./lock-up";

export const clauses: Clause[] = [
  liquidationPreference,
  antiDilution,
  conversionRight,
  redemptionRight,
  protectiveProvisions,
  rofr,
  tagAlong,
  dragAlong,
  putOption,
  deemedLiquidation,
  lockUp,
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
