"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { changeEditorTheme } from "@/redux/slice/editorThemes"
import { ThemeList } from "@/utils/ThemeList"
import { Check, ChevronsUpDown } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"

export function EditorThemes() {
    const [open, setOpen] = useState(false)
    const { resolvedTheme } = useTheme()
    const { selectedTheme } = useAppSelector(state => state.editorThemeSlice)
    const dispatch = useAppDispatch()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="dark:border-slate-800">
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {!!selectedTheme
                        ? selectedTheme.label
                        : "Select editor theme..."
                    }
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 dark:border-green-800">
                <Command>
                    <CommandInput placeholder="Search editor theme..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No theme found.</CommandEmpty>
                        <CommandGroup>
                            {ThemeList.filter((t) => t.type === resolvedTheme).map((theme) => (
                                <CommandItem
                                    key={theme.label}
                                    value={theme.label}
                                    onSelect={() => {
                                        dispatch(changeEditorTheme(theme))
                                        setOpen(false)
                                    }}
                                >
                                    {theme.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            selectedTheme?.label === theme.label ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}