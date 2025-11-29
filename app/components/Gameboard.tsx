'use client'
import React, { useEffect, useState } from 'react'
import { conatainerstyle } from '../constanats'
import CustomAlert from './CustomAlert'

type probs = {
    entroledplayers: string[]
    changescreen: (screen: string) => void
}

interface cells {
    id?: number;
    image: string;
    type?: string;
    benefit?: string;
    penalty?: string;
    moveBonus: number;
    message: string;
}
interface messages {
    player: string;
    heading: string;
    message: string;
}

const SPECIAL_CELLS: Record<number, cells> = {

    4: {
        type: 'green',
        image: "/4.png",
        benefit: "Amphibians are predators that eat insects, other frogs, snakes, and birds. When termites emerge, frogs eat a lot of them, gaining valuable resources.",
        message: "frog consumed termites! Promoted to 10",
        moveBonus: 6
    },

    8: {
        type: 'red',
        image: "/8.png",
        penalty: "Species compete for resources when sharing the same space. Some avoid competition by changing activity or shifting to different resources.",
        message: "frog got hungry from Competition! Go back to start",
        moveBonus: -7
    },

    12: {
        type: 'red',
        image: "/12.png",
        penalty: "Amphibians are ectothermic, meaning their body temperature closely matches the environment. High temperatures dehydrate them and restrict movement, while also drying up habitats.",
        message: "frog got heat shock! Going back 6 steps",
        moveBonus: -6
    },

    19: {
        type: 'red',
        image: "/19.png",
        penalty: "Linear obstacles such as roads, railways, and power lines can impede animal migration, posing a threat to slower species like amphibians and affecting vegetation. Females carrying eggs are especially vulnerable, which can have repercussions for future generations.",
        message: "frog could not cross the road! Going back to Start",
        moveBonus: -18
    },

    26: {
        type: 'red',
        image: "/26.png",
        penalty: "Water bodies have industrial effluents and chemicals flowing in. Frogs are sensitive to water quality and respond to alkaline or acidic water. Dumping of rubbish also impacts habitat quality.",
        message: "frog exposure to hazardous chemicals! Going back 6 steps",
        moveBonus: -6
    },

    27: {
        type: 'green',
        image: "/27.png",
        benefit: "Rainfall increases amphibian activity as they search for breeding habitats. Flowing water facilitates tadpole dispersal between habitats.",
        message: "frog has FOUND A STREAM! Promoted to 40",
        moveBonus: 13
    },

    33: {
        type: 'red',
        image: "/33.png",
        penalty: "Amphibians are an important component in the food chain. They are consumed by predators such as snakes. Snakes can follow scent trails or lie in wait and capture them.",
        message: "frog encountered a snake ! Going back 12 steps",
        moveBonus: -12
    },

    38: {
        type: 'red',
        image: "/38.png",
        penalty: "Urbanisation alters ecosystems by clearing lakes and forests, impacting amphibians unable to move freely.",
        message: "frog could not move through the city! Going back one step",
        moveBonus: -1
    },

    39: {
        type: 'green',
        image: "/39.png",
        benefit: "Ephemeral pools are vital for frogs, providing temporary shelter, food, and water during dry spells, supporting their survival in changing environments.",
        message: "frog feels rejuvenated! Promoted to 41",
        moveBonus: 2
    },

    45: {
        type: 'green',
        image: "/45.png",
        benefit: "In gardens with native grass, wild growth attracts insects and creates moist areas for amphibians, unlike manicured lawns that lack biodiversity.",
        message: "frog is energized! Promoted to 47",
        moveBonus: 2
    },

    50: {
        type: 'red',
        image: "/50.png",
        penalty: "Amphibians are vital in the food chain. Bats prey on frogs using echolocation. Male frogs are particularly vulnerable to bat predation while vocalising in the open.",
        message: "frog encountered a bat! Going back one step",
        moveBonus: -1
    },

    57: {
        type: 'red',
        image: "/57.png",
        penalty: "Pesticides in crops can harm frogs by reducing their food source, affecting hormones that decrease agility, making them more vulnerable to predators, and causing physical deformities with prolonged exposure.",
        message: "frog is deformed! Going back one step",
        moveBonus: -1
    },

    60: {
        type: 'red',
        image: "/60.png",
        penalty: "Amphibians, mainly found in forests, suffer from deforestation due to development. Even after forests regenerate post-logging, they still experience negative effects.",
        message: "frog lost its habitat! Going back one step",
        moveBonus: -1
    },

    67: {
        type: 'red',
        image: "/67.png",
        penalty: "Amphibians play a crucial role in the food chain. Various invertebrates like house centipedes prey on frogs. Predation can happen both during the day and at night.",
        message: "frog got attacked by a centipede! Going back to Start",
        moveBonus: -66
    },

    69: {
        type: 'green',
        image: "/69.png",
        benefit: "In gardens with native grass, wild growth attracts insects and creates moist areas for amphibians, unlike manicured lawns that lack biodiversity.",
        message: "frog is energized! Promoted to 70",
        moveBonus: 1
    },

    72: {
        type: 'red',
        image: "/72.png",
        penalty: "Competition for resources happens when individuals or species sharing the same area adjust their activity period or switch to alternative resources to avoid competition.",
        message: "frog got hungry from Competition! Going to 45",
        moveBonus: -27
    },

    78: {
        type: 'red',
        image: "/78.png",
        penalty: "Amphibians face infection risks due to their moist skin. While skin secretions offer protection, the Batrachochytrium dendrobatidis fungus can be fatal, especially exotic strains. Native resistance exists, but exotic strains can cause significant population declines.",
        message: "frog got infected by fungus! Going Back to start",
        moveBonus: -77
    },

    80: {
        type: 'green',
        image: "/80.png",
        benefit: "Rainfall increases amphibian activity as they search for breeding habitats. Flowing water facilitates tadpole dispersal between habitats.",
        message: "frog has FOUND A STREAM! Promoted to 92",
        moveBonus: 12
    },

    84: {
        type: 'green',
        image: "/84.png",
        benefit: "Amphibians are predators that primarily eat insects but also consume other frogs, snakes, and birds. They benefit from eating insects like crickets to gain resources.",
        message: "frog consumed Crickets! Promoted to 86",
        moveBonus: 2
    },

    90: {
        type: 'red',
        image: "/90.png",
        penalty: "Urbanisation alters ecosystems by clearing lakes and forests, impacting amphibians unable to move freely.",
        message: "frog could not move through the city! Going back one step",
        moveBonus: -1
    },

    93: {
        type: 'green',
        image: "/93.png",
        benefit: "Trees cool their surroundings, collect leaf litter for insects, and offer shelter to frogs.",
        message: "frog feels rejuvenated! Promoted to 95",
        moveBonus: 2
    },

    96: {
        type: 'red',
        image: "/96.png",
        penalty: "Frogs are important in the food chain as they are preyed upon by many bird species, both during the day and at night.",
        message: "frog spotted by a bird! Going back one step",
        moveBonus: -1
    },

    98: {
        type: 'red',
        image: "/98.png",
        penalty: "Amphibians face infection risks due to their moist skin. While skin secretions offer protection, the Batrachochytrium dendrobatidis fungus can be fatal, especially exotic strains. Native resistance exists, but exotic strains can cause significant population declines.",
        message: "frog got infected by fungus! Going Back to start",
        moveBonus: -97
    },

    100: {
        type: 'green',
        image: "/100.png",
        benefit: "Wow! you won",
        message: "Game Over",
        moveBonus: 0
    }


};


