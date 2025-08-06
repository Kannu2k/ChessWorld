import { useState,useEffect } from 'react'
import Board from './Components/Board.jsx'
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
const [socketId, setSocketId] = useState('');
const [currentStatus,setStatus]=useState('');
const [partner,setPartner]=useState('');
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected with ID:', socket.id);
      setSocketId(socket.id);
    });
    socket.on('wait',(msg)=>{
      setStatus(msg);
    })
    socket.on('pairedUp',(partner)=>{
      setStatus(`You are paired up with: ${partner}`)
      setPartner(partner);
    })
    

  
  }, []);

  return (
    <>
    
      <Board></Board>
      <div>Your Socket id is {socketId}</div>
      <div>{currentStatus}</div>
        
    </>
  )
}

export default App
