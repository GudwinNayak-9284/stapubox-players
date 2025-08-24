# 📦 Stapubox Players – Tournament Calendar App  

A React Native + Expo app to explore sports tournaments by sport & date.  

# Demo 🎥
[Watch Demo Video](https://drive.google.com/file/d/1sQ5BeOHsPfwqj1gk4Bqpl7spW8GvOoeE/view?usp=drive_link)

## 🚀 Features
- 🏅 Switch between sports → updates tournaments dynamically  
- 📅 Month calendar with highlighted tournament dates  
- 👆 Tap a date → see tournaments scheduled that day  
- 📂 Expand / collapse tournament cards for details  
- ✨ Skeleton shimmer loaders for dropdown, calendar & tournament list  
- 🚫 Handles “No data” states gracefully  

---

## 🛠️ Tech Stack
- [React Native (Expo)](https://docs.expo.dev/)  
- TypeScript  
- React Native Safe Area Context  
- React Native Animated (custom shimmer loading)  
- Day.js for date handling  

---

## ⚙️ Setup
Clone & run the app locally:

```bash
git clone https://github.com/GudwinNayak-9284/stapubox-players.git
cd stapubox-players
npm install
# or
yarn install
```
Start development server:
```bash
npx expo start
```

Run on:
Android: press a
iOS: press i
Web: press w


🤝 Decisions & Notes
Used custom shimmer loaders instead of third-party libraries for stability.
Used FlatList with skeleton placeholders to improve perceived performance.
Calendar highlights tournament dates & works with dynamic month switching.
