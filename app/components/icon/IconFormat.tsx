import { IconProps } from '@/app/utils/Interface/IconProps'
import React from 'react'

const IconFormat = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size ?? '18'} height={props.size ?? '18'} className={props.className} viewBox="0 0 24 24"><path fill="currentColor" d="M15 15H3v2h12zm0-8H3v2h12zM3 13h18v-2H3zm0 8h18v-2H3zM3 3v2h18V3z" /></svg>
  )
}

export default IconFormat