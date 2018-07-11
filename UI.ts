import { IEntity } from './Scene'

export namespace JSX {
  export type ElementClass = IEntity
}

interface IEntityConstructor<T> {
  new (t: T): IEntity
}

export function UI<T>(el: IEntityConstructor<T>, attr: T, ...children: Array<IEntity | string>) {
  const ret = new el(attr)
  if (children.length) {
    children.forEach((x) => ret.add(x))
  }
  return ret
}
