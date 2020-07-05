import { Node } from './Node'
export interface Link extends Node {
  to: string
  from: string
}
