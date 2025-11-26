<template>
  <div class="timer-wrapper">
    <div class="timer-container">
      <div 
        class="timer-display momo-trust-display-regular" 
        :class="{ 
          'inspection-mode': isInspection,
          'ready': isReady && !isRunning
        }"
        :style="{ 
          fontFamily: settings.timerFont, 
          color: (isInspection || (isReady && !isRunning)) ? undefined : settings.timerColor 
        }"
      >
        {{ displayTime }}
      </div>
    </div>
    
    <div class="penalty-controls" v-if="lastTime && !isRunning && !isInspection">
      <button 
        class="penalty-btn momo-trust-display-regular" 
        :class="{ active: lastTime.penalty === '+2' }"
        @click="$emit('toggle-penalty', '+2')"
      >
        +2
      </button>
      <button 
        class="penalty-btn momo-trust-display-regular" 
        :class="{ active: lastTime.penalty === 'DNF' }"
        @click="$emit('toggle-penalty', 'DNF')"
      >
        DNF
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { formatTime } from '../utils/formatTime';

const props = defineProps({
  settings: {
    type: Object,
    required: true,
    default: () => ({ useInspection: false })
  },
  lastTime: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['on-stop', 'on-start', 'toggle-penalty']);

const time = ref(0);
const inspectionTime = ref(15);
const isRunning = ref(false);
const isInspection = ref(false);
const isReady = ref(false);
let intervalId = null;
let inspectionIntervalId = null;

const displayTime = computed(() => {
  if (isInspection.value) {
    return Math.ceil(inspectionTime.value);
  }
  return formatTime(time.value);
});

const startSolve = () => {
  isInspection.value = false;
  clearInterval(inspectionIntervalId);
  
  time.value = 0;
  isRunning.value = true;
  emit('on-start');
  
  const startTime = Date.now();
  intervalId = setInterval(() => {
    time.value = (Date.now() - startTime) / 1000;
  }, 10);
};

const startInspection = () => {
  isInspection.value = true;
  inspectionTime.value = 15;
  
  const startTime = Date.now();
  inspectionIntervalId = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    inspectionTime.value = 15 - elapsed;
    
    if (inspectionTime.value <= -2) { // DNF after +2
      stopInspection(); // Or handle DNF logic
    }
  }, 100);
};

const stopInspection = () => {
  isInspection.value = false;
  clearInterval(inspectionIntervalId);
};

const stopTimer = () => {
  isRunning.value = false;
  clearInterval(intervalId);
  emit('on-stop', formatTime(time.value));
};

const handleKeyDown = (e) => {
  if (e.code !== 'Space') return;
  
  if (isRunning.value) {
    stopTimer();
  } else {
    isReady.value = true;
  }
};

const handleKeyUp = (e) => {
  if (e.code !== 'Space') return;
  
  if (isReady.value) {
    isReady.value = false;
    
    if (isRunning.value) return; // Already handled in KeyDown
    
    if (isInspection.value) {
      startSolve();
    } else {
      if (props.settings.useInspection) {
        startInspection();
      } else {
        startSolve();
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  clearInterval(intervalId);
  clearInterval(inspectionIntervalId);
});
</script>

<style scoped>
.timer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
}

.timer-display {
  font-size: 5rem;
  color: var(--timer-color, #353535);
  user-select: none;
}

.ready {
  color: #3C6E71 !important; /* Green for ready */
}

.inspection-mode {
  color: #E07A5F !important; /* Orange/Red for inspection */
}

@media (max-width: 768px) {
  .timer-display {
    font-size: 3rem;
  }
}

.momo-trust-display-regular {
  font-family: "Momo Trust Display", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.timer-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.penalty-controls {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  height: 40px; /* Fixed height to prevent layout shift */
}

.penalty-btn {
  background: none;
  border: 1px solid transparent;
  color: #D9D9D9;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px 15px;
  border-radius: 5px;
  transition: all 0.2s;
}

.penalty-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #353535;
}

.penalty-btn.active {
  background-color: #E07A5F;
  color: white;
}
</style>
