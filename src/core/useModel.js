/* import React from 'react' */
import { useSelector, useDispatch } from 'react-redux'

const useWallet = () => {
  const G = useSelector((state) => state)
  const dispatch = useDispatch()
  const update = (payload) => dispatch(Slice.actions.update(payload))

  return {
    ...G,
    update,
    check,
    addNetwork,
    getPending,
    setPending,
    removePending,
    setTxs,
    connect,
    balance,
    bridgebalance,
    waitTransaction,
    approval,
    approve,
    /* depositToIcicb,  */ deposit,
  }
}

export default useWallet
