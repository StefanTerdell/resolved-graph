import { Node } from './Node'
import { ResolvedLink } from './ResolvedLink'
export interface ResolvedNode<NodeData, LinkData> extends Node<NodeData> {
  to: ResolvedLink<LinkData, NodeData>[]
  from: ResolvedLink<LinkData, NodeData>[]
}
