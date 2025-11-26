<template>
  <div class="save-container">
    <h2 class="momo-trust-display-regular color-gray-500 header-title">{{ translations.savedTimes }}</h2>
    <div class="table-container">
      <table class="time-table">
        <thead>
          <tr class="momo-trust-display-regular color-gray-500">
            <th class="delete-col"></th>
            <th>{{ translations.time }}</th>
            <th>{{ translations.avg5 }}</th>
            <th>{{ translations.avg12 }}</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(item, index) in processedTimes" 
            :key="item.originalIndex" 
            class="time-row momo-trust-display-regular color-gray-500"
            @click="openModal(item)"
          >
            <td class="delete-col">
              <button class="delete-btn" @click.stop="confirmDelete(item.originalIndex)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
              </button>
            </td>
            <td>{{ item.time }}</td>
            <td>{{ item.avg5 }}</td>
            <td>{{ item.avg12 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <TimeModal 
      :isVisible="isModalOpen" 
      :data="selectedTimeData" 
      @close="closeModal" 
      @toggle-penalty="(type) => handleTogglePenalty(selectedTimeData.originalIndex, type)"
    />
    <DeleteConfirmationModal
      :isVisible="isDeleteModalOpen"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import TimeModal from './TimeModal.vue';
import DeleteConfirmationModal from './DeleteConfirmationModal.vue';
import { formatTime } from '../utils/formatTime';

const props = defineProps({
  times: {
    type: Array,
    required: true
  },
  translations: {
    type: Object,
    required: true,
    default: () => ({
      savedTimes: 'Saved Times',
      time: 'Time',
      avg5: 'Avg 5',
      avg12: 'Avg 12'
    })
  }
});

const emit = defineEmits(['delete-time', 'toggle-penalty']);

const isModalOpen = ref(false);
const selectedTimeData = ref({});
const isDeleteModalOpen = ref(false);
const timeToDeleteIndex = ref(null);

const openModal = (item) => {
  selectedTimeData.value = item;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const confirmDelete = (index) => {
  timeToDeleteIndex.value = index;
  isDeleteModalOpen.value = true;
};

const handleDelete = () => {
  if (timeToDeleteIndex.value !== null) {
    emit('delete-time', timeToDeleteIndex.value);
    timeToDeleteIndex.value = null;
  }
  isDeleteModalOpen.value = false;
};

const cancelDelete = () => {
  timeToDeleteIndex.value = null;
  isDeleteModalOpen.value = false;
};

const handleTogglePenalty = (index, type) => {
  emit('toggle-penalty', index, type);
};

const calculateAverage = (times, size) => {
  if (times.length < size) return '-';

  let validTimes = times.map(t => {
    let val = parseFloat(t.time);
    if (t.penalty === '+2') val += 2;
    if (t.penalty === 'DNF') val = Infinity;
    return val;
  });

  // Count DNFs
  const dnfCount = validTimes.filter(t => t === Infinity).length;
  
  // If more than 1 DNF, average is DNF
  if (dnfCount > 1) return 'DNF';

  // Sort to remove best and worst
  validTimes.sort((a, b) => a - b);

  // Remove best (first) and worst (last)
  // If 1 DNF, it will be at the end (Infinity) and removed as worst
  validTimes = validTimes.slice(1, -1);

  const sum = validTimes.reduce((acc, val) => acc + val, 0);
  return formatTime(sum / (size - 2));
};

const processedTimes = computed(() => {
  return props.times.map((entry, index) => {
    const timeValue = parseFloat(entry.time);
    let displayTime = formatTime(timeValue);
    
    if (entry.penalty === '+2') {
      displayTime = formatTime(timeValue + 2) + '+';
    } else if (entry.penalty === 'DNF') {
      displayTime = 'DNF';
    }

    let avg5 = '-';
    let avg12 = '-';

    if (index >= 4) {
      const slice5 = props.times.slice(index - 4, index + 1);
      avg5 = calculateAverage(slice5, 5);
    }

    if (index >= 11) {
      const slice12 = props.times.slice(index - 11, index + 1);
      avg12 = calculateAverage(slice12, 12);
    }

    return {
      originalIndex: index,
      time: displayTime,
      rawTime: entry.time,
      scramble: entry.scramble,
      date: entry.date,
      penalty: entry.penalty,
      avg5,
      avg12
    };
  }).reverse();
});
</script>

<style scoped>
.save-container {
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
  border-left: 1px solid #eee;
  width: 300px;
  background-color: var(--table-bg-color, #ffffff);
  color: var(--table-text-color, #353535);
  font-size: 0.9rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.header-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  opacity: 0.7;
  color: var(--table-text-color, #353535);
}

.table-container {
  width: 100%;
}

.time-table {
  width: 100%;
  border-collapse: collapse;
}

.time-table th {
  text-align: left;
  padding-bottom: 10px;
  font-weight: normal;
  opacity: 0.6;
  font-size: 0.8rem;
  border-bottom: 1px solid #eee;
  color: var(--table-text-color, #353535);
}

.time-table td {
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
  vertical-align: middle;
  color: var(--table-text-color, #353535);
}

.delete-col {
  width: 30px;
  text-align: center;
}

.delete-btn {
  background-color: #ff4d4d;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  opacity: 0.8;
  transition: opacity 0.2s, transform 0.1s;
}

.delete-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.time-row {
  opacity: 0.8;
  transition: background-color 0.2s, opacity 0.2s;
  cursor: pointer;
}

.time-row:hover {
  background-color: rgba(0, 0, 0, 0.05);
  opacity: 1;
}

@media (max-width: 768px) {
  .save-container {
    width: 100%;
    height: auto;
    border-left: none;
    border-top: 1px solid #eee;
    max-height: 300px;
  }
}

.momo-trust-display-regular {
  font-family: "Momo Trust Display", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.color-gray-500 {
  color: var(--table-text-color, #353535);
}
</style>
