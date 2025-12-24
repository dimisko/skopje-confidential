
import { Level } from './types.ts';

export const LEVELS: Record<number, Level> = {
  1: {
    id: 1,
    title: "Water Under the Bridge",
    caseFile: "VICTIM: Petar Stojanov (44). FOUND: Stone Bridge @ 03:00. CAUSE: Blunt Force Trauma / Laceration. NOTES: Victim was a top city developer. No wallet found. Signs of struggle.",
    locations: {
      "police_station": {
        id: "police_station",
        name: "Skopje Central Police Dept",
        description: "The precinct smells of damp concrete and cheap tobacco. Viktor sits at his desk, head in hands. This is the only place in Skopje where the truth feels like a burden rather than a secret.",
        npcs: ["viktor", "sandra"],
        searches: [
          { id: "s1", description: "Viktor's desk contains an emergency stash of potent painkillers. You give him two. His breathing slows down.", clueId: "migraine_relief" }
        ],
        isInitial: true
      },
      "stone_bridge": {
        id: "stone_bridge",
        name: "Stone Bridge (Crime Scene)",
        description: "Police tape flutters in the wind. The Vardar river rages below. The spot where Stojanov fell is marked with a dark stain. The city's center feels cold tonight.",
        npcs: [],
        searches: [
          { id: "s2", description: "You notice tire tracks near the pedestrian zone. Heavy treads, likely a high-end SUV. No police vehicles were here yet.", clueId: "tire_track" },
          { id: "s3", description: "Discarded near a trash bin is a damp receipt from 'Kafana Trend' in Debar Maalo, dated last night.", clueId: "receipt" }
        ],
        isInitial: true
      },
      "debar_maalo": {
        id: "debar_maalo",
        name: "Debar Maalo - Kafana Trend",
        description: "The bohemian quarter is quiet now. 'Trend' is empty, but the scent of grilled meat lingers. This is where Stojanov spent his final hours.",
        npcs: ["waiter"],
        searches: [
          { id: "s4", description: "Behind a stack of menus, you find a booking card for 'Hotel Arka', Room 402, booked under the name 'Elena P.'", clueId: "hotel_card" }
        ]
      },
      "hotel_arka": {
        id: "hotel_arka",
        name: "Hotel Arka - Room 402",
        description: "A luxury boutique hotel in the Old Bazaar. Room 402 is clean, but there's a lingering scent of expensive perfume. Stojanov clearly used this for 'private' matters.",
        npcs: [],
        searches: [
          { id: "s5", description: "Under the bedside table, you find a gold cufflink with an 'S' engraving. It matches the one missing from the victim's body.", clueId: "cufflink" },
          { id: "s6", description: "Hidden in the room's safe (which was left open), you find documents showing Stojanov was blackmailing Marija Markova for files on her husband's embezzlement.", clueId: "blackmail_docs" }
        ]
      },
      "vardar_galleys": {
        id: "vardar_galleys",
        name: "Vardar River Galleys",
        description: "The wooden tourist ships look like ghosts in the dark. The river current is strong here, swirling around the piles of the bridge.",
        npcs: [],
        searches: [
          { id: "s7", description: "Caught in the low-hanging branches of a willow tree near the galley, you spot something silver and sharp. It's a heavy commemorative trowel—etched with the victim's name and stained with blood.", clueId: "murder_weapon" }
        ]
      },
      "markov_residence": {
        id: "markov_residence",
        name: "Markov Estate",
        description: "A fortress of glass and marble in Vodno. The home of Goran Markov and his wife, Marija. Money can't hide the tension in the air here.",
        npcs: ["markov", "marija"],
        searches: [
          { id: "s8", description: "In the study hallway, there is an open velvet-lined case labeled 'Grand Opening: Skopje East Plaza'. The silver trowel meant for the case is missing.", clueId: "missing_statuette" }
        ]
      }
    },
    npcs: {
      "viktor": {
        id: "viktor",
        name: "Chief Inspector Viktor Nikolov",
        role: "Partner",
        description: "Tall, weary, and perpetually reaching for his temples.",
        initialNode: "v_start",
        dialogue: {
          "v_start": {
            id: "v_start",
            speaker: "Viktor",
            text: "My brain is vibrating. This city is too loud for justice. What have you found in the Stojanov case?",
            options: [
              { text: "I need a fresh pair of eyes on this.", nextId: "v_help" },
              { text: "Who are our key suspects?", nextId: "v_suspects" },
              { text: "I'll keep digging.", nextId: "v_exit" }
            ]
          },
          "v_help": {
            id: "v_help",
            speaker: "Viktor",
            text: "[DYNAMIC_HINT]",
            options: [{ text: "Understood.", nextId: "v_start" }]
          },
          "v_suspects": {
            id: "v_suspects",
            speaker: "Viktor",
            text: "Markov is the obvious choice—business rivalry. But his wife, Marija... she's always been the silent partner. And Stojanov was a known womanizer. Women were his weakness and his leverage.",
            options: [{ text: "I'll keep that in mind.", nextId: "v_start" }]
          },
          "v_exit": { id: "v_exit", speaker: "Viktor", text: "Go. Don't let the Vardar wash away the truth before we can catch it.", options: [] }
        }
      },
      "sandra": {
        id: "sandra",
        name: "Dr. Sandra Kovac",
        role: "Medical Examiner",
        description: "Clinical, sharp, and impatient.",
        initialNode: "s_start",
        dialogue: {
          "s_start": {
            id: "s_start",
            speaker: "Sandra",
            text: "The lab is a mess. I'm busy. Unless you have something physical from the scene, get out of my sight.",
            options: [
              { text: "Analyze the silver trowel.", nextId: "s_trowel", requirement: { clueId: "murder_weapon" } },
              { text: "Check the cufflink for DNA.", nextId: "s_cufflink_lab", requirement: { clueId: "cufflink" } },
              { text: "I'll leave you to your work.", nextId: "s_exit" }
            ]
          },
          "s_trowel": {
            id: "s_trowel",
            speaker: "Sandra",
            text: "Give me that. (She powders the handle). Exactly as I thought. Fingerprints. Let me cross-reference... It's a match. Marija Markova. You've got her, detective.",
            options: [{ text: "Excellent.", nextId: "s_start", onSelect: () => { 
                // This is a special hook to trigger clue discovery via dialogue
                window.dispatchEvent(new CustomEvent('discover_clue', { detail: 'fingerprints' }));
            }}]
          },
          "s_cufflink_lab": {
            id: "s_cufflink_lab",
            speaker: "Sandra",
            text: "This gold 'S' has skin cells caught in the engraving. The DNA sequencer doesn't lie. It's Marija's. She was struggling with him when he died.",
            options: [{ text: "Good work, Sandra.", nextId: "s_start", onSelect: () => {
                window.dispatchEvent(new CustomEvent('discover_clue', { detail: 'forensic_report' }));
            }}]
          },
          "s_exit": { id: "s_exit", speaker: "Sandra", text: "And close the door on your way out.", options: [] }
        }
      },
      "waiter": {
        id: "waiter",
        name: "Lazo",
        role: "Waiter",
        description: "Knows too much, says too little.",
        initialNode: "l_start",
        dialogue: {
          "l_start": {
            id: "l_start",
            speaker: "Lazo",
            text: "Stojanov? He was here with a woman. Not his wife. She looked expensive and very, very angry. They left in a hurry.",
            options: [
              { text: "Where were they headed?", nextId: "l_info" },
              { text: "I have to go.", nextId: "l_exit" }
            ]
          },
          "l_info": {
            id: "l_info",
            speaker: "Lazo",
            text: "She mentioned 'Room 402'. I didn't catch the hotel, but she mentioned it was 'near the Bazaar'. Arka fits the bill.",
            options: [
              { text: "That's useful. Thanks.", nextId: "l_start" },
              { text: "See you around, Lazo.", nextId: "l_exit" }
            ]
          },
          "l_exit": { id: "l_exit", speaker: "Lazo", text: "Watch your back, detective.", options: [] }
        }
      },
      "markov": {
        id: "markov",
        name: "Goran Markov",
        role: "Business Partner",
        description: "A man who buys cities and burns bridges.",
        initialNode: "m_start",
        dialogue: {
          "m_start": {
            id: "m_start",
            speaker: "Goran",
            text: "Stojanov was a parasite. But I didn't kill him. I'm a businessman, not a thug. Ask my wife if you want a character witness.",
            options: [
              { text: "Where is Marija?", nextId: "m_wife" },
              { text: "What about the tire tracks?", nextId: "m_tires", requirement: { clueId: "tire_track" } },
              { text: "I'll be seeing you.", nextId: "m_exit" }
            ]
          },
          "m_wife": {
            id: "m_wife",
            speaker: "Goran",
            text: "She's upstairs. She's been... fragile since the news. They were 'close' once.",
            options: [{ text: "I'll go find her.", nextId: "m_start" }]
          },
          "m_tires": {
            id: "m_tires",
            speaker: "Goran",
            text: "I have a G-Wagon. So does half of Vodno. You need more than tread depth to lock me up, detective.",
            options: [{ text: "We'll see.", nextId: "m_start" }]
          },
          "m_exit": { id: "m_exit", speaker: "Goran", text: "Get out of my house.", options: [] }
        }
      },
      "marija": {
        id: "marija",
        name: "Marija Markova",
        role: "The Wife",
        description: "Dressed in mourning black. Her eyes are dry and cold.",
        initialNode: "mr_start",
        dialogue: {
          "mr_start": {
            id: "mr_start",
            speaker: "Marija",
            text: "Petar was a fool. He thought he could use me to destroy Goran. He didn't realize that in Skopje, you don't use people like me.",
            options: [
              { text: "Explain your presence at Hotel Arka.", nextId: "mr_confront", requirement: { clueId: "hotel_card" } },
              { text: "Does this cufflink look familiar?", nextId: "mr_cufflink", requirement: { clueId: "cufflink" } },
              { text: "I found your blackmail documents.", nextId: "mr_blackmail", requirement: { clueId: "blackmail_docs" } },
              { text: "We found the murder weapon. Admit it.", nextId: "mr_weapon_deny", requirement: { clueId: "murder_weapon" } },
              { text: "Mention the fingerprints found in the lab.", nextId: "mr_weapon", requirement: { clueId: "fingerprints" } },
              { text: "Goodbye.", nextId: "mr_exit" }
            ]
          },
          "mr_weapon_deny": {
            id: "mr_weapon_deny",
            speaker: "Marija",
            text: "A silver trowel? Yes, we have many. Petar probably took it himself. You have no proof I ever touched it last night.",
            options: [{ text: "We'll see about that.", nextId: "mr_start" }]
          },
          "mr_confront": {
            id: "mr_confront",
            speaker: "Marija",
            text: "We had a history. A mistake. But Petar wanted more than just my company—he wanted Goran's empire. He threatened to expose us. I went there to beg him to stop.",
            options: [{ text: "I see.", nextId: "mr_start" }]
          },
          "mr_cufflink": {
            id: "mr_cufflink",
            speaker: "Marija",
            text: "A gold 'S'. Yes, he wore those every day. He was obsessed with his own name. I haven't seen that one in weeks.",
            options: [{ text: "You're lying.", nextId: "mr_start" }]
          },
          "mr_blackmail": {
            id: "mr_blackmail",
            speaker: "Marija",
            text: "He was forcing me to steal files. He was going to send Goran to prison and leave me with nothing. But that's not a reason to kill a man, is it?",
            options: [
              { text: "It is for someone with your temper.", nextId: "mr_start" },
              { text: "The presentation case in the hall is empty.", nextId: "mr_missing", requirement: { clueId: "missing_statuette" } }
            ]
          },
          "mr_missing": {
            id: "mr_missing",
            speaker: "Marija",
            text: "Petar loved that trowel. He kept it in the study. He probably took it himself as some sort of sick souvenir.",
            options: [{ text: "We found it. Covered in his blood.", nextId: "mr_start", requirement: { clueId: "murder_weapon" } }]
          },
          "mr_weapon": {
            id: "mr_weapon",
            speaker: "Marija",
            text: "The prints... you found them? (She collapses into a chair) It was so heavy... and sharp. He laughed at me on that bridge. He said I was just a pawn in his development plan. I didn't plan it... I just couldn't let him build his empire on my bones.",
            options: [{ text: "It's over, Marija.", nextId: "mr_exit" }]
          },
          "mr_exit": { id: "mr_exit", speaker: "Marija", text: "I have nothing more to say to the police.", options: [] }
        }
      }
    },
    clues: {
      "tire_track": { id: "tire_track", name: "SUV Tire Tracks", description: "Heavy treads found at the Stone Bridge. Matches Goran Markov's G-Wagon." },
      "receipt": { id: "receipt", name: "Kafana Receipt", description: "A receipt from Debar Maalo. Leads to Lazo the waiter." },
      "hotel_card": { id: "hotel_card", name: "Hotel Arka Card", description: "Found in Debar Maalo. Mentions Room 402." },
      "cufflink": { id: "cufflink", name: "S-Cufflink", description: "Found in Hotel Arka. A match for the victim's missing one." },
      "blackmail_docs": { id: "blackmail_docs", name: "Blackmail Files", description: "Proves Stojanov was forcing Marija to spy on her husband." },
      "murder_weapon": { id: "murder_weapon", name: "Silver Trowel", description: "The murder weapon. Found in the Vardar. Needs lab analysis." },
      "fingerprints": { id: "fingerprints", name: "Marija's Prints", description: "Forensic match: Marija's fingerprints found on the murder weapon." },
      "forensic_report": { id: "forensic_report", name: "Cufflink Lab Report", description: "Skin cells on the cufflink provide a DNA match for Marija Markova." },
      "missing_statuette": { id: "missing_statuette", name: "Empty Display Case", description: "The presentation case for the silver trowel is empty at the Markov house." },
      "migraine_relief": { id: "migraine_relief", name: "Painkillers", description: "Viktor's meds. Essential for keeping him focused." }
    },
    solution: {
      killerId: "marija",
      motive: "Personal Vendetta",
      evidenceId: "murder_weapon"
    }
  }
};
