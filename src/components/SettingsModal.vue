<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="settings-sidebar">
        <div 
          v-for="section in sections" 
          :key="section.id" 
          class="sidebar-item momo-trust-display-regular"
          :class="{ active: activeSection === section.id }"
          @click="activeSection = section.id"
        >
          {{ translations[localSettings.language][section.id] || section.label }}
        </div>
      </div>

      <div class="settings-main">
        <h2 class="section-title momo-trust-display-regular color-gray-500">
          {{ translations[localSettings.language][activeSection] || activeSection }}
        </h2>

        <!-- General Section -->
        <div v-if="activeSection === 'general'" class="settings-group">
          <div class="setting-item">
            <label class="momo-trust-display-regular color-gray-500">
              {{ translations[localSettings.language].language }}:
            </label>
            <select v-model="localSettings.language" class="setting-input momo-trust-display-regular">
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        <!-- Skin Section -->
        <div v-if="activeSection === 'skin'" class="settings-group">
          <div class="setting-item">
            <label class="momo-trust-display-regular color-gray-500">
              {{ translations[localSettings.language].theme }}:
            </label>
            <select v-model="selectedSkin" @change="applySkin" class="setting-input momo-trust-display-regular">
              <optgroup label="Presets">
                <option value="default">Default</option>
                <option value="blue">Blue Night</option>
                <option value="dark">Dark Mode</option>
                <option value="fire">Fire</option>
                <option value="nature">Nature</option>
                <option value="winter">Winter</option>
              </optgroup>
              <optgroup label="Custom">
                <option value="custom">Custom (Unsaved)</option>
                <option v-for="(theme, name) in localSettings.customThemes" :key="name" :value="name">
                  {{ name }}
                </option>
              </optgroup>
            </select>
          </div>

          <div class="setting-item new-theme-container">
            <input 
              type="text" 
              v-model="newThemeName" 
              :placeholder="translations[localSettings.language].newThemePlaceholder"
              class="setting-input momo-trust-display-regular"
            >
            <button class="create-theme-btn momo-trust-display-regular" @click="createCustomTheme">
              {{ translations[localSettings.language].createTheme }}
            </button>
            <button class="create-theme-btn momo-trust-display-regular" @click="exportTheme">
              {{ translations[localSettings.language].exportTheme }}
            </button>
            <button class="create-theme-btn momo-trust-display-regular" @click="triggerImport">
              {{ translations[localSettings.language].importTheme }}
            </button>
            <input
              type="file"
              ref="importFileInput"
              style="display: none"
              accept=".json"
              @change="handleImportFile"
            >
          </div>

          <div class="setting-item">
            <label class="momo-trust-display-regular color-gray-500">
              {{ translations[localSettings.language].timerFont }}:
            </label>
            <select v-model="localSettings.timerFont" class="setting-input momo-trust-display-regular">
              <option value="Momo Trust Display">Momo Trust Display</option>
              <option value="Roboto">Roboto</option>
              <option value="Courier New">Courier New</option>
              <option value="Arial">Arial</option>
            </select>
          </div>

          <div class="setting-item">
            <label class="momo-trust-display-regular color-gray-500">
              {{ translations[localSettings.language].timerColor }}:
            </label>
            <input type="color" v-model="localSettings.timerColor" class="color-picker">
          </div>
          <div class="setting-item">
            <label class="momo-trust-display-regular color-gray-500">
              {{ translations[localSettings.language].backgroundColor }}:
            </label>
            <input type="color" v-model="localSettings.backgroundColor" class="color-picker">
          </div>
          <div class="setting-item">
            <label class="momo-trust-display-regular color-gray-500">
              {{ translations[localSettings.language].textColor }}:
            </label>
            <input type="color" v-model="localSettings.textColor" class="color-picker">
          </div>
          <div class="setting-item">
            <label class="momo-trust-display-regular color-gray-500">
              {{ translations[localSettings.language].navBackgroundColor }}:
            </label>
            <input type="color" v-model="localSettings.navBackgroundColor" class="color-picker">
          </div>
          <div class="setting-item">
            <label class="momo-trust-display-regular color-gray-500">
              {{ translations[localSettings.language].navTextColor }}:
            </label>
            <input type="color" v-model="localSettings.navTextColor" class="color-picker">
          </div>
          <div class="setting-item">
            <label class="momo-trust-display-regular color-gray-500">
              {{ translations[localSettings.language].statsBackgroundColor }}:
            </label>
            <input type="color" v-model="localSettings.statsBackgroundColor" class="color-picker">
          </div>
          <div class="setting-item">
            <label class="momo-trust-display-regular color-gray-500">
              {{ translations[localSettings.language].historyBackgroundColor }}:
            </label>
            <input type="color" v-model="localSettings.historyBackgroundColor" class="color-picker">
          </div>
          <div class="setting-item">
            <label class="momo-trust-display-regular color-gray-500">
              {{ translations[localSettings.language].backgroundImage }}:
            </label>
            <input type="file" @change="handleFileChange" accept="image/*,video/*" class="file-input momo-trust-display-regular">
          </div>
        </div>

        <!-- Timer Section -->
        <div v-if="activeSection === 'timer'" class="settings-group">
          <div class="setting-item">
            <label class="checkbox-label momo-trust-display-regular color-gray-500">
              <input type="checkbox" v-model="localSettings.useInspection" class="setting-checkbox">
              {{ translations[localSettings.language].useInspection }}
            </label>
          </div>
        </div>

        <!-- Connection Section -->
        <div v-if="activeSection === 'connection'" class="settings-group">
          <p class="momo-trust-display-regular color-gray-500">Coming soon...</p>
        </div>

        <!-- Account Section -->
        <div v-if="activeSection === 'account'" class="settings-group">
          <p class="momo-trust-display-regular color-gray-500">Coming soon...</p>
        </div>

        <div class="modal-footer">
          <button class="ok-button momo-trust-display-regular" @click="saveAndClose">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  settings: {
    type: Object,
    required: true,
    default: () => ({
      useInspection: false,
      language: 'en',
      timerFont: 'Momo Trust Display',
      timerColor: '#353535',
      backgroundColor: '#FFFFFF',
      textColor: '#353535',
      navBackgroundColor: '#353535',
      navTextColor: '#FFFFFF',
      statsBackgroundColor: 'transparent',
      historyBackgroundColor: '#FFFFFF',
      theme: 'default'
    })
  }
});

