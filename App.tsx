
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
  const baseStyles = "px-3 py-2 sm:px-4 sm:py-2 font-mono text-[10px] sm:text-xs transition-all duration-200 uppercase tracking-tighter border flex items-center gap-2 justify-center leading-tight";
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

const DossierHeader: React.FC<{ level: Level; migraine: number }> = ({ level, migraine }) => (
  <header className="bg-[#e6dcc5] text-zinc-900 border-b-2 border-[#b09b78] shadow-lg sticky top-0 z-[60] w-full">
    <div className="p-3 md:p-4 flex flex-col space-y-2">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-1.5 py-0.5 bg-red-800 text-white text-[8px] font-bold shrink-0">TOP SECRET</span>
            <h1 className="text-sm md:text-xl font-bold tracking-tighter uppercase truncate leading-tight">{level.title}</h1>
          </div>
        </div>
        
        <div className="shrink-0 flex flex-col items-end">
          <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-zinc-600 mb-0.5 whitespace-nowrap">MIGRAINE</p>
          <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-black/10 border border-black/20 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${migraine > 75 ? 'bg-red-700' : 'bg-amber-800'}`} 
              style={{ width: `${migraine}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="border-t border-black/10 pt-1.5">
        <p className="text-[10px] md:text-[11px] font-mono font-bold leading-snug opacity-80 text-zinc-800">
          {level.caseFile}
        </p>
      </div>
    </div>
  </header>
);

const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-4 sm:p-8 space-y-8 animate-in fade-in duration-1000 overflow-y-auto">
    <div className="max-w-2xl w-full border border-zinc-800 p-6 sm:p-8 bg-zinc-900/30 space-y-6 my-auto">
      <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tighter">SKOPJE CONFIDENTIAL</h2>
          <p className="text-[8px] sm:text-[10px] text-amber-600 uppercase tracking-widest">Dept. Serious Crimes</p>
        </div>
        <span className="text-zinc-600 font-mono text-[10px] sm:text-xs">LOG_01-2024</span>
      </div>
      
      <div className="space-y-4 font-mono text-[10px] sm:text-xs text-zinc-400 leading-relaxed max-h-[50vh] overflow-y-auto pr-2">
        <p><span className="text-zinc-100 font-bold uppercase">PROLOGUE:</span> You are a Junior Detective transferred from Bitola. Skopje is meaner and smells of old cigarette ash.</p>
        <p>You've been assigned to <span className="text-zinc-100">Chief Inspector Viktor Nikolov</span>. He's a legend, but corruption has given him a permanent, debilitating migraine.</p>
        <p><span className="text-red-600 font-bold uppercase">THE CASE:</span> Petar Stojanov, a developer, was found dead at 3:00 AM on the Stone Bridge. Left for the Vardar to claim. No witnesses.</p>
        <p>Viktor is waiting. Keep your head down. <span className="text-zinc-100 font-bold uppercase underline">IMPORTANT:</span> If you are stuck or need guidance on evidence, return to the station and <span className="text-zinc-100 font-bold">TALK TO VIKTOR</span> directly. He knows how this city breathes.</p>
      </div>

      <div className="pt-4">
        <Button onClick={onStart} variant="primary" className="w-full py-4 text-xs sm:text-sm font-bold tracking-[0.2em]">INITIALIZE INVESTIGATION</Button>
      </div>
    </div>
  </div>
);

