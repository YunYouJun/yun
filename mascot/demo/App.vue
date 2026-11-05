<script setup lang="ts">
import type { MascotRig, MascotTheme } from '@yunyoujun/mascot'
import type { YunMascotExpose } from '@yunyoujun/mascot/vue'
import { computed, ref } from 'vue'
import { xiaoyunCloud } from '@yunyoujun/mascot'
import { YunMascot } from '@yunyoujun/mascot/vue'

const expressions = [
  { key: 'idle', label: '放空' },
  { key: 'thinking', label: '思考' },
  { key: 'happy', label: '开心' },
  { key: 'shy', label: '害羞' },
  { key: 'error', label: '心虚' },
] as const

const palettes = [
  {
    key: 'brand',
    label: '小云蓝',
    colors: { body: '#4B86C8', eye: '#FFFFFF', blush: '#FFB3C0' },
  },
  {
    key: 'cloud',
    label: '云朵白',
    colors: { body: '#F7FAFF', eye: '#4B86C8', blush: '#FFB3C0' },
  },
  {
    key: 'moon',
    label: '月光',
    colors: { body: '#A9C7FF', eye: '#14233E', blush: '#FF9FB2' },
  },
] as const

const expression = ref('idle')
const palette = ref('brand')
const mascot = ref<YunMascotExpose>()

const currentPalette = computed(() => {
  return palettes.find(item => item.key === palette.value) ?? palettes[0]
})

const theme = computed<MascotTheme>(() => ({ ...currentPalette.value.colors }))
const currentExpression = computed(() => {
  return expressions.find(item => item.key === expression.value) ?? expressions[0]
})

const perspectivePreviews = [-26, 7, 38].map((yaw, index) => {
  const rig: MascotRig = {
    ...xiaoyunCloud,
    id: `xiaoyun-preview-${index}`,
    motion: {
      ...xiaoyunCloud.motion,
      baseYaw: yaw,
      basePitch: index === 1 ? 4 : 6,
    },
  }
  return {
    rig,
    index: String(index + 1).padStart(2, '0'),
    label: ['向左看', '正前方', '向右看'][index],
    note: ['远侧眼收窄', '双眼近似对称', '近侧眼更完整'][index],
  }
})
</script>

