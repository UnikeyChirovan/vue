<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <slot></slot>
      <div class="modal-actions">
        <button @click="$emit('close')">Huỷ</button>
        <button @click="$emit('confirm')">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
}
.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
