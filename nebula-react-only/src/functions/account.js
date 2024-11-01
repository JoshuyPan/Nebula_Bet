import { setAccount, setClient } from "../store/betting_store"

export const loadAccount = async (account ,dispatch) => {
    // the betting function here.
    const address = account.address;
    dispatch(setAccount(address))

return address;
}
export const loadClient = async (client, dispatch) => {
    // the betting function here.
    const clientInfo = client;
    dispatch(setClient(clientInfo))

return clientInfo;
}