<template>
  <div class="page">
    <header class="topbar">
      <a class="wordmark" href="#top" aria-label="小云吉祥物首页">
        <span class="wordmark__cloud" aria-hidden="true">
          <i />
          <i />
        </span>
        <span>小云 <b>mascot</b></span>
      </a>
      <div class="topbar__meta">
        <span class="status-dot" />
        <span>pointer-aware / v0.1</span>
      </div>
    </header>

    <main id="top">
      <section class="hero">
        <div class="hero__copy">
          <p class="eyebrow">
            <span>SMALL MOTION, BIG FEELING</span>
          </p>
          <h1>
            会跟着你<br />
            移动的<em>小云。</em>
          </h1>
          <p class="lede">
            一双落在虚拟球面上的眼睛，加一点弹簧滞后。不是 Live2D，
            也不需要整张图重绘，却会让一个简单的 SVG 突然“活”起来。
          </p>

          <div class="feature-line" aria-label="动效特征">
            <span>球面双眼</span>
            <span>无嘴巴</span>
            <span>害羞才腮红</span>
          </div>

          <div class="control-block">
            <div class="control-label">
              <span>让她有点情绪</span>
              <span class="control-value">{{ currentExpression.label }}</span>
            </div>
            <div class="expression-picker" role="group" aria-label="小云的表情">
              <button
                v-for="item in expressions"
                :key="item.key"
                type="button"
                :class="{ active: expression === item.key }"
                :aria-pressed="expression === item.key"
                @click="expression = item.key"
              >
                {{ item.label }}
              </button>
            </div>
          </div>

          <div class="control-block control-block--split">
            <div>
              <div class="control-label">
                <span>换个颜色</span>
              </div>
              <div class="palette-picker" role="group" aria-label="小云的颜色">
                <button
                  v-for="item in palettes"
                  :key="item.key"
                  type="button"
                  class="palette-button"
                  :class="{ active: palette === item.key }"
                  :aria-label="item.label"
                  :aria-pressed="palette === item.key"
                  @click="palette = item.key"
                >
                  <span :style="{ background: item.colors.body }" />
                </button>
              </div>
            </div>
            <button class="blink-button" type="button" @click="mascot?.blink()">
              眨眨眼
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>

        <div class="mascot-stage">
          <div class="stage-grid" aria-hidden="true" />
          <div class="orbit orbit--wide" aria-hidden="true" />
          <div class="orbit orbit--tight" aria-hidden="true" />
          <span class="stage-pin stage-pin--top">sphere projection</span>
          <span class="stage-pin stage-pin--left">spring follow</span>
          <span class="stage-pin stage-pin--right">no mouth</span>

          <div class="hero-mascot">
            <YunMascot
              ref="mascot"
              :size="320"
              :theme="theme"
              :expression="expression"
              aria-label="正在跟随鼠标的小云"
            />
          </div>

          <div class="stage-footer">
            <span class="stage-footer__hint">
              <i aria-hidden="true" />
              移动鼠标
            </span>
            <span class="stage-footer__line" />
            <span>{{ currentPalette.label }}</span>
          </div>
        </div>
      </section>

      <section class="perspective">
        <div class="section-heading">
          <p class="eyebrow"><span>SPHERICAL DEPTH</span></p>
          <h2>同一个脑袋，三个视角</h2>
          <p>
            眼睛没有直接做平面缩放，而是绕头部中心转动。靠近镜头的一侧更宽，
            远离镜头的一侧变窄、倾斜，并自然滑进脸部轮廓。
          </p>
        </div>

        <div class="perspective-grid">
          <article
            v-for="preview in perspectivePreviews"
            :key="preview.rig.id"
            class="perspective-card"
          >
            <span class="perspective-card__index">{{ preview.index }}</span>
            <div class="perspective-card__mascot">
              <YunMascot
                :rig="preview.rig"
                :theme="theme"
                :expression="expression"
                :size="132"
                :track-pointer="false"
                decorative
              />
            </div>
            <div class="perspective-card__copy">
              <strong>{{ preview.label }}</strong>
              <span>{{ preview.note }}</span>
            </div>
          </article>
        </div>
      </section>

      <section class="principles">
        <article>
          <span class="principle-number">01</span>
          <h3>眼睛在球上</h3>
          <p>
            两只眼沿虚拟球面分布，偏航和俯仰一起决定位置、切线、厚度与遮挡。
          </p>
        </article>
        <article>
          <span class="principle-number">02</span>
          <h3>头部慢半拍</h3>
          <p>
            视线用弹簧追指针，头部用另一条缓动曲线跟随，形成轻微甩动和回弹。
          </p>
        </article>
        <article>
          <span class="principle-number">03</span>
          <h3>情绪只用眼睛</h3>
          <p>
            去掉嘴巴后，只靠眼睑比例、视线和害羞腮红表达情绪，留白反而更耐看。
          </p>
        </article>
      </section>

      <section class="usage">
        <div class="usage__copy">
          <p class="eyebrow"><span>DROP-IN</span></p>
          <h2>带走的是机制，不只是小云</h2>
          <p>
            核心包不依赖框架，Vue 只是可选适配层。换掉 rig 里的身体、眼睛路径、
            球面半径和表情参数，就能复用到另一个吉祥物。
          </p>
          <ul>
            <li>不要求 React / Vue，原生 DOM 可直接创建</li>
            <li>支持主题、表情、手动眨眼与程序化视线</li>
            <li>遵循 <code>prefers-reduced-motion</code>，失焦自动暂停</li>
            <li>SVG 保持在页面内，可缩放且没有位图清晰度损失</li>
          </ul>
        </div>

        <div class="code-card">
          <div class="code-card__bar">
            <span>vanilla.ts</span>
            <span>~1 KB setup</span>
          </div>
          <pre><code><span class="code-keyword">import</span> { createMascot, xiaoyunCloud } <span class="code-keyword">from</span> <span class="code-string">'@yunyoujun/mascot'</span>

<span class="code-comment">// 任意容器，给一个宽度即可</span>
<span class="code-keyword">const</span> mascot = createMascot(root, {
  rig: xiaoyunCloud,
  expression: <span class="code-string">'shy'</span>,
})

<span class="code-comment">// 也可以让别的东西驱动视线</span>
mascot.lookAt(<span class="code-number">0.7</span>, <span class="code-number">-0.2</span>)
mascot.blink()</code></pre>
        </div>
      </section>
    </main>

    <footer>
      <span>小云角色原设：Ai_Floverse</span>
      <span>YunYouJun / yun · mascot</span>
    </footer>
  </div>
</template>
