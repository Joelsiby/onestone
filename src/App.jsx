import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ScrollTextSection from "./components/ScrollTextSection";
import TextRevealSection from "./components/TextRevealSection";
import HeroSection from "./components/Herosection";
import Contact from "./components/Contact"; // Make sure this path is correct

function App() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipTiles = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <Router>
      <div>
        {/* Navbar sits outside of Routes so it stays on screen during navigation */}
        <Navbar onFlipTiles={handleFlipTiles} />
        
        <Routes>
          {/* 1. Home Route */}
          <Route 
            path="/" 
            element={
              <>
                <HeroSection isFlipped={isFlipped} />
                <ScrollTextSection />
                <TextRevealSection />
              </>
            } 
          />
          
          {/* 2. Contact Route */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;