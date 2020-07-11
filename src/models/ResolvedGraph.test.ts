import { Graph } from './Graph'
import { ResolvedGraph } from './ResolvedGraph'

describe('Readme examples', () => {
  test('The first one with only IDs should log out the correct answers', () => {
    /////

    console.log = jest.fn()

    /////

    const graph: Graph = {
      nodes: [
        {
          id: 'Tommy ',
        },
        {
          id: 'Viktoria ',
        },
      ],
      links: [
        {
          id: 'is in love with ',
          from: 'Tommy ',
          to: 'Viktoria ',
        },
        {
          id: 'is head over heels for ',
          from: 'Viktoria ',
          to: 'Tommy ',
        },
      ],
    }

    const resolvedGraph = new ResolvedGraph(graph)

    for (const node of resolvedGraph.nodes) {
      for (const link of node.from) {
        const nextNode = link.to
        console.log(node.id + link.id + nextNode.id)
      }
    }

    /////

    expect(console.log).toHaveBeenCalledWith('Tommy is in love with Viktoria ')
    expect(console.log).toHaveBeenCalledWith('Viktoria is head over heels for Tommy ')

    /////
  })

  test('Data property type should be passed down through a resolved graph from a graph', () => {
    /////

    interface myDataType {
      tag: 'myTag'
      prop: string
    }

    const graph: Graph<myDataType> = {
      nodes: [
        {
          id: '1',
          data: {
            tag: 'myTag',
            prop: 'hello!',
          },
        },
      ],
      links: [],
    }

    const resolvedGraph = new ResolvedGraph(graph)

    /////

    expect(resolvedGraph.nodes[0].data).toStrictEqual(graph.nodes[0].data)

    /////
  })

  test('Searching for nodes and links should be possible', () => {
    /////

    console.log = jest.fn()

    /////

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

    console.log(resolvedGraph.findNodes({ data: { name: 'Tommy' }, from: [{ to: { id: '2' } }] }))

    /////

    expect(console.log).toHaveBeenCalledWith([resolvedGraph.nodes.find((n) => n.id === graph.nodes[0].id)])

    /////
  })
})
