import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import './TeamMemberBio.css'

function TeamMemberBio() {
  const { slug } = useParams()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const baseUrl = import.meta.env.BASE_URL

  const teamMemberData = {
    'reza-kalantarinejad': {
      name: 'Dr. Reza Kalantarinejad',
      role: 'Founder & Lead Researcher',
      title: 'Academic Visitor, Researcher @ Saïd Business School, University of Oxford | AI for Scientific & Technological Innovation',
      image: `${baseUrl}assets/images/Dr-Reza-Kalantarinejad.jpg`,
      linkedin: 'https://www.linkedin.com/in/reza-kalantarinejad/',
      sections: [
        {
          heading: 'Overview',
          content: 'Reza Kalantarinejad is an academic visitor and researcher in innovation management at the University of Oxford\'s Saïd Business School. His research focuses on how artificial intelligence (AI) impacts innovation and the future of scientific work. He is also a STEM Fellow with the Human Frontier Collective at Scale AI, contributing to AI research for science. Reza is the founder and a Director of Xinovates Ltd.'
        },
        {
          heading: 'Expertise and Career',
          content: 'Reza has practical experience in technology acceleration and deep-tech ventures. He founded and led a technology accelerator that raised $4 million and supported 25 deep-tech start-ups across various sectors. He mentored scientists to help them bring their R&D to market. Earlier, he co-founded Hamgara, where he led R&D teams working on nano-biosensor systems. As a faculty member at the Aerospace Research Institute, his work on bio-capsule design received recognition with the First Rank in the Khwarizmi International Award.'
        },
        {
          heading: 'Research and Philosophy',
          content: 'Reza\'s research explores innovation in the AI era, including the ethical and responsible development of technology. He is part of the NatWest accelerator program, exploring how his research and platform can impact innovation and entrepreneurship. Driven by the question "How can we accelerate scientific and technological progress for society?", Reza aims to enhance human potential through AI. His approach emphasizes systems thinking, collaboration, and mission-driven entrepreneurship.'
        },
        {
          heading: 'Education and Connections',
          content: 'Reza holds a PhD and has published research on various topics, including computational modeling and satellite disposal.'
        }
      ]
    },
    'marc-ventresca': {
      name: 'Prof. Marc Ventresca',
      role: 'Co-founder & Strategic Advisor',
      title: 'Associate Professor of Strategy & Innovation @ University of Oxford, Saïd Business School | Governing Body Fellow @ Wolfson College',
      image: `${baseUrl}assets/images/Prof-Marc-Ventresca.jpg`,
      linkedin: 'https://www.linkedin.com/in/mventresca/',
      sections: [
        {
          heading: 'Overview',
          content: 'Professor Marc Ventresca is an economic and organizational sociologist at the University of Oxford. He is an Associate Professor of Strategy and Innovation at the Saïd Business School and a Governing Body Fellow of Wolfson College. His work focuses on innovation, institutions, and infrastructure in strategy, investigating how markets and networks form in knowledge-intensive industries.'
        },
        {
          heading: 'Expertise and Career',
          content: 'Prof. Ventresca is widely recognized for his expertise in market and network formation, researching how new markets are built and governed, particularly in areas like financial markets, public services, and ecosystem services. His work explores the intersection of economic sociology, strategy, and technological innovation, including projects with the European Space Agency and research on "frugal innovation". He is a key figure in Oxford\'s entrepreneurship initiatives, including the "Science Innovation Plus" initiative, which engages science doctoral students and post-doctoral fellows with business innovation activities. He previously held faculty positions at the Kellogg School of Management at Northwestern University and has research affiliations with the Stanford Center for International Security and Cooperation (CISAC) and the Scandinavian Centre for Organizations Research (SCANCOR) at Stanford University.'
        },
        {
          heading: 'Academic Contributions',
          content: 'A prolific educator and academic entrepreneur, Prof. Ventresca has founded or co-convened numerous courses across Oxford\'s degree programs. He serves as a strategic advisor and mentor to several technology and social innovation start-ups founded by Oxford alumni and has held advisory roles with the World Economic Forum.'
        },
        {
          heading: 'Education',
          content: 'Prof. Ventresca earned his degrees in politics and political philosophy, education policy analysis, and economic sociology at Stanford University.'
        }
      ]
    },
    'masih-hashemi': {
      name: 'Masih Hashemi',
      role: 'Product Team member',
      title: 'MSc Computing Student @ Queen\'s University | AI & NLP Researcher',
      image: `${baseUrl}assets/images/masih-hashemi.jpg`,
      linkedin: 'https://www.linkedin.com/in/masih-hashemi-/',
      website: 'https://masihhashemi.com',
      sections: [
        {
          heading: 'Overview',
          content: 'Masih Hashemi is a dedicated graduate student and researcher currently completing his Master of Science in Computer Science, with a specialization in Artificial Intelligence, at Queen\'s University. His academic focus is on leveraging machine learning and Natural Language Processing (NLP) techniques to solve complex problems, particularly in the health technology sector.'
        },
        {
          heading: 'Expertise and Experience',
          content: 'Masih combines a strong academic background in statistical machine learning with practical industry experience. His research interests lie in the application of advanced AI models, including Generative AI and Retrieval-Augmented Generation (RAG) systems. He has contributed to research concerning novel variants of Q-learning and exploration strategies in reinforcement learning environments. In a professional capacity, Masih has worked as a Lead Data Scientist, where he was involved in developing care recommendation algorithms and implementing AI solutions to improve mental healthcare delivery. He possesses hands-on experience in full-stack development, including designing secure NoSQL databases for handling sensitive information and developing tools for monitoring user interactions.'
        },
        {
          heading: 'Education',
          content: 'Masih holds a Master of Science in Computer Science (AI specialization) from Queen\'s University and a Bachelor of Applied Science in Statistical Machine Learning from the University of Toronto.'
        }
      ]
    },
    'mario-eguiluz': {
      name: 'Mario Eguiluz',
      role: 'Advisor',
      title: 'Co-Founder & CTO @ Deblock | Web3 & Fintech Expert',
      image: `${baseUrl}assets/images/Mario-Eguiluz.jpg`,
      linkedin: 'https://www.linkedin.com/in/marioeguiluzalebicto/',
      sections: [
        {
          heading: 'Overview',
          content: 'Mario Eguiluz Alebicto is a seasoned software engineer and entrepreneur with over 20 years of experience in development, specializing in building products for millions of users in high-impact sectors. He is currently the Co-Founder and Chief Technology Officer (CTO) of Deblock, an innovative company building on-chain banking solutions that bridge traditional finance (TradFi) and decentralized finance (DeFi).'
        },
        {
          heading: 'Expertise and Career',
          content: 'Mario\'s career spans multiple facets of the tech industry, where he has held significant roles in both large corporations and agile start-ups. Before founding Deblock, Mario was the Head of Engineering at Ledger, a global leader in cryptocurrency hardware wallets. His experience also includes key engineering roles at major financial institutions like Revolut and Santander Bank UK. Mario has a strong entrepreneurial background, having co-founded previous ventures like myplacesandme.com (a tech startup focused on iOS apps) and Wanted (an HR tech company). He is a recognized expert in iOS development, having started with Objective-C during the first iPhone era and transitioning to Swift and modern backend technologies. He is the author of two books: Algorithms in Swift and Mastering iOS 14.'
        },
        {
          heading: 'Education',
          content: 'Mario holds degrees from the University of Deusto and also attended Stanford University.'
        }
      ]
    },
    'samuel-hayslett': {
      name: 'Samuel D. Hayslett',
      role: 'Advisor',
      title: 'Founder & CEO @ Music Files Inc. and All-Starr LLC | Entrepreneur & Investor',
      image: `${baseUrl}assets/images/Samuel-D.-Hayslett.jpg`,
      linkedin: 'https://www.linkedin.com/in/samuel-d-hayslett-a160b6b9/',
      sections: [
        {
          heading: 'Overview',
          content: 'Samuel D. Hayslett, also known by his moniker "Danny Warbuckz," is a successful entrepreneur, investor, and executive producer with over two decades of experience across the entertainment, real estate, and finance industries. He is currently expanding his expertise by undertaking an Executive Diploma in Artificial Intelligence for Business at the University of Oxford\'s Saïd Business School.'
        },
        {
          heading: 'Expertise and Career',
          content: 'Hayslett is the driving force behind several ventures, notably Music Files Inc. and All-Starr LLC, specializing in discovering, developing, and promoting artists with a focus on ensuring artists retain ownership of their content. He has worked for renowned music labels such as Sony Music, Columbia Records, and Capitol Records. His unique "Beyond the 360 Deal" model invests significant capital into artists to promote their work while allowing them to maintain creative control. He has successfully managed campaigns that have achieved millions of streams and top 100 chart placements. Beyond music, Hayslett is a passionate real estate investor and a film producer. He is the executive producer of the film The Black Experiment, a project that explores positive mentorship for at-risk youth. He is known for his innovative approach, including creating the first NFT for a film industry project, allowing fans to own digital images and potentially trade ownership value.'
        },
        {
          heading: 'Education and Background',
          content: 'Hayslett holds an Associate\'s degree from the Borough of Manhattan Community College and a Bachelor of Arts in Business Administration from Baruch College. His current program at Oxford focuses on leveraging AI to transform business landscapes. Growing up in Brooklyn, New York, Hayslett is committed to improving his community and the entertainment industry by providing resources and opportunities for talented individuals.'
        }
      ]
    }
  }

  const member = teamMemberData[slug]

  if (!member) {
    return (
      <div className="bio-not-found">
        <h1>Team Member Not Found</h1>
        <Link to="/team" className="btn btn-primary">Back to Team</Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{member.name} — Xinovates</title>
        <meta name="description" content={member.title} />
      </Helmet>

      <section className="bio-hero section">
        <div className="container">
          <Link to="/team" className="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Team
          </Link>
        </div>
      </section>

      <section className="bio-content section">
        <div className="container">
          <div className="bio-layout">
            <div className="bio-sidebar">
              <div className="bio-image-wrapper">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="bio-image"
                />
              </div>
              <div className="bio-contact">
                {member.linkedin && (
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bio-link linkedin-link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn Profile
                  </a>
                )}
                {member.website && (
                  <a 
                    href={member.website.startsWith('http') ? member.website : `https://${member.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bio-link website-link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    Personal Website
                  </a>
                )}
              </div>
            </div>

            <div className="bio-main">
              <h1>{member.name}</h1>
              <p className="bio-role">{member.role}</p>
              <p className="bio-title">{member.title}</p>

              <div className="bio-sections">
                {member.sections.map((section, idx) => (
                  <div key={idx} className="bio-section">
                    <h2>{section.heading}</h2>
                    <p>{section.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default TeamMemberBio