const emit = defineEmits(['close', 'update-settings']);

const localSettings = ref({ ...props.settings });
const activeSection = ref('general');
const selectedSkin = ref('custom');
const newThemeName = ref('');
const importFileInput = ref(null);

// Initialize selectedSkin based on current theme
if (['default', 'blue', 'dark', 'fire', 'nature', 'winter'].includes(localSettings.value.theme)) {
  selectedSkin.value = localSettings.value.theme;
} else if (localSettings.value.customThemes && localSettings.value.customThemes[localSettings.value.theme]) {
  selectedSkin.value = localSettings.value.theme;
} else {
  selectedSkin.value = 'custom';
}

const skinPresets = {
  default: {
    backgroundColor: '#FFFFFF',
    timerColor: '#353535',
    textColor: '#353535',
    navBackgroundColor: '#353535',
    navTextColor: '#FFFFFF',
    statsBackgroundColor: 'transparent',
    historyBackgroundColor: '#FFFFFF',
    backgroundUrl: null,
    backgroundType: 'image'
  },
  blue: {
    backgroundColor: '#0f172a',
    timerColor: '#38bdf8',
    textColor: '#e2e8f0',
    navBackgroundColor: '#1e293b',
    navTextColor: '#94a3b8',
    statsBackgroundColor: 'transparent',
    historyBackgroundColor: '#0f172a',
    backgroundUrl: null,
    backgroundType: 'image'
  },
  dark: {
    backgroundColor: '#121212',
    timerColor: '#e0e0e0',
    textColor: '#e0e0e0',
    navBackgroundColor: '#1e1e1e',
    navTextColor: '#a0a0a0',
    statsBackgroundColor: 'transparent',
    historyBackgroundColor: '#121212',
    backgroundUrl: null,
    backgroundType: 'image'
  },
  fire: {
    backgroundColor: '#3a0e0e',
    timerColor: '#ff4500',
    textColor: '#ffcc00',
    navBackgroundColor: '#5a1e1e',
    navTextColor: '#ffcc00',
    statsBackgroundColor: 'rgba(58, 14, 14, 0.8)',
    historyBackgroundColor: '#2a0a0a',
    backgroundUrl: '/skins/fire_bg.png',
    backgroundType: 'image'
  },
  nature: {
    backgroundColor: '#0e2b0e',
    timerColor: '#90ee90',
    textColor: '#e0ffe0',
    navBackgroundColor: '#1e4b1e',
    navTextColor: '#e0ffe0',
    statsBackgroundColor: 'rgba(14, 43, 14, 0.8)',
    historyBackgroundColor: '#0a1f0a',
    backgroundUrl: '/skins/nature_bg.png',
    backgroundType: 'image'
  },
  winter: {
    backgroundColor: '#0e1a2b',
    timerColor: '#add8e6',
    textColor: '#e0f0ff',
    navBackgroundColor: '#1e3a5b',
    navTextColor: '#e0f0ff',
    statsBackgroundColor: 'rgba(14, 26, 43, 0.8)',
    historyBackgroundColor: '#0a121f',
    backgroundUrl: '/skins/winter_bg.png',
    backgroundType: 'image'
  }
};

