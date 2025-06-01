import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import BoardView from "./components/BoardView";
import BoardDetail from "./components/BoardDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BoardView />} />
        <Route path="/board/:id" element={<BoardDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
