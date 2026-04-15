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
  ArrowLeft
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
                { value: 'solo' as TravellerType, icon: <User />, title: 'Ensam', description: 'Bara jag' },
                { value: 'couple' as TravellerType, icon: <Heart />, title: 'Par', description: 'Vi två' },
                { value: 'friends' as TravellerType, icon: <Users />, title: 'Vänner', description: 'En grupp vänner' },
                { value: 'family' as TravellerType, icon: <Baby />, title: 'Familj med barn', description: 'Reser med barn' },
                { value: 'multi-gen' as TravellerType, icon: <Users />, title: 'Flergenerations', description: 'Storfamilj' },
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
            subtitle="Det hjälper oss föreslå barnvänliga aktiviteter"
            currentStep={screenToStep.ages}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <p className="text-[var(--navy)]/60 text-sm mb-4">Välj de åldersgrupper som passar</p>
                {[
                  { label: 'Under 3 år', value: 0 },
                  { label: '3-7 år', value: 1 },
                  { label: '8-12 år', value: 2 },
                  { label: '13+ år', value: 3 },
                ].map((age, i) => (
                  <label key={i} className="flex items-center gap-3 py-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded accent-[var(--terracotta)]"
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
                    <span className="text-[var(--navy)]">{age.label}</span>
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
                <p className="text-sm text-[var(--navy)]/60 mb-3">Tid på året</p>
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
                <p className="text-sm text-[var(--navy)]/60 mb-3">Hur länge?</p>
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
            subtitle="Välj hur många du vill"
            currentStep={screenToStep.mood}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'beach' as Mood, icon: <Waves />, title: 'Sol & strand' },
                  { value: 'city' as Mood, icon: <Building2 />, title: 'Stad & kultur' },
                  { value: 'food' as Mood, icon: <UtensilsCrossed />, title: 'Mat & vin' },
                  { value: 'nature' as Mood, icon: <Mountain />, title: 'Natur & vandring' },
                  { value: 'adventure' as Mood, icon: <Compass />, title: 'Äventyr' },
                  { value: 'wellness' as Mood, icon: <Sparkles />, title: 'Avkoppling' },
                  { value: 'offbeat' as Mood, icon: <MapPin />, title: 'Bortom turiststråken' },
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
            title="Vad är din budget?"
            currentStep={screenToStep.budget}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-3">
              {[
                { value: 'budget' as Budget, icon: <DollarSign />, title: 'Budgetvänlig', description: 'Bra värde utan kompromisser' },
                { value: 'comfortable' as Budget, icon: <DollarSign />, title: 'Bekväm', description: 'Fina hotell och restauranger' },
                { value: 'treat' as Budget, icon: <DollarSign />, title: 'Unna dig', description: 'Exklusivt och minnesvärt' },
                { value: 'luxury' as Budget, icon: <DollarSign />, title: 'Inga gränser', description: 'De allra bästa upplevelserna' },
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
            title="Hur långt är du villig att resa?"
            currentStep={screenToStep.distance}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-3">
              {[
                { value: 'nearby' as Distance, icon: <MapPin />, title: 'Nära', description: 'Kort flyg eller bilresa' },
                { value: 'europe' as Distance, icon: <Plane />, title: 'Inom Europa', description: '2-4 timmars flyg' },
                { value: 'long-haul' as Distance, icon: <Plane />, title: 'Långdistans', description: '6+ timmars flyg' },
                { value: 'anywhere' as Distance, icon: <Compass />, title: 'Varsomhelst', description: 'Avståndet spelar ingen roll' },
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
      <div className="absolute top-20 right-10 w-32 h-32 bg-[var(--sand)] rounded-full opacity-40 blur-3xl" />
      <div className="absolute bottom-32 left-10 w-40 h-40 bg-[var(--olive)] rounded-full opacity-30 blur-3xl" />

      <div className="max-w-md w-full text-center space-y-8 animate-fade-in relative z-10">
        <div className="space-y-4">
          <h1
            className="text-6xl md:text-7xl text-[var(--navy)] leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Låt oss hitta din nästa resa
          </h1>
          <p className="text-lg text-[var(--navy)]/70">
            Svara på några frågor och vi planerar den perfekta resan
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
              className="text-4xl text-[var(--navy)] leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-[var(--navy)]/60">{subtitle}</p>
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
          <Loader2 className="w-16 h-16 text-[var(--terracotta)] animate-spin mx-auto" />
          <div className="absolute inset-0 bg-[var(--terracotta)] opacity-20 rounded-full blur-xl" />
        </div>
        <div className="space-y-2">
          <h3
            className="text-3xl text-[var(--navy)]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Söker din perfekta resa...
          </h3>
          <p className="text-[var(--navy)]/60">
            Söker igenom fantastiska resmål
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
      name: 'Sicily, Italy',
      tagline: 'Perfekt för höstsol, matälskare och par',
      tags: ['Medelhavskök', 'Antik historia', 'Kustsamhällen'],
      image: 'https://images.unsplash.com/photo-1555992509-1f7e3f14d4a5?w=800&q=80',
    },
    {
      name: 'Greek Islands',
      tagline: 'Paradis för öhopping med fantastiska stränder',
      tags: ['Strandliv', 'Färsk skaldjur', 'Kalkvitrappade byar'],
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
    },
    {
      name: 'Provence, France',
      tagline: 'Lavendelfält och vinlandets charm',
      tags: ['Vinprovning', 'Landsbygd', 'Lokala marknader'],
      image: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&q=80',
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
              className="text-4xl text-[var(--navy)] leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Vi hittade dessa åt dig
            </h2>
            <p className="text-[var(--navy)]/60">
              Tryck på ett resmål för att se personliga förslag på vad du kan göra, hur du reser och var du äter
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
                      className="text-2xl text-[var(--navy)] mb-1"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {dest.name}
                    </h3>
                    <p className="text-sm text-[var(--navy)]/70">{dest.tagline}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dest.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 bg-[var(--sand)] text-[var(--navy)] text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--navy)]/50 pt-2 border-t border-[var(--sand)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Dag för dag-plan
                    </span>
                    <span className="flex items-center gap-1">
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      Restauranger
                    </span>
                    <span className="flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5" />
                      Reseråd
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
  const [activeTab, setActiveTab] = useState<'overview' | 'days' | 'eat' | 'tips'>('overview');

  const destination = {
    name: 'Sicily, Italy',
    hero: 'https://images.unsplash.com/photo-1555992509-1f7e3f14d4a5?w=1200&q=80',
    overview: {
      why: "Sicilien i oktober erbjuder den perfekta blandningen av varmt medelhavsklimat, skördesäsongens rikedomar och färre turister. Öns rika historia av grekiska, romerska, arabiska och normandiska influenser skapar en oförglömlig kulturell upplevelse.",
      bestTime: 'Oktober är idealiskt – varma dagar (21–24 °C), behagliga kvällar, druv- och olivskördens säsong',
      vibe: 'Avslappnat öltempo med passionerad lokalbefolkning, fantastisk matkultur och dramatiska landskap – från Etna till antika ruiner',
    },
    travel: {
      gettingThere: 'Flyg till Palermo (PMO) eller Catania (CTA). Direktflyg finns från de flesta europeiska storstäder (2–3 timmar från London, Paris eller Berlin). Catania ligger närmare Etna och Taormina; Palermo är bäst för västra Sicilien.',
      gettingAround: 'Hyr bil för maximal frihet – nödvändigt för att utforska landsbygden och kustsöder. Alternativt kan du kombinera tåg mellan städer med lokalbussar och taxi. Överväg att hyra en förare för Etna-utflykter.',
      bestRoutes: 'Starta i Palermo, kör österut längs kusten via Cefalù till Taormina, sedan söderut till Syrakusa och Ragusa, sväng västerut mot Agrigento och återvänd till Palermo. Eller gör rutten baklänges från Catania.',
    },
    days: [
      {
        day: 'Dag 1',
        title: 'Palermo – Gatumat & marknader',
        activities: [
          { time: 'Morgon', activity: 'Utforska Ballarò-marknaden, smaka arancini och panelle' },
          { time: 'Eftermiddag', activity: 'Besök Palazzo dei Normanni och Cappella Palatina' },
          { time: 'Kväll', activity: 'Solnedgångsaperitivt vid Quattro Canti' },
        ],
      },
      {
        day: 'Dag 2',
        title: 'Etna & vinprovning',
        activities: [
          { time: 'Morgon', activity: 'Vandra bland Etnas vulkankratrar' },
          { time: 'Eftermiddag', activity: 'Vinprovning på ett Etna DOC-vingård' },
          { time: 'Kväll', activity: 'Middag i Taormina med utsikt mot Etna' },
        ],
      },
      {
        day: 'Dag 3',
        title: 'Taormina – Antikt teater & stränder',
        activities: [
          { time: 'Morgon', activity: 'Besök Teatro Greco med storslagna kustvy' },
          { time: 'Eftermiddag', activity: 'Stranddags vid Isola Bella' },
          { time: 'Kväll', activity: 'Promenad längs Corso Umberto, gelatoprovning' },
        ],
      },
      {
        day: 'Dag 4',
        title: 'Tempeldalen, Agrigento',
        activities: [
          { time: 'Morgon', activity: 'Utforska UNESCO-listade antikgrekiska ruiner' },
          { time: 'Eftermiddag', activity: 'Lunch i Agrigento med lokal skaldjur' },
          { time: 'Kväll', activity: 'Solnedgång vid Scala dei Turchi vita klippor' },
        ],
      },
      {
        day: 'Dag 5',
        title: 'Syrakusa & Ortigiaön',
        activities: [
          { time: 'Morgon', activity: 'Arkeologiska parken Neapolis' },
          { time: 'Eftermiddag', activity: 'Vandra i Ortigias barockgator' },
          { time: 'Kväll', activity: 'Färsk skaldjursmiddag vid hamnen' },
        ],
      },
      {
        day: 'Dag 6',
        title: 'Modica & Ragusa – barockstäder',
        activities: [
          { time: 'Morgon', activity: 'Chokladprovningstur i Modica' },
          { time: 'Eftermiddag', activity: 'Utforska Ragusa Iblas fantastiska arkitektur' },
          { time: 'Kväll', activity: 'Traditionell siciliansk middag på lokal osteria' },
        ],
      },
      {
        day: 'Dag 7',
        title: 'Cefalù – avkoppling vid kusten',
        activities: [
          { time: 'Morgon', activity: 'Stranddags vid Cefalùs gyllene sand' },
          { time: 'Eftermiddag', activity: 'Besök den normandiska katedralen' },
          { time: 'Kväll', activity: 'Avskedsmiddag på en skaldjursrestaurang' },
        ],
      },
    ],
    restaurants: [
      {
        name: 'Ristorante Coria',
        location: 'Ortigia, Syracuse',
        specialty: 'Modernt sicilianskt kök med havsutsikt',
        cuisine: 'Modernt sicilianskt',
        priceRange: '€€€',
        why: 'Michelin-rekommenderat med nyskapande tolkningar av klassiska recept och fantastisk hamnvy'
      },
      {
        name: 'Trattoria del Corso',
        location: 'Taormina',
        specialty: 'Traditionell pasta alla Norma',
        cuisine: 'Traditionellt sicilianskt',
        priceRange: '€€',
        why: 'Familjedriven i 40 år, lokalbefolkningen svär vid deras handgjorda pasta och auberginerätter'
      },
      {
        name: 'La Bettola',
        location: 'Cefalù',
        specialty: 'Dagens fångst, direkt vid stranden',
        cuisine: 'Skaldjur',
        priceRange: '€€',
        why: 'Bord på sanden, fisken köps direkt från fiskarna varje morgon'
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
        specialty: 'Gatumat lyft till ny nivå',
        cuisine: 'Gatumat',
        priceRange: '€',
        why: 'Smaka Palermos berömda gatumat i en charmig miljö – bästa arancini i staden'
      },
      {
        name: 'Trattoria da Nino',
        location: 'Etnas sluttningar',
        specialty: 'Etnaviner med lokala rätter',
        cuisine: 'Regionalt sicilianskt',
        priceRange: '€€',
        why: 'Familjens vingårdsrestaurang med vulkanjordsviner och råvaror från den egna trädgården'
      },
    ],
    tips: [
      'Hyr bil för frihet att utforska landsbygden',
      'Lär dig grundläggande italienska hälsningsfraser – lokalbefolkningen uppskattar det',
      'Packa lager – oktobermorgnar kan vara svala, eftermiddagarna varma',
      'Boka Etna-turer i förväg, väderberoende',
      'Många restauranger stänger 15–17 (siesta)',
      'Kontanter är kung i mindre städer och på marknader',
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
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/60 via-transparent to-transparent" />

        {/* Back button overlay */}
        <div className="absolute top-6 left-6">
          <button
            onClick={onBack}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[var(--navy)]" />
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
            { value: 'tips', label: 'Bra att veta' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as typeof activeTab)}
              className={`flex-1 min-w-[120px] py-4 px-4 font-medium transition-colors relative ${
                activeTab === tab.value
                  ? 'text-[var(--terracotta)]'
                  : 'text-[var(--navy)]/50 hover:text-[var(--navy)]'
              }`}
            >
              {tab.label}
              {activeTab === tab.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--terracotta)]" />
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
                  className="text-2xl text-[var(--navy)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Varför Sicilien?
                </h3>
                <p className="text-[var(--navy)]/70 leading-relaxed">{destination.overview.why}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3
                  className="text-2xl text-[var(--navy)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Väder i oktober
                </h3>
                <p className="text-[var(--navy)]/70 leading-relaxed">{destination.overview.bestTime}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3
                  className="text-2xl text-[var(--navy)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Stämningen
                </h3>
                <p className="text-[var(--navy)]/70 leading-relaxed">{destination.overview.vibe}</p>
              </div>

              <div className="bg-[var(--sand-light)] rounded-2xl p-6 shadow-sm border-l-4 border-[var(--terracotta)]">
                <h3
                  className="text-2xl text-[var(--navy)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Ta sig dit
                </h3>
                <p className="text-[var(--navy)]/70 leading-relaxed">{destination.travel.gettingThere}</p>
              </div>

              <div className="bg-[var(--sand-light)] rounded-2xl p-6 shadow-sm border-l-4 border-[var(--olive)]">
                <h3
                  className="text-2xl text-[var(--navy)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Ta sig runt
                </h3>
                <p className="text-[var(--navy)]/70 leading-relaxed">{destination.travel.gettingAround}</p>
              </div>

              <div className="bg-[var(--sand-light)] rounded-2xl p-6 shadow-sm border-l-4 border-[var(--terracotta)]">
                <h3
                  className="text-2xl text-[var(--navy)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Föreslagen rutt
                </h3>
                <p className="text-[var(--navy)]/70 leading-relaxed">{destination.travel.bestRoutes}</p>
              </div>
            </div>
          )}

          {activeTab === 'days' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <p className="text-[var(--navy)]/70 leading-relaxed">
                  Det här 7-dagarsprogrammet balanserar sevärdheter med avkoppling och blandar antika ruiner,
                  kustsamhällen, vulkaniska landskap och autentiska matupplevelser. Varje dag erbjuder
                  morgnaktiviteter, eftermiddagsutflykter och kvällsmatsrekommendationer.
                </p>
              </div>
              {destination.days.map((day, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--sand)] flex items-center justify-center">
                      <span className="text-[var(--terracotta)] font-medium">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-[var(--terracotta)] block mb-1">{day.day}</span>
                      <h3
                        className="text-xl text-[var(--navy)]"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {day.title}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-3 ml-13">
                    {day.activities.map((act, j) => (
                      <div key={j} className="flex gap-4 items-start">
                        <span className="text-sm font-medium text-[var(--olive)] min-w-[80px] pt-0.5">
                          {act.time}
                        </span>
                        <p className="text-[var(--navy)]/70 flex-1">{act.activity}</p>
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
                <p className="text-[var(--navy)]/70 leading-relaxed">
                  Det sicilianska köket är en fest av öns mångfacetterade arv. Förvänta dig kraftfulla smaker,
                  färska skaldjur, solmogna råvaror och rätter som blandar arabiska, grekiska och italienska influenser.
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
                      className="text-xl text-[var(--navy)]"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {rest.name}
                    </h3>
                    <span className="text-[var(--terracotta)] font-medium">{rest.priceRange}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-[var(--olive)]" />
                    <p className="text-sm text-[var(--olive)]">{rest.location}</p>
                  </div>

                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-[var(--sand)] text-[var(--navy)] text-xs rounded-full">
                      {rest.cuisine}
                    </span>
                  </div>

                  <p className="text-[var(--navy)] font-medium mb-2">{rest.specialty}</p>
                  <p className="text-[var(--navy)]/60 text-sm italic">{rest.why}</p>
                </div>
              ))}
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
                  <div className="w-2 h-2 rounded-full bg-[var(--terracotta)] mt-2 flex-shrink-0" />
                  <p className="text-[var(--navy)]/70">{tip}</p>
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
            className="flex-1 py-3 px-6 rounded-full border-2 border-[var(--terracotta)] text-[var(--terracotta)] font-medium hover:bg-[var(--terracotta)]/5 transition-colors"
          >
            Se andra resmål
          </button>
          <button
            className="flex-1 py-3 px-6 rounded-full bg-[var(--terracotta)] text-white font-medium hover:bg-[var(--terracotta-light)] transition-colors shadow-lg"
          >
            Spara denna resa
          </button>
        </div>
      </div>
    </div>
  );
}
