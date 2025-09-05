import { useConnect,useAccount,useChainId,useDisconnect } from "wagmi"

const Wallet = () => {
    const {address,isConnected}=useAccount();
    const {connect,connectors}=useConnect();
    const {disconnect}=useDisconnect();
    // const chainId=useChainId();



  return (
    <div className="flex justify-center items-center p-4 my-10 mx-auto w-1/2 border-2 border-black shadow-2xl rounded-2xl">
        {!isConnected?
        (
            <button className="p-2 m-1 rounded-lg text-lg font-semibold bg-green-600 text-white cursor-pointer"
            onClick={()=>connect({connector:connectors[0]})}>
                Connect Wallet
            </button>
        ):(<div className="flex flex-col gap-2.5">
            <div className="flex items-center flex-col justify-center gap-2">
                <span className="font-bold font-sans">{address}</span>
                <button className="p-2 m-1 text-white bg-red-600 cursor-pointer rounded-lg"
                onClick={()=>disconnect()}>
                    Disconnect
                </button>

            </div>
            </div>)}

    </div>
  )
}

export default Wallet