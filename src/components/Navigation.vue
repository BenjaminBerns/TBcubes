<template>
  <div class="nav-container" :class="{ 'is-collapsed': !isOpen }">
    <div class="nav-header">
      <button class="toggle-btn" @click="toggleNav">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
        </svg>
      </button>
      <h2 v-if="isOpen" class="momo-trust-display-regular color-gray-500 nav-title">{{ translations.menu }}</h2>
    </div>
    
    <div class="nav-content" v-show="isOpen">
      <div class="nav-section">
        <h3 class="momo-trust-display-regular color-gray-500" @click="toggleSection('algorithms')">
          {{ translations.algorithms }} {{ openSections.algorithms ? '-' : '+' }}
        </h3>
        <ul v-if="openSections.algorithms" class="nav-list">
          <li class="momo-trust-display-regular color-gray-500">PLL</li>
          <li class="momo-trust-display-regular color-gray-500">OLL</li>
        </ul>
      </div>
      <div class="nav-section">
        <h3 class="momo-trust-display-regular color-gray-500" @click="toggleSection('tutorials')">
          {{ translations.tutorials }} {{ openSections.tutorials ? '-' : '+' }}
        </h3>
        <ul v-if="openSections.tutorials" class="nav-list">
          <li class="momo-trust-display-regular color-gray-500">Beginner</li>
          <li class="momo-trust-display-regular color-gray-500">Advanced</li>
        </ul>
      </div>
      
      <div class="settings-container">
        <button class="settings-btn" @click="$emit('open-settings')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.86z"/>
          </svg>
          <span class="settings-label momo-trust-display-regular">{{ translations.settings }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  translations: {
    type: Object,
    required: true,
    default: () => ({
      menu: 'Menu',
      algorithms: 'Algorithms',
      tutorials: 'Tutorials',
      settings: 'Settings'
    })
  }
});

const isOpen = ref(false); // Closed by default
const openSections = ref({
  algorithms: false,
  tutorials: false
});

const emit = defineEmits(['open-settings']);

const toggleNav = () => {
  isOpen.value = !isOpen.value;
};

const toggleSection = (section) => {
  openSections.value[section] = !openSections.value[section];
};
</script>

<style scoped>
.nav-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  padding-bottom: 40px;
  background-color: var(--nav-bg-color, #353535);
  width: 250px;
  height: 100%;
  color: var(--nav-text-color, white);
  position: relative;
  transition: width 0.3s ease, padding 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  overflow: hidden;
}

.nav-container.is-collapsed {
  width: 70px;
  padding: 20px 10px;
  align-items: center;
}

.nav-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  height: 40px;
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--nav-text-color, #D9D9D9);
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  z-index: 10;
}

.toggle-btn:hover {
  color: var(--nav-text-color, white);
  opacity: 0.8;
}

.nav-title {
  margin-left: 15px;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.3s;
  color: var(--nav-text-color, #D9D9D9);
}

.nav-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.nav-container.is-collapsed .nav-content {
  display: none;
}

.nav-section {
  margin-top: 20px;
  width: 100%;
}

.nav-section h3 {
  cursor: pointer;
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: var(--nav-text-color, #D9D9D9);
  white-space: nowrap;
}

.nav-list {
  list-style: none;
  padding-left: 15px;
}

.nav-list li {
  margin-bottom: 5px;
  color: var(--nav-text-color, #D9D9D9);
  cursor: pointer;
  transition: color 0.2s;
  opacity: 0.8;
}

.nav-list li:hover {
  opacity: 1;
}

.settings-container {
  margin-top: auto;
  padding-top: 20px;
  width: 100%;
}

.settings-btn {
  background: none;
  border: none;
  color: var(--nav-text-color, #D9D9D9);
  cursor: pointer;
  padding: 10px 0;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.settings-btn:hover {
  opacity: 1;
}

.settings-btn:hover svg {
  transform: rotate(45deg);
  transition: transform 0.2s;
}

.settings-label {
  font-size: 1rem;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .nav-container {
    position: absolute;
    z-index: 100;
    height: 100%;
  }
  
  .nav-container.is-collapsed {
    width: 60px;
    background-color: transparent;
    pointer-events: none;
  }

  .nav-container.is-collapsed .toggle-btn {
    pointer-events: auto;
    background-color: var(--nav-bg-color, #353535);
    border-radius: 4px;
  }
}

.momo-trust-display-regular {
  font-family: "Momo Trust Display", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.color-gray-500 {
  color: var(--nav-text-color, #D9D9D9);
}
</style>
