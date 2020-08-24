import Link from 'next/link'

const NavItem = ({ label, href }) => (
  <li key={href} className="nav-item">
    <Link href={href}>
      <a className="nav-link">{label}</a>
    </Link>
  </li>
)

export default ({ currentUser }) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {!!currentUser || <NavItem label="Sign Up" href="/auth/signup" />}
          {!!currentUser || <NavItem label="Sign In" href="/auth/signin" />}
          {!!currentUser && <NavItem label="Sign Out" href="/auth/signout" />}
        </ul>
      </div>
    </nav>
  )
}
