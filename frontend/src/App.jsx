import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AudioProvider }       from './contexts/AudioContext'
import { CinematicTransition }  from './components/CinematicTransition'
import MusicPlayer              from './components/MusicPlayer'
import Header                   from './components/Header'
import Hero                     from './components/Hero'
import CustomCursor             from './components/CustomCursor'

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
        <CustomCursor />
        <div className="film-grain-overlay" aria-hidden="true" />

        <CinematicTransition>
          <Routes>
            <Route path="*" element={<HeroPage />} />
          </Routes>


          {/* Persistent player — always rendered, slides in on first play */}
          <MusicPlayer />
        </CinematicTransition>
      </AudioProvider>
    </BrowserRouter>
  )
}