const createCustomTheme = () => {
  if (!newThemeName.value) return;
  
  const themeName = newThemeName.value;
  
  // Create new theme object with current settings
  const newTheme = {
    backgroundColor: localSettings.value.backgroundColor,
    timerColor: localSettings.value.timerColor,
    textColor: localSettings.value.textColor,
    navBackgroundColor: localSettings.value.navBackgroundColor,
    navTextColor: localSettings.value.navTextColor,
    statsBackgroundColor: localSettings.value.statsBackgroundColor,
    historyBackgroundColor: localSettings.value.historyBackgroundColor,
    backgroundUrl: localSettings.value.backgroundUrl,
    backgroundType: localSettings.value.backgroundType
  };
  
  // Initialize customThemes if it doesn't exist
  if (!localSettings.value.customThemes) {
    localSettings.value.customThemes = {};
  }
  
  // Save to localSettings
  localSettings.value.customThemes[themeName] = newTheme;
  
  // Select the new theme
  localSettings.value.theme = themeName;
  selectedSkin.value = themeName;
  
  // Clear input
  newThemeName.value = '';
};

const exportTheme = async () => {
  const themeToExport = {
    backgroundColor: localSettings.value.backgroundColor,
    timerColor: localSettings.value.timerColor,
    textColor: localSettings.value.textColor,
    navBackgroundColor: localSettings.value.navBackgroundColor,
    navTextColor: localSettings.value.navTextColor,
    statsBackgroundColor: localSettings.value.statsBackgroundColor,
    historyBackgroundColor: localSettings.value.historyBackgroundColor,
    backgroundUrl: localSettings.value.backgroundUrl,
    backgroundType: localSettings.value.backgroundType
  };

  // Convert blob URL to base64 if necessary
  if (themeToExport.backgroundUrl && themeToExport.backgroundUrl.startsWith('blob:')) {
    try {
      const response = await fetch(themeToExport.backgroundUrl);
      const blob = await response.blob();
      
      await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          themeToExport.backgroundUrl = reader.result;
          resolve();
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to convert background image to base64:', error);
      // Fallback: keep the blob URL (though it won't work on other devices) or set to null
    }
  }

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(themeToExport, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", (selectedSkin.value === 'custom' ? 'custom_theme' : selectedSkin.value) + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const applySkin = () => {
  const skinName = selectedSkin.value;
  localSettings.value.theme = skinName;
  
  let skin = skinPresets[skinName];
  
  // Check if it's a custom theme
  if (!skin && localSettings.value.customThemes && localSettings.value.customThemes[skinName]) {
    skin = localSettings.value.customThemes[skinName];
  }
  
  if (skin) {
    localSettings.value.backgroundColor = skin.backgroundColor;
    localSettings.value.timerColor = skin.timerColor;
    localSettings.value.textColor = skin.textColor;
    localSettings.value.navBackgroundColor = skin.navBackgroundColor;
    localSettings.value.navTextColor = skin.navTextColor;
    localSettings.value.statsBackgroundColor = skin.statsBackgroundColor;
    localSettings.value.historyBackgroundColor = skin.historyBackgroundColor;
    localSettings.value.backgroundUrl = skin.backgroundUrl;
    localSettings.value.backgroundType = skin.backgroundType;
  }
};

const triggerImport = () => {
  importFileInput.value.click();
};

const handleImportFile = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedTheme = JSON.parse(e.target.result);
      
      // Basic validation: check if it has at least one color property
      if (!importedTheme.backgroundColor) {
        alert('Invalid theme file');
        return;
      }

      // Apply imported settings
      localSettings.value.backgroundColor = importedTheme.backgroundColor;
      localSettings.value.timerColor = importedTheme.timerColor;
      localSettings.value.textColor = importedTheme.textColor;
      localSettings.value.navBackgroundColor = importedTheme.navBackgroundColor;
      localSettings.value.navTextColor = importedTheme.navTextColor;
      localSettings.value.statsBackgroundColor = importedTheme.statsBackgroundColor;
      localSettings.value.historyBackgroundColor = importedTheme.historyBackgroundColor;
      localSettings.value.backgroundUrl = importedTheme.backgroundUrl;
      localSettings.value.backgroundType = importedTheme.backgroundType || 'image';

      // Switch to 'custom' mode to show the imported theme
      localSettings.value.theme = 'custom';
      selectedSkin.value = 'custom';

      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error importing theme:', error);
      alert('Error importing theme');
    }
  };
  reader.readAsText(file);
};

