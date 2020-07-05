import { mutateDeepLeft } from './mutateDeepLeft'
import { Node } from './Node'
import { Link } from './Link'
import { ResolvedLink } from './ResolvedLink'
import { ResolvedNode } from './ResolvedNode'
import { Graph } from './Graph'
import { equalsRight } from './equalsRight'

export class ResolvedGraph<TNode extends ResolvedNode = ResolvedNode, TLink extends ResolvedLink = ResolvedLink> {
  private _nodes: { [id: string]: TNode }
  private _links: { [id: string]: TLink }

  constructor(graph?: Graph<Node, Link>) {
    this._nodes = {}
    this._links = {}
    if (graph) this.mergeGraph(graph)
  }

  get nodes() {
    return Object.values(this._nodes)
  }

  get links() {
    return Object.values(this._links)
  }

  private resolveNode(node: Node) {
    this.node(node.id).to = Object.values(this._links).filter((l) => l.to === this.node(node.id))
    this.node(node.id).from = Object.values(this._links).filter((l) => l.from === this.node(node.id))
  }

  private resolveLink(link: Link) {
    this._links[link.id].to = this._nodes[link.to]
    this._links[link.id].from = this._nodes[link.from]
  }

  mergeGraph(graph: Graph<Node, Link>) {
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

  setNode(node: Node) {
    this._nodes[node.id] = node as TNode
    this.resolveNode(node)
  }

  mergeNode(node: Node) {
    mutateDeepLeft(this._nodes, { [node.id]: node })
    this.resolveNode(node)
  }

  findNode(query: object): TNode {
    return this.nodes.find((node) => equalsRight(node, query))
  }

  findNodes(query: object): TNode[] {
    return this.nodes.filter((node) => equalsRight(node, query))
  }

  node(id: string): TNode {
    return this._nodes[id]
  }

  setLink(link: Link) {
    this._links[link.id] = link as any
    this.resolveLink(link)
  }

  mergeLink(link: Link) {
    mutateDeepLeft(this._links, { [link.id]: link })
    this.resolveLink(link)
  }

  findLink(query: object): TLink {
    return this.links.find((link) => equalsRight(link, query))
  }

  findLinks(query: object): TLink[] {
    return this.links.filter((link) => equalsRight(link, query))
  }

  link(id: string): TLink {
    return this._links[id]
  }

  dissolve<TNode extends Node, TLink extends Link>(): Graph<TNode, TLink> {
    return {
      nodes: this.nodes.map((node) => ({ ...node, from: undefined, to: undefined } as any)),
      links: this.links.map((link) => ({ ...link, from: link.from.id, to: link.to.id } as any)),
    }
  }
}
