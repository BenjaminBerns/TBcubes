<template>
  <div 
    class="app-container" 
    :class="{ 'focus-mode': isTimerRunning }"
    :style="{ backgroundColor: settings.backgroundColor }"
  >
    <div v-if="settings.backgroundUrl" class="background-media">
      <img v-if="settings.backgroundType === 'image'" :src="settings.backgroundUrl" alt="background" />
      <video v-else-if="settings.backgroundType === 'video'" :src="settings.backgroundUrl" autoplay loop muted playsinline></video>
    </div>
    <div class="content-wrapper">
      <Navigation 
        class="nav-component" 
        @open-settings="openSettings" 
        :translations="t" 
        @navigate="(view) => currentView = view"
        :user="user"
        @login="login"
        @logout="logout"
      />
      <div class="main-content">
        <template v-if="currentView === 'timer'">
          <div class="center-container">
            <Scramble :scramble="currentScramble" class="scramble-component" />
            <Timer 
              @on-stop="handleStop" 
              @on-start="handleStart" 
              :settings="settings"
              :last-time="savedTimes.length > 0 ? savedTimes[savedTimes.length - 1] : null"
              @toggle-penalty="(type) => togglePenalty(savedTimes.length - 1, type)"
            />
          </div>
        </template>
        <template v-else-if="currentView === 'oll'">
          <OLLList @back="currentView = 'timer'" />
        </template>
      </div>
      <Save 
        :times="savedTimes" 
        :current-session="currentSessionType"
        :available-sessions="availableSessions"
        class="save-component" 
        @delete-time="handleDeleteTime" 
        @toggle-penalty="togglePenalty"
        @update-session="updateSession"
        :translations="t" 
      />
    </div>
    <SettingsModal 
      :isVisible="isSettingsOpen" 
      :settings="settings" 
      @close="closeSettings" 
      @update-settings="updateSettings"
    />
    <AdBanner />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Timer from './components/Timer.vue';
import Save from './components/Save.vue';
import Navigation from './components/Navigation.vue';
import Scramble from './components/Scramble.vue';
import SettingsModal from './components/SettingsModal.vue';
import OLLList from './components/OLLList.vue';
import AdBanner from './components/AdBanner.vue';

import Scrambo from 'scrambo';
import WCAService from './services/wca';
import { db } from './services/db';

const getDefaultSessions = () => ({
  '2x2': [],
  '3x3': [],
  '4x4': [],
  'Pyraminx': [],
  'Megaminx': [],
  'Square-1': [],
  'Blind': []
});

const sessions = ref(getDefaultSessions());
const currentSessionType = ref('3x3');
const availableSessions = Object.keys(sessions.value);

const savedTimes = computed(() => sessions.value[currentSessionType.value]);

const isTimerRunning = ref(false);
const currentScramble = ref('');
const scrambler = new Scrambo();
const currentView = ref('timer'); // 'timer', 'oll'

const isSettingsOpen = ref(false);
const settings = ref({
  useInspection: true,
  language: 'en',
  timerFont: 'Momo Trust Display',
  timerColor: '#353535',
  backgroundColor: '#FFFFFF',
  textColor: '#353535',
  navBackgroundColor: '#353535',
  navTextColor: '#FFFFFF',
  statsBackgroundColor: 'transparent',
  historyBackgroundColor: '#FFFFFF',
  backgroundUrl: null,
  backgroundType: 'image',
  theme: 'default',
  customThemes: {}
});

const SCRAMBLE_TYPES = {
  '2x2': '222',
  '3x3': '333',
  '4x4': '444',
  'Pyraminx': 'pyram',
  'Megaminx': 'minx',
  'Square-1': 'sq1',
  'Blind': '333bf'
};

