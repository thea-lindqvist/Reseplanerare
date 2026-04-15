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
            title="Who's travelling?"
            currentStep={screenToStep.traveller}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-3">
              {[
                { value: 'solo' as TravellerType, icon: <User />, title: 'Solo', description: 'Just me' },
                { value: 'couple' as TravellerType, icon: <Heart />, title: 'Couple', description: 'Two of us' },
                { value: 'friends' as TravellerType, icon: <Users />, title: 'Friends', description: 'A group of friends' },
                { value: 'family' as TravellerType, icon: <Baby />, title: 'Family with kids', description: 'Travelling with children' },
                { value: 'multi-gen' as TravellerType, icon: <Users />, title: 'Multi-generation', description: 'Extended family' },
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
            title="How old are the kids?"
            subtitle="This helps us suggest family-friendly activities"
            currentStep={screenToStep.ages}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <p className="text-[var(--navy)]/60 text-sm mb-4">Select age ranges that apply</p>
                {[
                  { label: 'Under 3 years', value: 0 },
                  { label: '3-7 years', value: 1 },
                  { label: '8-12 years', value: 2 },
                  { label: '13+ years', value: 3 },
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
              <PrimaryButton onClick={() => setScreen('when')}>Continue</PrimaryButton>
            </div>
          </QuestionScreen>
        );

      case 'when':
        return (
          <QuestionScreen
            title="When do you want to travel?"
            currentStep={screenToStep.when}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-6">
              <div>
                <p className="text-sm text-[var(--navy)]/60 mb-3">Time of year</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'spring' as Season, icon: <Sparkles />, title: 'Spring' },
                    { value: 'summer' as Season, icon: <Sun />, title: 'Summer' },
                    { value: 'autumn' as Season, icon: <Wine />, title: 'Autumn' },
                    { value: 'winter' as Season, icon: <TreePine />, title: 'Winter' },
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
                <p className="text-sm text-[var(--navy)]/60 mb-3">How long?</p>
                <div className="space-y-3">
                  {[
                    { value: 'weekend' as Duration, title: 'Weekend escape', description: '2-3 days' },
                    { value: '1-week' as Duration, title: 'One week', description: '5-7 days' },
                    { value: '2-weeks' as Duration, title: 'Two weeks', description: '10-14 days' },
                    { value: 'longer' as Duration, title: 'Longer adventure', description: '2+ weeks' },
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
                Continue
              </PrimaryButton>
            </div>
          </QuestionScreen>
        );

      case 'mood':
        return (
          <QuestionScreen
            title="What are you in the mood for?"
            subtitle="Choose as many as you like"
            currentStep={screenToStep.mood}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'beach' as Mood, icon: <Waves />, title: 'Sun & beach' },
                  { value: 'city' as Mood, icon: <Building2 />, title: 'City & culture' },
                  { value: 'food' as Mood, icon: <UtensilsCrossed />, title: 'Food & wine' },
                  { value: 'nature' as Mood, icon: <Mountain />, title: 'Nature & hiking' },
                  { value: 'adventure' as Mood, icon: <Compass />, title: 'Adventure' },
                  { value: 'wellness' as Mood, icon: <Sparkles />, title: 'Relaxation' },
                  { value: 'offbeat' as Mood, icon: <MapPin />, title: 'Off the beaten path' },
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
                Continue
              </PrimaryButton>
            </div>
          </QuestionScreen>
        );

      case 'budget':
        return (
          <QuestionScreen
            title="What's your budget?"
            currentStep={screenToStep.budget}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-3">
              {[
                { value: 'budget' as Budget, icon: <DollarSign />, title: 'Budget-friendly', description: 'Great value without compromise' },
                { value: 'comfortable' as Budget, icon: <DollarSign />, title: 'Comfortable', description: 'Nice hotels and dining' },
                { value: 'treat' as Budget, icon: <DollarSign />, title: 'Treat yourself', description: 'Upscale and memorable' },
                { value: 'luxury' as Budget, icon: <DollarSign />, title: "Sky's the limit", description: 'The very best experiences' },
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
            title="How far are you willing to travel?"
            currentStep={screenToStep.distance}
            totalSteps={totalSteps}
            onBack={goBack}
          >
            <div className="space-y-3">
              {[
                { value: 'nearby' as Distance, icon: <MapPin />, title: 'Nearby', description: 'Short flight or drive' },
                { value: 'europe' as Distance, icon: <Plane />, title: 'Within Europe', description: '2-4 hours flight' },
                { value: 'long-haul' as Distance, icon: <Plane />, title: 'Long-haul', description: '6+ hours flight' },
                { value: 'anywhere' as Distance, icon: <Compass />, title: 'Anywhere', description: 'Distance is no object' },
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
            Let's find your next trip
          </h1>
          <p className="text-lg text-[var(--navy)]/70">
            Answer a few questions and we'll plan the perfect getaway
          </p>
        </div>

        <div className="pt-4">
          <PrimaryButton onClick={onStart}>Start planning</PrimaryButton>
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
            Finding your perfect trip...
          </h3>
          <p className="text-[var(--navy)]/60">
            Searching through amazing destinations
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
      tagline: 'Perfect for autumn sun, food lovers and couples',
      tags: ['Mediterranean cuisine', 'Ancient history', 'Coastal towns'],
      image: 'https://images.unsplash.com/photo-1555992509-1f7e3f14d4a5?w=800&q=80',
    },
    {
      name: 'Greek Islands',
      tagline: 'Island hopping paradise with stunning beaches',
      tags: ['Beach life', 'Fresh seafood', 'White-washed villages'],
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
    },
    {
      name: 'Provence, France',
      tagline: 'Lavender fields and wine country charm',
      tags: ['Wine tasting', 'Countryside', 'Local markets'],
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
              We found these for you
            </h2>
            <p className="text-[var(--navy)]/60">
              Tap a destination to see personalized suggestions for what to do, how to travel, and where to eat
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
                      Day-by-day plan
                    </span>
                    <span className="flex items-center gap-1">
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      Restaurants
                    </span>
                    <span className="flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5" />
                      Travel tips
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
      why: "Sicily in October offers the perfect blend of warm Mediterranean weather, harvest season bounty, and fewer crowds. The island's rich tapestry of Greek, Roman, Arab, and Norman influences creates an unforgettable cultural experience.",
      bestTime: 'October is ideal - warm days (21-24°C), comfortable evenings, grape and olive harvest season',
      vibe: 'Relaxed island pace with passionate local culture, incredible food scene, and dramatic landscapes from Mount Etna to ancient ruins',
    },
    travel: {
      gettingThere: 'Fly into Palermo (PMO) or Catania (CTA) airports. Direct flights available from major European cities (2-3 hours from London, Paris, or Berlin). Catania is closer to Mount Etna and Taormina; Palermo is ideal for western Sicily.',
      gettingAround: 'Rent a car for maximum flexibility - essential for exploring countryside and coastal towns. Alternatively, combine trains for city-to-city travel with local buses or taxis. Consider hiring a driver for Etna excursions.',
      bestRoutes: 'Start in Palermo, drive east along the coast through Cefalù to Taormina, then south to Syracuse and Ragusa, loop west to Agrigento, and return to Palermo. Or reverse the route starting from Catania.',
    },
    days: [
      {
        day: 'Day 1',
        title: 'Palermo - Street Food & Markets',
        activities: [
          { time: 'Morning', activity: 'Explore Ballarò Market, taste arancini and panelle' },
          { time: 'Afternoon', activity: 'Visit Palazzo dei Normanni and Cappella Palatina' },
          { time: 'Evening', activity: 'Sunset aperitivo at Quattro Canti' },
        ],
      },
      {
        day: 'Day 2',
        title: 'Mount Etna & Wine Tasting',
        activities: [
          { time: 'Morning', activity: 'Hike the volcanic craters of Mount Etna' },
          { time: 'Afternoon', activity: 'Wine tasting at an Etna DOC vineyard' },
          { time: 'Evening', activity: 'Dinner in Taormina with Etna views' },
        ],
      },
      {
        day: 'Day 3',
        title: 'Taormina - Ancient Theater & Beaches',
        activities: [
          { time: 'Morning', activity: 'Visit Teatro Greco with stunning coastal views' },
          { time: 'Afternoon', activity: 'Beach time at Isola Bella' },
          { time: 'Evening', activity: 'Stroll Corso Umberto, gelato tasting' },
        ],
      },
      {
        day: 'Day 4',
        title: 'Valley of the Temples, Agrigento',
        activities: [
          { time: 'Morning', activity: 'Explore the UNESCO ancient Greek ruins' },
          { time: 'Afternoon', activity: 'Lunch in Agrigento, local seafood' },
          { time: 'Evening', activity: 'Sunset at Scala dei Turchi white cliffs' },
        ],
      },
      {
        day: 'Day 5',
        title: 'Syracuse & Ortigia Island',
        activities: [
          { time: 'Morning', activity: 'Archaeological Park of Neapolis' },
          { time: 'Afternoon', activity: 'Wander the baroque streets of Ortigia' },
          { time: 'Evening', activity: 'Fresh seafood dinner by the harbor' },
        ],
      },
      {
        day: 'Day 6',
        title: 'Modica & Ragusa - Baroque Towns',
        activities: [
          { time: 'Morning', activity: 'Modica chocolate tasting tour' },
          { time: 'Afternoon', activity: 'Explore Ragusa Ibla\'s stunning architecture' },
          { time: 'Evening', activity: 'Traditional Sicilian dinner in a local osteria' },
        ],
      },
      {
        day: 'Day 7',
        title: 'Cefalù - Coastal Relaxation',
        activities: [
          { time: 'Morning', activity: 'Beach time at Cefalù\'s golden sands' },
          { time: 'Afternoon', activity: 'Visit the Norman Cathedral' },
          { time: 'Evening', activity: 'Farewell dinner at a seafood restaurant' },
        ],
      },
    ],
    restaurants: [
      {
        name: 'Ristorante Coria',
        location: 'Ortigia, Syracuse',
        specialty: 'Contemporary Sicilian with sea views',
        cuisine: 'Modern Sicilian',
        priceRange: '€€€',
        why: 'Michelin-recommended with innovative takes on classic recipes and stunning harbor views'
      },
      {
        name: 'Trattoria del Corso',
        location: 'Taormina',
        specialty: 'Traditional pasta alla Norma',
        cuisine: 'Traditional Sicilian',
        priceRange: '€€',
        why: 'Family-run for 40 years, locals swear by their handmade pasta and eggplant dishes'
      },
      {
        name: 'La Bettola',
        location: 'Cefalù',
        specialty: 'Fresh catch of the day, beachside',
        cuisine: 'Seafood',
        priceRange: '€€',
        why: 'Tables on the sand, fish bought directly from fishermen each morning'
      },
      {
        name: 'Antica Dolceria Bonajuto',
        location: 'Modica',
        specialty: 'Historic chocolate making since 1880',
        cuisine: 'Desserts & Chocolate',
        priceRange: '€',
        why: 'Sicily\'s oldest chocolate maker, using ancient Aztec techniques with cinnamon and chili'
      },
      {
        name: 'Osteria Mercede',
        location: 'Palermo',
        specialty: 'Street food elevated',
        cuisine: 'Street Food',
        priceRange: '€',
        why: 'Taste Palermo\'s famous street food in a charming setting - best arancini in the city'
      },
      {
        name: 'Trattoria da Nino',
        location: 'Mount Etna slopes',
        specialty: 'Etna wine pairings with local dishes',
        cuisine: 'Regional Sicilian',
        priceRange: '€€',
        why: 'Family vineyard restaurant with volcanic soil wines and produce from their garden'
      },
    ],
    tips: [
      'Rent a car for flexibility exploring the countryside',
      'Learn basic Italian greetings - locals appreciate the effort',
      'Pack layers - October mornings can be cool, afternoons warm',
      'Book Etna tours in advance, weather dependent',
      'Many restaurants close 3-5pm (siesta time)',
      'Cash is king in smaller towns and markets',
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
            { value: 'overview', label: 'Overview' },
            { value: 'days', label: 'Day by day' },
            { value: 'eat', label: 'Eat & drink' },
            { value: 'tips', label: 'Good to know' },
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
                  Why Sicily?
                </h3>
                <p className="text-[var(--navy)]/70 leading-relaxed">{destination.overview.why}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3
                  className="text-2xl text-[var(--navy)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Weather in October
                </h3>
                <p className="text-[var(--navy)]/70 leading-relaxed">{destination.overview.bestTime}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3
                  className="text-2xl text-[var(--navy)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  The Vibe
                </h3>
                <p className="text-[var(--navy)]/70 leading-relaxed">{destination.overview.vibe}</p>
              </div>

              <div className="bg-[var(--sand-light)] rounded-2xl p-6 shadow-sm border-l-4 border-[var(--terracotta)]">
                <h3
                  className="text-2xl text-[var(--navy)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Getting There
                </h3>
                <p className="text-[var(--navy)]/70 leading-relaxed">{destination.travel.gettingThere}</p>
              </div>

              <div className="bg-[var(--sand-light)] rounded-2xl p-6 shadow-sm border-l-4 border-[var(--olive)]">
                <h3
                  className="text-2xl text-[var(--navy)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Getting Around
                </h3>
                <p className="text-[var(--navy)]/70 leading-relaxed">{destination.travel.gettingAround}</p>
              </div>

              <div className="bg-[var(--sand-light)] rounded-2xl p-6 shadow-sm border-l-4 border-[var(--terracotta)]">
                <h3
                  className="text-2xl text-[var(--navy)] mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Suggested Route
                </h3>
                <p className="text-[var(--navy)]/70 leading-relaxed">{destination.travel.bestRoutes}</p>
              </div>
            </div>
          )}

          {activeTab === 'days' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <p className="text-[var(--navy)]/70 leading-relaxed">
                  This 7-day itinerary balances must-see sights with relaxation, mixing ancient ruins,
                  coastal towns, volcanic landscapes, and authentic food experiences. Each day offers
                  morning activities, afternoon exploration, and evening dining recommendations.
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
                  Sicilian cuisine is a celebration of the island\'s diverse heritage. Expect bold flavors,
                  fresh seafood, sun-ripened produce, and dishes that blend Arab, Greek, and Italian influences.
                  Don\'t miss the street food in Palermo and the unique chocolate in Modica.
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
            See other destinations
          </button>
          <button
            className="flex-1 py-3 px-6 rounded-full bg-[var(--terracotta)] text-white font-medium hover:bg-[var(--terracotta-light)] transition-colors shadow-lg"
          >
            Save this trip
          </button>
        </div>
      </div>
    </div>
  );
}
