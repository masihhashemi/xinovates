import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import './Terms.css'

function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Terms of Use — Xinovates</title>
        <meta name="description" content="Xinovates website terms (placeholder)." />
      </Helmet>

      <section className="page-hero section">
        <div className="container">
          <h1>Terms of Use</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-content">
            <p className="legal-intro">
              These terms govern use of the Xinovates marketing website. The site is provided "as is." Any product descriptions may change as the platform is developed.
            </p>

            <h2>Use of site</h2>
            <p>
              This website is provided for informational purposes only. You may use this site to learn about Xinovates and contact us. You agree not to use the site for any unlawful purpose or in any way that could damage or impair the site.
            </p>

            <h2>Intellectual property</h2>
            <p>
              All content on this website, including text, graphics, logos, and images, is the property of Xinovates or its licensors and is protected by copyright and other intellectual property laws.
            </p>

            <h2>Disclaimers</h2>
            <p>
              This website and its content are provided "as is" without warranties of any kind. We do not guarantee that the information on this site is accurate, complete, or current. Product features and capabilities described may change as development progresses.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, Xinovates shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this website.
            </p>

            <h2>Contact</h2>
            <p>
              If you have questions about these terms, please contact us at{' '}
              <a href="mailto:hello@xinovates.com">hello@xinovates.com</a>.
            </p>

            <p className="legal-note">
              <em>Last updated: {new Date().toLocaleDateString()}</em>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Terms

