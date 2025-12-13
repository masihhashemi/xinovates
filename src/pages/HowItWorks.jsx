import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Button from '../components/Button'
import Card from '../components/Card'
import './HowItWorks.css'

function HowItWorks() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const steps = [
    {
      number: 1,
      title: 'Frame the Challenge',
      text: 'Define the problem clearly, identify the user or stakeholder, and clarify the outcome you want.',
      outputs: ['Problem statement', '"Jobs to be done" style needs', 'Success metrics']
    },
    {
      number: 2,
      title: 'Map Context & Constraints',
      text: 'Capture constraints (time, budget, tech, compliance) and what "good" looks like.',
      outputs: ['Constraint map', 'Risk list', 'Assumption log']
    },
    {
      number: 3,
      title: 'Generate Solution Directions',
      text: 'Create multiple solution routes—then refine them with the context you already set.',
      outputs: ['Concept set (3–10 directions)', 'Differentiators', 'Key questions to validate']
    },
    {
      number: 4,
      title: 'Evaluate & Prioritize',
      text: 'Compare options using transparent criteria like desirability, feasibility, viability, and impact.',
      outputs: ['Scored comparison matrix', 'Tradeoff notes', 'Recommended top candidates']
    },
    {
      number: 5,
      title: 'Prototype & Experiment Plan',
      text: 'Choose lightweight tests to learn fast—before you overbuild.',
      outputs: ['Prototype plan', 'Experiment checklist', 'Learning milestones']
    }
  ]

  return (
    <>
      <Helmet>
        <title>How It Works — Xinovates</title>
        <meta name="description" content="See the Xinovates workflow: frame problems, generate solutions, evaluate options, plan experiments, and move forward with confidence." />
      </Helmet>

      <section className="page-hero section">
        <div className="container">
          <h1>A workflow that turns uncertainty into next steps.</h1>
          <p className="page-intro">
            Xinovates guides teams through an innovation loop—from framing the challenge to choosing what to test next.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="steps-container">
            {steps.map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h2>{step.title}</h2>
                  <p>{step.text}</p>
                  <div className="step-outputs">
                    <h4>Example outputs:</h4>
                    <ul>
                      {step.outputs.map((output, idx) => (
                        <li key={idx}>{output}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-gray">
        <div className="container">
          <div className="closing-content">
            <h2>Keep the loop alive.</h2>
            <p>
              Innovation isn't linear. Xinovates helps teams learn, adapt, and document decisions as new evidence arrives.
            </p>
            <Button to="/contact" variant="primary">Request a Demo</Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default HowItWorks

