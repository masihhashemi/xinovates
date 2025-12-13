import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Button from '../components/Button'
import Card from '../components/Card'
import './Features.css'

function Features() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const featureGroups = [
    {
      title: 'Discover',
      features: [
        { title: 'Insight synthesis', text: 'Summarize signals and research into clear themes.' },
        { title: 'Opportunity framing', text: 'Turn messy input into structured problem statements.' },
        { title: 'Stakeholder mapping', text: 'Clarify who matters and why.' }
      ]
    },
    {
      title: 'Create',
      features: [
        { title: 'Concept generation', text: 'Generate multiple directions with constraints in mind.' },
        { title: 'Concept refinement', text: 'Improve clarity, uniqueness, and user alignment.' },
        { title: 'Messaging drafts', text: 'Create simple explanations for each concept.' }
      ]
    },
    {
      title: 'Evaluate',
      features: [
        { title: 'Criteria scoring', text: 'Compare concepts across desirability, feasibility, viability, and impact.' },
        { title: 'Risk & assumption tracking', text: 'Make unknowns explicit and testable.' },
        { title: 'Decision records', text: 'Keep a readable log of why you chose what you chose.' }
      ]
    },
    {
      title: 'Prototype & Plan',
      features: [
        { title: 'Experiment planner', text: 'Pick fast tests that reduce uncertainty.' },
        { title: 'Prototype briefs', text: 'Outline what to build, for who, and what you\'ll learn.' },
        { title: 'Pitch-ready summaries', text: 'Turn work into a clear narrative for stakeholders.' }
      ]
    }
  ]

  return (
    <>
      <Helmet>
        <title>Features — Xinovates</title>
        <meta name="description" content="Explore Xinovates features across discovery, ideation, evaluation, prototyping, and decision-making." />
      </Helmet>

      <section className="page-hero section">
        <div className="container">
          <h1>Features designed for the full innovation cycle.</h1>
          <p className="page-intro">
            These are the core capabilities we're building into the Xinovates lab experience.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-groups">
            {featureGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="feature-group">
                <h2 className="group-title">{group.title}</h2>
                <div className="features-grid">
                  {group.features.map((feature, idx) => (
                    <Card key={idx} title={feature.title}>
                      <p>{feature.text}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-gray">
        <div className="container">
          <div className="disclaimer-box">
            <p>
              <strong>Note:</strong> Feature availability may vary by stage of development. If you're joining early access, we'll share the current MVP scope during onboarding.
            </p>
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

export default Features

