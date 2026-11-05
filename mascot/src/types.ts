export interface MascotEye {
  /** SVG path in the rig's viewBox coordinate system. */
  path: string
  /** Eye centroid used to normalize the path before projection. */
  center: readonly [number, number]
}

export interface MascotBlushMark {
  cx: number
  cy: number
  rx: number
  ry: number
}

export interface MascotExpression {
  /** Vertical eye scale. 1 is fully open. */
  squint?: number
  /** Blush opacity from 0 to 1. */
  blush?: number
}

export interface MascotRigTheme {
  body: string
  eye: string
  blush: string
}

export interface MascotTheme extends Partial<MascotRigTheme> {
  /** CSS color exposed as --mascot-background for optional host styling. */
  background?: string
}

export interface MascotSpring {
  stiffness?: number
  damping?: number
}

export interface MascotMotion {
  /** Resting head yaw in degrees. */
  baseYaw?: number
  /** Resting head pitch in degrees. */
  basePitch?: number
  /** Additional yaw available in each pointer direction. */
  yawRange?: number
  /** Additional pitch available in each pointer direction. */
  pitchRange?: number
  /** Horizontal head travel as a fraction of the viewBox width. */
  headX?: number
  /** Vertical head travel as a fraction of the viewBox height. */
  headY?: number
  /** Head roll contributed by gaze, in degrees. */
  headRoll?: number
  /** Additional head roll contributed by pointer travel, in degrees. */
  headRollLag?: number
  /** Horizontal body squash at a 90 degree head turn. */
  squashX?: number
  /** Rotation origin in viewBox coordinates. */
  pivot?: readonly [number, number]
  spring?: MascotSpring
  /** Pointer distances that map to the edge of the gaze. */
  pointer?: { x?: number, y?: number }
  blink?: {
    interval?: readonly [number, number]
    duration?: number
    closedScale?: number
  }
  idle?: {
    initial?: readonly [number, number]
    interval?: readonly [number, number]
    pause?: readonly [number, number]
    reach?: readonly [number, number]
  }
}

export interface MascotRig {
  id: string
  viewBox: readonly [number, number, number, number]
  body: string
  eyes: readonly [MascotEye, MascotEye]
  sphereRadius: number
  expressions: Record<string, MascotExpression>
  defaultExpression?: string
  theme: MascotRigTheme
  blush?: readonly MascotBlushMark[]
  artworkTransform?: string
  motion?: MascotMotion
}

export interface MascotOptions {
  rig: MascotRig
  expression?: string
  theme?: MascotTheme
  clickToBlink?: boolean
  respectReducedMotion?: boolean
  trackPointer?: boolean
  onBlink?: () => void
}

export interface MascotController {
  readonly root: HTMLElement
  readonly svg: SVGSVGElement
  readonly expression: string
  blink(): void
  /** Aims the gaze with normalized coordinates from -1 to 1. */
  lookAt(x: number, y: number): void
  reset(): void
  setExpression(expression: string): void
  setTheme(theme: MascotTheme): void
  destroy(): void
}
