import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Calendar as CalendarIcon,
  Users,
  ArrowLeftRight,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  ChevronDown,
  X,
  MapPin,
  Flame,
  Star,
  Check,
} from "lucide-react";
import GlassCalendar from "@/components/ui/GlassCalendar";
import BookingModal from "@/components/BookingModal";

const popularAirports = [
  // ==========================================
  // INDIA INTERNATIONAL & MAJOR AIRPORTS
  // ==========================================
  { code: "DEL", city: "New Delhi", country: "India", name: "Indira Gandhi International Airport" },
  { code: "BOM", city: "Mumbai", country: "India", name: "Chhatrapati Shivaji Maharaj International" },
  { code: "BLR", city: "Bengaluru", country: "India", name: "Kempegowda International Airport" },
  { code: "HYD", city: "Hyderabad", country: "India", name: "Rajiv Gandhi International Airport" },
  { code: "MAA", city: "Chennai", country: "India", name: "Chennai International Airport" },
  { code: "CCU", city: "Kolkata", country: "India", name: "Netaji Subhash Chandra Bose Intl" },
  { code: "COK", city: "Kochi", country: "India", name: "Cochin International Airport" },
  { code: "AMD", city: "Ahmedabad", country: "India", name: "Sardar Vallabhbhai Patel Intl" },
  { code: "GOI", city: "Goa (Dabolim)", country: "India", name: "Dabolim International Airport" },
  { code: "GOX", city: "Goa (Mopa)", country: "India", name: "Manohar International Airport" },
  { code: "TRV", city: "Thiruvananthapuram", country: "India", name: "Trivandrum International Airport" },
  { code: "CCJ", city: "Kozhikode", country: "India", name: "Calicut International Airport" },
  { code: "PNQ", city: "Pune", country: "India", name: "Pune International Airport" },
  { code: "JAI", city: "Jaipur", country: "India", name: "Jaipur International Airport" },
  { code: "LKO", city: "Lucknow", country: "India", name: "Chaudhary Charan Singh Intl" },
  { code: "ATQ", city: "Amritsar", country: "India", name: "Sri Guru Ram Dass Jee Intl" },
  { code: "IXC", city: "Chandigarh", country: "India", name: "Shaheed Bhagat Singh Intl" },
  { code: "IXE", city: "Mangaluru", country: "India", name: "Mangaluru International Airport" },
  { code: "TRZ", city: "Tiruchirappalli", country: "India", name: "Tiruchirappalli International Airport" },
  { code: "BBI", city: "Bhubaneswar", country: "India", name: "Biju Patnaik International Airport" },
  { code: "GAU", city: "Guwahati", country: "India", name: "Lokpriya Gopinath Bordoloi Intl" },
  { code: "CNN", city: "Kannur", country: "India", name: "Kannur International Airport" },
  { code: "VTZ", city: "Visakhapatnam", country: "India", name: "Visakhapatnam International Airport" },
  { code: "NAG", city: "Nagpur", country: "India", name: "Dr. Babasaheb Ambedkar Intl" },
  { code: "PAT", city: "Patna", country: "India", name: "Jay Prakash Narayan Airport" },
  { code: "IDR", city: "Indore", country: "India", name: "Devi Ahilyabai Holkar Airport" },
  { code: "VNS", city: "Varanasi", country: "India", name: "Lal Bahadur Shastri Intl" },
  { code: "CJB", city: "Coimbatore", country: "India", name: "Coimbatore International Airport" },
  { code: "IXM", city: "Madurai", country: "India", name: "Madurai Airport" },
  { code: "SXR", city: "Srinagar", country: "India", name: "Sheikh ul-Alam International Airport" },

  // ==========================================
  // MIDDLE EAST & GULF
  // ==========================================
  { code: "DXB", city: "Dubai", country: "United Arab Emirates", name: "Dubai International Airport" },
  { code: "DWC", city: "Dubai (Al Maktoum)", country: "United Arab Emirates", name: "Al Maktoum International" },
  { code: "AUH", city: "Abu Dhabi", country: "United Arab Emirates", name: "Zayed International Airport" },
  { code: "DOH", city: "Doha", country: "Qatar", name: "Hamad International Airport" },
  { code: "RUH", city: "Riyadh", country: "Saudi Arabia", name: "King Khalid International Airport" },
  { code: "JED", city: "Jeddah", country: "Saudi Arabia", name: "King Abdulaziz International Airport" },
  { code: "MCT", city: "Muscat", country: "Oman", name: "Muscat International Airport" },
  { code: "KWI", city: "Kuwait City", country: "Kuwait", name: "Kuwait International Airport" },
  { code: "BAH", city: "Manama", country: "Bahrain", name: "Bahrain International Airport" },

  // ==========================================
  // EUROPE
  // ==========================================
  { code: "LHR", city: "London", country: "United Kingdom", name: "Heathrow Airport" },
  { code: "LGW", city: "London (Gatwick)", country: "United Kingdom", name: "Gatwick Airport" },
  { code: "CDG", city: "Paris", country: "France", name: "Charles de Gaulle Airport" },
  { code: "ORY", city: "Paris (Orly)", country: "France", name: "Paris Orly Airport" },
  { code: "FRA", city: "Frankfurt", country: "Germany", name: "Frankfurt Airport" },
  { code: "MUC", city: "Munich", country: "Germany", name: "Munich Airport" },
  { code: "AMS", city: "Amsterdam", country: "Netherlands", name: "Amsterdam Airport Schiphol" },
  { code: "ZRH", city: "Zurich", country: "Switzerland", name: "Zurich Airport" },
  { code: "GVA", city: "Geneva", country: "Switzerland", name: "Geneva Airport" },
  { code: "FCO", city: "Rome", country: "Italy", name: "Leonardo da Vinci-Fiumicino" },
  { code: "MXP", city: "Milan", country: "Italy", name: "Milan Malpensa Airport" },
  { code: "MAD", city: "Madrid", country: "Spain", name: "Adolfo Suárez Madrid-Barajas" },
  { code: "BCN", city: "Barcelona", country: "Spain", name: "Josep Tarradellas Barcelona-El Prat" },
  { code: "VIE", city: "Vienna", country: "Austria", name: "Vienna International Airport" },
  { code: "BRU", city: "Brussels", country: "Belgium", name: "Brussels Airport" },
  { code: "CPH", city: "Copenhagen", country: "Denmark", name: "Copenhagen Airport" },
  { code: "ARN", city: "Stockholm", country: "Sweden", name: "Stockholm Arlanda Airport" },
  { code: "OSL", city: "Oslo", country: "Norway", name: "Oslo Airport" },
  { code: "HEL", city: "Helsinki", country: "Finland", name: "Helsinki Airport" },
  { code: "DUB", city: "Dublin", country: "Ireland", name: "Dublin Airport" },
  { code: "ATH", city: "Athens", country: "Greece", name: "Athens International Airport" },
  { code: "IST", city: "Istanbul", country: "Turkey", name: "Istanbul Airport" },
  { code: "LIS", city: "Lisbon", country: "Portugal", name: "Humberto Delgado Airport" },

  // ==========================================
  // NORTH AMERICA & AMERICAS
  // ==========================================
  { code: "JFK", city: "New York", country: "United States", name: "John F. Kennedy International" },
  { code: "EWR", city: "New York (Newark)", country: "United States", name: "Newark Liberty International" },
  { code: "LAX", city: "Los Angeles", country: "United States", name: "Los Angeles International" },
  { code: "SFO", city: "San Francisco", country: "United States", name: "San Francisco International" },
  { code: "ORD", city: "Chicago", country: "United States", name: "O'Hare International Airport" },
  { code: "MIA", city: "Miami", country: "United States", name: "Miami International Airport" },
  { code: "DFW", city: "Dallas", country: "United States", name: "Dallas/Fort Worth International" },
  { code: "ATL", city: "Atlanta", country: "United States", name: "Hartsfield-Jackson Atlanta Intl" },
  { code: "SEA", city: "Seattle", country: "United States", name: "Seattle-Tacoma International" },
  { code: "BOS", city: "Boston", country: "United States", name: "Logan International Airport" },
  { code: "LAS", city: "Las Vegas", country: "United States", name: "Harry Reid International" },
  { code: "YYZ", city: "Toronto", country: "Canada", name: "Toronto Pearson International" },
  { code: "YVR", city: "Vancouver", country: "Canada", name: "Vancouver International" },
  { code: "YUL", city: "Montreal", country: "Canada", name: "Montréal-Trudeau International" },
  { code: "MEX", city: "Mexico City", country: "Mexico", name: "Benito Juárez International" },
  { code: "CUN", city: "Cancún", country: "Mexico", name: "Cancún International Airport" },
  { code: "GRU", city: "São Paulo", country: "Brazil", name: "São Paulo/Guarulhos International" },
  { code: "GIG", city: "Rio de Janeiro", country: "Brazil", name: "Rio de Janeiro/Galeão Intl" },
  { code: "EZE", city: "Buenos Aires", country: "Argentina", name: "Ministro Pistarini International" },
  { code: "SCL", city: "Santiago", country: "Chile", name: "Arturo Merino Benítez International" },
  { code: "BOG", city: "Bogotá", country: "Colombia", name: "El Dorado International Airport" },

  // ==========================================
  // ASIA & OCEANIA
  // ==========================================
  { code: "HND", city: "Tokyo (Haneda)", country: "Japan", name: "Tokyo Haneda Airport" },
  { code: "NRT", city: "Tokyo (Narita)", country: "Japan", name: "Narita International Airport" },
  { code: "KIX", city: "Osaka", country: "Japan", name: "Kansai International Airport" },
  { code: "SIN", city: "Singapore", country: "Singapore", name: "Singapore Changi Airport" },
  { code: "HKG", city: "Hong Kong", country: "Hong Kong", name: "Hong Kong International Airport" },
  { code: "ICN", city: "Seoul", country: "South Korea", name: "Incheon International Airport" },
  { code: "BKK", city: "Bangkok", country: "Thailand", name: "Suvarnabhumi Airport" },
  { code: "HKT", city: "Phuket", country: "Thailand", name: "Phuket International Airport" },
  { code: "KUL", city: "Kuala Lumpur", country: "Malaysia", name: "Kuala Lumpur International" },
  { code: "DPS", city: "Bali (Denpasar)", country: "Indonesia", name: "Ngurah Rai International" },
  { code: "CGK", city: "Jakarta", country: "Indonesia", name: "Soekarno-Hatta International" },
  { code: "MNL", city: "Manila", country: "Philippines", name: "Ninoy Aquino International" },
  { code: "SGN", city: "Ho Chi Minh City", country: "Vietnam", name: "Tan Son Nhat International" },
  { code: "HAN", city: "Hanoi", country: "Vietnam", name: "Noi Bai International" },
  { code: "TPE", city: "Taipei", country: "Taiwan", name: "Taiwan Taoyuan International" },
  { code: "PEK", city: "Beijing (Capital)", country: "China", name: "Beijing Capital International" },
  { code: "PKX", city: "Beijing (Daxing)", country: "China", name: "Beijing Daxing International" },
  { code: "PVG", city: "Shanghai (Pudong)", country: "China", name: "Shanghai Pudong International" },
  { code: "CAN", city: "Guangzhou", country: "China", name: "Guangzhou Baiyun International" },
  { code: "SYD", city: "Sydney", country: "Australia", name: "Kingsford Smith Airport" },
  { code: "MEL", city: "Melbourne", country: "Australia", name: "Melbourne Airport" },
  { code: "BNE", city: "Brisbane", country: "Australia", name: "Brisbane Airport" },
  { code: "PER", city: "Perth", country: "Australia", name: "Perth Airport" },
  { code: "AKL", city: "Auckland", country: "New Zealand", name: "Auckland Airport" },
  { code: "MLE", city: "Malé", country: "Maldives", name: "Velana International Airport" },
  { code: "CMB", city: "Colombo", country: "Sri Lanka", name: "Bandaranaike International" },

  // ==========================================
  // AFRICA
  // ==========================================
  { code: "JNB", city: "Johannesburg", country: "South Africa", name: "O. R. Tambo International" },
  { code: "CPT", city: "Cape Town", country: "South Africa", name: "Cape Town International" },
  { code: "CAI", city: "Cairo", country: "Egypt", name: "Cairo International Airport" },
  { code: "CMN", city: "Casablanca", country: "Morocco", name: "Mohammed V International" },
  { code: "NBO", city: "Nairobi", country: "Kenya", name: "Jomo Kenyatta International" },
  { code: "SEZ", city: "Mahé", country: "Seychelles", name: "Seychelles International" },
  { code: "MRU", city: "Plaine Magnien", country: "Mauritius", name: "Sir Seewoosagur Ramgoolam Intl" },
];

