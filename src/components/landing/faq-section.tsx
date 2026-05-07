import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { LandingSection } from '#/components/landing/landing-section'
import { cn } from '#/lib/utils'

const faqs = [
  {
    q: '如何加入服务器？',
    a: '服务器地址为 play.yggleaf.com，支持 Minecraft Java Edition 1.21.1 版本。加入我们的 QQ 群 805030578 获取详细教程和白名单申请。',
  },
  {
    q: '需要安装模组吗？',
    a: '服务器使用 Fabric 模组加载器，需要安装 Fabric Loader。具体模组列表和安装教程请查看 QQ 群内的公告。',
  },
  {
    q: '如何上传自定义皮肤？',
    a: '注册并登录锋楪官网后，在用户面板中找到"皮肤管理"功能，支持上传 64x64 或 64x32 的 PNG 格式皮肤文件。',
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

  return (
    <div className="border-b border-border/50 py-4 first:pt-0 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left gap-4 group"
        aria-expanded={open}
      >
        <span className="font-medium group-hover:text-primary transition-colors duration-200">
          {question}
        </span>
        <ChevronDown
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
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-sm text-muted-foreground leading-relaxed">
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
    <LandingSection id="faq" title="常见问题" subtitle="快速找到你需要的答案">
      <div className="max-w-3xl mx-auto rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 p-6 md:p-8">
        {faqs.map((faq) => (
          <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </LandingSection>
  )
}

export { FaqSection }