const themes = {
  default: {
    backgroundColor: '#FFFFFF',
    textColor: '#353535',
    navBackgroundColor: '#353535',
    navTextColor: '#FFFFFF',
    tableBackgroundColor: '#FFFFFF',
    tableTextColor: '#353535',
    timerColor: '#353535',
    statsBackgroundColor: 'transparent',
    historyBackgroundColor: '#FFFFFF'
  },
  blue: {
    backgroundColor: '#0f172a',
    textColor: '#e2e8f0',
    navBackgroundColor: '#1e293b',
    navTextColor: '#94a3b8',
    tableBackgroundColor: '#0f172a',
    tableTextColor: '#e2e8f0',
    timerColor: '#38bdf8',
    statsBackgroundColor: 'transparent',
    historyBackgroundColor: '#0f172a'
  },
  dark: {
    backgroundColor: '#121212',
    textColor: '#e0e0e0',
    navBackgroundColor: '#1e1e1e',
    navTextColor: '#a0a0a0',
    tableBackgroundColor: '#121212',
    tableTextColor: '#e0e0e0',
    timerColor: '#e0e0e0',
    statsBackgroundColor: 'transparent',
    historyBackgroundColor: '#121212'
  },
  fire: {
    backgroundColor: '#3a0e0e',
    textColor: '#ffcc00',
    navBackgroundColor: '#5a1e1e',
    navTextColor: '#ffcc00',
    tableBackgroundColor: '#2a0a0a',
    tableTextColor: '#ffcc00',
    timerColor: '#ff4500',
    statsBackgroundColor: 'rgba(58, 14, 14, 0.8)',
    historyBackgroundColor: '#2a0a0a'
  },
  nature: {
    backgroundColor: '#0e2b0e',
    textColor: '#e0ffe0',
    navBackgroundColor: '#1e4b1e',
    navTextColor: '#e0ffe0',
    tableBackgroundColor: '#0a1f0a',
    tableTextColor: '#e0ffe0',
    timerColor: '#90ee90',
    statsBackgroundColor: 'rgba(14, 43, 14, 0.8)',
    historyBackgroundColor: '#0a1f0a'
  },
  winter: {
    backgroundColor: '#0e1a2b',
    textColor: '#e0f0ff',
    navBackgroundColor: '#1e3a5b',
    navTextColor: '#e0f0ff',
    tableBackgroundColor: '#0a121f',
    tableTextColor: '#e0f0ff',
    timerColor: '#add8e6',
    statsBackgroundColor: 'rgba(14, 26, 43, 0.8)',
    historyBackgroundColor: '#0a121f'
  }
};

const applyTheme = (themeName) => {
  let theme = themes[themeName];
  
  // Check if it's a custom theme
  if (!theme && settings.value.customThemes && settings.value.customThemes[themeName]) {
    theme = settings.value.customThemes[themeName];
  }
  
  // Fallback to default if still not found
  if (!theme) {
    theme = themes.default;
  }

  const root = document.documentElement;
  
  // Use settings values if we are in 'custom' mode (unsaved/unnamed custom)
  // OR if we are currently editing a custom theme (this logic might need refinement)
  // For now, if themeName is 'custom', use settings values.
  // If themeName is a named custom theme, use the values from that theme object.
  const isCustom = themeName === 'custom';
  
  const bg = isCustom ? settings.value.backgroundColor : theme.backgroundColor;
  const text = isCustom ? settings.value.textColor : theme.textColor;
  const navBg = isCustom ? settings.value.navBackgroundColor : theme.navBackgroundColor;
  const navText = isCustom ? settings.value.navTextColor : theme.navTextColor;
  const tableBg = theme.tableBackgroundColor; // Deprecated/Unused?
  const tableText = isCustom ? settings.value.textColor : theme.tableTextColor;
  const timer = isCustom ? settings.value.timerColor : theme.timerColor;
  const statsBg = isCustom ? settings.value.statsBackgroundColor : theme.statsBackgroundColor;
  const historyBg = isCustom ? settings.value.historyBackgroundColor : theme.historyBackgroundColor;

  root.style.setProperty('--bg-color', bg);
  root.style.setProperty('--text-color', text);
  root.style.setProperty('--nav-bg-color', navBg);
  root.style.setProperty('--nav-text-color', navText);
  root.style.setProperty('--table-bg-color', historyBg); // Map history bg to table bg var
  root.style.setProperty('--table-text-color', tableText);
  root.style.setProperty('--timer-color', timer);
  root.style.setProperty('--stats-bg-color', statsBg);
  
  if (!isCustom) {
    settings.value.backgroundColor = bg;
    settings.value.textColor = text;
    settings.value.navBackgroundColor = navBg;
    settings.value.navTextColor = navText;
    settings.value.timerColor = timer;
    settings.value.statsBackgroundColor = statsBg;
    settings.value.historyBackgroundColor = historyBg;
  }
};

