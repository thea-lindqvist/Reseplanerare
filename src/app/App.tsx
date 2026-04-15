import { useState } from 'react';
import { ProgressDots } from './components/ProgressDots';
import { BackButton } from './components/BackButton';
import { PrimaryButton } from './components/PrimaryButton';
import { ChoiceCard } from './components/ChoiceCard';
import {
  User,
  Users,
  Heart,
  Baby,
  Sun,
  UtensilsCrossed,
  Mountain,
  Sparkles,
  Waves,
  Building2,
  Wine,
  TreePine,
  Compass,
  Loader2,
  MapPin,
  Calendar,
  DollarSign,
  Plane,
  ArrowLeft,
  Train,
  Bus,
  Ship,
  CloudRain,
  Thermometer,
  Clock
} from 'lucide-react';

type TravellerType = 'solo' | 'couple' | 'friends' | 'family' | 'multi-gen';
type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type Duration = 'weekend' | '1-week' | '2-weeks' | 'longer';
type Mood = 'beach' | 'city' | 'food' | 'nature' | 'adventure' | 'wellness' | 'offbeat';
type Budget = 'budget' | 'comfortable' | 'treat' | 'luxury';
type Distance = 'nearby' | 'europe' | 'long-haul' | 'anywhere';

interface TripData {
  traveller?: TravellerType;
  ages?: number[];
  season?: Season;
  duration?: Duration;
  moods: Mood[];
  budget?: Budget;
  distance?: Distance;
}

