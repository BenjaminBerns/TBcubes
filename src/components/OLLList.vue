<template>
  <div class="oll-list-container">
    <div class="header">
      <button class="back-btn" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
        Back
      </button>
      <h2 class="title momo-trust-display-regular">OLL Algorithms</h2>
    </div>

    <div class="oll-grid">
      <div v-for="oll in ollAlgorithms" :key="oll.id" class="oll-card">
        <div class="oll-header">
          <span class="oll-id">#{{ oll.id }}</span>
          <span class="oll-name" v-if="oll.name">{{ oll.name }}</span>
        </div>
        
        <div class="oll-content">
          <CubeSchema :pattern="oll.pattern" />

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ollAlgorithms } from '../data/oll.js';
import CubeSchema from './CubeSchema.vue';

defineEmits(['back']);
</script>

<style scoped>
.oll-list-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  color: var(--text-color);
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.back-btn {
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.title {
  font-size: 2rem;
}

.oll-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.oll-card {
  background-color: var(--nav-bg-color);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: transform 0.2s;
}

.oll-card:hover {
  transform: translateY(-2px);
}

.oll-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.oll-id {
  font-weight: bold;
  color: var(--timer-color);
}

.oll-name {
  color: var(--nav-text-color);
  opacity: 0.8;
}

.oll-content {
  display: flex;
  gap: 20px;
  align-items: center;
}



.momo-trust-display-regular {
  font-family: "Momo Trust Display", sans-serif;
}
</style>
