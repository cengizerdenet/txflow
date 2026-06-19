import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Ticker } from './components/Ticker'
import { Footer } from './components/Footer'
import { useLive } from './lib/LiveContext'
import Overview from './pages/Overview'
import MarketsPage from './pages/MarketsPage'
import TradersPage from './pages/TradersPage'
import AccountPage from './pages/AccountPage'
import BlockPage from './pages/BlockPage'
import TxPage from './pages/TxPage'
import NotFound from './pages/NotFound'

export default function App() {
  const { markets } = useLive()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Ticker markets={markets} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/traders" element={<TradersPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/:address" element={<AccountPage />} />
          <Route path="/block/:height" element={<BlockPage />} />
          <Route path="/tx/:hash" element={<TxPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}
