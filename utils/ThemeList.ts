import { ThemeOption } from "@/Interface/ThemeOption";
import { andromeda } from "@uiw/codemirror-theme-andromeda";
import { basicDark, basicLight } from '@uiw/codemirror-theme-basic';
import { copilot } from '@uiw/codemirror-theme-copilot';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { gruvboxDark, gruvboxLight } from '@uiw/codemirror-theme-gruvbox-dark';
import { materialDark, materialLight } from '@uiw/codemirror-theme-material';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { noctisLilac } from '@uiw/codemirror-theme-noctis-lilac';
import { sublime } from '@uiw/codemirror-theme-sublime';
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { xcodeDark, xcodeLight } from "@uiw/codemirror-theme-xcode";
import { Extension } from "@uiw/react-codemirror";

const themes: { [key: string]: Extension } = {
    'Andromeda': andromeda,
    'Basic Dark': basicDark,
    'Basic Light': basicLight,
    'Copilot': copilot,
    'Dracula': dracula,
    'Github Dark': githubDark,
    'Github Light': githubLight,
    'Gruvbox Dark': gruvboxDark,
    'Gruvbox Light': gruvboxLight,
    "Material Dark": materialDark,
    'Material Light': materialLight,
    'Monokai': monokai,
    'Noctis': noctisLilac,
    'Sublime': sublime,
    'Tokyo Night Storm': tokyoNightStorm,
    'Vs Code Dark': vscodeDark,
    'Vs Code Light': vscodeLight,
    'Xcode Dark': xcodeDark,
    'Xcode Light': xcodeLight,
}


export const ThemeList: ThemeOption[] = [
    { label: "Andromeda", type: "dark", isDefault: true },
    { label: "Basic Dark", type: "dark" },
    { label: "Basic Light", type: "light" },
    { label: "Copilot", type: "dark" },
    { label: "Dracula", type: "dark" },
    { label: "Github Dark", type: "dark" },
    { label: "Github Light", type: "light" },
    { label: "Gruvbox Dark", type: "dark", },
    { label: "Gruvbox Light", type: "light" },
    { label: "Material Dark", type: "dark" },
    { label: "Material Light", type: "light" },
    { label: "Monokai", type: "dark", },
    { label: "Noctis", type: "light", isDefault: true },
    { label: "Sublime", type: "dark", },
    { label: "Tokyo Night Storm", type: "dark", },
    { label: "Vs Code Dark", type: "dark" },
    { label: "Vs Code Light", type: "light" },
    { label: "Xcode Dark", type: "dark" },
    { label: 'Xcode Light', type: "light" },
]

export function getEditorTheme(mode: string, themeName?: string): Extension {
    if (themeName && Object.keys(themes).includes(themeName)) {
        return themes[themeName]
    } else {
        if (mode === 'dark') {
            return andromeda
        } else {
            return noctisLilac
        }
    }
}