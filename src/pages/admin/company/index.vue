<template>
  <div class="company-management-wrapper">
    <!-- ========== COMPANY INFO SECTION ========== -->
    <a-card class="management-card">
      <template #title>
        <div class="card-header">
          <h1 class="header-title">
            <i class="fa-solid fa-building"></i>
            Quản Lý Thông Tin Công Ty
          </h1>
        </div>
      </template>

      <div class="action-bar">
        <button class="add-button">
          <router-link :to="{ name: 'admin-company-create' }">
            <span class="button-content">
              <i class="fa-solid fa-plus"></i>
              <span class="button-text">Thêm Thông Tin</span>
            </span>
          </router-link>
        </button>
      </div>

      <!-- Desktop Table View -->
      <div class="table-container desktop-view">
        <a-table
          :dataSource="companyInfos"
          :columns="companyColumns"
          :scroll="scrollOptions"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} công ty`,
          }"
          class="modern-table"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span class="index-cell">{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'webname'">
              <span class="text-cell">{{ record.webname }}</span>
            </template>
            <template v-if="column.key === 'address'">
              <span class="text-cell">{{ record.address }}</span>
            </template>
            <template v-if="column.key === 'phone'">
              <span class="text-cell">{{ record.phone }}</span>
            </template>
            <template v-if="column.key === 'email'">
              <span class="text-cell">{{ record.email }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <router-link
                  :to="{
                    name: 'admin-company-edit',
                    params: { id: record.id },
                  }"
                >
                  <button class="edit-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span class="btn-text">Sửa</span>
                  </button>
                </router-link>
                <button
                  class="delete-btn"
                  @click="showDeleteModal('company', record.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                  <span class="btn-text">Xóa</span>
                </button>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Card View -->
      <div class="cards-container mobile-view">
        <div
          v-for="(company, index) in companyInfos"
          :key="company.id"
          class="info-card"
        >
          <!-- <div class="card-number">#{{ index + 1 }}</div> -->
          <div class="card-content">
            <div class="info-row">
              <strong><i class="fa-solid fa-building"></i> Tên công ty:</strong>
              <span>{{ company.webname }}</span>
            </div>
            <div class="info-row">
              <strong><i class="fa-solid fa-location-dot"></i> Địa chỉ:</strong>
              <span>{{ company.address }}</span>
            </div>
            <div class="info-row">
              <strong><i class="fa-solid fa-phone"></i> Điện thoại:</strong>
              <span>{{ company.phone }}</span>
            </div>
            <div class="info-row">
              <strong><i class="fa-solid fa-envelope"></i> Email:</strong>
              <span>{{ company.email }}</span>
            </div>
            <div class="card-actions">
              <router-link
                :to="{ name: 'admin-company-edit', params: { id: company.id } }"
              >
                <button class="card-edit-btn">
                  <i class="fa-solid fa-pen-to-square"></i>
                  <span>Sửa</span>
                </button>
              </router-link>
              <button
                class="card-delete-btn"
                @click="showDeleteModal('company', company.id)"
              >
                <i class="fa-solid fa-trash"></i>
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- ========== HERO SLIDE SECTION ========== -->
    <a-card class="management-card mt-section">
      <template #title>
        <div class="card-header">
          <h1 class="header-title">
            <i class="fa-solid fa-images"></i>
            Quản Lý HeroSlide
          </h1>
        </div>
      </template>

      <div class="action-bar">
        <button class="add-button">
          <router-link :to="{ name: 'admin-hero-slide-create' }">
            <span class="button-content">
              <i class="fa-solid fa-plus"></i>
              <span class="button-text">Thêm HeroSlide</span>
            </span>
          </router-link>
        </button>
      </div>

      <!-- Desktop Table View -->
      <div class="table-container desktop-view">
        <a-table
          :dataSource="heroSlides"
          :columns="heroSlideColumns"
          :scroll="scrollOptions"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} slides`,
          }"
          class="modern-table"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span class="index-cell">{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'title'">
              <span class="text-cell">{{ record.title }}</span>
            </template>
            <!-- <template v-if="column.key === 'image'">
              <div class="image-cell">
                <img
                  :src="record.image"
                  alt="Hero Slide"
                  class="table-image"
                />
              </div>
            </template> -->
            <template v-if="column.key === 'description'">
              <span class="text-cell">{{ record.description }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <router-link
                  :to="{
                    name: 'admin-hero-slide-edit',
                    params: { id: record.id },
                  }"
                >
                  <button class="edit-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span class="btn-text">Sửa</span>
                  </button>
                </router-link>
                <button
                  class="delete-btn"
                  @click="showDeleteModal('heroSlide', record.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                  <span class="btn-text">Xóa</span>
                </button>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Card View -->
      <div class="cards-container mobile-view">
        <div
          v-for="(slide, index) in heroSlides"
          :key="slide.id"
          class="info-card"
        >
          <!-- <div class="card-number">#{{ index + 1 }}</div> -->
          <!-- <div class="card-image-hero">
            <img :src="slide.image" :alt="slide.title" />
          </div> -->
          <div class="card-content">
            <div class="info-row">
              <strong><i class="fa-solid fa-heading"></i> Tiêu đề:</strong>
              <span>{{ slide.title }}</span>
            </div>
            <div class="info-row">
              <strong><i class="fa-solid fa-circle-info"></i> Mô tả:</strong>
              <span>{{ slide.description }}</span>
            </div>
            <div class="card-actions">
              <router-link
                :to="{
                  name: 'admin-hero-slide-edit',
                  params: { id: slide.id },
                }"
              >
                <button class="card-edit-btn">
                  <i class="fa-solid fa-pen-to-square"></i>
                  <span>Sửa</span>
                </button>
              </router-link>
              <button
                class="card-delete-btn"
                @click="showDeleteModal('heroSlide', slide.id)"
              >
                <i class="fa-solid fa-trash"></i>
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- ========== FUTURE PROJECT SECTION ========== -->
    <a-card class="management-card mt-section">
      <template #title>
        <div class="card-header">
          <h1 class="header-title">
            <i class="fa-solid fa-rocket"></i>
            Quản Lý Future Project
          </h1>
        </div>
      </template>

      <div class="action-bar">
        <button class="add-button">
          <router-link :to="{ name: 'admin-future-project-create' }">
            <span class="button-content">
              <i class="fa-solid fa-plus"></i>
              <span class="button-text">Thêm Future Project</span>
            </span>
          </router-link>
        </button>
      </div>

      <!-- Desktop Table View -->
      <div class="table-container desktop-view">
        <a-table
          :dataSource="futureProjects"
          :columns="futureProjectColumns"
          :scroll="scrollOptions"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} dự án`,
          }"
          class="modern-table"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span class="index-cell">{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'name'">
              <span class="text-cell">{{ record.name }}</span>
            </template>
            <template v-if="column.key === 'timeline'">
              <span class="text-cell">{{ record.timeline }}</span>
            </template>
            <template v-if="column.key === 'description'">
              <span class="text-cell">{{ record.description }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <router-link
                  :to="{
                    name: 'admin-future-project-edit',
                    params: { id: record.id },
                  }"
                >
                  <button class="edit-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span class="btn-text">Sửa</span>
                  </button>
                </router-link>
                <button
                  class="delete-btn"
                  @click="showDeleteModal('futureProject', record.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                  <span class="btn-text">Xóa</span>
                </button>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Card View -->
      <div class="cards-container mobile-view">
        <div
          v-for="(project, index) in futureProjects"
          :key="project.id"
          class="info-card"
        >
          <!-- <div class="card-number">#{{ index + 1 }}</div> -->
          <div class="card-content">
            <div class="info-row">
              <strong
                ><i class="fa-solid fa-project-diagram"></i> Tên dự án:</strong
              >
              <span>{{ project.name }}</span>
            </div>
            <div class="info-row">
              <strong><i class="fa-solid fa-calendar"></i> Thời gian:</strong>
              <span>{{ project.timeline }}</span>
            </div>
            <div class="info-row">
              <strong><i class="fa-solid fa-circle-info"></i> Mô tả:</strong>
              <span>{{ project.description }}</span>
            </div>
            <div class="card-actions">
              <router-link
                :to="{
                  name: 'admin-future-project-edit',
                  params: { id: project.id },
                }"
              >
                <button class="card-edit-btn">
                  <i class="fa-solid fa-pen-to-square"></i>
                  <span>Sửa</span>
                </button>
              </router-link>
              <button
                class="card-delete-btn"
                @click="showDeleteModal('futureProject', project.id)"
              >
                <i class="fa-solid fa-trash"></i>
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- ========== FEATURE SECTION ========== -->
    <a-card class="management-card mt-section">
      <template #title>
        <div class="card-header">
          <h1 class="header-title">
            <i class="fa-solid fa-star"></i>
            Quản Lý Feature
          </h1>
        </div>
      </template>

      <div class="action-bar">
        <button class="add-button">
          <router-link :to="{ name: 'admin-feature-create' }">
            <span class="button-content">
              <i class="fa-solid fa-plus"></i>
              <span class="button-text">Thêm Feature</span>
            </span>
          </router-link>
        </button>
      </div>

      <!-- Desktop Table View -->
      <div class="table-container desktop-view">
        <a-table
          :dataSource="features"
          :columns="featureColumns"
          :scroll="scrollOptions"
          :pagination="{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} tính năng`,
          }"
          class="modern-table"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span class="index-cell">{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'title'">
              <span class="text-cell">{{ record.title }}</span>
            </template>
            <template v-if="column.key === 'icon'">
              <div class="icon-cell">
                <i :class="record.icon"></i>
              </div>
            </template>
            <template v-if="column.key === 'description'">
              <span class="text-cell">{{ record.description }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <router-link
                  :to="{
                    name: 'admin-feature-edit',
                    params: { id: record.id },
                  }"
                >
                  <button class="edit-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span class="btn-text">Sửa</span>
                  </button>
                </router-link>
                <button
                  class="delete-btn"
                  @click="showDeleteModal('feature', record.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                  <span class="btn-text">Xóa</span>
                </button>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Card View -->
      <div class="cards-container mobile-view">
        <div
          v-for="(feature, index) in features"
          :key="feature.id"
          class="info-card"
        >
          <!-- <div class="card-number">#{{ index + 1 }}</div> -->
          <div class="card-icon-display">
            <i :class="feature.icon"></i>
          </div>
          <div class="card-content">
            <div class="info-row">
              <strong><i class="fa-solid fa-heading"></i> Tiêu đề:</strong>
              <span>{{ feature.title }}</span>
            </div>
            <div class="info-row">
              <strong><i class="fa-solid fa-circle-info"></i> Mô tả:</strong>
              <span>{{ feature.description }}</span>
            </div>
            <div class="card-actions">
              <router-link
                :to="{ name: 'admin-feature-edit', params: { id: feature.id } }"
              >
                <button class="card-edit-btn">
                  <i class="fa-solid fa-pen-to-square"></i>
                  <span>Sửa</span>
                </button>
              </router-link>
              <button
                class="card-delete-btn"
                @click="showDeleteModal('feature', feature.id)"
              >
                <i class="fa-solid fa-trash"></i>
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- ========== MODALS ========== -->
    <a-modal
      v-model:visible="isModalVisible"
      :title="getModalTitle()"
      @ok="handleDelete"
      @cancel="handleCancel"
      class="delete-modal"
    >
      <div class="modal-content">
        <i class="fa-solid fa-triangle-exclamation warning-icon"></i>
        <p>Bạn có chắc chắn muốn xóa {{ getItemTypeName() }} này không?</p>
      </div>
    </a-modal>
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
const isMobile = ref(window.innerWidth < 768);
const scrollOptions = computed(() =>
  isMobile.value ? { x: 1200 } : { x: 576 }
);

const companyColumns = [
  { title: '#', key: 'index', width: 80, align: 'center' },
  {
    title: 'Tên Công Ty',
    dataIndex: 'webname',
    key: 'webname',
    align: 'center',
  },
  { title: 'Địa Chỉ', dataIndex: 'address', key: 'address', align: 'center' },
  { title: 'Điện Thoại', dataIndex: 'phone', key: 'phone', align: 'center' },
  { title: 'Email', dataIndex: 'email', key: 'email', align: 'center' },
  { title: 'Công Cụ', key: 'action', width: 200, align: 'center' },
];

const heroSlideColumns = [
  { title: '#', key: 'index', width: 80, align: 'center' },
  { title: 'Tiêu Đề', dataIndex: 'title', key: 'title', align: 'center' },
  // { title: 'Hình Ảnh', dataIndex: 'image', key: 'image', align: 'center' },
  {
    title: 'Mô Tả',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
  },
  { title: 'Công Cụ', key: 'action', width: 200, align: 'center' },
];

const futureProjectColumns = [
  { title: '#', key: 'index', width: 80, align: 'center' },
  { title: 'Tên Dự Án', dataIndex: 'name', key: 'name', align: 'center' },
  {
    title: 'Thời Gian',
    dataIndex: 'timeline',
    key: 'timeline',
    align: 'center',
  },
  {
    title: 'Mô Tả',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
  },
  { title: 'Công Cụ', key: 'action', width: 200, align: 'center' },
];

const featureColumns = [
  { title: '#', key: 'index', width: 80, align: 'center' },
  { title: 'Tiêu Đề', dataIndex: 'title', key: 'title', align: 'center' },
  { title: 'Biểu Tượng', dataIndex: 'icon', key: 'icon', align: 'center' },
  {
    title: 'Mô Tả',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
  },
  { title: 'Công Cụ', key: 'action', width: 200, align: 'center' },
];

const getCompanyInfos = async () => {
  try {
    const response = await api.get('/company-info');
    companyInfos.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

const getHeroSlides = async () => {
  try {
    const response = await api.get('/hero-slides');
    heroSlides.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

const getFutureProjects = async () => {
  try {
    const response = await api.get('/future-projects');
    futureProjects.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

const getFeatures = async () => {
  try {
    const response = await api.get('/features');
    features.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

const isModalVisible = ref(false);
const itemIdToDelete = ref(null);
const deleteType = ref(null);

const showDeleteModal = (type, id) => {
  deleteType.value = type;
  itemIdToDelete.value = id;
  isModalVisible.value = true;
};

const getModalTitle = () => {
  const titles = {
    company: 'Xác nhận xóa thông tin công ty',
    heroSlide: 'Xác nhận xóa HeroSlide',
    futureProject: 'Xác nhận xóa Future Project',
    feature: 'Xác nhận xóa Feature',
  };
  return titles[deleteType.value] || 'Xác nhận xóa';
};

const getItemTypeName = () => {
  const names = {
    company: 'thông tin công ty',
    heroSlide: 'HeroSlide',
    futureProject: 'Future Project',
    feature: 'Feature',
  };
  return names[deleteType.value] || 'mục';
};

const handleDelete = async () => {
  const endpoints = {
    company: `/company-info/${itemIdToDelete.value}`,
    heroSlide: `/hero-slides/${itemIdToDelete.value}`,
    futureProject: `/future-projects/${itemIdToDelete.value}`,
    feature: `/features/${itemIdToDelete.value}`,
  };

  const successMessages = {
    company: 'Xóa thông tin công ty thành công',
    heroSlide: 'Xóa HeroSlide thành công',
    futureProject: 'Xóa Future Project thành công',
    feature: 'Xóa Feature thành công',
  };

  const refreshFunctions = {
    company: getCompanyInfos,
    heroSlide: getHeroSlides,
    futureProject: getFutureProjects,
    feature: getFeatures,
  };

  try {
    await api.delete(endpoints[deleteType.value]);
    message.success(successMessages[deleteType.value]);
    refreshFunctions[deleteType.value]();
  } catch (error) {
    handleError(error);
  } finally {
    isModalVisible.value = false;
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

const handleCancel = () => {
  isModalVisible.value = false;
};

onMounted(() => {
  getCompanyInfos();
  getHeroSlides();
  getFutureProjects();
  getFeatures();
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768;
  });
  useMenu().onSelectedKey(['admin-company']);
});
</script>

<style scoped>
/* ========== WRAPPER ========== */
.company-management-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 40px 20px;
}

/* ========== SECTION SPACING ========== */
.mt-section {
  margin-top: 40px;
}

/* ========== CARD STYLING ========== */
.management-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: none;
}

.management-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border: none;
  padding: 30px;
}

.management-card :deep(.ant-card-body) {
  padding: 30px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  color: white;
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 15px;
  letter-spacing: 0.5px;
}

.header-title i {
  font-size: 2.2rem;
}

/* ========== ACTION BAR ========== */
.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
}

.add-button {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  border: none;
  border-radius: 50px;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(12, 113, 61, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.add-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.add-button:hover::before {
  width: 300px;
  height: 300px;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 113, 61, 0.4);
}

.add-button:active {
  transform: translateY(0);
}

.add-button a {
  color: white;
  text-decoration: none;
  display: block;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}

.add-button i {
  font-size: 1.2rem;
}

/* ========== DESKTOP TABLE VIEW ========== */
.desktop-view {
  display: block;
}

.mobile-view {
  display: none;
}

.table-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.modern-table :deep(.ant-table) {
  border-radius: 12px;
  overflow: hidden;
}

.modern-table :deep(.ant-table-thead > tr > th) {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  padding: 18px 16px;
  vertical-align: middle;
}

.modern-table :deep(.ant-table-tbody > tr) {
  transition: all 0.3s ease;
}

.modern-table :deep(.ant-table-tbody > tr:hover) {
  background: rgba(12, 113, 61, 0.03);
  transform: scale(1.005);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.modern-table :deep(.ant-table-tbody > tr > td) {
  padding: 20px 16px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.index-cell {
  font-weight: 700;
  color: #0c713d;
  font-size: 1.1rem;
}

.text-cell {
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.image-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.table-image:hover {
  transform: scale(1.15);
}

.icon-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-cell i {
  font-size: 2rem;
  color: #0c713d;
}

/* ========== ACTION BUTTONS (Desktop) ========== */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}

.edit-btn,
.delete-btn {
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-size: 0.95rem;
}

.edit-btn::before,
.delete-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.edit-btn:hover::before,
.delete-btn:hover::before {
  width: 200px;
  height: 200px;
}

.edit-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(12, 113, 61, 0.4);
}

.delete-btn {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 77, 79, 0.4);
}

.edit-btn:active,
.delete-btn:active {
  transform: translateY(0);
}

.edit-btn a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

/* ========== MOBILE CARD VIEW ========== */
.cards-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(12, 113, 61, 0.12);
}

/* .card-number {
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 2;
} */

/* .card-image-hero {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.card-image-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.info-card:hover .card-image-hero img {
  transform: scale(1.1);
} */

.card-icon-display {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(12, 113, 61, 0.03) 0%,
    rgba(12, 113, 61, 0.06) 100%
  );
}

.card-icon-display i {
  font-size: 4rem;
  color: #0c713d;
}

.card-content {
  padding: 20px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-of-type {
  border-bottom: none;
  margin-bottom: 20px;
}

.info-row strong {
  color: #0c713d;
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-row strong i {
  font-size: 1rem;
}

.info-row span {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 15px;
}

.card-edit-btn,
.card-delete-btn {
  flex: 1;
  border: none;
  border-radius: 50px;
  padding: 12px 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-size: 0.95rem;
}

.card-edit-btn::before,
.card-delete-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.card-edit-btn:hover::before,
.card-delete-btn:hover::before {
  width: 200px;
  height: 200px;
}

.card-edit-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.card-edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(12, 113, 61, 0.4);
}

.card-delete-btn {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.card-delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 77, 79, 0.4);
}

.card-edit-btn:active,
.card-delete-btn:active {
  transform: translateY(0);
}

.card-edit-btn a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

/* ========== HIDE/SHOW LOGIC ========== */
@media (min-width: 769px) {
  .mobile-view {
    display: none !important;
  }

  .desktop-view {
    display: block !important;
  }
}

/* ========== MODAL STYLING ========== */
.delete-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  border: none;
}

.delete-modal :deep(.ant-modal-title) {
  color: white;
  font-weight: 700;
}

.modal-content {
  text-align: center;
  padding: 20px 0;
}

.warning-icon {
  font-size: 4rem;
  color: #ff4d4f;
  margin-bottom: 20px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.modal-content p {
  font-size: 1.1rem;
  color: #333;
  margin: 0;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Desktop Large */
@media (min-width: 1400px) {
  .management-card {
    max-width: 1600px;
  }
}

/* Desktop */
@media (min-width: 1200px) and (max-width: 1399px) {
  .management-card {
    max-width: 1200px;
  }
}

/* Laptop */
@media (min-width: 992px) and (max-width: 1199px) {
  .management-card {
    max-width: 1000px;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .header-title i {
    font-size: 2rem;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 991px) {
  .company-management-wrapper {
    padding: 30px 15px;
  }

  .mt-section {
    margin-top: 35px;
  }

  .management-card :deep(.ant-card-head) {
    padding: 25px;
  }

  .header-title {
    font-size: 1.7rem;
  }

  .header-title i {
    font-size: 1.9rem;
  }

  .button-content {
    padding: 12px 28px;
    font-size: 0.95rem;
  }

  .management-card :deep(.ant-card-body) {
    padding: 25px;
  }

  .table-container {
    padding: 15px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .edit-btn,
  .delete-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Mobile - Switch to Card View */
@media (max-width: 768px) {
  .company-management-wrapper {
    padding: 20px 10px;
  }

  .mt-section {
    margin-top: 30px;
  }

  .management-card :deep(.ant-card-head) {
    padding: 20px;
  }

  .header-title {
    font-size: 1.4rem;
    flex-direction: column;
    gap: 10px;
  }

  .header-title i {
    font-size: 1.6rem;
  }

  .action-bar {
    justify-content: center;
    margin-bottom: 20px;
  }

  .add-button {
    width: 100%;
    max-width: 300px;
  }

  .button-content {
    padding: 12px 24px;
    font-size: 0.9rem;
    justify-content: center;
  }

  .management-card :deep(.ant-card-body) {
    padding: 20px 15px;
  }

  /* Hide table, show cards */
  .desktop-view {
    display: none !important;
  }

  .mobile-view {
    display: block !important;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .company-management-wrapper {
    padding: 15px 8px;
  }

  .mt-section {
    margin-top: 25px;
  }

  .management-card {
    border-radius: 12px;
  }

  .management-card :deep(.ant-card-head) {
    padding: 15px;
  }

  .header-title {
    font-size: 1.2rem;
  }

  .header-title i {
    font-size: 1.4rem;
  }

  .button-content {
    padding: 10px 20px;
    font-size: 0.85rem;
  }

  .add-button i {
    font-size: 1rem;
  }

  .management-card :deep(.ant-card-body) {
    padding: 15px 10px;
  }

  .info-card {
    border-radius: 12px;
  }

  /* .card-number {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  } */

  /* .card-image-hero {
    height: 160px;
  } */

  .card-icon-display {
    height: 100px;
  }

  .card-icon-display i {
    font-size: 3rem;
  }

  .card-content {
    padding: 15px;
  }

  .info-row {
    margin-bottom: 12px;
    padding-bottom: 12px;
  }

  .info-row strong {
    font-size: 0.9rem;
  }

  .info-row span {
    font-size: 0.9rem;
  }

  .card-actions {
    gap: 8px;
    margin-top: 12px;
  }

  .card-edit-btn,
  .card-delete-btn {
    padding: 10px 16px;
    font-size: 0.85rem;
  }

  .warning-icon {
    font-size: 3rem;
  }

  .modal-content p {
    font-size: 1rem;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .company-management-wrapper {
    padding: 10px 5px;
  }

  .header-title {
    font-size: 1.1rem;
  }

  .header-title i {
    font-size: 1.3rem;
  }

  .button-content {
    padding: 8px 16px;
    font-size: 0.8rem;
  }

  .card-content {
    padding: 12px;
  }

  .info-row strong,
  .info-row span {
    font-size: 0.85rem;
  }

  .card-edit-btn,
  .card-delete-btn {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
}
</style>
