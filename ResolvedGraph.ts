import { mutateDeepLeft } from "./mutateDeepLeft"
import { Node } from "./Node"
import { Link } from "./Link"
import { ResolvedLink } from "./ResolvedLink"
import { ResolvedNode } from "./ResolvedNode"
import { Graph } from "./Graph"

export class ResolvedGraph {
    private _nodes: {[id: string]: ResolvedNode}
    private _links: {[id: string]: ResolvedLink}

    constructor(graph?: Graph) {
        this._nodes = {}
        this._links = {}
        if (graph) this.mergeGraph(graph)
    }

    get nodes() {
        return Object.keys(this._nodes).map((key) => this._nodes[key])
    }

    get links() {
        return Object.keys(this._links).map((key) => this._links[key])
    }

    private resolveNode(node: Node) {
        this._nodes[node.id].to = Object.keys(this._links).map((key) => this._links[key]).filter(l => l.to === this._nodes[node.id])
        this._nodes[node.id].from = Object.keys(this._links).map((key) => this._links[key]).filter(l => l.from === this._nodes[node.id])
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
        mutateDeepLeft(this._nodes[node.id], {[node.id]: node})
        this.resolveNode(node)
    }

    setLink(link: Link) {
        this._links[link.id] = link as any
        this.resolveLink(link)
    }

    mergeLink(link: Link) {
        mutateDeepLeft(this._links[link.id], {[link.id]: link})
        this.resolveLink(link)  
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