
import { Level } from './types.ts';

export const LEVELS: Record<number, Level> = {
  1: {
    id: 1,
    title: "The Vardar Bridge Case",
    caseFile: "VICTIM: Petar Stojanov, 54. FOUND: Under Stone Bridge, 03:00 AM. CAUSE: Blunt force trauma. Stojanov was a major developer in Centar. High profile.",
    locations: {
      "police_station": {
        id: "police_station",
        name: "Skopje Central Police Dept",
        description: "The air in the Taftalidze precinct is thick with cigarette smoke and bad coffee. Viktor's desk is a mess of files and half-empty aspirin packets. The radio hums with chatter about the Stojanov murder.",
        npcs: ["viktor", "sandra"],
        searches: [
          { id: "s1", description: "You check Viktor's drawer. It's full of 80s rock cassette tapes and a bottle of high-strength painkillers." }
        ],
        connections: ["stone_bridge", "debar_maalo"]
      },
      "stone_bridge": {
        id: "stone_bridge",
        name: "Stone Bridge (Crime Scene)",
        description: "The Vardar flows sluggishly below. Yellow tape flutters in the wind. The chalk outline of Petar Stojanov is still visible on the damp pavement where he was found at 3 AM.",
        npcs: [],
        searches: [
          { id: "s2", description: "You search the surrounding bushes and find a luxury cufflinks with an 'S' engraving.", clueId: "cufflink" },
          { id: "s3", description: "You notice a tire track near the walkway that doesn't match the police vehicles. Someone drove right up to the pedestrian zone.", clueId: "tire_track" }
        ],
        connections: ["police_station", "business_center"]
      },
      "debar_maalo": {
        id: "debar_maalo",
        name: "Debar Maalo - Bohemian Quarter",
        description: "The narrow streets are filled with the scent of grilled meat. This is where Stojanov spent his last evening. Witnesses say he was here until midnight.",
        npcs: ["waiter"],
        searches: [
          { id: "s4", description: "Inside 'Kafana Trend', you find a discarded receipt for three people. One of the names on the reservation was 'Markov'.", clueId: "receipt" }
        ],
        connections: ["police_station"]
      },
      "business_center": {
        id: "business_center",
        name: "Stojanov Holdings",
        description: "A cold, glass tower that looms over the city. This was the victim's empire. The lobby is eerily quiet now that the boss is gone.",
        npcs: ["secretary", "markov"],
        searches: [
          { id: "s5", description: "Behind the heavy oak desk in the executive suite, you find a shredder full of documents about a failed deal in Taftalidze.", clueId: "shredded_docs", requiresClueId: "receipt" }
        ],
        connections: ["stone_bridge"]
      }
    },
    npcs: {
      "viktor": {
        id: "viktor",
        name: "Chief Inspector Viktor Nikolov",
        role: "Your Partner",
        description: "1.88m, blonde, intense green eyes. He rubs his temples constantly.",
        initialNode: "v_start",
        dialogue: {
          "v_start": {
            id: "v_start",
            speaker: "Viktor",
            text: "My head is killing me. The light from that bridge scene was too much. What did we find, partner?",
            options: [
              { text: "Remind me about the victim.", nextId: "v_recap" },
              { text: "What's our next move, Viktor?", nextId: "v_hint" },
              { text: "We need to look at the suspects.", nextId: "v_suspects" },
              { text: "I'll get back to it.", nextId: "v_exit" }
            ]
          },
          "v_recap": {
            id: "v_recap",
            speaker: "Viktor",
            text: "Petar Stojanov. 54 years old. Real estate shark. Found face down under the Stone Bridge at 3 AM. Someone caved his skull in with a heavy object. He was last seen in Debar Maalo around midnight.",
            options: [
              { text: "Got it. Let's look at the suspects.", nextId: "v_suspects" },
              { text: "Back to business.", nextId: "v_start" }
            ]
          },
          "v_hint": {
            id: "v_hint",
            speaker: "Viktor",
            text: "[DYNAMIC_HINT]",
            options: [
              { text: "Got it. Let's keep moving.", nextId: "v_start" }
            ]
          },
          "v_suspects": {
            id: "v_suspects",
            speaker: "Viktor",
            text: "We have three main players: His ex-wife Sandra, his business rival Markov, and that shady secretary Elena. Markov has the power, Sandra has the history, Elena has the keys.",
            options: [
              { text: "Let's talk about Markov.", nextId: "v_markov_info" },
              { text: "Tell me more about Elena.", nextId: "v_elena_info" },
              { text: "Back to the main case.", nextId: "v_start" }
            ]
          },
          "v_markov_info": {
            id: "v_markov_info",
            speaker: "Viktor",
            text: "Markov owns half the skyline. He and Stojanov were 'frenemies'. If the deal went south, Markov stands to lose millions. He's often seen in his black SUV.",
            options: [
              { text: "A black SUV? Interesting.", nextId: "v_suspects", requirement: { clueId: "tire_track" } },
              { text: "I'll keep that in mind.", nextId: "v_suspects" }
            ]
          },
          "v_elena_info": {
            id: "v_elena_info",
            speaker: "Viktor",
            text: "Elena. Smart, efficient, and according to the files, she's been living way beyond her means lately. Keep an eye on her.",
            options: [
              { text: "Back to suspects.", nextId: "v_suspects" }
            ]
          },
          "v_exit": {
            id: "v_exit",
            speaker: "Viktor",
            text: "Don't let the city swallow the truth, partner. I'll be at my desk if you need me.",
            options: []
          }
        }
      },
      "sandra": {
        id: "sandra",
        name: "Dr. Sandra Kovac",
        role: "Medical Examiner",
        description: "Sharp features, dark hair, wears her lab coat like armor.",
        initialNode: "s_start",
        dialogue: {
          "s_start": {
            id: "s_start",
            speaker: "Sandra",
            text: "Viktor looks like he's about to collapse. Tell him to take his pills. Now, about the body...",
            options: [
              { text: "What did the autopsy show?", nextId: "s_autopsy" },
              { text: "Did you find anything on his clothes?", nextId: "s_clothes" },
              { text: "I've seen enough for now.", nextId: "s_exit" }
            ]
          },
          "s_autopsy": {
            id: "s_autopsy",
            speaker: "Sandra",
            text: "Blunt force. Heavy. Likely a metal pipe or a very expensive paperweight. Time of death was between 1 and 2 AM.",
            options: [
              { text: "Thanks, Sandra.", nextId: "s_start" }
            ]
          },
          "s_clothes": {
            id: "s_clothes",
            speaker: "Sandra",
            text: "He was missing a cufflink. Luxury brand. If you find the match, you find the killer. Or at least someone who was wrestling with him.",
            options: [
              { text: "A cufflink... noted.", nextId: "s_start" }
            ]
          },
          "s_exit": {
            id: "s_exit",
            speaker: "Sandra",
            text: "Try not to become a client of mine, Detective.",
            options: []
          }
        }
      },
      "waiter": {
        id: "waiter",
        name: "Lazo 'The Lip' Stojmenov",
        role: "Waiter at Kafana Trend",
        description: "Tired eyes, smells of rakija and smoke.",
        initialNode: "l_start",
        dialogue: {
          "l_start": {
            id: "l_start",
            speaker: "Lazo",
            text: "Stojanov? Yeah, he was here. Arguing with a guy in a suit. Real tense.",
            options: [
              { text: "Did you see where they went?", nextId: "l_exit" },
              { text: "I'm looking for evidence.", nextId: "l_exit_dialogue" }
            ]
          },
          "l_exit": {
            id: "l_exit",
            speaker: "Lazo",
            text: "They headed towards the Stone Bridge. Stojanov looked drunk. The other guy... he looked focused.",
            options: [
              { text: "Thanks for the info.", nextId: "l_start" }
            ]
          },
          "l_exit_dialogue": {
            id: "l_exit_dialogue",
            speaker: "Lazo",
            text: "Look, I got tables to clear. Ask around if you want, but don't scare off the regulars.",
            options: []
          }
        }
      },
      "markov": {
        id: "markov",
        name: "Goran Markov",
        role: "CEO, Markov Skies",
        description: "Dressed in a three-piece suit that costs more than your car. Smug expression.",
        initialNode: "m_start",
        dialogue: {
          "m_start": {
            id: "m_start",
            speaker: "Markov",
            text: "Detective. I assume you're here about the tragedy. Stojanov and I were close colleagues.",
            options: [
              { text: "You were seen arguing with him.", nextId: "m_argument" },
              { text: "Nice SUV in the parking lot.", nextId: "m_suv" },
              { text: "I'll be seeing you, Markov.", nextId: "m_exit" }
            ]
          },
          "m_argument": {
            id: "m_argument",
            speaker: "Markov",
            text: "Business is a contact sport. We disagreed on the Taftalidze project, but murder? I have a reputation to maintain.",
            options: [
              { text: "Back to the point.", nextId: "m_start" }
            ]
          },
          "m_suv": {
            id: "m_suv",
            speaker: "Markov",
            text: "An armored G-Wagon. Essential for a man in my position. Why do you ask?",
            options: [
              { text: "Just admiring the treads.", nextId: "m_start" }
            ]
          },
          "m_exit": {
            id: "m_exit",
            speaker: "Markov",
            text: "Don't let the door hit you on the way out. My lawyers are very sensitive to harassment.",
            options: []
          }
        }
      },
      "secretary": {
        id: "secretary",
        name: "Elena Popova",
        role: "Executive Secretary",
        description: "Perfectly polished, but her hands are shaking. She won't meet your eye.",
        initialNode: "e_start",
        dialogue: {
          "e_start": {
            id: "e_start",
            speaker: "Elena",
            text: "Mr. Stojanov was a complicated man. I just handle his schedule.",
            options: [
              { text: "His schedule for last night was empty.", nextId: "e_lie" },
              { text: "I'll be back later.", nextId: "e_exit" }
            ]
          },
          "e_lie": {
            id: "e_lie",
            speaker: "Elena",
            text: "He... he often took private meetings in Debar Maalo. I don't ask questions.",
            options: [
              { text: "You seem nervous, Elena.", nextId: "e_nervous", requirement: { clueId: "receipt" } },
              { text: "I'll be back.", nextId: "e_start" }
            ]
          },
          "e_nervous": {
            id: "e_nervous",
            speaker: "Elena",
            text: "Fine! He was meeting Markov. They were supposed to merge companies, but Stojanov backed out. Markov was furious. They left for a 'walk' near the river.",
            options: [
              { text: "Markov. Interesting.", nextId: "e_start" }
            ]
          },
          "e_exit": {
            id: "e_exit",
            speaker: "Elena",
            text: "Please... I have a lot of work to catch up on. His death has caused chaos.",
            options: []
          }
        }
      }
    },
    clues: {
      "cufflink": { id: "cufflink", name: "S-Engraved Cufflink", description: "A gold cufflink found at the crime scene. Matches Stojanov's initials, but one is missing from his body." },
      "tire_track": { id: "tire_track", name: "Heavy Tire Prints", description: "Found near the bridge. Likely from a heavy SUV." },
      "receipt": { id: "receipt", name: "Kafana Receipt", description: "Shows a large dinner for three people, paid by Stojanov." },
      "shredded_docs": { id: "shredded_docs", name: "Shredded Merger Contract", description: "Evidence that the business deal with Markov was falling apart violently." }
    },
    solution: {
      killerId: "secretary",
      motive: "Embezzlement & Cover-up",
      evidenceId: "shredded_docs"
    }
  }
};
