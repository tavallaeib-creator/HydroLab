import { useEffect, useMemo, useState } from 'react';
import {
  Atom,
  ArrowRight,
  ArrowUpRight,
  Beaker,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Columns2,
  Eye,
  EyeOff,
  FlaskConical,
  Home,
  Info,
  Lightbulb,
  Move3D,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import molecules from './data/molecules.json';
import MoleculeViewer from './components/MoleculeViewer.jsx';

const COPY = {
  en: {
    navHome: 'Home', navExplore: 'Molecule Explorer', navCompare: 'Compare', navQuiz: 'Chemistry Quiz', navAbout: 'About HydroLab',
    language: 'فارسی', eyebrow: 'A DIGITAL SPACE FOR MOLECULAR DISCOVERY',
    heroTitle: 'Explore the molecules\nthat shape our world.',
    heroText: 'A hands-on chemistry laboratory for exploring molecular structures, understanding bonds, and learning through interactive 3D models.',
    start: 'Start exploring', learn: 'Learn chemistry',
    collection: 'THE MOLECULE COLLECTION', structureCount: '10 molecules', familiesCount: '4 hydrocarbon families', dimension: 'Interactive 3D models',
    featured: 'Featured molecule', viewMolecule: 'Explore this molecule', exploreCollection: 'Explore the collection',
    exploreTitle: 'Molecule explorer', exploreSubtitle: 'Choose a molecule, inspect its geometry, and discover how its atoms are connected.',
    library: 'Molecule library', search: 'Search by name or formula…', all: 'All', alkane: 'Alkanes', alkene: 'Alkenes', alkyne: 'Alkynes', aromatic: 'Aromatic',
    viewer: '3D MOLECULAR VIEWER', labels: 'Atom labels', reset: 'Reset camera', rotate: 'Auto rotate',
    ballStick: 'Ball & stick', spaceFill: 'Space filling', structural: 'Structural formula',
    rotateHint: 'Drag to rotate', zoomHint: 'Scroll to zoom', carbon: 'Carbon', hydrogen: 'Hydrogen', selected: 'SELECTED MOLECULE',
    details: 'Molecule information', formula: 'Molecular formula', mass: 'Molar mass', atoms: 'Total atoms', bonds: 'Total bonds', family: 'Family',
    carbons: 'Carbon atoms', hydrogens: 'Hydrogen atoms', bondTypes: 'Bond profile', single: 'Single', double: 'Double', triple: 'Triple', aromaticBonds: 'Aromatic',
    structureNotation: 'SMILES notation', educational: 'Did you know?', source: 'Verified identity', sourceLine: 'PubChem record',
    modelDisclaimer: '3D coordinates are computed conformers, minimized with MMFF94s. They illustrate molecular shape and connectivity; they are not experimental measurements.',
    aromaticNote: 'Aromaticity note', aromaticDisclaimer: 'The alternating double-bond styling is one resonance form. In benzene, the six C–C bonds are equivalent and the π electrons are delocalized.',
    empty: 'No molecules match this search.',
    compareTitle: 'Compare molecules', compareSubtitle: 'Put two structures side by side and compare their composition, mass, and bonding.',
    moleculeA: 'First molecule', moleculeB: 'Second molecule', chooseMolecule: 'Choose a molecule', comparison: 'Comparison', property: 'Property',
    structuralFeatures: 'Structural characteristics', molecularIdentity: 'Molecular identity', noDifference: 'Same value', different: 'Different',
    quizTitle: 'Chemistry quiz', quizSubtitle: 'Check your understanding of molecular formulas, hydrocarbon families, and chemical bonds.',
    question: 'Question', of: 'of', checkAnswer: 'Check answer', nextQuestion: 'Next question', correct: 'Correct answer', incorrect: 'Not quite',
    correctAnswer: 'Correct answer:', quizResult: 'Your result', restart: 'Try again', score: 'Score', points: 'points',
    homeTitle: 'A closer look at chemistry', homeSubtitle: 'Explore molecular structure with scientific context, clear visuals, and interactive learning tools.',
    bondsTitle: 'Discover chemical bonds', singleText: 'A single covalent bond shares one pair of electrons between two atoms.',
    doubleText: 'A double covalent bond shares two pairs of electrons between two atoms.',
    tripleText: 'A triple covalent bond shares three pairs of electrons between two atoms.',
    didYouKnow: 'A little chemistry insight', didYouKnowText: 'Benzene has six equivalent carbon–carbon bonds. Its π electrons are delocalized around the ring, rather than confined to alternating individual bonds.',
    learnInteractTitle: 'Learn by exploring', learnInteractText: 'Rotate a 3D structure, change its representation, and connect the visual model with its molecular formula and bond data.',
    takeQuiz: 'Take the chemistry quiz', seeAll: 'Browse all molecules',
    feature1: 'Accurate molecule data', feature1Text: 'Explore a curated hydrocarbon collection with atom connectivity and computed 3D coordinates.',
    feature2: 'Interactive 3D viewer', feature2Text: 'Rotate, zoom, and change the way atoms and bonds are represented.',
    feature3: 'Bilingual learning', feature3Text: 'Switch between English and Persian, with the appropriate reading direction.',
    feature4: 'Compare and practice', feature4Text: 'Compare molecular properties and reinforce key concepts with a short quiz.',
    aboutTitle: 'About HydroLab', aboutSubtitle: 'An interactive learning space for discovering the structures and relationships of simple hydrocarbons.',
    learnTitle: 'A few ideas before you explore', learnSubtitle: 'Use the molecular viewer as a window into structure—not as a substitute for experimental measurement.',
    atomsTitle: 'Atoms have visual identities', atomsText: 'Carbon is shown in graphite and hydrogen in a pale tone. Their sizes and colors help distinguish the elements in the 3D model.',
    bondsLearnTitle: 'Bond order changes the picture', bondsLearnText: 'Single, double, and triple bonds are drawn with one, two, or three parallel rods. Their positions follow the molecular geometry.',
    shapeTitle: 'Molecular shape is three-dimensional', shapeText: 'A flat structural drawing can hide bond angles and spatial arrangement. Rotate a model to inspect its geometry from different directions.',
    limitsTitle: 'A model is not a measurement', limitsText: 'The displayed conformers are computed from structure records and minimized with a force field. Real molecules vibrate and can adopt multiple conformations.',
    familiesTitle: 'Four families in this collection', alkaneDesc: 'Saturated hydrocarbons with carbon–carbon single bonds.', alkeneDesc: 'Hydrocarbons containing at least one carbon–carbon double bond.', alkyneDesc: 'Hydrocarbons containing a carbon–carbon triple bond.', aromaticDesc: 'Ring systems with delocalized π electrons and characteristic bonding.',
    sourcesTitle: 'Chemical data and provenance', sourcesText: 'Compound identities, formulas, and connectivity are referenced to PubChem. The checked-in 3D coordinates were generated with RDKit ETKDGv3 and minimized using MMFF94s.',
    footer: 'Made for curious minds and careful exploration.',
    studyLabel: 'MOLECULAR STUDY', discoverLabel: 'DISCOVER', bondExplorerLabel: 'BOND EXPLORER', interactiveLearningLabel: 'INTERACTIVE LEARNING', practiceLabel: 'PRACTICE', learnLabel: 'LEARN', referenceLabel: 'REFERENCE', dataNoteLabel: 'DATA NOTE', footerMotto: 'STRUCTURE / FORM / SPACE', moleculeUnit: 'MOLECULES', atomUnit: 'ATOMS', liveModelLabel: 'LIVE MODEL', viewerUnavailable: '3D graphics are not available in this browser.', collectionLabel: 'COLLECTION', remainingQuestions: 'questions in this quiz',
  },
  fa: {
    navHome: 'خانه', navExplore: 'کاوشگر مولکول‌ها', navCompare: 'مقایسه مولکول‌ها', navQuiz: 'آزمون شیمی', navAbout: 'درباره HydroLab',
    language: 'English', eyebrow: 'فضایی دیجیتال برای کشف مولکول‌ها',
    heroTitle: 'مولکول‌هایی را کشف کن\nکه جهان ما را می‌سازند.',
    heroText: 'آزمایشگاهی تعاملی برای بررسی ساختار مولکول‌ها، شناخت پیوندهای شیمیایی و یادگیری با مدل‌های سه‌بعدی.',
    start: 'شروع کاوش', learn: 'یادگیری شیمی',
    collection: 'مجموعه مولکول‌ها', structureCount: '۱۰ مولکول', familiesCount: '۴ خانواده هیدروکربنی', dimension: 'مدل‌های سه‌بعدی تعاملی',
    featured: 'مولکول منتخب', viewMolecule: 'کاوش این مولکول', exploreCollection: 'کاوش مجموعه',
    exploreTitle: 'کاوشگر مولکول‌ها', exploreSubtitle: 'یک مولکول را انتخاب کن، هندسه آن را بررسی کن و اتصال میان اتم‌ها را بشناس.',
    library: 'کتابخانه مولکول‌ها', search: 'جست‌وجو بر اساس نام یا فرمول…', all: 'همه', alkane: 'آلکان‌ها', alkene: 'آلکن‌ها', alkyne: 'آلکین‌ها', aromatic: 'آروماتیک',
    viewer: 'نمایشگر سه‌بعدی مولکول', labels: 'برچسب اتم‌ها', reset: 'بازنشانی دوربین', rotate: 'چرخش خودکار',
    ballStick: 'توپ و میله', spaceFill: 'فضای پرشده', structural: 'فرمول ساختاری',
    rotateHint: 'برای چرخش بکش', zoomHint: 'برای بزرگ‌نمایی پیمایش کن', carbon: 'کربن', hydrogen: 'هیدروژن', selected: 'مولکول انتخاب‌شده',
    details: 'اطلاعات مولکول', formula: 'فرمول مولکولی', mass: 'جرم مولی', atoms: 'تعداد کل اتم‌ها', bonds: 'تعداد کل پیوندها', family: 'خانواده',
    carbons: 'اتم‌های کربن', hydrogens: 'اتم‌های هیدروژن', bondTypes: 'ترکیب پیوندها', single: 'یگانه', double: 'دوگانه', triple: 'سه‌گانه', aromaticBonds: 'آروماتیک',
    structureNotation: 'نمادگذاری SMILES', educational: 'آیا می‌دانستی؟', source: 'شناسه معتبر', sourceLine: 'رکورد پاب‌کم',
    modelDisclaimer: 'مختصات سه‌بعدی، آرایش‌های محاسباتی هستند که با روش MMFF94s کمینه‌سازی شده‌اند. این مدل‌ها شکل و اتصال اتم‌ها را نشان می‌دهند و اندازه‌گیری آزمایشگاهی نیستند.',
    aromaticNote: 'نکته آروماتیسیته', aromaticDisclaimer: 'نمایش پیوندهای دوگانه متناوب، یکی از ساختارهای رزونانسی است. در بنزن هر شش پیوند کربن–کربن هم‌ارزند و الکترون‌های π پخش‌شده‌اند.',
    empty: 'مولکولی با این جست‌وجو پیدا نشد.',
    compareTitle: 'مقایسه مولکول‌ها', compareSubtitle: 'دو ساختار را کنار هم قرار بده و ترکیب، جرم و نوع پیوندهای آن‌ها را مقایسه کن.',
    moleculeA: 'مولکول نخست', moleculeB: 'مولکول دوم', chooseMolecule: 'انتخاب مولکول', comparison: 'مقایسه', property: 'ویژگی',
    structuralFeatures: 'ویژگی‌های ساختاری', molecularIdentity: 'مشخصات مولکولی', noDifference: 'مقدار یکسان', different: 'متفاوت',
    quizTitle: 'آزمون شیمی', quizSubtitle: 'دانسته‌هایت را درباره فرمول‌های مولکولی، خانواده هیدروکربن‌ها و پیوندهای شیمیایی بسنج.',
    question: 'پرسش', of: 'از', checkAnswer: 'بررسی پاسخ', nextQuestion: 'پرسش بعدی', correct: 'پاسخ درست است', incorrect: 'این پاسخ درست نیست',
    correctAnswer: 'پاسخ درست:', quizResult: 'نتیجه آزمون', restart: 'شروع دوباره', score: 'امتیاز', points: 'امتیاز',
    homeTitle: 'نگاهی دقیق‌تر به شیمی', homeSubtitle: 'ساختار مولکول‌ها را با زمینه علمی، نمایش روشن و ابزارهای یادگیری تعاملی کشف کن.',
    bondsTitle: 'پیوندهای شیمیایی را کشف کن', singleText: 'در پیوند کووالانسی یگانه، یک جفت الکترون میان دو اتم به اشتراک گذاشته می‌شود.',
    doubleText: 'در پیوند کووالانسی دوگانه، دو جفت الکترون میان دو اتم به اشتراک گذاشته می‌شود.',
    tripleText: 'در پیوند کووالانسی سه‌گانه، سه جفت الکترون میان دو اتم به اشتراک گذاشته می‌شود.',
    didYouKnow: 'یک نکته شیمیایی', didYouKnowText: 'در بنزن شش پیوند کربن–کربن هم‌ارز وجود دارد. الکترون‌های π در سراسر حلقه پخش شده‌اند و به پیوندهای جداگانه محدود نیستند.',
    learnInteractTitle: 'با کاوش یاد بگیر', learnInteractText: 'مدل سه‌بعدی را بچرخان، شیوه نمایش آن را تغییر بده و تصویر را با فرمول مولکولی و اطلاعات پیوندها مرتبط کن.',
    takeQuiz: 'شرکت در آزمون شیمی', seeAll: 'دیدن همه مولکول‌ها',
    feature1: 'داده‌های دقیق مولکولی', feature1Text: 'مجموعه‌ای از هیدروکربن‌ها را همراه با اتصال اتم‌ها و مختصات سه‌بعدی محاسباتی بررسی کن.',
    feature2: 'نمایشگر سه‌بعدی تعاملی', feature2Text: 'مدل را بچرخان، بزرگ‌نمایی کن و شیوه نمایش اتم‌ها و پیوندها را تغییر بده.',
    feature3: 'یادگیری دوزبانه', feature3Text: 'میان فارسی و انگلیسی جابه‌جا شو و جهت نوشتار مناسب را ببین.',
    feature4: 'مقایسه و تمرین', feature4Text: 'ویژگی‌های مولکولی را مقایسه کن و با یک آزمون کوتاه مفاهیم را مرور کن.',
    aboutTitle: 'درباره HydroLab', aboutSubtitle: 'فضایی تعاملی برای شناخت ساختارها و ارتباط‌های میان هیدروکربن‌های ساده.',
    learnTitle: 'پیش از کاوش، چند نکته', learnSubtitle: 'نمایشگر مولکولی دریچه‌ای برای شناخت ساختار است، نه جایگزین اندازه‌گیری آزمایشگاهی.',
    atomsTitle: 'اتم‌ها هویت بصری دارند', atomsText: 'کربن با رنگ گرافیتی و هیدروژن با رنگ روشن نمایش داده می‌شود. رنگ و اندازه به تشخیص عنصرها در مدل سه‌بعدی کمک می‌کند.',
    bondsLearnTitle: 'مرتبه پیوند، تصویر را تغییر می‌دهد', bondsLearnText: 'پیوندهای یگانه، دوگانه و سه‌گانه به‌ترتیب با یک، دو یا سه میله موازی نمایش داده می‌شوند. جای آن‌ها از هندسه مولکول پیروی می‌کند.',
    shapeTitle: 'شکل مولکول سه‌بعدی است', shapeText: 'نمایش دوبعدی ممکن است زاویه پیوندها و آرایش فضایی را پنهان کند. مدل را بچرخان تا هندسه را از جهت‌های گوناگون ببینی.',
    limitsTitle: 'مدل، اندازه‌گیری نیست', limitsText: 'آرایش‌های نمایش‌داده‌شده با روش محاسباتی و میدان نیرو کمینه‌سازی شده‌اند. مولکول‌های واقعی ارتعاش دارند و می‌توانند چندین آرایش بگیرند.',
    familiesTitle: 'چهار خانواده در این مجموعه', alkaneDesc: 'هیدروکربن‌های سیرشده با پیوندهای یگانه کربن–کربن.', alkeneDesc: 'هیدروکربن‌هایی که دست‌کم یک پیوند دوگانه کربن–کربن دارند.', alkyneDesc: 'هیدروکربن‌هایی با پیوند سه‌گانه کربن–کربن.', aromaticDesc: 'سامانه‌های حلقوی با الکترون‌های π غیرموضعی و ویژگی‌های پیوندی مشخص.',
    sourcesTitle: 'داده‌های شیمیایی و خاستگاه آن‌ها', sourcesText: 'هویت ترکیب‌ها، فرمول‌ها و اتصال اتم‌ها با داده‌های پاب‌کم ارجاع داده شده‌اند. مختصات سه‌بعدی موجود در پروژه با RDKit و روش ETKDGv3 تولید و با MMFF94s کمینه‌سازی شده‌اند.',
    footer: 'برای ذهن‌های کنجکاو و کاوش دقیق ساخته شده است.',
    studyLabel: 'کاوش مولکولی', discoverLabel: 'کشف', bondExplorerLabel: 'کاوش پیوندها', interactiveLearningLabel: 'یادگیری تعاملی', practiceLabel: 'تمرین', learnLabel: 'یادگیری', referenceLabel: 'مرجع', dataNoteLabel: 'یادداشت داده', footerMotto: 'ساختار / شکل / فضا', moleculeUnit: 'مولکول', atomUnit: 'اتم', liveModelLabel: 'مدل زنده', viewerUnavailable: 'نمایش سه‌بعدی در این مرورگر در دسترس نیست.', collectionLabel: 'مجموعه', remainingQuestions: 'پرسش باقی‌مانده',
  },
};

const CATEGORY_ORDER = ['all', 'alkane', 'alkene', 'alkyne', 'aromatic'];
const CATEGORY_LABEL = {
  en: { all: 'All', alkane: 'Alkane', alkene: 'Alkene', alkyne: 'Alkyne', aromatic: 'Aromatic' },
  fa: { all: 'همه', alkane: 'آلکان', alkene: 'آلکن', alkyne: 'آلکین', aromatic: 'آروماتیک' },
};

const QUESTIONS = {
  en: [
    { prompt: 'Which molecule contains a carbon–carbon triple bond?', options: ['Ethene', 'Ethyne', 'Ethane', 'Methane'], answer: 1, explanation: 'Ethyne (C₂H₂) contains a carbon–carbon triple bond.' },
    { prompt: 'Which hydrocarbon family contains only carbon–carbon single bonds?', options: ['Alkenes', 'Alkynes', 'Alkanes', 'Aromatic hydrocarbons'], answer: 2, explanation: 'Alkanes are saturated hydrocarbons with carbon–carbon single bonds.' },
    { prompt: 'What is the molecular formula of ethene?', options: ['C₂H₆', 'C₂H₄', 'C₂H₂', 'CH₄'], answer: 1, explanation: 'Ethene has the molecular formula C₂H₄.' },
    { prompt: 'How many atoms are present in one methane molecule?', options: ['4', '5', '6', '8'], answer: 1, explanation: 'Methane (CH₄) contains one carbon atom and four hydrogen atoms.' },
    { prompt: 'Which formula belongs to benzene?', options: ['C₆H₆', 'C₆H₁₄', 'C₃H₆', 'C₂H₂'], answer: 0, explanation: 'Benzene has the molecular formula C₆H₆.' },
  ],
  fa: [
    { prompt: 'کدام مولکول دارای پیوند سه‌گانه کربن–کربن است؟', options: ['اتن', 'اتین', 'اتان', 'متان'], answer: 1, explanation: 'اتین (C₂H₂) دارای یک پیوند سه‌گانه کربن–کربن است.' },
    { prompt: 'کدام خانواده هیدروکربنی فقط پیوندهای یگانه کربن–کربن دارد؟', options: ['آلکن‌ها', 'آلکین‌ها', 'آلکان‌ها', 'هیدروکربن‌های آروماتیک'], answer: 2, explanation: 'آلکان‌ها هیدروکربن‌های سیرشده با پیوندهای یگانه کربن–کربن هستند.' },
    { prompt: 'فرمول مولکولی اتن چیست؟', options: ['C₂H₆', 'C₂H₄', 'C₂H₂', 'CH₄'], answer: 1, explanation: 'فرمول مولکولی اتن C₂H₄ است.' },
    { prompt: 'در یک مولکول متان چند اتم وجود دارد؟', options: ['۴', '۵', '۶', '۸'], answer: 1, explanation: 'متان (CH₄) از یک اتم کربن و چهار اتم هیدروژن تشکیل شده است.' },
    { prompt: 'کدام فرمول متعلق به بنزن است؟', options: ['C₆H₆', 'C₆H₁₄', 'C₃H₆', 'C₂H₂'], answer: 0, explanation: 'فرمول مولکولی بنزن C₆H₆ است.' },
  ],
};

function Formula({ value }) {
  const parts = String(value || '').match(/[A-Z][a-z]?\d*/g) || [value];
  return <span className="formula-text">{parts.map((part, index) => {
    const match = String(part).match(/^([A-Za-z]+)(\d*)$/);
    return <span key={`${part}-${index}`}>{match?.[1] || part}{match?.[2] && <sub>{match[2]}</sub>}</span>;
  })}</span>;
}

function getBondProfile(molecule) {
  return molecule.bonds.reduce((counts, bond) => {
    if (bond.aromatic || (bond.order > 1.4 && bond.order < 1.8)) counts.aromatic += 1;
    else if (bond.order >= 2.6) counts.triple += 1;
    else if (bond.order >= 1.8) counts.double += 1;
    else counts.single += 1;
    return counts;
  }, { single: 0, double: 0, triple: 0, aromatic: 0 });
}

function Header({ language, setLanguage, activeView, setActiveView, copy }) {
  const links = [
    { id: 'home', label: copy.navHome, icon: Home },
    { id: 'explore', label: copy.navExplore, icon: Move3D },
    { id: 'compare', label: copy.navCompare, icon: Columns2 },
    { id: 'quiz', label: copy.navQuiz, icon: CircleHelp },
    { id: 'about', label: copy.navAbout, icon: Info },
  ];
  return (
    <header className="site-header">
      <button className="brand" onClick={() => setActiveView('home')} aria-label={language === 'fa' ? 'صفحه اصلی HydroLab' : 'HydroLab home'}>
        <span className="brand-mark"><Atom size={22} strokeWidth={1.8} /></span>
        <span className="brand-copy"><strong>HydroLab</strong><small>{language === 'fa' ? 'کاوش مولکولی' : 'MOLECULAR DISCOVERY'}</small></span>
      </button>
      <nav className="main-nav" aria-label={language === 'fa' ? 'ناوبری اصلی' : 'Main navigation'}>
        {links.map(({ id, label, icon: Icon }) => (
          <button key={id} className={activeView === id ? 'nav-link active' : 'nav-link'} onClick={() => setActiveView(id)} aria-current={activeView === id ? 'page' : undefined}>
            <Icon size={15} /> <span>{label}</span>
          </button>
        ))}
      </nav>
      <button className="language-button" onClick={() => setLanguage(language === 'en' ? 'fa' : 'en')} aria-label={language === 'en' ? 'Switch language to Persian' : 'تغییر زبان به انگلیسی'}>
        <span className="language-dot" />{copy.language}
      </button>
    </header>
  );
}

function PageIntro({ kicker, title, text, icon: Icon = FlaskConical }) {
  return (
    <div className="section-intro">
      <div><span className="eyebrow small-eyebrow"><span className="eyebrow-rule" />{kicker}</span><h2>{title}</h2><p>{text}</p></div>
      <div className="section-stamp"><Icon size={19} /><span>HYDROLAB</span></div>
    </div>
  );
}

function Hero({ copy, onOpen, onLearn, language }) {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-rule" />{copy.eyebrow}</div>
        <h1>{copy.heroTitle.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
        <p>{copy.heroText}</p>
        <div className="hero-actions">
          <button className="primary-button" onClick={onOpen}>{copy.start}<ArrowRight size={17} /></button>
          <button className="secondary-button" onClick={onLearn}><BookOpen size={16} />{copy.learn}</button>
        </div>
      </div>
      <div className="hero-side" aria-hidden="true">
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <div className="hero-molecule"><span className="molecule-node node-one" /><span className="molecule-node node-two" /><span className="molecule-node node-three" /><span className="molecule-node node-four" /><span className="molecule-bond bond-one" /><span className="molecule-bond bond-two" /><span className="molecule-bond bond-three" /></div>
        <div className="hero-side-caption"><span>01 / 10</span><strong>{language === 'fa' ? 'مدل مولکولی' : <>MOLECULAR<br />MODEL</>}</strong></div>
      </div>
      <div className="hero-metrics">
        <div><strong>10</strong><span>{copy.structureCount}</span></div>
        <div><strong>04</strong><span>{copy.familiesCount}</span></div>
        <div><strong>3D</strong><span>{copy.dimension}</span></div>
      </div>
    </section>
  );
}

function HomeView({ copy, language, setActiveView, setSelectedId }) {
  const featured = molecules.find((molecule) => molecule.id === 'benzene') || molecules[0];
  const representative = ['methane', 'ethene', 'ethyne', 'benzene'].map((id) => molecules.find((molecule) => molecule.id === id)).filter(Boolean);
  const openMolecule = (id) => { setSelectedId(id); setActiveView('explore'); };
  const features = [
    { icon: <Atom size={20} />, title: copy.feature1, text: copy.feature1Text },
    { icon: <Move3D size={20} />, title: copy.feature2, text: copy.feature2Text },
    { icon: <BookOpen size={20} />, title: copy.feature3, text: copy.feature3Text },
    { icon: <Target size={20} />, title: copy.feature4, text: copy.feature4Text },
  ];
  return (
    <>
      <Hero copy={copy} language={language} onOpen={() => setActiveView('explore')} onLearn={() => setActiveView('about')} />
      <section className="home-section featured-section">
        <div className="home-section-heading"><div><span className="section-index">01 / {copy.featured.toUpperCase()}</span><h2>{copy.featured}</h2></div><button className="text-link" onClick={() => setActiveView('explore')}>{copy.exploreCollection}<ChevronRight size={16} /></button></div>
        <div className="featured-card panel">
          <div className="featured-symbol"><Atom size={35} strokeWidth={1.4} /></div>
          <div className="featured-copy"><span className="family-tag aromatic">{CATEGORY_LABEL[language][featured.category]}</span><h3>{language === 'fa' ? featured.nameFa : featured.name}</h3><div className="featured-formula"><Formula value={featured.formula} /></div><p>{language === 'fa' ? featured.factFa : featured.descEn}</p></div>
          <div className="featured-meta"><span>{copy.mass}</span><strong>{featured.molarMass.toFixed(2)} g/mol</strong><button className="primary-button" onClick={() => openMolecule(featured.id)}>{copy.viewMolecule}<ArrowRight size={16} /></button></div>
        </div>
      </section>
      <section className="home-section molecule-picks-section">
        <div className="home-section-heading"><div><span className="section-index">02 / {copy.discoverLabel}</span><h2>{copy.exploreTitle}</h2></div><button className="text-link" onClick={() => setActiveView('explore')}>{copy.seeAll}<ChevronRight size={16} /></button></div>
        <div className="molecule-picks">{representative.map((molecule, index) => <button className="molecule-pick panel" key={molecule.id} onClick={() => openMolecule(molecule.id)}><span className="pick-index">0{index + 1}</span><span className="pick-icon"><Atom size={21} /></span><strong>{language === 'fa' ? molecule.nameFa : molecule.name}</strong><span className="pick-formula"><Formula value={molecule.formula} /></span><ChevronRight size={16} /></button>)}</div>
      </section>
      <section className="home-section bonds-section">
        <div className="home-section-heading"><div><span className="section-index">03 / {copy.bondExplorerLabel}</span><h2>{copy.bondsTitle}</h2></div></div>
        <div className="bond-cards">
          {[['single', '—', copy.singleText], ['double', '═', copy.doubleText], ['triple', '≡', copy.tripleText]].map(([type, symbol, text]) => <article className={`bond-card panel ${type}`} key={type}><span className="bond-symbol">{symbol}</span><h3>{copy[type]}</h3><p>{text}</p></article>)}
        </div>
      </section>
      <section className="home-section insight-section">
        <div className="insight-icon"><Lightbulb size={23} /></div><div><span className="section-index">04 / {copy.didYouKnow.toUpperCase()}</span><h2>{copy.didYouKnow}</h2><p>{copy.didYouKnowText}</p></div><span className="insight-formula">C₆H₆</span>
      </section>
      <section className="home-section learning-cta">
        <div><span className="section-index">05 / {copy.interactiveLearningLabel}</span><h2>{copy.learnInteractTitle}</h2><p>{copy.learnInteractText}</p></div><button className="primary-button" onClick={() => setActiveView('explore')}>{copy.start}<ArrowRight size={16} /></button>
      </section>
      <section className="home-section features-section">
        <div className="home-section-heading"><div><span className="section-index">06 / HYDROLAB</span><h2>{copy.navAbout}</h2></div></div>
        <div className="feature-grid">{features.map((feature, i) => <article className="feature-card panel" key={feature.title}><span className="feature-icon">{feature.icon}</span><span className="feature-index">0{i + 1}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
      </section>
      <section className="home-section quiz-cta"><div><span className="section-index">07 / {copy.practiceLabel}</span><h2>{copy.quizTitle}</h2><p>{copy.quizSubtitle}</p></div><button className="secondary-button" onClick={() => setActiveView('quiz')}>{copy.takeQuiz}<ArrowRight size={16} /></button></section>
    </>
  );
}

function LibraryPanel({ copy, language, search, setSearch, category, setCategory, filtered, selectedId, onSelect }) {
  return (
    <aside className="library-panel panel">
      <div className="panel-heading"><div><span className="section-index">01 / {copy.collectionLabel}</span><h3>{copy.library}</h3></div><span className="count-pill">{String(filtered.length).padStart(2, '0')}</span></div>
      <label className="search-field"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.search} aria-label={copy.search} /></label>
      <div className="filter-list" aria-label={language === 'fa' ? 'فیلتر خانواده مولکولی' : 'Filter by molecule family'}>{CATEGORY_ORDER.map((value) => <button key={value} className={category === value ? 'filter-chip active' : 'filter-chip'} onClick={() => setCategory(value)} aria-pressed={category === value}>{copy[value]}</button>)}</div>
      <div className="molecule-list">{filtered.length ? filtered.map((molecule, index) => <button key={molecule.id} className={selectedId === molecule.id ? 'molecule-row selected' : 'molecule-row'} onClick={() => onSelect(molecule.id)} aria-pressed={selectedId === molecule.id}><span className="molecule-index">{String(index + 1).padStart(2, '0')}</span><span className="molecule-row-main"><strong>{language === 'fa' ? molecule.nameFa : molecule.name}</strong><small><Formula value={molecule.formula} /><span className="row-separator">·</span>{CATEGORY_LABEL[language][molecule.category]}</small></span><ChevronRight className="row-chevron" size={15} /></button>) : <div className="empty-state"><CircleHelp size={20} /><span>{copy.empty}</span></div>}</div>
      <div className="library-footnote"><Layers3Icon /><span>{copy.collection}</span><strong>10 / 10</strong></div>
    </aside>
  );
}

function Layers3Icon() { return <Beaker size={15} />; }

function ViewerPanel({ molecule, language, copy, showLabels, setShowLabels, resetTrigger, setResetTrigger, autoRotate, setAutoRotate, viewMode, setViewMode }) {
  const modes = [
    { id: 'ballStick', label: copy.ballStick },
    { id: 'spaceFill', label: copy.spaceFill },
    { id: 'structural', label: copy.structural },
  ];
  return (
    <section className="viewer-panel panel">
      <div className="viewer-header"><div><span className="section-index">02 / {copy.viewer}</span><div className="viewer-title-line"><h2>{language === 'fa' ? molecule.nameFa : molecule.name}</h2><span className={`family-tag ${molecule.category}`}>{CATEGORY_LABEL[language][molecule.category]}</span></div></div>
        <div className="viewer-tools">
          <button className={showLabels ? 'tool-button active' : 'tool-button'} onClick={() => setShowLabels((value) => !value)} aria-pressed={showLabels} title={copy.labels}>{showLabels ? <Eye size={15} /> : <EyeOff size={15} />}<span>{copy.labels}</span></button>
          <button className={autoRotate ? 'tool-button active' : 'tool-button'} onClick={() => setAutoRotate((value) => !value)} aria-pressed={autoRotate} title={copy.rotate}><Move3D size={15} /><span>{copy.rotate}</span></button>
          <button className="tool-button reset-button" onClick={() => setResetTrigger((value) => value + 1)} title={copy.reset}><RotateCcw size={15} /><span>{copy.reset}</span></button>
        </div>
      </div>
      <div className="viewer-mode-switch" role="group" aria-label={language === 'fa' ? 'حالت نمایش' : 'Rendering mode'}>{modes.map((mode) => <button key={mode.id} className={viewMode === mode.id ? 'mode-button active' : 'mode-button'} onClick={() => setViewMode(mode.id)} aria-pressed={viewMode === mode.id}>{mode.label}</button>)}</div>
      <div className="viewer-stage"><MoleculeViewer molecule={molecule} showLabels={showLabels} resetTrigger={resetTrigger} mode={viewMode} autoRotate={autoRotate} language={language} unavailableText={copy.viewerUnavailable} />
        <div className="stage-corner stage-top-left"><span className="live-dot" />{copy.liveModelLabel}</div><div className="stage-corner stage-top-right">{molecule.atomCount} {copy.atomUnit}</div><div className="stage-coordinate">X <span>—</span> Y <span>—</span> Z <span>—</span></div>
      </div>
      <div className="viewer-footer"><div className="atom-legend"><span className="legend-item"><i className="atom-dot carbon-dot" />{copy.carbon}</span><span className="legend-item"><i className="atom-dot hydrogen-dot" />{copy.hydrogen}</span></div><div className="interaction-hint"><Move3D size={14} /><span>{copy.rotateHint}</span><span className="hint-divider">·</span><span>{copy.zoomHint}</span></div></div>
    </section>
  );
}

function DetailsPanel({ molecule, copy, language }) {
  const profile = getBondProfile(molecule);
  return (
    <aside className="details-panel panel">
      <div className="panel-heading details-heading"><div><span className="section-index">03 / {copy.selected}</span><h3>{copy.details}</h3></div><span className="selected-indicator"><Check size={13} /></span></div>
      <div className="formula-card"><span className="formula-label">{copy.formula}</span><div className="large-formula"><Formula value={molecule.formula} /></div><span className="formula-name">{language === 'fa' ? molecule.nameFa : molecule.name}</span></div>
      <div className="property-grid">
        <div className="property-cell"><span>{copy.mass}</span><strong>{molecule.molarMass.toFixed(2)} <small>g/mol</small></strong></div>
        <div className="property-cell"><span>{copy.atoms}</span><strong>{molecule.atomCount}</strong></div>
        <div className="property-cell"><span>{copy.carbons}</span><strong>{molecule.carbonCount}</strong></div>
        <div className="property-cell"><span>{copy.hydrogens}</span><strong>{molecule.hydrogenCount}</strong></div>
        <div className="property-cell"><span>{copy.bonds}</span><strong>{molecule.bonds.length}</strong></div>
        <div className="property-cell"><span>{copy.family}</span><strong className="family-value">{CATEGORY_LABEL[language][molecule.category]}</strong></div>
      </div>
      <div className="bond-profile"><span className="profile-title">{copy.bondTypes}</span><div className="profile-values">{[['single', profile.single], ['double', profile.double], ['triple', profile.triple], ['aromaticBonds', profile.aromatic]].filter(([, count]) => count > 0).map(([label, count]) => <span key={label}><strong>{count}</strong>{copy[label]}</span>)}</div></div>
      <div className="educational-note"><div className="note-heading"><Sparkles size={15} /><span>{copy.educational}</span></div><p>{language === 'fa' ? (molecule.factFa || molecule.descFa) : molecule.descEn}</p></div>
      <div className="notation-card"><span>{copy.structureNotation}</span><code>{molecule.smiles}</code></div>
      <div className="data-source"><div className="source-copy"><span>{copy.source}</span><strong>{copy.sourceLine} · CID {molecule.cid}</strong></div><a href={`https://pubchem.ncbi.nlm.nih.gov/compound/${molecule.cid}`} target="_blank" rel="noreferrer" aria-label={language === 'fa' ? 'بازکردن رکورد پاب‌کم' : 'Open PubChem record'}><ArrowUpRight size={16} /></a></div>
      {molecule.category === 'aromatic' && <div className="aromatic-note"><strong>{copy.aromaticNote}</strong><p>{copy.aromaticDisclaimer}</p></div>}
      <div className="model-disclaimer"><CircleHelp size={14} /><span>{copy.modelDisclaimer}</span></div>
    </aside>
  );
}

function ExplorerView({ copy, language, selectedId, setSelectedId }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showLabels, setShowLabels] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [viewMode, setViewMode] = useState('ballStick');
  const [resetTrigger, setResetTrigger] = useState(0);
  const filtered = useMemo(() => molecules.filter((molecule) => {
    const matchesCategory = category === 'all' || molecule.category === category;
    const needle = search.trim().toLocaleLowerCase();
    const matchesSearch = !needle || [molecule.name, molecule.formula, molecule.nameFa, molecule.smiles].some((value) => String(value).toLocaleLowerCase().includes(needle));
    return matchesCategory && matchesSearch;
  }), [category, search]);
  const selected = molecules.find((molecule) => molecule.id === selectedId) || molecules[0];
  return <section className="explorer-section"><PageIntro kicker={`${copy.studyLabel} / 01`} title={copy.exploreTitle} text={copy.exploreSubtitle} /><div className="explorer-grid"><LibraryPanel copy={copy} language={language} search={search} setSearch={setSearch} category={category} setCategory={setCategory} filtered={filtered} selectedId={selected.id} onSelect={setSelectedId} /><ViewerPanel molecule={selected} language={language} copy={copy} showLabels={showLabels} setShowLabels={setShowLabels} resetTrigger={resetTrigger} setResetTrigger={setResetTrigger} autoRotate={autoRotate} setAutoRotate={setAutoRotate} viewMode={viewMode} setViewMode={setViewMode} /><DetailsPanel molecule={selected} copy={copy} language={language} /></div></section>;
}

function ComparisonView({ copy, language }) {
  const [firstId, setFirstId] = useState('methane');
  const [secondId, setSecondId] = useState('ethene');
  const first = molecules.find((molecule) => molecule.id === firstId) || molecules[0];
  const second = molecules.find((molecule) => molecule.id === secondId) || molecules[1];
  const a = getBondProfile(first); const b = getBondProfile(second);
  const rows = [
    [copy.formula, <Formula value={first.formula} />, <Formula value={second.formula} />],
    [copy.mass, `${first.molarMass.toFixed(2)} g/mol`, `${second.molarMass.toFixed(2)} g/mol`],
    [copy.atoms, first.atomCount, second.atomCount],
    [copy.carbons, first.carbonCount, second.carbonCount],
    [copy.hydrogens, first.hydrogenCount, second.hydrogenCount],
    [copy.family, CATEGORY_LABEL[language][first.category], CATEGORY_LABEL[language][second.category]],
    [copy.single, a.single, b.single],
    [copy.double, a.double, b.double],
    [copy.triple, a.triple, b.triple],
    [copy.aromaticBonds, a.aromatic, b.aromatic],
  ];
  return <section className="compare-section"><PageIntro kicker={`${copy.studyLabel} / 02`} title={copy.compareTitle} text={copy.compareSubtitle} icon={Columns2} />
    <div className="compare-selectors"><label className="compare-select-card panel"><span>{copy.moleculeA}</span><select value={firstId} onChange={(event) => setFirstId(event.target.value)} aria-label={copy.moleculeA}>{molecules.map((molecule) => <option key={molecule.id} value={molecule.id}>{language === 'fa' ? molecule.nameFa : molecule.name} ({molecule.formula})</option>)}</select><strong>{language === 'fa' ? first.nameFa : first.name}</strong><span className="compare-formula"><Formula value={first.formula} /></span></label>
      <div className="compare-divider"><Columns2 size={20} /></div>
      <label className="compare-select-card panel"><span>{copy.moleculeB}</span><select value={secondId} onChange={(event) => setSecondId(event.target.value)} aria-label={copy.moleculeB}>{molecules.map((molecule) => <option key={molecule.id} value={molecule.id}>{language === 'fa' ? molecule.nameFa : molecule.name} ({molecule.formula})</option>)}</select><strong>{language === 'fa' ? second.nameFa : second.name}</strong><span className="compare-formula"><Formula value={second.formula} /></span></label></div>
    <div className="comparison-table-wrap panel"><div className="comparison-table-title"><span className="section-index">{copy.comparison.toUpperCase()}</span><h3>{copy.molecularIdentity}</h3></div><table className="comparison-table"><thead><tr><th>{copy.property}</th><th>{language === 'fa' ? first.nameFa : first.name}</th><th>{language === 'fa' ? second.nameFa : second.name}</th></tr></thead><tbody>{rows.map(([label, valueA, valueB]) => <tr key={label}><th scope="row">{label}</th><td>{valueA}</td><td>{valueB}</td></tr>)}</tbody></table>
      <div className="comparison-structures"><div><span className="section-index">{copy.structuralFeatures}</span><h4>{language === 'fa' ? first.nameFa : first.name}</h4><p>{language === 'fa' ? first.descFa : first.descEn}</p><code>{first.smiles}</code></div><div><span className="section-index">{copy.structuralFeatures}</span><h4>{language === 'fa' ? second.nameFa : second.name}</h4><p>{language === 'fa' ? second.descFa : second.descEn}</p><code>{second.smiles}</code></div></div></div>
  </section>;
}

function QuizView({ copy, language }) {
  const questions = QUESTIONS[language];
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = questions[questionIndex];
  const isCorrect = selected === question.answer;
  const advance = () => {
    if (!feedbackShown) { setFeedbackShown(true); if (isCorrect) setScore((value) => value + 1); return; }
    if (questionIndex === questions.length - 1) { setFinished(true); return; }
    setQuestionIndex((value) => value + 1); setSelected(null); setFeedbackShown(false);
  };
  const restart = () => { setQuestionIndex(0); setSelected(null); setFeedbackShown(false); setScore(0); setFinished(false); };
  if (finished) return <section className="quiz-section"><PageIntro kicker={`${copy.learnLabel} / ${copy.practiceLabel}`} title={copy.quizResult} text={copy.quizSubtitle} icon={Target} /><div className="quiz-result panel"><span className="result-icon"><Check size={27} /></span><span className="section-index">{copy.quizResult.toUpperCase()}</span><strong>{score} / {questions.length}</strong><span>{copy.score} · {score} {copy.points}</span><button className="primary-button" onClick={restart}>{copy.restart}<RotateCcw size={16} /></button></div></section>;
  return <section className="quiz-section"><PageIntro kicker={`${copy.learnLabel} / ${copy.practiceLabel}`} title={copy.quizTitle} text={copy.quizSubtitle} icon={CircleHelp} /><div className="quiz-card panel"><div className="quiz-topline"><span>{copy.question} {questionIndex + 1} {copy.of} {questions.length}</span><span>{copy.score}: {score}</span></div><div className="quiz-progress"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div><h3>{question.prompt}</h3><div className="quiz-options">{question.options.map((option, index) => <button key={option} className={`quiz-option ${selected === index ? 'selected' : ''} ${feedbackShown && index === question.answer ? 'correct-option' : ''} ${feedbackShown && selected === index && !isCorrect ? 'incorrect-option' : ''}`} onClick={() => !feedbackShown && setSelected(index)} disabled={feedbackShown} aria-pressed={selected === index}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{option}{feedbackShown && index === question.answer && <Check size={17} />}{feedbackShown && selected === index && !isCorrect && <X size={17} />}</button>)}</div>
      {feedbackShown && <div className={isCorrect ? 'quiz-feedback correct' : 'quiz-feedback incorrect'}><strong>{isCorrect ? copy.correct : copy.incorrect}</strong><p>{question.explanation}</p></div>}
      <div className="quiz-actions"><span>{feedbackShown ? (isCorrect ? '✓' : '↗') : `${questions.length - questionIndex} ${copy.remainingQuestions}`}</span><button className="primary-button" disabled={selected === null && !feedbackShown} onClick={advance}>{feedbackShown ? (questionIndex === questions.length - 1 ? copy.quizResult : copy.nextQuestion) : copy.checkAnswer}<ArrowRight size={16} /></button></div>
    </div></section>;
}

function AboutView({ copy, language }) {
  const topics = [
    { icon: <Atom size={19} />, title: copy.atomsTitle, text: copy.atomsText },
    { icon: <Beaker size={19} />, title: copy.bondsLearnTitle, text: copy.bondsLearnText },
    { icon: <Move3D size={19} />, title: copy.shapeTitle, text: copy.shapeText },
    { icon: <CircleHelp size={19} />, title: copy.limitsTitle, text: copy.limitsText },
  ];
  const families = [
    { category: 'alkane', formula: 'CₙH₂ₙ₊₂', title: language === 'fa' ? 'آلکان‌ها' : 'Alkanes', text: copy.alkaneDesc, count: '06' },
    { category: 'alkene', formula: 'CₙH₂ₙ', title: language === 'fa' ? 'آلکن‌ها' : 'Alkenes', text: copy.alkeneDesc, count: '02' },
    { category: 'alkyne', formula: 'CₙH₂ₙ₋₂', title: language === 'fa' ? 'آلکین‌ها' : 'Alkynes', text: copy.alkyneDesc, count: '01' },
    { category: 'aromatic', formula: 'C₆H₆', title: language === 'fa' ? 'آروماتیک' : 'Aromatic', text: copy.aromaticDesc, count: '01' },
  ];
  return <section className="learn-section"><PageIntro kicker={copy.navAbout} title={copy.aboutTitle} text={copy.aboutSubtitle} icon={Info} />
    <div className="learning-grid">{topics.map((topic, index) => <article className="learning-card panel" key={topic.title}><div className="learning-card-top"><span className="learning-icon">{topic.icon}</span><span>0{index + 1} / 04</span></div><h3>{topic.title}</h3><p>{topic.text}</p></article>)}</div>
    <div className="families-section"><div className="subsection-heading"><span className="section-index">{copy.referenceLabel} / 02</span><h3>{copy.familiesTitle}</h3></div><div className="family-grid">{families.map((family) => <article className={`family-card ${family.category}`} key={family.category}><div className="family-card-top"><span>{family.count} {copy.moleculeUnit}</span><span className="family-marker" /></div><strong className="family-formula">{family.formula}</strong><h4>{family.title}</h4><p>{family.text}</p></article>)}</div></div>
    <div className="source-panel panel"><div className="source-icon"><Check size={18} /></div><div><span className="section-index">{copy.dataNoteLabel} / 03</span><h3>{copy.sourcesTitle}</h3><p>{copy.sourcesText}</p></div><a href="https://pubchem.ncbi.nlm.nih.gov/" target="_blank" rel="noreferrer">PubChem <ArrowUpRight size={15} /></a></div>
  </section>;
}

export default function App() {
  const [language, setLanguage] = useState(() => {
    try { return window.localStorage.getItem('hydrolab-language') === 'fa' ? 'fa' : 'en'; } catch { return 'en'; }
  });
  const [activeView, setActiveView] = useState('home');
  const [selectedId, setSelectedId] = useState('methane');
  const copy = COPY[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.title = language === 'fa' ? 'HydroLab | آزمایشگاه تعاملی مولکول‌ها' : 'HydroLab | Interactive Molecular Explorer';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = language === 'fa' ? 'آزمایشگاه تعاملی برای کاوش سه‌بعدی ساختار مولکول‌ها و یادگیری شیمی.' : 'An interactive molecular laboratory for exploring 3D structures and learning chemistry.';
    try { window.localStorage.setItem('hydrolab-language', language); } catch { /* Storage can be unavailable in private contexts. */ }
  }, [language]);

  const navigate = (view) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <div className={`app-shell ${language === 'fa' ? 'is-persian' : ''}`} dir={language === 'fa' ? 'rtl' : 'ltr'}>
    <div className="page-shell">
      <Header language={language} setLanguage={setLanguage} activeView={activeView} setActiveView={navigate} copy={copy} />
      <main>
        {activeView === 'home' && <HomeView copy={copy} language={language} setActiveView={navigate} setSelectedId={setSelectedId} />}
        {activeView === 'explore' && <ExplorerView copy={copy} language={language} selectedId={selectedId} setSelectedId={setSelectedId} />}
        {activeView === 'compare' && <ComparisonView copy={copy} language={language} />}
        {activeView === 'quiz' && <QuizView copy={copy} language={language} />}
        {activeView === 'about' && <AboutView copy={copy} language={language} />}
      </main>
      <footer className="site-footer"><span>© 2026 HYDROLAB</span><span>{copy.footer}</span><span>{copy.footerMotto}</span></footer>
    </div>
  </div>;
}
