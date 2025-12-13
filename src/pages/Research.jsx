import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Button from '../components/Button'
import Card from '../components/Card'
import './Research.css'

function Research() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const blogPosts = [
    'From ideas to evidence: how to reduce innovation waste',
    'Desirability, feasibility, viability: making tradeoffs visible',
    'AI as a co-founder: what it should and shouldn\'t do'
  ]

  return (
    <>
      <Helmet>
        <title>Research — Xinovates</title>
        <meta name="description" content="Read Xinovates thinking on AI and innovation, including how AI can support discovery, ideation, evaluation, and adaptation." />
      </Helmet>

      <section className="page-hero section">
        <div className="container">
          <h1>Research & insights.</h1>
          <p className="page-intro">
            Xinovates is grounded in the idea that AI can augment multiple stages of innovation—helping teams understand problems, generate solutions, evaluate tradeoffs, and adapt faster.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Card className="paper-card">
            <h2>"Future of Innovation by the Impact of AI"</h2>
            <p className="paper-summary">
              This work explores how AI can accelerate the innovation lifecycle—enhancing cognitive work, automating routine steps, uncovering patterns, and supporting better decisions.
            </p>
            <div className="paper-actions">
              <Button href="#" variant="primary">Read the paper</Button>
              <Button href="#" variant="secondary">Download one-pager</Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="section bg-gray">
        <div className="container">
          <h2>Recent insights</h2>
          <div className="blog-list">
            {blogPosts.map((post, idx) => (
              <Card key={idx} className="blog-card">
                <h3>{post}</h3>
                <p className="blog-placeholder">Coming soon</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <Button to="/contact" variant="primary">Request a Demo</Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Research

