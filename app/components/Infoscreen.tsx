import React from 'react'
import { conatainerstyle } from '../constanats'

type probs = {
    changescreen: (screen: string) => void
}

const Infoscreen = ({ changescreen }: probs) => {
    return (
        <div className={`  p-4 flex flex-col gap-4 items-center ${conatainerstyle} `}>
            <h1 className='text-2xl font-bold '>Welcome to Hoppy Frog Game </h1>
            <span>info about the game </span>

            <button onClick={()=>{changescreen('entrol')}} className={`bg-[#be7b17] text-white p-2 rounded-2xl px-4 cursor-pointer`}>Let's Get Started</button>
        </div>
    )
}

export default Infoscreen
