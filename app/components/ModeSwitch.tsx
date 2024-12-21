"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch } from "@/redux/hooks"
import { ThemeList } from "@/utils/ThemeList"
import { changeEditorTheme } from "@/redux/slice/editorThemes"

export function ModeSwitch() {
    const { setTheme, resolvedTheme } = useTheme()
    const dispatch = useAppDispatch()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="outline-none">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => {
                        setTheme("light")
                        const theme = ThemeList.find(t => t.type === 'light' && t.isDefault === true)
                        if (theme) {
                            dispatch(changeEditorTheme(theme))
                        }
                    }}
                >
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        setTheme("dark")
                        const theme = ThemeList.find(t => t.type === 'dark' && t.isDefault === true)
                        if (theme) {
                            dispatch(changeEditorTheme(theme))
                        }
                    }}
                >
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        setTheme("system")
                        if (resolvedTheme) {
                            const theme = ThemeList.find(t => t.type === resolvedTheme && t.isDefault === true)
                            if (theme) {
                                dispatch(changeEditorTheme(theme))
                            }
                        }
                    }}
                >
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
