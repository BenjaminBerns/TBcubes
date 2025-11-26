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
    <Navigation class="nav-component" @open-settings="openSettings" :translations="t" />
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
    <div class="main-content">
      <!-- Content that should flow normally if any -->
    </div>
    <Save 
      :times="savedTimes" 
      class="save-component" 
      @delete-time="handleDeleteTime" 
      @toggle-penalty="togglePenalty"
      :translations="t" 
    />
    <SettingsModal 
      :isVisible="isSettingsOpen" 
      :settings="settings" 
      @close="closeSettings" 
      @update-settings="updateSettings"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Timer from './components/Timer.vue';
import Save from './components/Save.vue';
import Navigation from './components/Navigation.vue';
import Scramble from './components/Scramble.vue';
import SettingsModal from './components/SettingsModal.vue';
import Scrambo from 'scrambo';

const savedTimes = ref([]);
const isTimerRunning = ref(false);
const currentScramble = ref('');
const scrambler = new Scrambo();

const isSettingsOpen = ref(false);
const settings = ref({
  useInspection: false,
  language: 'en',
  timerFont: 'Momo Trust Display',
  timerColor: '#353535',
  backgroundColor: '#FFFFFF',
  backgroundUrl: null,
  backgroundType: 'image',
  theme: 'default'
});

const themes = {
  default: {
    backgroundColor: '#FFFFFF',
    textColor: '#353535',
    navBackgroundColor: '#353535',
    navTextColor: '#FFFFFF',
    tableBackgroundColor: '#FFFFFF',
    tableTextColor: '#353535',
    timerColor: '#353535'
  },
  blue: {
    backgroundColor: '#0f172a',
    textColor: '#e2e8f0',
    navBackgroundColor: '#1e293b',
    navTextColor: '#94a3b8',
    tableBackgroundColor: '#0f172a',
    tableTextColor: '#e2e8f0',
    timerColor: '#38bdf8'
  },
  dark: {
    backgroundColor: '#121212',
    textColor: '#e0e0e0',
    navBackgroundColor: '#1e1e1e',
    navTextColor: '#a0a0a0',
    tableBackgroundColor: '#121212',
    tableTextColor: '#e0e0e0',
    timerColor: '#e0e0e0'
  }
};

const applyTheme = (themeName) => {
  const theme = themes[themeName] || themes.default;
  const root = document.documentElement;
  
  root.style.setProperty('--bg-color', theme.backgroundColor);
  root.style.setProperty('--text-color', theme.textColor);
  root.style.setProperty('--nav-bg-color', theme.navBackgroundColor);
  root.style.setProperty('--nav-text-color', theme.navTextColor);
  root.style.setProperty('--table-bg-color', theme.tableBackgroundColor);
  root.style.setProperty('--table-text-color', theme.tableTextColor);
  root.style.setProperty('--timer-color', theme.timerColor);
  
  // Update settings for consistency if needed, but CSS vars handle the look
  if (themeName !== 'custom') {
    settings.value.backgroundColor = theme.backgroundColor;
    settings.value.timerColor = theme.timerColor;
  }
};

watch(() => settings.value.theme, (newTheme) => {
  applyTheme(newTheme);
}, { immediate: true });

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

onMounted(() => {
  currentScramble.value = scrambler.get(1)[0]; // Initial scramble
});

const handleStop = (time) => {
  savedTimes.value.push({
    time: time,
    scramble: currentScramble.value,
    date: new Date(),
    penalty: null // null, 'DNF', '+2'
  });
  isTimerRunning.value = false;
  currentScramble.value = scrambler.get(1)[0]; // Generate new scramble
};

const handleStart = () => {
  isTimerRunning.value = true;
};

const handleDeleteTime = (index) => {
  savedTimes.value.splice(index, 1);
};

const togglePenalty = (index, type) => {
  const timeEntry = savedTimes.value[index];
  if (!timeEntry) return;

  if (timeEntry.penalty === type) {
    timeEntry.penalty = null; // Toggle off
  } else {
    timeEntry.penalty = type; // Set new penalty
  }
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
  flex-direction: row;
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.3s ease;
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
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  position: relative;
  pointer-events: none;
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
  .app-container {
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
