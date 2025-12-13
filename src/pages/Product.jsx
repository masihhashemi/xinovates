import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Button from '../components/Button'
import Card from '../components/Card'
import './Product.css'

function Product() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Product — Xinovates</title>
        <meta name="description" content="Learn what Xinovates is, what it helps you achieve, and how it supports the innovation process end-to-end." />
      </Helmet>

      <section className="page-hero section">
        <div className="container">
          <h1>What is Xinovates?</h1>
          <p className="page-intro">
            Xinovates is an AI-Augmented Innovation Lab—built to help teams innovate with structure, speed, and clarity. It's not a replacement for human creativity; it's a co-founder-like system that supports the work from discovery to decision.
          </p>
        </div>
      </section>

      <section className="section bg-gray">
        <div className="container">
          <h2>What you get from using Xinovates</h2>
          <ul className="outcomes-list">
            <li>Faster iteration from idea to testable concept</li>
            <li>Clearer decisions with documented assumptions and criteria</li>
            <li>Better alignment across stakeholders</li>
            <li>Reduced risk of building the wrong thing</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Built around how real innovation happens</h2>
          </div>
          <div className="cards-grid">
            <Card title="Human-centered">
              <p>Start with needs, not just tech.</p>
            </Card>
            <Card title="Systems thinking">
              <p>Connect solution choices to constraints and context.</p>
            </Card>
            <Card title="Evidence-led">
              <p>Prefer testable assumptions over opinions.</p>
            </Card>
            <Card title="Transparent">
              <p>Make criteria, tradeoffs, and reasoning visible.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section bg-gray">
        <div className="container">
          <div className="two-columns">
            <div className="column">
              <h3>It is:</h3>
              <ul className="check-list">
                <li>A guided workflow for innovation stages</li>
                <li>An AI assistant for synthesis, ideation, and evaluation</li>
                <li>A decision-support layer for teams</li>
              </ul>
            </div>
            <div className="column">
              <h3>It isn't:</h3>
              <ul className="x-list">
                <li>A "magic idea generator"</li>
                <li>A replacement for user research</li>
                <li>A finished end-to-end product builder (yet)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-strip">
        <div className="container">
          <div className="cta-strip-content">
            <Button to="/contact" variant="primary">Request a Demo</Button>
            <Button to="/how-it-works" variant="secondary">See How It Works</Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Product

