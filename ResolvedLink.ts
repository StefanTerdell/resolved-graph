import { Node } from './Node'
import { ResolvedNode } from './ResolvedNode'
export interface ResolvedLink<LinkData, NodeData> extends Node<LinkData> {
  to: ResolvedNode<NodeData, LinkData>
  from: ResolvedNode<NodeData, LinkData>
}
