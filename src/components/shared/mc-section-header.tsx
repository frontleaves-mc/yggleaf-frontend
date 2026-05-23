import { PageHeader } from '#/components/public/page-header'
import type { PageHeaderVariant } from '#/components/public/page-header'

type McSectionHeaderVariant = PageHeaderVariant

interface McSectionHeaderProps {
  title: string
  subtitle?: string
  label?: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: McSectionHeaderVariant
  className?: string
  children?: React.ReactNode
}

function McSectionHeader({
  title,
  subtitle,
  label,
  description,
  icon: Icon,
  variant = 'default',
  className,
  children,
}: McSectionHeaderProps) {
  return (
    <PageHeader
      title={title}
      subtitle={label ?? subtitle}
      description={description}
      icon={Icon}
      variant={variant}
      size="sm"
      className={className}
    >
      {children}
    </PageHeader>
  )
}

export { McSectionHeader }
export type { McSectionHeaderProps, McSectionHeaderVariant }
