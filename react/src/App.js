import { Routes, Route } from "react-router-dom";
import RegisterUser from "./containers/admin/RegisterUser";
import WinnerSelector from "./containers/admin/WinnerSelector";
import TicketWinner from "./containers/users/TicketWinner";

const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/register" element={<RegisterUser />} />
        <Route exact path="/" element={<TicketWinner />} />
        <Route exact path="/selector" element={<WinnerSelector />} />
      </Routes>
    </>
  );
};

export default App;