watch(() => settings.value, (newSettings) => {
  applyTheme(newSettings.theme);
}, { deep: true, immediate: true });

const translations = {
  en: {
    menu: 'Menu',
    algorithms: 'Algorithms',
    tutorials: 'Tutorials',
    savedTimes: 'Saved Times',
    time: 'Time',
    avg5: 'Avg 5',
    avg12: 'Avg 12',
    settings: 'Settings'
  },
  fr: {
    menu: 'Menu',
    algorithms: 'Algorithmes',
    tutorials: 'Tutoriels',
    savedTimes: 'Temps Enregistrés',
    time: 'Temps',
    avg5: 'Moy 5',
    avg12: 'Moy 12',
    settings: 'Paramètres'
  }
};

const t = computed(() => translations[settings.value.language]);



const user = ref(null);

onMounted(async () => {
  // Initialize scrambler with correct type
  const initialType = SCRAMBLE_TYPES[currentSessionType.value] || '333';
  scrambler.type(initialType);
  currentScramble.value = scrambler.get(1)[0]; // Initial scramble

  // Check for WCA access token in URL (callback)
  const accessToken = WCAService.getAccessTokenFromUrl();
  if (accessToken) {
    // Save token (optional, for persistence across reloads if not using implicit flow correctly, 
    // but implicit flow usually requires re-auth or storing token in localStorage)
    localStorage.setItem('wca_access_token', accessToken);
    
    // Clear hash
    window.history.replaceState(null, null, ' ');
    
    // Fetch profile
    user.value = await WCAService.getProfile(accessToken);
  } else {
    // Check local storage
    const storedToken = localStorage.getItem('wca_access_token');
    if (storedToken) {
       user.value = await WCAService.getProfile(storedToken);
    }
  }
});

import SupabaseService from './services/supabase';

// ... (imports)

// ... (getDefaultSessions)

// ... (refs)

// ... (watch user)
watch(user, async (newUser) => {
  if (newUser) {
    // Logged in: Load from Supabase
    const savedSessions = await SupabaseService.fetchUserData(newUser.id);
    if (savedSessions) {
      sessions.value = { ...getDefaultSessions(), ...savedSessions };
    } else {
      sessions.value = getDefaultSessions();
    }
  } else {
    // Guest: Load from IndexedDB
    const savedSessions = await db.getUserData('guest');
    if (savedSessions) {
      sessions.value = { ...getDefaultSessions(), ...savedSessions };
    } else {
      sessions.value = getDefaultSessions();
    }
  }
}, { immediate: true });

// Watch sessions for GUEST ONLY (IndexedDB sync)
watch(sessions, async (newSessions) => {
  if (!user.value) {
    await db.saveUserData('guest', newSessions);
  }
}, { deep: true });

// ... (login/logout)

