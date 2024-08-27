<template>Đây là trang quản lý settings</template>
<script setup>
import { useMenu } from '../../../store/use-menu';
useMenu().onOpenKeys(['admin-settings']);
</script>
