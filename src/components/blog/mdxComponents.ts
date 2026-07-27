/**
 * Single registry of components available to MDX posts.
 *
 * Both blog render paths import from here — the standalone
 * /blog/[slug] route and the in-shell BlogListPanel. Register a
 * new interactive component once, in this file, and it works in
 * both. (Previously the two lists were maintained separately and
 * drifted, which fails only at prerender time with
 * "Expected component X to be defined".)
 */

import {
  ComparisonToggle,
  HookTrace,
  TryItChecklist,
  LayerModel,
  MidpointProof,
  ComplexityTable,
  SearchRaceVisualizer,
  JobStateVisualizer,
  SecurityLayerDiagram,
  FailModeCompare,
  ManifestMapper,
  URLRiskChecker,
  KodemuxRouterDemo,
  KodemuxGuardTrace,
} from './BlogMdxComponents';

import {
  PrsAuditScoreboard,
  PrsRubberStamp,
} from './PrsMdxComponents';

export const mdxComponents = {
  ComparisonToggle,
  HookTrace,
  TryItChecklist,
  LayerModel,
  MidpointProof,
  ComplexityTable,
  SearchRaceVisualizer,
  JobStateVisualizer,
  SecurityLayerDiagram,
  FailModeCompare,
  ManifestMapper,
  URLRiskChecker,
  KodemuxRouterDemo,
  KodemuxGuardTrace,
  // ── How I built PRS (5-part series) ──
  PrsAuditScoreboard,
  PrsRubberStamp,
};
