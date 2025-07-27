import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./components/Home";
import PromptHistory from "./components/PromptHistory";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen font-mono text-white bg-gradient-to-bl from-violet-950 via-gray-900 to-violet-950 flex flex-col items-center">
        <header>
          <h1 className="text-6xl text-gray-300 drop-shadow-[0_4px_4px_rgb(209_213_219)] my-8">PromptBuddy</h1>
          <nav className="space-x-4 flex justify-center">
            <NavLink to="/" className={({ isActive }) => isActive ? "underline underline-offset-2 cursor-default" : "hover:drop-shadow-[0_1px_1px_white]"}>Home</NavLink>
            <NavLink to="/history" className={({ isActive }) => isActive ? "underline underline-offset-2 cursor-default" : "hover:drop-shadow-[0_1px_1px_white]"}>History</NavLink>
            <NavLink to="/analytics" className={({ isActive }) => isActive ? "underline underline-offset-2 cursor-default" : "hover:drop-shadow-[0_1px_1px_white]"}>Analytics</NavLink>
          </nav>
        </header>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<PromptHistory />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
