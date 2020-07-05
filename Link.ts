import { Node } from './Node'
export interface Link<T> extends Node<T> {
  to: string
  from: string
}
