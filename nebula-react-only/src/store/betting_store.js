import { createSlice } from '@reduxjs/toolkit'

export const betting = createSlice({
    name: 'betting',
    initialState: {
        account: null,
        bettingPackage: null,
        betting: null,
    },
    reducers: {
        setAccount: (state, action) => {
            state.bettingPackage = action.payload
        },
        setPackage: (state, action) => {
            state.bettingPackage = action.payload
        },
        setBet: (state, action) => {
            state.betting = action.payload
        },
        
    }
})

export const { setPackage, setBet, setAccount } = betting.actions;

export default betting.reducer;