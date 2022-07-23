import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/login" />
      <Route path="/signup" />
      <Route path="/profile" /> */}
    </Routes>
  );
}

export default App;
