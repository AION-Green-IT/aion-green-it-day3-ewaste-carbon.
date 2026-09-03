import type { DiagramProps } from "./palette";
import {
  StakesDiagram,
  CausesDiagram,
  LadderDiagram,
  ScopesDiagram,
  LifecycleDiagram,
  SteerDiagram,
  ConnectionsMap,
  LiteracyRoadmapDiagram,
} from "./BasicsDiagrams";

// Maps a content `visual` string to its diagram. Only the no-props (data-free)
// Basics diagrams live here; section diagrams that need data are imported
// directly by their mechanic.
const REGISTRY: Record<string, (p: DiagramProps) => JSX.Element> = {
  stakes: StakesDiagram,
  causes: CausesDiagram,
  ladder: LadderDiagram,
  scopes: ScopesDiagram,
  lifecycle: LifecycleDiagram,
  steer: SteerDiagram,
  connections: ConnectionsMap,
  literacyRoadmap: LiteracyRoadmapDiagram,
};

export function Diagram({ name, className }: { name: string; className?: string }) {
  const Cmp = REGISTRY[name];
  if (!Cmp) return null;
  return <Cmp className={className} />;
}
