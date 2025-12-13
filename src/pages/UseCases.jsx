import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Button from '../components/Button'
import Card from '../components/Card'
import './UseCases.css'

function UseCases() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const useCases = [
    {
      title: 'Startups & Founders',
      problem: 'You have more ideas than time—and you need proof fast.',
      helps: [
        'Frame the problem clearly',
        'Generate differentiated concepts',
        'Prioritize what to test next'
      ],
      outcome: 'Less guesswork. Faster learning.'
    },
    {
      title: 'SMEs',
      problem: 'You want innovation, but resources are tight.',
      helps: [
        'Structure innovation without a large R&D function',
        'Reduce wasted cycles',
        'Build internal alignment'
      ],
      outcome: 'Practical innovation that fits your capacity.'
    },
    {
      title: 'Corporate Innovation Teams',
      problem: 'Stakeholders disagree, and decision cycles drag.',
      helps: [
        'Transparent criteria and tradeoffs',
        'Consistent decision documentation',
        'Faster iteration loops'
      ],
      outcome: 'Alignment through evidence.'
    },
    {
      title: 'Accelerators, Programs & Ecosystems',
      problem: 'You need repeatable methods for cohorts and sprints.',
      helps: [
        'Guided workflows',
        'Templates for challenge framing and evaluation',
        'Sprint outputs that are easy to review'
      ],
      outcome: 'Repeatable innovation learning.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Use Cases — Xinovates</title>
        <meta name="description" content="Xinovates supports founders, SMEs, and innovation teams with structured, AI-augmented workflows for building viable solutions." />
      </Helmet>

      <section className="page-hero section">
        <div className="container">
          <h1>Built for teams who need clarity and speed.</h1>
          <p className="page-intro">
            Whether you're validating a new product direction or aligning a large team, Xinovates helps you move from ideas to evidence.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="use-cases-grid">
            {useCases.map((useCase, idx) => (
              <Card key={idx} className="use-case-card">
                <h2>{useCase.title}</h2>
                <div className="use-case-problem">
                  <strong>Problem:</strong> {useCase.problem}
                </div>
                <div className="use-case-helps">
                  <strong>How Xinovates helps:</strong>
                  <ul>
                    {useCase.helps.map((help, helpIdx) => (
                      <li key={helpIdx}>{help}</li>
                    ))}
                  </ul>
                </div>
                <div className="use-case-outcome">
                  <strong>{useCase.outcome}</strong>
                </div>
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

export default UseCases

