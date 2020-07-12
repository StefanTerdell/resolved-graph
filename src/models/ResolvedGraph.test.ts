import { Graph } from './Graph'
import { ResolvedGraph } from './ResolvedGraph'

describe('Setting & merging nodes & links', () => {
  test('Merging a node should maintain object references', () => {
    const resolvedGraph = new ResolvedGraph<any>({
      nodes: [
        {
          id: 'A',
        },
        {
          id: 'B',
        },
      ],
      links: [
        {
          id: '1',
          from: 'A',
          to: 'B',
        },
      ],
    })

    resolvedGraph.mergeNode({ id: 'B', data: { newData: true } })

    const B = resolvedGraph.node('B')
    const A = resolvedGraph.node('A')

    expect(A.from[0].to).toBe(B)
  })

  test('Merging a node should maintain previous properties', () => {
    const resolvedGraph = new ResolvedGraph<any>({
      nodes: [
        {
          id: 'A',
          data: {
            oldData: true,
          },
        },
      ],
      links: [],
    })

    resolvedGraph.mergeNode({ id: 'A', data: { newData: true } })

    const A = resolvedGraph.node('A')

    expect(A.data).toHaveProperty('oldData')
    expect(A.data).toHaveProperty('newData')
  })

  test('Setting a node should maintain object references', () => {
    const resolvedGraph = new ResolvedGraph<any>({
      nodes: [
        {
          id: 'A',
        },
        {
          id: 'B',
        },
      ],
      links: [
        {
          id: '1',
          from: 'A',
          to: 'B',
        },
      ],
    })

    resolvedGraph.setNode({ id: 'B', data: { newData: true } })

    const B = resolvedGraph.node('B')
    const A = resolvedGraph.node('A')

    expect(A.from[0].to).toBe(B)
  })

  test('Setting a node should delete previous properties', () => {
    const resolvedGraph = new ResolvedGraph<any>({
      nodes: [
        {
          id: 'A',
          data: {
            oldData: true,
          },
        },
      ],
      links: [],
    })

    resolvedGraph.setNode({ id: 'A', data: { newData: true } })

    const A = resolvedGraph.node('A')

    expect(A.data).not.toHaveProperty('oldData')
    expect(A.data).toHaveProperty('newData')
  })

  test('Merging a link should maintain object references', () => {
    const resolvedGraph = new ResolvedGraph<any>({
      nodes: [
        {
          id: 'A',
        },
        {
          id: 'B',
        },
      ],
      links: [
        {
          id: '1',
          from: 'A',
          to: 'B',
        },
      ],
    })

    resolvedGraph.mergeLink({ id: '1', from: 'A', to: 'B', data: { newData: true } })

    const B = resolvedGraph.node('B')
    const A = resolvedGraph.node('A')

    expect(A.from[0].to).toBe(B)
    expect(A.from[0].data).toHaveProperty('newData')
  })

  test('Merging a link should maintain previous properties', () => {
    const resolvedGraph = new ResolvedGraph<any>({
      nodes: [
        {
          id: 'A',
        },
        {
          id: 'B',
        },
      ],
      links: [
        {
          id: 'LinkBoi',
          from: 'A',
          to: 'B',
          data: {
            oldData: true,
          },
        },
      ],
    })

    resolvedGraph.mergeLink({ id: 'LinkBoi', from: 'A', to: 'B', data: { newData: true } })

    const LinkBoi = resolvedGraph.link('LinkBoi')

    expect(LinkBoi.data).toHaveProperty('oldData')
    expect(LinkBoi.data).toHaveProperty('newData')
  })

  test('Setting a link should maintain object references', () => {
    const resolvedGraph = new ResolvedGraph<any>({
      nodes: [
        {
          id: 'A',
        },
        {
          id: 'B',
        },
      ],
      links: [
        {
          id: '1',
          from: 'A',
          to: 'B',
        },
      ],
    })

    resolvedGraph.setLink({ id: '1', from: 'A', to: 'B', data: { newData: true } })

    const A = resolvedGraph.node('A')
    const link = resolvedGraph.link('1')

    expect(A.from[0]).toBe(link)
  })

  test('Setting a node should delete previous properties', () => {
    const resolvedGraph = new ResolvedGraph<any>({
      nodes: [
        {
          id: 'A',
        },
        {
          id: 'B',
        },
      ],
      links: [
        {
          id: '1',
          from: 'A',
          to: 'B',
          data: {
            oldData: true,
          },
        },
      ],
    })

    resolvedGraph.setLink({ id: '1', from: 'A', to: 'B', data: { newData: true } })

    const link = resolvedGraph.link('1')

    expect(link.data).not.toHaveProperty('oldData')
    expect(link.data).toHaveProperty('newData')
  })
})

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
