import { Routes, Route } from "react-router-dom";
import RegisterUser from "./containers/admin/RegisterUser";
import WinnerSelector from "./containers/admin/WinnerSelector";
import TicketWinner from "./containers/users/TicketWinner";
import YupPractice from "./containers/YupPractice";

const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/register" element={<RegisterUser />} />
        <Route exact path="/" element={<TicketWinner />} />
        <Route exact path="/selector" element={<WinnerSelector />} />
        <Route exact path="/yup" element={<YupPractice />} />
      </Routes>
    </>
  );
};

export default App;