const AIRPORT_COORDS = {
  // INDIA
  DEL: [28.5562, 77.1000],
  BOM: [19.0896, 72.8656],
  BLR: [13.1986, 77.7066],
  HYD: [17.2403, 78.4294],
  MAA: [12.9941, 80.1709],
  CCU: [22.6547, 88.4467],
  COK: [10.1518, 76.3929],
  AMD: [23.0772, 72.6347],
  GOI: [15.3800, 73.8314],
  GOX: [15.7672, 73.8647],
  TRV: [8.4821, 76.9200],
  CCJ: [11.1368, 75.9553],
  PNQ: [18.5822, 73.9197],
  JAI: [26.8242, 75.8122],
  LKO: [26.7606, 80.8893],
  ATQ: [31.7096, 74.7973],
  IXC: [30.6735, 76.7885],
  IXE: [12.9613, 74.8900],
  TRZ: [10.7654, 78.7097],
  BBI: [20.2444, 85.8178],
  GAU: [26.1061, 91.5859],
  CNN: [11.9167, 75.5492],
  VTZ: [17.7212, 83.2245],
  NAG: [21.0922, 79.0472],
  PAT: [25.5913, 85.0880],
  IDR: [22.7217, 75.8011],
  VNS: [25.4524, 82.8593],
  CJB: [11.0300, 77.0434],
  IXM: [9.8345, 78.0934],
  SXR: [33.9871, 74.7741],

  // MIDDLE EAST
  DXB: [25.2532, 55.3657],
  DWC: [24.8960, 55.1614],
  AUH: [24.4330, 54.6511],
  DOH: [25.2731, 51.6081],
  RUH: [24.9576, 46.6988],
  JED: [21.6796, 39.1565],
  MCT: [23.5933, 58.2844],
  KWI: [29.2266, 47.9789],
  BAH: [26.2708, 50.6336],

  // EUROPE
  LHR: [51.4700, -0.4543],
  LGW: [51.1537, -0.1821],
  CDG: [49.0097, 2.5479],
  ORY: [48.7262, 2.3652],
  FRA: [50.0379, 8.5622],
  MUC: [48.3537, 11.7860],
  AMS: [52.3105, 4.7683],
  ZRH: [47.4582, 8.5555],
  GVA: [46.2370, 6.1092],
  FCO: [41.8003, 12.2389],
  MXP: [45.6301, 8.7231],
  MAD: [40.4839, -3.5680],
  BCN: [41.2974, 2.0833],
  VIE: [48.1103, 16.5697],
  BRU: [50.9010, 4.4856],
  CPH: [55.6180, 12.6508],
  ARN: [59.6498, 17.9238],
  OSL: [60.1975, 11.1004],
  HEL: [60.3172, 24.9633],
  DUB: [53.4264, -6.2499],
  ATH: [37.9356, 23.9484],
  IST: [41.2753, 28.7519],
  LIS: [38.7742, -9.1342],

  // NORTH & SOUTH AMERICA
  JFK: [40.6413, -73.7781],
  EWR: [40.6895, -74.1745],
  LAX: [33.9416, -118.4085],
  SFO: [37.6213, -122.3790],
  ORD: [41.9742, -87.9073],
  MIA: [25.7959, -80.2870],
  DFW: [32.8998, -97.0403],
  ATL: [33.6407, -84.4277],
  SEA: [47.4502, -122.3088],
  BOS: [42.3656, -71.0096],
  LAS: [36.0840, -115.1537],
  YYZ: [43.6777, -79.6248],
  YVR: [49.1967, -123.1815],
  YUL: [45.4657, -73.7455],
  MEX: [19.4361, -99.0719],
  CUN: [21.0365, -86.8771],
  GRU: [-23.4356, -46.4731],
  GIG: [-22.8134, -43.2494],
  EZE: [-34.8150, -58.5348],
  SCL: [-33.3930, -70.7858],
  BOG: [4.7016, -74.1469],

  // ASIA & OCEANIA
  HND: [35.5494, 139.7798],
  NRT: [35.7720, 140.3929],
  KIX: [34.4320, 135.2304],
  SIN: [1.3644, 103.9915],
  HKG: [22.3080, 113.9185],
  ICN: [37.4602, 126.4407],
  BKK: [13.6900, 100.7501],
  HKT: [8.1132, 98.3169],
  KUL: [2.7456, 101.7099],
  DPS: [-8.7482, 115.1672],
  CGK: [-6.1275, 106.6537],
  MNL: [14.5086, 121.0194],
  SGN: [10.8188, 106.6518],
  HAN: [21.2212, 105.8072],
  TPE: [25.0797, 121.2342],
  PEK: [40.0799, 116.6031],
  PKX: [39.5098, 116.4105],
  PVG: [31.1443, 121.8083],
  CAN: [23.3924, 113.2988],
  SYD: [-33.9399, 151.1753],
  MEL: [-37.6690, 144.8410],
  BNE: [-27.3942, 153.1218],
  PER: [-31.9385, 115.9672],
  AKL: [-37.0082, 174.7850],
  MLE: [4.1918, 73.5290],
  CMB: [7.1808, 79.8841],

  // AFRICA
  JNB: [-26.1367, 28.2411],
  CPT: [-33.9715, 18.6021],
  CAI: [30.1219, 31.4056],
  CMN: [33.3675, -7.58997],
  NBO: [-1.3192, 36.9278],
  SEZ: [-4.6743, 55.5219],
  MRU: [-20.4302, 57.6836],
};

