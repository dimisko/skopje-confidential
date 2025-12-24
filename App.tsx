
import React, { useState, useMemo, useEffect } from 'react';
import { LEVELS } from './levels.ts';
import { GameState, Level, NPC, DialogueNode, Clue, Location } from './types.ts';

const Button: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  disabled?: boolean; 
  variant?: 'primary' | 'danger' | 'ghost' | 'success' | 'dossier' | 'paper';
  className?: string;
}> = ({ onClick, children, disabled, variant = 'primary', className = "" }) => {
  const baseStyles = "px-4 py-2 font-mono text-xs transition-all duration-200 uppercase tracking-tighter border flex items-center gap-2 justify-center";
  const variants = {
    primary: "bg-amber-900/20 text-amber-500 border-amber-900/50 hover:bg-amber-900/40",
    danger: "bg-red-900/20 text-red-500 border-red-900/50 hover:bg-red-900/40",
    success: "bg-green-900/20 text-green-500 border-green-900/50 hover:bg-green-900/40",
    ghost: "text-zinc-500 border-transparent hover:text-zinc-300 hover:border-zinc-800",
    dossier: "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700",
    paper: "bg-[#d9c5a3] text-black border-[#b09b78] hover:bg-[#c9b593]"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-20 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const DossierHeader: React.FC<{ level: Level; status: string; migraine: number }> = ({ level, status, migraine }) => (
  <header className="bg-[#e6dcc5] text-zinc-900 border-b-2 border-[#b09b78] shadow-lg sticky top-0 z-[60] w-full">
    <div className="p-3 md:p-4 flex flex-col space-y-2">
      {/* Top Row: Case Details & Health */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 space-y-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-800 text-white text-[9px] font-bold shrink-0">TOP SECRET</span>
            <h1 className="text-lg md:text-xl font-bold tracking-tighter uppercase truncate">{level.title}</h1>
          </div>
          <p className="text-[10px] font-mono font-bold border-t border-black/10 pt-1 leading-tight opacity-70 truncate">
            {level.caseFile}
          </p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
          <div className="text-right hidden sm:block">
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 mb-1 whitespace-nowrap">VIKTOR'S MIGRAINE</p>
            <div className="w-24 h-2 bg-black/10 border border-black/20 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${migraine > 75 ? 'bg-red-700' : 'bg-amber-800'}`} 
                style={{ width: `${migraine}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Unified Status Bar */}
      <div className="bg-black/5 border-t border-black/20 p-2 -mx-4 px-8 flex items-center gap-3 overflow-hidden">
        <span className="text-[9px] font-black uppercase text-red-900 shrink-0 bg-red-900/10 px-1 border border-red-900/20">STATUS & ADVICE:</span>
        <div className="flex-1 overflow-hidden">
          <p className="text-[11px] font-mono font-bold text-zinc-800 italic leading-snug truncate md:whitespace-normal">
            {status}
          </p>
        </div>
      </div>
    </div>
  </header>
);

const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-1000">
    <div className="max-w-2xl w-full border border-zinc-800 p-8 bg-zinc-900/30 space-y-6">
      <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tighter">SKOPJE CONFIDENTIAL</h2>
          <p className="text-[10px] text-amber-600 uppercase tracking-widest">Department of Serious Crimes</p>
        </div>
        <span className="text-zinc-600 font-mono text-xs">LOG_01-2024</span>
      </div>
      
      <div className="space-y-4 font-mono text-xs text-zinc-400 leading-relaxed">
        <p><span className="text-zinc-100 font-bold uppercase">PROLOGUE:</span> You are a Junior Detective recently transferred from Bitola. Skopje is bigger, meaner, and smells of old cigarette ash.</p>
        <p>You've been assigned to <span className="text-zinc-100">Chief Inspector Viktor Nikolov</span>. He's a legend who has solved more cases than the rest of the department combined, but the city's corruption has given him a permanent, debilitating migraine.</p>
        <p><span className="text-red-600 font-bold uppercase">THE CASE:</span> Petar Stojanov, a high-profile developer, was found dead at 3:00 AM on the Stone Bridge. Struck by a heavy object and left for the Vardar to claim. No witnesses. No murder weapon.</p>
        <p>Viktor is waiting at the precinct. Keep your head down, partner. The truth in Skopje is rarely clean.</p>
      </div>

      <div className="pt-4">
        <Button onClick={onStart} variant="primary" className="w-full py-4 text-sm font-bold tracking-[0.2em]">INITIALIZE INVESTIGATION</Button>
      </div>
    </div>
  </div>
);

const WALKMAN_TRACKS = [
  { title: "Bijelo Dugme - Lipe Cvatu", context: "Viktor used to play this on his first patrol car. It reminds him of a time when justice felt simpler." },
  { title: "EKV - Krug", context: "This song always plays when the case hits a dead end. 'This circle is spinning...' he mutters." },
  { title: "Azra - Balkan", context: "He listens to this when the city gets too loud. It's the sound of a generation that saw the future clearly." },
  { title: "Leb i Sol - Aber Dojde Donke", context: "Pure Skopje soul. The jazz-rock fusion helps him navigate the complex lies of the elite." },
  { title: "Parni Valjak - Jesen u meni", context: "Autumn in Skopje. The heavy air, the damp concrete, and a case that refuses to close." }
];

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  const getInitialGameState = (): GameState => {
    const initialLevel = LEVELS[1];
    const initialUnlocked = Object.values(initialLevel.locations)
      .filter(l => l.isInitial)
      .map(l => l.id);
    
    return {
      currentLevelId: 1,
      currentLocationId: "police_station",
      discoveredClues: [],
      discoveredSuspects: [],
      unlockedLocations: initialUnlocked,
      witnessInteractions: {},
      migraineLevel: 20,
      isGameOver: false,
      gameWon: null
    };
  };

  const [gameState, setGameState] = useState<GameState>(getInitialGameState);
  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const [isAccusing, setIsAccusing] = useState(false);
  const [flavorText, setFlavorText] = useState<string | null>(null);
  const [walkmanTrackIndex, setWalkmanTrackIndex] = useState(-1);

  const currentLevel = useMemo(() => LEVELS[gameState.currentLevelId], [gameState.currentLevelId]);
  const currentLocation = useMemo(() => currentLevel.locations[gameState.currentLocationId], [currentLevel, gameState.currentLocationId]);

  useEffect(() => {
    const newUnlocked = [...gameState.unlockedLocations];
    const clues = gameState.discoveredClues;
    
    if (clues.includes('receipt') && !newUnlocked.includes('debar_maalo')) newUnlocked.push('debar_maalo');
    if (clues.includes('hotel_card') && !newUnlocked.includes('hotel_arka')) newUnlocked.push('hotel_arka');
    if (clues.includes('tire_track') && !newUnlocked.includes('vardar_galleys')) newUnlocked.push('vardar_galleys');
    if (clues.includes('cufflink') && !newUnlocked.includes('markov_residence')) newUnlocked.push('markov_residence');

    if (newUnlocked.length !== gameState.unlockedLocations.length) {
      setGameState(prev => ({ ...prev, unlockedLocations: newUnlocked }));
      setFlavorText("MAP UPDATED: NEW LOCATION IDENTIFIED");
      setTimeout(() => setFlavorText(null), 3000);
    }
  }, [gameState.discoveredClues]);

  const resetGame = () => {
    setGameState(getInitialGameState());
    setShowIntro(true);
    setActiveNPC(null);
    setCurrentDialogue(null);
    setIsAccusing(false);
    setWalkmanTrackIndex(-1);
    setFlavorText(null);
  };

  const getPartnerHint = () => {
    const clues = gameState.discoveredClues;
    const loc = gameState.currentLocationId;
    
    if (loc === 'stone_bridge' && !clues.includes('receipt')) {
      return "There's a receipt near the trash bin, partner. Use the 'SEARCH AREA' button and look closely.";
    }
    if (loc === 'debar_maalo' && !clues.includes('hotel_card')) {
      return "Lazo knows something, but he also hides things behind the bar. 'SEARCH AREA' near the menus.";
    }
    if (loc === 'hotel_arka' && (!clues.includes('cufflink') || !clues.includes('blackmail_docs'))) {
      return "Luxury hotels hide ugly secrets. Check the safe and 'SEARCH AREA' under the furniture.";
    }
    if (loc === 'vardar_galleys' && !clues.includes('murder_weapon')) {
      return "The river snagged the weapon. Look into the low branches and 'SEARCH AREA' near the shore.";
    }
    if (loc === 'markov_residence' && !clues.includes('missing_statuette')) {
      return "Walk through the hallways. If that ceremonial trowel is missing from its case, we have our link. 'SEARCH AREA'.";
    }

    if (!clues.includes('receipt')) return "We need to go back to the Stone Bridge. We missed something on the pavement.";
    if (!clues.includes('hotel_card')) return "Head to Debar Maalo. The receipt mentioned Trend.";
    if (!clues.includes('cufflink')) return "Arka. Room 402. That's where the trail goes cold unless you find something.";
    if (!clues.includes('murder_weapon')) return "Check the Galleys. The current flows that way from the bridge.";
    if (!clues.includes('missing_statuette')) return "The Markovs are hiding the source of that weapon. Head to their estate.";
    if (!clues.includes('blackmail_docs')) return "We need Stojanov's leverage from the Hotel Arka safe to establish a solid motive.";

    return "We have everything. Motive, means, and opportunity. Let's head to the Station and file the arrest warrant.";
  };

  const currentStatus = useMemo(() => getPartnerHint(), [gameState.discoveredClues, gameState.currentLocationId]);

  const handleSearch = () => {
    const locSearches = currentLocation.searches;
    const undiscovered = locSearches.filter(s => s.clueId && !gameState.discoveredClues.includes(s.clueId));
    
    if (undiscovered.length > 0) {
      const result = undiscovered[0];
      const migraineDelta = result.clueId === 'migraine_relief' ? -50 : 4;
      
      setGameState(prev => ({
        ...prev,
        discoveredClues: [...prev.discoveredClues, result.clueId!],
        migraineLevel: Math.max(0, Math.min(100, prev.migraineLevel + migraineDelta))
      }));
      setFlavorText(result.description);
    } else {
      setFlavorText("Area sweep complete. No new evidence found in this sector.");
    }
    setTimeout(() => setFlavorText(null), 4000);
  };

  const startDialogue = (npcId: string) => {
    const npc = currentLevel.npcs[npcId];
    setActiveNPC(npc);
    if (!gameState.discoveredSuspects.includes(npcId)) {
      setGameState(prev => ({ ...prev, discoveredSuspects: [...prev.discoveredSuspects, npcId] }));
    }
    setCurrentDialogue(npc.dialogue[npc.initialNode]);
  };

  const handleDialogueOption = (nextId: string) => {
    if (!activeNPC) return;
    if (!nextId || !activeNPC.dialogue[nextId]) {
      setActiveNPC(null);
      setCurrentDialogue(null);
      return;
    }

    let nextNode = activeNPC.dialogue[nextId];
    if (nextId === 'v_help') {
      nextNode = { ...nextNode, text: currentStatus };
      setGameState(prev => ({ ...prev, migraineLevel: Math.min(100, prev.migraineLevel + 8) }));
    }

    setCurrentDialogue(nextNode);
  };

  const handleAccusation = (killerId: string, motive: string, evidenceId: string) => {
    const isCorrect = 
      killerId === currentLevel.solution.killerId && 
      motive === currentLevel.solution.motive && 
      evidenceId === currentLevel.solution.evidenceId;

    setGameState(prev => ({ ...prev, isGameOver: true, gameWon: isCorrect }));
    setIsAccusing(false);
  };

  const toggleWalkman = () => {
    const nextIndex = (walkmanTrackIndex + 1) % WALKMAN_TRACKS.length;
    setWalkmanTrackIndex(nextIndex);
    const track = WALKMAN_TRACKS[nextIndex];
    setFlavorText(`📻 WALKMAN: ${track.title} — ${track.context}`);
    setTimeout(() => setFlavorText(null), 6000);
  };

  if (showIntro) return <IntroScreen onStart={() => setShowIntro(false)} />;

  if (gameState.isGameOver) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono text-zinc-100 grainy">
        <div className="max-w-xl w-full border-2 border-zinc-800 p-8 text-center space-y-6 bg-zinc-900/40 shadow-[0_0_50px_rgba(0,0,0,1)]">
          <h2 className={`text-5xl font-bold tracking-tighter ${gameState.gameWon ? 'text-green-500' : 'text-red-500'}`}>
            {gameState.gameWon ? "CASE CLOSED" : "CASE COLD"}
          </h2>
          <div className="h-0.5 bg-zinc-800 w-full" />
          <p className="text-zinc-400 text-sm leading-relaxed">
            {gameState.gameWon 
              ? `Marija Markova was arrested at her estate. The silver trowel was confirmed as the murder weapon. Viktor looks at the city lights and, for the first time, he doesn't wince. 'Nice work, partner. Let's grab a coffee. On me.'`
              : "The warrant was rejected for lack of evidence. The Markovs have already left for their villa in Greece. Viktor handed in his badge this morning. Skopje remains silent."}
          </p>
          <Button onClick={resetGame} variant="primary">REOPEN DOSSIER</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto flex flex-col border-x border-zinc-800 bg-[#0a0a0a] shadow-2xl relative grainy">
      <DossierHeader level={currentLevel} status={currentStatus} migraine={gameState.migraineLevel} />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-32">
        {flavorText && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] md:w-auto bg-amber-950 text-amber-100 p-4 border-2 border-amber-600 font-mono text-xs z-[60] animate-in fade-in slide-in-from-top-2 duration-300 shadow-2xl uppercase">
            {flavorText}
          </div>
        )}

        {activeNPC && currentDialogue ? (
          <div className="border border-amber-900/30 bg-zinc-900/50 p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div>
              <p className="text-[10px] text-amber-500 uppercase tracking-[0.3em] mb-1">{activeNPC.role}</p>
              <h3 className="text-2xl font-bold text-zinc-100">{activeNPC.name}</h3>
            </div>
            <div className="py-4 border-y border-zinc-800">
              <p className="text-zinc-300 italic leading-relaxed font-serif text-lg">"{currentDialogue.text}"</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {currentDialogue.options.map((opt, i) => {
                const hasReq = !opt.requirement || (opt.requirement.clueId && gameState.discoveredClues.includes(opt.requirement.clueId));
                return (
                  <Button 
                    key={i} 
                    disabled={!hasReq}
                    onClick={() => handleDialogueOption(opt.nextId)}
                  >
                    {opt.text} {!hasReq && " (Evidence Required)"}
                  </Button>
                );
              })}
              {currentDialogue.options.length === 0 && (
                <Button variant="success" onClick={() => { setActiveNPC(null); setCurrentDialogue(null); }}>LEAVE CONVERSATION</Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-8 bg-amber-600" />
                <h2 className="text-3xl font-bold text-zinc-100 tracking-tight uppercase">{currentLocation.name}</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed text-sm md:text-base italic border-l border-zinc-800 pl-6">
                {currentLocation.description}
              </p>
            </section>

            <section className="flex flex-wrap gap-3">
              <Button onClick={handleSearch} variant="primary" className="flex-1 py-4 text-sm font-bold border-2">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  SEARCH AREA
                </span>
              </Button>
              {currentLocation.npcs.map(nId => (
                <Button key={nId} onClick={() => startDialogue(nId)} variant="dossier" className="flex-1 py-4 text-sm font-bold border-2">
                  TALK TO {currentLevel.npcs[nId].name}
                </Button>
              ))}
            </section>

            <section className="space-y-4 border-t border-zinc-900 pt-6">
              <h4 className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">Investigate Locations</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {gameState.unlockedLocations.map(locId => (
                  <Button 
                    key={locId} 
                    variant={gameState.currentLocationId === locId ? 'success' : 'ghost'}
                    className="text-[9px] py-3"
                    onClick={() => {
                      setGameState(prev => ({ ...prev, currentLocationId: locId, migraineLevel: Math.min(100, prev.migraineLevel + 1) }));
                      setActiveNPC(null); 
                      setCurrentDialogue(null);
                    }}
                  >
                    {currentLevel.locations[locId].name}
                  </Button>
                ))}
              </div>
            </section>

            <section className="border-t border-zinc-900 pt-8">
              <h4 className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold mb-4">Evidence & Findings</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gameState.discoveredClues.map(cId => {
                  const clue = currentLevel.clues[cId];
                  return (
                    <div key={cId} className="p-3 border border-zinc-800 bg-zinc-900/30 rounded-sm flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-amber-600 shrink-0 shadow-[0_0_5px_rgba(217,119,6,0.5)]" />
                      <div>
                        <h5 className="text-[11px] font-bold text-amber-500 uppercase mb-1">{clue.name}</h5>
                        <p className="text-[10px] text-zinc-500 leading-tight italic">"{clue.description}"</p>
                      </div>
                    </div>
                  );
                })}
                {gameState.discoveredClues.length === 0 && (
                  <div className="col-span-2 text-center py-8 border border-dashed border-zinc-800 opacity-20 text-[10px] uppercase tracking-widest">No Evidence Recovered</div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="p-4 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur-md sticky bottom-0 z-50 flex justify-between items-center">
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            className="text-[9px] text-amber-500/80" 
            onClick={toggleWalkman}
          >
            <span>📻</span> WALKMAN
          </Button>
        </div>
        
        {gameState.currentLocationId === 'police_station' && !activeNPC && (
          <Button variant="danger" className="px-8 font-bold border-2 animate-pulse" onClick={() => setIsAccusing(true)}>
            FILE ARREST WARRANT
          </Button>
        )}
      </footer>

      {isAccusing && (
        <div className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="max-w-xl w-full border-2 border-red-900/50 bg-[#050505] p-8 space-y-8 animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-red-600 uppercase tracking-tighter">FINAL ARREST DOSSIER</h2>
              <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest">Identify the suspect, motive, and smoking gun.</p>
            </div>
            
            <AccusationForm 
              level={currentLevel} 
              onClose={() => setIsAccusing(false)} 
              onAccuse={handleAccusation}
              clues={gameState.discoveredClues}
              discoveredSuspects={gameState.discoveredSuspects}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const AccusationForm: React.FC<{
  level: Level;
  onClose: () => void;
  onAccuse: (killer: string, motive: string, evidence: string) => void;
  clues: string[];
  discoveredSuspects: string[];
}> = ({ level, onClose, onAccuse, clues, discoveredSuspects }) => {
  const [killer, setKiller] = useState("");
  const [motive, setMotive] = useState("");
  const [evidence, setEvidence] = useState("");

  const motives = ["Personal Vendetta", "Business Rivalry", "Crimes of Passion", "Accidental Death"];

  return (
    <div className="space-y-6 font-mono">
      <div className="space-y-2">
        <label className="text-[10px] text-zinc-500 uppercase font-bold">SUSPECT_ID</label>
        <select value={killer} onChange={e => setKiller(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-3 text-xs uppercase outline-none focus:border-red-600 appearance-none">
          <option value="">-- SELECT SUSPECT --</option>
          {discoveredSuspects.filter(id => id !== 'viktor' && id !== 'sandra' && id !== 'waiter').map(id => (
            <option key={id} value={id}>{level.npcs[id].name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-zinc-500 uppercase font-bold">ESTABLISHED MOTIVE</label>
        <select value={motive} onChange={e => setMotive(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-3 text-xs uppercase outline-none focus:border-red-600 appearance-none">
          <option value="">-- SELECT MOTIVE --</option>
          {motives.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-zinc-500 uppercase font-bold">EXHIBIT A (WEAPON)</label>
        <select value={evidence} onChange={e => setEvidence(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-3 text-xs uppercase outline-none focus:border-red-600 appearance-none">
          <option value="">-- SELECT EVIDENCE --</option>
          {clues.map(cId => <option key={cId} value={cId}>{level.clues[cId].name}</option>)}
        </select>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="ghost" onClick={onClose} className="flex-1">STAY INVESTIGATION</Button>
        <Button 
          variant="danger" 
          className="flex-1" 
          disabled={!killer || !motive || !evidence}
          onClick={() => onAccuse(killer, motive, evidence)}
        >
          EXECUTE WARRANT
        </Button>
      </div>
    </div>
  );
};

export default App;
