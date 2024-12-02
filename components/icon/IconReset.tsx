import { IconProps } from '@/app/utils/Interface/IconProps'

const IconReset = (props: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.size ?? '18'} height={props.size ?? '18'} className={props.className} viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M4.854 2.146a.5.5 0 0 1 0 .708L3.707 4H9a4.5 4.5 0 1 1 0 9H5a.5.5 0 0 1 0-1h4a3.5 3.5 0 1 0 0-7H3.707l1.147 1.146a.5.5 0 1 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2a.5.5 0 0 1 .708 0" clipRule="evenodd" /></svg>
    )
}

export default IconReset