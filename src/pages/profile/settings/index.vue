<template>Đây là trang quản lý settings</template>
<script setup>
import { useMenuProfile } from '../../../stores/use-menu-profile';
useMenuProfile().onSelectedKey(['profile-settings']);
</script>