const handleStop = async (time, penalty = null) => {
  const newTime = {
    time: time,
    scramble: currentScramble.value,
    date: new Date(),
    penalty: penalty // null, 'DNF', '+2'
  };

  if (user.value) {
    // Save to Supabase
    const savedTime = await SupabaseService.saveTime(user.value.id, currentSessionType.value, newTime);
    if (savedTime) {
      // Add to local state with ID from DB
      sessions.value[currentSessionType.value].push({
        ...newTime,
        id: savedTime.id
      });
    }
  } else {
    // Save to local state (watcher handles IndexedDB)
    sessions.value[currentSessionType.value].push(newTime);
  }

  isTimerRunning.value = false;
  // Update scrambler type before generating new scramble
  const scrambleType = SCRAMBLE_TYPES[currentSessionType.value] || '333';
  scrambler.type(scrambleType);
  currentScramble.value = scrambler.get(1)[0];
};

// ... (handleStart)

const handleDeleteTime = async (index) => {
  const timeEntry = sessions.value[currentSessionType.value][index];
  
  if (user.value && timeEntry.id) {
    // Delete from Supabase
    const success = await SupabaseService.deleteTime(timeEntry.id);
    if (success) {
      sessions.value[currentSessionType.value].splice(index, 1);
    }
  } else {
    // Delete from local state
    sessions.value[currentSessionType.value].splice(index, 1);
  }
};

const togglePenalty = async (index, type) => {
  const timeEntry = sessions.value[currentSessionType.value][index];
  if (!timeEntry) return;

  let newPenalty = null;
  if (timeEntry.penalty !== type) {
    newPenalty = type;
  }

  if (user.value && timeEntry.id) {
    // Update Supabase
    const success = await SupabaseService.updateTime(timeEntry.id, { penalty: newPenalty });
    if (success) {
      timeEntry.penalty = newPenalty;
    }
  } else {
    // Update local state
    timeEntry.penalty = newPenalty;
  }
};

const updateSession = (newSession) => {
  currentSessionType.value = newSession;
  
  // Update scrambler type
  const scrambleType = SCRAMBLE_TYPES[newSession] || '333';
  scrambler.type(scrambleType);
  
  // Generate new scramble for the new type
  currentScramble.value = scrambler.get(1)[0];
};

const openSettings = () => {
  isSettingsOpen.value = true;
};

const closeSettings = () => {
  isSettingsOpen.value = false;
};

const updateSettings = (newSettings) => {
  settings.value = newSettings;
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.3s ease;
}

.content-wrapper {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: row;
  overflow: hidden;
  position: relative;
}

.app-container.focus-mode {
  box-shadow: inset 0 0 50px 10px rgba(60, 110, 113, 0.5);
}

.background-media {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.background-media img,
.background-media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
}

.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  width: 100%;
  pointer-events: none; /* Let clicks pass through to background if needed, but buttons need pointer-events: auto */
}

.center-container > * {
  pointer-events: auto;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center content vertically by default */
  position: relative;
  pointer-events: none;
  height: 100%;
  overflow: hidden; /* Prevent double scrollbars */
}

.main-content > * {
  pointer-events: auto;
}

.nav-component,
.save-component,
.logo,
.scramble-component {
  z-index: 1;
  position: relative;
}

/* Focus Mode Transparencies */
.focus-mode .nav-component,
.focus-mode .save-component,
.focus-mode .logo,
.focus-mode .scramble-component {
  opacity: 0.2;
  transition: opacity 0.3s ease;
}

.nav-component,
.save-component,
.logo,
.scramble-component {
  transition: opacity 0.3s ease;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    height: auto;
    overflow: auto;
  }

  .main-content {
    min-height: 50vh;
  }
}

.momo-trust-display-regular {
  font-family: "Momo Trust Display", sans-serif;
  font-weight: 400;
  font-style: normal;
}
 
.color-gray-500 {
  color: #353535;
}

.color-green-500 {
  color: #3C6E71;
}

.color-white-500 {
  color: #FFFFFF;
}

.color-gray-100 {
  color: #D9D9D9;
}

.color-blue-500 {
  color: #284B63;
}



.logo {
  width: 10%;
  height: 10%;
}

</style>
