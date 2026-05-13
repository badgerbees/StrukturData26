import React, { useState, useEffect, useRef } from 'react';
import {
  FaGem, FaCube, FaMemory, FaDesktop, FaHammer,
  FaCogs, FaTerminal, FaRocket, FaRobot, FaBolt,
  FaServer, FaLaptop, FaTabletAlt, FaCarBattery, FaDatabase,
  FaLayerGroup, FaMicrochip
} from 'react-icons/fa';
import {
  GiCircuitry, GiProcessor, GiDrill, GiMineWagon,
  GiMetalBar, GiStoneStack
} from 'react-icons/gi';
import { MdMemory, MdSettingsSuggest } from 'react-icons/md';
import { Graph } from './logic/Graph';

// Initial Setup for the Tech Tree DAG
const setupTechTree = () => {
  const g = new Graph();

  // Tier 1: Raw Materials
  g.addNode('silicon', { name: 'Silicon', tier: 1, icon: <FaGem className="text-cyan-400" /> });
  g.addNode('copper', { name: 'Copper', tier: 1, icon: <FaCube className="text-orange-400" /> });
  g.addNode('iron', { name: 'Iron', tier: 1, icon: <GiMetalBar className="text-gray-400" /> });
  g.addNode('carbon', { name: 'Carbon', tier: 1, icon: <GiStoneStack className="text-slate-500" /> });

  // Tier 2: Basic Components
  g.addNode('microchip', { name: 'Microchip', tier: 2, icon: <GiProcessor className="text-green-400" /> });
  g.addNode('pcb', { name: 'PCB', tier: 2, icon: <GiCircuitry className="text-emerald-500" /> });
  g.addNode('wire', { name: 'Wire', tier: 2, icon: <FaBolt className="text-yellow-400" /> });
  g.addNode('frame', { name: 'Frame', tier: 2, icon: <FaLayerGroup className="text-zinc-400" /> });

  // Tier 3: Advanced Components
  g.addNode('ram', { name: 'RAM', tier: 3, icon: <FaMemory className="text-blue-400" /> });
  g.addNode('cpu', { name: 'CPU', tier: 3, icon: <MdMemory className="text-purple-400" /> });
  g.addNode('gpu', { name: 'GPU', tier: 3, icon: <FaMicrochip className="text-pink-400" /> });
  g.addNode('battery', { name: 'Battery', tier: 3, icon: <FaCarBattery className="text-lime-400" /> });

  // Tier 4: Final Products
  g.addNode('pc', { name: 'High-End PC', tier: 4, icon: <FaDesktop className="text-indigo-400" /> });
  g.addNode('laptop', { name: 'MacBook Pro', tier: 4, icon: <FaLaptop className="text-slate-300" /> });
  g.addNode('server', { name: 'AI Server', tier: 4, icon: <FaServer className="text-red-400" /> });
  g.addNode('tablet', { name: 'iPad Ultra', tier: 4, icon: <FaTabletAlt className="text-cyan-300" /> });

  // Edges (Prerequisites)
  // Tier 2
  g.addEdge('silicon', 'microchip', 2);
  g.addEdge('copper', 'pcb', 3);
  g.addEdge('copper', 'wire', 2);
  g.addEdge('iron', 'wire', 1);
  g.addEdge('iron', 'frame', 3);
  g.addEdge('carbon', 'frame', 2);

  // Tier 3
  g.addEdge('microchip', 'ram', 2);
  g.addEdge('pcb', 'ram', 1);
  g.addEdge('microchip', 'cpu', 2);
  g.addEdge('silicon', 'cpu', 1);
  g.addEdge('microchip', 'gpu', 2);
  g.addEdge('wire', 'gpu', 3);
  g.addEdge('frame', 'battery', 1);
  g.addEdge('carbon', 'battery', 5);

  // Tier 4
  g.addEdge('ram', 'pc', 2);
  g.addEdge('cpu', 'pc', 1);
  g.addEdge('gpu', 'pc', 1);
  g.addEdge('silicon', 'pc', 5);

  g.addEdge('cpu', 'laptop', 1);
  g.addEdge('ram', 'laptop', 1);
  g.addEdge('battery', 'laptop', 1);
  g.addEdge('frame', 'laptop', 1);

  g.addEdge('cpu', 'server', 4);
  g.addEdge('gpu', 'server', 4);
  g.addEdge('ram', 'server', 8);
  g.addEdge('wire', 'server', 10);

  g.addEdge('microchip', 'tablet', 4);
  g.addEdge('battery', 'tablet', 1);
  g.addEdge('frame', 'tablet', 1);
  g.addEdge('silicon', 'tablet', 3);

  return g;
};

