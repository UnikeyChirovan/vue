<script setup>
import { useGeneralStore } from '../stores/general';
import { storeToRefs } from 'pinia';

const useGeneral = useGeneralStore();
const { isImageDisplay } = storeToRefs(useGeneral);
</script>

<template>
    <div id="ImageDisplay" class="modal">
        <button 
            @click="isImageDisplay = null" 
            class="close-btn"
        >
            <i class="fas fa-times"></i>
        </button>
        <div class="modal-content">
            <img class="modal-image" :src="isImageDisplay" alt="Displayed Image" />
        </div>
    </div>
</template>

<style scoped>
.modal {
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    background-color: #e0e0e0;
    border: none;
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
    font-size: 24px;
}

.close-btn:hover {
    background-color: #d0d0d0;
}

.modal-content {
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-image {
    max-height: 90vh;
    max-width: 90vw;
    object-fit: contain;
}
</style>
