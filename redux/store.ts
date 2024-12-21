import { configureStore } from '@reduxjs/toolkit'
import contentSlice from './slice/content';
import editorThemeSlice from './slice/editorThemes';


export const store = configureStore({
    reducer: {
        contentSlice: contentSlice.reducer,
        editorThemeSlice: editorThemeSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

