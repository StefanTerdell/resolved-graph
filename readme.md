# Resolved Graph

_Check out the ResolvedGraph class for pretty self explanatory methods. Will update with some more js defs soon. Npm package is here: https://www.npmjs.com/package/resolved-graph_

## Introduction

This is a tiny package that takes a more or less standard graph and make its entities directly accesible (and iterable with standard methods) through memory, like so:

```typescript
import { Graph } from 'resolved-graph'

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
```

Now, lets resolve it:

```typescript
import { Graph, ResolvedGraph } from 'resolved-graph'
//...
const resolvedGraph = new ResolvedGraph(graph)
```

...And try it out for size:

```typescript
//...
for (const node of resolvedGraph.nodes) {
  for (const link of node.from) {
    const nextNode = link.to
    console.log(node.id + link.id + nextNode.id)
  }
}
```

Expected output:

```
Tommy is in love with Viktoria
Viktoria is head over heels for Tommy
```

## Defining node & link types

You can define the type of the 'data' prop on both nodes and links. This will preserve intellisense event after resolving the graph, making it easy to traverse your data in code. However - as with any self respecting JS application - there is no runtime typechecking ;)

```typescript
//...

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
```

## Searching for nodes & links

You can use the `.findNode`, `.findNodes`, `.findLink` or `.findLinks` functions to easily query for certain entities. For example, lets find all nodes with name Tommy in the data prop and that has any links to a node with id '2':

```typescript
//...
console.log(resolvedGraph.findNodes({ data: { name: 'Tommy' }, from: [{ to: { id: '2' } }] }))
```

Expected output:

```
[
  {
    id: '1',
    data: { name: 'Tommy' },
    to: [[Object]],
    from: [[Object]],
  },
]
```

And yes, I am working on a (simple) query language for this ;)

## Disclaimer

As long as you use the standard methods found on the ResolvedGraph class, it should keep up with all resolutions for you. You can chuck in whatever properties you like on the nodes & links, as long as you stay away from 'id', 'to' and 'from'. The dissolve() method breaks the circular references and makes it safe for JSON. No checks are made on other properties so that's up to you.

This project is currently only for my amusement. With that said, I'm glad you found it and welcome any requests!
