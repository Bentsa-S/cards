import './App.css'
import { Nav } from './components/nav/nav'
import { Outlet } from "react-router-dom";

function App() {
    
  return (
    <>
      <Outlet/>  
      <Nav/>
    </>
  )
}

export default App
