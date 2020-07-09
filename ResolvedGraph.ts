import { mutateDeepLeft } from './mutateDeepLeft'
import { Node } from './Node'
import { Link } from './Link'
import { ResolvedLink } from './ResolvedLink'
import { ResolvedNode } from './ResolvedNode'
import { Graph } from './Graph'
import { matchDeepRight } from './matchDeepRight'

export class ResolvedGraph<NodeData = any, LinkData = NodeData> {
  private _nodes: { [id: string]: ResolvedNode<NodeData, LinkData> }
  private _links: { [id: string]: ResolvedLink<LinkData, NodeData> }

  constructor(graph?: Graph<NodeData, LinkData>) {
    this._nodes = {}
    this._links = {}
    if (graph) this.mergeGraph(graph)
  }

  get nodes(): ResolvedNode<NodeData, LinkData>[] {
    return Object.values(this._nodes)
  }

  get links(): ResolvedLink<LinkData, NodeData>[] {
    return Object.values(this._links)
  }

  private resolveNode(node: Node<NodeData>) {
    this.node(node.id).to = Object.values(this._links).filter((l) => l.to === this.node(node.id))
    this.node(node.id).from = Object.values(this._links).filter((l) => l.from === this.node(node.id))
  }

  private resolveLink(link: Link<LinkData>) {
    this._links[link.id].to = this._nodes[link.to]
    this._links[link.id].from = this._nodes[link.from]
  }

  mergeGraph(graph: Graph<NodeData, LinkData>) {
    mutateDeepLeft(
      this._links,
      graph.links.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
    )
    mutateDeepLeft(
      this._nodes,
      graph.nodes.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
    )

    graph.links.forEach((link) => this.resolveLink(link))
    graph.nodes.forEach((node) => this.resolveNode(node))
  }

  setNode(node: Node<NodeData>) {
    this._nodes[node.id] = node as ResolvedNode<NodeData, LinkData>
    this.resolveNode(node)
  }

  mergeNode(node: Node<NodeData>) {
    mutateDeepLeft(this._nodes, { [node.id]: node })
    this.resolveNode(node)
  }

  findNode(query: object): ResolvedNode<NodeData, LinkData> {
    return this.nodes.find((node) => matchDeepRight(node, query))
  }

  findNodes(query: object): ResolvedNode<NodeData, LinkData>[] {
    return this.nodes.filter((node) => matchDeepRight(node, query))
  }

  node(id: string): ResolvedNode<NodeData, LinkData> {
    return this._nodes[id]
  }

  setLink(link: Link<LinkData>) {
    this._links[link.id] = link as any
    this.resolveLink(link)
  }

  mergeLink(link: Link<LinkData>) {
    mutateDeepLeft(this._links, { [link.id]: link })
    this.resolveLink(link)
  }

  findLink(query: object): ResolvedLink<LinkData, NodeData> {
    return this.links.find((link) => matchDeepRight(link, query))
  }

  findLinks(query: object): ResolvedLink<LinkData, NodeData>[] {
    return this.links.filter((link) => matchDeepRight(link, query))
  }

  link(id: string): ResolvedLink<LinkData, NodeData> {
    return this._links[id]
  }

  dissolve(): Graph<NodeData, LinkData> {
    return {
      nodes: this.nodes.map((node) => ({ ...node, from: undefined, to: undefined } as Node<NodeData>)),
      links: this.links.map((link) => ({ ...link, from: link.from.id, to: link.to.id } as Link<LinkData>)),
    }
  }
}
