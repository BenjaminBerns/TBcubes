<template>
  <div class="save-container">
    <h2 class="momo-trust-display-regular color-gray-500">Saved Times</h2>
    <ul class="time-list">
      <li v-for="(time, index) in times" :key="index" class="time-item momo-trust-display-regular color-gray-500">
        {{ time }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  times: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.save-container {
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
  border-left: 1px solid #D9D9D9;
  width: 300px;
  background-color: #ffffff; /* Ensure background is set */
}

@media (max-width: 768px) {
  .save-container {
    width: 100%;
    height: auto;
    border-left: none;
    border-top: 1px solid #D9D9D9;
    max-height: 300px; /* Limit height on mobile */
  }
}

.time-list {
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
}

.time-item {
  font-size: 1.5rem;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
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
