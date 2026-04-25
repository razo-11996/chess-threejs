import CanvasScene from './components/scene/CanvasScene'
import BoardHelpOverlay from './components/layout/BoardHelpOverlay'
import GameSidebar from './components/layout/GameSidebar'

export default function App() {
  return (
    <div className="flex h-full w-full min-h-0 flex-col sm:flex-row">
      <div className="relative min-h-0 min-w-0 flex-1">
        <CanvasScene />
        <BoardHelpOverlay />
      </div>
      <GameSidebar />
    </div>
  )
}
