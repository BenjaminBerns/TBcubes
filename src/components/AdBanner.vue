<template>
  <div class="ad-banner-container">
    <!-- Replace data-ad-client and data-ad-slot with your actual values -->
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
         data-ad-slot="XXXXXXXXXX"
         data-ad-format="auto"
         data-full-width-responsive="true"
         data-adtest="on"></ins>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.error('AdSense error:', e);
  }
});
</script>

<style scoped>
.ad-banner-container {
  width: 100%;
  min-height: 90px; /* Typical leaderboard height */
  background-color: #f0f0f0; /* Placeholder background */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-top: auto; /* Push to bottom if in flex container */
}
</style>
