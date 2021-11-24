import { useEffect, useState } from 'react'
import useMangoStore from '../stores/useMangoStore'
import { useOpenOrders } from '../hooks/useOpenOrders'
import usePerpPositions from '../hooks/usePerpPositions'
import OpenOrdersTable from './OpenOrdersTable'
import BalancesTable from './BalancesTable'
import PositionsTable from './PerpPositionsTable'
import TradeHistoryTable from './TradeHistoryTable'
// import FeeDiscountsTable from './FeeDiscountsTable'
import ManualRefresh from './ManualRefresh'
import Tabs from './Tabs'
import FeeDiscountsTable from './FeeDiscountsTable'

const TABS = [
  'Balances',
  'Orders',
  'Positions',
  'Trade History',
  'Fee Discount',
]

const UserInfoTabs = ({ activeTab, setActiveTab }) => {
  const openOrders = useOpenOrders()
  const { openPositions } = usePerpPositions()
  const connected = useMangoStore((s) => s.connection.current)
  const mangoAccount = useMangoStore((s) => s.selectedMangoAccount.current)
  const handleTabChange = (tabName) => {
    setActiveTab(tabName)
  }

  return (
    <div className="relative">
      <Tabs
        activeTab={activeTab}
        onChange={handleTabChange}
        showCount={
          openOrders && openPositions
            ? [
                { tabName: 'Orders', count: openOrders.length },
                { tabName: 'Positions', count: openPositions.length },
              ]
            : null
        }
        tabs={TABS}
      />
      {connected && mangoAccount ? (
        <div className="absolute right-0 top-0">
          <ManualRefresh />
        </div>
      ) : null}
    </div>
  )
}

const TabContent = ({ activeTab }) => {
  switch (activeTab) {
    case 'Orders':
      return <OpenOrdersTable />
    case 'Balances':
      return <BalancesTable />
    case 'Trade History':
      return <TradeHistoryTable numTrades={100} />
    case 'Positions':
      return <PositionsTable />
    case 'Fee Discount':
      return <FeeDiscountsTable />
    default:
      return <BalancesTable />
  }
}

const UserInfo = () => {
  const marketConfig = useMangoStore((s) => s.selectedMarket.config)
  const isPerpMarket = marketConfig.kind === 'perp'
  const connected = useMangoStore((s) => s.wallet.connected)
  const [activeTab, setActiveTab] = useState('')

  useEffect(() => {
    isPerpMarket ? setActiveTab(TABS[2]) : setActiveTab(TABS[0])
  }, [isPerpMarket])

  return (
    <div className={!connected ? 'filter blur-sm' : null}>
      <UserInfoTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabContent activeTab={activeTab} />
    </div>
  )
}

export default UserInfo
