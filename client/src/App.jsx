import React from 'react';
import Wizard from './components/Wizard';

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8">
      {/* Animated Glowing Orbs Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-600/30 blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent-500/20 blur-[100px] mix-blend-screen pointer-events-none animate-pulse duration-[6000ms]"></div>
      <div className="absolute top-[30%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-cyan-500/20 blur-[90px] mix-blend-screen pointer-events-none animate-pulse duration-[10000ms]"></div>

      <div className="w-full max-w-4xl relative z-10 my-8">
        <Wizard />
      </div>
    </div>
  );
}

export default App;