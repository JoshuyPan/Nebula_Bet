import { createSlice } from '@reduxjs/toolkit'

export const betting = createSlice({
    name: 'betting',
    initialState: {
        client: [],
        network: "devnet", //devnet by default, options:: "devnet" | "testnet" | "mainnet"
        account: null,
        bettingPackage: null,
        bettingPolice: null,
        betting: null,
    },
    reducers: {
        setClient: (state, action) => {
            state.client = action.payload
        },
        setNetwork: (state, action) => {
            state.network = action.payload
        },
        setAccount: (state, action) => {
            state.account = action.payload
        },
        setPackage: (state, action) => {
            state.bettingPackage = action.payload
        },
        setNebulaPolice: (state, action) => {
            state.bettingPolice = action.payload
        },
        setBet: (state, action) => {
            state.betting = action.payload
        },
        
    }
})

export const { setPackage, setBet, setAccount, 
    setNetwork, setClient, setNebulaPolice } = betting.actions;

export default betting.reducer;