import { Subject, Subtopic } from './types';

function st(
  id: string,
  name: string,
  opts: { sem5Synergy?: boolean; highYield?: boolean } = {}
): Subtopic {
  return {
    id,
    name,
    sem5Synergy: !!opts.sem5Synergy,
    highYield: !!opts.highYield,
    notes: false,
    pyq15y: false,
    dppDone: false,
    mastery: 'Not Started',
  };
}

// Ordered by historical GATE CE weightage, heaviest first.
export const SYLLABUS_TEMPLATE: Subject[] = [
  {
    id: 'geotech',
    name: 'Geotechnical Engineering',
    weightagePct: 13,
    subtopics: [
      st('geo-1', 'Soil classification & index properties', { highYield: true }),
      st('geo-2', 'Effective stress, permeability & seepage', { highYield: true, sem5Synergy: true }),
      st('geo-3', 'Consolidation & settlement', { sem5Synergy: true }),
      st('geo-4', 'Shear strength of soils', { highYield: true, sem5Synergy: true }),
      st('geo-5', 'Bearing capacity of shallow foundations', { highYield: true }),
      st('geo-6', 'Slope stability & earth pressure theories'),
      st('geo-7', 'Pile foundations'),
    ],
  },
  {
    id: 'maths',
    name: 'Engineering Mathematics',
    weightagePct: 13,
    subtopics: [
      st('math-1', 'Linear algebra', { highYield: true }),
      st('math-2', 'Calculus', { highYield: true }),
      st('math-3', 'Ordinary differential equations', { highYield: true }),
      st('math-4', 'Probability & statistics'),
      st('math-5', 'Numerical methods'),
      st('math-6', 'Complex variables'),
    ],
  },
  {
    id: 'env',
    name: 'Environmental Engineering',
    weightagePct: 10,
    subtopics: [
      st('env-1', 'Water demand & quality parameters', { highYield: true }),
      st('env-2', 'Water treatment unit operations', { highYield: true }),
      st('env-3', 'Wastewater treatment & disposal'),
      st('env-4', 'Air pollution & control'),
      st('env-5', 'Municipal solid waste management'),
      st('env-6', 'Noise pollution'),
    ],
  },
  {
    id: 'transport',
    name: 'Transportation Engineering',
    weightagePct: 9,
    subtopics: [
      st('tr-1', 'Highway geometric design', { highYield: true, sem5Synergy: true }),
      st('tr-2', 'Flexible & rigid pavement design', { highYield: true, sem5Synergy: true }),
      st('tr-3', 'Traffic engineering & studies', { sem5Synergy: true }),
      st('tr-4', 'Highway materials & construction'),
      st('tr-5', 'Railway engineering'),
      st('tr-6', 'Airport engineering'),
    ],
  },
  {
    id: 'wre',
    name: 'Water Resources Engineering',
    weightagePct: 9,
    subtopics: [
      st('wre-1', 'Fluid properties & fluid statics', { highYield: true }),
      st('wre-2', 'Flow measurement & dimensional analysis'),
      st('wre-3', 'Open channel flow', { highYield: true }),
      st('wre-4', 'Hydrology: rainfall-runoff & floods', { highYield: true }),
      st('wre-5', 'Groundwater hydraulics'),
      st('wre-6', 'Irrigation & canal design'),
    ],
  },
  {
    id: 'rcc',
    name: 'RCC Design',
    weightagePct: 8,
    subtopics: [
      st('rcc-1', 'Working stress & limit state philosophy', { sem5Synergy: true }),
      st('rcc-2', 'Design of beams & slabs', { highYield: true, sem5Synergy: true }),
      st('rcc-3', 'Design of columns & footings', { sem5Synergy: true }),
      st('rcc-4', 'Bond, anchorage & development length'),
      st('rcc-5', 'Prestressed concrete basics'),
    ],
  },
  {
    id: 'structures',
    name: 'Structural Analysis',
    weightagePct: 8,
    subtopics: [
      st('str-1', 'Determinate structures: SFD/BMD', { sem5Synergy: true }),
      st('str-2', 'Indeterminate structures & influence lines', { highYield: true, sem5Synergy: true }),
      st('str-3', 'Slope deflection & moment distribution', { sem5Synergy: true }),
      st('str-4', 'Matrix methods of analysis'),
      st('str-5', 'Basic structural dynamics'),
    ],
  },
  {
    id: 'surveying',
    name: 'Surveying',
    weightagePct: 7,
    subtopics: [
      st('sur-1', 'Plane surveying & chain-compass', { highYield: true }),
      st('sur-2', 'Levelling & contouring'),
      st('sur-3', 'Theodolite & traverse surveying'),
      st('sur-4', 'Curves: simple & compound'),
      st('sur-5', 'Remote sensing & GIS basics'),
    ],
  },
  {
    id: 'steel',
    name: 'Steel Structures',
    weightagePct: 7,
    subtopics: [
      st('stl-1', 'Design of tension members', { sem5Synergy: true }),
      st('stl-2', 'Design of compression members', { sem5Synergy: true }),
      st('stl-3', 'Design of beams & connections', { highYield: true, sem5Synergy: true }),
      st('stl-4', 'Plastic analysis basics'),
    ],
  },
  {
    id: 'cmm',
    name: 'Construction Materials & Management',
    weightagePct: 6,
    subtopics: [
      st('cmm-1', 'Cement, aggregates & concrete technology', { highYield: true }),
      st('cmm-2', 'Bricks, timber & other materials'),
      st('cmm-3', 'CPM & PERT network analysis', { highYield: true }),
      st('cmm-4', 'Cost estimation & valuation'),
    ],
  },
  {
    id: 'aptitude',
    name: 'General Aptitude',
    weightagePct: 15,
    subtopics: [
      st('apt-1', 'Verbal ability', { highYield: true }),
      st('apt-2', 'Numerical ability', { highYield: true }),
      st('apt-3', 'Analytical reasoning', { highYield: true }),
      st('apt-4', 'Spatial reasoning'),
    ],
  },
];
