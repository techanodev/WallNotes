import React from "react";
import Draggable from "react-draggable";
import { ColorResult, TwitterPicker } from 'react-color'
import $ from 'jquery'

export default class Note extends React.Component {

    colorChange(e: ColorResult) {
        $('.note').css('background-color', `rgb(${e.rgb.r},${e.rgb.g},${e.rgb.b})`)
    }

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
                    <input className="color-picker" type="color" />
                    <textarea placeholder='می توانید اینجا متنی را وارد نمایید'></textarea>

                    <TwitterPicker onChange={(e) => this.colorChange(e)} triangle='top-right' className="color-picker" />
                </div>
            </Draggable >
        </>)
    }
}