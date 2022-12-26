import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WinnerSelector = () => {
  const [ticketList, setTicketList] = useState([]);
  const [winnerTicketNumber, setWinnerTicketNumber] = useState(null);
  const [winnerTicketColor, setWinnerTicketColor] = useState(null);
  const [drawResponse, setDrawResponse] = useState("");
  const color = ["red", "blue", "yellow"];

  const fetchTicketData = async () => {
    const data = await fetch("http://localhost:8000/ticket");
    const tickets = await data.json(data);
    const allTicketsList = tickets.map((item) => {
      return item.ticketNo;
    });

    const ticketLists = [];
    allTicketsList.map((item) => {
      return !ticketLists.includes(item) ? ticketLists.push(item) : null;
    });

    setTicketList(ticketLists);
  };

  const predictWinner = () => {
    const randomIndexForTicketNumber = Math.floor(
      Math.random() * ticketList.length
    );
    setWinnerTicketNumber(ticketList[randomIndexForTicketNumber]);

    const randomIndexForTicketColor = Math.floor(Math.random() * color.length);
    setWinnerTicketColor(color[randomIndexForTicketColor]);
  };
  const navigate = useNavigate();
  const saveWinner = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        color: winnerTicketColor,
        ticket: winnerTicketNumber,
      }),
    };
    fetch("http://localhost:8000/winner", requestOptions)
      .then((res) => res.json())
      .then((data) => setDrawResponse(data.msg));
  };

  useEffect(() => {
    fetchTicketData();
  }, []);

  return (
    <div>
      {!drawResponse ? (
        <>
          <button onClick={() => predictWinner()}>Assign Winner</button>
          <button onClick={() => saveWinner()}>Save Winner</button>
        </>
      ) : (
        <h2>{drawResponse}</h2>
      )}
      {ticketList.length > 0 &&
        ticketList.map((item, id) => {
          return (
            <div
              style={{
                backgroundColor:
                  winnerTicketNumber === item ? winnerTicketColor : null,
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
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        back to homepage
      </button>
    </div>
  );
};

export default WinnerSelector;
