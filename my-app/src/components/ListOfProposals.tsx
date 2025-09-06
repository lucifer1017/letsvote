import POLLING_ABI from '../abi/Polling.json';
import { useReadContract } from 'wagmi';
import ProposalItems from './ProposalItems';

const POLLING_ADDRESS='0x5FbDB2315678afecb367f032d93F642f64180aa3';

const ListOfProposals = () => {
    const {data:proposalCount,isLoading, error}=useReadContract({
        address:POLLING_ADDRESS,
        abi:POLLING_ABI.abi,
        functionName:'getProposalCount'
    });
    
    if(isLoading)return <p>Loading proposals...</p>;
    if(error)return <p>{error.message}</p>;
    const count=proposalCount?Number(proposalCount):0;
  return (
    <div className="flex flex-col gap-2 justify-center">
        <h1 className='font-bold text-lg'>Proposals</h1>
        {count >0 ? (
            [...Array(count)].map((_,index)=><ProposalItems key={index} id={index} />)
        ):(
            <p className='font-semibold text-gray-600'>No Proposals yet!</p>
        ) }
    </div>
  )
}

export default ListOfProposals