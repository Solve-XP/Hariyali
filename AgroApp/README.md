# AgroApp — React Native Android App

Converted from the React + FastAPI + MongoDB web app.
Backend stays 100% unchanged. Only the frontend is converted.

---

    

---

## 2. Project Setup

```bash
# Create Expo project
npx create-expo-app AgroApp --template blank
cd AgroApp

# Delete the default App.js — we use App.jsx
rm App.js
```

Then copy all files from this folder into your AgroApp project.

---

## 3. Install Dependencies

```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler
npm install axios
npm install expo-secure-store
npm install @react-native-async-storage/async-storage
npm install expo-image-picker expo-document-picker expo-file-system
npm install i18next react-i18next
npm install victory-native react-native-svg
npm install @expo/vector-icons
npm install @react-native-community/datetimepicker
npm install expo-location
```

---

## 4. Files to copy from your web project (no changes needed)

| Web file | Copy to |
|---|---|
| src/services/authService.js | src/services/authService.js |
| src/services/cropsService.js | src/services/cropsService.js |
| src/services/dashboardService.js | src/services/dashboardService.js |
| src/services/expensesService.js | src/services/expensesService.js |
| src/services/farmsService.js | src/services/farmsService.js |
| src/services/fertilizersService.js | src/services/fertilizersService.js |
| src/services/incomesService.js | src/services/incomesService.js |
| src/services/marketplaceService.js | src/services/marketplaceService.js |
| src/services/pesticidesService.js | src/services/pesticidesService.js |
| src/services/rentalsService.js | src/services/rentalsService.js |
| src/services/usersService.js | src/services/usersService.js |
| src/utils/validators.js | src/utils/validators.js |
| src/utils/errorHandler.js | src/utils/errorHandler.js |
| src/utils/formData.js | src/utils/formData.js |
| src/i18n/en.json | src/i18n/en.json |
| src/i18n/hi.json | src/i18n/hi.json |
| src/i18n/mr.json | src/i18n/mr.json |
| src/data/usefulLinks.js | src/data/usefulLinks.js |
| src/assets/farm-bg.jpg | src/assets/farm-bg.jpg |
| public/images/farmer-mobile.png | src/assets/farmer-mobile.png |

---

## 5. Files that are REPLACED (do NOT copy)

| Web file | Replaced by | Reason |
|---|---|---|
| src/api/axios.js | src/api/axios.js (new) | SecureStore instead of localStorage |
| src/context/AuthContext.jsx | src/context/AuthContext.jsx (new) | SecureStore session |
| src/context/AppContext.jsx | src/context/AppContext.jsx (new) | RN-compatible toast |
| src/i18n/i18n.js | src/i18n/i18n.js (new) | RN i18next setup |
| src/utils/location.js | src/utils/location.js (new) | expo-location instead of browser API |
| src/utils/geocoding.js | src/utils/geocoding.js (new) | expo-location instead of fetch |


| src/routes/ | src/navigation/ | React Navigation replaces React Router |
| src/layouts/ | handled by navigation | SafeAreaView in each screen |

| src/styles/global.css | src/theme/index.js | StyleSheet.create replaces CSS |

| src/components/Sidebar.jsx | BottomNav via React Navigation | Mobile uses bottom tabs |

---

## 6. API Base URL

Edit `src/api/axios.js`:

```js
// Android emulator
const BASE_URL = 'http://10.0.2.2:8000/api/v1';

// Physical Android device (replace with your machine's LAN IP)
const BASE_URL = 'http://192.168.1.XX:8000/api/v1';

// Production
const BASE_URL = 'https://your-api-domain.com/api/v1';
```

---

## 7. Run the app

```bash
# Start Expo dev server
npx expo start

# Press 'a' → opens Android emulator
# Or scan QR code with Expo Go app on your phone
```

---

## 8. Build Android APK

```bash
# Login to Expo account (free)
eas login

# Configure project (first time only)
eas build:configure

# Build APK (for testing / sharing)
eas build --platform android --profile preview

# Build AAB (for Google Play Store)
eas build --platform android --profile production
```

---

## 9. Key React → React Native conversions

| React (web) | React Native |
|---|---|
| `<div>` | `<View>` |
| `<p>`, `<span>`, `<h1>` | `<Text>` |
| `<img src>` | `<Image source={require(...)}` or `uri` |
| `<input>` | `<TextInput>` |
| `<button>` | `<TouchableOpacity>` or `<Pressable>` |
| `<select>` | Custom `<Select>` or `@react-native-picker/picker` |
| CSS files | `StyleSheet.create({})` |
| `onClick` | `onPress` |
| `className` | `style` |
| `React Router` | `@react-navigation/native` |
| `localStorage` | `expo-secure-store` |
| `window.alert` | `Alert.alert` |
| CSS `flexbox` | Same flex model, default is column not row |

---

## 10. Folder structure overview

```
AgroApp/
├── App.jsx                        ← entry point
├── app.json                       ← Expo config
├── eas.json                       ← EAS build config
├── package.json
└── src/
    ├── api/axios.js               ← HTTP client (JWT auto-attach)
    ├── assets/                    ← images copied from web project
    ├── components/                ← converted shared components
    │   ├── marketplace/
    │   └── rentals/
    ├── context/
    │   ├── AuthContext.jsx        ← session management (SecureStore)
    │   └── AppContext.jsx         ← toast, language, loading
    ├── data/usefulLinks.js        ← copied as-is
    ├── i18n/                      ← copied JSON files + new i18n.js
    ├── navigation/                ← replaces src/routes/
    │   ├── AppNavigator.jsx       ← root: auth vs role router
    │   ├── AuthNavigator.jsx      ← login + signup stack
    │   ├── FarmerNavigator.jsx    ← bottom tabs + nested stacks
    │   ├── MerchantNavigator.jsx
    │   └── AdminNavigator.jsx
    ├── screens/                   ← replaces src/pages/
    │   ├── auth/
    │   ├── farmer/
    │   ├── merchant/
    │   ├── admin/
    │   ├── marketplace/
    │   ├── rentals/
    │   ├── profile/
    │   └── static/
    ├── services/                  ← copied as-is from web project
    ├── theme/index.js             ← replaces global.css
    └── utils/                     ← copied (validators, errorHandler, formData) + new location/geocoding
```