const sections = [
  { id: 'general', label: 'General' },
  { id: 'skin', label: 'Skin' },
  { id: 'connection', label: 'Connection' },
  { id: 'account', label: 'Account' },
  { id: 'timer', label: 'Timer' }
];

const translations = {
  en: {
    general: 'General',
    display: 'Display',
    skin: 'Skin',
    connection: 'Connection',
    account: 'Account',
    timer: 'Timer',
    language: 'Language',
    useInspection: 'Use Inspection',
    timerFont: 'Timer Font',
    timerColor: 'Timer Color',
    backgroundColor: 'Background Color',
    textColor: 'Font Color',
    navBackgroundColor: 'Menu Background',
    navTextColor: 'Menu Font Color',
    statsBackgroundColor: 'Stats Background',
    historyBackgroundColor: 'History Background',
    backgroundImage: 'Background Image/Video',
    theme: 'Theme',
    presetSkin: 'Preset Skin',
    createTheme: 'Create Theme',
    newThemePlaceholder: 'New Theme Name',
    exportTheme: 'Export Theme',
    importTheme: 'Import Theme'
  },
  fr: {
    general: 'Général',
    display: 'Affichage',
    skin: 'Skin',
    connection: 'Connection',
    account: 'Compte',
    timer: 'Chronomètre',
    language: 'Langue',
    useInspection: 'Utiliser l\'inspection',
    timerFont: 'Police du Timer',
    timerColor: 'Couleur du Timer',
    backgroundColor: 'Couleur de fond',
    textColor: 'Couleur de la police',
    navBackgroundColor: 'Fond du menu',
    navTextColor: 'Couleur police menu',
    statsBackgroundColor: 'Fond des moyennes',
    historyBackgroundColor: 'Fond de l\'historique',
    backgroundImage: 'Image/Vidéo de fond',
    theme: 'Thème',
    presetSkin: 'Skin Prédéfini',
    createTheme: 'Créer Thème',
    newThemePlaceholder: 'Nom du nouveau thème',
    exportTheme: 'Exporter Thème',
    importTheme: 'Importer Thème'
  }
};

watch(() => props.settings, (newSettings) => {
  localSettings.value = { ...newSettings };
  // Update selectedSkin when props change
  if (['default', 'blue', 'dark', 'fire', 'nature', 'winter'].includes(newSettings.theme)) {
    selectedSkin.value = newSettings.theme;
  } else if (newSettings.customThemes && newSettings.customThemes[newSettings.theme]) {
    selectedSkin.value = newSettings.theme;
  } else {
    selectedSkin.value = 'custom';
  }
}, { deep: true });

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    localSettings.value.backgroundUrl = url;
    localSettings.value.backgroundType = type;
    
    // If we are editing a named custom theme, update it
    if (localSettings.value.customThemes && localSettings.value.customThemes[selectedSkin.value]) {
       localSettings.value.customThemes[selectedSkin.value].backgroundUrl = url;
       localSettings.value.customThemes[selectedSkin.value].backgroundType = type;
    } else {
      // Otherwise switch to generic custom
      localSettings.value.theme = 'custom';
      selectedSkin.value = 'custom';
    }
  }
};

