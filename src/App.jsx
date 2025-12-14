import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Product from './pages/Product'
import HowItWorks from './pages/HowItWorks'
import Features from './pages/Features'
import UseCases from './pages/UseCases'
import Roadmap from './pages/Roadmap'
import Team from './pages/Team'
import Research from './pages/Research'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import { observeElements } from './utils/scrollAnimations'
import './App.css'

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    // Re-observe elements on route change
    setTimeout(() => {
      observeElements()
    }, 100)
  }, [location])

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/features" element={<Features />} />
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/team" element={<Team />} />
          <Route path="/research" element={<Research />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function App() {
  useEffect(() => {
    observeElements()
  }, [])

  return (
    <ThemeProvider>
      <HelmetProvider>
        <Router basename="/">
          <div className="App">
            <AppContent />
          </div>
        </Router>
      </HelmetProvider>
    </ThemeProvider>
  )
}

export default App

