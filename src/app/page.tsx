import { redirect } from 'next/navigation'

export default function Home() {
    redirect('/chat')
    return <main>Home page</main>
}
