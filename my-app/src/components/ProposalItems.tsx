import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import POLLING_ABI from '../abi/Polling.json'
interface ProposalItems{
    id:number
}
const POLLING_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const ProposalItems = ({id}:ProposalItems) => {
    const {data:proposal,isLoading}=useReadContract({
        address:POLLING_ADDRESS,
        abi:POLLING_ABI.abi,
        functionName:"proposals",
        args:[BigInt(id)]
    });
    const {writeContract,data:txHash,isPending,error}=useWriteContract();
    const {isLoading:isConfirming,isSuccess}=useWaitForTransactionReceipt({
        hash:txHash,
    });
    const [description,yesCount,noCount]=proposal as [string,bigint,bigint];

    const handleVote=(choice : number)=>{

        writeContract({
            address:POLLING_ADDRESS,
        abi:POLLING_ABI.abi,
        functionName:"vote",
        args:[BigInt(id),choice] // 1--> Yes, 2--> No
        });
    }
    if(isLoading)return <p>Loading proposal...</p>

  return (
    <div className="border-2 rounded-xl shadow-lg p-3 m-3 flex flex-col gap-2">
        <h2 className="font-bold">Proposal #{id+1}</h2>
        <h3>{description}</h3>
        <p className="text-sm text-gray-500">✅ Yes: {Number(yesCount)}</p>
        <p className="text-sm text-gray-500">❌ No: {Number(noCount)}</p>
        <div className="flex gap-2">
            <button className="p-2 m-1 border rounded-lg bg-green-600 text-white"
            onClick={()=>handleVote(1)}
            disabled={isPending || isConfirming}>
                Vote Yes

            </button>
            <button className="p-2 m-1 border rounded-lg bg-red-600 text-white"
            onClick={()=>handleVote(2)}
            disabled={isPending || isConfirming}>
                Vote No

            </button>

        </div>
        {isSuccess && <p className="text-sm text-green-500">Vote Confirmed</p>}
        {error && <p className="text-sm text-red-500">{error.message} </p>}
    </div>
  )
}

export default ProposalItems