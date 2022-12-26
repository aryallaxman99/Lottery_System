import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const LotterySchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  ticketNumber: Yup.number()
    .min(0, "Ticket Number must be between 1-499")
    .max(500, "Ticket Number must be between 1-499")
    .required("Required"),
});

const TicketWinner = () => {
  const [ticketList, setTicketList] = useState([]);
  const [usersTicket, SetUsersTicket] = useState(null);
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const color = ["red", "blue", "yellow"];
  const [boxColor, setBoxColor] = useState(color[count]);
  const [stillInTheGame, setStillInTheGame] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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

  const changeColor = () => {
    setBoxColor(color[count]);
    setCount(count + 1);
    if (count > 1) {
      setCount(0);
    }
  };

  const drawRandom = () => {
    const tempTicketList = [...ticketList];
    const randomID = Math.floor(Math.random() * ticketList.length);
    tempTicketList.splice(randomID, 1);
    setTicketList(tempTicketList);
    hasLost(tempTicketList);
  };
  const checkingValidUser = async (inputName) => {
    const data = await fetch(`http://localhost:8000/users?name=${inputName}`);
    const validateResponse = await data.json();
    if (validateResponse.errormsg) {
      setErrorMsg(validateResponse.errormsg);
    } else {
      setErrorMsg("");
      drawRandom();
    }
  };

  const hasLost = (tempTicketList) => {
    if (tempTicketList.includes(Number(usersTicket))) {
      setStillInTheGame(true);
    } else {
      setStillInTheGame(false);
    }
  };
  if (!stillInTheGame) {
    return <h1>You Lost</h1>;
  } else if (stillInTheGame && ticketList.length === 1) {
    return <h1> winner ticket number is {ticketList}</h1>;
  } else {
    return (
      <>
        <>{name}</>
        <Formik
          initialValues={{
            fullName: "",
            ticketNumber: null,
          }}
          validationSchema={LotterySchema}
          onSubmit={(values) => {
            checkingValidUser(values.fullName);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                placeholder="Full Name"
                name="fullName"
                onKeyUp={(event) => setName(event.target.value)}
              />
              {errors.fullName && touched.fullName ? (
                <div>{errors.fullName}</div>
              ) : null}

              <Field
                placeholder="Ticket Number"
                name="ticketNumber"
                onKeyUp={(event) => SetUsersTicket(event.target.value)}
              />
              {errors.ticketNumber && touched.ticketNumber ? (
                <div>{errors.ticketNumber}</div>
              ) : null}
              <button>Draw</button>
            </Form>
          )}
        </Formik>
        {errorMsg}
        {ticketList.length > 0 &&
          ticketList.map((item, id) => {
            return (
              <div>
                <div
                  onClick={() => changeColor()}
                  style={{
                    backgroundColor:
                      usersTicket === item.toString() ? boxColor : null,

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
              </div>
            );
          })}
      </>
    );
  }
};

export default TicketWinner;
