import { useConnect,useAccount,useDisconnect } from "wagmi";


const Wallet = () => {
    const {address,isConnected}=useAccount();
    const {connect,connectors}=useConnect();
    const {disconnect}=useDisconnect();

  return (
    <div className="flex items-center w-1/2 justify-center shadow-2xl p-2 my-10 mx-auto border-2 border-black rounded-lg">
        {!isConnected ?(
            <button className="p-2 m-2 shadow-2xl text-white bg-green-600 rounded-lg cursor-pointer"
            onClick={()=>connect({connector:connectors[0]})}>
                Connect Wallet
                </button>
        ):(
            <div className="flex flex-col items-center justify-center">
                <span className="font-semibold font-stretch-50%">{address}</span>
                <button className="cursor-pointer p-2 m-2 text-white border-2 bg-red-600 rounded-lg font-sans"
                onClick={()=>disconnect()}
                >Disconnect
                </button>
            </div>
        )}

    </div>
  )
}

export default Wallet