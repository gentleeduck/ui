import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import Header from '~/components/Header'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <div className='gradient'>
        <Header />

        <div className="container mx-auto ">
          <div className="flex flex-col justify-center gap-4 h-[calc(100vh-40px)]">
            <h1 className="text-9xl font-bold text-shadow-lg invert text-gradient  gradient">
              The Future of
              <br />
              Web Infrastructure
              <br />
              Starts Here
            </h1>
            <div className="flex gap-4 dark">
              <Button>See Our Products</Button>
              <Button variant="outline">About us</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
