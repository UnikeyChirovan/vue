<template>Đây là trang quản lý roles</template>
<script setup>
import { useMenu } from '../../../store/use-menu';
useMenu().onOpenKeys(['admin-roles']);
</script>
