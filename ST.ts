export default class ST<T extends object> {
  public xmap: {
    [P in keyof T]: {
      state: T[P],
      list: Set<(arg: T[P], old?: T[P]) => void>,
    }
  }
  constructor(defaults: T) {
    this.xmap = Object.entries(defaults).reduce((p, [k, v]) => ({
      ...p,
      [k]: {
        state: v,
        list: new Set,
      },
    }), {} as any)
  }
  public on<P extends keyof T>(name: P, fn: (arg: T[P], old: T[P]) => any): void {
    this.xmap[name].list.add(fn)
  }
  public off<P extends keyof T>(name: P, fn: (arg: T[P], old: T[P]) => any): void {
    this.xmap[name].list.delete(fn)
  }
  public refresh<P extends keyof T>(name: P) {
    this.xmap[name].list.forEach((x) => x(this.xmap[name].state))
  }
  public emit<P extends keyof T>(name: P, newstate: T[P]) {
    const old = this.xmap[name].state
    this.xmap[name].state = newstate
    this.xmap[name].list.forEach((x) => x(newstate, old))
  }
  public emitFn<P extends keyof T>(name: P, fstate: (i: T[P]) => T[P]) {
    return this.emit(name, fstate(this.xmap[name].state))
  }
  public access<P extends keyof T>(name: P): T[P] {
    return this.xmap[name].state
  }
  public fetch(): T {
    return Object.entries(this.xmap).reduce((p, [k, v]) => ({
      ...p,
      [k]: (v as any).state,
    }), {} as any)
  }
}
