import { ReactFlowProvider } from "@xyflow/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Flow from "./Flow";
import About from "./About";
import Sidebar from "./Sidebar";

function AppContent() {
  //const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    console.log("Toggling sidebar");
    setShowSidebar((prev) => !prev);
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transition-transform duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-64"
        }`}
        style={{ zIndex: 50 }}
      >
        <Sidebar onClose={toggleSidebar} />
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-64 z-50 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-r focus:outline-none transition-all duration-300"
        style={{
          transform: showSidebar ? "translateX(0)" : "translateX(-256px)", // Move button along with sidebar
          transition: "transform 0.3s ease",
        }}
      >
        {showSidebar ? "⬅️" : "➡️"}
      </button>

      {/* Main Content */}
      <ReactFlowProvider>
        <Routes>
          <Route path="/" element={<About />} />
          <Route
            path="/canvas"
            element={
              <div
                className="border border-gray-500"
                style={{ height: "90vh", width: "90vw", margin:0, padding:0 }}
              >
                <Flow />
              </div>
            }
          />
        </Routes>
      </ReactFlowProvider>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
