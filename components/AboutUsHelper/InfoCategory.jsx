import { Fragment } from "react";


function InfoCategory({ data }) {
    console.log(data);
    return(
        <Fragment>
        <div>
            <div className="layout">
                {
                    data.map((item,i) => (
                       <div className= "accdText" key={i}>
                        <li><h1>{item.heading}</h1></li>
                        <li>{item.description}</li>
                       </div>)
                    )
                }
            
            </div>
        </div>
        </Fragment>
    )
}

export default InfoCategory;