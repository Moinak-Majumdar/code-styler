import ContentProps from "@/Interface/ContentProps";
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
        setSearchedToken: (state, action: PayloadAction<string | undefined>) => {
            state.token = action.payload;
        },
        clearContentSlate: (state) => {
            state.css = ""
            state.html = ""
            state.token = undefined
            state._id = undefined
        }
    }
})

export default contentSlice;
export const { setCssContent, setHtmlContent, setSearchedToken, clearContentSlate } = contentSlice.actions