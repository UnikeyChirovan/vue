<template>Đây là trang quản lý roles</template>
<script setup>
import { useMenu } from '../../../stores/use-menu';
useMenu().onSelectedKey(['admin-roles']);
</script>
