import type { PropType, StyleValue } from 'vue'
import type {
  MascotController,
  MascotRig,
  MascotTheme,
} from './types'
import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { createMascot } from './controller'
import { xiaoyunCloud } from './presets/xiaoyun-cloud'

export interface YunMascotExpose {
  blink(): void
  lookAt(x: number, y: number): void
  reset(): void
  setExpression(expression: string): void
  setTheme(theme: MascotTheme): void
  readonly controller: MascotController | undefined
}

function cssSize(size: number | string): string {
  return typeof size === 'number' ? `${size}px` : size
}

export const YunMascot = defineComponent({
  name: 'YunMascot',
  props: {
    rig: {
      type: Object as PropType<MascotRig>,
      default: () => xiaoyunCloud,
    },
    expression: {
      type: String,
      default: undefined,
    },
    theme: {
      type: Object as PropType<MascotTheme>,
      default: undefined,
    },
    size: {
      type: [Number, String],
      default: 96,
    },
    ariaLabel: {
      type: String,
      default: '小云吉祥物',
    },
    decorative: {
      type: Boolean,
      default: false,
    },
    clickToBlink: {
      type: Boolean,
      default: false,
    },
    trackPointer: {
      type: Boolean,
      default: true,
    },
    respectReducedMotion: {
      type: Boolean,
      default: true,
    },
  },
  emits: {
    blink: () => true,
  },
  setup(props, { emit, expose }) {
    const canvas = ref<HTMLElement>()
    let controller: MascotController | undefined

    function fallbackExpression(): string {
      return props.expression
        ?? props.rig.defaultExpression
        ?? Object.keys(props.rig.expressions)[0]
        ?? 'idle'
    }

    function destroy(): void {
      controller?.destroy()
      controller = undefined
    }

    function build(): void {
      destroy()
      if (!canvas.value)
        return
      controller = createMascot(canvas.value, {
        rig: props.rig,
        expression: fallbackExpression(),
        theme: { ...props.rig.theme, ...props.theme },
        trackPointer: props.trackPointer,
        respectReducedMotion: props.respectReducedMotion,
        onBlink: () => emit('blink'),
      })
    }

    function syncExpression(): void {
      if (!controller)
        return
      const expression = fallbackExpression()
      if (props.rig.expressions[expression])
        controller.setExpression(expression)
    }

    function syncTheme(): void {
      controller?.setTheme({
        ...props.rig.theme,
        ...props.theme,
        background: props.theme?.background,
      })
    }

    onMounted(build)
    onBeforeUnmount(destroy)

    watch(() => props.expression, syncExpression)
    watch(() => props.theme, syncTheme, { deep: true })
    watch(
      () => [props.rig, props.trackPointer, props.respectReducedMotion],
      build,
    )

    expose<YunMascotExpose>({
      blink: () => controller?.blink(),
      lookAt: (x: number, y: number) => controller?.lookAt(x, y),
      reset: () => controller?.reset(),
      setExpression: (expression: string) => controller?.setExpression(expression),
      setTheme: (theme: MascotTheme) => controller?.setTheme(theme),
      get controller() {
        return controller
      },
    })

    return () => {
      const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = props.rig.viewBox
      const ratio = viewBoxWidth && viewBoxHeight
        ? viewBoxHeight / viewBoxWidth
        : 1
      const width = cssSize(props.size)
      const height = typeof props.size === 'number'
        ? cssSize(props.size * ratio)
        : `calc(${props.size} * ${ratio})`
      const style: StyleValue = {
        display: 'inline-grid',
        placeItems: 'center',
        width,
        height,
        padding: 0,
        border: 0,
        borderRadius: '24%',
        background: props.theme?.background,
        lineHeight: 0,
        color: 'inherit',
        verticalAlign: 'middle',
      }
      const artwork = h('span', {
        ref: canvas,
        class: 'yun-mascot__canvas',
        style: {
          display: 'block',
          width: '100%',
          height: '100%',
        },
      })

      if (props.clickToBlink) {
        return h('button', {
          type: 'button',
          class: 'yun-mascot yun-mascot--interactive',
          style: {
            ...style,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          },
          'aria-label': props.decorative ? props.ariaLabel : `${props.ariaLabel}，点击眨眼`,
          'data-yun-mascot-component': '',
          'data-view-box': `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`,
          onClick: () => controller?.blink(),
        }, artwork)
      }

      return h('span', {
        class: 'yun-mascot',
        style,
        role: props.decorative ? undefined : 'img',
        'aria-hidden': props.decorative ? 'true' : undefined,
        'aria-label': props.decorative ? undefined : props.ariaLabel,
        'data-yun-mascot-component': '',
        'data-view-box': `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`,
      }, artwork)
    }
  },
})

export default YunMascot
