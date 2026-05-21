import { useState } from 'react'
import { motion } from 'motion/react'
import { Copy, Check, ArrowRight, LogIn } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
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
    <section className="relative overflow-hidden border-y border-border py-24 text-white">
      {/* Intentionally dark background regardless of theme — CTA section needs high-contrast dark base */}
      <div className="absolute inset-0 bg-[oklch(0.17_0.018_238)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
      <div className="absolute inset-0 bg-noise opacity-40" />
      <div className="absolute inset-0 opacity-10 mc-grid-pattern" />
      <motion.div
        className="relative z-10 mx-auto flex max-w-(--page-max) flex-col items-center px-4 text-center sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={landingHeroVariants}
      >
        <h2 className="max-w-3xl font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          准备好进入锋楪了吗
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
          先加入社区完成白名单申请，再登录玩家中心配置账号和外观资源。管理员也可以从同一入口进入后台。
        </p>

        <div className="mt-8 flex w-full max-w-md items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left backdrop-blur-md">
          <span className="text-sm text-white/70">QQ 群</span>
          <span className="flex-1 font-mono text-lg font-semibold text-white">
            {QQ_GROUP}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={copyQQ}
            className="cursor-pointer text-white hover:bg-white/15 hover:text-white"
            aria-label={copied ? '已复制' : '复制群号'}
          >
            <span aria-live="polite" className="sr-only">
              {copied ? '已复制到剪贴板' : ''}
            </span>
            {copied ? <Check /> : <Copy />}
          </Button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            asChild
            className="h-11 bg-white text-[oklch(0.17_0.018_238)] hover:bg-white/90"
          >
            <Link to="/login" search={{ callback: '/user/dashboard' } as any}>
              <LogIn data-icon="inline-start" />
              登录玩家中心
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="h-11 border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"
          >
            <a
              href={`https://qm.qq.com/q/${QQ_GROUP}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="加入 QQ 群（在新窗口打开）"
            >
              立即加入
              <ArrowRight data-icon="inline-end" />
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}

export { CtaSection }
