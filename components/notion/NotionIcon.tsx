import { resolveNotionIconUrl } from './block-helpers'

interface NotionIconProps {
  icon: string
  className?: string
  size?: number
}

export function NotionIcon({ icon, className, size }: NotionIconProps) {
  const src = resolveNotionIconUrl(icon)

  if (src.startsWith('http')) {
    return (
      <img
        className={className}
        src={src}
        alt=""
        {...(size != null && { width: size, height: size })}
      />
    )
  }

  return (
    <span className={className} role="img" aria-label={icon}>
      {icon}
    </span>
  )
}
