import { configureStore } from '@reduxjs/toolkit'
import contentSlice from './slice/content';


export const store = configureStore({
    reducer: {
        contentSlice: contentSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

