<template>
  <div class="leaderboard-container">
    <div class="leaderboard-header">
      <h2 class="momo-trust-display-regular color-gray-500">Daily Leaderboard</h2>
      <button class="close-btn" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
        </svg>
      </button>
    </div>

    <div class="session-selector">
      <select 
        v-model="selectedSession" 
        @change="loadLeaderboard" 
        class="session-dropdown momo-trust-display-regular"
      >
        <option v-for="session in availableSessions" :key="session" :value="session">
          {{ session }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading-state momo-trust-display-regular color-gray-500">
      Loading...
    </div>

    <div v-else-if="leaderboard.length === 0" class="empty-state momo-trust-display-regular color-gray-500">
      No times recorded today for this event. Be the first!
    </div>

    <div v-else class="table-container">
      <table class="leaderboard-table momo-trust-display-regular">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Time</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in leaderboard" :key="entry.rank" class="leaderboard-row">
            <td class="rank-col">
              <span class="rank-badge" :class="'rank-' + entry.rank">{{ entry.rank }}</span>
            </td>
            <td class="name-col">
              <div class="user-info">
                <img :src="entry.avatar_url || 'https://www.worldcubeassociation.org/assets/missing_avatar_thumb-12654dd6f1aa6d458e80d02d6eed8b1fbea050a544dcae61f308a0cc3320216c.png'" alt="Avatar" class="avatar">
                <span>{{ entry.name || 'Unknown' }}</span>
              </div>
            </td>
            <td class="time-col">{{ formatTime(entry.time) }}</td>
            <td class="country-col">
              <span v-if="entry.country_iso2" :class="'flag-icon flag-icon-' + entry.country_iso2.toLowerCase()"></span>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import SupabaseService from '../services/supabase';
import { formatTime } from '../utils/formatTime';

const props = defineProps({
  currentSession: {
    type: String,
    default: '3x3'
  },
  availableSessions: {
    type: Array,
    default: () => ['3x3', '2x2', '4x4', 'Pyraminx', 'Megaminx', 'Square-1', 'Blind']
  }
});

const emit = defineEmits(['close']);

const selectedSession = ref(props.currentSession);
const leaderboard = ref([]);
const loading = ref(false);

const loadLeaderboard = async () => {
  loading.value = true;
  try {
    leaderboard.value = await SupabaseService.getDailyLeaderboard(selectedSession.value);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadLeaderboard();
});

watch(() => props.currentSession, (newVal) => {
  selectedSession.value = newVal;
  loadLeaderboard();
});
</script>

<style scoped>
.leaderboard-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-width: 800px;
  margin: 0 auto;
}

.leaderboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color, #353535);
  opacity: 0.7;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

.session-selector {
  margin-bottom: 20px;
}

.session-dropdown {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.1);
  background: transparent;
  color: var(--text-color, #353535);
  font-size: 1rem;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  opacity: 0.7;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--text-color, #353535);
}

.leaderboard-table th {
  text-align: left;
  padding: 10px;
  font-weight: normal;
  opacity: 0.7;
  border-bottom: 2px solid rgba(0,0,0,0.05);
}

.leaderboard-table td {
  padding: 10px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  vertical-align: middle;
}

.rank-badge {
  display: inline-flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
}

.rank-1 { background-color: #FFD700; color: #353535; }
.rank-2 { background-color: #C0C0C0; color: #353535; }
.rank-3 { background-color: #CD7F32; color: #353535; }

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.time-col {
  font-family: monospace;
  font-size: 1.1rem;
}

.momo-trust-display-regular {
  font-family: "Momo Trust Display", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.color-gray-500 {
  color: var(--text-color, #353535);
}
</style>
