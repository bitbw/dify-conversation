import type { FC } from 'react'
import { memo } from 'react'
import { Theme } from '@/types/app'
import useTheme from '@/hooks/use-theme'
import Button from '../base/button'

type HeaderProps = {
  title: string
  isMobile: boolean
}
const Header: FC<HeaderProps> = ({
  title,
  isMobile,
}) => {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    setTheme(theme === Theme.dark ? Theme.light : Theme.dark)
  }
  
  return (
    <div
      className={`
      sticky top-0 flex items-center px-8 h-16 bg-white/80 text-base font-medium 
      text-gray-900 border-b-[0.5px] border-b-gray-100 backdrop-blur-md z-10
      ${isMobile && '!h-12'}
      dark:bg-gray-900/80 dark:text-gray-100 dark:border-b-gray-800
      `}
    >
      {title}

      <Button onClick={toggleTheme} className="ml-auto">
        {theme === Theme.dark ? '切换到亮色主题' : '切换到暗色主题'}
      </Button>
    </div>
  )
}

export default memo(Header)