type Screen =
  | 'welcome'
  | 'traveller'
  | 'ages'
  | 'when'
  | 'mood'
  | 'budget'
  | 'distance'
  | 'loading'
  | 'suggestions'
  | 'plan';

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [tripData, setTripData] = useState<TripData>({ moods: [], ages: [] });
  const [selectedDestination, setSelectedDestination] = useState<number>(0);

  const totalSteps = 6;
  const screenToStep: Record<Screen, number> = {
    welcome: 0,
    traveller: 0,
    ages: 1,
    when: 2,
    mood: 3,
    budget: 4,
    distance: 5,
    loading: 6,
    suggestions: 6,
    plan: 6,
  };

  const goBack = () => {
    const transitions: Record<Screen, Screen> = {
      welcome: 'welcome',
      traveller: 'welcome',
      ages: 'traveller',
      when: tripData.traveller === 'family' || tripData.traveller === 'multi-gen' ? 'ages' : 'traveller',
      mood: 'when',
      budget: 'mood',
      distance: 'budget',
      loading: 'distance',
      suggestions: 'distance',
      plan: 'suggestions',
    };
    setScreen(transitions[screen]);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setScreen('traveller')} />;

      case 'traveller':
        return (
          <QuestionScreen
            title="Vem reser?"
            currentStep={screenToStep.traveller}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-3">
              {[
                { value: 'solo' as TravellerType, icon: <User />, title: 'Solo', description: 'Bara jag' },
                { value: 'couple' as TravellerType, icon: <Heart />, title: 'Par', description: 'Vi två' },
                { value: 'friends' as TravellerType, icon: <Users />, title: 'Vänner', description: 'En grupp kompisar' },
                { value: 'family' as TravellerType, icon: <Baby />, title: 'Familj med barn', description: 'Reser med barn' },
                { value: 'multi-gen' as TravellerType, icon: <Users />, title: 'Flera generationer', description: 'Hela familjen' },
              ].map((option, i) => (
                <ChoiceCard
                  key={option.value}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  selected={tripData.traveller === option.value}
                  onClick={() => {
                    setTripData({ ...tripData, traveller: option.value });
                    setTimeout(() => {
                      if (option.value === 'family' || option.value === 'multi-gen') {
                        setScreen('ages');
                      } else {
                        setScreen('when');
                      }
                    }, 300);
                  }}
                  delay={i * 50}
                />
              ))}
            </div>
          </QuestionScreen>
        );

      case 'ages':
        return (
          <QuestionScreen
            title="Hur gamla är barnen?"
            subtitle="Det hjälper oss föreslå familjevänliga aktiviteter"
            currentStep={screenToStep.ages}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <p className="text-[var(--ocean-blue)]/60 text-sm mb-4">Välj åldrar som passar</p>
                {[
                  { label: 'Under 3 år', value: 0 },
                  { label: '3-7 år', value: 1 },
                  { label: '8-12 år', value: 2 },
                  { label: '13+ år', value: 3 },
                ].map((age, i) => (
                  <label key={i} className="flex items-center gap-3 py-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded accent-[var(--coral)]"
                      checked={tripData.ages?.includes(age.value) || false}
                      onChange={(e) => {
                        const ages = tripData.ages || [];
                        setTripData({
                          ...tripData,
                          ages: e.target.checked
                            ? [...ages, age.value]
                            : ages.filter((a) => a !== age.value),
                        });
                      }}
                    />
                    <span className="text-[var(--ocean-blue)]">{age.label}</span>
                  </label>
                ))}
              </div>
              <PrimaryButton onClick={() => setScreen('when')}>Fortsätt</PrimaryButton>
            </div>
          </QuestionScreen>
        );

      case 'when':
        return (
          <QuestionScreen
            title="När vill du resa?"
            currentStep={screenToStep.when}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-6">
              <div>
                <p className="text-sm text-[var(--ocean-blue)]/60 mb-3">Tid på året</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'spring' as Season, icon: <Sparkles />, title: 'Vår' },
                    { value: 'summer' as Season, icon: <Sun />, title: 'Sommar' },
                    { value: 'autumn' as Season, icon: <Wine />, title: 'Höst' },
                    { value: 'winter' as Season, icon: <TreePine />, title: 'Vinter' },
                  ].map((option, i) => (
                    <ChoiceCard
                      key={option.value}
                      icon={option.icon}
                      title={option.title}
                      selected={tripData.season === option.value}
                      onClick={() => setTripData({ ...tripData, season: option.value })}
                      delay={i * 50}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-[var(--ocean-blue)]/60 mb-3">Hur länge?</p>
                <div className="space-y-3">
                  {[
                    { value: 'weekend' as Duration, title: 'Weekendresa', description: '2-3 dagar' },
                    { value: '1-week' as Duration, title: 'En vecka', description: '5-7 dagar' },
                    { value: '2-weeks' as Duration, title: 'Två veckor', description: '10-14 dagar' },
                    { value: 'longer' as Duration, title: 'Längre äventyr', description: '2+ veckor' },
                  ].map((option, i) => (
                    <ChoiceCard
                      key={option.value}
                      title={option.title}
                      description={option.description}
                      selected={tripData.duration === option.value}
                      onClick={() => setTripData({ ...tripData, duration: option.value })}
                      delay={i * 50}
                    />
                  ))}
                </div>
              </div>

              <PrimaryButton
                onClick={() => setScreen('mood')}
                disabled={!tripData.season || !tripData.duration}
              >
                Fortsätt
              </PrimaryButton>
            </div>
          </QuestionScreen>
        );

      case 'mood':
        return (
          <QuestionScreen
            title="Vad är du sugen på?"
            subtitle="Välj så många du vill"
            currentStep={screenToStep.mood}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'beach' as Mood, icon: <Waves />, title: 'Sol & bad' },
                  { value: 'city' as Mood, icon: <Building2 />, title: 'Stad & kultur' },
                  { value: 'food' as Mood, icon: <UtensilsCrossed />, title: 'Mat & vin' },
                  { value: 'nature' as Mood, icon: <Mountain />, title: 'Natur & vandring' },
                  { value: 'adventure' as Mood, icon: <Compass />, title: 'Äventyr' },
                  { value: 'wellness' as Mood, icon: <Sparkles />, title: 'Avkoppling' },
                  { value: 'offbeat' as Mood, icon: <MapPin />, title: 'Utanför turiststråken' },
                ].map((option, i) => (
                  <ChoiceCard
                    key={option.value}
                    icon={option.icon}
                    title={option.title}
                    selected={tripData.moods.includes(option.value)}
                    onClick={() => {
                      setTripData({
                        ...tripData,
                        moods: tripData.moods.includes(option.value)
                          ? tripData.moods.filter((m) => m !== option.value)
                          : [...tripData.moods, option.value],
                      });
                    }}
                    delay={i * 50}
                  />
                ))}
              </div>
              <PrimaryButton
                onClick={() => setScreen('budget')}
                disabled={tripData.moods.length === 0}
              >
                Fortsätt
              </PrimaryButton>
            </div>
          </QuestionScreen>
        );

      case 'budget':
        return (
          <QuestionScreen
            title="Vad har du för budget?"
            currentStep={screenToStep.budget}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-3">
              {[
                { value: 'budget' as Budget, icon: <DollarSign />, title: 'Budgetvänligt', description: 'Bra värde utan kompromisser' },
                { value: 'comfortable' as Budget, icon: <DollarSign />, title: 'Bekvämt', description: 'Fina hotell och restauranger' },
                { value: 'treat' as Budget, icon: <DollarSign />, title: 'Skäm bort dig', description: 'Exklusivt och minnesvärt' },
                { value: 'luxury' as Budget, icon: <DollarSign />, title: 'Inga begränsningar', description: 'De allra bästa upplevelserna' },
              ].map((option, i) => (
                <ChoiceCard
                  key={option.value}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  selected={tripData.budget === option.value}
                  onClick={() => {
                    setTripData({ ...tripData, budget: option.value });
                    setTimeout(() => setScreen('distance'), 300);
                  }}
                  delay={i * 50}
                />
              ))}
            </div>
          </QuestionScreen>
        );

      case 'distance':
        return (
          <QuestionScreen
            title="Hur långt vill du resa?"
            currentStep={screenToStep.distance}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-3">
              {[
                { value: 'nearby' as Distance, icon: <MapPin />, title: 'Närområdet', description: 'Kort flygresa eller biltur' },
                { value: 'europe' as Distance, icon: <Plane />, title: 'Inom Europa', description: '2-4 timmars flyg' },
                { value: 'long-haul' as Distance, icon: <Plane />, title: 'Långresa', description: '6+ timmars flyg' },
                { value: 'anywhere' as Distance, icon: <Compass />, title: 'Var som helst', description: 'Avståndet spelar ingen roll' },
              ].map((option, i) => (
                <ChoiceCard
                  key={option.value}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  selected={tripData.distance === option.value}
                  onClick={() => {
                    setTripData({ ...tripData, distance: option.value });
                    setTimeout(() => setScreen('loading'), 300);
                  }}
                  delay={i * 50}
                />
              ))}
            </div>
          </QuestionScreen>
        );

      case 'loading':
        return <LoadingScreen onComplete={() => setScreen('suggestions')} />;

      case 'suggestions':
        return (
          <SuggestionsScreen
            onSelectDestination={(index) => {
              setSelectedDestination(index);
              setScreen('plan');
            }}
            onBack={goBack}
          />
        );

      case 'plan':
        return (
          <TripPlanScreen
            destinationIndex={selectedDestination}
            onBack={goBack}
            onChangeDestination={() => setScreen('suggestions')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      {renderScreen()}
    </div>
  );
}

