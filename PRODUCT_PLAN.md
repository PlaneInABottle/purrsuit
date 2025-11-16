# 🐾 Purrsuit - Product Plan (Offline-First, Privacy-Focused)

## 🎯 Core Philosophy

**Offline-first, privacy-respecting pet discovery journal**

### Key Principles

1. ✅ **Works 100% offline** - No account, no internet required
2. ✅ **Location is optional** - Manual entry or none at all
3. ✅ **Data stays on device** - Full user control
4. ✅ **Premium unlocks online features** - Future monetization path
5. ✅ **Export your data anytime** - True ownership

---

## 🔐 Two-Mode Architecture

### 🆓 FREE MODE (Offline Complete)

**"Your Private Pet Journal"**

**What Works:**

- ✅ Unlimited photo captures
- ✅ All basic stickers (20-30)
- ✅ Manual tagging (cat/dog/other)
- ✅ Emotion tags & notes
- ✅ Manual location naming ("Coffee shop", "Park", "Home street")
- ✅ Date/time logging
- ✅ Grid/list views
- ✅ Map view (with pet locations)
- ✅ Basic stats (counts, streaks)
- ✅ Achievement badges
- ✅ Calendar view
- ✅ Search & filter
- ✅ Location picker map (during capture)
- ✅ GPS auto-locate option
- ✅ Data stored locally (MMKV + file system)
- ✅ Export to photos/JSON

**What Doesn't Work:**

- ❌ No GPS location (unless user enables)
- ❌ No cloud backup
- ❌ No sync between devices
- ❌ No community features
- ❌ No AI pet recognition

### 💎 PREMIUM MODE (Subscription)

**"Purrsuit Plus" - Future Phase 2**

**Additional Features:**

- ☁️ Cloud backup & sync
- 📱 Multi-device access
- 🗺️ Map view (if location enabled)
- 🤖 AI pet recognition ("Is this the same cat?")
- 🌍 Community feed (opt-in, anonymous)
- 🎨 Premium sticker packs (50+ exclusive)
- 📊 Advanced analytics
- 📤 Share to social media
- 💾 Unlimited cloud storage
- 🔄 Automatic backups

**Pricing Strategy (Future):**

- Monthly: $2.99/month
- Yearly: $19.99/year (save 44%)
- Lifetime: $49.99 (one-time)

---

## 📍 Location Handling - Three Levels

### Level 1: No Location (Default)

- User never grants location permission
- Can add manual labels: "Near work", "My neighborhood", "Downtown"
- Can leave blank
- Works perfectly without any location data

### Level 2: Manual Location Tags

- User types location names
- Build a list of favorite spots
- Quick-select from recent locations
- Examples: "Coffee shop", "Park entrance", "Subway station"
- No GPS coordinates stored

### Level 3: GPS Location (Opt-in)

- User explicitly enables in settings
- Can toggle on/off per photo
- Shows: "📍 GPS Location Available - Use it?" with Yes/Skip
- Stores coordinates for map view
- Can be removed later from individual entries

---

## 💾 Data Architecture (Offline-First)

### Storage Strategy

**Local Storage (MMKV):**

- userPreferences
- achievementProgress
- streakData
- statistics
- encounterIds[]
- searchIndex

**File System (Expo FileSystem):**

```
/DocumentDirectory/purrsuit/
  photos/
    {uuid}.jpg (original)
    {uuid}_thumb.jpg (thumbnail)
  data/
    encounters.json
    backups/
```

**MST Store Structure:**

```
RootStore
├── UserStore (preferences, settings)
├── EncounterStore (pet discoveries)
│   ├── encounters: Map<id, Encounter>
│   ├── locationTags: string[] (manual labels)
│   └── recentTags: string[] (quick access)
├── StickerStore (available, unlocked, categories)
├── StatsStore (counts, streaks, achievements)
├── UiStore (loading, errors, modals)
└── PremiumStore (subscription status - Phase 2)
```

---

## 🗂️ Data Models

### Encounter Model

