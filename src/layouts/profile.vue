<template>
  <TheHeader />
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-2 d-none d-sm-flex m-0 p-0">
        <a-list bordered style="width: 100%">
          <template #header>
            <div>BẢNG ĐIỀU KHIỂN</div>
          </template>
          <TheMenuProfile />
        </a-list>
      </div>
      <div class="col-sm-10 col-12 m-0 p-0">
        <router-view></router-view>
      </div>
    </div>
    <div class="row">
      <div class="col-12 footer">Footer</div>
    </div>
  </div>
  <CropperModal
    v-if="isCropperModal"
    @showModal="isCropperModal = false"
  />

  <ImageDisplay
    v-if="isImageDisplay"
  />
</template>

<script setup>
import { useGeneralStore } from '../stores/general';
import { storeToRefs } from 'pinia';
const useGeneral = useGeneralStore();
const { isCropperModal, isImageDisplay } = storeToRefs(useGeneral);

import TheHeader from '../components/TheHeader.vue';
import TheMenuProfile from '../components/TheMenuProfile.vue';
import CropperModal from '../components/CropperModal.vue';
import ImageDisplay from '../components/ImageDisplay.vue';
</script>

<style>
  .footer {
    background-color: lightcoral;
    box-sizing: border-box;
  }
</style>
