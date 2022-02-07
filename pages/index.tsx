import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <main className="">
        <Sidebar />
        {/* {Center} */}
      </main>

      <div>{/* {Player} */}</div>
    </div>
  )
}
