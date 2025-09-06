import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import POLLING_ABI from '../abi/polling.json'

const POLLING_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export function AddProposalForm() {
  const [description, setDescription] = useState('')
  const { writeContract, data: txHash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return
    writeContract({
      address: POLLING_ADDRESS,
      abi: POLLING_ABI.abi,
      functionName: 'addProposal',
      args: [description],
    })
  }

  return (
    <div className="p-4  mt-2 mb-4 mx-2 border rounded-xl shadow-sm flex flex-col gap-3">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Proposal description"
        className="border p-2 rounded-lg"
      />
      <button
        onClick={handleSubmit}
        disabled={isPending || isConfirming}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {isPending ? 'Sending...' : isConfirming ? 'Confirming...' : 'Add Proposal'}
      </button>
      {isSuccess && <p className="text-sm text-green-600">✅ Proposal added!</p>}
      {error && <p className="text-sm text-red-600">⚠️ {error.message}</p>}
    </div>
  )
}
