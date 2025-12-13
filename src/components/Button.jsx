import { Link } from 'react-router-dom'
import './Button.css'

function Button({ to, href, children, variant = 'primary', className = '', onClick, type = 'button' }) {
  const baseClass = `btn btn-${variant} ${className}`

  if (to) {
    return (
      <Link to={to} className={baseClass} onClick={onClick}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={baseClass} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={baseClass} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button

