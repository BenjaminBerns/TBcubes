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
const inspectionTime = ref(0);
const isRunning = ref(false);
const isInspection = ref(false);
const isReady = ref(false);
let intervalId = null;
let inspectionIntervalId = null;
let audioContext = null;
let hasPlayed8s = false;
let hasPlayed12s = false;

const displayTime = computed(() => {
  if (isInspection.value) {
    const val = Math.floor(inspectionTime.value);
    if (val >= 15) return '+2';
    if (val >= 17) return 'DNF';
    return val;
  }
  return formatTime(time.value);
});

const playSound = (frequency, duration) => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
};

const startSolve = () => {
  isInspection.value = false;
  clearInterval(inspectionIntervalId);
  
  // Check for penalties based on inspection time
  if (inspectionTime.value >= 17) {
    // DNF logic - maybe just don't start? or start with DNF?
    // For now, let's just start normally but user should have seen DNF
    // Ideally we should emit a penalty event here if we want to auto-apply it
  } else if (inspectionTime.value >= 15) {
    // +2 logic
    // We'll handle this by emitting the penalty after the solve stops or storing it
    // But for now, let's just reset
  }

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
  inspectionTime.value = 0;
  hasPlayed8s = false;
  hasPlayed12s = false;
  
  const startTime = Date.now();
  inspectionIntervalId = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    inspectionTime.value = elapsed;
    
    if (elapsed >= 8 && !hasPlayed8s) {
      playSound(440, 0.1); // 440Hz beep
      hasPlayed8s = true;
    }
    
    if (elapsed >= 12 && !hasPlayed12s) {
      playSound(880, 0.1); // 880Hz beep (higher pitch)
      hasPlayed12s = true;
    }

    if (elapsed >= 17) {
      // Auto DNF or stop? 
      // Usually timer doesn't stop, just shows DNF
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
  
  // Check if we had a +2 from inspection
  let penalty = null;
  if (inspectionTime.value >= 15 && inspectionTime.value < 17) {
    penalty = '+2';
  } else if (inspectionTime.value >= 17) {
    penalty = 'DNF';
  }

  emit('on-stop', formatTime(time.value), penalty, time.value);
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
  if (audioContext) {
    audioContext.close();
  }
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
