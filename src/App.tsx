
  
import { ReactFlowProvider } from "@xyflow/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Flow from "./Flow";
import About from "./About";
import Navbar from "./Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <ReactFlowProvider>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/canvas" element={<Flow />} />
        </Routes>
      </ReactFlowProvider>
    </Router>
  );
}
