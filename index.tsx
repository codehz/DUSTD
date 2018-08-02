import tmap from './assets/maps/test.png!image'
// import tmap from './assets/maps/mini.png!image'
import { CenterBox, FPSIndicator, FrameLayout, LayerBox, LinearLayout, Logo, PaddingBox, PlainText, SimplePadding, TitleButton, TitleText } from './BasicUI'
import { ActualMap, CachedMap, FloatItem, GameEngine, InfoBoard, MachineSelector } from './GameEngine'
import { drawQueue } from './GL'
import { gst, State } from './global'
import { FastTurret, Turret } from './Machine'
import { gl, root } from './prepare'
import { Scene } from './Scene'
import { UI } from './UI'

navigator.serviceWorker.register('service-worker.js')

gst.on('resize', () => {
  const globalScale = gst.access('scale')
  const ratio  = window.devicePixelRatio
  const [w, h] = [window.innerWidth, window.innerHeight]

  root.width  = w * ratio
  root.height = h * ratio

  gl.viewport(0, 0, w * ratio, h * ratio)

  console.log(gst.access('scene'))

  gst.access('scene')!.measure({ w: root.width / globalScale | 0, h: root.height / globalScale | 0 })
  gst.emit('validate', false)
})

gst.on('tick', (tick) => {
  gst.access('scene')!.tick(tick)
  if (!gst.access('validate')) {
    gst.emitFn('fcount', (c) => c + 1)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gst.access('scene')!.render()
    drawQueue()
    gst.emit('validate', true)
  }
})

gst.on('scene', () => gst.refresh('resize'))

gst.on('state', (state) => {
  switch (state) {
    case State.loading:
      return gst.emit('scene', <Scene>
        <CenterBox>
          <LinearLayout direction={LinearLayout.Direction.column}>
            <TitleText>Game Engine Loaded</TitleText>
            <TitleText>Loading Resourece</TitleText>
          </LinearLayout>
        </CenterBox>
      </Scene>)
    case State.start:
      return gst.emit('scene', <Scene>
        <LayerBox>
          <PaddingBox size={{w: 150, h: 0}} padding={5}>
            <LinearLayout direction={LinearLayout.Direction.column} padding={5}>
              <Logo />
              <TitleButton action={() => gst.emit('state', State.demo)}>Game</TitleButton>
              <TitleButton action={() => gst.emit('state', State.setting)}>Setting&gt;</TitleButton>
              <TitleButton action={() => gst.emit('state', State.info)}>Info&gt;</TitleButton>
              <SimplePadding w={0} h={84} />
            </LinearLayout>
          </PaddingBox>
          <LayerBox.Stub layer={LayerBox.Layer.LT}>
            <FPSIndicator />
          </LayerBox.Stub>
        </LayerBox>
      </Scene>)
    case State.info:
      return gst.emit('scene', <Scene>
        <LayerBox>
          <PaddingBox size={{ w: 150, h: 0 }} padding={5}>
            <LinearLayout padding={5}>
              <Logo />
              <PlainText>Made by CodeHz</PlainText>
              <PlainText>License: GPLv3</PlainText>
              <SimplePadding w={0} h={10} />
              <TitleButton action={() => gst.emit('state', State.start)}>&lt;Back</TitleButton>
              <SimplePadding w={0} h={84} />
            </LinearLayout>
          </PaddingBox>
        </LayerBox>
      </Scene>)
    case State.setting:
      return gst.emit('scene', <Scene>
        <LayerBox>
          <PaddingBox size={{ w: 150, h: 0 }} padding={5}>
            <LinearLayout padding={5}>
              <Logo />
              <TitleButton action={() => {
                if (gst.access('scale') < 4) {
                  gst.emitFn('scale', (x) => x + 1)
                  gst.refresh('resize')
                }
              }}>Scale UP</TitleButton>
              <TitleButton action={() => {
                if (gst.access('scale') > 1) {
                  gst.emitFn('scale', (x) => x - 1)
                  gst.refresh('resize')
                }
              }}>Scale DOWN</TitleButton>
              <TitleButton action={() => gst.emit('state', State.start)}>&lt;Back</TitleButton>
              <SimplePadding w={0} h={84} />
            </LinearLayout>
          </PaddingBox>
        </LayerBox>
      </Scene>)
    case State.demo: {
      const engine = new GameEngine(new CachedMap(new ActualMap(tmap)))
      const ms = new MachineSelector([new Turret, new FastTurret], (mac) => fi.setFloat(mac))
      const fi = new FloatItem((mac) => engine.mayPlace(mac))
      return gst.emit('scene', <Scene>
        <FrameLayout>
          <LayerBox>
            {engine}
            <LayerBox.Stub layer={LayerBox.Layer.LT}><FPSIndicator /></LayerBox.Stub>
            <LayerBox.Stub layer={LayerBox.Layer.LB}>{ms}</LayerBox.Stub>
            <LayerBox.Stub layer={LayerBox.Layer.RT}>{new InfoBoard(engine)}</LayerBox.Stub>
            <LayerBox.Stub layer={LayerBox.Layer.RB}>
              <PaddingBox size={{w: 80, h: 0}} padding={0}>
                <LinearLayout padding={5} reverse={true}>
                  <TitleButton action={() => gst.emit('state', State.start)}>&lt;Back</TitleButton>
                  <TitleButton action={() => console.log('menu')}>Menu</TitleButton>
                </LinearLayout>
              </PaddingBox>
            </LayerBox.Stub>
          </LayerBox>
          {fi}
        </FrameLayout>
      </Scene>)
    }
  }
})

document.body.replaceChild(root, document.body.firstChild!)

// root.addEventListener('click', () => {
//   root.requestFullscreen()
// })

gst.emit('state', State.start)
const mouseHandler = (e) => gst.access('scene')!.mouse(e)
const keyHandler   = (e) => gst.access('scene')!.keyboard(e)
window.addEventListener('wheel', mouseHandler, { passive: true })
window.addEventListener('pointerdown', mouseHandler, { passive: true })
window.addEventListener('pointermove', mouseHandler, { passive: true })
window.addEventListener('pointerup', mouseHandler, { passive: true })
window.addEventListener('keydown', keyHandler, { passive: true })
window.addEventListener('keyup', keyHandler, { passive: true })
gst.refresh('tick')
window.onresize = () => gst.refresh('resize')
requestAnimationFrame(function frame() {
  requestAnimationFrame(frame)
  gst.emitFn('tick', (x) => x < 5999 ? x + 1 : 0)
})
