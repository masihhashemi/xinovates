import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <h3>Xinovates</h3>
              <p className="footer-tagline">
                Xinovates helps teams move from ideas to viable solutions—faster and with more confidence.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                  <li><Link to="/product">Product</Link></li>
                  <li><Link to="/how-it-works">How It Works</Link></li>
                  <li><Link to="/features">Features</Link></li>
                  <li><Link to="/use-cases">Use Cases</Link></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><Link to="/team">Team</Link></li>
                  <li><Link to="/roadmap">Roadmap</Link></li>
                  <li><Link to="/research">Research</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li><Link to="/privacy">Privacy</Link></li>
                  <li><Link to="/terms">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Xinovates. All rights reserved.</p>
            <div className="footer-social">
              <a href="https://linkedin.com/company/xinovates" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

