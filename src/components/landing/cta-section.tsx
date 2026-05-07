import { useState } from 'react'
import { motion } from 'motion/react'
import { LandingButton } from '#/components/landing/landing-primitives'
import { Copy, Check, ArrowRight } from 'lucide-react'
import { landingHeroVariants } from '#/lib/motion-presets'

const QQ_GROUP = '805030578'

function CtaSection() {
  const [copied, setCopied] = useState(false)

  const copyQQ = () => {
    navigator.clipboard.writeText(QQ_GROUP)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 landing-gradient opacity-90" />
      <div className="absolute inset-0 mc-grid-pattern opacity-10" />

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

      <motion.div
        className="relative z-10 text-center px-4 max-w-3xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={landingHeroVariants}
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
          加入锋楪的冒险
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
          与数百名玩家一起探索、建造、冒险。加入我们的社区，开启属于你的
          Minecraft 之旅！
        </p>

        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 mb-8 border border-white/20">
          <span className="text-white/70 text-sm">QQ 群：</span>
          <span className="text-white font-mono text-lg font-bold">
            {QQ_GROUP}
          </span>
          <button
            type="button"
            onClick={copyQQ}
            className="ml-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label={copied ? '已复制' : '复制群号'}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-300" />
            ) : (
              <Copy className="h-4 w-4 text-white/70" />
            )}
          </button>
        </div>

        <div>
          <a
            href={`https://qm.qq.com/q/${QQ_GROUP}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LandingButton
              variant="ghost"
              size="lg"
              className="bg-white/15 text-white hover:bg-white/25 border border-white/30"
            >
              立即加入
              <ArrowRight className="h-4 w-4 ml-1" />
            </LandingButton>
          </a>
        </div>
      </motion.div>
    </section>
  )
}

export { CtaSection }
