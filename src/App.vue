<template>
  <img class="logo" src="../public/assets/logo.png" alt="logo">
  <nav class="nav-container color-gray-500">
      <a href="#">Training</a>
      <a href="#">Timer</a>
      <a href="#">Learning</a>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
</script>

<style scoped>
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

.nav-container {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background-color: #353535;
  width: 10%;
  height: 100px;
}

.logo {
  width: 10%;
  height: 10%;
}

</style>
