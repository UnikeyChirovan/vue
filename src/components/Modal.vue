<template>
    <teleport to="body">
        <transition leave-active-class="fade-out">
            <div v-show="show" class="modal-wrapper" scroll-region>
                <transition
                    enter-active-class="fade-in"
                    enter-from-class="fade-enter"
                    enter-to-class="fade-enter-active"
                    leave-active-class="fade-out"
                    leave-from-class="fade-leave-active"
                    leave-to-class="fade-leave"
                >
                    <div v-show="show" class="modal-backdrop" @click="close"></div>
                </transition>

                <transition
                    enter-active-class="modal-enter-active"
                    enter-from-class="modal-enter"
                    enter-to-class="modal-enter-to"
                    leave-active-class="modal-leave-active"
                    leave-from-class="modal-leave"
                    leave-to-class="modal-leave-to"
                >
                    <div
                        v-show="show"
                        class="modal-content"
                        :class="maxWidthClass"
                    >
                        <slot v-if="show" />
                    </div>
                </transition>
            </div>
        </transition>
    </teleport>
</template>
<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    maxWidth: {
        type: String,
        default: '2xl',
    },
    closeable: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['close']);

watch(
    () => props.show,
    () => {
        if (props.show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = null;
        }
    }
);

const close = () => {
    if (props.closeable) {
        emit('close');
    }
};

const closeOnEscape = (e) => {
    if (e.key === 'Escape' && props.show) {
        close();
    }
};

onMounted(() => document.addEventListener('keydown', closeOnEscape));

onUnmounted(() => {
    document.removeEventListener('keydown', closeOnEscape);
    document.body.style.overflow = null;
});

const maxWidthClass = computed(() => {
    return {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[props.maxWidth];
});

</script>
<style scoped>
.modal-wrapper {
    position: fixed;
    inset: 0;
    overflow-y: auto;
    z-index: 50;
    padding: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(75, 85, 99, 0.75); /* Thay thế bg-gray-500 opacity-75 */
}

.modal-content {
    background-color: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    width: 100%;
    margin-bottom: 1.5rem;
}

.modal-enter-active, .modal-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter {
    opacity: 0;
    transform: translateY(1rem);
}

.modal-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.modal-leave {
    opacity: 1;
    transform: translateY(0);
}

.modal-leave-to {
    opacity: 0;
    transform: translateY(1rem);
}

/* Transition for fade in/out */
.fade-in {
    opacity: 1;
    transition: opacity 0.3s ease;
}

.fade-out {
    opacity: 0;
    transition: opacity 0.3s ease;
}

/* Add custom class for max-width sizes */
.sm\:max-w-sm { max-width: 24rem; }
.sm\:max-w-md { max-width: 28rem; }
.sm\:max-w-lg { max-width: 32rem; }
.sm\:max-w-xl { max-width: 36rem; }
.sm\:max-w-2xl { max-width: 42rem; }
</style>
