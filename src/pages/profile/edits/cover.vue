<template>
  <div class="row mb-3">
    <div class="col-12 d-flex justify-content-center mb-3">
      <div
        class="custom-cover"
        :style="{ cursor: isEditingCover ? 'grab' : 'default' }"
        @mousedown="isEditingCover ? startDrag($event, 'cover') : null"
        @touchstart="isEditingCover ? startDrag($event, 'cover') : null"
      >
        <img
          :src="coverUrl || '../../../assets/cover  .jpg'"
          alt="Cover"
          class="img-cover-custom"
          :style="coverStyle"
        />
      </div>
    </div>

    <div class="col-12 d-flex justify-content-center">
      <a-button type="primary" @click="toggleCoverEditing">
        <i class="fa-solid fa-edit me-2"></i>
        <span>{{ isEditingCover ? 'Lưu Cover' : 'Sửa Cover' }}</span>
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useProfileStore } from '../../../stores/profile';
import { message } from 'ant-design-vue';

const profileStore = useProfileStore();
const users = reactive({
  cover_position: 0,
});

const coverUrl = ref(null);
const isEditingCover = ref(false);
const dragging = ref(false);
const dragType = ref(null); 
let startY = 0;
let originalCoverPosition = 0;

const coverStyle = ref({
  transform: 'translateY(0px)',
});

const toggleCoverEditing = () => {
  if (isEditingCover.value) {
    savePosition('cover');
  } else {
    originalCoverPosition = users.cover_position;
  }
  isEditingCover.value = !isEditingCover.value;
};

const startDrag = (event, type) => {
  dragging.value = true;
  dragType.value = type;
  startY = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY;
  originalCoverPosition = users.cover_position;
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('touchmove', onDrag);
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('keydown', onKeyDown);
};

const onDrag = (event) => {
  if (!dragging.value) return;
  const currentY = event.type.startsWith('mouse')
    ? event.clientY
    : event.touches[0].clientY;
  const deltaY = currentY - startY;
  startY = currentY;

  users.cover_position += deltaY;
  coverStyle.value.transform = `translateY(${users.cover_position}px)`;
  profileStore.updatePosition({
    cover_position: users.cover_position,
  });
};

const onKeyDown = (event) => {
  if (event.key === 'Escape' && dragging.value) {
    cancelDrag();
  }
};

const stopDrag = () => {
  dragging.value = false;
  dragType.value = null;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('touchend', stopDrag);
  window.removeEventListener('keydown', onKeyDown);
};

const cancelDrag = () => {
  users.cover_position = originalCoverPosition;
  coverStyle.value.transform = `translateY(${users.cover_position}px)`;
  stopDrag();
  message.info('Thao tác kéo đã bị hủy và vị trí đã được khôi phục.');
};


const savePosition = () => {
  const payload = {
    cover_position: users.value.cover_position,
  };

  api
    .put(`/profile/${id}/position`, payload)
    .then(() => {
      message.success('Vị trí Cover đã được lưu!');
      profileStore.updatePosition(payload);
    })
    .catch((error) => {
      message.error('Lưu vị trí Cover thất bại!');
      console.error('Error saving cover position:', error);
    });
};

</script>

<style scoped>
.custom-cover {
  width: 250px;
  height: calc(2 * (250px / 6.07));
  overflow: hidden;
  position: relative;
  border: 4px solid #4fb233;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-cover-custom {
  width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.custom-cover::before,
.custom-cover::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 25%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.custom-cover::before {
  top: 0;
}

.custom-cover::after {
  bottom: 0;
}

.ms-2 {
  margin-left: 0.5rem;
}
</style>
