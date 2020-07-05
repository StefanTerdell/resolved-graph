import { Node } from './Node'
import { ResolvedLink } from './ResolvedLink'
export interface ResolvedNode extends Node {
  to: ResolvedLink[]
  from: ResolvedLink[]
}
