<template>
  <Teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click.self="$emit('cancel')">
      <div class="modal-content">
        <p class="confirmation-text momo-trust-display-regular color-gray-500">Etes vous sur de vouloir supprimer ce temps ?</p>
        <div class="button-container">
          <button class="confirm-button momo-trust-display-regular" @click="$emit('confirm')">OK</button>
          <button class="cancel-button momo-trust-display-regular" @click="$emit('cancel')">Retour</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isVisible: {
    type: Boolean,
    required: true
  }
});

defineEmits(['confirm', 'cancel']);
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
  z-index: 1001; /* Higher than TimeModal if needed, though they shouldn't overlap */
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.confirmation-text {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.confirm-button {
  background-color: #007bff; /* Blue */
  color: white;
  border: none;
  padding: 10px 30px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #353535; /* Dark Gray */
  color: white;
  border: none;
  padding: 10px 30px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #555;
}

.momo-trust-display-regular {
  font-family: "Momo Trust Display", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.color-gray-500 {
  color: #353535;
}
</style>