const WALKMAN_TRACKS = [
  { title: "I was made for lovin' you - KISS", context: "Viktor taps his fingers on the steering wheel. 'A classic for a messy city.'" },
  { title: "Can't Fight the Moonlight - LeAnn Rimes", context: "He looks at the Stone Bridge. 'Some things you just can't fight, partner.'" },
  { title: "In the army now - Status Quo", context: "Reminds him of his mandatory service in the 90s. Heavy air, heavy boots." },
  { title: "Va Va Voom - Nicki Minaj", context: "He suppresses a rare smile. 'The kids in the precinct play this. It's... catchy.'" },
  { title: "Running up that hill - Placebo", context: "Viktor sighs. 'Always climbing, never reaching the top.'" },
  { title: "It's no good - Depeche Mode", context: "The synths help him block out the buzzing in his skull." },
  { title: "A hard day's night - Les Crossaders", context: "He looks at his cold coffee. 'Every night in Skopje is a hard day's night.'" },
  { title: "Ante Up - M.O.P.", context: "The beat drops. Viktor's eyes sharpen. 'Time to lean on some suspects.'" },
  { title: "Skandal - Toni Zen", context: "Local Skopje vibes. 'Toni knows this city better than most of us.'" },
  { title: "The Temple of The King - Rainbow", context: "He closes his eyes. This one always takes the edge off the pain." },
  { title: "The best is yet to come - Sinatra", context: "Pure irony. In this department, the best is usually a closed file." },
  { title: "Mother - Danzig", context: "He thinks about the mothers who never got justice. It fuels him." },
  { title: "Say you will - Foreigner", context: "Viktor hums along. '80s rock... the only thing that doesn't change.'" },
  { title: "Safari song - Greta van Fleet", context: "Energy. Raw power. He feels the migraine receding slightly." },
  { title: "Lust for life - Iggy Pop", context: "Despite the corruption, Viktor still has a bit of this left." },
  { title: "Ace of Spades - Motorhead", context: "He turns the volume up. 'Lemmy understood the gamble of this job.'" },
  { title: "Brave new world - Iron maiden", context: "He looks at the new glass buildings. 'Nothing's brave about it, Steve.'" },
  { title: "My one and only love - John Coltrane", context: "The sax calms the storm in his head. Perfection." },
  { title: "Take a look around - Limp Bizkit", context: "The mission: impossible theme for a mission that feels impossible." },
  { title: "Back in black - AC/DC", context: "The ultimate return. 'Back to work,' he mutters." },
  { title: "Ain't talkin' bout love - Van Halen", context: "Viktor remembers his first leather jacket. It's in a box somewhere." },
  { title: "In Walks Barbarella - Clutch", context: "Groovy. Weird. Just like a night in Debar Maalo." },
  { title: "O Children - Nick Cave", context: "The darkness of the track matches the depth of the Vardar." },
  { title: "Bella Stella - Highland", context: "A bit of opera to class up the crime scene." },
  { title: "Caught out in the rain - Beth Hart", context: "Every detective in Skopje has been here. Literally and figuratively." },
  { title: "Sound of da police - KRS-One", context: "He chuckles. 'Woop-woop... that's us, partner.'" },
  { title: "Bella Ciao", context: "An anthem for those who keep fighting the good fight." },
  { title: "Movin' On - Tom Meighan", context: "Viktor checks his watch. We have to keep moving." },
  { title: "Hells Bells - AC/DC", context: "The tolling bell. It's either for the victim or the killer." },
  { title: "Don't Stop Belivin' - Journey", context: "'Believe in the evidence,' Viktor says. 'The rest is just noise.'" }
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
    
    if (loc === 'stone_bridge' && !clues.includes('receipt')) return "Search near the trash bin, partner.";
    if (loc === 'debar_maalo' && !clues.includes('hotel_card')) return "Lazo is hiding things. Search near the menus.";
    if (loc === 'hotel_arka' && (!clues.includes('cufflink') || !clues.includes('blackmail_docs'))) return "Check the safe and search under furniture.";
    if (loc === 'vardar_galleys' && !clues.includes('murder_weapon')) return "Look into the low branches near the shore.";
    if (loc === 'markov_residence' && !clues.includes('missing_statuette')) return "Check the presentation case in the hallway.";

    if (!clues.includes('receipt')) return "Back to the Stone Bridge. We missed something.";
    if (!clues.includes('hotel_card')) return "Head to Debar Maalo.";
    if (!clues.includes('cufflink')) return "Arka. Room 402. The trail goes cold otherwise.";
    if (!clues.includes('murder_weapon')) return "Check the Galleys.";
    if (!clues.includes('fingerprints')) return "Talk to Dr. Kovac at the station lab.";
    if (!clues.includes('missing_statuette')) return "Head to the Markov estate.";
    if (!clues.includes('blackmail_docs')) return "Need motive from the Arka safe.";

    return "We have it all. Head to the Station for the warrant.";
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
      setFlavorText("Sweep complete. No new evidence.");
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

  const handleDialogueOption = (nextId: string, onSelect?: () => void) => {
    if (!activeNPC) return;
    
    if (onSelect) {
      onSelect();
    }

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
    
    setGameState(prev => ({
      ...prev,
      migraineLevel: Math.max(0, prev.migraineLevel - 5)
    }));

    setFlavorText(`📻 NOW PLAYING: ${track.title} -- ${track.context} (MIGRAINE REDUCED)`);
    setTimeout(() => setFlavorText(null), 6000);
  };

  if (showIntro) return <IntroScreen onStart={() => setShowIntro(false)} />;

  if (gameState.isGameOver) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 font-mono text-zinc-100 grainy overflow-y-auto">
        <div className="max-w-xl w-full border-2 border-zinc-800 p-6 sm:p-8 text-center space-y-6 bg-zinc-900/40 shadow-[0_0_50px_rgba(0,0,0,1)] my-auto">
          <h2 className={`text-3xl sm:text-5xl font-bold tracking-tighter ${gameState.gameWon ? 'text-green-500' : 'text-red-500'}`}>
            {gameState.gameWon ? "CASE CLOSED" : "CASE COLD"}
          </h2>
          <div className="h-0.5 bg-zinc-800 w-full" />
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            {gameState.gameWon 
              ? `Marija Markova was arrested. The silver trowel was the smoking gun. Viktor looks at the city lights: 'Nice work, partner. Coffee is on me.'`
              : "The warrant was rejected. The Markovs fled to Greece. Viktor handed in his badge. Skopje remains silent."}
          </p>
          <Button onClick={resetGame} variant="primary" className="w-full sm:w-auto mx-auto py-4">REOPEN DOSSIER</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto flex flex-col border-x border-zinc-800 bg-[#0a0a0a] shadow-2xl relative grainy font-mono">
      <DossierHeader level={currentLevel} migraine={gameState.migraineLevel} />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 pb-32">
        {flavorText && (
          <div className="fixed top-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md bg-amber-950 text-amber-100 p-3 sm:p-4 border-2 border-amber-600 text-[9px] sm:text-xs z-[70] animate-in fade-in slide-in-from-top-2 duration-300 shadow-2xl uppercase text-center border-double">
            {flavorText}
          </div>
        )}

        {activeNPC && currentDialogue ? (
          <div className="border border-amber-900/30 bg-zinc-900/50 p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div>
              <p className="text-[8px] sm:text-[10px] text-amber-500 uppercase tracking-[0.3em] mb-1">{activeNPC.role}</p>
              <h3 className="text-lg sm:text-2xl font-bold text-zinc-100">{activeNPC.name}</h3>
            </div>
            <div className="py-3 sm:py-4 border-y border-zinc-800">
              <p className="text-zinc-300 italic leading-relaxed font-serif text-sm sm:text-lg">"{currentDialogue.text}"</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {currentDialogue.options.map((opt, i) => {
                const hasReq = !opt.requirement || (opt.requirement.clueId && gameState.discoveredClues.includes(opt.requirement.clueId));
                
                // Wrap the selection to include the original onSelect if it exists
                const handleSelection = () => {
                   handleDialogueOption(opt.nextId, opt.onSelect);
                };

                return (
                  <Button 
                    key={i} 
                    disabled={!hasReq}
                    onClick={handleSelection}
                    className="text-left justify-start"
                  >
                    {opt.text} {!hasReq && " [MISSING EVIDENCE]"}
                  </Button>
                );
              })}
              {currentDialogue.options.length === 0 && (
                <Button variant="success" onClick={() => { setActiveNPC(null); setCurrentDialogue(null); }}>END CONVERSATION</Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            <section className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-1 h-6 sm:w-1.5 sm:h-8 bg-amber-600" />
                <h2 className="text-xl sm:text-3xl font-bold text-zinc-100 tracking-tight uppercase">{currentLocation.name}</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm md:text-base italic border-l border-zinc-800 pl-4 sm:pl-6">
                {currentLocation.description}
              </p>
            </section>

            <section className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSearch} variant="primary" className="flex-1 py-4 text-xs font-bold border-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                SEARCH AREA
              </Button>
              {currentLocation.npcs.map(nId => {
                const npc = currentLevel.npcs[nId];
                let label = "";
                if (nId === 'viktor') label = "TALK TO VIKTOR";
                else if (nId === 'sandra') label = "TALK TO DR. KOVAC";
                else label = `INTERROGATE ${npc.name.split(' ')[0]}`;
                
                return (
                  <Button key={nId} onClick={() => startDialogue(nId)} variant="dossier" className="flex-1 py-4 text-xs font-bold border-2">
                    {label}
                  </Button>
                );
              })}
            </section>

            <section className="space-y-3 sm:space-y-4 border-t border-zinc-900 pt-6">
              <h4 className="text-[9px] sm:text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">Investigate Locations</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {gameState.unlockedLocations.map(locId => (
                  <Button 
                    key={locId} 
                    variant={gameState.currentLocationId === locId ? 'success' : 'ghost'}
                    className={`text-[8px] sm:text-[9px] py-2 sm:py-3 ${gameState.currentLocationId === locId ? 'border-2' : ''}`}
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

            <section className="border-t border-zinc-900 pt-6 sm:pt-8">
              <h4 className="text-[9px] sm:text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold mb-4">Evidence Locker</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gameState.discoveredClues.map(cId => {
                  const clue = currentLevel.clues[cId];
                  return (
                    <div key={cId} className="p-2 sm:p-3 border border-zinc-800 bg-zinc-900/30 rounded-sm flex items-start gap-2 sm:gap-3">
                      <div className="mt-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-600 shrink-0 shadow-[0_0_5px_rgba(217,119,6,0.5)]" />
                      <div className="overflow-hidden">
                        <h5 className="text-[10px] sm:text-[11px] font-bold text-amber-500 uppercase mb-0.5 truncate">{clue.name}</h5>
                        <p className="text-[9px] sm:text-[10px] text-zinc-500 leading-tight italic truncate sm:whitespace-normal">"{clue.description}"</p>
                      </div>
                    </div>
                  );
                })}
                {gameState.discoveredClues.length === 0 && (
                  <div className="col-span-1 sm:col-span-2 text-center py-6 sm:py-8 border border-dashed border-zinc-800 opacity-20 text-[8px] sm:text-[10px] uppercase tracking-widest">No Evidence Collected</div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur-md sticky bottom-0 z-50 flex justify-between items-center gap-4">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            className="text-[8px] sm:text-[9px] text-amber-500/80 p-2 sm:px-4 border-amber-900/30" 
            onClick={toggleWalkman}
          >
            <span>📻 WALKMAN</span>
          </Button>
        </div>
        
        {gameState.currentLocationId === 'police_station' && !activeNPC && (
          <Button variant="danger" className="px-4 sm:px-8 font-bold border-2 animate-pulse text-[10px] sm:text-xs" onClick={() => setIsAccusing(true)}>
            FILE WARRANT
          </Button>
        )}
      </footer>

      {isAccusing && (
        <div className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="max-w-xl w-full border-2 border-red-900/50 bg-[#050505] p-6 sm:p-8 space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-300 shadow-2xl my-auto">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-3xl font-bold text-red-600 uppercase tracking-tighter">FINAL ARREST DOSSIER</h2>
              <p className="text-[8px] sm:text-[10px] text-zinc-500 uppercase font-mono tracking-widest">Select ID, Motive, and Weapon.</p>
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
    <div className="space-y-4 sm:space-y-6 font-mono">
      <div className="space-y-1 sm:space-y-2">
        <label className="text-[8px] sm:text-[10px] text-zinc-500 uppercase font-bold">SUSPECT_ID</label>
        <select value={killer} onChange={e => setKiller(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 sm:p-3 text-[10px] sm:text-xs uppercase outline-none focus:border-red-600 appearance-none rounded-none">
          <option value="">-- SELECT --</option>
          {discoveredSuspects.filter(id => id !== 'viktor' && id !== 'sandra' && id !== 'waiter').map(id => (
            <option key={id} value={id}>{level.npcs[id].name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1 sm:space-y-2">
        <label className="text-[8px] sm:text-[10px] text-zinc-500 uppercase font-bold">MOTIVE</label>
        <select value={motive} onChange={e => setMotive(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 sm:p-3 text-[10px] sm:text-xs uppercase outline-none focus:border-red-600 appearance-none rounded-none">
          <option value="">-- SELECT --</option>
          {motives.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="space-y-1 sm:space-y-2">
        <label className="text-[8px] sm:text-[10px] text-zinc-500 uppercase font-bold">EXHIBIT A (WEAPON)</label>
        <select value={evidence} onChange={e => setEvidence(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 sm:p-3 text-[10px] sm:text-xs uppercase outline-none focus:border-red-600 appearance-none rounded-none">
          <option value="">-- SELECT --</option>
          {clues.map(cId => <option key={cId} value={cId}>{level.clues[cId].name}</option>)}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2">
        <Button variant="ghost" onClick={onClose} className="w-full py-3">CANCEL</Button>
        <Button 
          variant="danger" 
          className="w-full py-3" 
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
