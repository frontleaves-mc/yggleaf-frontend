export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-border/60 bg-transparent px-4 pb-10 pt-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 sm:flex-row sm:justify-between">
        {/* 左侧: 品牌 */}
        <div className="flex items-center gap-2.5">
          {/* 小方块 Logo */}
          <span
            className="flex h-6 w-6 items-center justify-center rounded-sm bg-gradient-to-br from-primary to-primary"
            style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
          >
            <span className="text-[9px] font-bold text-white leading-none select-none">Y</span>
          </span>
          <span className="text-[13px] font-medium text-muted-foreground">
            &copy; {year} Yggleaf
          </span>
        </div>

        {/* 右侧: 链接 */}
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-[12px] text-muted-foreground no-underline transition-colors hover:text-primary"
          >
            首页
          </a>
          <span className="h-3 w-px bg-border" />
          <a
            href="/admin"
            className="text-[12px] text-muted-foreground no-underline transition-colors hover:text-primary"
          >
            管理后台
          </a>
        </div>
      </div>
    </footer>
  )
}
