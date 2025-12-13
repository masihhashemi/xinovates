import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import './Team.css'

function Team() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const baseUrl = import.meta.env.BASE_URL

  const teamMembers = [
    {
      name: 'Dr. Reza Kalantarinejad',
      role: 'Founder & Lead Researcher',
      image: `${baseUrl}assets/images/Dr-Reza-Kalantarinejad.jpg`,
      bio: 'Academic Visitor and researcher, Saïd Business School, University of Oxford. Scientist-entrepreneur focused on AI-driven innovation and emergent technologies; ecosystem builder and programme designer.'
    },
    {
      name: 'Prof. Marc Ventresca',
      role: 'Co-founder & Strategic Advisor',
      image: `${baseUrl}assets/images/Prof-Marc-Ventresca.jpg`,
      bio: 'Faculty at Saïd Business School, University of Oxford; GB Fellow at Wolfson College. Senior scholar of innovation, ecosystems, and organisational strategy; advises Xinovates on practice, scale, and impact.'
    },
    {
      name: 'Masih Hashemi',
      role: 'Product Team member',
      image: `${baseUrl}assets/images/masih-hashemi.jpg`,
      bio: 'Masih is a dedicated researcher with specialized expertise in advanced Machine Learning and Artificial Intelligence, particularly in Reinforcement Learning, Neural Networks, and Deep Q-networks.'
    }
  ]

  const advisoryBoard = [
    {
      name: 'Mario Eguiluz',
      role: 'Advisor',
      image: `${baseUrl}assets/images/Mario-Eguiluz.jpg`,
      bio: 'Technology leader and entrepreneur with over a decade of experience across fintech, blockchain, and software development. Raised €26m to build Deblock. Previously held leadership roles at Ledger and Revolut.'
    },
    {
      name: 'Samuel D. Hayslett',
      role: 'Advisor',
      image: `${baseUrl}assets/images/Samuel-D.-Hayslett.jpg`,
      bio: 'Samuel D. Hayslett is an accomplished entrepreneur and CEO of Music Files Inc., an entertainment production company that discovers, develops, markets, and molds artists into global brands.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Team — Xinovates</title>
        <meta name="description" content="Meet the Xinovates team building AI-augmented innovation workflows." />
      </Helmet>

      <section className="page-hero section">
        <div className="container">
          <h1>The people behind Xinovates.</h1>
          <p className="page-intro">
            We combine innovation practice, research, and real-world startup work to build tools teams can trust.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Team</h2>
            <p className="section-subtitle">A diverse team of founders, engineers, and dreamers</p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="team-card">
                <div className="team-image-wrapper">
                  <img 
                    src={member.image} 
                    alt={`${member.name}, ${member.role}`}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h2>{member.name}</h2>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-gray">
        <div className="container">
          <div className="section-header">
            <h2>Advisory Board</h2>
          </div>
          <div className="advisory-grid">
            {advisoryBoard.map((member, idx) => (
              <div key={idx} className="advisory-card">
                <div className="advisory-image-wrapper">
                  <img 
                    src={member.image} 
                    alt={`${member.name}, ${member.role}`}
                    className="advisory-image"
                  />
                </div>
                <div className="advisory-info">
                  <h3>{member.name}</h3>
                  <p className="advisory-role">{member.role}</p>
                  <p className="advisory-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Team

