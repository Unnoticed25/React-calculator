import './App.css';
import {Box, Typography} from "@mui/material";
import {useRef, useState} from "react";
import store from "./store";

let firstClick = 1;
const operators = ['*', '/', '+', '-', '.'];
const fCodes = ['112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123']; // F1-F12
let history = [];

function App() {
    const [sum, setSum] = useState('Введите значение');
    const [cache, setCache] = useState('Здесь будут ваши операции');
    const [modalActive, setModalActive] = useState(0);

    const handleBtnClick = (e) => {

        if (firstClick) {
            setSum('')
            setCache('')
            firstClick--;
        }

        setSum((prev) => prev.concat(e.target.name));
        setCache((prev) => prev.concat(e.target.name));

        if (operators.includes(e.target.name)) {
            if (e.target.name == cache[cache.length - 1]) {
                setSum((prev) => prev.slice(0, -1));
                setCache((prev) => prev.slice(0, -1));
            } else if (operators.includes(cache[cache.length - 1])) {
                setSum((prev) => prev.slice(0, -2).concat(e.target.name));
                setCache((prev) => prev.slice(0, -2).concat(e.target.name));
            }
        }

        if ((sum === '0' || (sum.slice(-2, -1).match(new RegExp(/[*+/-]/gm)))) && e.target.name === '0') {
            setSum((prev) => prev.slice(0, -1));
            setCache((prev) => prev.slice(0, -1));
        }
    }

    function Clear() {
        setSum('Введите значение');
        firstClick = 1;
    }

    function CutOff() {
        if (!firstClick) {
            setSum((prevState) => prevState.slice(0, -1))
            setCache((prevState) => prevState.slice(0, -1))
        }

        if (sum == '') {
            setSum('Введите значение');
            setCache('');
            firstClick = 1;
        }
    }

    function Equal() {
        if (!operators.includes(sum[sum.length - 1]) && !(operators.every((el) => {
            return (
                !(sum.includes(el))
                || (!(sum.split("").filter((cur) => (cur == '-' || cur == '+')).length > 1)
                    && sum.indexOf(el) == 0
                )
            );
        }))) {
            try {
                setSum(eval(sum).toString());
                setCache((prev) => prev.concat(` (${eval(sum).toString()}) `));
                history.push(`${sum} = ${eval(sum).toString()}`)
            } catch (err) {
                setSum('Ошибка');
            }
        }
    }

    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'Enter':
                return Equal();
                break;
            case 'Backspace':
                return CutOff();
            default:
                if (firstClick) {
                    setSum('')
                    setCache('')
                    firstClick--;
                }

                if (e.key.match(new RegExp(/[0-9-+.\\/*]/gm)) && !(fCodes.includes(e.keyCode.toString()))) {
                    setSum((prev) => prev.concat(e.key));
                    setCache((prev) => prev.concat(e.key));
                }

                if (operators.includes(e.key)) {
                    if (e.key == cache[cache.length - 1]) {
                        setSum((prev) => prev.slice(0, -1));
                        setCache((prev) => prev.slice(0, -1));
                    } else if (operators.includes(cache[cache.length - 1])) {
                        setSum((prev) => prev.slice(0, -2).concat(e.key));
                        setCache((prev) => prev.slice(0, -2).concat(e.key));
                    }
                }
                ;
        }

        if ((sum === '0' || (sum.slice(-2, -1).match(new RegExp(/[*+/-]/gm)))) && e.key === '0') {
            setSum((prev) => prev.slice(0, -1));
            setCache((prev) => prev.slice(0, -1));
        }
    }

    function ShowHistory() {
        setModalActive(true);
    }

    return (
        <div className={'wrapper'}>
            <Box className={'main-container'}>
                <input type={'text'} value={sum} onKeyDown={handleKeyDown} autoFocus={true}></input>
                <div className={'sections'}>
                    <Box className={'buffer'}>
                        <Typography sx={{
                            color: "rgba(224,248,255,0.9)",
                            fontSize: 24,
                            p: "5px",
                            fontFamily: '"Oswald", sans-serif;',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                        }}>{cache}</Typography>
                    </Box>

                    <button className={'buffer-list'} onClick={ShowHistory}>История</button>
                    <Box className={modalActive ? "modal active" : "modal"} onClick={() => setModalActive(false)}>
                        <div className={"modal__content"} onClick={e => e.stopPropagation()}>
                            <h3 style={{marginTop: 0}}>История ваших операций</h3>
                            <ul style={{paddingLeft: 0}}>
                                {
                                    history.length > 0 ?
                                    history.reverse().map((elem) => {
                                    return <li className={'history-item'} style={{marginBottom: "6px"}}>{elem}</li>
                                    }) : <p style={{color: "darkgray", textAlign: "center"}}>Никаких операций еще не было</p>
                                }
                            </ul>
                        </div>
                    </Box>

                    {store.buttons.map((item) => {
                        return <button name={item.name} onClick={handleBtnClick}>{item.val}</button>
                    })}
                    <button name='=' onClick={Equal}>=</button>
                    <button id='clear' onClick={Clear}
                            style={{fontSize: 28, gridColumnEnd: 4, gridColumnStart: 1, marginTop: 15}}>Очистить
                    </button>
                    <button id='cutoff' onClick={CutOff} style={{fontSize: 28, marginTop: 15}}>←</button>
                </div>
            </Box>
        </div>
    );
}

export default App;
