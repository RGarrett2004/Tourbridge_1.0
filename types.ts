

export enum MarkerType {
  VENUE = 'VENUE',
  HOST = 'HOST',
  PRO = 'PRO',
  CREATOR = 'CREATOR',
  BAND = 'BAND',
  PROMOTER = 'PROMOTER'
}

export type TourDayStatus = 'SHOW' | 'TRAVEL' | 'OFF';

export enum RoleType {
  ADMIN = 'ADMIN',
  PROMOTER = 'PROMOTER',
  TOUR_MANAGER = 'TOUR_MANAGER',
  BAND_MEMBER = 'BAND_MEMBER',
  CREATOR = 'CREATOR',
  HOST = 'HOST'
}

export interface PermissionTag {
  id: string;
  label: string;
  type: RoleType;
  affiliation?: string;
  color: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  TOUR_MANAGER = 'TOUR_MANAGER',
  BAND_MEMBER = 'BAND_MEMBER',
  MERCH = 'MERCH',
  MEDIA = 'MEDIA',
  PRODUCTION = 'PRODUCTION',
  GUEST = 'GUEST'
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string; // Display role label (e.g. "Drummer")
  roles?: UserRole[]; // System roles
  isGoogleLinked?: boolean;
  type?: 'PERSON' | 'ORGANIZATION';
  careerLevel?: string; // e.g. 'STARTER', 'WORKING', 'TOURING'
}

export interface PayoutRule {
  id: string;
  recipientId: string; // UserAccount.id matches
  recipientName: string;
  type: 'PERCENTAGE' | 'FLAT_RATE';
  value: number; // e.g. 20 (percent) or 250 (dollars)
  roleLabel: string; // e.g. "Drummer"
}

