import { IconProps } from '@/app/utils/Interface/IconProps'

const IconSave = (props: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.size ?? '18'} height={props.size ?? '18'} className={props.className} viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z" /></svg>
    )
}

export default IconSave