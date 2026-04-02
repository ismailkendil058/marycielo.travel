// Local storage based data store (replace with Supabase later)

export interface Service {
  id: string;
  name_fr: string;
  name_ar: string;
  slug: string;
  cover_image_url: string;
}

export interface Destination {
  id: string;
  name_fr: string;
  name_ar: string;
  service_id: string;
  description_fr: string;
  description_ar: string;
  images: string[];
  created_at: string;
}

export interface Booking {
  id: string;
  full_name: string;
  phone: string;
  service: string;
  destination: string;
  created_at: string;
  contacted: boolean;
}

const DEFAULT_SERVICES: Service[] = [
  { id: '1', name_fr: 'Visa', name_ar: 'تأشيرة', slug: 'visa', cover_image_url: '' },
  { id: '2', name_fr: 'Billetterie', name_ar: 'حجز التذاكر', slug: 'billetterie', cover_image_url: '' },
  { id: '3', name_fr: 'Omra', name_ar: 'عمرة', slug: 'omra', cover_image_url: '' },
  { id: '4', name_fr: 'Voyage à la Carte', name_ar: 'رحلة حسب الطلب', slug: 'voyage-a-la-carte', cover_image_url: '' },
  { id: '5', name_fr: 'Voyage Organisé', name_ar: 'رحلة منظمة', slug: 'voyage-organise', cover_image_url: '' },
];

const DEFAULT_DESTINATIONS: Destination[] = [
  {
    id: '1', name_fr: 'Istanbul', name_ar: 'إسطنبول', service_id: '5',
    description_fr: 'Découvrez la magie d\'Istanbul, entre Orient et Occident. Visitez la Mosquée Bleue, le Grand Bazar et savourez la cuisine turque authentique.',
    description_ar: 'اكتشف سحر إسطنبول، بين الشرق والغرب.',
    images: ['https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80'], created_at: new Date().toISOString(),
  },
  {
    id: '2', name_fr: 'La Mecque', name_ar: 'مكة المكرمة', service_id: '3',
    description_fr: 'Accomplissez votre Omra dans les meilleures conditions avec notre accompagnement personnalisé.',
    description_ar: 'أدِّ عمرتك في أفضل الظروف مع مرافقتنا الشخصية.',
    images: ['https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80'], created_at: new Date().toISOString(),
  },
  {
    id: '3', name_fr: 'Paris', name_ar: 'باريس', service_id: '1',
    description_fr: 'Obtenez votre visa pour la France avec notre service rapide et fiable.',
    description_ar: 'احصل على تأشيرتك لفرنسا مع خدمتنا السريعة والموثوقة.',
    images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80'], created_at: new Date().toISOString(),
  },
  {
    id: '4', name_fr: 'Dubaï', name_ar: 'دبي', service_id: '4',
    description_fr: 'Créez votre voyage sur mesure à Dubaï — luxe, aventure et détente.',
    description_ar: 'صمّم رحلتك المخصصة إلى دبي — فخامة ومغامرة واسترخاء.',
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80'], created_at: new Date().toISOString(),
  },
];

function getItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Services
export function getServices(): Service[] {
  return getItem('mc_services', DEFAULT_SERVICES);
}

export function updateService(service: Service) {
  const services = getServices();
  const idx = services.findIndex(s => s.id === service.id);
  if (idx >= 0) services[idx] = service;
  setItem('mc_services', services);
}

// Destinations
export function getDestinations(): Destination[] {
  return getItem('mc_destinations', DEFAULT_DESTINATIONS);
}

export function getDestinationsByService(serviceId: string): Destination[] {
  return getDestinations().filter(d => d.service_id === serviceId);
}

export function getDestinationById(id: string): Destination | undefined {
  return getDestinations().find(d => d.id === id);
}

export function addDestination(dest: Omit<Destination, 'id' | 'created_at'>) {
  const destinations = getDestinations();
  const newDest: Destination = {
    ...dest,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  };
  destinations.push(newDest);
  setItem('mc_destinations', destinations);
  return newDest;
}

export function updateDestination(dest: Destination) {
  const destinations = getDestinations();
  const idx = destinations.findIndex(d => d.id === dest.id);
  if (idx >= 0) destinations[idx] = dest;
  setItem('mc_destinations', destinations);
}

export function deleteDestination(id: string) {
  const destinations = getDestinations().filter(d => d.id !== id);
  setItem('mc_destinations', destinations);
}

// Bookings
export function getBookings(): Booking[] {
  return getItem('mc_bookings', []);
}

export function addBooking(booking: Omit<Booking, 'id' | 'created_at' | 'contacted'>) {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    contacted: false,
  };
  bookings.unshift(newBooking);
  setItem('mc_bookings', bookings);
  return newBooking;
}

export function markBookingContacted(id: string) {
  const bookings = getBookings();
  const idx = bookings.findIndex(b => b.id === id);
  if (idx >= 0) bookings[idx].contacted = true;
  setItem('mc_bookings', bookings);
}
