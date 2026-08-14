import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CinematicTransition } from './components/CinematicTransition'
import Header         from './components/Header'
import Hero           from './components/Hero'
import ExperiencePage from './pages/ExperiencePage'

/* ── Hero page (the landing screen) ──────────────────────────── */
function HeroPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
    </>
  )
}

/* ── App ──────────────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      {/*
        CinematicTransition wraps everything so its dark overlay
        persists across route changes and auto-fades on navigation.
      */}
      <CinematicTransition>
        <Routes>
          <Route path="/"           element={<HeroPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          {/* Future routes (Phase 3+) go here */}
        </Routes>
      </CinematicTransition>
    </BrowserRouter>
  )
}
