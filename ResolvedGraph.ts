import { mutateDeepLeft } from "./mutateDeepLeft"
import { Node } from "./Node"
import { Link } from "./Link"
import { ResolvedLink } from "./ResolvedLink"
import { ResolvedNode } from "./ResolvedNode"
import { Graph } from "./Graph"
import { equalsRight } from "./equalsRight"

export class ResolvedGraph {
    private _nodes: {[id: string]: ResolvedNode}
    private _links: {[id: string]: ResolvedLink}

    constructor(graph?: Graph) {
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
        this.node(node.id).to = Object.values(this._links).filter(l => l.to === this.node(node.id))
        this.node(node.id).from = Object.values(this._links).filter(l => l.from === this.node(node.id))
    }

    private resolveLink(link: Link) {
        this._links[link.id].to = this._nodes[link.to]
        this._links[link.id].from = this._nodes[link.from]
    }

    mergeGraph(graph: Graph) {
        mutateDeepLeft(this._links, graph.links.reduce((acc, curr) => ({...acc, [curr.id]: curr}), {}))
        mutateDeepLeft(this._nodes, graph.nodes.reduce((acc, curr) => ({...acc, [curr.id]: curr}), {}))

        graph.links.forEach((link) => this.resolveLink(link))
        graph.nodes.forEach((node) => this.resolveNode(node))
    }

    setNode(node: Node) {
        this._nodes[node.id] = node as ResolvedNode
        this.resolveNode(node)
    }

    mergeNode(node: Node) {
        mutateDeepLeft(this._nodes, {[node.id]: node})
        this.resolveNode(node)
    }

    findNodes(query: object): ResolvedNode[] {
        return this.nodes.filter(node => equalsRight(node, query))
    }

    setLink(link: Link) {
        this._links[link.id] = link as any
        this.resolveLink(link)
    }

    mergeLink(link: Link) {
        mutateDeepLeft(this._links, {[link.id]: link})
        this.resolveLink(link)  
    }

    findLinks(query: object): ResolvedLink[] {
        return this.links.filter(link => equalsRight(link, query))
    }

    node(id: string): ResolvedNode {
        return this._nodes[id]
    }

    link(id: string): ResolvedLink {
        return this._links[id]
    }

    dissolve(): Graph {
        return {
            nodes: this.nodes.map(({id, properties}) => ({id, properties})),
            links: this.links.map(link => ({...link, from: link.from.id, to: link.to.id}))
        }
    }
 }