<template>
  <div class="comment-section">
    <!-- Header -->
    <div class="comment-header">
      <h3 class="comment-title">
        <i class="fa-solid fa-comments"></i>
        Bình Luận ({{ commentStore.commentsCount }})
      </h3>

      <!-- Sort Options -->
      <div class="sort-options">
        <button
          @click="sortOrder = 'latest'"
          :class="['sort-btn', { active: sortOrder === 'latest' }]"
        >
          <i class="fa-solid fa-arrow-down-wide-short"></i>
          <span>Mới nhất</span>
        </button>
        <button
          @click="sortOrder = 'oldest'"
          :class="['sort-btn', { active: sortOrder === 'oldest' }]"
        >
          <i class="fa-solid fa-arrow-up-wide-short"></i>
          <span>Cũ nhất</span>
        </button>
      </div>
    </div>

    <!-- Add Comment Form -->
    <div class="add-comment-form">
      <div class="user-avatar">
        <img :src="currentUserAvatar" alt="Avatar" />
      </div>
      <div class="comment-input-wrapper">
        <textarea
          v-model="newComment"
          placeholder="Viết bình luận của bạn..."
          rows="3"
          @keydown.enter.ctrl="handleAddComment"
        ></textarea>
        <div class="form-actions">
          <span class="hint-text">Nhấn Ctrl + Enter để gửi</span>
          <button
            @click="handleAddComment"
            :disabled="!newComment.trim() || submitting"
            class="submit-btn"
          >
            <i class="fa-solid fa-paper-plane"></i>
            {{ submitting ? 'Đang gửi...' : 'Gửi' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Comments List -->
    <div class="comments-list">
      <div
        v-if="commentStore.loading && commentStore.comments.length === 0"
        class="loading-state"
      >
        <div class="spinner"></div>
        <p>Đang tải bình luận...</p>
      </div>

      <div v-else-if="commentStore.comments.length === 0" class="empty-state">
        <i class="fa-solid fa-comment-slash"></i>
        <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
      </div>

      <div v-else>
        <CommentItem
          v-for="comment in sortedComments"
          :key="comment.id"
          :comment="comment"
          @reply="handleReply"
          @edit="handleEdit"
          @delete="handleDelete"
        />

        <!-- Load More Button -->
        <button
          v-if="commentStore.hasMore"
          @click="loadMore"
          :disabled="commentStore.loading"
          class="load-more-btn"
        >
          <i
            class="fa-solid fa-spinner fa-spin"
            v-if="commentStore.loading"
          ></i>
          <i class="fa-solid fa-chevron-down" v-else></i>
          {{ commentStore.loading ? 'Đang tải...' : 'Xem thêm bình luận' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useCommentStore } from '../stores/commentStore';
import { useAuthStore } from '../stores/auth';
import { useProfileStore } from '../stores/profile';
import { useToast } from '../stores/useToast';
import CommentItem from './CommentItem.vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['chapter', 'episode'].includes(value),
  },
  id: {
    type: [Number, String],
    default: null,
  },
});

const commentStore = useCommentStore();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const toast = useToast();

const newComment = ref('');
const submitting = ref(false);
const sortOrder = ref('latest');

const currentUserAvatar = computed(() => {
  if (profileStore.avatarUrl) {
    return profileStore.avatarUrl;
  }

  if (profileStore.users?.avatar && authStore.user?.id) {
    return `http://127.0.0.1:8000/storage/avatars/${authStore.user.id}/${profileStore.users.avatar}`;
  }

  return 'https://picsum.photos/150';
});

const sortedComments = computed(() => {
  const comments = [...commentStore.comments];
  if (sortOrder.value === 'oldest') {
    return comments.reverse();
  }
  return comments;
});

const handleAddComment = async () => {
  if (!newComment.value.trim() || submitting.value) return;

  submitting.value = true;
  try {
    await commentStore.addComment(newComment.value.trim());
    newComment.value = '';
    toast.success('Đã thêm bình luận');
  } catch (error) {
    toast.error('Lỗi khi thêm bình luận');
  } finally {
    submitting.value = false;
  }
};

const handleReply = async (parentId, content) => {
  try {
    await commentStore.addComment(content, parentId);
    toast.success('Đã trả lời bình luận');
  } catch (error) {
    toast.error('Lỗi khi trả lời bình luận');
  }
};

