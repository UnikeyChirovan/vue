<template>
    <div>
        <h2>Câu Chuyện Thành Công</h2>
        <p><strong>{{ story.customer }}</strong>: {{ story.story }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    story : Object
})
</script>
