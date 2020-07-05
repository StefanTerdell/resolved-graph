import { Node } from './Node'
import { Link } from './Link'
export interface Graph<NodeData = any, LinkData = NodeData> {
  nodes: Node<NodeData>[]
  links: Link<LinkData>[]
}
