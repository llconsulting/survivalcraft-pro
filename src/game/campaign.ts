import { DailyOpDef, Leg, Loadout } from './types';

export const CAMPAIGN_ID = 'dry-mile';

export const CAMPAIGN_TITLE = 'The Dry Mile';

export const CAMPAIGN_SUMMARY =
  'A storm closed the road between a trailhead and town. You have a partner, a trunk of ordinary gear, and four decisions. This is a training scenario, not a live incident and not a certification.';

export const LOADOUTS: Loadout[] = [
  {
    id: 'light',
    name: 'Light',
    summary: 'Two liters, a wool layer, a headlamp. You move easier. A cold night shows up sooner.',
    resources: { water: 68, warmth: 46, energy: 80, kit: 58 },
  },
  {
    id: 'balanced',
    name: 'Balanced',
    summary: 'The usual trunk kit. Enough water to think, enough insulation to wait, enough weight to notice.',
    resources: { water: 60, warmth: 62, energy: 70, kit: 76 },
  },
  {
    id: 'heavy',
    name: 'Heavy',
    summary: 'Cans, a stove, an extra tarp. Warmth and tools are fine. Water and your legs pay the tax.',
    resources: { water: 48, warmth: 74, energy: 54, kit: 88 },
  },
];

export const CAMPAIGN_LEGS: Leg[] = [
  {
    id: 'water',
    day: 1,
    short: 'Water',
    title: 'While the tap still runs',
    kicker: 'Day 1 · Water',
    skillIds: ['water'],
    briefing:
      'The trailhead tap is still running, thin but clear. You filled two half-liter bottles at home yesterday. An empty four-liter jug is in the trunk. A ditch beside the lot is moving. The radio already mentioned downed limbs between you and town.\n\nYou need drinking water for tonight and the walk out. You do not need a perfect system.',
    choices: [
      {
        id: 'tap',
        title: 'Fill the jug from the tap',
        stake: 'Drink what you packed. Top off from the tap you would use on a normal day.',
        grade: 'sound',
        deltas: { water: 24, energy: -6 },
        lesson:
          'The best water is water you already trust. Fill containers while a known tap still has pressure. A ditch is not a backup plan when that tap is running. If you later have to treat an unknown source, boiling can reduce biological risk in relatively clear water — it does not remove fuel, solvents, or farm runoff. Do not spend that compromise while the tap works.',
      },
      {
        id: 'ditch',
        title: 'Boil the ditch and skip the tap',
        stake: 'Walk past the spigot. Spend fuel and time on water you cannot vouch for.',
        grade: 'costly',
        deltas: { water: 6, energy: -16, warmth: -8, kit: -6 },
        lesson:
          'Boiling is a biological step, not a purification miracle. A roadside ditch picks up whatever the lot sheds, and boiling will not pull that out. You also spent fuel and daylight you wanted after dark. When a tap you trust is running, use it first. Treat unknown water only because you have to — the source choice is the real decision.',
      },
      {
        id: 'store',
        title: 'Leave the jug empty and try a store',
        stake: 'Bet the evening on open roads and an open register.',
        grade: 'risky',
        deltas: { water: -20, energy: -14, kit: -4 },
        lesson:
          'The supply run is the plan that fails in a line, a closure, or a blocked road. Secure water you can carry before you spend your one easy trip. In this scenario the road does close. An empty jug and a hopeful drive is how a short outage becomes a thirsty night.',
      },
    ],
  },
  {
    id: 'night',
    day: 1,
    short: 'Night',
    title: 'The car is already a shelter',
    kicker: 'Night · Shelter and fire',
    skillIds: ['shelter', 'fire'],
    briefing:
      'A limb is across the road. You will walk around it in the morning. Tonight is damp, about 45°F, with wind. You have the car, a wool blanket, a cotton hoodie, a lighter, a tarp, and deadfall at the edge of the lot.\n\nNobody is hurt. You need to wake up warm enough to walk. A flame is optional. A wind break is not.',
    choices: [
      {
        id: 'car',
        title: 'Stay with the car and insulate',
        stake: 'Wool over cotton. Tarp under you if the seat is wet. Crack a window. Leave the lighter in your pocket.',
        grade: 'sound',
        deltas: { warmth: 18, energy: -8, water: -8, kit: -2 },
        lesson:
          'Shelter is a heat-loss problem. The car is a wind break you already own. A damp seat steals heat, so put the tarp or a dry layer under you. Cotton holds water; wool still insulates when it is damp. Crack a window if anyone sleeps in the cabin. Keep the lighter pocketed: a fire beside vehicles in a dry wind is how people lose the wind break. If a burn ban is up, that decision is already made.',
      },
      {
        id: 'leanto',
        title: 'Leave the car, build a lean-to, light the wood',
        stake: 'Practice the camp craft tonight, away from the vehicle.',
        grade: 'costly',
        deltas: { warmth: -16, energy: -18, water: -8, kit: -8 },
        lesson:
          'A shelter you start at dusk is usually worse than the wind break parked beside you. Fire needs a site you can control, a way to put it out, and you awake to watch it. Drills belong in daylight with a bailout. Wind and burn bans end the drill before it starts. Tonight the win is staying warm, not proving you can make flame.',
      },
      {
        id: 'engine',
        title: 'Idle the engine, windows up',
        stake: 'Buy heat with the motor and a sealed cabin.',
        grade: 'risky',
        deltas: { warmth: -22, energy: -10, kit: -8 },
        lesson:
          'A running engine in a closed car is a carbon monoxide problem, not a heat plan. This scenario will not coach a "safe" idle time — there is no trick to learn there. Exhaust can pool in still air even with a window cracked. Use insulation. If anyone is drowsy, headachy, or confused, get to fresh air and emergency help. Do not troubleshoot it from inside the cabin.',
      },
    ],
  },
  {
    id: 'carry',
    day: 2,
    short: 'Pack',
    title: 'What fits in a daypack',
    kicker: 'Day 2 · Gear priority',
    skillIds: ['loadout'],
    briefing:
      'Morning. The walk around the limb is about three miles on a marked path. It is cool, and rain is plausible. You ate a small breakfast. What you take has to sit on your back without wrecking your knees.\n\nThe trunk is full of things that feel serious. Most of them are the wrong weight for this leg.',
    choices: [
      {
        id: 'priority',
        title: 'Water, wool, light, tarp',
        stake: 'Leave the canned haul. Carry what a short, wet walk actually spends.',
        grade: 'sound',
        deltas: { water: 10, warmth: 10, energy: -12, kit: -4 },
        lesson:
          'On a same-day walk the order is water, a layer that still works if it gets wet, and light for a delay. Food matters more if you missed a meal or you will be out overnight. Heavy cans feel like a plan and walk like a sprain. A phone is a backup for a map you already looked at — it is not warmth, and cold drains it.',
      },
      {
        id: 'tote',
        title: 'Cans, stove, and the axe',
        stake: 'One bottle of water, because the food is heavy.',
        grade: 'costly',
        deltas: { water: -18, energy: -22, warmth: -6, kit: -6 },
        lesson:
          'Calories you cannot comfortably carry are not a reserve. Water is the weight people under-budget, and you feel the lack sooner than hunger on a three-mile morning. An axe does not move a tree off a road you are walking around. Pack for the next few hours, then the night, then the fantasy week.',
      },
      {
        id: 'phone',
        title: 'Phone and the cotton hoodie',
        stake: 'It is only three miles. Leave the pack.',
        grade: 'risky',
        deltas: { water: -16, warmth: -18, energy: -8 },
        lesson:
          'Three miles is easy until rain, a wrong junction, or a rolled ankle turns it into hours. Cotton is a poor shell once it is wet. The phone dies in the cold and was never a shelter. Take the water and a layer you would still want if you had to stop.',
      },
    ],
  },
  {
    id: 'cut',
    day: 2,
    short: 'Care',
    title: 'Awake, talking, and walking',
    kicker: 'Day 2 · Care decision · not a medical course',
    skillIds: ['medical'],
    briefing:
      'Your partner slips on wet rock. A cut on the forearm is bleeding steadily. They are awake, talking in full sentences, and can walk. You are not a clinician. You have a clean bandana.\n\nThis is a decision drill. It will not certify you, and it will not teach advanced procedures. If this were real and you were unsure, you would call emergency services.',
    choices: [
      {
        id: 'pressure',
        title: 'Direct pressure, warmth, walk out together',
        stake: 'Clean cloth, firm pressure. Keep them warm. Continue only if the bleeding slows and they stay alert.',
        grade: 'sound',
        deltas: { kit: -8, energy: -10, warmth: 4, water: -6 },
        lesson:
          'For a cut you can see, on a person who is awake and walking, firm direct pressure and a trip to professional care is the decision. A tourniquet is for life-threatening limb bleeding, which this scenario is not showing you, and this app will not teach you to improvise one. If the bleeding will not slow, they fade, or you simply do not know — stop the drill and contact emergency services.',
      },
      {
        id: 'hurry',
        title: 'Skip pressure and beat the rain',
        stake: 'Walking speed over the bleeding you can already see.',
        grade: 'risky',
        deltas: { energy: -16, warmth: -12, water: -8, kit: -4 },
        lesson:
          'Pace is not care. Steady bleeding gets worse while you save minutes, and warmth and alertness are part of getting out. This is still not a medical course. The miss is ignoring a problem you can already see. If you are unsure in real life, call emergency services instead of hurrying past it.',
      },
      {
        id: 'video',
        title: 'Stop and follow a procedure video',
        stake: 'An advanced step from a clip, on a person who can still walk.',
        grade: 'costly',
        deltas: { energy: -12, warmth: -14, kit: -12, water: -6 },
        lesson:
          'A video is not training, and improvising an advanced step on someone who is awake and walking can injure them. You do not earn a certification on the trail. Pressure, warmth, and real care beat a tutorial. If the injury is beyond that, it is an emergency call, not a lesson.',
      },
    ],
  },
];

export const DAILY_OPS: DailyOpDef[] = [
  {
    id: 'water',
    title: 'Water audit',
    desc: 'Name the water you already trust, and fill it.',
    legId: 'water',
    tier: 'free',
  },
  {
    id: 'fire',
    title: 'Fire kit check',
    desc: 'Ignition stays pocketed unless you can control the site.',
    legId: 'night',
    tier: 'free',
  },
  {
    id: 'shelter',
    title: 'Shelter bag',
    desc: 'A wind break, and a layer that still works when damp.',
    legId: 'night',
    tier: 'free',
  },
  {
    id: 'medical',
    title: 'Medical inventory',
    desc: 'A kit check. Not a certification.',
    legId: 'cut',
    tier: 'pro',
  },
];