function App() {
  const [graph] = useState(setupTechTree);
  const [inventory, setInventory] = useState(() => {
    const initialInv = {};
    Object.keys(graph.nodes).forEach(id => {
      initialInv[id] = 0;
    });
    return initialInv;
  });
  const [logs, setLogs] = useState([]);
  const [autoMiners, setAutoMiners] = useState({ silicon: 0, copper: 0 });
  const [flash, setFlash] = useState({}); // { itemId: 'red' | 'green' }

  const terminalRef = useRef(null);

  // Auto-miners interval
  useEffect(() => {
    const interval = setInterval(() => {
      setInventory(prev => ({
        ...prev,
        silicon: prev.silicon + autoMiners.silicon,
        copper: prev.copper + autoMiners.copper,
      }));

      // Also update the internal graph nodes for consistency
      graph.nodes.silicon.inventoryCount += autoMiners.silicon;
      graph.nodes.copper.inventoryCount += autoMiners.copper;
    }, 1000);
    return () => clearInterval(interval);
  }, [autoMiners, graph]);

  // Scroll terminal to bottom only if user is already near the bottom
  useEffect(() => {
    if (terminalRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100;
      if (isAtBottom) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }
  }, [logs]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => {
      const combined = [...prev, { message, type, timestamp }];
      return combined.slice(-100);
    });
  };

  const handleAction = (itemId) => {
    const node = graph.nodes[itemId];

    if (node.tier === 1) {
      // Mining
      setInventory(prev => {
        const newVal = prev[itemId] + 1;
        graph.nodes[itemId].inventoryCount = newVal;
        return { ...prev, [itemId]: newVal };
      });
      addLog(`> Successfully mined 1 ${node.name}.`, 'info');
      triggerFlash(itemId, 'green');
    } else {
      // Crafting with DFS validation
      const canCraft = graph.validateCraft(itemId, addLog);

      if (canCraft) {
        graph.performCraft(itemId);
        // Sync back to React state
        const newInv = {};
        Object.keys(graph.nodes).forEach(id => {
          newInv[id] = graph.nodes[id].inventoryCount;
        });
        setInventory(newInv);
        addLog(`> Successfully crafted 1 ${node.name}!`, 'success');
        triggerFlash(itemId, 'green');
      } else {
        triggerFlash(itemId, 'red');
      }
    }
  };

  const triggerFlash = (itemId, color) => {
    setFlash(prev => ({ ...prev, [itemId]: color }));
    setTimeout(() => {
      setFlash(prev => ({ ...prev, [itemId]: null }));
    }, 500);
  };

  const buyAutoMiner = (type) => {
    const cost = type === 'silicon' ? 5 : 5; // Costs 5 microchips for silicon, 5 PCBs for copper
    const costItem = type === 'silicon' ? 'microchip' : 'pcb';

    if (inventory[costItem] >= cost) {
      setInventory(prev => {
        const newVal = prev[costItem] - cost;
        graph.nodes[costItem].inventoryCount = newVal;
        return { ...prev, [costItem]: newVal };
      });
      setAutoMiners(prev => ({ ...prev, [type]: prev[type] + 1 }));
      addLog(`> Purchased Auto-${type.charAt(0).toUpperCase() + type.slice(1)}!`, 'success');
    } else {
      addLog(`> Not enough ${costItem === 'microchip' ? 'Microchips' : 'PCBs'} for upgrade!`, 'error');
    }
  };

  const tiers = [1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col text-gray-200 overflow-hidden">
      {/* 1. Header: Live Inventory Bar */}
      <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b-2 border-[#ff9d00]/30 px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <FaCogs className="text-[#ff9d00] text-2xl animate-spin-slow" />
          <h1 className="text-xl font-bold tracking-wider text-white uppercase italic">Silicon Forge <span className="text-[#ff9d00]">Tycoon</span></h1>
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {Object.entries(graph.nodes).map(([id, node]) => (
            <div key={id} className="flex items-center gap-2 bg-[#252525] px-3 py-1.5 rounded-md border border-gray-700">
              <span className="text-xl">{node.icon}</span>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase leading-none">{node.name}</span>
                <span className="font-mono font-bold text-[#ff9d00] leading-none">{inventory[id] || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* 2. Main Canvas: Tech Tree */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ff9d00 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          {tiers.map(tier => (
            <div key={tier} className="flex flex-wrap justify-center gap-10">
              {Object.entries(graph.nodes)
                .filter(([_, node]) => node.tier === tier)
                .map(([id, node]) => (
                  <div
                    key={id}
                    className={`node-card w-56 p-5 rounded-xl border-2 flex flex-col items-center gap-4 relative group
                      ${flash[id] === 'green' ? 'flash-green' : flash[id] === 'red' ? 'flash-red' : 'border-gray-800'}`}
                  >
                    <div className="absolute -top-3 -left-3 bg-[#1a1a1a] border border-[#ff9d00] px-2 py-0.5 rounded text-[10px] font-bold text-[#ff9d00] uppercase tracking-widest">
                      {tier === 1 ? 'Tier 1 — Raw Materials' :
                        tier === 2 ? 'Tier 2 — Basic Components' :
                          tier === 3 ? 'Tier 3 — Advanced Components' :
                            'Tier 4 — Final Products'}
                    </div>

                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      {node.icon}
                    </div>

                    <div className="text-center">
                      <h3 className="font-bold text-lg text-white">{node.name}</h3>
                      <p className="text-sm text-gray-400">Stock: <span className="font-mono text-[#ff9d00]">{inventory[id] || 0}</span></p>
                    </div>

                    {tier > 1 && (
                      <div className="w-full space-y-1 mt-1">
                        <p className="text-[10px] text-gray-500 uppercase font-semibold border-b border-gray-700 pb-1">Requirements</p>
                        {graph.adjacencyList[id].map(req => (
                          <div key={req.id} className="flex justify-between text-xs">
                            <span className="text-gray-400">{graph.nodes[req.id].name}</span>
                            <span className={`font-mono ${inventory[req.id] >= req.count ? 'text-green-500' : 'text-red-500'}`}>
                              {req.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => handleAction(id)}
                      className={`w-full py-2.5 rounded-lg font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2
                        ${tier === 1
                          ? 'bg-[#ff9d00] text-black hover:bg-[#e68a00] shadow-[0_4px_0_#b36e00] active:translate-y-1 active:shadow-none'
                          : 'bg-[#2d2d2d] border border-gray-600 hover:border-[#ff9d00] hover:text-[#ff9d00]'}`}
                    >
                      {tier === 1 ? <GiMineWagon /> : <FaHammer />}
                      {tier === 1 ? 'Mine' : 'Craft'}
                    </button>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </main>

      {/* 3. Control Panel & Terminal Log */}
      <footer className="h-64 bg-[#1a1a1a] border-t-2 border-[#ff9d00]/30 grid grid-cols-12 gap-0 overflow-hidden">
        {/* Left: Upgrades */}
        <div className="col-span-4 border-r border-gray-800 p-4 flex flex-col overflow-y-auto">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-tighter text-[#ff9d00] mb-4">
            <MdSettingsSuggest className="text-lg" /> Production Upgrades
          </h2>
          <div className="space-y-3">
            <div className="bg-[#252525] p-3 rounded-lg border border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1a1a1a] rounded-md text-cyan-400"><GiDrill className="text-xl" /></div>
                <div>
                  <p className="text-xs font-bold text-white">Auto-Silicon</p>
                  <p className="text-[10px] text-gray-400">Yield: +{autoMiners.silicon}/s</p>
                </div>
              </div>
              <button
                onClick={() => buyAutoMiner('silicon')}
                className="px-3 py-1.5 bg-[#333] hover:bg-[#444] rounded text-[10px] font-bold border border-gray-600 transition-colors"
              >
                Buy (5 Chips)
              </button>
            </div>

            <div className="bg-[#252525] p-3 rounded-lg border border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1a1a1a] rounded-md text-orange-400"><FaRobot className="text-xl" /></div>
                <div>
                  <p className="text-xs font-bold text-white">Auto-Copper</p>
                  <p className="text-[10px] text-gray-400">Yield: +{autoMiners.copper}/s</p>
                </div>
              </div>
              <button
                onClick={() => buyAutoMiner('copper')}
                className="px-3 py-1.5 bg-[#333] hover:bg-[#444] rounded text-[10px] font-bold border border-gray-600 transition-colors"
              >
                Buy (5 PCBs)
              </button>
            </div>

            <div className="bg-[#252525] p-3 rounded-lg border border-gray-700 flex items-center justify-between opacity-50">
              <p className="text-[10px] text-gray-500 italic">More upgrades coming soon...</p>
            </div>
          </div>
        </div>

        {/* Right: Terminal Log */}
        <div className="col-span-8 p-0 flex flex-col terminal-window h-full overflow-hidden">
          <div className="bg-[#252525] px-4 py-1.5 border-b border-gray-800 flex items-center gap-2 justify-between shrink-0">
            <div className="flex items-center gap-2">
              <FaTerminal className="text-xs text-green-500" />
              <span className="text-[10px] font-mono uppercase text-gray-400 tracking-widest">System Log - DFS Traversal Analyzer</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
            </div>
          </div>
          <div
            ref={terminalRef}
            className="flex-1 overflow-y-auto p-4 font-mono text-[13px] space-y-1 selection:bg-green-500/30 bg-black/40 min-h-0 scrollbar-custom"
          >
            {logs.length === 0 && <p className="text-gray-600 italic">No activity detected. Initiate crafting to view DFS trace...</p>}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 animate-fade-in">
                <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                <span className={`
                  ${log.type === 'error' ? 'text-red-400' : ''}
                  ${log.type === 'success' ? 'text-green-400 font-bold' : ''}
                  ${log.type === 'info' ? 'text-cyan-400' : ''}
                `}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
