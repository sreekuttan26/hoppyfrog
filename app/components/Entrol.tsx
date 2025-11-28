'use client'
import React, { useState, useEffect } from 'react'
import { conatainerstyle } from '../constanats'

type probs = {
    changescreen: (screen: string) => void
    entrolplayers: (players: string[]) => void
}

const Entrol = ({ changescreen, entrolplayers }: probs) => {
    const [numberofplayers, Setnumberofplayers]=useState(2)
    const[playernames, Setplayernames]=useState<string[]>(["", "", "", "", ""])
    const[isplayersentroled, Setisplayersentrolled]=useState(false)

    const opengameboard=()=>{
        playernames.map((player,i)=>{
            if(i<numberofplayers){
                if(player.length<1){
                     Setisplayersentrolled(false)
                    alert('player list ')
                    
                    return;
                }else{
                    Setisplayersentrolled(true)

                }
            }
        })

        if(isplayersentroled){
              changescreen('game')
        entrolplayers(playernames)
        }
      


    }


    useEffect(()=>{


    },[])


    return (
        <div className={` w-auto h-auto p-4 px-8 flex flex-col gap-4 items-center ${conatainerstyle} `}>
            <h1 className='text-2xl font-bold '>Entrol Players </h1>
            <span>Select Number of Players </span>
            <div className="flex gap-2">
              {Array.from({length:5},(_,i)=>(
                i > 1 ? <div key={i} className="p-2 border-2 hover:bg-orange-100 cursor-pointer " onClick={()=>{Setnumberofplayers(i)}}>{i}</div> : null
                
                
              ))}
            </div>

            <div className="flex gap-2 flex-col">
              {Array.from({length:numberofplayers},(_,i)=>(
               <input key={i}  onChange={(e) => {
                                    Setplayernames(prev =>
                                        prev.map((name, idx) =>
                                            idx === i ? e.target.value : name
                                        )
                                    );}}
               className='p-2 border-2 rounded-xl bg-orange-200' placeholder={`Enter name of player ${i+1}`}></input>
                
                
              ))}
            </div>
        



            <button onClick={opengameboard} className={`bg-[#be7b17] text-white p-2 rounded-2xl px-4 cursor-pointer`}>Let's Get Started</button>
        </div>
    )
}

export default Entrol
