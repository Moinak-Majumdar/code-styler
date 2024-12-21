import { ThemeOption } from '@/Interface/ThemeOption';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initial: InitialValues = {
}

const editorThemeSlice = createSlice({
    name: 'editorThemeSlice',
    initialState: initial,
    reducers: {
        changeEditorTheme: (state, action: PayloadAction<ThemeOption>) => {
            state.selectedTheme = {
                label: action.payload.label,
                type: action.payload.type
            }
        }
    }
})

interface InitialValues {
    selectedTheme?: ThemeOption
}

export default editorThemeSlice
export const { changeEditorTheme } = editorThemeSlice.actions