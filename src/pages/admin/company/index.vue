<template>
  <div>
    <a-card title="Quản Lý Thông Tin Công Ty" style="width: 100%">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-end">
          <a-button type="primary">
            <router-link :to="{ name: 'admin-company-create' }">
              <i class="fa-solid fa-plus"></i> Thêm Thông Tin
            </router-link>
          </a-button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <a-table :dataSource="companyInfos" :columns="companyColumns" :scroll="scrollOptions">
            <template #bodyCell="{ column, index, record }">
              <template v-if="column.key === 'index'">
                <span>{{ index + 1 }}</span>
              </template>
              <template v-if="column.key === 'webname'">
                <span>{{ record.webname }}</span>
              </template>
              <template v-if="column.key === 'address'">
                <span>{{ record.address }}</span>
              </template>
              <template v-if="column.key === 'phone'">
                <span>{{ record.phone }}</span>
              </template>
              <template v-if="column.key === 'email'">
                <span>{{ record.email }}</span>
              </template>
              <template v-if="column.key === 'action'">
                <router-link :to="{ name: 'admin-company-edit', params: { id: record.id } }">
                  <a-button type="primary" class="me-sm-2 me-2 mb-2">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </a-button>
                </router-link>
                <a-button type="primary" danger @click="showDeleteModal('company', record.id)">
                  <i class="fa-solid fa-trash"></i>
                </a-button>
              </template>
            </template>
          </a-table>
        </div>
      </div>
      <a-modal
        v-model:visible="isModalVisible"
        title="Xác nhận xóa thông tin"
        @ok="deleteInfo"
        @cancel="handleCancel"
      >
        <p>Bạn có chắc chắn muốn xóa thông tin này không?</p>
      </a-modal>
    </a-card>
    <a-card title="Quản Lý HeroSlide" style="width: 100%" class="mt-4">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-end">
          <a-button type="primary">
            <router-link :to="{ name: 'admin-hero-slide-create' }">
              <i class="fa-solid fa-plus"></i> Thêm HeroSlide
            </router-link>
          </a-button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <a-table :dataSource="heroSlides" :columns="heroSlideColumns" :scroll="scrollOptions">
            <template #bodyCell="{ column, index, record }">
              <template v-if="column.key === 'index'">
                <span>{{ index + 1 }}</span>
              </template>
              <template v-if="column.key === 'title'">
                <span>{{ record.title }}</span>
              </template>
              <template v-if="column.key === 'image'">
                <img :src="record.image" alt="Image" style="width: 50px; height: 50px;" />
              </template>
              <template v-if="column.key === 'description'">
                <span>{{ record.description }}</span>
              </template>
              <template v-if="column.key === 'action'">
                <router-link :to="{ name: 'admin-hero-slide-edit', params: { id: record.id } }">
                  <a-button type="primary" class="me-sm-2 me-2 mb-2">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </a-button>
                </router-link>
                <a-button type="primary" danger @click="showDeleteModal('heroSlide', record.id)">
                  <i class="fa-solid fa-trash"></i>
                </a-button>
              </template>
            </template>
          </a-table>
        </div>
      </div>
      <a-modal v-model:visible="isHeroSlideModalVisible" title="Xác nhận xóa HeroSlide" @ok="deleteHeroSlide" @cancel="handleHeroSlideCancel">
        <p>Bạn có chắc chắn muốn xóa HeroSlide này không?</p>
      </a-modal>
    </a-card>
    <a-card title="Quản Lý Future Project" style="width: 100%" class="mt-4">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-end">
          <a-button type="primary">
            <router-link :to="{ name: 'admin-future-project-create' }">
              <i class="fa-solid fa-plus"></i> Thêm Future Project
            </router-link>
          </a-button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
        <a-table :dataSource="futureProjects" :columns="futureProjectColumns" :scroll="scrollOptions">
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'name'">
              <span>{{ record.name }}</span>
            </template>
            <template v-if="column.key === 'timeline'">
              <span>{{ record.timeline }}</span>
            </template>
            <template v-if="column.key === 'description'">
              <span>{{ record.description }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <router-link :to="{ name: 'admin-future-project-edit', params: { id: record.id } }">
                <a-button type="primary" class="me-sm-2 me-2 mb-2">
                  <i class="fa-solid fa-pen-to-square"></i>
                </a-button>
              </router-link>
              <a-button type="primary" danger @click="showDeleteModal('futureProject', record.id)">
                <i class="fa-solid fa-trash"></i>
              </a-button>
            </template>
          </template>
        </a-table>

        </div>
      </div>
      <a-modal v-model:visible="isFutureProjectModalVisible" title="Xác nhận xóa Future Project" @ok="deleteFutureProject" @cancel="handleFutureProjectCancel">
        <p>Bạn có chắc chắn muốn xóa Future Project này không?</p>
      </a-modal>
    </a-card>
    <a-card title="Quản Lý Feature" style="width: 100%" class="mt-4">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-end">
          <a-button type="primary">
            <router-link :to="{ name: 'admin-feature-create' }">
              <i class="fa-solid fa-plus"></i> Thêm Feature
            </router-link>
          </a-button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <a-table :dataSource="features" :columns="featureColumns" :scroll="scrollOptions">
            <template #bodyCell="{ column, index, record }">
              <template v-if="column.key === 'index'">
                <span>{{ index + 1 }}</span>
              </template>
              <template v-if="column.key === 'title'">
                <span>{{ record.title }}</span>
              </template>
              <template v-if="column.key === 'icon'">
                <i :class="record.icon"></i>
              </template>
              <template v-if="column.key === 'description'">
                <span>{{ record.description }}</span>
              </template>
              <template v-if="column.key === 'action'">
                <router-link :to="{ name: 'admin-feature-edit', params: { id: record.id } }">
                  <a-button type="primary" class="me-sm-2 me-2 mb-2">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </a-button>
                </router-link>
                <a-button type="primary" danger @click="showDeleteModal('feature', record.id)">
                  <i class="fa-solid fa-trash"></i>
                </a-button>
              </template>
            </template>
          </a-table>
        </div>
      </div>
      <a-modal v-model:visible="isFeatureModalVisible" title="Xác nhận xóa Feature" @ok="deleteFeature" @cancel="handleFeatureCancel">
        <p>Bạn có chắc chắn muốn xóa Feature này không?</p>
      </a-modal>
    </a-card>

  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../../services/axiosInterceptor';
import { useMenu } from '../../../stores/use-menu';

const companyInfos = ref([]);
const heroSlides = ref([]);
const futureProjects = ref([]);
const features = ref([]);
const isMobile = ref(window.innerWidth < 600);
const scrollOptions = computed(() => (isMobile.value ? { x: 1200 } : { x: 576 }));

const companyColumns = [
  { title: '#', key: 'index', width: 50, align: 'center' },
  { title: 'Tên Công Ty', dataIndex: 'webname', key: 'webname', align: 'center' },
  { title: 'Địa Chỉ', dataIndex: 'address', key: 'address', align: 'center' },
  { title: 'Điện Thoại', dataIndex: 'phone', key: 'phone', align: 'center' },
  { title: 'Email', dataIndex: 'email', key: 'email', align: 'center' },
  { title: 'Công Cụ', key: 'action', align: 'center' },
];

const heroSlideColumns = [
  { title: '#', key: 'index', width: 50, align: 'center' },
  { title: 'Tiêu Đề', dataIndex: 'title', key: 'title', align: 'center' },
  { title: 'Round', dataIndex: 'round', key: 'round', align: 'center' },
  { title: 'Mô Tả', dataIndex: 'description', key: 'description', align: 'center' },
  { title: 'Công Cụ', key: 'action', align: 'center' },
];

const futureProjectColumns = [
  { title: '#', key: 'index', width: 50, align: 'center' },
  { title: 'Tên Dự Án', dataIndex: 'name', key: 'name', align: 'center' },
  { title: 'Thời Gian', dataIndex: 'timeline', key: 'timeline', align: 'center' },
  { title: 'Mô Tả', dataIndex: 'description', key: 'description', align: 'center' },
  { title: 'Công Cụ', key: 'action', align: 'center' },
];

const featureColumns = [
  { title: '#', key: 'index', width: 50, align: 'center' },
  { title: 'Tiêu Đề', dataIndex: 'title', key: 'title', align: 'center' },
  { title: 'Biểu Tượng', dataIndex: 'icon', key: 'icon', align: 'center' },
  { title: 'Mô Tả', dataIndex: 'description', key: 'description', align: 'center' },
  { title: 'Công Cụ', key: 'action', align: 'center' },
];

const getCompanyInfos = async () => {
  try {
    const response = await api.get('/company-info');
    companyInfos.value = response.data.companyInfos;
  } catch (error) {
    handleError(error);
  }
};

const getHeroSlides = async () => {
  try {
    const response = await api.get('/hero-slides');
    heroSlides.value = response.data.heroSlides;
  } catch (error) {
    handleError(error);
  }
};

const getFutureProjects = async () => {
  try {
    const response = await api.get('/future-projects');
    futureProjects.value = response.data.futureProjects;
  } catch (error) {
    handleError(error);
  }
};

const getFeatures = async () => {
  try {
    const response = await api.get('/features');
    features.value = response.data.features;
  } catch (error) {
    handleError(error);
  }
};

const isModalVisible = ref(false);
const isHeroSlideModalVisible = ref(false);
const isFutureProjectModalVisible = ref(false);
const isFeatureModalVisible = ref(false);
const itemIdToDelete = ref(null);
const deleteType = ref(null);

const showDeleteModal = (type, id) => {
  deleteType.value = type;
  itemIdToDelete.value = id;

  switch (type) {
    case 'company': isModalVisible.value = true; break;
    case 'heroSlide': isHeroSlideModalVisible.value = true; break;
    case 'futureProject': isFutureProjectModalVisible.value = true; break;
    case 'feature': isFeatureModalVisible.value = true; break;
  }
};

const deleteInfo = async () => {
  try {
    await api.delete(`/company-info/${itemIdToDelete.value}`);
    message.success('Xóa thông tin công ty thành công');
    getCompanyInfos();
  } catch (error) {
    handleError(error);
  } finally {
    isModalVisible.value = false;
  }
};

const deleteHeroSlide = async () => {
  try {
    await api.delete(`/hero-slides/${itemIdToDelete.value}`);
    message.success('Xóa HeroSlide thành công');
    getHeroSlides();
  } catch (error) {
    handleError(error);
  } finally {
    isHeroSlideModalVisible.value = false;
  }
};

const deleteFutureProject = async () => {
  try {
    await api.delete(`/future-projects/${itemIdToDelete.value}`);
    message.success('Xóa Future Project thành công');
    getFutureProjects();
  } catch (error) {
    handleError(error);
  } finally {
    isFutureProjectModalVisible.value = false;
  }
};

const deleteFeature = async () => {
  try {
    await api.delete(`/features/${itemIdToDelete.value}`);
    message.success('Xóa Feature thành công');
    getFeatures();
  } catch (error) {
    handleError(error);
  } finally {
    isFeatureModalVisible.value = false;
  }
};

const handleError = (error) => {
  console.error(error);
  if (error.response?.status === 429) {
    message.warning(error.response.data.message);
  } else {
    message.error('Đã xảy ra lỗi');
  }
};

const handleCancel = () => { isModalVisible.value = false; };
const handleHeroSlideCancel = () => { isHeroSlideModalVisible.value = false; };
const handleFutureProjectCancel = () => { isFutureProjectModalVisible.value = false; };
const handleFeatureCancel = () => { isFeatureModalVisible.value = false; };

onMounted(() => {
  getCompanyInfos();
  getHeroSlides();
  getFutureProjects();
  getFeatures();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
  useMenu().onSelectedKey(['admin-company']);
});
</script>
