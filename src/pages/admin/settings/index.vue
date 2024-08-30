<template>Đây là trang quản lý settings</template>
<script setup>
import { useMenu } from '../../../stores/use-menu';
useMenu().onSelectedKey(['admin-settings']);
</script>
