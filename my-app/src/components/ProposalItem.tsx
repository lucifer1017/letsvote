import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import POLLING_ABI from '../abi/polling.json'

const POLLING_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

type ProposalItemProps = {
  id: number
}

export function ProposalItem({ id }: ProposalItemProps) {
  // Read the proposal details
  const { data: proposal, isLoading } = useReadContract({
    address: POLLING_ADDRESS,
    abi: POLLING_ABI.abi,
    functionName: 'proposals',
    args: [BigInt(id)],
  })

  // Prepare voting
  const { writeContract, data: txHash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const handleVote = (choice: number) => {
    writeContract({
      address: POLLING_ADDRESS,
      abi: POLLING_ABI.abi,
      functionName: 'vote',
      args: [BigInt(id), choice], // 1 = Yes, 2 = No
    })
  }

  if (isLoading) return <p>Loading proposal {id}…</p>

  const [description, yesCount, noCount] = proposal as [string, bigint, bigint]

  return (
    <div className="border rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <h3 className="font-semibold">Proposal #{id + 1}</h3>
      <p>{description}</p>
      <p className="text-sm text-gray-600">✅ Yes: {Number(yesCount)}</p>
      <p className="text-sm text-gray-600">❌ No: {Number(noCount)}</p>

      <div className="flex gap-2">
        <button
          onClick={() => handleVote(1)}
          disabled={isPending || isConfirming}
          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Vote Yes
        </button>
        <button
          onClick={() => handleVote(2)}
          disabled={isPending || isConfirming}
          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          Vote No
        </button>
      </div>

      {isSuccess && <p className="text-green-600 text-sm">Vote confirmed ✅</p>}
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  )
}