function getDistanceKm(code1, code2) {
  const c1 = AIRPORT_COORDS[code1] || [28.5562, 77.1000];
  const c2 = AIRPORT_COORDS[code2] || [35.5494, 139.7798];
  
  const R = 6371; // Earth radius in km
  const dLat = ((c2[0] - c1[0]) * Math.PI) / 180;
  const dLon = ((c2[1] - c1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1[0] * Math.PI) / 180) *
      Math.cos((c2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = Math.round(R * c);
  return dist < 200 ? 500 : dist;
}

function formatDurationFromDistance(distanceKm) {
  const hours = distanceKm / 820 + 0.5;
  const h = Math.floor(hours);
  const m = Math.round(((hours - h) * 60) / 5) * 5;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

function generateFlightsForRoute(originAirport, destAirport) {
  const dist = getDistanceKm(originAirport?.code, destAirport?.code);
  const durStr = formatDurationFromDistance(dist);
  
  const firstPrice = Math.max(750, Math.round((dist * 0.28 + 480) / 10) * 10);
  const businessPrice = Math.max(480, Math.round((dist * 0.19 + 290) / 10) * 10);
  const premiumPrice = Math.max(260, Math.round((dist * 0.11 + 150) / 10) * 10);
  const economyPrice = Math.max(120, Math.round((dist * 0.065 + 75) / 10) * 10);

  return [
    {
      id: "BY-882",
      airline: "Beyond Sovereign",
      aircraft: dist > 4000 ? "Boeing 787-9 Dreamliner" : "Airbus A321neo LR",
      departTime: "08:30 AM",
      arriveTime: "04:45 PM",
      duration: durStr,
      type: "Non-stop",
      price: firstPrice,
      seatsLeft: 4,
      cabin: "First Suite",
      amenities: ["Lie-flat Double Suite", "Michelin Multi-Course Dining", "High-speed Starlink Wi-Fi", "Private Chauffeur Service"],
      rating: 4.98,
    },
    {
      id: "BY-404",
      airline: "Beyond Skyliner",
      aircraft: dist > 4000 ? "Airbus A350-1000" : "Boeing 787-8 Dreamliner",
      departTime: "01:15 PM",
      arriveTime: "09:55 PM",
      duration: durStr,
      type: "Non-stop",
      price: businessPrice,
      seatsLeft: 7,
      cabin: "Business Club",
      amenities: ["180° Direct-Aisle Flatbed", "Sommelier Reserve Selection", "Bose Active Noise Cancelling", "Signature Sky Lounge Access"],
      rating: 4.95,
    },
    {
      id: "BY-619",
      airline: "Beyond JetClub",
      aircraft: "Airbus A330-900neo",
      departTime: "06:00 PM",
      arriveTime: "06:30 AM +1",
      duration: formatDurationFromDistance(dist * 1.25),
      type: dist > 3000 ? "1 Stop (DXB 1h 20m)" : "Non-stop",
      price: premiumPrice,
      seatsLeft: 12,
      cabin: "Premium Economy",
      amenities: ["40\" Pitch Recliner", "Chef Curated Hot Entrees", "Priority Check-in & Boarding", "60W Fast USB-C Charging"],
      rating: 4.89,
    },
    {
      id: "BY-210",
      airline: "Beyond Express",
      aircraft: dist > 5000 ? "Boeing 787-9 Dreamliner" : "Airbus A321XLR",
      departTime: "10:45 PM",
      arriveTime: "07:10 AM +1",
      duration: durStr,
      type: "Non-stop",
      price: economyPrice,
      seatsLeft: 19,
      cabin: "Economy",
      amenities: ["33\" Ergonomic Seating", "Complimentary High-Speed Wi-Fi", "4K Seatback Entertainment", "On-Demand Snack Pantry"],
      rating: 4.82,
    },
  ];
}

const featuredDestinations = [
  {
    city: "Tokyo",
    country: "Japan",
    code: "HND",
    price: "From $1,420",
    tag: "Popular",
    img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    desc: "Ancient shrines meet neon horizons and world-class culinary mastery.",
  },
  {
    city: "Zurich",
    country: "Switzerland",
    code: "ZRH",
    price: "From $1,280",
    tag: "Alpine Luxury",
    img: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80",
    desc: "Pristine mountain vistas, lakeside private chalets, and serene calm.",
  },
  {
    city: "Malé",
    country: "Maldives",
    code: "MLE",
    price: "From $1,890",
    tag: "Exclusive",
    img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    desc: "Overwater coral sanctuaries surrounded by turquoise lagoons.",
  },
  {
    city: "Paris",
    country: "France",
    code: "CDG",
    price: "From $1,150",
    tag: "Romantic",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    desc: "Haute couture ateliers, historic monuments, and evening Seine lights.",
  },
  {
    city: "Dubai",
    country: "UAE",
    code: "DXB",
    price: "From $1,340",
    tag: "Futuristic",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    desc: "Opulent desert resorts, cutting-edge skyline architecture, and gold souks.",
  },
  {
    city: "Singapore",
    country: "Singapore",
    code: "SIN",
    price: "From $1,510",
    tag: "Garden City",
    img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
    desc: "Biophilic architectural wonders, rooftop infinity pools, and vibrant culture.",
  },
];

export default function FlightSearch() {
  const [tripType, setTripType] = useState("round-trip");
  const [cabinClass, setCabinClass] = useState("First Suite");
  // EMPTY DEFAULTS - User enters their own values
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departDate, setDepartDate] = useState("");
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [showPassengerPicker, setShowPassengerPicker] = useState(false);
  const [showOriginPicker, setShowOriginPicker] = useState(false);
  const [showDestPicker, setShowDestPicker] = useState(false);
  const [originSearch, setOriginSearch] = useState("");
  const [destSearch, setDestSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [activeClassFilter, setActiveClassFilter] = useState("All");

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  const handleSearch = (e) => {
    e?.preventDefault();
    const currentOrigin = origin || popularAirports[0];
    const currentDest = destination || popularAirports[32]; // Tokyo HND
    const currentDate = departDate || "2026-10-15";

    if (!origin) setOrigin(currentOrigin);
    if (!destination) setDestination(currentDest);
    if (!departDate) setDepartDate(currentDate);

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
      setSearchResults(generateFlightsForRoute(currentOrigin, currentDest));
      const resultsEl = document.getElementById("search-results-section");
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 600);
  };

  const handleQuickDestinationSelect = (dest) => {
    const airport = popularAirports.find((a) => a.code === dest.code) || {
      code: dest.code,
      city: dest.city,
      country: dest.country,
      name: `${dest.city} International`,
    };
    const currentOrigin = origin || popularAirports[3]; // Default to Hyderabad HYD or Delhi DEL
    if (!origin) {
      setOrigin(currentOrigin);
    }
    setDestination(airport);
    if (!departDate) {
      setDepartDate("2026-10-15");
    }
    setHasSearched(true);
    setSearchResults(generateFlightsForRoute(currentOrigin, airport));
    const searchFormEl = document.getElementById("flight-search-form");
    if (searchFormEl) {
      searchFormEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleConfirmBooking = () => {
    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setSelectedFlight(null);
    }, 2800);
  };

  const filteredOriginAirports = popularAirports.filter(
    (a) =>
      a.city.toLowerCase().includes(originSearch.toLowerCase()) ||
      a.code.toLowerCase().includes(originSearch.toLowerCase()) ||
      a.name.toLowerCase().includes(originSearch.toLowerCase()) ||
      a.country.toLowerCase().includes(originSearch.toLowerCase())
  );

  const filteredDestAirports = popularAirports.filter(
    (a) =>
      a.city.toLowerCase().includes(destSearch.toLowerCase()) ||
      a.code.toLowerCase().includes(destSearch.toLowerCase()) ||
      a.name.toLowerCase().includes(destSearch.toLowerCase()) ||
      a.country.toLowerCase().includes(destSearch.toLowerCase())
  );

  const displayedFlights = activeClassFilter === "All"
    ? searchResults
    : searchResults.filter((f) => f.cabin === activeClassFilter);

  // Format date for display
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "Select Date";
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="flight-search-section" className="relative z-20 w-full px-6 py-20 text-[#ffffff] md:px-10 lg:py-28 xl:px-14">
      <div className="relative z-20 mx-auto max-w-[1400px]">
        {/* SECTION HEADER */}
        <div className="mb-10 text-center md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 shadow-md backdrop-blur-xl"
          >
            <Sparkles size={12} className="text-white" />
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.32em] text-slate-200">
              Global Flight Search
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[34px] font-semibold tracking-[-0.04em] text-white sm:text-[44px] md:text-[52px]"
          >
            Where does your journey take you?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-3 max-w-[620px] text-[14px] leading-relaxed text-slate-200/80 sm:text-[15px]"
          >
            Discover seamless reservations across 500+ premier international routes with lie-flat private suites, concierge assistance, and bespoke in-flight hospitality.
          </motion.p>
        </div>

        {/* MAIN LUXURY FLIGHT SEARCH CARD */}
        <motion.div
          id="flight-search-form"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="relative z-30 rounded-3xl border border-white/20 bg-[#091524]/90 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.75)] backdrop-blur-2xl md:p-8"
        >
          {/* TOP CONTROLS: TRIP TYPE & CABIN CLASS */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            {/* TRIP TYPE TABS */}
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {[
                { id: "round-trip", label: "Round Trip" },
                { id: "one-way", label: "One Way" },
                { id: "multi-city", label: "Multi-City" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTripType(tab.id)}
                  className={`relative rounded-full px-4 py-2 text-[12px] font-semibold transition-all duration-300 ${
                    tripType === tab.id
                      ? "text-[#091524] shadow-md"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {tripType === tab.id && (
                    <motion.div
                      layoutId="searchTabActiveMain"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-white"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* CABIN CLASS SELECTOR */}
            <div className="flex items-center gap-2">
              <span className="text-[11.5px] font-medium uppercase tracking-wider text-white/60">Cabin:</span>
              <div className="flex items-center gap-1">
                {["First Suite", "Business Club", "Premium Economy", "Economy"].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCabinClass(c);
                      setActiveClassFilter(c);
                    }}
                    className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-all ${
                      cabinClass === c
                        ? "border border-white/40 bg-white/20 text-white shadow-sm"
                        : "border border-transparent bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN INPUTS ROW */}
          <form onSubmit={handleSearch} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_auto_1.3fr_1.1fr_1.1fr_auto] lg:items-center">
            {/* ORIGIN AIRPORT */}
            <div className="relative z-40">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Departure From
              </label>
              <div
                onClick={() => {
                  setShowOriginPicker(!showOriginPicker);
                  setShowDestPicker(false);
                  setShowDatePicker(false);
                  setShowPassengerPicker(false);
                }}
                className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/15 bg-white/[0.05] p-3.5 transition-all hover:border-white/40 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Plane size={18} className="-rotate-45" />
                  </div>
                  <div>
                    {origin ? (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[18px] font-bold text-white">{origin.code}</span>
                          <span className="text-[13px] font-medium text-slate-100">{origin.city}</span>
                        </div>
                        <div className="truncate text-[10.5px] text-white/60">{origin.name}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-[14px] font-semibold text-white/70">Departure Airport</div>
                        <div className="text-[10.5px] text-white/40">Select departure city</div>
                      </>
                    )}
                  </div>
                </div>
                <ChevronDown size={14} className="text-white/60 transition-transform group-hover:translate-y-0.5" />
              </div>

              {/* ORIGIN DROPDOWN */}
              <AnimatePresence>
                {showOriginPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    onWheel={(e) => e.stopPropagation()}
                    className="absolute left-0 top-[105%] z-[100] w-full min-w-[300px] rounded-2xl border border-white/20 bg-[#091524] p-3 shadow-2xl backdrop-blur-2xl"
                  >
                    <input
                      type="text"
                      placeholder="Search Indian or World airports (e.g. Hyderabad, DEL, LHR)..."
                      value={originSearch}
                      onChange={(e) => setOriginSearch(e.target.value)}
                      className="mb-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[12px] text-white outline-none focus:border-white/50"
                      autoFocus
                    />
                    <div
                      onWheel={(e) => e.stopPropagation()}
                      className="max-h-60 overflow-y-auto space-y-1 pr-1 overscroll-contain"
                    >
                      {filteredOriginAirports.map((airport) => (
                        <button
                          type="button"
                          key={airport.code}
                          onClick={() => {
                            setOrigin(airport);
                            setShowOriginPicker(false);
                            setOriginSearch("");
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${
                            origin?.code === airport.code ? "bg-white/20 text-white font-semibold" : "hover:bg-white/10 text-slate-200"
                          }`}
                        >
                          <div>
                            <div className="text-[12.5px] font-semibold text-white">
                              {airport.city} ({airport.code})
                            </div>
                            <div className="text-[10px] text-white/60">{airport.name} · {airport.country}</div>
                          </div>
                          {origin?.code === airport.code && <Check size={14} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SWAP BUTTON */}
            <div className="flex items-center justify-center pt-5">
              <motion.button
                type="button"
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.35 }}
                onClick={swapLocations}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-md transition-colors hover:border-white hover:bg-white hover:text-[#091524]"
                aria-label="Swap departure and destination"
              >
                <ArrowLeftRight size={15} />
              </motion.button>
            </div>

            {/* DESTINATION AIRPORT */}
            <div className="relative z-40">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Arrival Destination
              </label>
              <div
                onClick={() => {
                  setShowDestPicker(!showDestPicker);
                  setShowOriginPicker(false);
                  setShowDatePicker(false);
                  setShowPassengerPicker(false);
                }}
                className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/15 bg-white/[0.05] p-3.5 transition-all hover:border-white/40 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                    <MapPin size={18} />
                  </div>
                  <div>
                    {destination ? (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[18px] font-bold text-white">{destination.code}</span>
                          <span className="text-[13px] font-medium text-slate-100">{destination.city}</span>
                        </div>
                        <div className="truncate text-[10.5px] text-white/60">{destination.name}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-[14px] font-semibold text-white/70">Destination Airport</div>
                        <div className="text-[10.5px] text-white/40">Select arrival city</div>
                      </>
                    )}
                  </div>
                </div>
                <ChevronDown size={14} className="text-white/60 transition-transform group-hover:translate-y-0.5" />
              </div>

              {/* DESTINATION DROPDOWN */}
              <AnimatePresence>
                {showDestPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    onWheel={(e) => e.stopPropagation()}
                    className="absolute left-0 top-[105%] z-[100] w-full min-w-[300px] rounded-2xl border border-white/20 bg-[#091524] p-3 shadow-2xl backdrop-blur-2xl"
                  >
                    <input
                      type="text"
                      placeholder="Search destination (e.g. Tokyo, Dubai, London, Zurich)..."
                      value={destSearch}
                      onChange={(e) => setDestSearch(e.target.value)}
                      className="mb-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[12px] text-white outline-none focus:border-white/50"
                      autoFocus
                    />
                    <div
                      onWheel={(e) => e.stopPropagation()}
                      className="max-h-60 overflow-y-auto space-y-1 pr-1 overscroll-contain"
                    >
                      {filteredDestAirports.map((airport) => (
                        <button
                          type="button"
                          key={airport.code}
                          onClick={() => {
                            setDestination(airport);
                            setShowDestPicker(false);
                            setDestSearch("");
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${
                            destination?.code === airport.code ? "bg-white/20 text-white font-semibold" : "hover:bg-white/10 text-slate-200"
                          }`}
                        >
                          <div>
                            <div className="text-[12.5px] font-semibold text-white">
                              {airport.city} ({airport.code})
                            </div>
                            <div className="text-[10px] text-white/60">{airport.name} · {airport.country}</div>
                          </div>
                          {destination?.code === airport.code && <Check size={14} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DATES PICKER WITH 21ST.DEV GLASS CALENDAR */}
            <div className="relative z-40">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Departure Date
              </label>
              <div
                onClick={() => {
                  setShowDatePicker(!showDatePicker);
                  setShowOriginPicker(false);
                  setShowDestPicker(false);
                  setShowPassengerPicker(false);
                }}
                className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/15 bg-white/[0.05] p-3.5 transition-all hover:border-white/40 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarIcon size={18} className="text-white" />
                  <div>
                    <div className="text-[13.5px] font-semibold text-white">
                      {departDate ? formatDisplayDate(departDate) : "Select Date"}
                    </div>
                    <div className="text-[10px] text-white/60">
                      {departDate ? "Flexible Departure" : "Choose flight date"}
                    </div>
                  </div>
                </div>
                <ChevronDown size={14} className="text-white/60 transition-transform group-hover:translate-y-0.5" />
              </div>

              {/* GLASS CALENDAR POPUP */}
              <AnimatePresence>
                {showDatePicker && (
                  <GlassCalendar
                    selectedDate={departDate}
                    onSelect={(d) => {
                      setDepartDate(d);
                      setShowDatePicker(false);
                    }}
                    onClose={() => setShowDatePicker(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* PASSENGERS PICKER */}
            <div className="relative z-40">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Travelers
              </label>
              <div
                onClick={() => {
                  setShowPassengerPicker(!showPassengerPicker);
                  setShowOriginPicker(false);
                  setShowDestPicker(false);
                  setShowDatePicker(false);
                }}
                className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/15 bg-white/[0.05] p-3.5 transition-all hover:border-white/40 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-2.5">
                  <Users size={18} className="text-white" />
                  <div>
                    <div className="text-[13.5px] font-semibold text-white">
                      {totalPassengers} Traveler{totalPassengers > 1 ? "s" : ""}
                    </div>
                    <div className="text-[10px] text-white/60">{cabinClass}</div>
                  </div>
                </div>
                <ChevronDown size={14} className="text-white/60 transition-transform group-hover:translate-y-0.5" />
              </div>

              {/* PASSENGER MODAL POPUP */}
              <AnimatePresence>
                {showPassengerPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    onWheel={(e) => e.stopPropagation()}
                    className="absolute right-0 top-[105%] z-[100] w-64 rounded-2xl border border-white/20 bg-[#091524] p-4 shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="space-y-3">
                      {/* ADULTS */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[12.5px] font-semibold text-white">Adults</div>
                          <div className="text-[10px] text-white/60">Age 12+</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPassengers((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white hover:border-white"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-[13px] font-semibold text-white">{passengers.adults}</span>
                          <button
                            type="button"
                            onClick={() => setPassengers((p) => ({ ...p, adults: p.adults + 1 }))}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white hover:border-white"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* CHILDREN */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-3">
                        <div>
                          <div className="text-[12.5px] font-semibold text-white">Children</div>
                          <div className="text-[10px] text-white/60">Age 2-11</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPassengers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white hover:border-white"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-[13px] font-semibold text-white">{passengers.children}</span>
                          <button
                            type="button"
                            onClick={() => setPassengers((p) => ({ ...p, children: p.children + 1 }))}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white hover:border-white"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* DONE BUTTON */}
                      <button
                        type="button"
                        onClick={() => setShowPassengerPicker(false)}
                        className="mt-2 w-full rounded-xl bg-white py-2 text-[12px] font-bold text-[#091524] shadow-md hover:bg-slate-100"
                      >
                        Apply
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SEARCH BUTTON */}
            <div className="pt-5 sm:col-span-2 lg:col-span-1">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isSearching}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/30 bg-white px-6 py-4 text-[13.5px] font-bold text-[#091524] shadow-[0_10px_30px_rgba(255,255,255,0.25)] transition-all hover:bg-slate-100 disabled:opacity-70"
              >
                {isSearching ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#091524] border-t-transparent" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search size={16} strokeWidth={2.4} />
                    <span>Search</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* PERKS ROW */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-[11.5px] text-slate-200/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Complimentary private limousine transfers for Suites</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={13} className="text-sky-400" />
              <span>Zero cancellation fees up to 24h before departure</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-white" />
              <span>100% Sustainable Aviation Fuel (SAF) contribution</span>
            </div>
          </div>
        </motion.div>

        {/* SEARCH RESULTS DISPLAY SECTION */}
        <div id="search-results-section" className="mt-14">
          {hasSearched && searchResults.length > 0 ? (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.25em] text-white/70">
                    <Sparkles size={12} />
                    Live Curated Routes
                  </div>
                  <h3 className="text-[24px] font-bold text-white sm:text-[28px]">
                    Available Flights: {origin?.city || "New Delhi"} ({origin?.code || "DEL"}) → {destination?.city || "Tokyo"} ({destination?.code || "HND"})
                  </h3>
                </div>

                {/* CLASS FILTER TABS */}
                <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1">
                  {["All", "First Suite", "Business Club", "Premium Economy", "Economy"].map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setActiveClassFilter(cls)}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                        activeClassFilter === cls
                          ? "bg-white text-[#091524] shadow-sm"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {displayedFlights.map((flight, idx) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-r from-white/[0.06] via-[#091524]/80 to-white/[0.03] p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:shadow-[0_12px_40px_rgba(255,255,255,0.1)] md:p-6"
                  >
                    <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.4fr_1.8fr_1fr]">
                      {/* AIRLINE & FLIGHT INFO */}
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white">
                          <Plane size={22} className="-rotate-45" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-bold text-white">{flight.airline}</span>
                            <span className="rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 text-[9.5px] font-semibold text-white">
                              {flight.id}
                            </span>
                            <span className="rounded-md border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[9.5px] font-bold text-cyan-300">
                              {flight.cabin}
                            </span>
                          </div>
                          <div className="text-[11.5px] text-slate-300">{flight.aircraft}</div>
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-300">
                            <Star size={11} className="fill-amber-300" />
                            <span>{flight.rating} Service Rating</span>
                          </div>
                        </div>
                      </div>

                      {/* TIMINGS & ROUTE */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-left">
                          <div className="text-[18px] font-bold text-white">{flight.departTime}</div>
                          <div className="text-[12px] font-medium text-slate-200">{origin?.code || "DEL"}</div>
                          <div className="text-[10px] text-white/60">{origin?.city || "New Delhi"}</div>
                        </div>

                        <div className="flex flex-1 flex-col items-center px-4">
                          <div className="flex items-center gap-1 text-[10.5px] font-medium text-slate-200">
                            <Clock size={11} />
                            <span>{flight.duration}</span>
                          </div>
                          {/* FLIGHT PATH LINE */}
                          <div className="relative my-2 w-full">
                            <div className="h-[2px] w-full bg-gradient-to-r from-white/20 via-white to-white/20" />
                            <Plane size={13} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                          </div>
                          <span className="text-[10px] font-medium text-emerald-400">{flight.type}</span>
                        </div>

                        <div className="text-right">
                          <div className="text-[18px] font-bold text-white">{flight.arriveTime}</div>
                          <div className="text-[12px] font-medium text-slate-200">{destination?.code || "HND"}</div>
                          <div className="text-[10px] text-white/60">{destination?.city || "Tokyo"}</div>
                        </div>
                      </div>

                      {/* PRICE & SELECT CTA */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-4 lg:flex-col lg:items-end lg:justify-center lg:border-t-0 lg:pt-0">
                        <div className="lg:text-right">
                          <div className="text-[9.5px] font-semibold uppercase tracking-wider text-white/60">Total Fare</div>
                          <div className="text-[24px] font-bold text-white">${flight.price.toLocaleString()}</div>
                          <div className="text-[10px] text-emerald-400">{flight.seatsLeft} seats available</div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setSelectedFlight(flight)}
                          className="mt-2 rounded-full border border-white/30 bg-white px-5 py-2 text-[12px] font-bold text-[#091524] shadow-md hover:bg-slate-100"
                        >
                          Select Seat
                        </motion.button>
                      </div>
                    </div>

                    {/* AMENITIES PILLS */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Included:</span>
                      {flight.amenities.map((amenity, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] text-slate-200"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-white/15 bg-[#091524]/60 p-8 text-center backdrop-blur-xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <Plane size={22} className="-rotate-45" />
              </div>
              <h3 className="mt-3 text-[18px] font-bold text-white">Ready for departure?</h3>
              <p className="mx-auto mt-1 max-w-md text-[13px] text-slate-300">
                Enter your departure airport, arrival destination, and travel date above to view live luxury flight schedules, or pick a destination from our global portfolio below.
              </p>
            </div>
          )}
        </div>

        {/* CURATED POPULAR DESTINATIONS GRID */}
        <div id="destinations-section" className="mt-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.3em] text-white/70">
                <Flame size={13} />
                Global Portfolio
              </div>
              <h3 className="mt-1 text-[28px] font-semibold text-white sm:text-[34px]">
                Iconic Destinations
              </h3>
            </div>
            <p className="hidden max-w-sm text-right text-[12.5px] text-white/70 sm:block">
              Click any destination to auto-configure your flight itinerary instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDestinations.map((dest, i) => (
              <motion.div
                key={dest.city}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                onClick={() => handleQuickDestinationSelect(dest)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/15 bg-[#091524]/90 shadow-lg transition-all duration-300 hover:border-white/40 hover:shadow-[0_15px_45px_rgba(255,255,255,0.12)]"
              >
                {/* IMAGE */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={dest.img}
                    alt={dest.city}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091524] via-[#091524]/30 to-transparent" />
                  
                  {/* TAG BADGE */}
                  <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                    {dest.tag}
                  </div>

                  {/* PRICE BADGE */}
                  <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                    {dest.price}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[19px] font-bold text-white">{dest.city}</h4>
                      <p className="text-[11.5px] text-white/70">{dest.country} · {dest.code}</p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all group-hover:bg-white group-hover:text-[#091524]">
                      <Plane size={14} className="-rotate-45" />
                    </span>
                  </div>
                  <p className="mt-2.5 text-[12px] leading-relaxed text-slate-300">
                    {dest.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* MULTI-STEP LUXURY BOOKING EXPERIENCE MODAL (SEAT MAP -> GUEST DETAILS -> PAYMENT -> SUCCESS) */}
      <BookingModal
        isOpen={Boolean(selectedFlight)}
        onClose={() => setSelectedFlight(null)}
        flight={selectedFlight}
        origin={origin || popularAirports[0]}
        destination={destination || popularAirports[32]}
        departDate={departDate || "2026-10-15"}
        totalPassengers={totalPassengers}
      />
    </section>
  );
}