// Watch for manual color changes
watch(() => [
  localSettings.value.timerColor,
  localSettings.value.backgroundColor,
  localSettings.value.textColor,
  localSettings.value.navBackgroundColor,
  localSettings.value.navTextColor,
  localSettings.value.statsBackgroundColor,
  localSettings.value.historyBackgroundColor
], () => {
  const currentTheme = selectedSkin.value;
  
  // If we are currently on a named custom theme, update its values
  if (localSettings.value.customThemes && localSettings.value.customThemes[currentTheme]) {
    const updatedTheme = {
      backgroundColor: localSettings.value.backgroundColor,
      timerColor: localSettings.value.timerColor,
      textColor: localSettings.value.textColor,
      navBackgroundColor: localSettings.value.navBackgroundColor,
      navTextColor: localSettings.value.navTextColor,
      statsBackgroundColor: localSettings.value.statsBackgroundColor,
      historyBackgroundColor: localSettings.value.historyBackgroundColor,
      backgroundUrl: localSettings.value.backgroundUrl,
      backgroundType: localSettings.value.backgroundType
    };
    localSettings.value.customThemes[currentTheme] = updatedTheme;
  } else if (currentTheme !== 'custom') {
    // If we are on a preset (default, blue, etc.) and change a color, switch to 'custom'
    // UNLESS we just switched to it via applySkin (which we can't easily distinguish here without more state)
    // But applySkin updates the values, which triggers this watch.
    // We need to check if the values match the preset. If they don't, then it's a manual change.
    // Simplified approach: If the current theme is a preset, we switch to 'custom' on change.
    // BUT applySkin sets the values, triggering this.
    // We can check if the values match the selected preset.
    
    const preset = skinPresets[currentTheme];
    if (preset) {
       const isMatch = 
         localSettings.value.backgroundColor === preset.backgroundColor &&
         localSettings.value.timerColor === preset.timerColor &&
         localSettings.value.textColor === preset.textColor &&
         localSettings.value.navBackgroundColor === preset.navBackgroundColor &&
         localSettings.value.navTextColor === preset.navTextColor &&
         localSettings.value.statsBackgroundColor === preset.statsBackgroundColor &&
         localSettings.value.historyBackgroundColor === preset.historyBackgroundColor;
         
       if (!isMatch) {
         localSettings.value.theme = 'custom';
         selectedSkin.value = 'custom';
       }
    }
  }
});

const close = () => {
  emit('close');
};

const saveAndClose = () => {
  emit('update-settings', { ...localSettings.value });
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  display: flex;
  width: 700px;
  height: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.settings-sidebar {
  width: 200px;
  background-color: #f5f5f5;
  padding: 20px 0;
  border-right: 1px solid #eee;
}

.sidebar-item {
  padding: 15px 20px;
  cursor: pointer;
  color: #353535;
  transition: background-color 0.2s;
}

.sidebar-item:hover {
  background-color: #e0e0e0;
}

.sidebar-item.active {
  background-color: #d0d0d0;
  font-weight: bold;
}

.settings-main {
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  overflow-y: auto;
  padding-right: 10px; /* Add some padding for the scrollbar */
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.setting-input {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.color-picker {
  width: 50px;
  height: 30px;
  border: none;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.setting-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.modal-footer {
  margin-top: auto;
  text-align: right;
}

.ok-button {
  background-color: #353535;
  color: white;
  border: none;
  padding: 10px 30px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ok-button:hover {
  background-color: #555;
}

.momo-trust-display-regular {
  font-family: "Momo Trust Display", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.new-theme-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.create-theme-btn {
  background-color: #353535;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
}

.create-theme-btn:hover {
  background-color: #555;
}
</style>
