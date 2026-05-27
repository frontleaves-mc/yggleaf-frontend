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
      subtitle="用更接近实况的视角展示生存、探索和社区据点。"
    >
      <StaggerContainer className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {galleryImages.map((img, index) => (
          <StaggerItem
            key={img.src}
            className={index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
          >
            <div className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card will-change-transform">
              <img
                src={img.src}
                alt={img.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="font-heading text-sm font-semibold text-white">
                  {img.title}
                </h3>
                <p className="mt-1 text-xs text-white/70">{img.desc}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </LandingSection>
  )
}

export { GallerySection }
