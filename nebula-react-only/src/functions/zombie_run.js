// import new function.

export const loadPackagesMainnet = async (dispatch) => {
    dispatch(setNetwork("mainnet"))
    dispatch(setPackage(MAINNET_PACKAGE));
    dispatch(setNebulaPolice(MAINNET_NEBULA_POLICE))

return [MAINNET_PACKAGE, MAINNET_NEBULA_POLICE];
}