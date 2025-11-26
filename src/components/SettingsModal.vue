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

        <!-- Display Section -->
        <div v-if="activeSection === 'display'" class="settings-group">
          <div class="setting-item">
            <label class="momo-trust-display-regular color-gray-500">
              {{ translations[localSettings.language].theme }}:
            </label>
            <select v-model="localSettings.theme" class="setting-input momo-trust-display-regular">
              <option value="default">Default</option>
              <option value="blue">Blue Night</option>
              <option value="dark">Dark Mode</option>
            </select>
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
        </div>

        <!-- Skin Section -->
        <div v-if="activeSection === 'skin'" class="settings-group">
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
      theme: 'default'
    })
  }
});

const emit = defineEmits(['close', 'update-settings']);

const localSettings = ref({ ...props.settings });
const activeSection = ref('general');

const sections = [
  { id: 'general', label: 'General' },
  { id: 'display', label: 'Display' },
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
    backgroundImage: 'Background Image/Video',
    theme: 'Theme'
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
    backgroundImage: 'Image/Vidéo de fond',
    theme: 'Thème'
  }
};

watch(() => props.settings, (newSettings) => {
  localSettings.value = { ...newSettings };
}, { deep: true });

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    localSettings.value.backgroundUrl = url;
    localSettings.value.backgroundType = type;
  }
};

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

.color-gray-500 {
  color: #353535;
}
</style>