```typescript
{
  id: string (uuid)
  timestamp: number
  photos: {
    original: string (file path)
    thumbnail: string (file path)
  }

  // Pet Info
  petType: "cat" | "dog" | "other" | "unknown"
  mood?: string[] // ["happy", "playful"]
  tags?: string[] // ["fluffy", "orange"]

  // Location (All Optional)
  location: {
    type: "none" | "manual" | "gps"
    label?: string // "Coffee shop on 5th"
    coordinates?: { lat, lng } // only if GPS enabled
  }

  // Customization
  stickers: Array<{
    id: string
    position: { x, y }
    scale: number
    rotation: number
  }>

  // Notes
  note?: string

  // Metadata
  weather?: string
  timeOfDay: "morning" | "afternoon" | "evening" | "night"

  // Premium Features (Phase 2)
  aiTags?: string[]
  relatedEncounterIds?: string[]
  isShared?: boolean
}
```

### User Preferences Model

```typescript
{
  // Privacy
  locationPermission: "none" | "manual" | "gps"
  askForLocationEachTime: boolean

  // Display
  theme: "light" | "dark" | "system"
  gridColumns: 2 | 3 | 4
  defaultView: "grid" | "list" | "timeline"

  // Capture
  autoSavePhotos: boolean
  photoQuality: "high" | "medium" | "low"
  alwaysShowStickers: boolean

  // Premium (Phase 2)
  subscriptionStatus: "free" | "premium"
  cloudBackupEnabled: boolean
  aiRecognitionEnabled: boolean
}
```

---

## 🎨 UX Flow

### First Launch Flow

```
Screen 1: Welcome
"Welcome to Purrsuit! 🐾"
"Your private journal for pets you meet"
[Get Started]

Screen 2: Permissions (Camera Only)
"Let's capture some moments! 📸"
"Purrsuit needs camera access to save pet photos"
[Allow Camera] - Required
[Learn More]

Screen 3: Location Choice
"How would you like to remember places?"

Option 1: 📝 No Location
"I'll remember on my own"

Option 2: ✏️ Manual Tags
"I'll type location names"
(Recommended)

Option 3: 📍 GPS Location
"Use GPS coordinates"
(Shows map features)

[Choose: Manual Tags] (default highlighted)

Screen 4: Ready!
"You're all set! Go find some furry friends 🐱🐶"
[Start Exploring]
```

### Capture Flow

```
1. Tap camera button

2. Take photo

3. Quick Edit Screen:
   [Photo preview]

   Pet Type: [Cat] [Dog] [Other] [?]

   ⭐ Stickers (optional)
   [Swipe carousel of stickers]

   📍 Location (based on setting)
   - Option 1: No location
   - Option 2: Manual text tag
   - Option 3: Pick on map 🗺️
   - Option 4: Use GPS auto-locate 📡

   💬 Note (optional)
   [Add a note...]

   [Save] [Retake]

4. Saved! 🎉
   "Encounter #42 saved!"
   [View] [Add Another]
```

---

## 🚀 Development Roadmap

### Phase 1: MVP (Free, Offline) - 8 Weeks

**Week 1-2: Foundation**

- ✅ Camera integration (Expo Camera/Image Picker)
- ✅ File system storage setup
- ✅ MST store models (Encounter, Stats, Sticker)
- ✅ Basic UI scaffolding

**Week 3-4: Core Capture Flow**

- ✅ Photo capture & save
- ✅ Pet type selection
- ✅ Sticker overlay system
- ✅ Manual location tags
- ✅ Notes input

**Week 5-6: Collection Views & Map**

- ✅ Grid view (FlashList)
- ✅ Detail view
- ✅ Filter & search
- ✅ Timeline view
- ✅ Map view (with pet markers)
- ✅ Location picker map (during capture)
- ✅ Delete & edit

**Week 7-8: Stats & Polish**

- ✅ Stats dashboard
- ✅ Achievement system
- ✅ Onboarding flow
- ✅ Export functionality
- ✅ Performance optimization

### Phase 2: Premium Features - 4-6 Weeks (Future)

**Week 9-10: Infrastructure**

