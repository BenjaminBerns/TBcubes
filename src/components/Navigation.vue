<template>
  <nav class="nav-container color-gray-500">
    <div v-for="(item, index) in menuItems" :key="index" class="nav-section">
      <div class="nav-header" @click="toggleSection(index)">
        <span class="arrow" :class="{ 'open': item.isOpen }">▶</span>
        <div class="nav-label momo-trust-display-regular">{{ item.label }}</div>
      </div>
      <div v-show="item.isOpen" class="nav-children">
        <a v-for="(child, childIndex) in item.children" :key="childIndex" href="#" class="nav-link momo-trust-display-regular">
          {{ child.label }}
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const menuItems = ref([
  {
    label: 'Timer',
    isOpen: false,
    children: [
      { label: 'Sessions 2x2' },
      { label: 'Sessions 3x3' }
    ]
  },
  {
    label: 'Training',
    isOpen: false,
    children: [
      { label: 'Megaminx' }
    ]
  },
  {
    label: 'Learning',
    isOpen: false,
    children: []
  }
]);

const toggleSection = (index) => {
  menuItems.value[index].isOpen = !menuItems.value[index].isOpen;
};
</script>

<style scoped>
.nav-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background-color: #353535;
  width: 250px; /* Fixed width on desktop */
  height: 100%;
  /* Removed absolute positioning */
}

@media (max-width: 768px) {
  .nav-container {
    width: 100%;
    height: auto;
    position: relative;
    padding: 10px;
  }
}

.nav-section {
  margin-bottom: 20px;
  width: 100%;
}

.nav-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
}

.arrow {
  color: #D9D9D9;
  font-size: 0.8rem;
  margin-right: 10px;
  transition: transform 0.3s ease;
  display: inline-block;
}

.arrow.open {
  transform: rotate(90deg);
}

.nav-label {
  font-size: 1.2rem;
  font-weight: bold;
  color: #D9D9D9;
  text-transform: uppercase;
}

.nav-children {
  display: flex;
  flex-direction: column;
  padding-left: 25px; /* Indent children */
}

.nav-link {
  color: #D9D9D9;
  text-decoration: none;
  margin-bottom: 5px;
  font-size: 1rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 1;
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
