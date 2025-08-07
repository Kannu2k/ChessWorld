import { useState,useEffect } from 'react'


import { useNavigate } from 'react-router-dom';




function Home() {
    const navigate = useNavigate();

    function searchOpponent()
    {
        navigate('/Play')
    }
  
 

  return (
    <>
    <button onClick ={searchOpponent}>Find Opponent</button>
      
        
    </>
  )
}

export default Home
