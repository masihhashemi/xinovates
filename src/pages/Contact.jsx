import { useState } from 'react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    interest: '',
    message: '',
    updates: false
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.role) newErrors.role = 'Please select a role'
    if (!formData.interest) newErrors.interest = 'Please select an option'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    try {
      // Send to Formspree
      const response = await fetch('https://formspree.io/f/xanyqdde', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        setSubmitted(true)
        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitted(false)
          setFormData({
            name: '',
            email: '',
            company: '',
            role: '',
            interest: '',
            message: '',
            updates: false
          })
        }, 3000)
      } else {
        alert('Something went wrong. Please try emailing us directly at hello@xinovates.com')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try emailing us directly at hello@xinovates.com')
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact — Xinovates</title>
        <meta name="description" content="Contact Xinovates to request a demo, join the waitlist, or discuss partnerships." />
      </Helmet>

      <section className="page-hero section">
        <div className="container">
          <h1>Let's talk.</h1>
          <p className="page-intro">
            Want a demo, pilot, or partnership conversation? Send a message and we'll get back to you.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Get in touch</h2>
              <p>
                We're here to help. Reach out via email or use the form.
              </p>
              <div className="contact-details">
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:hello@xinovates.com">hello@xinovates.com</a>
                </p>
                <p>
                  <strong>LinkedIn:</strong>{' '}
                  <a href="https://linkedin.com/company/xinovates" target="_blank" rel="noopener noreferrer">
                    Connect with us
                  </a>
                </p>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {submitted ? (
                <div className="form-success">
                  <p>Thanks—your message has been received.</p>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alex Kim"
                      required
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && <span id="name-error" className="error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@company.com"
                      required
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && <span id="email-error" className="error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">Company / Organization</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="role">Role *</label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      aria-invalid={errors.role ? 'true' : 'false'}
                      aria-describedby={errors.role ? 'role-error' : undefined}
                    >
                      <option value="">Select a role</option>
                      <option value="Founder">Founder</option>
                      <option value="Product">Product</option>
                      <option value="Innovation Lead">Innovation Lead</option>
                      <option value="Research">Research</option>
                      <option value="Investor">Investor</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.role && <span id="role-error" className="error">{errors.role}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="interest">What are you looking for? *</label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      required
                      aria-invalid={errors.interest ? 'true' : 'false'}
                      aria-describedby={errors.interest ? 'interest-error' : undefined}
                    >
                      <option value="">Select an option</option>
                      <option value="Demo">Demo</option>
                      <option value="Pilot">Pilot</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Media">Media</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.interest && <span id="interest-error" className="error">{errors.interest}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your needs..."
                      rows="6"
                      required
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                    {errors.message && <span id="message-error" className="error">{errors.message}</span>}
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="updates"
                        checked={formData.updates}
                        onChange={handleChange}
                      />
                      <span>I'm okay receiving updates about Xinovates.</span>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary form-submit">
                    Send message
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact

