/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

import { Notes } from './Notes';



export const Home = (props) => {

    return (
        <>
            <div>
                <Notes showAlert={props.showAlert} />
            </div>
        </>
    );
}