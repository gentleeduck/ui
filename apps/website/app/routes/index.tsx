import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import Header from '~/components/Header'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <div className="">
        <Header />

        <div className="container mx-auto px-10">
          <div className="flex flex-col max-sm:text-center justify-center gap-4 h-[calc(100vh-40px)] text-pretty text-primary">
            <h1 className="text-4xl  sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-shadow-sm">
              The Future of
              <br />
              Web Infrastructure
              <br />
              Starts Here
            </h1>
            <h2 className="text-xl  md:text-2xl lg:text-3xl xl:text-4xl  font-medium   ">
              Setting Today’s Standards, Shaping Tomorrow’s Market
            </h2>
            <div className="flex gap-4 max-sm:mx-auto">
              <Button>See Our Products</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
