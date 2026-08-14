// ─── Gully Radio — App Root ────────────────────────────────────
// UI implementation begins in Phase 2.
// This file wires up routing and global providers.

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">🎙️ Gully Radio</h1>
        <p className="text-gray-400 text-lg">
          Frontend scaffold running on{' '}
          <span className="text-purple-400 font-mono">localhost:5173</span>
        </p>
        <p className="text-gray-600 text-sm">Phase 1 — Skeleton only. UI coming in Phase 2.</p>
      </div>
    </div>
  )
}

export default App
