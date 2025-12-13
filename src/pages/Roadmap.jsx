import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Button from '../components/Button'
import './Roadmap.css'

function Roadmap() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const steps = [
    {
      number: '01',
      title: 'Guided AI Executive Program (without platform)',
      text: 'Run structured innovation activities using existing tools and methods, while capturing learnings for the product.'
    },
    {
      number: '02',
      title: 'AI-Augmented Innovation Lab (MVP)',
      text: 'Deliver a focused MVP to support the core workflow: frame → generate → evaluate → plan.'
    },
    {
      number: '03',
      title: 'Spin-out MVP for Startups & Entrepreneurs',
      text: 'Expand capabilities for early-stage teams, pilots, and accelerator programs.'
    },
    {
      number: '04',
      title: 'Scale for Enterprise',
      text: 'Add scaling features like governance, portfolio views, and advanced collaboration.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Roadmap — Xinovates</title>
        <meta name="description" content="See the Xinovates roadmap from guided programs to MVP to scaling across startups and enterprises." />
      </Helmet>

      <section className="page-hero section">
        <div className="container">
          <h1>Where we're heading.</h1>
          <p className="page-intro">
            Xinovates is being developed in stages to ensure the workflow is real, usable, and validated with teams.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="roadmap-timeline">
            {steps.map((step, idx) => (
              <div key={idx} className="roadmap-step">
                <div className="roadmap-number">{step.number}</div>
                <div className="roadmap-content">
                  <h2>{step.title}</h2>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <Button to="/contact" variant="primary">Join the Waitlist</Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Roadmap

