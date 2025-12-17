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
        <meta name="description" content="Build the right thing, faster — with an AI co-founder. Xinovates helps teams discover the real problem, generate stronger options, and make confident go/no-go decisions." />
      </Helmet>

      {/* Hero Section */}
      <section className="hero section-large">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Build the right thing, faster — with an AI co-founder.</h1>
              <p className="hero-subtext">
                Xinovates helps teams discover the real problem, generate stronger options, and make confident go/no-go decisions with transparent reasoning.
              </p>
              <div className="hero-ctas">
                <Button to="/contact" variant="primary">Request a Demo</Button>
                <Button 
                  href="/product"
                  variant="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Access the Product
                </Button>
              </div>
              <p className="trust-line">
                Research-backed approach, inspired by leading work on AI's impact on innovation.{' '}
                <a href="https://share.google/VTx0m10yuMM0NTkoC" target="_blank" rel="noopener noreferrer" className="trust-link">Oxford article</a>
                {' • '}
                <a href="https://share.google/uhKA11pit07zcbfd6" target="_blank" rel="noopener noreferrer" className="trust-link">SSRN paper</a>
              </p>
              <p className="trust-microcopy">
                No hype. Clear outputs: assumptions, alternatives, evaluation, and next steps.
              </p>
            </div>
            <div className="hero-visual">
              <img 
                src={`${import.meta.env.BASE_URL}assets/images/main-page.png`}
                alt="Innovation workflow with AI support at each stage."
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="section" data-animate>
        <div className="container">
          <div className="section-header">
            <h2>What you get from Xinovates</h2>
          </div>
          <ul className="benefits-list">
            <li><strong>Problem clarity:</strong> customer tensions, constraints, and key assumptions</li>
            <li><strong>Better options:</strong> multiple solution paths, not just one idea</li>
            <li><strong>Decision support:</strong> evaluation, risk flags, and a documented recommendation</li>
          </ul>
        </div>
      </section>

      {/* Video Section */}
      <div id="video-section">
        <VideoSection />
      </div>

      {/* Problem Section */}
      <section className="section bg-gray" data-animate>
        <div className="container">
          <div className="section-header">
            <h2>Innovation breaks down in the same places</h2>
            <p className="section-intro">
              Most teams don't fail from lack of ideas — they fail from unclear problems and inconsistent decisions.
            </p>
          </div>
          <ul className="problems-list">
            <li>Teams spend months building before validating the right problem</li>
            <li>Evaluation is subjective (opinions win over evidence)</li>
            <li>Decisions get stuck because tradeoffs aren't explicit</li>
          </ul>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section" data-animate>
        <div className="container">
          <div className="section-header">
            <h2>An AI-augmented co-founder for innovation</h2>
            <p className="section-intro">
              Xinovates supports the full innovation loop — from understanding the problem to choosing the best path forward — with structured outputs you can act on.
            </p>
          </div>
          <div className="solution-cards">
            <Card>
              <h3>Problem Discovery</h3>
              <p className="card-tagline">Turn messy inputs into a clear problem statement.</p>
              <div className="outputs-list">
                <p className="outputs-title">Outputs:</p>
                <ul>
                  <li>Key user pains + context map</li>
                  <li>Assumptions & unknowns list</li>
                  <li>"What success means" metrics</li>
                </ul>
              </div>
            </Card>
            <Card>
              <h3>Solution Generation</h3>
              <p className="card-tagline">Explore multiple directions, not one "favorite idea."</p>
              <div className="outputs-list">
                <p className="outputs-title">Outputs:</p>
                <ul>
                  <li>5–10 concept alternatives</li>
                  <li>Differentiation angles</li>
                  <li>Experiment ideas to validate fast</li>
                </ul>
              </div>
            </Card>
            <Card>
              <h3>Evaluation & Decision Support</h3>
              <p className="card-tagline">Compare options consistently and document the decision.</p>
              <div className="outputs-list">
                <p className="outputs-title">Outputs:</p>
                <ul>
                  <li>Scoring matrix (value, feasibility, viability, impact)</li>
                  <li>Risks, constraints, and dependencies</li>
                  <li>Go / no-go recommendation + next steps</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section bg-gray" data-animate>
        <div className="container">
          <div className="section-header">
            <h2>How it works</h2>
          </div>
          <div className="how-it-works-strip">
            <div className="how-step">
              <div className="how-step-number">1</div>
              <h4>Define context</h4>
              <p>Users, market, constraints, goals</p>
            </div>
            <div className="how-step">
              <div className="how-step-number">2</div>
              <h4>Generate options</h4>
              <p>Multiple solution paths + variations</p>
            </div>
            <div className="how-step">
              <div className="how-step-number">3</div>
              <h4>Stress-test</h4>
              <p>Assumptions, risks, evidence gaps</p>
            </div>
            <div className="how-step">
              <div className="how-step-number">4</div>
              <h4>Decide & document</h4>
              <p>Recommendation, rationale, and roadmap</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Evolution Section */}
      <section className="section" data-animate>
        <div className="container">
          <div className="section-header">
            <h2>Where AI is heading — and where Xinovates fits</h2>
            <p className="section-intro">
              AI in innovation is evolving from an assistant to a true partner. Xinovates is built for the "augmented co-founder" stage: supportive, structured, and human-led.
            </p>
          </div>
          <div className="ai-evolution">
            <div className="ai-stage">
              <div className="stage-label">AI as Assistant</div>
            </div>
            <div className="ai-stage current">
              <div className="stage-label">AI as Augmented Co-Founder</div>
              <div className="stage-badge">Xinovates today</div>
            </div>
            <div className="ai-stage">
              <div className="stage-label">AI as Autonomous Innovator</div>
              <div className="stage-note">Future direction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section bg-gray" data-animate>
        <div className="container">
          <div className="section-header">
            <h2>Who it's for</h2>
          </div>
          <div className="use-cases-grid">
            <Card>
              <h3>Startups & founders</h3>
              <ul className="use-case-benefits">
                <li>Validate faster with clearer assumptions</li>
                <li>Reduce wasted build time</li>
              </ul>
              <p className="use-case-example">
                Example: "From idea → alternatives → decision memo in days."
              </p>
            </Card>
            <Card>
              <h3>Corporate innovation teams</h3>
              <ul className="use-case-benefits">
                <li>Standardize evaluation across stakeholders</li>
                <li>Create traceable decision logs</li>
              </ul>
              <p className="use-case-example">
                Example: "From workshop notes → scored concepts → pilot plan."
              </p>
            </Card>
            <Card>
              <h3>Investors & accelerators</h3>
              <ul className="use-case-benefits">
                <li>Compare opportunities consistently</li>
                <li>Spot missing evidence early</li>
              </ul>
              <p className="use-case-example">
                Example: "From pitch → assumptions audit → next experiments."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust by Design Section */}
      <section className="section" data-animate>
        <div className="container">
          <div className="section-header">
            <h2>Trust by design</h2>
          </div>
          <ul className="trust-list">
            <li>Human-in-the-loop decisions</li>
            <li>Transparent reasoning (assumptions + decision logs)</li>
            <li>Bias checks + data quality awareness</li>
            <li>Privacy-minded workflows (don't require sensitive data)</li>
          </ul>
        </div>
      </section>

      {/* Publications Section */}
      <section className="section bg-gray" data-animate>
        <div className="container">
          <div className="section-header">
            <h2>Publications</h2>
            <p className="section-intro">
              Our work is grounded in research on AI's impact on innovation and scientific discovery.
            </p>
          </div>
          <div className="publications-grid">
            <Card>
              <h3>Generative AI: Reshaping Innovation</h3>
              <p className="publication-source">Oxford Saïd Business School</p>
              <p>
                Exploring how generative AI is transforming innovation processes, from ideation to implementation, and the challenges organizations face in adoption.
              </p>
              <a 
                href="https://share.google/VTx0m10yuMM0NTkoC" 
                target="_blank" 
                rel="noopener noreferrer"
                className="publication-link"
              >
                Read article →
              </a>
            </Card>
            <Card>
              <h3>Future of Innovation by the Impact of AI</h3>
              <p className="publication-source">SSRN Research Paper</p>
              <p>
                A comprehensive analysis of how artificial intelligence is accelerating the innovation lifecycle and reshaping the future of scientific and technological progress.
              </p>
              <a 
                href="https://share.google/uhKA11pit07zcbfd6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="publication-link"
              >
                View paper →
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to move from ideas to decisions?</h2>
            <p>
              See how Xinovates helps you find the innovation sweet spot — with clear, actionable outputs.
            </p>
            <div className="cta-buttons">
              <Button to="/contact" variant="primary">Request a Demo</Button>
              <Button 
                href="/product" 
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Access the Product
              </Button>
            </div>
            <p className="cta-secondary">
              <a href="/research" className="cta-link">Explore our publications</a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
