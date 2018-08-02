import { Scene } from './Scene'
import ST from './ST'

export enum State {
  loading,
  start,
  setting,
  info,
  demo,
}

export const gst = new ST({
  scale   : +(localStorage.getItem('globalScale') || 2),
  scene   : undefined as Scene | undefined,
  state   : State.loading,
  tick    : 0 as number,
  fcount  : 0 as number,
  validate: false,
  resize  : undefined as undefined,
})

gst.on('scale', (nscale) => localStorage.setItem('globalScale', nscale + ''))