// Welcome Screen Component
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-[var(--sunny-yellow)] rounded-full opacity-40 blur-3xl" />
      <div className="absolute bottom-32 left-10 w-40 h-40 bg-[var(--fresh-green)] rounded-full opacity-30 blur-3xl" />

      <div className="max-w-md w-full text-center space-y-8 animate-fade-in relative z-10">
        <div className="space-y-4">
          <h1
            className="text-6xl md:text-7xl text-[var(--ocean-blue)] leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Hitta din nästa resa
          </h1>
          <p className="text-lg text-[var(--ocean-blue)]/70">
            Svara på några frågor så planerar vi den perfekta resan
          </p>
        </div>

        <div className="pt-4">
          <PrimaryButton onClick={onStart}>Börja planera</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// Question Screen Layout
interface QuestionScreenProps {
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  children: React.ReactNode;
}

function QuestionScreen({ title, subtitle, currentStep, totalSteps, onBack, children }: QuestionScreenProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 space-y-4">
        <BackButton onClick={onBack} />
        <ProgressDots total={totalSteps} current={currentStep} />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="space-y-2 animate-fade-in">
            <h2
              className="text-4xl text-[var(--ocean-blue)] leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-[var(--ocean-blue)]/60">{subtitle}</p>
            )}
          </div>

          <div className="pt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading Screen
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useState(() => {
    setTimeout(onComplete, 3000);
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-[var(--coral)] animate-spin mx-auto" />
          <div className="absolute inset-0 bg-[var(--coral)] opacity-20 rounded-full blur-xl" />
        </div>
        <div className="space-y-2">
          <h3
            className="text-3xl text-[var(--ocean-blue)]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Hittar din perfekta resa...
          </h3>
          <p className="text-[var(--ocean-blue)]/60">
            Letar bland fantastiska resmål
          </p>
        </div>
      </div>
    </div>
  );
}

