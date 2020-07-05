import { Node } from './Node'
import { Link } from './Link'
export interface Graph<TNode extends Node = Node, TLink extends Link = Link> {
  nodes: TNode[]
  links: TLink[]
}
