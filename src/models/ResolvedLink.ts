import { Node } from './Node'
import { ResolvedNode } from './ResolvedNode'
export interface ResolvedLink<LinkData = any, NodeData = LinkData> extends Node<LinkData> {
  to: ResolvedNode<NodeData, LinkData>
  from: ResolvedNode<NodeData, LinkData>
}
