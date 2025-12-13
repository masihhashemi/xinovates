import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import './Privacy.css'

function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Privacy Policy — Xinovates</title>
        <meta name="description" content="Xinovates privacy policy (placeholder)." />
      </Helmet>

      <section className="page-hero section">
        <div className="container">
          <h1>Privacy Policy</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-content">
            <p className="legal-intro">
              Xinovates respects your privacy. This page explains what information we collect on this website (such as form submissions), how we use it (to respond to inquiries and share updates if you opt in), and how to request deletion.
            </p>

            <h2>Information we collect</h2>
            <p>
              When you use this website, we may collect information that you provide directly, such as:
            </p>
            <ul>
              <li>Name and contact information (email address) when you submit forms</li>
              <li>Company or organization information (if provided)</li>
              <li>Messages and inquiries you send through contact forms</li>
              <li>Usage data through analytics tools (if enabled)</li>
            </ul>

            <h2>How we use information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Respond to your inquiries and requests</li>
              <li>Send you updates about Xinovates if you opt in</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Cookies and analytics</h2>
            <p>
              If we enable analytics tools on this website, they may use cookies or similar technologies to collect usage information. You can control cookie preferences through your browser settings.
            </p>

            <h2>Data retention</h2>
            <p>
              We retain your information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
            </p>

            <h2>Contact for privacy requests</h2>
            <p>
              If you have questions about this privacy policy or wish to request deletion of your information, please contact us at{' '}
              <a href="mailto:hello@xinovates.com">hello@xinovates.com</a>.
            </p>

            <p className="legal-note">
              <em>Last updated: {new Date().toLocaleDateString()}</em>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Privacy

