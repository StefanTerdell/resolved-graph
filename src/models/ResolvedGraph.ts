import { mutateDeepLeft } from '../utils/mutateDeepLeft'
import { Node } from './Node'
import { Link } from './Link'
import { ResolvedLink } from './ResolvedLink'
import { ResolvedNode } from './ResolvedNode'
import { Graph } from './Graph'
import { matchDeepRight } from '../utils/matchDeepRight'

export class ResolvedGraph<NodeData = any, LinkData = NodeData> {
  private _nodes: { [id: string]: ResolvedNode<NodeData, LinkData> }
  private _links: { [id: string]: ResolvedLink<LinkData, NodeData> }

  /**
   * Creates a graph where all the nodes and links have references to its connected entitites
   * @param graph The graph to resolve on creation
   */
  constructor(graph?: Graph<NodeData, LinkData>) {
    this._nodes = {}
    this._links = {}
    if (graph) this.mergeGraph(graph)
  }

  /**
   * An array of all the resolved nodes in the graph
   */
  get nodes(): ResolvedNode<NodeData, LinkData>[] {
    return Object.values(this._nodes)
  }

  /**
   * An array of all the resolved links in the graph
   */
  get links(): ResolvedLink<LinkData, NodeData>[] {
    return Object.values(this._links)
  }

  private resolveNode(node: Node<NodeData> | ResolvedNode<NodeData, LinkData>) {
    this.node(node.id).to = Object.values(this._links).filter((l) => l.to === this.node(node.id))
    this.node(node.id).from = Object.values(this._links).filter((l) => l.from === this.node(node.id))
  }

  private resolveLink(link: Link<LinkData> | ResolvedLink<LinkData, NodeData>) {
    this._links[link.id].to = this._nodes[typeof link.to === 'string' ? link.to : link.to.id]
    this._links[link.id].from = this._nodes[typeof link.from === 'string' ? link.from : link.from.id]
  }

  /**
   * Merges a simple graph into the existing resolved graph, resolving all links and nodes affected in the process
   * @param graph The graph to merge into the existing resolved graph
   */
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

  /**
   * Either creates a new node or sets a node, deleting any non-vital properties not included in the argument
   * @param node The node to create or set
   */
  setNode(node: Node<NodeData> | ResolvedNode<NodeData, LinkData>) {
    if (!this._nodes[node.id]) {
      this._nodes[node.id] = node as ResolvedNode<NodeData, LinkData>
    } else {
      if (this._nodes[node.id] === node) return //<-- Entity is not a clone and has already been mutated outside the graph.
      const oldKeys = Object.keys(this._nodes[node.id])
      const newKeys = Object.keys(node)
      for (const newKey of newKeys) {
        this._nodes[node.id][newKey] = node[newKey]
      }
      for (const oldKey of oldKeys) {
        if (oldKey === 'from' || oldKey === 'to' || oldKey === 'id') continue
        if (!newKeys.includes(oldKey)) {
          delete this._nodes[node.id][oldKey]
        }
      }
    }

    this.resolveNode(node)
  }

  /**
   * Merges or creates a node, overwriting any properties in the node argument while not changing any other ones
   * @param node The node to merge
   */
  mergeNode(node: Node<NodeData> | ResolvedNode<NodeData, LinkData>) {
    mutateDeepLeft(this._nodes, { [node.id]: node })
    this.resolveNode(node)
  }

  /**
   * Returns the first node that matches the query object, including nested links and their nodes
   * @param query Contains properties that must be matched by the node
   * @example
   * resolvedGraph.findNode({ data: { answer: 42 } })
   * > { id: "Adams", data: { answer: 42, question: "What do you get when you multiply six by nine?" }, from: [...], to: [...]} }
   * @example
   * resolvedGraph.findNode({ id: "A", from: [{ to: { id: "B"} }]})
   * > { id: "A", from: [ { id: "1", from: [Circular] , to: { id: "B", from: [...], to: [ [Circular] , ...] }}, ...], to: [...] }
   */
  findNode(query: object): ResolvedNode<NodeData, LinkData> {
    return this.nodes.find((node) => matchDeepRight(node, query))
  }

