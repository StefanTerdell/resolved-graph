import { Node, Link, Graph, ResolvedGraph } from '.'

interface NodeData {
  name: string
}

interface LinkData {
  label: string
}

const graph: Graph<NodeData, LinkData> = {
  nodes: [
    {
      id: '1',
      data: { name: 'Tommy' },
    },
    {
      id: '2',
      data: { name: 'Viktoria' },
    },
  ],
  links: [
    {
      id: '3',
      from: '1',
      to: '2',
      data: { label: 'is in love with' },
    },
    {
      id: '4',
      from: '2',
      to: '1',
      data: { label: 'is head over heels for' },
    },
  ],
}

const resolvedGraph = new ResolvedGraph(graph)

for (const node of resolvedGraph.nodes) {
  for (const link of node.from) {
    const nextNode = link.to
    console.log([node.data.name, link.data.label, nextNode.data.name].join(' '))
  }
}

console.log(resolvedGraph.findNodes({ data: { name: 'Tommy' }, from: [{ to: { id: '2' } }] }))