- Cloud storage setup
- Authentication system
- Subscription handling
- Data sync engine

**Week 11-12: Smart Features**

- AI pet recognition
- Map view
- Advanced analytics
- Community feed

**Week 13-14: Testing & Launch**

- Beta testing
- Premium onboarding
- Payment flow
- App Store submission

---

## 🔧 Key Dependencies

### Phase 1 (MVP):

```json
{
  "expo-camera": "~16.0.0",
  "expo-image-picker": "~17.0.0",
  "expo-file-system": "~19.0.0",
  "expo-location": "~18.0.0",
  "@shopify/flash-list": "^1.7.0",
  "react-native-svg": "^15.0.0",
  "react-native-maps": "^1.18.0",
  "uuid": "^10.0.0",
  "react-native-view-shot": "^4.0.0"
}
```

### Phase 2 (Premium):

```json
{
  "@react-native-firebase/app": "^21.0.0",
  "@react-native-firebase/auth": "^21.0.0",
  "@react-native-firebase/storage": "^21.0.0",
  "react-native-purchases": "^8.0.0"
}
```

---

## 🎯 Feature Comparison Table

| Feature              | Free (Offline) | Premium            |
| -------------------- | -------------- | ------------------ |
| Photo capture        | ✅ Unlimited   | ✅ Unlimited       |
| Basic stickers       | ✅ 30 stickers | ✅ 30 + 50 premium |
| Manual pet tagging   | ✅ Yes         | ✅ Yes             |
| Manual location tags | ✅ Yes         | ✅ Yes             |
| GPS tracking         | ✅ Opt-in      | ✅ Opt-in          |
| Map view             | ❌ No          | ✅ Yes             |
| Local storage        | ✅ Device only | ✅ Device + Cloud  |
| Cloud backup         | ❌ No          | ✅ Automatic       |
| Multi-device sync    | ❌ No          | ✅ Yes             |
| AI pet recognition   | ❌ No          | ✅ Yes             |
| Community feed       | ❌ No          | ✅ Opt-in          |
| Export photos/data   | ✅ Yes         | ✅ Yes             |

---

## 💡 Privacy-First Messaging

### On Location Prompt:

```
"Purrsuit respects your privacy! 🔒

You can use Purrsuit three ways:

1️⃣ No Location
   Perfect for maximum privacy

2️⃣ Manual Tags (Recommended)
   Type your own location names
   Example: "Park near work"

3️⃣ GPS Location
   Store exact coordinates
   Enables map view

You can change this anytime in Settings.
Your data never leaves your device."
```

---

## 🎨 Brand Messaging

**App Store Description:**

```
Purrsuit - Your Private Pet Journal 🐾

Capture moments with the adorable pets you meet every day!

✨ 100% OFFLINE & PRIVATE
Your data stays on your device. No account required.

📸 QUICK CAPTURE
Snap a photo, add cute stickers, save in seconds.

🎨 CUTE STICKERS
Decorate your photos with playful, hand-drawn stickers.

📊 TRACK YOUR ADVENTURES
See your collection grow. Earn achievement badges.

📍 PRIVACY FIRST
Location is optional. Choose manual tags, GPS, or none.

💾 YOUR DATA, YOUR CONTROL
Export your collection anytime. Own your memories.

Download free. No ads. No upsells.
```

---

## 🎯 Success Metrics

### Free Tier:

- Daily active users
- Encounters per user per week
- 7-day retention rate
- Feature usage (stickers, tags, notes)
- Export usage
- App store rating

### Premium Tier (Phase 2):

- Free-to-paid conversion rate
- Subscription retention
- Premium feature engagement
- Cloud storage usage

---

## ✨ Core Values

1. **Privacy First** - User data stays on device
2. **No Lock-in** - Export anytime
3. **Respect** - No dark patterns
4. **Joy** - Every interaction should delight
5. **Accessible** - Works offline, no data plan needed
6. **Sustainable** - Ethical monetization path

---

**Last Updated:** 2025-01-13
**Version:** 1.0
**Status:** Phase 1 Development