// Suggestions Screen
function SuggestionsScreen({ onSelectDestination, onBack }: { onSelectDestination: (index: number) => void; onBack: () => void }) {
  const destinations = [
    {
      name: 'Sicilien, Italien',
      tagline: 'Perfekt för höstsol, matälskare och par',
      tags: ['Medelhavskök', 'Antik historia', 'Kuststäder'],
      image: 'https://images.unsplash.com/photo-1676943602552-3a8fe0ea3ff7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    },
    {
      name: 'Grekiska öarna',
      tagline: 'Ö-hopping-paradis med fantastiska stränder',
      tags: ['Strandliv', 'Färsk skaldjur', 'Vitkalkade byar'],
      image: 'https://images.unsplash.com/photo-1775480980898-e847f65ed2f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    },
    {
      name: 'Provence, Frankrike',
      tagline: 'Lavendelfält och vinkulturens charm',
      tags: ['Vinprovning', 'Landsbygd', 'Lokala marknader'],
      image: 'https://images.unsplash.com/photo-1729804913360-d14ee7c1be6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6">
        <BackButton onClick={onBack} />
      </div>

      <div className="flex-1 px-6 pb-6">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="space-y-2 animate-fade-in">
            <h2
              className="text-4xl text-[var(--ocean-blue)] leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Vi hittade dessa för dig
            </h2>
            <p className="text-[var(--ocean-blue)]/60">
              Tryck på ett resmål för personliga förslag på vad du kan göra, hur du reser dit och var du ska äta
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {destinations.map((dest, i) => (
              <button
                key={i}
                onClick={() => onSelectDestination(i)}
                className="w-full bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 text-left animate-fade-in hover:scale-[1.02]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3
                      className="text-2xl text-[var(--ocean-blue)] mb-1"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {dest.name}
                    </h3>
                    <p className="text-sm text-[var(--ocean-blue)]/70">{dest.tagline}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dest.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 bg-[var(--sunny-yellow)] text-[var(--ocean-blue)] text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--ocean-blue)]/50 pt-2 border-t border-[var(--sunny-yellow)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Dag för dag
                    </span>
                    <span className="flex items-center gap-1">
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      Restauranger
                    </span>
                    <span className="flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5" />
                      Resetips
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Trip Plan Screen
function TripPlanScreen({ destinationIndex, onBack, onChangeDestination }: { destinationIndex: number; onBack: () => void; onChangeDestination: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'days' | 'eat' | 'transport' | 'weather' | 'tips'>('overview');

  const destination = {
    name: 'Sicilien, Italien',
    hero: 'https://images.unsplash.com/photo-1676943602552-3a8fe0ea3ff7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    overview: {
      why: "Sicilien i oktober erbjuder den perfekta blandningen av varmt medelhavsväder, skördesäsongens överflöd och färre turister. Öns rika mosaik av grekiska, romerska, arabiska och normandiska influenser skapar en oförglömlig kulturupplevelse.",
      bestTime: 'Oktober är idealiskt - varma dagar (21-24°C), sköna kvällar, druv- och olivskördens säsong',
      vibe: 'Avslappnad ötakt med passionerad lokal kultur, fantastisk matscen och dramatiska landskap från Etna till antika ruiner',
    },
    weather: {
      temperature: '21-24°C dagtid, 15-18°C nattetid',
      rainfall: 'Måttlig nederbörd, ca 5-6 regniga dagar under månaden',
      sunshine: '7-8 timmars sol per dag',
      seaTemp: 'Havstemperatur 22-23°C, perfekt för bad',
      clothing: 'Lätta sommarkläder för dagen, en lätt jacka eller kofta för kvällarna',
    },
    travel: {
      gettingThere: 'Flyg till Palermo (PMO) eller Catania (CTA) flygplatser. Direktflyg finns från stora europeiska städer (2-3 timmar från London, Paris eller Berlin). Catania är närmare Etna och Taormina; Palermo är perfekt för västra Sicilien.',
      gettingAround: 'Hyr bil för maximal flexibilitet - viktigt för att utforska landsbygden och kuststäderna. Alternativt, kombinera tåg för stad-till-stad-resor med lokala bussar eller taxi. Överväg att hyra chaufför för Etna-utflykter.',
      bestRoutes: 'Börja i Palermo, kör österut längs kusten genom Cefalù till Taormina, sedan söderut till Syracuse och Ragusa, sväng västerut till Agrigento och tillbaka till Palermo. Eller vänd på rutten från Catania.',
    },
    transport: {
      trains: [
        {
          route: 'Palermo - Cefalù',
          frequency: 'Var 1-2 timme',
          duration: '45 minuter',
          price: '€5-8',
          notes: 'Vacker kustrutt, boka i förväg på helger'
        },
        {
          route: 'Catania - Taormina',
          frequency: 'Var 30-45 minuter',
          duration: '50 minuter',
          price: '€4-7',
          notes: 'Stationen ligger 2km från centrum, shuttlebuss finns'
        },
        {
          route: 'Syracuse - Catania',
          frequency: 'Var timme',
          duration: '1 timme 15 min',
          price: '€7-10',
          notes: 'Bekvämt alternativ till bil'
        },
      ],
      buses: [
        {
          route: 'Catania - Agrigento',
          operator: 'SAIS Autolinee',
          frequency: '3-4 avgångar/dag',
          duration: '3 timmar',
          price: '€12-15',
          notes: 'Boka online för bästa pris'
        },
        {
          route: 'Palermo - Agrigento',
          operator: 'Autoservizi Cuffaro',
          frequency: 'Var 2 timme',
          duration: '2 timmar',
          price: '€9-12',
          notes: 'Stopp vid Templens dal på begäran'
        },
        {
          route: 'Taormina - Mount Etna',
          operator: 'AST',
          frequency: '2 avgångar/dag (morgon)',
          duration: '1.5 timmar',
          price: '€6-8',
          notes: 'Säsongsbetonat, kolla schema i förväg'
        },
      ],
      boats: [
        {
          route: 'Milazzo - Eoliska öarna',
          operator: 'Liberty Lines',
          frequency: '8-12 avgångar/dag',
          duration: '1-2 timmar beroende på ö',
          price: '€15-25 enkelresa',
          notes: 'Perfekt dagsutflykt från Sicilien'
        },
        {
          route: 'Palermo - Ustica',
          operator: 'Siremar',
          frequency: 'Dagligen i sommarsäsong',
          duration: '2.5 timmar',
          price: '€20-30',
          notes: 'Vacker ö för snorkling och dykning'
        },
        {
          route: 'Trapani - Favignana',
          operator: 'Liberty Lines',
          frequency: 'Var 30-60 minuter',
          duration: '30 minuter',
          price: '€10-15',
          notes: 'Populär ö-utflykt, cykelhyra finns'
        },
      ],
    },
    days: [
      {
        day: 'Dag 1',
        title: 'Palermo - Gatukök & Marknader',
        activities: [
          { time: 'Förmiddag', activity: 'Utforska Ballarò-marknaden, smaka arancini och panelle' },
          { time: 'Eftermiddag', activity: 'Besök Palazzo dei Normanni och Cappella Palatina' },
          { time: 'Kväll', activity: 'Solnedgångs-aperitivo på Quattro Canti' },
        ],
      },
      {
        day: 'Dag 2',
        title: 'Vulkanen Etna & Vinprovning',
        activities: [
          { time: 'Förmiddag', activity: 'Vandra vid Etnas vulkankratrar' },
          { time: 'Eftermiddag', activity: 'Vinprovning vid en Etna DOC vingård' },
          { time: 'Kväll', activity: 'Middag i Taormina med utsikt över Etna' },
        ],
      },
      {
        day: 'Dag 3',
        title: 'Taormina - Antik Teater & Stränder',
        activities: [
          { time: 'Förmiddag', activity: 'Besök Teatro Greco med fantastisk kustutsikt' },
          { time: 'Eftermiddag', activity: 'Strandtid vid Isola Bella' },
          { time: 'Kväll', activity: 'Promenera Corso Umberto, glass-provning' },
        ],
      },
      {
        day: 'Dag 4',
        title: 'Templens dal, Agrigento',
        activities: [
          { time: 'Förmiddag', activity: 'Utforska UNESCO:s antika grekiska ruiner' },
          { time: 'Eftermiddag', activity: 'Lunch i Agrigento, lokal skaldjur' },
          { time: 'Kväll', activity: 'Solnedgång vid Scala dei Turchi vita klippor' },
        ],
      },
      {
        day: 'Dag 5',
        title: 'Syracuse & Ön Ortigia',
        activities: [
          { time: 'Förmiddag', activity: 'Arkeologiska parken Neapolis' },
          { time: 'Eftermiddag', activity: 'Vandra i Ortigias barocka gator' },
          { time: 'Kväll', activity: 'Färsk skaldjursmiddag vid hamnen' },
        ],
      },
      {
        day: 'Dag 6',
        title: 'Modica & Ragusa - Barocka Städer',
        activities: [
          { time: 'Förmiddag', activity: 'Chokladprovning i Modica' },
          { time: 'Eftermiddag', activity: 'Utforska Ragusa Iblas fantastiska arkitektur' },
          { time: 'Kväll', activity: 'Traditionell siciliansk middag på lokal osteria' },
        ],
      },
      {
        day: 'Dag 7',
        title: 'Cefalù - Kustavkoppling',
        activities: [
          { time: 'Förmiddag', activity: 'Strandtid vid Cefalùs gyllene sand' },
          { time: 'Eftermiddag', activity: 'Besök den normandiska katedralen' },
          { time: 'Kväll', activity: 'Avskedsmiddag på en skaldjursrestaurang' },
        ],
      },
    ],
    restaurants: [
      {
        name: 'Ristorante Coria',
        location: 'Ortigia, Syracuse',
        specialty: 'Modern sicilianskt med havsutsikt',
        cuisine: 'Modern Sicilianskt',
        priceRange: '€€€',
        why: 'Michelin-rekommenderad med innovativa tolkningar av klassiska recept och fantastisk hamnutsikt'
      },
      {
        name: 'Trattoria del Corso',
        location: 'Taormina',
        specialty: 'Traditionell pasta alla Norma',
        cuisine: 'Traditionellt Sicilianskt',
        priceRange: '€€',
        why: 'Familjeägt i 40 år, lokalbefolkningen svär vid deras handgjorda pasta och auberginerätter'
      },
      {
        name: 'La Bettola',
        location: 'Cefalù',
        specialty: 'Dagens färska fångst vid stranden',
        cuisine: 'Skaldjur',
        priceRange: '€€',
        why: 'Bord i sanden, fisk köpt direkt från fiskarna varje morgon'
      },
      {
        name: 'Antica Dolceria Bonajuto',
        location: 'Modica',
        specialty: 'Historisk chokladtillverkning sedan 1880',
        cuisine: 'Desserter & Choklad',
        priceRange: '€',
        why: 'Siciliens äldsta chokladmakare, använder gamla aztekiska tekniker med kanel och chili'
      },
      {
        name: 'Osteria Mercede',
        location: 'Palermo',
        specialty: 'Upphöjd gatumat',
        cuisine: 'Gatumat',
        priceRange: '€',
        why: 'Smaka Palermos berömda gatumat i en charmig miljö - bästa arancini i staden'
      },
      {
        name: 'Trattoria da Nino',
        location: 'Etnas sluttningar',
        specialty: 'Etna-vinmatchningar med lokala rätter',
        cuisine: 'Regional Sicilianskt',
        priceRange: '€€',
        why: 'Familjens vingårdsrestaurang med viner från vulkanisk jord och produkter från trädgården'
      },
    ],
    tips: [
      'Hyr bil för flexibilitet att utforska landsbygden',
      'Lär dig grundläggande italienska hälsningsfraser - lokalbefolkningen uppskattar ansträngningen',
      'Packa lager på lager - oktobermorgnar kan vara svala, eftermiddagar varma',
      'Boka Etna-turer i förväg, väderberoende',
      'Många restauranger stänger 15-17 (siesta)',
      'Kontanter är kung i mindre städer och marknader',
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={destination.hero}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ocean-blue)]/60 via-transparent to-transparent" />

        {/* Back button overlay */}
        <div className="absolute top-6 left-6">
          <button
            onClick={onBack}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[var(--ocean-blue)]" />
          </button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1
            className="text-5xl md:text-6xl mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {destination.name}
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 bg-white shadow-sm z-20">
        <div className="flex overflow-x-auto">
          {[
            { value: 'overview', label: 'Översikt' },
            { value: 'days', label: 'Dag för dag' },
            { value: 'eat', label: 'Mat & dryck' },
            { value: 'transport', label: 'Transport' },
            { value: 'weather', label: 'Väder' },
            { value: 'tips', label: 'Bra att veta' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as typeof activeTab)}
              className={`flex-1 min-w-[120px] py-4 px-4 font-medium transition-colors relative ${
                activeTab === tab.value
                  ? 'text-[var(--coral)]'
                  : 'text-[var(--ocean-blue)]/50 hover:text-[var(--ocean-blue)]'
              }`}
            >
              {tab.label}
              {activeTab === tab.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--coral)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3
                  className="text-2xl text-[var(--ocean-blue)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Varför Sicilien?
                </h3>
                <p className="text-[var(--ocean-blue)]/70 leading-relaxed">{destination.overview.why}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3
                  className="text-2xl text-[var(--ocean-blue)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Väder i oktober
                </h3>
                <p className="text-[var(--ocean-blue)]/70 leading-relaxed">{destination.overview.bestTime}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3
                  className="text-2xl text-[var(--ocean-blue)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Känslan
                </h3>
                <p className="text-[var(--ocean-blue)]/70 leading-relaxed">{destination.overview.vibe}</p>
              </div>

              {/* Bildgalleri */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3
                  className="text-2xl text-[var(--ocean-blue)] mb-4"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Upptäck Sicilien
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1676943602552-3a8fe0ea3ff7?w=800&q=80"
                      alt="Taormina med Etna i bakgrunden"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1727951234414-2c463cc4fd58?w=400&q=80"
                      alt="Vulkanen Etna"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1708526499790-bf63c35d9622?w=400&q=80"
                      alt="Siciliensk strand"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1761770318955-6e721b963c3b?w=400&q=80"
                      alt="Kuststad vid havet"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1676943602355-5cd6a4e573c0?w=400&q=80"
                      alt="Utsikt över staden och havet"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[var(--sunny-yellow-light)] rounded-2xl p-6 shadow-sm border-l-4 border-[var(--coral)]">
                <h3
                  className="text-2xl text-[var(--ocean-blue)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Ta dig dit
                </h3>
                <p className="text-[var(--ocean-blue)]/70 leading-relaxed">{destination.travel.gettingThere}</p>
              </div>

              <div className="bg-[var(--sunny-yellow-light)] rounded-2xl p-6 shadow-sm border-l-4 border-[var(--fresh-green)]">
                <h3
                  className="text-2xl text-[var(--ocean-blue)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Ta dig runt
                </h3>
                <p className="text-[var(--ocean-blue)]/70 leading-relaxed">{destination.travel.gettingAround}</p>
              </div>

              <div className="bg-[var(--sunny-yellow-light)] rounded-2xl p-6 shadow-sm border-l-4 border-[var(--coral)]">
                <h3
                  className="text-2xl text-[var(--ocean-blue)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Föreslagen rutt
                </h3>
                <p className="text-[var(--ocean-blue)]/70 leading-relaxed">{destination.travel.bestRoutes}</p>
              </div>
            </div>
          )}

          {activeTab === 'days' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <p className="text-[var(--ocean-blue)]/70 leading-relaxed">
                  Detta 7-dagars program balanserar sevärdheter med avkoppling, blandar antika ruiner,
                  kuststäder, vulkaniska landskap och autentiska matupplevelser. Varje dag erbjuder
                  förmiddagsaktiviteter, eftermiddagsutflykter och kvällsmatsrekommendationer.
                </p>
              </div>
              {destination.days.map((day, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--sunny-yellow)] flex items-center justify-center">
                      <span className="text-[var(--coral)] font-medium">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-[var(--coral)] block mb-1">{day.day}</span>
                      <h3
                        className="text-xl text-[var(--ocean-blue)]"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {day.title}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-3 ml-13">
                    {day.activities.map((act, j) => (
                      <div key={j} className="flex gap-4 items-start">
                        <span className="text-sm font-medium text-[var(--fresh-green)] min-w-[80px] pt-0.5">
                          {act.time}
                        </span>
                        <p className="text-[var(--ocean-blue)]/70 flex-1">{act.activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'eat' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <p className="text-[var(--ocean-blue)]/70 leading-relaxed">
                  Det sicilianska köket är en hyllning till öns mångfaldiga arv. Förvänta dig djärva smaker,
                  färska skaldjur, solmognade råvaror och rätter som blandar arabiska, grekiska och italienska influenser.
                  Missa inte gatumaten i Palermo och den unika chokladen i Modica.
                </p>
              </div>
              {destination.restaurants.map((rest, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-xl text-[var(--ocean-blue)]"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {rest.name}
                    </h3>
                    <span className="text-[var(--coral)] font-medium">{rest.priceRange}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-[var(--fresh-green)]" />
                    <p className="text-sm text-[var(--fresh-green)]">{rest.location}</p>
                  </div>

                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-[var(--sunny-yellow)] text-[var(--ocean-blue)] text-xs rounded-full">
                      {rest.cuisine}
                    </span>
                  </div>

                  <p className="text-[var(--ocean-blue)] font-medium mb-2">{rest.specialty}</p>
                  <p className="text-[var(--ocean-blue)]/60 text-sm italic">{rest.why}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'transport' && (
            <div className="space-y-6 animate-fade-in">
              {/* Tåg */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Train className="w-6 h-6 text-[var(--coral)]" />
                  <h3
                    className="text-2xl text-[var(--ocean-blue)]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Tågtidtabeller
                  </h3>
                </div>
                <div className="space-y-3">
                  {destination.transport.trains.map((train, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-[var(--ocean-blue)] text-lg">{train.route}</h4>
                        <span className="text-[var(--coral)] font-medium">{train.price}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                        <div className="flex items-center gap-2 text-[var(--ocean-blue)]/70">
                          <Clock className="w-4 h-4" />
                          <span>{train.frequency}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--ocean-blue)]/70">
                          <Calendar className="w-4 h-4" />
                          <span>{train.duration}</span>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--ocean-blue)]/60 italic">{train.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bussar */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bus className="w-6 h-6 text-[var(--fresh-green)]" />
                  <h3
                    className="text-2xl text-[var(--ocean-blue)]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Busstidtabeller
                  </h3>
                </div>
                <div className="space-y-3">
                  {destination.transport.buses.map((bus, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-[var(--ocean-blue)] text-lg">{bus.route}</h4>
                        <span className="text-[var(--fresh-green)] font-medium">{bus.price}</span>
                      </div>
                      <p className="text-sm text-[var(--ocean-blue)]/50 mb-3">{bus.operator}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                        <div className="flex items-center gap-2 text-[var(--ocean-blue)]/70">
                          <Clock className="w-4 h-4" />
                          <span>{bus.frequency}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--ocean-blue)]/70">
                          <Calendar className="w-4 h-4" />
                          <span>{bus.duration}</span>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--ocean-blue)]/60 italic">{bus.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Båtturer */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Ship className="w-6 h-6 text-[var(--ocean-blue)]" />
                  <h3
                    className="text-2xl text-[var(--ocean-blue)]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Båtturer & Färjor
                  </h3>
                </div>
                <div className="space-y-3">
                  {destination.transport.boats.map((boat, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-[var(--ocean-blue)] text-lg">{boat.route}</h4>
                        <span className="text-[var(--ocean-blue)] font-medium">{boat.price}</span>
                      </div>
                      <p className="text-sm text-[var(--ocean-blue)]/50 mb-3">{boat.operator}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                        <div className="flex items-center gap-2 text-[var(--ocean-blue)]/70">
                          <Clock className="w-4 h-4" />
                          <span>{boat.frequency}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--ocean-blue)]/70">
                          <Calendar className="w-4 h-4" />
                          <span>{boat.duration}</span>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--ocean-blue)]/60 italic">{boat.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'weather' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sun className="w-6 h-6 text-[var(--coral)]" />
                  <h3
                    className="text-2xl text-[var(--ocean-blue)]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Väder i oktober
                  </h3>
                </div>
                <p className="text-[var(--ocean-blue)]/70 leading-relaxed mb-4">
                  Oktober är en fantastisk tid att besöka Sicilien. Vädret är varmt och behagligt utan sommarens extrema värme,
                  och Medelhavet är fortfarande varmt nog för bad.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Thermometer className="w-5 h-5 text-[var(--coral)]" />
                    <h4 className="font-medium text-[var(--ocean-blue)]">Temperatur</h4>
                  </div>
                  <p className="text-[var(--ocean-blue)]/70">{destination.weather.temperature}</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <CloudRain className="w-5 h-5 text-[var(--fresh-green)]" />
                    <h4 className="font-medium text-[var(--ocean-blue)]">Nederbörd</h4>
                  </div>
                  <p className="text-[var(--ocean-blue)]/70">{destination.weather.rainfall}</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <h4 className="font-medium text-[var(--ocean-blue)]">Soltimmar</h4>
                  </div>
                  <p className="text-[var(--ocean-blue)]/70">{destination.weather.sunshine}</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Waves className="w-5 h-5 text-[var(--ocean-blue)]" />
                    <h4 className="font-medium text-[var(--ocean-blue)]">Havstemperatur</h4>
                  </div>
                  <p className="text-[var(--ocean-blue)]/70">{destination.weather.seaTemp}</p>
                </div>

                <div className="bg-[var(--sunny-yellow-light)] rounded-2xl p-5 shadow-sm border-l-4 border-[var(--coral)]">
                  <h4 className="font-medium text-[var(--ocean-blue)] mb-2">Vad ska jag packa?</h4>
                  <p className="text-[var(--ocean-blue)]/70">{destination.weather.clothing}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-3 animate-fade-in">
              {destination.tips.map((tip, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-3"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--coral)] mt-2 flex-shrink-0" />
                  <p className="text-[var(--ocean-blue)]/70">{tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-[var(--border)] p-6">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button
            onClick={onChangeDestination}
            className="flex-1 py-3 px-6 rounded-full border-2 border-[var(--coral)] text-[var(--coral)] font-medium hover:bg-[var(--coral)]/5 transition-colors"
          >
            Se andra resmål
          </button>
          <button
            className="flex-1 py-3 px-6 rounded-full bg-[var(--coral)] text-white font-medium hover:bg-[var(--coral-light)] transition-colors shadow-lg"
          >
            Spara resan
          </button>
        </div>
      </div>
    </div>
  );
}
