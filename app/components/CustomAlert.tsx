import { useEffect, useState } from 'react'

type probs={
    message:string;
    model:boolean;
    updatemodelstate:()=>void;
}


function MyModal({ open, onClose, message }: { open: boolean, onClose: () => void, message:string }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4">
        <p>{message}</p>
        <button onClick={onClose}>Continue</button>
      </div>
    </div>
  )
}

export default function PageComponent({message, model, updatemodelstate}:probs) {
  const [modalOpen, setModalOpen] = useState(model)
  const [modalResolver, setModalResolver] = useState<(() => void) | null>(null)

  const showModalAndWait = (): Promise<void> => {
    return new Promise(resolve => {
      setModalOpen(true)
      setModalResolver(() => resolve)
    })
  }

  const handleClose = () => {
    setModalOpen(false)
    if (modalResolver) modalResolver()
        updatemodelstate()
  }

  const runLoop = async () => {
    for (let i = 1; i <= 10; i++) {
      console.log("Iteration", i)
      if (i === 5) {
        await showModalAndWait()
      }
      // ... other work for iteration i
      console.log("Finished iteration", i)
    }
  }

  useEffect(()=>{
    setModalOpen(model)

    
  },[model])

  return (
    <div>
     
      <MyModal open={modalOpen} onClose={handleClose} message={message} />
    </div>
  )
}
