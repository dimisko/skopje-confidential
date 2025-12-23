
import React, { useState, useMemo, useEffect } from 'react';
import { LEVELS } from './levels.ts';
import { GameState, Level, NPC, DialogueNode, Clue } from './types.ts';

// Helper components
const Button: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  disabled?: boolean; 
  variant?: 'primary' | 'danger' | 'ghost' | 'success' | 'dossier';
  type?: "button" | "submit" | "reset";
  className?: string;
}> = ({ onClick, children, disabled, variant = 'primary', type = "button", className = "" }) => {
  const baseStyles = "px-4 py-2 font-mono text-sm transition-all duration-200 uppercase tracking-tighter";
  const variants = {
    primary: "bg-amber-900/20 text-amber-500 border border-amber-900/50 hover:bg-amber-900/40",
    danger: "bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900/40",
    success: "bg-green-900/20 text-green-500 border border-green-900/50 hover:bg-green-900/40",
    ghost: "text-zinc-500 hover:text-zinc-300",
    dossier: "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
  };
  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-30 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Header: React.FC<{ title: string; objective: string; migraine: number }> = ({ title, objective, migraine }) => (
  <header className="border-b border-zinc-800 p-4 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h1 className="text-xl font-bold tracking-widest text-zinc-100">SKOPJE CONFIDENTIAL</h1>
        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Case: {title}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-zinc-500 mb-1 uppercase">Partner Fatigue</p>
        <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
          <div 
            className={`h-full transition-all duration-500 ${migraine > 70 ? 'bg-red-600' : 'bg-amber-600'}`} 
            style={{ width: `${migraine}%` }}
          />
        </div>
      </div>
    </div>
    <div className="bg-amber-900/10 border-l-2 border-amber-600 p-2 flex items-center gap-3">
      <span className="text-[10px] font-bold text-amber-600 uppercase animate-pulse">Active Lead:</span>
      <span className="text-xs text-amber-500/80 font-mono italic">{objective}</span>
    </div>
  </header>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevelId: 1,
    currentLocationId: "police_station",
    inventory: [],
    discoveredClues: [],
    discoveredSuspects: [],
    witnessInteractions: {},
    migraineLevel: 25,
    isGameOver: false,
    gameWon: null
  });

  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const [isAccusing, setIsAccusing] = useState(false);
  const [showDossier, setShowDossier] = useState(false);
  const [flavorText, setFlavorText] = useState<string | null>(null);

  const currentLevel = useMemo(() => LEVELS[gameState.currentLevelId], [gameState.currentLevelId]);
  const currentLocation = useMemo(() => currentLevel.locations[gameState.currentLocationId], [currentLevel, gameState.currentLocationId]);

  // Dynamic Objective Tracker
  const currentObjective = useMemo(() => {
    const clues = gameState.discoveredClues;
    if (clues.length === 0) return "Investigate Stone Bridge crime scene.";
    if (!clues.includes('cufflink')) return "Search for physical evidence at the Bridge.";
    if (!clues.includes('receipt')) return "Follow the victim's trail to Debar Maalo.";
    if (!clues.includes('shredded_docs')) return "Gain access to Stojanov Holdings executive suite.";
    return "All major clues gathered. Return to Precinct for Arrest.";
  }, [gameState.discoveredClues]);

  // Contextual Hint Logic
  const getPartnerHint = () => {
    const clues = gameState.discoveredClues;
    const baseHint = (() => {
      if (clues.length === 0) {
        return "Listen, partner. We need to start where it ended. Get to the Stone Bridge and comb every inch of that pavement.";
      }
      if (!clues.includes('cufflink') || !clues.includes('tire_track')) {
        return "That bridge scene still has secrets. Make sure you've searched the area thoroughly. I saw some markings near the walkway earlier.";
      }
      if (!clues.includes('receipt')) {
        return "Sandra said he was missing a cufflink, but he didn't lose it in a vacuum. He was in Debar Maalo before the bridge. Head to Kafana Trend and talk to the staff.";
      }
      if (!clues.includes('shredded_docs')) {
        return "That receipt points to a meeting with Markov. His office in the Business Center is cold, but that's where the paper trail usually starts. Check his desk.";
      }
      return "We've got the pieces, partner. A motive, a weapon, and a suspect. Head back to the station. It's time to make the arrest.";
    })();

    return gameState.migraineLevel > 85 
      ? `...ugh... ${baseHint.toLowerCase().replace(/\./g, '... ugh...')}`
      : baseHint;
  };

  const handleWalkman = () => {
    const riffs = [
      "Viktor adjusts his headphones, the opening riff of 'Hallowed Be Thy Name' drowning out the city noise.",
      "Viktor closes his eyes as 'Back in Black' pulses through his Walkman. He seems momentarily at peace.",
      "The heavy bass of 'Ace of Spades' leaks from Viktor's headphones. He doesn't look up.",
      "Viktor flips the tape. 'Sweet Child O' Mine' begins. He taps his pen in rhythm with Slash's guitar."
    ];
    setFlavorText(riffs[Math.floor(Math.random() * riffs.length)]);
    setTimeout(() => setFlavorText(null), 4000);
  };

  const moveLocation = (id: string) => {
    setGameState(prev => ({ 
      ...prev, 
      currentLocationId: id,
      migraineLevel: Math.min(100, prev.migraineLevel + 3)
    }));
  };

  const startDialogue = (npcId: string) => {
    const npc = currentLevel.npcs[npcId];
    setActiveNPC(npc);
    
    // Discover the suspect if not already known
    if (!gameState.discoveredSuspects.includes(npcId)) {
      setGameState(prev => ({
        ...prev,
        discoveredSuspects: [...prev.discoveredSuspects, npcId]
      }));
    }

    // ALWAYS start at the initial node
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
    if (nextId === 'v_hint') {
      nextNode = { ...nextNode, text: getPartnerHint() };
    }

    setCurrentDialogue(nextNode);
    setGameState(prev => ({
      ...prev,
      witnessInteractions: { ...prev.witnessInteractions, [activeNPC.id]: nextId }
    }));
  };

  const searchLocation = (searchId: string) => {
    const search = currentLocation.searches.find(s => s.id === searchId);
    if (!search) return;

    if (search.requiresClueId && !gameState.discoveredClues.includes(search.requiresClueId)) {
      setFlavorText("You're missing something crucial. Maybe a previous lead leads here?");
      setTimeout(() => setFlavorText(null), 3000);
      return;
    }

    // SPECIAL CASE: Painkillers in Viktor's desk
    if (searchId === 's1') {
      setGameState(prev => ({
        ...prev,
        migraineLevel: Math.max(0, prev.migraineLevel - 50)
      }));
      setFlavorText("You find Viktor's painkillers. You hand him two pills with a glass of lukewarm water. His grip on his temples loosens slightly.");
    } else {
      setFlavorText(search.description);
    }

    if (search.clueId && !gameState.discoveredClues.includes(search.clueId)) {
      setGameState(prev => ({
        ...prev,
        discoveredClues: [...prev.discoveredClues, search.clueId!]
      }));
    }
    setTimeout(() => setFlavorText(null), 5000);
  };

  const handleAccusation = (killerId: string, motive: string, evidenceId: string) => {
    const isCorrect = 
      killerId === currentLevel.solution.killerId && 
      motive === currentLevel.solution.motive && 
      evidenceId === currentLevel.solution.evidenceId;

    setGameState(prev => ({
      ...prev,
      isGameOver: true,
      gameWon: isCorrect
    }));
    setIsAccusing(false);
  };

  const restartGame = () => {
    setGameState({
      currentLevelId: 1,
      currentLocationId: "police_station",
      inventory: [],
      discoveredClues: [],
      discoveredSuspects: [],
      witnessInteractions: {},
      migraineLevel: 25,
      isGameOver: false,
      gameWon: null
    });
    setActiveNPC(null);
    setCurrentDialogue(null);
    setIsAccusing(false);
  };

  if (gameState.isGameOver) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono">
        <div className="max-w-xl w-full border-2 border-zinc-800 p-8 text-center space-y-6 bg-zinc-900/30 shadow-[0_0_50px_rgba(0,0,0,1)] animate-in zoom-in duration-500">
          <h2 className={`text-4xl font-bold tracking-tighter ${gameState.gameWon ? 'text-green-500' : 'text-red-500'}`}>
            {gameState.gameWon ? "CASE CLOSED" : "CASE COLD"}
          </h2>
          <div className="h-px bg-zinc-800 w-full"></div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {gameState.gameWon 
              ? `You successfully cornered ${currentLevel.npcs[currentLevel.solution.killerId].name}. Viktor looks at you, a rare, pained smile crossing his face. 'Not bad, partner. Maybe my head will stop throbbing for five minutes.'`
              : "The investigation fell apart. The real killer vanished into the shadows of Skopje, and Viktor's migraine reached a breaking point. He's been put on medical leave, and the file is buried."}
          </p>
          <div className="pt-4">
            <Button onClick={restartGame} variant="primary">RE-OPEN DOSSIER</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto flex flex-col border-x border-zinc-800 bg-[#0c0c0c] shadow-2xl relative">
      <Header title={currentLevel.title} objective={currentObjective} migraine={gameState.migraineLevel} />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-32">
        {flavorText && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] md:w-auto bg-amber-900/90 text-amber-100 p-3 border border-amber-500 font-mono text-xs z-50 animate-pulse text-center">
            {flavorText}
          </div>
        )}

        {/* Dossier Toggle View */}
        <section className="border-2 border-zinc-800 bg-zinc-900/30 p-4 relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-10 rotate-12 text-4xl font-bold text-red-600 pointer-events-none">CONFIDENTIAL</div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Case Briefing #01-Vardar</h3>
            <Button variant="ghost" onClick={() => setShowDossier(!showDossier)}>
              {showDossier ? "Hide Details" : "Show Details"}
            </Button>
          </div>
          {showDossier && (
            <div className="space-y-3 border-t border-zinc-800 pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-2 gap-4 text-[10px] md:text-xs">
                <div>
                  <p className="text-zinc-600 uppercase font-bold">Victim</p>
                  <p className="text-zinc-300">Petar Stojanov, 54</p>
                </div>
                <div>
                  <p className="text-zinc-600 uppercase font-bold">Location</p>
                  <p className="text-zinc-300">Stone Bridge, Centar</p>
                </div>
                <div>
                  <p className="text-zinc-600 uppercase font-bold">Est. TOD</p>
                  <p className="text-zinc-300">01:00 AM - 02:00 AM</p>
                </div>
                <div>
                  <p className="text-zinc-600 uppercase font-bold">Cause</p>
                  <p className="text-zinc-300">Blunt Force Trauma</p>
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 italic border-l border-zinc-700 pl-2">
                "Stojanov was a major property developer. Found by a night watchman. No witnesses reported at the scene."
              </p>
            </div>
          )}
        </section>

        {activeNPC && currentDialogue ? (
          <div className="border-2 border-amber-900/30 bg-zinc-900/40 p-6 space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-amber-500 uppercase tracking-widest mb-1">{activeNPC.role}</p>
                <h3 className="text-xl font-bold text-zinc-100">{activeNPC.name}</h3>
              </div>
            </div>
            <div className="py-4 border-y border-zinc-800">
              <p className="text-zinc-300 italic">
                {gameState.migraineLevel > 85 && activeNPC.id === 'viktor' 
                  ? currentDialogue.text.replace(/[\.!?]/g, '... ugh...') 
                  : currentDialogue.text}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {currentDialogue.options.length > 0 ? (
                currentDialogue.options.map((opt, i) => {
                  const hasReq = !opt.requirement || (opt.requirement.clueId && gameState.discoveredClues.includes(opt.requirement.clueId));
                  return (
                    <Button 
                      key={i} 
                      disabled={!hasReq}
                      onClick={() => handleDialogueOption(opt.nextId)}
                    >
                      {opt.text} {!hasReq && " (Need Evidence)"}
                    </Button>
                  );
                })
              ) : (
                <Button variant="success" onClick={() => { setActiveNPC(null); setCurrentDialogue(null); }}>END CONVERSATION</Button>
              )}
              {currentDialogue.options.length > 0 && (
                <Button variant="ghost" onClick={() => { setActiveNPC(null); setCurrentDialogue(null); }}>LEAVE CONVERSATION</Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <section>
              <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                <span className="w-2 h-6 bg-amber-600 block"></span>
                {currentLocation.name}
              </h2>
              <p className="mt-4 text-zinc-400 leading-relaxed text-sm md:text-base border-l border-zinc-800 pl-4 py-2">
                {currentLocation.description}
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold border-b border-zinc-800 pb-1">Field Actions</h4>
                <div className="flex flex-wrap gap-2">
                  {currentLocation.searches.map(s => (
                    <Button key={s.id} onClick={() => searchLocation(s.id)}>
                      {s.id === 's1' ? "Check Desk (Manage Fatigue)" : "Search Area"}
                    </Button>
                  ))}
                  {currentLocation.npcs.map(nId => (
                    <Button key={nId} onClick={() => startDialogue(nId)} variant="primary">
                      Talk to {currentLevel.npcs[nId].name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold border-b border-zinc-800 pb-1">Move to Quarter</h4>
                <div className="flex flex-wrap gap-2">
                  {currentLocation.connections.map(cId => (
                    <Button key={cId} variant="ghost" onClick={() => moveLocation(cId)}>
                      {currentLevel.locations[cId].name}
                    </Button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        <section className="border-t border-zinc-800 pt-8 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Evidence Locker</h4>
            <span className="text-[10px] text-zinc-600 font-mono">COUNT: {gameState.discoveredClues.length}</span>
          </div>
          {gameState.discoveredClues.length === 0 ? (
            <div className="p-8 border border-zinc-900 bg-zinc-900/10 flex items-center justify-center grayscale opacity-50">
               <p className="text-[10px] text-zinc-700 italic uppercase">Evidence Locker Empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gameState.discoveredClues.map(cId => {
                const clue = currentLevel.clues[cId];
                return (
                  <div key={cId} className="p-3 border border-zinc-700 bg-zinc-800/20 rounded shadow-inner hover:border-amber-600/50 transition-colors">
                    <h5 className="text-xs font-bold text-amber-500 uppercase mb-1">{clue.name}</h5>
                    <p className="text-[10px] text-zinc-400 leading-tight italic">"{clue.description}"</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="p-4 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur sticky bottom-0 z-50 flex justify-between items-center gap-4">
        <Button onClick={handleWalkman} variant="ghost">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
            WALKMAN
          </span>
        </Button>
        
        {gameState.currentLocationId === 'police_station' && !activeNPC && (
          <Button variant="danger" onClick={() => setIsAccusing(true)}>
            MAKE ARREST
          </Button>
        )}
      </footer>

      {isAccusing && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="max-w-2xl w-full border-2 border-red-900/50 bg-[#0a0a0a] p-8 space-y-6 overflow-y-auto max-h-[90vh] animate-in slide-in-from-bottom-8 duration-300 shadow-[0_0_100px_rgba(153,27,27,0.3)]">
            <h2 className="text-2xl font-bold text-red-500 uppercase tracking-tighter text-center underline decoration-red-900 underline-offset-8">Final Indictment</h2>
            <p className="text-xs text-zinc-500 text-center uppercase font-mono">Select the culprit and motive based on the evidence gathered.</p>
            
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

interface AccusationFormProps {
  level: Level;
  onClose: () => void;
  onAccuse: (killer: string, motive: string, evidence: string) => void;
  clues: string[];
  discoveredSuspects: string[];
}

const AccusationForm: React.FC<AccusationFormProps> = ({ level, onClose, onAccuse, clues, discoveredSuspects }) => {
  const [killer, setKiller] = useState("");
  const [motive, setMotive] = useState("");
  const [evidence, setEvidence] = useState("");

  const motives = [
    "Crimes of Passion",
    "Business Rivalry",
    "Embezzlement & Cover-up",
    "Accidental Death",
    "Personal Vendetta"
  ];

  return (
    <div className="space-y-8 font-mono">
      <div className="space-y-2">
        <label className="text-[10px] text-zinc-500 uppercase font-bold">Primary Suspect (Discovered only)</label>
        <select value={killer} onChange={e => setKiller(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-3 text-sm uppercase outline-none focus:border-red-600 transition-colors cursor-pointer">
          <option value="">Select Suspect...</option>
          {(Object.values(level.npcs) as NPC[])
            .filter(n => n.id !== 'viktor' && n.id !== 'sandra' && discoveredSuspects.includes(n.id))
            .map(n => (
            <option key={n.id} value={n.id}>{n.name} ({n.role})</option>
          ))}
        </select>
        {discoveredSuspects.filter(id => id !== 'viktor' && id !== 'sandra').length === 0 && (
          <p className="text-[9px] text-red-400 italic">No suspects encountered in the field yet.</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-zinc-500 uppercase font-bold">Motive</label>
        <select value={motive} onChange={e => setMotive(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-3 text-sm uppercase outline-none focus:border-red-600 transition-colors cursor-pointer">
          <option value="">Select Motive...</option>
          {motives.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-zinc-500 uppercase font-bold">Key Evidence</label>
        <select value={evidence} onChange={e => setEvidence(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-3 text-sm uppercase outline-none focus:border-red-600 transition-colors cursor-pointer">
          <option value="">Select Evidence...</option>
          {clues.map(cId => (
            <option key={cId} value={cId}>{level.clues[cId].name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="ghost" onClick={onClose} className="flex-1">CANCEL</Button>
        <Button 
          variant="danger" 
          className="flex-1" 
          disabled={!killer || !motive || !evidence}
          onClick={() => onAccuse(killer, motive, evidence)}
        >
          EXECUTE ARREST WARRANT
        </Button>
      </div>
    </div>
  );
};

export default App;
