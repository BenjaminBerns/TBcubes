<template>
  <div class="cube-schema">
    <div 
      v-for="(row, rowIndex) in pattern" 
      :key="rowIndex" 
      class="cube-row"
    >
      <div 
        v-for="(cell, cellIndex) in row" 
        :key="cellIndex" 
        class="cube-cell"
        :class="{ 'is-yellow': cell === 1 }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pattern: {
    type: Array,
    required: true,
    // Expecting a 3x3 matrix of 0s and 1s
    // [[0,0,0], [0,1,0], [0,0,0]]
  }
});
</script>

<style scoped>
.cube-schema {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-color: #000;
  padding: 2px;
  border-radius: 4px;
  width: fit-content;
}

.cube-row {
  display: flex;
  gap: 2px;
}

.cube-cell {
  width: 20px;
  height: 20px;
  background-color: #444; /* Default gray/black */
  border-radius: 2px;
}

.cube-cell.is-yellow {
  background-color: #FFD700; /* Yellow */
}
</style>
