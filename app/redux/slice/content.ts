import ContentProps from "@/app/utils/Interface/ContentProps";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initial: ContentProps = {
    html: "",
    css: ""
}

const contentSlice = createSlice({
    name: 'contentSlice',
    initialState: initial,
    reducers: {
        setHtmlContent: (state, action: PayloadAction<string>) => {
            state.html = action.payload;
        },
        setCssContent: (state, action: PayloadAction<string>) => {
            state.css = action.payload;
        },
        setSearchedToken: (state, action: PayloadAction<string|undefined>) => {
            state.token = action.payload;
        },
        setContent: (state, action: PayloadAction<{ css: string, html: string }>) => {
            state.html = action.payload.html;
            state.css = action.payload.css;
        }
    }
})

export default contentSlice;
export const { setCssContent, setHtmlContent, setSearchedToken, setContent } = contentSlice.actions