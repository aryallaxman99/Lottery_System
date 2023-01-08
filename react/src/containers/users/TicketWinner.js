import { useState, useEffect } from "react";
const TicketWinner = () => {
  const [ticketList, setTicketList] = useState([]);
  const [stillInTheGame, setStillInTheGame] = useState(true);
  const [typedTicketNo, setTypedTicketNo] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [msg, setMsg] = useState("");

  const color = ["red", "blue", "yellow"];

  const [colorIndex, setColorIndex] = useState(0);
  const fetchTicketData = async () => {
    const data = await fetch(`http://localhost:8000/ticket`);
    const tickets = await data.json();
    const allTicketsList = tickets.map((item) => {
      return item.ticketNo;
    });
    const ticketLists = [];
    allTicketsList.map((item) => {
      return !ticketLists.includes(item) ? ticketLists.push(item) : null;
    });
    setTicketList(ticketLists);
  };
  useEffect(() => {
    fetchTicketData();
  }, []);

  const drawRandom = () => {
    const randomID = Math.floor(Math.random() * ticketList.length);
    const tempTicket = [...ticketList];
    tempTicket.splice(randomID, 1);
    const typedNumInt = Number(typedTicketNo);
    if (tempTicket.includes(typedNumInt)) {
      setStillInTheGame(true);
    } else {
      setStillInTheGame(false);
    }
    setTicketList(tempTicket);
  };

  const validateAndDraw = async () => {
    if (ticketList.length === 2) {
      setMsg("");
      const data = await fetch(
        `http://localhost:8000/users/?name=${currentName}&ticketNo=${typedTicketNo}&color=${color[colorIndex]}`
      );
      const validateRes = await data.json();
      setMsg(validateRes.errMsg || validateRes.msg);
    } else {
      drawRandom();
    }
  };

  const changeColor = () => {
    if (colorIndex === color.length - 1) {
      setColorIndex(0);
    } else {
      setColorIndex(colorIndex + 1);
    }
  };

  if (!stillInTheGame) {
    return <h1>hi you lost</h1>;
  }
  return (
    <>
      {currentName ? <p> hi {currentName}</p> : ""}
      {ticketList.length > 0 &&
        ticketList.map((item, id) => {
          return (
            <div
              onClick={() => changeColor()}
              style={{
                backgroundColor:
                  typedTicketNo.toString() === item.toString()
                    ? color[colorIndex]
                    : null,

                height: "100px",
                width: "100px",
                marginBlock: "10px",
                marginLeft: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item}
            </div>
          );
        })}
      <input
        onKeyUp={(e) => setTypedTicketNo(e.target.value)}
        placeholder="Enter your ticket number"
      />
      <input
        onKeyUp={(e) => setCurrentName(e.target.value)}
        placeholder="Enter your name"
      />
      <h5>{msg}</h5>
      <button onClick={() => validateAndDraw()}>Next draw</button>
    </>
  );
};

export default TicketWinner;
