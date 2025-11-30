import React from 'react'
import { conatainerstyle } from '../constanats'

type probs = {
    changescreen: (screen: string) => void
}

const Infoscreen = ({ changescreen }: probs) => {
    return (
        <div className={`  p-4 flex flex-col gap-4 items-center ${conatainerstyle} md:w-2/3 lg:w-1/2`}>
            <h1 className='text-2xl font-bold '>Welcome to Hoppy Frog Game </h1>
            <span className="text-center"><p className="font-semibold">Welcome to the fascinating world of amphibians!</p><br></br>
Amphibians are remarkable creatures that have colonized every imaginable place, except for the permanently frozen regions and the oceans. Amphibians comprise frogs and toads, salamanders and newts, and caecilians. Amphibians are characteristic in their remarkable array of adaptations that enable them to thrive in diverse habitats. From the tropical rainforests to the arid deserts, amphibians play integral roles in ecosystems as both predators and prey and serve as valuable indicators of environmental health.</span>

            <button onClick={()=>{changescreen('entrol')}} className={`bg-[#be7b17] text-white p-2 rounded-2xl px-4 cursor-pointer`}>Let's Get Started</button>
        </div>
    )
}

export default Infoscreen