export interface Transaction {
  id: string;
  date: string; // ISO String
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'PAYOUT';
  category: string; // e.g. "Gig Deposit", "Merch", "Salary"
  from: string;
  to: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface BankConnection {
  id: string;
  provider: 'STRIPE' | 'PLAID' | 'MANUAL';
  bankName: string;
  last4: string;
  balance: number;
  status: 'CONNECTED' | 'DISCONNECTED';
}

export interface AdvancementStatus {
  techAdvance: 'PENDING' | 'CONFIRMED' | 'SENT';
  lodgingAdvance: 'PENDING' | 'CONFIRMED' | 'SENT';
  marketingAdvance: 'PENDING' | 'CONFIRMED' | 'SENT';
}

export interface TourDayAsset {
  id: string;
  url: string;
  label: string;
  type: 'IMAGE' | 'VIDEO';
  category: 'STAGE_PLOT' | 'PARKING' | 'PRODUCTION' | 'LOAD_IN' | 'PROMO_VIDEO' | 'OTHER';
}

export interface TourDay {
  id: string;
  date: string;
  status: TourDayStatus;
  cityName: string;
  state: string;
  venueId?: string;
  venueName?: string;
  schedule: ScheduleItem[];
  travel?: TravelLogistics;
  lodging?: LodgingInfo;
  notes?: string;
  assets?: TourDayAsset[];
  weather?: string;
  advancement?: AdvancementStatus;
}

export interface Tour {
  id: string;
  name: string;
  ownerId: string; // This links the tour to a BandProfile.id
  startDate: string;
  endDate: string;
  days: TourDay[];
  budget: TourBudget;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED';
  members: TourMember[];
}

export interface VaultItem {
  id: string;
  name: string;
  category: 'LEGAL' | 'MEDICAL' | 'PRODUCTION' | 'CONTENT' | 'FINANCE' | 'CERTS';
  uploadDate: string;
  status: 'VALID' | 'EXPIRED' | 'PENDING';
  size?: string;
  url?: string;
  description?: string;
}

// FIX: Added PromoVideo interface
export interface PromoVideo {
  id: string;
  name: string;
  url: string;
  type: string;
  date: string;
}

export interface OnboardingStep {
  id: string;
  label: string;
  isComplete: boolean;
  category: 'SETUP' | 'LEGAL' | 'CREW';
  action?: string;
}

// ... rest of the existing types remain same ...
export interface ScheduleItem { id: string; time: string; activity: string; details?: string; isCritical?: boolean; }
export interface TravelLogistics { origin: string; destination: string; miles: number; driveTime: string; busCall: string; vehicleName: string; }
export interface LodgingInfo { hotelName: string; address: string; phone: string; confirmation: string; checkIn: string; roomCount: number; }
export interface BudgetItem { id: string; category: string; amount: number; type: 'INCOME' | 'EXPENSE'; mode: 'ESTIMATED' | 'RECORDED'; description: string; date?: string; }
export interface TourBudget { items: BudgetItem[]; }
export type SizeKey = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'OS';
export interface MerchItem { id: string; name: string; category: string; costPrice: number; salePrice: number; stock: Record<SizeKey, number>; reorderLevel: number; imageUrl?: string; }
export type PaymentMethod = 'CASH' | 'VENMO' | 'CARD';
export interface MerchSale { id: string; itemId: string; itemName: string; size: SizeKey; quantity: number; totalAmount: number; paymentMethod: PaymentMethod; timestamp: string; orderId: string; tourDayId: string; source: 'MANUAL' | 'SQUARE' | 'API'; discountType?: 'NONE' | 'HALF' | 'CREW' | 'COMP'; }
export interface TourMember { userId: string; name: string; role: string; avatar: string; status: 'PENDING' | 'ACCEPTED'; }

export interface BandMember {
  userId: string;
  role: string;
  permissions: string[]; // 'TOUR_OPS' | 'MEDIA' | 'MERCH'
}

export interface BandProfile {
  id: string;
  name: string;
  bio: string;
  genre: string;
  ownerId: string;
  members: BandMember[];
  avatar: string;
}

export interface TourInvitation { id: string; tourId: string; tourName: string; inviterName: string; role: string; status: 'PENDING' | 'ACCEPTED' | 'DECLINED'; }
export interface GigOpportunity { id: string; venueName: string; city: string; date: string; status: 'LEAD' | 'PITCHED' | 'HOLD_1' | 'HOLD_2' | 'CONFIRMED' | 'CONTRACTED' | 'SETTLED'; fee: number; contactName?: string; contactEmail?: string; dealTerms?: string; capacity?: number; notes?: string; }
export interface EventListing { id: string; venueId: string; venueName: string; title: string; date: string; time: string; description: string; genreTags: string[]; status: 'OPEN' | 'CLOSED' | 'FULL'; applications: string[]; }
export interface ApprovalRequest { id: string; type: 'HOST' | 'PROMOTER' | 'VENUE_CERT' | 'CREATOR'; applicantName: string; details: string; timestamp: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'; }
export interface Review { id: string; userId: string; userName: string; rating: number; comment: string; date: string; upvotes: number; downvotes: number; }
export interface LocationPoint { id: string; type: MarkerType; name: string; lat: number; lng: number; address: string; category?: string; description: string; contact?: string; website?: string; reviews: Review[]; avgRating: number; radius?: number; specialty?: string; priceRange?: string; ownerId?: string; isDynamic?: boolean; isCertified?: boolean; promoterMetadata?: { genres: string[]; capacityFocus: string; pastClients?: string[]; }; }
export interface UserProfile { id: string; name: string; role: 'Artist' | 'Professional' | 'Host' | 'Venue' | 'Manager' | 'Creator' | 'Admin' | 'Promoter'; specialty?: string; genre?: string; bio: string; location: string; travelRadius: number; avatar: string; equipment?: string[]; links: { label: string; url: string }[]; isVerified?: boolean; activePitches?: number; dietaryPreference?: 'VEGAN' | 'VEGETARIAN' | 'OMNIVORE' | 'NONE'; bands?: string[]; tags: PermissionTag[]; email?: string; }
export interface ConnectionRequest { id: string; fromId: string; fromName: string; toId: string; toName: string; type: 'PITCH' | 'CONNECT'; message: string; timestamp: string; status: 'PENDING' | 'ACCEPTED' | 'DECLINED'; }
export interface Message { id: string; senderId: string; senderName: string; text: string; timestamp: string; }
export interface Conversation { id: string; participants: string[]; participantNames: string[]; lastMessage: string; messages: Message[]; }

// Social & Organization Types
export interface FriendRequest {
  id: string;
  fromId: string;
  fromName: string;
  fromAvatar: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

export interface OrganizationRole {
  orgId: string;
  userId: string;
  role: 'ADMIN' | 'MEMBER' | 'GUEST';
}

export interface ChatChannel {
  id: string;
  orgId: string;
  name: string; // e.g. "general", "production"
  type: 'TEXT' | 'VOICE';
  messages: Message[];
}