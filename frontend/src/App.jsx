import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AudioProvider }       from './contexts/AudioContext'
import { CinematicTransition }  from './components/CinematicTransition'
import MusicPlayer              from './components/MusicPlayer'
import CassetteShop             from './components/CassetteShop/CassetteShop'
import Header                   from './components/Header'
import Hero                     from './components/Hero'
import Discover                 from './pages/Discover'
import Mixtapes                 from './pages/Mixtapes'
import Library                  from './pages/Library'
import ExperiencePage           from './pages/ExperiencePage'

/* ── Hero page ────────────────────────────────────────────────── */
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
        AudioProvider at root level — the Audio element and all
        playback state persist across route changes.
        MusicPlayer rendered OUTSIDE <Routes> for the same reason.
      */}
      <AudioProvider>
        <div className="film-grain-overlay" aria-hidden="true" />
        <CinematicTransition>
          <Routes>
            <Route path="/"           element={<HeroPage />} />
            <Route path="/discover"   element={<Discover />} />
            <Route path="/mixtapes"   element={<Mixtapes />} />
            <Route path="/library"    element={<Library />} />
            <Route path="/shop"       element={<CassetteShop />} />
            <Route path="/experience" element={<ExperiencePage />} />
          </Routes>


          {/* Persistent player — always rendered, slides in on first play */}
          <MusicPlayer />
        </CinematicTransition>
      </AudioProvider>
    </BrowserRouter>
  )
}
