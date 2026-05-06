import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/map')({
  component: MapPage,
})

function MapPage() {
  return (
    <div className="-m-3.5 sm:-m-5 lg:-m-6 h-[calc(100svh-4.25rem)] sm:h-[calc(100svh-4.75rem)] lg:h-[calc(100svh-5.25rem)] overflow-hidden rounded-lg">
      <iframe
        src="https://game-map.frontleaves.com/?world=world"
        className="h-full w-full border-0"
        title="服务器地图"
        allowFullScreen
      />
    </div>
  )
}
