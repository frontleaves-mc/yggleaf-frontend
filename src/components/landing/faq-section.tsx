import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { LandingSection } from '#/components/landing/landing-section'
import { cn } from '#/lib/utils'

const faqs = [
  {
    q: '如何加入服务器？',
    a: '服务器地址为 mc.frontleaves.com，支持 Minecraft Java Edition 1.21.1。加入 QQ 群 805030578 后按群公告完成白名单申请。',
  },
  {
    q: '需要安装模组吗？',
    a: '服务器使用 Fabric 模组加载器，需要安装 Fabric Loader。具体模组列表和安装教程请查看 QQ 群内的公告。',
  },
  {
    q: '如何上传自定义皮肤？',
    a: '注册并登录锋楪官网后，在玩家中心进入皮肤管理，上传符合尺寸要求的 PNG 文件后即可预览和启用。',
  },
  {
    q: '服务器有哪些规则？',
    a: '请查看我们的社区规则页面，涵盖基本行为规范、建筑规则、交易规则等。违反规则将受到相应的处罚。',
  },
  {
    q: '如何联系管理员？',
    a: '可以通过 QQ 群 805030578 联系管理团队，也可以在游戏内使用 /help 命令寻求帮助。',
  },
  {
    q: '服务器支持哪些版本？',
    a: '目前服务器支持 Minecraft Java Edition 1.21.1 版本，使用 Fabric 模组加载器。',
  },
] as const

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  return (
    <div className="border-b border-border py-4 first:pt-0 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-none px-4 py-3 -mx-4 text-left transition-colors hover:bg-muted/50"
        aria-expanded={open}
      >
        <span className="font-medium transition-colors duration-200 group-hover:text-primary">
          {question}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: 'easeInOut',
            }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-sm leading-6 text-muted-foreground">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FaqSection() {
  return (
    <LandingSection
      id="faq"
      title="常见问题"
      subtitle="加入前最容易卡住的几个点。"
    >
      <div className="mx-auto max-w-3xl rounded-none border border-border/50 bg-card/80 p-6 backdrop-blur-sm md:p-8">
        {faqs.map((faq) => (
          <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </LandingSection>
  )
}

export { FaqSection }
