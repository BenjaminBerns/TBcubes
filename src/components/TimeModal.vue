<template>
  <Teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <h1 class="time-display momo-trust-display-regular color-gray-500">{{ data.time }}</h1>
        <p class="scramble-display momo-trust-display-regular color-gray-500">{{ data.scramble }}</p>
        
        <div class="penalty-controls">
          <button 
            class="penalty-btn momo-trust-display-regular" 
            :class="{ active: data.penalty === '+2' }"
            @click="$emit('toggle-penalty', '+2')"
          >
            +2
          </button>
          <button 
            class="penalty-btn momo-trust-display-regular" 
            :class="{ active: data.penalty === 'DNF' }"
            @click="$emit('toggle-penalty', 'DNF')"
          >
            DNF
          </button>
        </div>

        <div class="stats-container momo-trust-display-regular color-gray-500">
          <div class="stat-item">
            <span class="stat-label">Avg 5:</span>
            <span class="stat-value">{{ data.avg5 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Avg 12:</span>
            <span class="stat-value">{{ data.avg12 }}</span>
          </div>
        </div>

        <p class="date-display momo-trust-display-regular color-gray-500">{{ formatDate(data.date) }}</p>

        <button class="close-button momo-trust-display-regular" @click="$emit('close')">OK</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  data: {
    type: Object,
    required: true,
    default: () => ({
      time: '0.000',
      scramble: '',
      avg5: '-',
      avg12: '-',
      date: new Date(),
      penalty: null
    })
  }
});

defineEmits(['close', 'toggle-penalty']);

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString();
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
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.time-display {
  font-size: 4rem;
  margin-bottom: 10px;
}

.scramble-display {
  font-size: 1.2rem;
  margin-bottom: 20px;
  line-height: 1.4;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.7;
}

.stat-value {
  font-size: 1.5rem;
}

.date-display {
  font-size: 0.9rem;
  opacity: 0.6;
  margin-bottom: 25px;
}

.close-button {
  background-color: #353535;
  color: white;
  border: none;
  padding: 10px 30px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #555;
}

.momo-trust-display-regular {
  font-family: "Momo Trust Display", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.penalty-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.penalty-btn {
  background: none;
  border: 1px solid #ddd;
  color: #353535;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px 15px;
  border-radius: 5px;
  transition: all 0.2s;
}

.penalty-btn:hover {
  background-color: #f5f5f5;
}

.penalty-btn.active {
  background-color: #E07A5F;
  color: white;
  border-color: #E07A5F;
}

.color-gray-500 {
  color: #353535;
}
</style>
