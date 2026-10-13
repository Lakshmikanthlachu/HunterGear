// Content for the Ridgeline Outfitters template. Edit here, then `node tools/build.js`,
// or edit the generated HTML directly — the template does not require this tooling.
const site = {
  name: 'Ridgeline Outfitters',
  short: 'Ridgeline',
  url: 'https://www.example.com',
  tagline: 'Hunting gear and outdoor sports, fitted and tested by people who hunt.',
  phone: '(555) 010-0148',
  phoneHref: '+15550100148',
  email: 'hello@ridgeline-outfitters.example',
  address: ['2480 Timberline Road', 'Elkhorn Valley'],
  map: { lat: 46.3, lng: -111.95 }, // change to your store's coordinates
  hours: [
    ['Monday to Friday', '8 am to 6 pm'],
    ['Saturday', '7 am to 5 pm'],
    ['Sunday', '9 am to 3 pm'],
    ['Opening weekends', 'Doors open at 5 am']
  ]
};

const nav = [
  { key: 'home', label: 'Home', to: 'index.html' },
  { key: 'shop', label: 'Shop gear', to: 'pages/products.html' },
  { key: 'safety', label: 'Safety & regulations', to: 'pages/safety-regulations.html' },
  { key: 'contact', label: 'Contact', to: 'pages/contact.html' }
];

const categories = [
  { id: 'optics', name: 'Optics', blurb: 'Binoculars, rangefinders, trail cameras' },
  { id: 'apparel', name: 'Camo & apparel', blurb: 'Jackets, vests, caps and layers' },
  { id: 'boots', name: 'Boots', blurb: 'Waterproof and insulated footwear' },
  { id: 'packs', name: 'Packs', blurb: 'Hunting packs and daypacks' },
  { id: 'archery', name: 'Archery', blurb: 'Bows, arrows and tuning' },
  { id: 'knives', name: 'Knives & tools', blurb: 'Skinning knives, hatchets' },
  { id: 'camping', name: 'Camping', blurb: 'Tents and camp lighting' },
  { id: 'accessories', name: 'Accessories', blurb: 'Headlamps, bottles, small kit' }
];

