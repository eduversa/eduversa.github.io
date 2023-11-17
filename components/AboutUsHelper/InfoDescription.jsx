import React, { Fragment, useEffect, useState } from "react";
import { InfoCategory } from "@/components";




const InfoDescription = (props) => {
    const { data } = props
   

    const [showIndex, setshowIndex] = useState(false);
    const handleClick = () => {
        setshowIndex(prev => !prev)
    }

  return (
    <Fragment>
        <div className="accordion-box">    
            <div className='descBox' onClick={handleClick}>
        <span>{data.category}</span>
       
    </div>
    {showIndex && <InfoCategory data = {data.info}/>}
    </div>

    </Fragment>
  )
}

export default InfoDescription