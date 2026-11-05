# 小云吉祥物动效

把 `BotMascot` 里的球面眼睛与弹簧跟随动效抽成了可复用的小包：

- 核心运行时是原生 DOM，不依赖 Vue、React 或 Canvas。
- 小云是默认 preset；身体、眼睛、球面半径、表情和动效参数都可替换。
- 眼睛沿虚拟球面运动，因此转身时会同时出现位移、收窄、倾斜、透明与裁切。
- 没有嘴巴；腮红只由表情数据开启，默认 `shy` 出现。
- 支持眨眼、空闲视线游移、`prefers-reduced-motion`、失焦暂停与销毁清理。
- Vue 适配层是可选入口，不会污染原生核心包。

> 这是仓库内的 `0.1.0` 实现，尚未发布 npm 包。

包为 ESM-only，要求 Node.js `>=22.18.0`；Vue 适配层要求 Vue `>=3.5.0`。

## 快速开始

在 `mascot/` 目录安装并启动演示：

```bash
pnpm install
pnpm demo
```

演示默认在 <http://127.0.0.1:4173>。

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm demo:build
```

## 原生 DOM

给容器一个宽度即可。控制器会补上 `inline-block`、宽高比与 SVG。

```html
<div id="mascot" style="width: 160px"></div>
```

```ts
import { createMascot, xiaoyunCloud } from '@yunyoujun/mascot'

const root = document.querySelector<HTMLElement>('#mascot')
if (!root)
  throw new Error('Missing mascot root')

const mascot = createMascot(root, {
  rig: xiaoyunCloud,
  expression: 'idle',
})

mascot.setExpression('shy')
mascot.lookAt(0.8, -0.15)
mascot.blink()

// 页面或组件卸载时
mascot.destroy()
```

`lookAt(x, y)` 接收 `-1..1` 的归一化坐标。持续监听窗口指针是默认行为；不想要时传入 `trackPointer: false`。

## Vue

Vue 是可选 peer dependency，仅导入 `@yunyoujun/mascot/vue` 时才会用到。

```vue
<script setup lang="ts">
import type { YunMascotExpose } from '@yunyoujun/mascot/vue'
import { ref } from 'vue'
import { YunMascot } from '@yunyoujun/mascot/vue'

const mascot = ref<YunMascotExpose>()
</script>

<template>
  <YunMascot
    ref="mascot"
    :size="160"
    expression="shy"
    aria-label="小云"
    @blink="() => {}"
  />

  <button type="button" @click="mascot?.blink()">
    眨眨眼
  </button>
</template>
```

常用 props：

| Prop | 默认值 | 说明 |
| --- | --- | --- |
| `rig` | `xiaoyunCloud` | 吉祥物几何、主题与动效数据 |
| `expression` | rig 默认表情 | `idle` / `thinking` / `happy` / `shy` / `error` |
| `theme` | rig 主题 | 可覆盖 `body`、`eye`、`blush`、`background` |
| `size` | `96` | 数字按 px，也可传任意 CSS 长度 |
| `clickToBlink` | `false` | 开启后渲染真正的 `button`，可键盘触发眨眼 |
| `trackPointer` | `true` | 是否跟随窗口指针 |
| `respectReducedMotion` | `true` | 是否遵循系统减弱动效偏好 |
| `decorative` | `false` | 装饰性图片时从无障碍树隐藏 |
| `ariaLabel` | `小云吉祥物` | 非装饰模式下的替代文本 |

组件通过 `ref` 暴露 `blink()`、`lookAt()`、`reset()`、`setExpression()`、`setTheme()`。

## 替换成别的吉祥物

复制 [`src/presets/xiaoyun-cloud.ts`](https://github.com/YunYouJun/yun/blob/main/mascot/src/presets/xiaoyun-cloud.ts)，替换以下数据：

| 字段 | 用途 |
| --- | --- |
| `viewBox` | SVG 坐标范围 |
| `body` | 身体轮廓路径，同时用于眼睛裁切 |
| `eyes[].path` | 单只眼睛的原始路径 |
| `eyes[].center` | 该路径在 `viewBox` 中的中心点 |
| `sphereRadius` | 虚拟脸部球体半径，决定转身时的深度差 |
| `blush` | 可选腮红椭圆，只由表情开关控制 |
| `artworkTransform` | 可选的整体缩放／定位 |
| `expressions` | `squint` 与 `blush` 的数值 |
| `theme` | 身体、眼睛、腮红默认颜色 |
| `motion` | 视线范围、弹簧、头部滞后、抖动、眨眼与空闲参数 |

眼睛路径必须先以自身中心为原点归一化，控制器才能在投影后把它放回球面。若角色的眼睛不是左右横向排布，需要相应调整 `geometry.ts` 中的脸部基准。

## 设计说明

动效灵感来自 Grok Bot 公开设计文章中“平面角色拥有可转动眼睛”的空间感，但没有复用它的品牌造型或实现代码。小云云朵图形沿用 `el-bot` 中的品牌资产；球面投影、弹簧、表达式和 Vue 适配为独立实现。

球面投影的关键不是单纯把眼睛缩小，而是让两个眼位绕同一虚拟球体旋转。近侧眼睛的切向量更长、深度更大；远侧则更短、更斜，并逐渐贴近身体边缘。这样头部只做很小的位移，观感就会有明显的近大远小。

## 许可与署名

小云角色原设画师：[Ai_Floverse](https://twitter.com/Ai_Floverse)。角色身份与设定见仓库中的 [`set.md`](https://github.com/YunYouJun/yun/blob/main/set.md)。

当前代码、默认小云 rig 与演示页跟随仓库整体的 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可。组件已经按“引擎代码 / 角色数据”分层，但若要单独将引擎再许可为 MIT 等代码协议，需要作者明确确认；在确认前不要直接把角色素材与代码拆成不同许可发布。
