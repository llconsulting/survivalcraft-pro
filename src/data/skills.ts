import { Skill } from '../types';
import { Colors } from '../theme/colors';

export const skillsData: Skill[] = [
  {
    id: 'water',
    name: 'Water Security',
    category: 'Sustenance',
    tier: 'free',
    icon: 'tint',
    color: Colors.blue,
    description: 'Trust a source before you treat it',
    legId: 'water',
    content:
      'Most short outages are a water problem before they are anything else. The useful habit is boring: fill containers from a tap you already drink, while it still runs.\n\nBoiling can reduce biological risk in relatively clear water. It does not remove fuel, solvents, or a lot of farm and roof runoff. If the source is chemically questionable, a safer source beats a longer boil.',
    principles: [
      { id: 'trust-tap', text: 'Fill containers from a tap you already drink, before pressure drops.' },
      { id: 'boil-limits', text: 'Boiling is a biological step. It does not remove many chemicals.' },
      { id: 'ditch-last', text: 'An unknown ditch is a last resort, not a first move.' },
    ],
  },
  {
    id: 'fire',
    name: 'Fire Fundamentals',
    category: 'Thermal',
    tier: 'free',
    icon: 'fire',
    color: Colors.orange,
    description: 'Control, bans, and when not to light it',
    legId: 'night',
    content:
      'A lighter is a tool, not a plan. Fire needs a site you can put out, attention, and permission — a burn ban ends the drill before it starts.\n\nThis module does not walk you through building a fire. The field decision is usually whether you should light one at all. Do not idle an engine in a closed vehicle to skip that decision.',
    principles: [
      { id: 'site', text: 'A lighter is not a plan. You need a site you can put out.' },
      { id: 'ban', text: 'Burn bans and wind end the drill before it starts.' },
      { id: 'no-idle', text: 'Do not idle an engine for heat in a closed vehicle.' },
    ],
  },
  {
    id: 'shelter',
    name: 'Shelter Basics',
    category: 'Protection',
    tier: 'free',
    icon: 'campground',
    color: Colors.green,
    description: 'Heat loss, wind, and the ground',
    legId: 'night',
    content:
      'Shelter is a heat-loss problem: wind, wet clothes, and whatever you are sitting on. The solid wind break you already have usually beats a shelter you start at dusk.\n\nCotton holds water. A wool or synthetic layer is the one you want if the night gets damp. Vent a closed cabin if people are sleeping in it.',
    principles: [
      { id: 'heat-loss', text: 'Shelter is about heat loss: wind, wet, and the ground.' },
      { id: 'wind-break', text: 'Use the solid wind break you already have before you build a new one.' },
      { id: 'cotton', text: 'Cotton holds water. Prefer a layer that still insulates when damp.' },
    ],
  },
  {
    id: 'loadout',
    name: 'Pack Priority',
    category: 'Technical',
    tier: 'free',
    icon: 'pack',
    color: Colors.yellow,
    description: 'What a short walk actually spends',
    legId: 'carry',
    content:
      'On a same-day walk the order is water, a layer that still works if it gets wet, and light for a delay. Food matters more if you missed a meal or you will be out overnight.\n\nHeavy cans feel like preparedness and walk like a sprain. Pack the next few hours before you pack a fantasy week.',
    principles: [
      { id: 'order', text: 'For a short walk: water, a dry-capable layer, and light.' },
      { id: 'tax', text: 'Heavy food you cannot carry comfortably is a tax.' },
      { id: 'hours', text: 'Pack for the next few hours before you pack for a fantasy week.' },
    ],
  },
  {
    id: 'foraging',
    name: 'Foraging Risk',
    category: 'Sustenance',
    tier: 'free',
    icon: 'leaf',
    color: Colors.blue,
    description: 'Do not guess at calories',
    content:
      'Foraging is a high-risk way to get a few calories. This module does not identify plants. If you cannot name it with a reputable local guide, you do not eat it.\n\nLookalikes are the hazard. "Probably" is a no. The food you already packed is the plan.',
    principles: [
      { id: 'guide', text: 'Do not eat a plant you cannot name with a local field guide.' },
      { id: 'lookalike', text: 'Lookalikes are the hazard. "Probably" is a no.' },
      { id: 'packed', text: 'Calories you packed beat calories you guess at.' },
    ],
  },
  {
    id: 'knots',
    name: 'Knot Basics',
    category: 'Technical',
    tier: 'free',
    icon: 'knot',
    color: Colors.purple,
    description: 'A few knots you can tie cold',
    content:
      'A handful of reliable knots beats a dozen half-remembered ones. Practice the ones you would trust with a shelter or a load, and inspect them before they hold weight.\n\nIf you cannot tie it with cold hands, it is not in your kit yet. This page will not replace time with a rope.',
    principles: [
      { id: 'few', text: 'A few reliable knots beat a dozen half-remembered ones.' },
      { id: 'inspect', text: 'Inspect a knot before it holds a person or a shelter.' },
      { id: 'cold', text: 'If you cannot tie it with cold hands, it is not in your kit yet.' },
    ],
  },
  {
    id: 'medical',
    name: 'Medical Preparedness',
    category: 'Medical',
    tier: 'pro',
    icon: 'pulse',
    color: Colors.red,
    description: 'Kit planning, not a license to treat',
    legId: 'cut',
    content:
      'This is planning, not a license to treat anyone. For a manageable cut, direct pressure and getting to professional care is the whole idea. This app will not certify you and will not teach advanced procedures.\n\nTake a real first-aid course if you want hands-on skill. Keep a kit you actually know how to open, and replace what expires.',
    advanced: 'A weekend first-aid course beats another pouch of gear you have never opened.',
    principles: [
      { id: 'not-a-license', text: 'This module is planning, not a license to treat.' },
      { id: 'pressure-help', text: 'Direct pressure and getting help cover more incidents than heroics.' },
      { id: 'real-course', text: 'A real first-aid course is the hands-on path. This app will not certify you.' },
    ],
  },
  {
    id: 'comms',
    name: 'Communications Planning',
    category: 'Technical',
    tier: 'pro',
    icon: 'radio',
    color: Colors.purple,
    description: 'Who you call, and where you meet',
    content:
      'Write the plan down before you need it: who you contact, where you meet, and what "late" means. A charged phone is one path. Name the backup while everyone is calm.\n\nRadios that require a license still require a license. This module will not help you skip that.',
    advanced: 'A paper card in the bag beats a plan that lives in one phone.',
    principles: [
      { id: 'plan', text: 'Write down who you call, where you meet, and what "late" means.' },
      { id: 'backup', text: 'A charged phone is one path. Name the backup before you need it.' },
      { id: 'license', text: 'Radios that require a license still require a license.' },
    ],
  },
  {
    id: 'power',
    name: 'Power and Light',
    category: 'Technical',
    tier: 'pro',
    icon: 'bolt',
    color: Colors.yellow,
    description: 'Boring redundancy, not a hack',
    content:
      'Light you can wear beats a lantern you have to hold. Spare cells, and a way to charge them, matter more than a clever project.\n\nSkip improvised electrical work. Buy the dull spare and test it on a normal evening.',
    principles: [
      { id: 'wear', text: 'Light you can wear beats a lantern you have to hold.' },
      { id: 'spares', text: 'Spare cells and a way to charge them matter more than a clever hack.' },
      { id: 'no-diy', text: 'Skip improvised electrical projects. Buy the boring spare.' },
    ],
  },
  {
    id: 'food',
    name: 'Food Continuity',
    category: 'Sustenance',
    tier: 'pro',
    icon: 'food',
    color: Colors.orange,
    description: 'Rotate what you already eat',
    content:
      'A pantry of food you hate is a costume. Rotate what you already cook. A few days of household calories is a sane buffer, not a personality.\n\nCalories and water are different problems. Do not trade the water away to carry a heavy food tote on a short walk.',
    principles: [
      { id: 'rotate', text: 'Rotate what you already eat. A pantry you hate is a costume.' },
      { id: 'split', text: 'Calories and water are different problems. Do not trade the second for the first.' },
      { id: 'buffer', text: 'A few days of household food is a sane start. It is not an identity.' },
    ],
  },
  {
    id: 'chemistry',
    name: 'Household Chemical Safety',
    category: 'Technical',
    tier: 'elite',
    icon: 'flask',
    color: Colors.yellow,
    description: 'Storage and what not to mix',
    restricted: true,
    content:
      'Keep household products in the containers they came in, labeled, and apart from anything they should not meet. Never mix cleaners to see what happens.\n\nThis module will not tell you how to make, concentrate, or extract anything. Read the safety sheet and follow local disposal rules.',
    advanced: 'Ventilation and the original label solve more problems than a hack.',
    principles: [
      { id: 'labeled', text: 'Keep household chemicals in labeled containers. Do not mix them to see.' },
      { id: 'vent', text: 'Ventilation and separation matter more than hacks.' },
      { id: 'sds', text: 'Read the safety sheet. This module will not tell you how to make anything.' },
    ],
  },
  {
    id: 'coordination',
    name: 'Household Coordination',
    category: 'Social',
    tier: 'elite',
    icon: 'users',
    color: Colors.blue,
    description: 'Roles, a meeting point, a short drill',
    restricted: true,
    content:
      'Name roles before an incident: who watches the kids, who grabs the bag, who drives if driving is actually possible. Pick a reunification point that is not the hazard.\n\nThis is not a tactical course. Drills are allowed to go badly. Write down what failed.',
    principles: [
      { id: 'roles', text: 'Name roles before an incident, including who watches children.' },
      { id: 'meet', text: 'Pick a reunification point that is not the hazard.' },
      { id: 'after', text: 'After a drill, write what failed. A messy drill is still a drill.' },
    ],
  },
  {
    id: 'privacy',
    name: 'Account Hygiene',
    category: 'Technical',
    tier: 'elite',
    icon: 'lock',
    color: Colors.blue,
    description: 'Passwords, second factors, urgency scams',
    restricted: true,
    content:
      'A password manager and a second factor stop more ordinary harm than a clever alias. Do not send codes or documents to someone who created the urgency.\n\nThis is hygiene. It is not a guide to hiding from lawful process.',
    principles: [
      { id: 'mfa', text: 'A password manager and a second factor beat a clever alias.' },
      { id: 'urgency', text: 'Do not send codes or documents to someone who created the urgency.' },
      { id: 'lawful', text: 'This is hygiene, not a guide to hiding from lawful process.' },
    ],
  },
];
