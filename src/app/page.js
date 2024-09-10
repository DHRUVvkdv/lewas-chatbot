import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <nav>
        <button>Login</button>
        <button>Logout</button>
        <Link href="/chat">Go to Dashboard</Link>
      </nav>
    </div>
  )
}