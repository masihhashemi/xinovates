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
      bio: 'Academic Visitor and researcher, Saïd Business School, University of Oxford. Scientist-entrepreneur focused on AI-driven innovation and emergent technologies; ecosystem builder and programme designer.',
      linkedin: 'https://www.linkedin.com/in/reza-kalantarinejad/'
    },
    {
      name: 'Prof. Marc Ventresca',
      role: 'Co-founder & Strategic Advisor',
      image: `${baseUrl}assets/images/Prof-Marc-Ventresca.jpg`,
      bio: 'Faculty at Saïd Business School, University of Oxford; GB Fellow at Wolfson College. Senior scholar of innovation, ecosystems, and organisational strategy; advises Xinovates on practice, scale, and impact.',
      linkedin: 'https://www.linkedin.com/in/mventresca/'
    },
    {
      name: 'Masih Hashemi',
      role: 'Product Team member',
      image: `${baseUrl}assets/images/masih-hashemi.jpg`,
      bio: 'Masih is a dedicated researcher with specialized expertise in advanced Machine Learning and Artificial Intelligence, particularly in Reinforcement Learning, Neural Networks, and Deep Q-networks.',
      linkedin: 'https://www.linkedin.com/in/masih-hashemi-/'
    }
  ]

  const advisoryBoard = [
    {
      name: 'Mario Eguiluz',
      role: 'Advisor',
      image: `${baseUrl}assets/images/Mario-Eguiluz.jpg`,
      bio: 'Technology leader and entrepreneur with over a decade of experience across fintech, blockchain, and software development. Raised €26m to build Deblock. Previously held leadership roles at Ledger and Revolut.',
      linkedin: 'https://www.linkedin.com/in/marioeguiluzalebicto/'
    },
    {
      name: 'Samuel D. Hayslett',
      role: 'Advisor',
      image: `${baseUrl}assets/images/Samuel-D.-Hayslett.jpg`,
      bio: 'Samuel D. Hayslett is an accomplished entrepreneur and CEO of Music Files Inc., an entertainment production company that discovers, develops, markets, and molds artists into global brands.',
      linkedin: 'https://www.linkedin.com/in/samuel-d-hayslett-a160b6b9/'
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
                  {member.linkedin && (
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="team-linkedin"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
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
                  {member.linkedin && (
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="advisory-linkedin"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
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

