<template>
  <div>
    <button class="scroll-button scroll-top" @click="scrollToBottom">
      <slot name="top-button"></slot> 
    </button>
    <button class="scroll-button scroll-bottom" @click="scrollToTop">
      <slot name="bottom-button"></slot> 
    </button>
  </div>
</template>

<script setup>
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const scrollToBottom = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });
};
</script>

<style scoped>
.scroll-button {
  position: fixed;
  z-index: 1000;
  padding: 0px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  /* background-color: #1890ff; */
  color: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.scroll-top {
  top: 80px;
  right: 20px;
}

.scroll-bottom {
  bottom: 10px;
  right: 20px;
}
</style>
