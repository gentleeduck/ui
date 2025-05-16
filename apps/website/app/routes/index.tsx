import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import Header from '~/components/Header'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <div className=''>
        <Header />

        <div className="container mx-auto ">
          <div className="flex flex-col justify-center gap-4 h-[calc(100vh-40px)]">
            <h1 className="text-9xl font-bold text-shadow-sm text-gradient  gradient">
              The Future of
              <br />
              Web Infrastructure
              <br />
              Starts Here
            </h1>
            <h2 className="text-3xl text-gray-900 font-medium text-gradient  gradient">
              Setting Today’s Standards, Shaping Tomorrow’s Market
            </h2>
            <div className="flex gap-4">
              <Button>See Our Products</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