  /**
   * Returns an array of nodes that matches the query object, including nested links and their nodes
   * @param query Contains properties that must be matched by the nodes
   * @example
   * resolvedGraph.findNodes({ data: { type: "Movie" } })
   * > [
   *  {
   *    id: "TMTRX",
   *    data: {
   *      name: "The Matrix"
   *      type: "Movie",
   *      rating: "Breathtaking!"
   *    },
   *    from: [...],
   *    to: [...]
   *  },
   *  {
   *    id: "PRDTR",
   *    data: {
   *      name: "Predator"
   *      type: "Movie",
   *      rating: "Auuuagh! Auugh!"
   *    },
   *    from: [...],
   *    to: [...]
   *  }
   * ]
   */
  findNodes(query: object): ResolvedNode<NodeData, LinkData>[] {
    return this.nodes.filter((node) => matchDeepRight(node, query))
  }

  /**
   * Returns a node with a given id
   * @param id The id of the node
   */
  node(id: string): ResolvedNode<NodeData, LinkData> {
    return this._nodes[id]
  }

  /**
   * Either creates a new link or sets a link, deleting any non-vital properties not included in the argument
   * @param link The link to create or set
   */
  setLink(link: Link<LinkData> | ResolvedLink<LinkData, NodeData>) {
    if (!this._links[link.id]) {
      this._links[link.id] = link as any
    } else {
      if (this._links[link.id] === link) return //<-- Entity is not a clone and has already been mutated outside the graph.
      const oldKeys = Object.keys(this._links[link.id])
      const newKeys = Object.keys(link)
      for (const newKey of newKeys) {
        this._links[link.id][newKey] = link[newKey]
      }
      for (const oldKey of oldKeys) {
        if (oldKey === 'from' || oldKey === 'to' || oldKey === 'id') continue
        if (!newKeys.includes(oldKey)) {
          delete this._links[link.id][oldKey]
        }
      }
    }

    this.resolveLink(link)
  }

  /**
   * Merges or creates a link, overwriting any properties in the link argument while not changing any other ones
   * @param link The link to merge
   */
  mergeLink(link: Link<LinkData> | ResolvedLink<LinkData, NodeData>) {
    mutateDeepLeft(this._links, { [link.id]: link })
    this.resolveLink(link)
  }

  /**
   * Returns the first link that matches the query object, including nested nodes and their links
   * @param query Contains properties that must be matched by the link
   * @example
   * resolvedGraph.findLink({ data: { type: "Acted in" } to: { id: 'TMTRX' }})
   * >
   * {
   *  id: "123",
   *  data: { type: "Acted in" },
   *  from: {
   *    id: "KNU",
   *    data: { name: "Keanu Reeves" },
   *    from: [ [Circular], ...],
   *    to: [...]
   *  },
   *  to: {
   *    id: "TMTRX",
   *    data: {
   *      name: "The Matrix"
   *      type: "Movie",
   *      rating: "Breathtaking!"
   *    },
   *    from: [...],
   *    to: [ [Circular], ...]
   *  },
   * }
   */
  findLink(query: object): ResolvedLink<LinkData, NodeData> {
    return this.links.find((link) => matchDeepRight(link, query))
  }

  /**
   * Returns any links that match the query object, including nested nodes and their links
   * @param query Contains properties that must be matched by the links
   * @example
   * resolvedGraph.findLinks({ from: { id: "A" } })
   * >
   * [
   *  {
   *    id: "AB",
   *    from: {
   *      id: "A",
   *      from: [[Circular], ...],
   *      to: [...]
   *    },
   *    to: {
   *      id: "B"
   *      from: [[Circular], ...],
   *      to: [...]
   *    }
   *  },
   *  {
   *    id: "AC",
   *    from: {
   *      id: "A",
   *      from: [[Circular], ...],
   *      to: [...]
   *    },
   *    to: {
   *      id: "C"
   *      from: [[Circular], ...],
   *      to: [...]
   *    }
   *  }
   * ]
   */
  findLinks(query: object): ResolvedLink<LinkData, NodeData>[] {
    return this.links.filter((link) => matchDeepRight(link, query))
  }

  /**
   * Returns a link with a given id
   * @param id The id of the link
   */
  link(id: string): ResolvedLink<LinkData, NodeData> {
    return this._links[id]
  }

  /**
   * Creates an unresolved Graph object out of a the Resolved Graph
   */
  dissolve(): Graph<NodeData, LinkData> {
    return {
      nodes: this.nodes.map((node) => ({ ...node, from: undefined, to: undefined } as Node<NodeData>)),
      links: this.links.map((link) => ({ ...link, from: link.from.id, to: link.to.id } as Link<LinkData>)),
    }
  }
}
