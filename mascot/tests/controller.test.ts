import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMascot, xiaoyunCloud } from '../src/index'
import { YunMascot } from '../src/vue'

const mountedApps: Array<ReturnType<typeof createApp>> = []

afterEach(() => {
  for (const app of mountedApps.splice(0))
    app.unmount()
  document.body.replaceChildren()
  vi.useRealTimers()
})

function createRoot(): HTMLDivElement {
  const root = document.createElement('div')
  root.style.width = '96px'
  document.body.append(root)
  return root
}

describe('createMascot', () => {
  it('builds a mouthless mascot with two projectable eyes', () => {
    const mascot = createMascot(createRoot(), {
      rig: xiaoyunCloud,
      respectReducedMotion: false,
    })

    expect(mascot.svg.querySelectorAll('[data-yun-mascot-eye]')).toHaveLength(2)
    expect(mascot.svg.querySelector('[data-yun-mascot-blush]')).not.toBeNull()
    expect(mascot.root.style.getPropertyValue('--mascot-blush-opacity')).toBe('0')
    expect(mascot.expression).toBe('idle')

    mascot.destroy()
    expect(document.querySelector('[data-yun-mascot-svg]')).toBeNull()
  })

  it('shows blush only for expressions that request it', () => {
    const mascot = createMascot(createRoot(), {
      rig: xiaoyunCloud,
      respectReducedMotion: false,
    })

    mascot.setExpression('shy')
    expect(mascot.expression).toBe('shy')
    expect(mascot.root.style.getPropertyValue('--mascot-blush-opacity')).toBe('0.64')

    mascot.setExpression('happy')
    expect(mascot.root.style.getPropertyValue('--mascot-blush-opacity')).toBe('0')

    mascot.destroy()
  })

  it('merges theme updates without dropping previous overrides', () => {
    const mascot = createMascot(createRoot(), {
      rig: xiaoyunCloud,
      respectReducedMotion: false,
    })

    mascot.setTheme({ body: '#112233' })
    mascot.setTheme({ eye: '#FEDCBA' })

    expect(mascot.root.style.getPropertyValue('--mascot-body')).toBe('#112233')
    expect(mascot.root.style.getPropertyValue('--mascot-eye')).toBe('#FEDCBA')

    mascot.destroy()
  })

  it('blinks when the host is clicked and opts in', () => {
    vi.useFakeTimers()
    const root = createRoot()
    const mascot = createMascot(root, {
      rig: xiaoyunCloud,
      clickToBlink: true,
      respectReducedMotion: false,
    })

    root.click()
    expect(root.style.getPropertyValue('--mascot-blink')).toBe('0.12')

    vi.advanceTimersByTime(130)
    expect(root.style.getPropertyValue('--mascot-blink')).toBe('1')

    mascot.destroy()
  })
})

describe('YunMascot Vue adapter', () => {
  it('mounts the controller and exposes an accessible click target', async () => {
    const root = createRoot()
    const app = createApp({
      render: () => h(YunMascot, {
        size: 72,
        theme: { body: '#123456' },
        clickToBlink: true,
        ariaLabel: '测试小云',
      }),
    })
    mountedApps.push(app)
    app.mount(root)
    await nextTick()

    const button = root.querySelector<HTMLButtonElement>('button.yun-mascot')
    expect(button).not.toBeNull()
    expect(button?.getAttribute('aria-label')).toBe('测试小云，点击眨眼')
    expect(button?.querySelectorAll('[data-yun-mascot-eye]')).toHaveLength(2)
    expect(button?.querySelector('[data-yun-mascot]')?.getAttribute('data-yun-mascot'))
      .toBe(xiaoyunCloud.id)
  })

  it('renders a static image role by default', async () => {
    const root = createRoot()
    const app = createApp({
      render: () => h(YunMascot, {
        size: '5rem',
        ariaLabel: '小云插图',
      }),
    })
    mountedApps.push(app)
    app.mount(root)
    await nextTick()

    const image = root.querySelector('[role="img"]')
    expect(image).not.toBeNull()
    expect(image?.getAttribute('aria-label')).toBe('小云插图')
    expect(root.querySelector('button')).toBeNull()
  })
})
