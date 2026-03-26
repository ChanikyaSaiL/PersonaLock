import React from 'react';
import Wizard from './components/Wizard';

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8">
      {/* Animated Glowing Orbs Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-primary-600 to-cyan-500 blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-[8000ms] opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tl from-accent-500 to-purple-500 blur-[100px] mix-blend-screen pointer-events-none animate-pulse duration-[6000ms] opacity-35"></div>
      <div className="absolute top-[30%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-bl from-cyan-500 to-teal-500 blur-[90px] mix-blend-screen pointer-events-none animate-pulse duration-[10000ms] opacity-30"></div>
      <div className="absolute inset-0 mix-blend-overlay pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-transparent to-dark-900/20"></div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-float opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${5 + i}s`
            }}
          ></div>
        ))}
      </div>

      <div className="w-full max-w-4xl relative z-10 my-8">
        <Wizard />
      </div>
    </div>
  );
}

export default App;