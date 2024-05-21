import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Details from "./Pages/Details";
import Navbar from "./Components/Navbar";
import Details2 from "./Pages/Details2";
import Detail3 from "./Pages/Details3";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/report2" element={<Details />} />
        <Route path="/report3" element={<Details2 />} />
        <Route path="/" element={<Detail3 />} />
      </Routes>
    </Router>
  );
}

export default App;
