<template>
  <div class="app-container">
    <Navigation />
    <div class="main-content">
      <img class="logo" src="../public/assets/logo.png" alt="logo">
      <Timer @on-stop="handleStop" />
    </div>
    <Save :times="savedTimes" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Timer from './components/Timer.vue';
import Save from './components/Save.vue';
import Navigation from './components/Navigation.vue';

const savedTimes = ref([]);

const handleStop = (time) => {
  savedTimes.value.push(time);
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: row;
  overflow: hidden; /* Prevent body scroll if children scroll */
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
    height: auto; /* Allow scrolling on mobile */
    overflow: auto;
  }

  .main-content {
    min-height: 50vh; /* Give some space for timer on mobile */
  }
}

.momo-trust-display-regular {
  font-family: "Momo Trust Display", sans-serif;
  font-weight: 400;
  font-style: normal;
}
 
.color-gray-500 {
  color: #353535;
}

.color-green-500 {
  color: #3C6E71;
}

.color-white-500 {
  color: #FFFFFF;
}

.color-gray-100 {
  color: #D9D9D9;
}

.color-blue-500 {
  color: #284B63;
}



.logo {
  width: 10%;
  height: 10%;
}

</style>
