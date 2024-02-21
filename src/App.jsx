import { Home, Navbar } from "./components";


const App = () => (
  <div className="bg-primary w-full overflow-hidden">
    <div className="sm:px-16 px-6 flex justify-center items-center">
      <Navbar />
      
    </div>
    <div className="divider-vertical" />
    <Home />
  </div>
)

export default App