// rank = order in "Featured"
const products = [
  { id: 'summit-binoculars', name: 'Summit HD 10x42 Binoculars', cat: 'optics', price: 289, was: 349, badge: 'sale', art: 'binoculars', rank: 1,
    desc: 'Waterproof, fog-proof roof prisms with extra-low dispersion glass for clear edges at dawn.', kw: 'binocular glass 10x42 waterproof' },
  { id: 'switchback-boot', name: 'Switchback 8" Waterproof Boot', cat: 'boots', price: 199, badge: 'pick', art: 'boot', rank: 2,
    desc: 'Full-grain leather upper with a seam-sealed membrane and a lug sole that grips wet slopes.', kw: 'boot leather waterproof hiking' },
  { id: 'timber-jacket', name: 'Timber Camo Insulated Jacket', cat: 'apparel', price: 179, badge: 'pick', art: 'jacket', rank: 3,
    desc: 'Quiet brushed shell with 100 g insulation and two hand-warmer pockets.', kw: 'camo jacket coat insulated' },
  { id: 'ironwood-bow', name: 'Ironwood 70 Compound Bow', cat: 'archery', price: 649, badge: 'new', art: 'bow', rank: 4,
    desc: 'Smooth 80 percent let-off, adjustable draw length 26 to 30 inches, tuned in store.', kw: 'bow compound archery' },
  { id: 'ridgeback-pack', name: 'Ridgeback 45L Hunting Pack', cat: 'packs', price: 249, art: 'pack', rank: 5,
    desc: 'Frame-supported pack with a meat-hauling bay, bottle pockets and a rain cover.', kw: 'backpack pack frame' },
  { id: 'plotter-rangefinder', name: 'Plotter 1000 Laser Rangefinder', cat: 'optics', price: 219, badge: 'new', art: 'rangefinder', rank: 6,
    desc: 'Reads to 1,000 yards with angle compensation and a bright red display.', kw: 'laser range finder distance' },
  { id: 'hivis-vest', name: 'Hi-Vis Blaze Safety Vest', cat: 'apparel', price: 39, art: 'vest', rank: 7,
    desc: 'Blaze orange with reflective bands and a mesh back. Check your local requirements before you buy.', kw: 'blaze orange safety vest' },
  { id: 'trailhead-headlamp', name: 'Trailhead Headlamp 600', cat: 'accessories', price: 45, badge: 'pick', art: 'headlamp', rank: 8,
    desc: '600 lumens with a red night mode so you can walk to your stand without spooking game.', kw: 'headlamp light lumen' },
  { id: 'carbon-arrows', name: 'Carbon Hunter Arrows, 6 pack', cat: 'archery', price: 79, art: 'arrows', rank: 9,
    desc: 'Straight to within 0.003 inches, fletched in high-visibility vanes and ready for field points.', kw: 'arrow carbon archery' },
  { id: 'northwind-pac', name: 'Northwind 1200 g Insulated Pac Boot', cat: 'boots', price: 159, was: 189, badge: 'sale', art: 'pacboot', rank: 10,
    desc: 'Rated to -40 °F with a removable felt liner and a rubber shell that sheds slush.', kw: 'pac boot winter insulated rubber' },
  { id: 'skinning-knife', name: 'Drop-Point Skinning Knife', cat: 'knives', price: 69, art: 'knife', rank: 11,
    desc: '4.2-inch stainless blade with a textured handle that stays grippy when wet.', kw: 'knife blade skinning field dressing' },
  { id: 'basecamp-tent', name: 'Basecamp 4-Person Tent', cat: 'camping', price: 329, art: 'tent', rank: 12,
    desc: 'Free-standing dome that pitches in ten minutes, with a full-coverage fly and two doors.', kw: 'tent camp shelter' },
  { id: 'scout-daypack', name: 'Scout 25L Hydration Daypack', cat: 'packs', price: 89, badge: 'new', art: 'daypack', rank: 13,
    desc: 'A light daypack with a 2-litre reservoir sleeve and a blaze-orange exterior for visibility.', kw: 'daypack hydration backpack' },
  { id: 'sentry-trailcam', name: 'Sentry 30MP Trail Camera', cat: 'optics', price: 129, art: 'trailcam', rank: 14,
    desc: 'Low-glow flash, 0.3-second trigger and a strap-on camo case.', kw: 'trail camera scouting game cam' },
  { id: 'camp-hatchet', name: 'Camp Hatchet', cat: 'knives', price: 59, was: 72, badge: 'sale', art: 'hatchet', rank: 15,
    desc: 'Forged head, hickory-feel handle and a sheath for splitting kindling at camp.', kw: 'hatchet axe camp' },
  { id: 'glow-lantern', name: 'Glow LED Lantern', cat: 'camping', price: 34, art: 'lantern', rank: 16,
    desc: 'Warm 400-lumen light that runs 60 hours on one charge and doubles as a power bank.', kw: 'lantern light camp led' },
  { id: 'wool-beanie', name: 'Ridgeline Wool Beanie', cat: 'apparel', price: 24, art: 'beanie', rank: 17,
    desc: 'Merino blend that stays warm when damp, with a blaze-orange patch.', kw: 'beanie hat cap wool' },
  { id: 'insulated-bottle', name: 'Insulated Bottle, 32 oz', cat: 'accessories', price: 32, art: 'bottle', rank: 18,
    desc: 'Keeps coffee hot for 12 hours and water cold for 24, with a loop that clips to your pack.', kw: 'bottle thermos flask' }
];

const seasonBoard = [
  { name: 'Upland birds', date: 'Oct 17' },
  { name: 'Waterfowl', date: 'Oct 24' },
  { name: 'Firearm deer', date: 'Nov 14' },
  { name: 'Late-season archery', date: 'Dec 1' }
];

const seasons = [
  { id: 'archery', tags: ['Quiet', 'Layers', 'Tuned bow'], icon: 'bow', title: 'Archery season', span: 'lg:col-span-7', line: 'Quiet layers, a tuned bow, arrows that fly straight.',
    picks: ['ironwood-bow', 'carbon-arrows', 'timber-jacket'], cat: 'archery', cta: 'Shop archery gear' },
  { id: 'deer', tags: ['Clear glass', 'Dry feet', 'Hi-vis'], icon: 'antler', title: 'Deer season', span: 'lg:col-span-5', line: 'Clear glass, dry feet and a vest that makes you easy to see.',
    picks: ['summit-binoculars', 'switchback-boot', 'hivis-vest'], cat: 'optics', cta: 'Shop optics' },
  { id: 'waterfowl', tags: ['Pre-dawn', 'Wet marsh', 'Long sits'], icon: 'duck', title: 'Waterfowl', span: 'lg:col-span-5', line: 'Set up in the dark and stay comfortable until the last flight.',
    picks: ['trailhead-headlamp', 'northwind-pac', 'insulated-bottle'], cat: 'accessories', cta: 'Shop accessories' },
  { id: 'winter', tags: ['Insulation', 'Cold hands', 'Stillness'], icon: 'snow', title: 'Late season', span: 'lg:col-span-7', line: 'Insulation that works when you sit still for hours.',
    picks: ['wool-beanie', 'northwind-pac', 'timber-jacket'], cat: 'apparel', cta: 'Shop warm layers' }
];

