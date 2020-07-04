import { Node } from "./Node";
import { ResolvedNode } from "./ResolvedNode";
export interface ResolvedLink extends Node {
    to: ResolvedNode;
    from: ResolvedNode;
}
