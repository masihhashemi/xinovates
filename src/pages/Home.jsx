import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import VideoSection from '../components/VideoSection'
import Button from '../components/Button'
import Card from '../components/Card'
import './Home.css'

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Xinovates — AI-Augmented Innovation Lab</title>
        <meta name="description" content="Xinovates is an AI-augmented innovation lab that helps teams frame problems, generate solutions, evaluate options, and move toward real-world viability faster." />
      </Helmet>

      <section className="hero section-large">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Build better innovations—faster—with AI-augmented co-founders.</h1>
              <p className="hero-subtext">
                Xinovates is an AI-Augmented Innovation Lab designed to help teams move from fuzzy ideas to viable solutions by supporting problem framing, ideation, evaluation, and decision-making.
              </p>
              <div className="hero-ctas">
                <Button to="/contact" variant="primary">Request a Demo</Button>
                <Button to="/contact" variant="secondary">Join the Waitlist</Button>
              </div>
            </div>
            <div className="hero-visual">
              <img 
                src={`${import.meta.env.BASE_URL}assets/images/hero-illustration.svg`}
                alt="Innovation workflow with AI support at each stage."
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      <VideoSection />

      <section className="section" data-animate>
        <div className="container">
          <div className="section-header">
            <h2>Why do so many innovation projects stall?</h2>
            <p className="section-intro">
              Innovation often fails when desirability, feasibility, and business viability don't align. Teams also face information overload, disconnected ideas, and long development cycles—leading to wasted time and resources.
            </p>
          </div>
          <ul className="benefits-list">
            <li>Reduce cognitive overload with structured AI support</li>
            <li>Connect insights to real user needs and market realities</li>
            <li>Shorten cycles from idea → evidence → decision</li>
          </ul>
        </div>
      </section>

      <section className="section bg-gray" data-animate>
        <div className="container">
          <div className="section-header">
            <h2>An innovation lab in your browser (without replacing your team).</h2>
            <p className="section-intro">
              Xinovates augments how people innovate. It helps you clarify the problem, explore solution directions, evaluate tradeoffs, and document decisions so teams can move with confidence.
            </p>
          </div>
          <div className="cards-grid">
            <Card title="Discover">
              <p>Turn scattered signals into clear opportunity spaces.</p>
            </Card>
            <Card title="Create">
              <p>Generate and refine solution concepts quickly—without losing context.</p>
            </Card>
            <Card title="Decide">
              <p>Compare options with transparent criteria and next-step recommendations.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section" data-animate>
        <div className="container">
          <div className="section-header">
            <h2>Who it's for</h2>
          </div>
          <div className="cards-grid">
            <Card>
              <h3>Startups & founders</h3>
              <p>Validate directions early and focus on what matters.</p>
            </Card>
            <Card>
              <h3>SMEs</h3>
              <p>Innovate without hiring a massive R&D team.</p>
            </Card>
            <Card>
              <h3>Corporate innovation teams</h3>
              <p>Align stakeholders with evidence-based decisions.</p>
            </Card>
            <Card>
              <h3>Accelerators & ecosystems</h3>
              <p>Run structured innovation sprints and programs.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section bg-gray" data-animate>
        <div className="container">
          <div className="section-header">
            <h2>A simple flow your team can actually use.</h2>
          </div>
          <ol className="steps-list">
            <li>Frame the challenge</li>
            <li>Map constraints + success criteria</li>
            <li>Generate solution directions</li>
            <li>Evaluate tradeoffs + risks</li>
            <li>Plan experiments + prototypes</li>
          </ol>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Want to see Xinovates in action?</h2>
            <p>
              We're building the MVP and onboarding early teams for pilots and guided sprints.
            </p>
            <div className="cta-buttons">
              <Button to="/contact" variant="primary">Request a Demo</Button>
              <Button to="/contact" variant="secondary">Join the Waitlist</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home

