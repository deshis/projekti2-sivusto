
//import Towers from "../services/Towers"

const Overlay = ({isOpen, close, children}) => {
  
    return (
      
    <div>
        {
            isOpen ? (
                <div className='overlay'>
                    <div className="overlayBG" onClick={close} />
                    <div className="overlayContainer">
                        {children}
                    </div>
                </div>
            ) : null
        }
    </div>
  )
}
  
export default Overlay