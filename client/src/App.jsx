import { useState,useEffect } from 'react'
import Play from './Components/Play.jsx'
import Home from './Components/Home.jsx'
import { Routes, Route } from 'react-router-dom';




function App() {


  
 

  return (
    <>
    <Routes>
      <Route path ='/Play' element = {<Play/>}/>
      <Route path ='/' element = {<Home/>}/>
      


      </Routes>
      
        
    </>
  )
}

export default App
