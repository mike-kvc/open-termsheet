# Open Termsheet Product Structure

## Product Thesis

Open Termsheet should be a fundraising operating system for Korean startups, not only a glossary of term sheet clauses.

The product should help a founder answer four questions in order:

1. Who should I talk to?
2. Why are they relevant to my round?
3. What should I send or prepare?
4. How should I understand and negotiate the terms I receive?

Term sheet education remains important, but it should sit downstream of fundraising execution. A founder usually needs the legal explanation after an investor target, meeting, or draft term sheet exists.

## Primary User

The primary user is a Korean startup founder or operator preparing a financing round.

They are usually not looking for raw announcements. They need a practical path from company context to investor action:

- company stage, sector, traction, target round size
- relevant Korean investors
- evidence for why those investors are relevant
- outreach drafts and meeting preparation
- term sheet and investment agreement risk interpretation

## Core Product Loop

The core loop is:

```text
Company profile
-> Investor discovery
-> Target queue
-> Evidence and source verification
-> Outreach and meeting prep
-> Term sheet analysis
-> Negotiation and closing checklist
```

Every major feature should support one step of this loop. Features that do not advance this loop should be treated as reference material, not primary product surface.

## Information Architecture

### 1. Fundraising CRM

Route today: `/market`

Preferred future route: `/fundraising`

Job:
Help founders find Korean investors, add them to a target queue, and turn each target into an outreach or meeting action.

Primary objects:

- startup profile
- investor entity
- investor target
- target status
- source evidence
- outreach draft

This should become the product home for a founder starting fundraising.

### 2. Investor Directory

Current state:
Seeded inside the market UI component.

Target state:
Source-backed investor entity database.

Investor entity fields:

- `id`
- `name`
- `kind`: VC, seed investor, accelerator, CVC, growth investor, financial/strategic investor
- `stage_fit`
- `sector_fit`
- `source_status`: seed, source-candidate, source-backed
- `source_ids`
- `last_verified_at`
- `recent_funds`
- `recent_investments`
- `portfolio_examples`
- `contact_routes`
- `term_lens`

Source candidates:

- KVCA member/company data for VC identity
- K-Startup accelerator registration data for AC identity
- TIPS operator data for early investor/operator identity
- PE/VC/LP announcements for fund and LP signals
- THE VC or similar licensed data for investment history, portfolio, people, and round history
- public news/search for recent activity, treated as candidate evidence only

### 3. Evidence Inbox

Route today: embedded in `/market`.

Job:
Show raw signals as supporting evidence, not as the main product.

Evidence types:

- LP/fund-of-funds announcements
- support programs
- TIPS/accelerator signals
- investment news
- filings or disclosures
- source import status

Rules:

- Evidence should never imply an investor is currently investable by itself.
- Evidence must show source, timestamp, and confidence.
- Evidence should attach to investor entities or target cards whenever possible.

### 4. Outreach and Meeting Prep

Job:
Turn an investor target into an action.

Outputs:

- intro request draft
- cold email draft
- warm intro context
- 5-sentence meeting pitch
- meeting checklist
- investor-specific IR emphasis
- diligence question prep

This should be generated from the startup profile, investor entity, and evidence. Generic outreach copy is low-value unless it is tied to a concrete investor and reason.

### 5. Term Sheet Library

Current routes:

- `/clauses/[id]`
- `/guide`
- `/simulator`
- `/laws`
- `/faq`

Job:
Explain clauses and negotiation effects after a founder has investor context or a draft term sheet.

Primary objects:

- clause
- scenario
- founder risk
- investor rationale
- market range
- legal basis
- negotiation lever

This remains valuable, but should not be the first screen for fundraising.

### 6. Term Sheet Analyzer

Current route:

- `/analyze`

Job:
Parse a draft term sheet or investment agreement and map it to clause risks, market norms, and negotiation actions.

Target outputs:

- clause extraction
- founder-risk summary
- investor-friendly/founder-friendly spectrum
- unusual terms
- negotiation checklist
- investor context if the counterparty is known

This should eventually connect the legal layer back to the fundraising CRM.

## Product Navigation

Recommended top-level navigation:

1. Fundraising
2. Investors
3. Analyze Term Sheet
4. Clauses
5. Simulator
6. Laws / FAQ

`Fundraising` and `Investors` should come before `Clauses` because the founder's journey starts with raising money, not reading legal reference material.

## Route Plan

Short term:

- Keep `/market` working for deployed continuity.
- Add `/fundraising` as the canonical route and redirect or link `/market` to it later.
- Move investor seed data out of `MarketRadar` into `src/data/investors`.
- Move source registry out of the component into `src/data/investor-sources`.

Medium term:

- Add `/investors` for full directory search.
- Add `/fundraising` for the founder workspace and target queue.
- Keep `/market` only as legacy alias or evidence/radar page.

Long term:

- Add server-backed entity storage.
- Add source adapter jobs.
- Add account/workspace persistence for saved targets and drafts.

## Data Model Boundaries

### Investor Entity

Canonical identity of an investor.

Should not contain user-specific queue state.

### Target

User-specific investor candidate for a particular fundraising round.

Contains:

- status
- priority
- notes
- saved outreach draft
- intro route
- next action

### Evidence

Source-backed signal that may attach to investors, funds, or support programs.

Contains:

- source
- source URL
- detected time
- confidence
- normalized type
- linked investor or fund if known

### Clause

Legal concept independent from a specific investor.

### Analysis

User-uploaded or pasted term sheet analysis result.

Contains extracted clauses, risk flags, and negotiation suggestions.

## Current Problems

1. `/market` name is wrong for the product direction.
2. Investor seed data lives in a UI component.
3. Source metadata is visible but not yet used as real hydration.
4. The README still describes the product as a term sheet guide only.
5. The founder journey is split across pages without a clear primary workflow.
6. Saved queue state is local component state only.

## Next Implementation Sequence

1. Extract investor and source data from `MarketRadar` into data modules.
2. Add `/fundraising` as the canonical fundraising workspace.
3. Add `/investors` as the directory route.
4. Keep `/market` as compatibility route that renders the fundraising workspace or points to it.
5. Update README to describe the broader product.
6. Add source adapter interfaces:
   - `InvestorSource`
   - `InvestorEntity`
   - `InvestorEvidence`
7. Convert current seed list to `source-candidate` entities with `last_verified_at: null`.
8. Add test coverage for matching/search behavior before adding more source adapters.

## Non-Goals For Now

- Do not claim full Korean investor coverage until verified source imports exist.
- Do not imply LP announcements equal current investor availability.
- Do not make AI-generated investor matching look authoritative without source evidence.
- Do not bury source quality behind a single match score.
- Do not expand the legal clause library before fixing the fundraising workflow shape.
