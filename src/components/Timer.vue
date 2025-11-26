<template>
  <div class="timer-container">
    <div class="timer-display momo-trust-display-regular">
      {{ formattedTime }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const time = ref(0);
const isRunning = ref(false);
let intervalId = null;

const emit = defineEmits(['on-stop']);

const formattedTime = computed(() => {
  return time.value.toFixed(3);
});

const toggleTimer = () => {
  if (isRunning.value) {
    stopTimer();
  } else {
    startTimer();
  }
};

const startTimer = () => {
  time.value = 0; // Reset timer
  isRunning.value = true;
  const startTime = Date.now();
  intervalId = setInterval(() => {
    time.value = (Date.now() - startTime) / 1000;
  }, 10);
};

const stopTimer = () => {
  isRunning.value = false;
  clearInterval(intervalId);
  emit('on-stop', formattedTime.value);
};

const handleKeydown = (event) => {
  if (event.code === 'Space') {
    event.preventDefault(); // Prevent scrolling
    toggleTimer();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.timer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.timer-display {
  font-size: 5rem;
  color: #353535;
}

@media (max-width: 768px) {
  .timer-display {
    font-size: 3rem; /* Smaller font on mobile */
  }
}

.momo-trust-display-regular {
  font-family: "Momo Trust Display", sans-serif;
  font-weight: 400;
  font-style: normal;
}
</style>
