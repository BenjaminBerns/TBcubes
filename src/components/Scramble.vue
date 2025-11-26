<template>
  <div class="scramble-container">
    <p class="scramble-text momo-trust-display-regular color-gray-500">{{ scramble }}</p>
  </div>
</template>

<script setup>
defineProps({
  scramble: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.scramble-container {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.scramble-text {
  font-size: 2.5rem;
  font-weight: bold;
  letter-spacing: 2px;
  line-height: 1.5;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.momo-trust-display-regular {
  font-family: "Momo Trust Display", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.color-gray-500 {
  color: var(--text-color, #353535);
}

@media (max-width: 768px) {
  .scramble-text {
    font-size: 1.2rem;
  }
}
</style>
