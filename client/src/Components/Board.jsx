import { Chessboard } from "react-chessboard";
import { useState,useRef } from "react";
import { Chess } from "chess.js";
import './Styling/Board.css';
import { useEffect } from "react";
import { io } from 'socket.io-client';
import Play from './Play.jsx'
 // Game engine instance

function Board() {
   // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());
    const [socketId, setSocketId] = useState('');
const [currentStatus,setStatus]=useState('');
const [partner,setPartner]=useState('');
const socketRef = useRef(null)


  useEffect(() => {
    socketRef.current = io('http://localhost:4000');
    const socket = socketRef.current
    
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
    socket.on('recieveMove',(position)=>{
      chessGame.load(position);

      setChessPosition(position);
    })
    

  
  }, []);

   
      
     

   
    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare
    }) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare) {
        return false;
      }

      // try to make the move according to chess.js logic
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q' // always promote to a queen for example simplicity
        });

        // update the position state upon successful move to trigger a re-render of the chessboard
          
        setChessPosition(chessGame.fen());
         chessGame.load(chessGame.fen());
        const socket = socketRef.current;
        socket.emit('sendMove',chessGame.fen());
        
        

        


        

        // return true as the move was successful
        return true;
      } catch {
        // return false as the move was not successful
        return false;
      }
    }

    // set the chessboard options
    const chessboardOptions = {
      position: chessPosition,
      onPieceDrop,
      
    };

    // render the chessboard
    return (
    <div className="board">
    <Chessboard options={chessboardOptions} />
      <div>Your Socket id is {socketId}</div>
      <div>{currentStatus}</div>
    </div>

    );
   
}

export default Board;