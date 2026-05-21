import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/map')({
  component: MapPage,
})

function MapPage() {
  return (
    <iframe
      src="https://game-map.frontleaves.com/?world=world"
      className="-m-3.5 sm:-m-5 lg:-m-6 h-[calc(100svh-3.25rem)] sm:h-[calc(100svh-3.75rem)] lg:h-[calc(100svh-5.25rem)] w-[calc(100%+1.75rem)] sm:w-[calc(100%+2.5rem)] lg:w-[calc(100%+3rem)] border-0 rounded-xl"
      title="服务器地图"
      allowFullScreen
    />
  )
}
