import { render } from "@testing-library/react";
import React from "react";
import Draggable from "react-draggable";

export default class Note extends React.Component {
    render() {
        return (<>
            <Draggable
                handle=".handle"
                defaultPosition={{ x: 0, y: 0 }}
                grid={[25, 25]}
                scale={1}
            >
                <div className='note'>
                    <div className="handle btn">...</div>
                    <textarea placeholder='می توانید اینجا متنی را وارد نمایید'></textarea>
                </div>
            </Draggable >
        </>)
    }
}