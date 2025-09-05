import { QueryClient,QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from 'wagmi'
import { config } from '../config'
// import { WalletConnector } from "./components/WalletConnector"
import Wallet from "./components/Wallet"
import { ProposalsList } from "./components/ProposalsList"
import { AddProposalForm } from "./components/AddProposalForm"

const queryClient = new QueryClient()


function App() {
  

  return (
    <>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <div >
        {/* <WalletConnector/> */}
        <Wallet/>
        <ProposalsList/>
        <AddProposalForm/>
        </div>
        </QueryClientProvider>
         </WagmiProvider>
    </>
  )
}

export default App
