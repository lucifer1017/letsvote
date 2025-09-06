import { useReadContract } from 'wagmi'
import POLLING_ABI from '../abi/Polling.json'
import  ProposalItems  from './ProposalItems'

const POLLING_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export function ProposalsList() {
  // Get number of proposals
  const { data: proposalCount, isLoading, error } = useReadContract({
    address: POLLING_ADDRESS,
    abi: POLLING_ABI.abi,
    functionName: 'getProposalCount',
  });

  if (isLoading) return <p>Loading proposals…</p>
  if (error) return <p className="text-red-600">⚠️ {error.message}</p>

  const count = proposalCount ? Number(proposalCount) : 0

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Proposals</h2>
      {count > 0 ? (
        [...Array(count)].map((_, i) => <ProposalItems key={i} id={i} />)
      ) : (
        <p className="text-sm text-gray-600">No proposals yet.</p>
      )}
    </div>
  )
}
