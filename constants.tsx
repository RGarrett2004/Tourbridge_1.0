
import { MarkerType, LocationPoint, EventListing, UserProfile, ApprovalRequest, ConnectionRequest, TourDay, Tour, BandProfile, TourInvitation, RoleType, UserAccount } from './types';

export const COLORS = {
  VENUE: '#ef4444',
  HOST: '#10b981',
  PRO: '#3b82f6',
  CREATOR: '#a855f7',
  BAND: '#f59e0b',
  PROMOTER: '#ec4899',
  CERTIFIED: '#eab308'
};

// 1. DEFINING THE ORGANIZATION
export const MOCK_BANDS: BandProfile[] = [
  {
    id: 'band_1',
    name: 'The Demo Band',
    bio: 'A high-energy alternative rock band touring the East Coast.',
    genre: 'Alt Rock',
    ownerId: 'u-demo-1',
    avatar: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=200&h=200',
    members: [
      { userId: 'u-demo-1', role: 'Guitar', permissions: ['TOUR_OPS', 'MERCH'] },
      { userId: 'u-demo-2', role: 'Drums', permissions: [] }
    ]
  },
  {
    id: 'band_2',
    name: 'Neon Horizon',
    bio: 'Synth-pop duo with a retro flair.',
    genre: 'Synth Pop',
    ownerId: 'u-demo-3',
    avatar: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=200&h=200',
    members: []
  }
];

// 2. DEFINING THE CURRENT USER
export const CURRENT_USER: UserProfile | null = null;

// 3. DEFINING ACCOUNTS FOR SWITCHER
// User requested these be removed/empty.
export const MOCK_ACCOUNTS: UserAccount[] = [];

// 4. MOCK TOURS (Functionality Data)
export const MOCK_TOURS: Tour[] = [
  {
    id: 't-1',
    name: 'Spring Run 2026',
    ownerId: 'band_1',
    startDate: '2026-03-01',
    endDate: '2026-03-20',
    status: 'ACTIVE',
    budget: { items: [] },
    members: [],
    days: [
      {
        id: 'd-1',
        date: '2026-03-05',
        status: 'SHOW',
        cityName: 'Chicago',
        state: 'IL',
        venueName: 'The Empty Bottle',
        schedule: [
          { id: 's-1', time: '16:00', activity: 'Load In', isCritical: true },
          { id: 's-2', time: '19:00', activity: 'Doors' },
          { id: 's-3', time: '21:15', activity: 'Set Time', isCritical: true }
        ],
        travel: {
          origin: 'Cleveland, OH',
          destination: 'Chicago, IL',
          miles: 345,
          driveTime: '5h 30m',
          busCall: '09:00',
          vehicleName: 'Van'
        }
      },
      {
        id: 'd-2',
        date: '2026-03-06',
        status: 'TRAVEL',
        cityName: 'Milwaukee',
        state: 'WI',
        schedule: [],
        notes: 'Day off in Milwaukee. Laundry day.'
      }
    ]
  }
];

// 5. MOCK POINTS (Venue Data)
export const MOCK_POINTS: LocationPoint[] = [
  {
    id: 'p-1',
    type: MarkerType.VENUE,
    name: 'The Empty Bottle',
    lat: 41.9008,
    lng: -87.6873,
    address: '1035 N Western Ave, Chicago, IL 60622',
    description: 'Legendary indie rock venue with great sound.',
    avgRating: 4.8,
    reviews: [],
    isCertified: true,
    category: 'Music Venue'
  },
  {
    id: 'p-2',
    type: MarkerType.VENUE,
    name: 'First Avenue',
    lat: 44.9790,
    lng: -93.2728,
    address: '701 N 1st Ave, Minneapolis, MN 55403',
    description: 'Historic venue, Prince\'s home club.',
    avgRating: 4.9,
    reviews: [],
    isCertified: true,
    category: 'Music Venue'
  },
  {
    id: 'p-3',
    type: MarkerType.HOST,
    name: 'Sarah\'s Guest House',
    lat: 41.9200,
    lng: -87.6500,
    address: 'Lincoln Park, Chicago',
    description: 'Band friendly host with spare room and parking.',
    avgRating: 5.0,
    reviews: [],
    category: 'Host'
  }
];

export const MOCK_INVITATIONS: TourInvitation[] = [
  {
    id: 'inv-1',
    tourId: 't-1',
    tourName: 'Spring Run 2026',
    inviterName: 'The Demo Band',
    role: 'Photographer',
    status: 'PENDING'
  }
];

export const MOCK_EVENTS: EventListing[] = [];
export const MOCK_APPROVALS: ApprovalRequest[] = [];
export const MOCK_BRIDGE_REQUESTS: ConnectionRequest[] = [];
export const MOCK_NETWORK_USERS: UserProfile[] = [];

export const MOCK_MESSAGES: Record<string, any[]> = {};

// ==========================================
// HIDDEN ADMIN DATA
// ==========================================

export const ADMIN_BANDS: BandProfile[] = [];

export const US_STATE_TAX_RATES: Record<string, number> = {
  'AL': 4.00, 'AK': 0.00, 'AZ': 5.60, 'AR': 6.50, 'CA': 7.25, 'CO': 2.90, 'CT': 6.35, 'DE': 0.00, 'FL': 6.00, 'GA': 4.00,
  'HI': 4.00, 'ID': 6.00, 'IL': 6.25, 'IN': 7.00, 'IA': 6.00, 'KS': 6.50, 'KY': 6.00, 'LA': 4.45, 'ME': 5.50, 'MD': 6.00,
  'MA': 6.25, 'MI': 6.00, 'MN': 6.88, 'MS': 7.00, 'MO': 4.23, 'MT': 0.00, 'NE': 5.50, 'NV': 6.85, 'NH': 0.00, 'NJ': 6.63,
  'NM': 5.13, 'NY': 4.00, 'NC': 4.75, 'ND': 5.00, 'OH': 5.75, 'OK': 4.50, 'OR': 0.00, 'PA': 6.00, 'RI': 7.00, 'SC': 6.00,
  'SD': 4.50, 'TN': 7.00, 'TX': 6.25, 'UT': 6.10, 'VT': 6.00, 'VA': 5.30, 'WA': 6.50, 'WV': 6.00, 'WI': 5.00, 'WY': 4.00,
  'DC': 6.00
};

export const ADMIN_USER: UserProfile | null = null;
export const ADMIN_ACCOUNT: UserAccount | null = null;
export const ADMIN_TOURS: Tour[] = [];
