# Resolved Graph

### Check out the ResolvedGraph class for pretty self explanatory methods.

This is a tiny package that takes a more or less standard graph and make its entities directly accesible (and iterable with standard methods) through memory, like so:

```
import { Graph } from "resolved-graph"

const graph: Graph = {
    nodes: [
        {
            id: "Tommy ",

        },
        {
            id: "Viktoria ",
        }
    ],
    links: [
        {
            id: "is in love with ",
            from: "Tommy ",
            to: "Viktoria "
        },
        {
            id: "is head over heels for ",
            from: "Viktoria ",
            to: "Tommy "
        }
    ]
}
```

Now, lets resolve it:
```
import { Graph, ResolvedGraph } from "resolved-graph"
...
const resolvedGraph = new ResolvedGraph(graph)
```

...And try it out for size:
```
...
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


As long as you use the standard methods found on the ResolvedGraph class, it should keep up with all resolutions for you. You can chuck in whatever properties you like on the nodes & links, as long as you stay away from 'id', 'to' and 'from'. The dissolve() method breaks the circular references and makes it safe for JSON. No checks are made on other properties so that's up to you. GLHF! <3