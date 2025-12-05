<template>
  <div class="save-container">
    <div class="header-container">
      <h2 class="momo-trust-display-regular color-gray-500 header-title">{{ translations.savedTimes }}</h2>
      <div class="header-actions">
        <button class="export-btn" @click="exportToCSV" title="Export CSV">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
        </button>
        <div class="session-selector">
          <select 
            :value="currentSession" 
            @change="$emit('update-session', $event.target.value)"
            class="session-dropdown momo-trust-display-regular"
          >
            <option v-for="session in availableSessions" :key="session" :value="session">
              {{ session }}
            </option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="stats-table-container">
      <table class="stats-table momo-trust-display-regular">
        <thead>
          <tr>
            <th></th>
            <th class="color-gray-500">en cours</th>
            <th class="color-gray-500">meilleure</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="color-gray-500 label-col">temps</td>
            <td class="color-gray-500">{{ stats.current.time }}</td>
            <td class="color-gray-500">{{ stats.best.time }}</td>
          </tr>
          <tr>
            <td class="color-gray-500 label-col">mo3</td>
            <td class="color-gray-500">{{ stats.current.mo3 }}</td>
            <td class="color-gray-500">{{ stats.best.mo3 }}</td>
          </tr>
          <tr>
            <td class="color-gray-500 label-col">ao5</td>
            <td class="color-gray-500">{{ stats.current.ao5 }}</td>
            <td class="color-gray-500">{{ stats.best.ao5 }}</td>
          </tr>
          <tr>
            <td class="color-gray-500 label-col">ao12</td>
            <td class="color-gray-500">{{ stats.current.ao12 }}</td>
            <td class="color-gray-500">{{ stats.best.ao12 }}</td>
          </tr>
          <tr>
            <td class="color-gray-500 label-col">ao100</td>
            <td class="color-gray-500">{{ stats.current.ao100 }}</td>
            <td class="color-gray-500">{{ stats.best.ao100 }}</td>
          </tr>
        </tbody>
      </table>
    </div>

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
  currentSession: {
    type: String,
    required: true
  },
  availableSessions: {
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

const emit = defineEmits(['delete-time', 'toggle-penalty', 'update-session']);

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

const getValidTime = (t) => {
  let val = parseFloat(t.time);
  if (t.penalty === '+2') val += 2;
  if (t.penalty === 'DNF') val = Infinity;
  return val;
};

const calculateMean = (times, size) => {
  if (times.length < size) return '-';
  
  const validTimes = times.map(getValidTime).filter(t => t !== Infinity);
  if (validTimes.length === 0) return 'DNF';
  
  const sum = validTimes.reduce((acc, val) => acc + val, 0);
  return formatTime(sum / validTimes.length);
};

const calculateAverage = (times, size) => {
  if (times.length < size) return '-';

  let validTimes = times.map(getValidTime);
  const dnfCount = validTimes.filter(t => t === Infinity).length;

  // If there are DNFs, calculate mean of valid times (User request)
  if (dnfCount > 0) {
    validTimes = validTimes.filter(t => t !== Infinity);
    if (validTimes.length === 0) return 'DNF';
    const sum = validTimes.reduce((acc, val) => acc + val, 0);
    return formatTime(sum / validTimes.length);
  }

  // Standard WCA Average (Trimmed)
  // Sort to remove best and worst
  validTimes.sort((a, b) => a - b);

  // Number of times to remove from each end
  let trim = 1;
  if (size >= 100) trim = 5;

  validTimes = validTimes.slice(trim, -trim);

  const sum = validTimes.reduce((acc, val) => acc + val, 0);
  return formatTime(sum / (size - (trim * 2)));
};

const calculateBest = (times, size, type = 'avg') => {
  if (times.length < size) return '-';
  
  let best = Infinity;
  
  for (let i = 0; i <= times.length - size; i++) {
    const slice = times.slice(i, i + size);
    let result;
    if (type === 'mean') {
      result = calculateMean(slice, size);
    } else {
      result = calculateAverage(slice, size);
    }
    
    if (result !== '-' && result !== 'DNF') {
      const val = parseFloat(result);
      if (val < best) best = val;
    }
  }
  
  return best === Infinity ? '-' : formatTime(best);
};

const stats = computed(() => {
  const times = props.times;
  const len = times.length;
  
  const current = {
    time: len > 0 ? (() => {
      const val = getValidTime(times[len - 1]);
      return val === Infinity ? 'DNF' : formatTime(val);
    })() : '-',
    mo3: len >= 3 ? calculateMean(times.slice(len - 3), 3) : '-',
    ao5: len >= 5 ? calculateAverage(times.slice(len - 5), 5) : '-',
    ao12: len >= 12 ? calculateAverage(times.slice(len - 12), 12) : '-',
    ao100: len >= 100 ? calculateAverage(times.slice(len - 100), 100) : '-'
  };
  
  // Handle single time display for DNF
  if (len > 0 && times[len - 1].penalty === '+2' && current.time !== 'DNF') current.time += '+';

  // Best calculations
  const best = {
    time: len > 0 ? (() => {
      const valid = times.map(getValidTime).filter(t => t !== Infinity);
      return valid.length > 0 ? formatTime(Math.min(...valid)) : '-';
    })() : '-',
    mo3: calculateBest(times, 3, 'mean'),
    ao5: calculateBest(times, 5, 'avg'),
    ao12: calculateBest(times, 12, 'avg'),
    ao100: calculateBest(times, 100, 'avg')
  };

  return { current, best };
});

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

const exportToCSV = () => {
  const times = processedTimes.value;
  if (!times || times.length === 0) return;

  // Header row - using semi-colon for Excel compatibility in many regions
  const headers = ["No", "Time", "Penalty", "Scramble", "Date", "Ao5", "Ao12"];
  let csvContent = "";
  
  // Add separator instruction for Excel
  csvContent += "sep=;\n";
  csvContent += headers.join(";") + "\n";

  // Data rows
  times.forEach((t) => {
    const no = t.originalIndex + 1;
    const time = t.time; // already formatted
    const penalty = t.penalty || '';
    // Escape scramble, handle quotes
    const scramble = t.scramble ? `"${t.scramble.replace(/"/g, '""')}"` : '';
    const date = t.date ? new Date(t.date).toISOString().split('T')[0] : '';
    const ao5 = t.avg5;
    const ao12 = t.avg12;

    const row = [no, time, penalty, scramble, date, ao5, ao12].join(";");
    csvContent += row + "\n";
  });

  // Use Blob for better encoding handling (BOM for UTF-8)
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `tb_cube_session_${props.currentSession}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link); // Required for FF

  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
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

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.export-btn {
  background: transparent;
  border: 1px solid #ddd;
  color: var(--table-text-color, #353535);
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  height: 32px; /* Match height of select approximately */
  width: 32px;
}

.export-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}


.header-title {
  font-size: 1.2rem;
  opacity: 0.7;
  color: var(--table-text-color, #353535);
  margin-bottom: 0;
}

.session-dropdown {
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: transparent;
  color: var(--table-text-color, #353535);
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
}

.session-dropdown:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.stats-table-container {
  margin-bottom: 20px;
  padding: 10px;
  background-color: var(--stats-bg-color, transparent);
  border-radius: 8px;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--table-text-color, #353535);
}

.stats-table th {
  text-align: right;
  padding: 5px;
  font-weight: normal;
  font-size: 0.9rem;
}

.stats-table td {
  text-align: right;
  padding: 5px;
  font-size: 1rem;
}

.stats-table .label-col {
  text-align: left;
  font-weight: bold;
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