const Gameboard = ({ entroledplayers, changescreen }: probs) => {

    const cleanedplayerlist = entroledplayers.filter(item => item !== "");
    const [isrolling, Setisrolling] = useState(false)

    const [messages, setMessages] = useState<messages[]>([]);

    const [diceimg, Setdiceimg] = useState("/dice_3.gif")

    const [scores, Setscores] = useState<number[]>([0])

    const [currentplayerindex, Setcurrentplayerindex] = useState<number>(0)

    const [currentdicevalue, Setcurrentdicevalue] = useState(1)

    const [alertmessage, Setalertmessage] = useState('')
    const [alertdesc, Setalertdesc] = useState('')
    const [alertimg, setalertimg] = useState('')
    const [modelview, Setmodelview] = useState(false)

    const [showPopup, setShowPopup] = useState(false);
    const [popupOkHandler, setPopupOkHandler] = useState<() => void>(() => { });

    const [showresult, Setshowresult] = useState(false)

    const[popuptext, Setpopuptext]=useState("OK")

    const [showreload, Setshowreload]=useState(false)

   

    const updatemessages = (player: string, heading: string, message: string) => {
        setMessages(prev => [
            ...prev,
            { player: player, heading: heading, message: message }
        ]);
    }



    const waitForPopup = (): Promise<void> => {
        return new Promise((resolve) => {
            // Show popup by updating state
            setShowPopup(true);

            // When user clicks OK, call resolve()
            const handleOk = () => {
                setShowPopup(false);
                Setshowresult(false)
                resolve();
            };

            // Expose the handler to your popup
            setPopupOkHandler(() => handleOk);
        });
    };

    const updatemodelstate = () => {
        Setmodelview(!modelview)
    }

    const handlediceRoll = async () => {
        if (isrolling) {
            return;
        }
        Setisrolling(true)
        Setdiceimg(`/dice.gif`)
        const dicevalue = Math.floor(Math.random() * 6) + 1;
        Setcurrentdicevalue(dicevalue)
        playdice()
        await new Promise((resolve) => setTimeout(resolve, 3010));



        Setdiceimg(`/dice_${dicevalue}.gif`)

        const newscore = scores[currentplayerindex] + dicevalue;
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (newscore === 100) {

            Setisrolling(false)


            updatecurrentplayer();

        }
        

        const heading0 = SPECIAL_CELLS[newscore]?.penalty ? 'Penality' : 'Benefit'
            const player_0 = cleanedplayerlist[currentplayerindex] + " @ " + scores[currentplayerindex];


           



        if (newscore > 100) {
            // alert("score more than 100")
            Setisrolling(false)
             updatemessages(player_0, heading0, "Can not move over 100")
            updatecurrentplayer();

            return
        }

        for (let i = 1; i <= dicevalue; i++) {
            Setscores(prevScores => {
                const newScores = [...prevScores];
                newScores[currentplayerindex] += 1; // move one step at a time
                return newScores;
            });
            playfrogcall()

            // wait 500ms (or 1000ms) between steps
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const currentplayerscore = newscore;



        if (SPECIAL_CELLS[currentplayerscore]) {
            const bonus = SPECIAL_CELLS[currentplayerscore].moveBonus;

           

            const currentmesasge=SPECIAL_CELLS[currentplayerscore] ? SPECIAL_CELLS[currentplayerscore].message : "";
            Setalertmessage(SPECIAL_CELLS[currentplayerscore] ? SPECIAL_CELLS[currentplayerscore].message : "")
            setalertimg(SPECIAL_CELLS[currentplayerscore] ? SPECIAL_CELLS[currentplayerscore].image : "")
            Setalertdesc(
                SPECIAL_CELLS[currentplayerscore]?.penalty
                ?? SPECIAL_CELLS[currentplayerscore]?.benefit
                ?? ""
            ); 
            
            if(bonus===0){
                 Setalertdesc('Game Over for' +cleanedplayerlist[currentplayerindex])
                
            }

            playwindow();
            await waitForPopup();

           
            const heading = SPECIAL_CELLS[currentplayerscore]?.penalty ? 'Penality' : 'Benefit'
            const player_ = cleanedplayerlist[currentplayerindex] + " @ " + scores[currentplayerindex];


            updatemessages(player_, heading, currentmesasge)



            if (bonus > 0) {
                // Move forward

                for (let i = 1; i <= bonus; i++) {
                    Setscores(prevScores => {
                        const newScores = [...prevScores];
                        newScores[currentplayerindex] += 1; // move one step forward
                        return newScores;
                    });
                    if (scores[currentplayerindex] === 100) {

                    } else
                        playfrogcall()
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } else {
                // Move backward
                if (bonus * (-1) > 10) {
                    playlose()
                }

                for (let i = 1; i <= Math.abs(bonus); i++) {
                    Setscores(prevScores => {
                        const newScores = [...prevScores];
                        newScores[currentplayerindex] -= 1; // move one step backward
                        return newScores;
                    });
                    if (bonus * (-1) > 10) {

                    } else {
                        playfrogcall();
                    }

                    await new Promise(resolve => setTimeout(resolve, 10));
                }

            }
        }





        Setisrolling(false)
        updatecurrentplayer();




    }
    const reload=()=>{
        window.location.reload();
    }


    const updatecurrentplayer = async () => {

        console.log("scores: "+scores)
        if(scores.every(score => score === 100)){
            setPopupOkHandler(() => reload);
            Setpopuptext('Restart')
            Setalertmessage('Game Over')
            setalertimg('/100.png')
            Setalertdesc('All players finished the game.')
            Setshowreload(true)
            await waitForPopup();

            return;
        }


        Setcurrentplayerindex((prev) => {
            let next = prev;
            const n = cleanedplayerlist.length;         

           

            // Loop until we find a player whose score is not 100
            do {
                next = (next + 1) % n;  // move to the next player circularly
            } while (scores[next] === 100);

            return next;
        });

    }
    useEffect(()=>{
        //[0, 0, 0, 0]
        let tempscorearry:number[]=[]
        Array.from({length:entroledplayers.length},(_,i)=>{
            tempscorearry.push(0)
           
        })
        Setscores(tempscorearry)


    },[])

    useEffect(() => {
        if (scores[currentplayerindex] === 100) {
            playwin();
        }
        




    }, [scores])



    const playfrogcall = () => {
        const sound = new Audio('/mp3/frog.mp3');
        sound.currentTime = 0;  // restart from the beginning
        sound.play();

    }
    const playlose = () => {
        const sound = new Audio('/mp3/lose.mp3');
        sound.currentTime = 0;  // restart from the beginning
        sound.play();

    }
    const playwin = () => {
        const sound = new Audio('/mp3/win.mp3');
        sound.currentTime = 0;  // restart from the beginning
        sound.play();

    }
    const playdice = () => {
        const sound = new Audio('/mp3/dice.mp3');
        sound.currentTime = 0;  // restart from the beginning
        sound.play();

    }
    const playwindow = () => {
        const sound = new Audio('/mp3/window.mp3');
        sound.currentTime = 0;  // restart from the beginning
        sound.play();

    }


    return (
        <div className="w-full h-full flex flex-col md:flex-row">
            <div className='w-full h-full flex gap-2  md:h-[95vh] md:w-2/3 mx-2'>
                <div className={`w-full  flex ${conatainerstyle} p-2 items-end flex-wrap-reverse`}>
                    {Array.from({ length: 100 }, (_, i) => {

                        const totalCells = 100;
                        const cellsPerRow = 10;

                        const row = Math.floor(i / cellsPerRow);
                        const col = i % cellsPerRow;



                        const isEvenRow = row % 2 === 0;

                        const cellNumber = isEvenRow
                            ? row * 10 + col + 1
                            : row * 10 + (9 - col) + 1;

                        const style = SPECIAL_CELLS[cellNumber] ? { backgroundImage: `url('/${cellNumber}.png')` } : undefined;


                        return (
                            <div key={i} className={`w-[10%] h-[10%] p-2 border border-slate-500 flex items-centre justify-centre bg-cover bg-center`}
                                style={style}


                            >
                                {cellNumber}
                                <div className='flex flex-wrap w-full h-full items-end gap-2'>
                                    

                                    <img src='/frog-0.png' className={` ${scores[0] === (cellNumber) ? 'flex ' : 'hidden'} ${currentplayerindex == 0 ? "md:bg-white animate-bounce md:w-2/4 " : 'md:bg-gray-500 md:w-1/4 '}    md:p-1  md:ring-amber-300 md:ring-1  duration-75 md:rounded-full .d:object-conatin`} />

                                    <img src='/frog-1.png' className={` ${scores[1] === (cellNumber) ? 'flex ' : 'hidden'} ${currentplayerindex == 1 ? "md:bg-white animate-bounce md:w-2/4 " : 'md:bg-gray-500 md:w-1/4 '}    md:p-1  md:ring-amber-300 md:ring-1  duration-75 md:rounded-full .d:object-conatin`} />

                                    <img src='/frog-2.png' className={` ${scores[2] === (cellNumber) ? 'flex ' : 'hidden'} ${currentplayerindex == 2 ? "md:bg-white animate-bounce md:w-2/4 " : 'md:bg-gray-500 md:w-1/4 '}    md:p-1  md:ring-amber-300 md:ring-1  duration-75 md:rounded-full .d:object-conatin`} />

                                    <img src='/frog-3.png' className={` ${scores[3] === (cellNumber) ? 'flex ' : 'hidden'} ${currentplayerindex == 3 ? "md:bg-white animate-bounce md:w-2/4 " : 'md:bg-gray-500 md:w-1/4 '}    md:p-1  md:ring-amber-300 md:ring-1  duration-75 md:rounded-full .d:object-conatin`} />

                                    {/* <img src='/frog-1.png' className={` ${scores[1] === (cellNumber) ? 'flex ' : 'hidden'} ${currentplayerindex == 1 ? "bg-white animate-bounce" : 'bg-gray-500'}  w-1/5   p-1 ring-amber-300 ring-1  duration-75 rounded-full object-conatin`} />

                                    <img src='/frog-2.png' className={` ${scores[2] === (cellNumber) ? 'flex' : 'hidden'} ${currentplayerindex == 2 ? "bg-white animate-bounce" : 'bg-gray-500'}  w-1/5  p-1 ring-amber-300 ring-1  duration-75 rounded-full object-conatin`} />

                                    <img src='/frog-3.png' className={` ${scores[3] === (cellNumber) ? 'flex ' : 'hidden'} ${currentplayerindex == 3 ? "bg-white animate-bounce" : 'bg-gray-500'}   w-1/5   p-1 ring-amber-300 ring-1  duration-75 rounded-full object-conatin`} /> */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>














            <div className={`${conatainerstyle} md:w-1/3 md:h-[95vh] flex flex-col gap-5 items-center p-4`}>
                <h1 className="w-auto text-2xl font-semibold">Hoppy Frog Game</h1>
                
                <div className=' bg-orange-100 rounded-xl p-4 w-full flex flex-col items-center gap-2 '>
                    <img
                        src={diceimg}
                        className='h-[50px] object-conatin'

                    />
                    <p>{cleanedplayerlist[currentplayerindex]}</p>
                    <button onClick={handlediceRoll}
                        className={`p-2 px-4 rounded-xl disabled:${isrolling}  mt-5  text-center border-4 cursor-pointer ${isrolling ? 'animate-bounce bg-gray-500 border-gray-300 text-white' : 'bg-orange-200'}`}>
                        {isrolling ? 'Running' : 'Roll Dice'}
                    </button>
                </div>

                <div className='w-full flex gap-2 items-center justify-center'>
                    {cleanedplayerlist.map((player, i) => (
                        player.length > 0 &&
                        <div key={i} className={`p-4 rounded-xl text-sm border-2 ${cleanedplayerlist[currentplayerindex] === player ? 'bg-yellow-300' : ''} `}>
                            <div className='flex flex-col gap-2 items-center font-semibold'>
                                {player}
                                <span className='font-normal'>{scores[i]}</span>
                                <img
                                    src={`frog-${i}.png`}
                                    className='w-[25px] object-contain '
                                />
                            </div>
                        </div>

                    ))}



                </div>

                <div className=' bg-orange-100 rounded-xl p-4 w-full flex flex-col items-center gap-2 h-[50vh] overflow-y-scroll '>
                    <h1 className="text-xl font-semibold">Messages</h1>
                    <div className="w-full flex flex-col gap-4">

                        {[...messages].reverse().map((item, i) => (
                            <div key={i} className="border-b-2 py-4">
                                <h1 className="font-semibold">{item.player}</h1>
                                <p className="text-sm">{item.message}</p>
                                <p className="text-xs opacity-70"></p>
                            </div>
                        ))}

                    </div>
                </div>
                <p>Developed by ATREE Communications</p>
            </div>

            {showPopup && (
                <div className="modal-overlay h-full absolute  inset-0 flex items-center justify-center">
                    <div className='h-full  w-full absolute  inset-0 flex items-center justify-center bg-black opacity-50 z-5'></div>


                    <div className={` w-auto max-w-1/3 h-auto flex  gap-2 p-4 rounded-xl ${conatainerstyle} z-10`}>
                        <img
                            src={alertimg} className='h-[200px] object-conatin' />
                        <div className='flex flex-col gap-2 '>
                            <p className="font-semibold text-center">{alertdesc}</p>
                            <button onClick={() => { Setshowresult(true) }} className={`p-2 bg-[#be7b17] text-white rounded-xl animate-bounce m-5 ${showreload?'hidden':'flex'}  ${showresult ? 'hidden' : 'flex flex-col'}`}>Check what happend</button>

                            <div className={`${showresult ? 'flex flex-col' : 'hidden'}  w-full  gap-2 items-center justify-center`}>

                                <p className="font-semibold border-2 p-2 bg-[#d1b07e] uppercase text-center rounded-xl animate-bounce">{alertmessage}</p>
                                <button className={` ${showreload?'hidden':'flex'}  p-2 px-4 bg-[#be7b17] text-white rounded-xl  m-5`} onClick={popupOkHandler}>{popuptext}</button>
                               
                            </div>

                            <div className={`${showreload?'flex flex-col':'hidden'}  w-full  gap-2 items-center justify-center`}>
                                 <button className={` p-2 px-4 bg-[#be7b17] text-white rounded-xl  m-5`} onClick={reload}>{popuptext}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}



        </div>
    )
}

export default Gameboard
