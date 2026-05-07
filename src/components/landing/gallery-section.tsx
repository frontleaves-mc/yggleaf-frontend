import {
  StaggerContainer,
  StaggerItem,
} from '#/components/landing/landing-animate'
import { LandingSection } from '#/components/landing/landing-section'

// ─── Gallery Data ──────────────────────────────────────

const galleryImages = [
  {
    src: '/images/gallery/gallery-1.svg',
    title: '草方块世界',
    desc: '绿意盎然的生存世界',
  },
  {
    src: '/images/gallery/gallery-2.svg',
    title: '钻石洞穴',
    desc: '探索深邃的地下矿洞',
  },
  {
    src: '/images/gallery/gallery-3.svg',
    title: '下界要塞',
    desc: '烈焰与岩浆的冒险',
  },
  {
    src: '/images/gallery/gallery-4.svg',
    title: '金色日落',
    desc: '绝美的游戏风景',
  },
  {
    src: '/images/gallery/gallery-5.svg',
    title: '村庄生活',
    desc: '与村民互动交易',
  },
  {
    src: '/images/gallery/gallery-6.svg',
    title: '附魔工坊',
    desc: '打造强力附魔装备',
  },
] as const

// ─── Component ─────────────────────────────────────────

/**
 * 截图画廊区块 — 响应式图片网格 + 悬停交互
 *
 * - 移动端单列 → 平板双列 → 桌面三列
 * - 悬停时图片放大 + 渐变遮罩浮现标题描述
 * - StaggerContainer 实现交错入场动画
 */
function GallerySection() {
  return (
    <LandingSection
      id="gallery"
      title="服务器掠影"
      subtitle="探索锋楪的精彩世界"
    >
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryImages.map((img) => (
          <StaggerItem key={img.src}>
            <div className="group relative overflow-hidden rounded-xl border border-border/50 aspect-[4/3]">
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="font-heading font-semibold text-white">
                  {img.title}
                </h3>
                <p className="text-sm text-white/80">{img.desc}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </LandingSection>
  )
}

export { GallerySection }
