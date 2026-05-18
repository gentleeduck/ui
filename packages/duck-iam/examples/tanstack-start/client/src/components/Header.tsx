import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex items-center gap-x-4 py-3">
        <Link
          activeProps={{ className: 'nav-link is-active' }}
          className="m-0 inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold no-underline"
          to="/"
        >
          <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
          duck-iam · demo
        </Link>
        <div className="flex flex-wrap items-center gap-x-3 text-sm font-semibold">
          <Link activeProps={{ className: 'nav-link is-active' }} className="nav-link" to="/posts">
            Posts
          </Link>
          <Link activeProps={{ className: 'nav-link is-active' }} className="nav-link" to="/users">
            Users
          </Link>
          <Link activeProps={{ className: 'nav-link is-active' }} className="nav-link" to="/iam">
            IAM devtools
          </Link>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
