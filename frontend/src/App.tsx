import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Module from './pages/Module';
import Lesson from './pages/Lesson';
import Chat from './pages/Chat';
import Progress from './pages/Progress';
import About from './pages/About';
import Adventures from './pages/Adventures';
import AdventureMode from './pages/AdventureMode';
import CodeExplainer from './pages/CodeExplainer';
import { getUserStats } from './api';

function App() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getUserStats();
        setXp(stats.xp);
        setLevel(stats.level);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar xp={xp} level={level} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/module/:moduleId" element={<Module />} />
        <Route path="/lesson/:lessonId" element={<Lesson />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/about" element={<About />} />
        <Route path="/adventures" element={<Adventures />} />
        <Route path="/adventure/:chapterId" element={<AdventureMode />} />
        <Route path="/explainer" element={<CodeExplainer />} />
      </Routes>
    </div>
  );
}

export default App;