const handleEdit = async (commentId, content) => {
  try {
    await commentStore.updateComment(commentId, content);
    toast.success('Đã cập nhật bình luận');
  } catch (error) {
    toast.error('Lỗi khi cập nhật bình luận');
  }
};

const handleDelete = async (commentId) => {
  if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return;

  try {
    await commentStore.deleteComment(commentId);
    toast.success('Đã xóa bình luận');
  } catch (error) {
    toast.error('Lỗi khi xóa bình luận');
  }
};

const loadMore = () => {
  commentStore.loadMore();
};

watch(
  () => props.id,
  (newId) => {
    if (!newId) {
      commentStore.reset();
      return;
    }

    commentStore.reset();

    if (props.type === 'chapter') {
      commentStore.fetchChapterComments(newId);
    } else {
      commentStore.fetchEpisodeComments(newId);
    }
  },
  { immediate: false }
);

onMounted(() => {
  if (authStore.user?.id) {
    profileStore.getProfile(authStore.user.id);
  }

  if (!props.id) return;

  if (props.type === 'chapter') {
    commentStore.fetchChapterComments(props.id);
  } else {
    commentStore.fetchEpisodeComments(props.id);
  }
});
</script>

<style scoped>
.comment-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-top: 32px;
}

html.dark-mode .comment-section {
  background: #1e1e1e;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.comment-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

html.dark-mode .comment-header {
  border-bottom-color: #333;
}

.comment-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

html.dark-mode .comment-title {
  color: #e0e0e0;
}

.comment-title i {
  color: #0c713d;
  font-size: 1.4rem;
}

html.dark-mode .comment-title i {
  color: #22c55e;
}

.sort-options {
  display: flex;
  gap: 8px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 10px;
}

html.dark-mode .sort-options {
  background: #252525;
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

html.dark-mode .sort-btn {
  color: #9ca3af;
}

.sort-btn:hover {
  background: rgba(12, 113, 61, 0.1);
  color: #0c713d;
}

html.dark-mode .sort-btn:hover {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.sort-btn.active {
  background: #0c713d;
  color: white;
}

html.dark-mode .sort-btn.active {
  background: #22c55e;
  color: #0a0a0a;
}

.sort-btn i {
  font-size: 0.85rem;
}

.add-comment-form {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  align-items: flex-start;
}

.user-avatar {
  flex-shrink: 0;
}

.user-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

html.dark-mode .user-avatar img {
  border-color: #333;
}

.comment-input-wrapper {
  flex: 1;
}

.comment-input-wrapper textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;
  background: white;
  color: #1f2937;
}

html.dark-mode .comment-input-wrapper textarea {
  background: #252525;
  border-color: #333;
  color: #e0e0e0;
}

.comment-input-wrapper textarea:focus {
  outline: none;
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

html.dark-mode .comment-input-wrapper textarea:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.hint-text {
  font-size: 0.85rem;
  color: #6b7280;
}

html.dark-mode .hint-text {
  color: #9ca3af;
}

.submit-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(12, 113, 61, 0.2);
}

html.dark-mode .submit-btn {
  background: linear-gradient(135deg, #0f8a4a 0%, #0c713d 100%);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 113, 61, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

html.dark-mode .loading-state,
html.dark-mode .empty-state {
  color: #9ca3af;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(12, 113, 61, 0.1);
  border-top-color: #0c713d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

html.dark-mode .spinner {
  border-color: rgba(34, 197, 94, 0.1);
  border-top-color: #22c55e;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state i {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 16px;
}

html.dark-mode .empty-state i {
  color: #4b5563;
}

.load-more-btn {
  width: 100%;
  padding: 14px;
  background: transparent;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

html.dark-mode .load-more-btn {
  border-color: #333;
  color: #9ca3af;
}

.load-more-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #0c713d;
  color: #0c713d;
}

html.dark-mode .load-more-btn:hover:not(:disabled) {
  background: #252525;
  border-color: #22c55e;
  color: #22c55e;
}

.load-more-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Tablet (max-width: 1024px) */
@media (max-width: 1024px) {
  .comment-section {
    padding: 22px 20px;
  }

  .comment-title {
    font-size: 1.4rem;
  }

  .comment-title i {
    font-size: 1.3rem;
  }

  .sort-btn {
    padding: 7px 14px;
    font-size: 0.85rem;
  }
}

/* Tablet (max-width: 768px) */
@media (max-width: 768px) {
  .comment-section {
    padding: 20px 16px;
    border-radius: 12px;
    margin-top: 24px;
  }

  .comment-header {
    margin-bottom: 20px;
    padding-bottom: 14px;
  }

  .comment-title {
    font-size: 1.3rem;
  }

  .comment-title i {
    font-size: 1.2rem;
  }

  .sort-options {
    gap: 6px;
    padding: 3px;
    border-radius: 8px;
  }

  .sort-btn {
    padding: 7px 12px;
    font-size: 0.8rem;
  }

  .sort-btn span {
    display: none;
  }

  .sort-btn i {
    font-size: 0.9rem;
  }

  .add-comment-form {
    gap: 12px;
    margin-bottom: 28px;
  }

  .user-avatar img {
    width: 40px;
    height: 40px;
  }

  .comment-input-wrapper textarea {
    font-size: 0.9rem;
    padding: 10px 14px;
    min-height: 70px;
  }

  .form-actions {
    margin-top: 10px;
  }

  .hint-text {
    font-size: 0.8rem;
  }

  .submit-btn {
    padding: 9px 20px;
    font-size: 0.9rem;
  }

  .loading-state,
  .empty-state {
    padding: 50px 16px;
  }

  .spinner {
    width: 45px;
    height: 45px;
  }

  .empty-state i {
    font-size: 3.5rem;
  }

  .load-more-btn {
    padding: 12px;
    font-size: 0.9rem;
    margin-top: 20px;
  }
}

/* Mobile (max-width: 480px) */
@media (max-width: 480px) {
  .comment-section {
    padding: 18px 12px;
    border-radius: 10px;
    margin-top: 20px;
  }

  .comment-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .comment-title {
    font-size: 1.2rem;
    gap: 8px;
  }

  .comment-title i {
    font-size: 1.1rem;
  }

  .sort-options {
    width: 100%;
    justify-content: center;
  }

  .sort-btn {
    flex: 1;
    justify-content: center;
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .sort-btn span {
    display: inline;
  }

  .sort-btn i {
    font-size: 0.8rem;
  }

  .add-comment-form {
    gap: 10px;
    margin-bottom: 24px;
  }

  .user-avatar img {
    width: 36px;
    height: 36px;
  }

  .comment-input-wrapper textarea {
    font-size: 0.85rem;
    padding: 10px 12px;
    min-height: 65px;
    border-radius: 10px;
  }

  .form-actions {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
    margin-top: 8px;
  }

  .hint-text {
    text-align: center;
    font-size: 0.75rem;
    order: 2;
  }

  .submit-btn {
    width: 100%;
    justify-content: center;
    padding: 10px 20px;
    font-size: 0.85rem;
    order: 1;
  }

  .loading-state,
  .empty-state {
    padding: 40px 12px;
    font-size: 0.9rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border-width: 3px;
    margin-bottom: 12px;
  }

  .empty-state i {
    font-size: 3rem;
    margin-bottom: 12px;
  }

  .load-more-btn {
    padding: 11px;
    font-size: 0.85rem;
    margin-top: 18px;
    border-radius: 10px;
  }
}

/* Extra Small Mobile (max-width: 360px) */
@media (max-width: 360px) {
  .comment-section {
    padding: 16px 10px;
    border-radius: 8px;
  }

  .comment-header {
    margin-bottom: 14px;
    padding-bottom: 10px;
  }

  .comment-title {
    font-size: 1.1rem;
    gap: 6px;
  }

  .comment-title i {
    font-size: 1rem;
  }

  .add-comment-form {
    gap: 8px;
    margin-bottom: 20px;
  }

  .user-avatar img {
    width: 32px;
    height: 32px;
  }

  .comment-input-wrapper textarea {
    font-size: 0.8rem;
    padding: 8px 10px;
    min-height: 60px;
    border-radius: 8px;
  }

  .submit-btn {
    padding: 9px 16px;
    font-size: 0.8rem;
  }

  .loading-state,
  .empty-state {
    padding: 35px 10px;
  }

  .spinner {
    width: 35px;
    height: 35px;
  }

  .empty-state i {
    font-size: 2.5rem;
  }

  .load-more-btn {
    padding: 10px;
    font-size: 0.8rem;
  }
}
</style>
