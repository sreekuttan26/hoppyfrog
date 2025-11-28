'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import Game_1 from "./components/Game_1";
import Infoscreen from "./components/Infoscreen";
import Entrol from "./components/Entrol";
import Gameboard from "./components/Gameboard";
import CustomAlert from "./components/CustomAlert";
import Welcome from "./components/Welcome";

export default function Home() {

  const conatainerstyle = 'border-4 border-[#be7b17] rounded-xl bg-[#eccb98]'

  const [currentscreen, Setcurrentscreen] = useState('welcome')
  const [playernames, Setplayernames] = useState<string[]>(["", "", "", "", ""])

  


  const changescreen = (screen: string) => {
    Setcurrentscreen(screen)
  }

  const entrolplayers = (players: string[]) => {
    Setplayernames(players)

  }




  return (
    <main className='w-full h-full min-h-screen relative bg-[url(/bg-forest.jpg)] bg-cover p-2'>
      {/* info */}
      <div className='w-full h-screen flex items-center justify-center overflow-hidden '>
        {currentscreen === 'welcome' && (
          <Welcome changescreen={changescreen} />

        )}

        {currentscreen === 'intro' && (
          <Infoscreen changescreen={changescreen} />

        )}


        {currentscreen === 'entrol' && (
          <Entrol changescreen={changescreen} entrolplayers={entrolplayers} />

        )}

        {currentscreen === 'game' && (
          <Gameboard changescreen={changescreen} entroledplayers={playernames} />
          
        )}

     







      </div>









      {/* <Game_1/> */}


    </main>
  );
}
