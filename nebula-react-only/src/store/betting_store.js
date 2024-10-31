import { createSlice } from '@reduxjs/toolkit'

export const betting = createSlice({
    name: 'betting',
    initialState: {
        bettingPackage: null,
        betting: null,
    },
    reducers: {
        setPackage: (state, action) => {
            state.bettingPackage = action.payload
        },
        setBet: (state, action) => {
            state.betting = action.payload
        },
        
    }
})

export const { setPackage, setBet } = betting.actions;

export default betting.reducer;