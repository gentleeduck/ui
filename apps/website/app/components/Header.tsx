import { Link } from '@tanstack/react-router'
import Logo from "~/assets/logomark.svg?react"

export default function Header() {
  return (
    <header className="mx-auo py-5 px-10 h-10 flex gap-2 text-white justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/"><Logo width={40} height={40} /></Link>
        </div>
      </nav>
    </header>
  )
}
