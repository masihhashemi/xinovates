import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/product', label: 'Product' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/features', label: 'Features' },
    { path: '/use-cases', label: 'Use Cases' },
    { path: '/roadmap', label: 'Roadmap' },
    { path: '/team', label: 'Team' },
    { path: '/research', label: 'Research' },
    { path: '/contact', label: 'Contact' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="header" role="banner">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" aria-label="Xinovates Home">
            <span className="logo-text">Xinovates</span>
          </Link>
          
          <nav className="nav" aria-label="Main navigation">
            <button
              className="menu-toggle"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            
            <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={isActive(link.path) ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link to="/contact" className="btn btn-primary header-cta">
            Request a Demo
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header

