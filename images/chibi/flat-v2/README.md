# 小云扁平 Q 版 V2

![小云扁平 Q 版 V2](./yun-alpha-flat-v2.png)

这是基于小云角色设定生成的扁平 Q 版衍生素材。2026-09-30 作者认可角色外观及本版 SVG 的复刻效果；动画控制与动作预设仍为试验版本。角色身份来源固定于 [set.md@81b359c](https://github.com/YunYouJun/yun/blob/81b359ca3bc49eb6a0c675d3f789bc727f65436b/set.md)，原设画师 Ai_Floverse。遵循本仓库 CC BY-NC-SA 4.0 说明。

| 文件 | 用途 |
| --- | --- |
| `yun-alpha-flat-v2.png` | 原始透明外观参考，1144×1375 |
| `yun-flat-v2.svg` | 作者认可的路径与渐变 SVG，保留原始几何 |
| `manifest.json` | 来源、衍生方式、文件哈希与状态 |
| `rig.json` | 眼睛／嘴巴原路径索引、闭合姿态、遮挡与头发位移场 |
| `motions/face-v2.json` | 9 秒轻晃、三次眨眼、两段静音口型预设 |

PNG 由 imagegen 参考原角色生成；SVG 由作者指定 Astra 模型复刻参考图。Rig 复用现有路径，闭眼／闭口曲线为代码绘制。不会把衍生素材署名为原设画师绘制。

素材与动作分开维护。SVG 仍包含 16,367 条路径，约 7.2 MB；为了保持已认可外观，没有进行几何简化。眼睛和嘴巴通过索引复用主 SVG，不再另存重复的路径片段，Rig 约 29 KB。头发使用局部位移场，属于局部控制，并非完整分层或全身骨骼。嘴部动作尚未与配音同步。

## Codex 调整与预览

小云动画工具位于 `YunYouJun/studio/packages/xiaoyun-motion`。两个仓库放在同级目录，在 Studio 中执行：

```bash
pnpm xiaoyun:motion validate
pnpm xiaoyun:motion preview
pnpm xiaoyun:motion build
```

默认读本目录的素材和 `motions/face-v2.json`；预览入口 `http://127.0.0.1:3033` 提供播放、定位、面部特写及折叠的微调渠道。作者通常只描述修改意图，由 Codex 修改动作 JSON，再重新载入预览。生成工程和视频留在 Studio 忽略目录或媒体存储，不放回此素材目录。

改变角色外观时另建版本；调整眨眼、口型或晃动只修改动作文件。来源哈希、身份设定和外观认可范围分别保留在 manifest 中。