const features = [
  { icon: 'shield', title: 'Tested on real hunts', text: 'Staff wear every boot, pack and jacket in the field before it earns shelf space.' },
  { icon: 'ruler', title: 'Fitted before you buy', text: 'Bring your boots, bow or pack. We size, adjust and tune in store at no charge.' },
  { icon: 'users', title: 'Straight answers', text: 'Ask about weight, warmth or range and get a plain reply, even if it points you to the cheaper option.' },
  { icon: 'rotate', title: '30-day returns', text: 'Wear it around the house. If it is not right, bring it back within 30 days.' }
];

const brands = ['Northfork', 'Timberline', 'Kestrel Optics', 'Ironwood Archery', 'Coldwater', 'Switchback'];

const testimonials = [
  { q: 'I asked for warm boots and left with the right pair for sitting a stand in January. My toes stayed warm all season.', n: 'Dana R.', r: 'Deer hunter' },
  { q: 'They set up my bow, watched me shoot three arrows, then adjusted the rest. Nobody else bothers.', n: 'Marcus T.', r: 'Bowhunter' },
  { q: 'Fast answers by email and the vest was ready for pickup the same day. Exactly what a first-season hunter needs.', n: 'Priya N.', r: 'First-season hunter' }
];

const seasonTable = [
  ['White-tailed deer', 'Archery', 'Sep 14', 'Dec 31', 'Antlerless tag may be required'],
  ['White-tailed deer', 'Firearm', 'Nov 14', 'Nov 29', 'Blaze orange required'],
  ['Elk', 'Archery', 'Sep 5', 'Sep 30', 'Unit draw tag'],
  ['Wild turkey', 'Spring shotgun', 'Apr 18', 'May 31', 'One tag per bird'],
  ['Waterfowl', 'Shotgun', 'Oct 24', 'Jan 25', 'Non-toxic shot required'],
  ['Upland birds', 'Shotgun', 'Oct 17', 'Jan 31', 'Check daily bag limits'],
  ['Small game', 'Any legal method', 'Sep 1', 'Feb 28', 'Licence required']
];

const faqs = [
  ['Do I need a licence to hunt with a bow?', 'In most places, yes. Archery hunting usually needs the same licence as other methods plus a tag for the species. Check your wildlife agency’s current regulations before you go.'],
  ['What blaze orange do I need to wear?', 'Rules change by state, province and season. Many areas require a hat and a vest or coat during firearm seasons. Confirm the requirement with your agency, then pick gear that meets it.'],
  ['Can you check my bow’s draw length and tune it?', 'Yes. Bring your bow to the store and we will measure, tune and test it with you at no charge.'],
  ['Do you sell firearms or ammunition?', 'No. Ridgeline Outfitters stocks optics, apparel, archery, camping and field gear. We can point you to a licensed dealer nearby.'],
  ['Can I return boots I wore outdoors?', 'You can wear them indoors for up to 30 days and return them. Boots with mud, sole wear or odour cannot be returned.'],
  ['How do I find my hunting unit?', 'Use your wildlife agency’s online map, or ask us. We keep printed maps for local units at the counter.']
];

const careTips = [
  ['Optics', 'Wipe lenses with a microfibre cloth, never your sleeve. Cap them and store the pair in a padded case.'],
  ['Boots', 'Brush off mud, pull the insoles and dry them away from a heater. Reproof leather before each season.'],
  ['Bows', 'Wax the string every few weeks and check the limbs and cams for cracks before opening day.'],
  ['Knives', 'Wipe the blade dry after use, add a thin film of oil and store it outside the leather sheath.'],
  ['Camo and base layers', 'Wash with scent-free detergent, air dry and keep them in a sealed bag until you head out.'],
  ['Packs', 'Empty every pocket, shake out the crumbs and dry the pack fully to prevent mildew.']
];

module.exports = { site, nav, categories, products, seasonBoard, seasons, features, brands, testimonials, seasonTable, faqs, careTips };
