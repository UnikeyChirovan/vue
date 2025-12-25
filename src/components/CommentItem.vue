<template>
  <div class="comment-item" :class="{ 'is-reply': isReply }">
    <!-- Comment Header -->
    <div class="comment-main">
      <router-link :to="`/profile/${comment.user.id}`" class="comment-avatar">
        <img :src="commentAvatar" :alt="comment.user.nickname" />
      </router-link>

      <div class="comment-content-wrapper">
        <div class="comment-bubble">
          <!-- User Info -->
          <div class="comment-user-info">
            <router-link
              :to="`/profile/${comment.user.id}`"
              class="comment-username"
            >
              {{ comment.user.nickname }}
            </router-link>
            <span class="comment-time">{{
              formatTime(comment.created_at)
            }}</span>
          </div>

          <!-- Comment Content -->
          <div v-if="!isEditing" class="comment-text">
            {{ comment.content }}
          </div>

          <!-- Edit Form -->
          <div v-else class="edit-form">
            <textarea
              v-model="editContent"
              rows="3"
              @keydown.enter.ctrl="submitEdit"
            ></textarea>
            <div class="edit-actions">
              <button @click="cancelEdit" class="cancel-btn">Hủy</button>
              <button
                @click="submitEdit"
                class="save-btn"
                :disabled="!editContent.trim()"
              >
                Lưu
              </button>
            </div>
          </div>

          <!-- Comment Actions -->
          <div v-if="!isEditing" class="comment-actions">
            <button @click="toggleReply" class="action-btn reply-btn">
              <i class="fa-solid fa-reply"></i>
              Trả lời
            </button>
            <button
              v-if="canEdit"
              @click="startEdit"
              class="action-btn edit-btn"
            >
              <i class="fa-solid fa-pen"></i>
              Sửa
            </button>
            <button
              v-if="canDelete"
              @click="deleteComment"
              class="action-btn delete-btn"
            >
              <i class="fa-solid fa-trash"></i>
              Xóa
            </button>
          </div>
        </div>

        <!-- Reply Form -->
        <div v-if="showReplyForm" class="reply-form">
          <div class="user-avatar-small">
            <img :src="currentUserAvatar" alt="Your avatar" />
          </div>
          <div class="reply-input-wrapper">
            <div v-if="isReply" class="replying-to">
              Đang trả lời <strong>@{{ comment.user.nickname }}</strong>
            </div>
            <textarea
              v-model="replyContent"
              :placeholder="
                isReply ? 'Viết câu trả lời...' : 'Viết câu trả lời...'
              "
              rows="2"
              @keydown.enter.ctrl="submitReply"
            ></textarea>
            <div class="reply-actions">
              <button @click="cancelReply" class="cancel-btn">Hủy</button>
              <button
                @click="submitReply"
                class="submit-btn"
                :disabled="!replyContent.trim()"
              >
                <i class="fa-solid fa-paper-plane"></i>
                Gửi
              </button>
            </div>
          </div>
        </div>

        <!-- Replies -->
        <div
          v-if="comment.replies && comment.replies.length > 0"
          class="replies-list"
        >
          <CommentItem
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            :is-reply="true"
            :parent-comment-id="comment.id"
            @reply="(parentId, content) => $emit('reply', parentId, content)"
            @edit="(id, content) => $emit('edit', id, content)"
            @delete="(id) => $emit('delete', id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  isReply: {
    type: Boolean,
    default: false,
  },
  parentCommentId: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(['reply', 'edit', 'delete']);

const authStore = useAuthStore();

const showReplyForm = ref(false);
const replyContent = ref('');
const isEditing = ref(false);
const editContent = ref('');

const getAvatarUrl = (user) => {
  if (!user || !user.avatar) return 'https://picsum.photos/150';

  if (user.avatar.startsWith('http://') || user.avatar.startsWith('https://')) {
    return user.avatar;
  }

  return `http://127.0.0.1:8000/storage/avatars/${user.id}/${user.avatar}`;
};

const currentUserAvatar = computed(() => {
  const user = authStore.user;
  if (!user) return 'https://picsum.photos/150';
  return getAvatarUrl(user);
});

const commentAvatar = computed(() => getAvatarUrl(props.comment.user));

const canEdit = computed(() => authStore.user?.id === props.comment.user.id);
const canDelete = computed(() => authStore.user?.id === props.comment.user.id);

const formatTime = (time) => {
  return dayjs(time).fromNow();
};

const toggleReply = () => {
  showReplyForm.value = !showReplyForm.value;
  if (showReplyForm.value) {
    replyContent.value = '';
  }
};

const submitReply = () => {
  if (!replyContent.value.trim()) return;

  const parentId = props.isReply ? props.parentCommentId : props.comment.id;

  emit('reply', parentId, replyContent.value.trim());
  replyContent.value = '';
  showReplyForm.value = false;
};

const cancelReply = () => {
  replyContent.value = '';
  showReplyForm.value = false;
};

const startEdit = () => {
  editContent.value = props.comment.content;
  isEditing.value = true;
};

const submitEdit = () => {
  if (!editContent.value.trim()) return;

  emit('edit', props.comment.id, editContent.value.trim());
  isEditing.value = false;
};

const cancelEdit = () => {
  editContent.value = '';
  isEditing.value = false;
};

const deleteComment = () => {
  emit('delete', props.comment.id);
};
</script>

<style scoped>
.comment-item {
  margin-bottom: 20px;
}

.comment-item.is-reply {
  margin-left: 48px;
  margin-top: 16px;
}

.comment-main {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.comment-avatar {
  flex-shrink: 0;
  display: block;
}

.comment-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  transition: transform 0.2s ease;
}

html.dark-mode .comment-avatar img {
  border-color: #333;
}

.comment-avatar:hover img {
  transform: scale(1.05);
  border-color: #0c713d;
}

html.dark-mode .comment-avatar:hover img {
  border-color: #22c55e;
}

.comment-content-wrapper {
  flex: 1;
  min-width: 0;
}

.comment-bubble {
  background: #f9fafb;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

html.dark-mode .comment-bubble {
  background: #252525;
  border-color: #333;
}

.comment-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.comment-username {
  font-weight: 700;
  color: #1f2937;
  text-decoration: none;
  transition: color 0.2s ease;
}

html.dark-mode .comment-username {
  color: #e0e0e0;
}

.comment-username:hover {
  color: #0c713d;
}

html.dark-mode .comment-username:hover {
  color: #22c55e;
}

.comment-time {
  font-size: 0.85rem;
  color: #6b7280;
}

html.dark-mode .comment-time {
  color: #9ca3af;
}

.comment-text {
  color: #374151;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
  margin-bottom: 12px;
}

html.dark-mode .comment-text {
  color: #d1d5db;
}

.comment-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

html.dark-mode .action-btn {
  color: #9ca3af;
}

.action-btn:hover {
  background: rgba(12, 113, 61, 0.1);
  color: #0c713d;
}

html.dark-mode .action-btn:hover {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.delete-btn:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

html.dark-mode .delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.reply-form,
.edit-form {
  margin-top: 12px;
}

.reply-form {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.user-avatar-small img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

html.dark-mode .user-avatar-small img {
  border-color: #333;
}

.reply-input-wrapper {
  flex: 1;
}

.replying-to {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 6px;
  padding: 6px 10px;
  background: #f3f4f6;
  border-radius: 6px;
  border-left: 3px solid #0c713d;
}

html.dark-mode .replying-to {
  color: #9ca3af;
  background: #1a1a1a;
  border-left-color: #22c55e;
}

.replying-to strong {
  color: #0c713d;
  font-weight: 600;
}

html.dark-mode .replying-to strong {
  color: #22c55e;
}

.reply-input-wrapper textarea,
.edit-form textarea {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  background: white;
  color: #1f2937;
}

html.dark-mode .reply-input-wrapper textarea,
html.dark-mode .edit-form textarea {
  background: #1e1e1e;
  border-color: #333;
  color: #e0e0e0;
}

.reply-input-wrapper textarea:focus,
.edit-form textarea:focus {
  outline: none;
  border-color: #0c713d;
  box-shadow: 0 0 0 3px rgba(12, 113, 61, 0.1);
}

html.dark-mode .reply-input-wrapper textarea:focus,
html.dark-mode .edit-form textarea:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.reply-actions,
.edit-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}

.cancel-btn,
.save-btn,
.submit-btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cancel-btn {
  background: #e5e7eb;
  color: #374151;
}

html.dark-mode .cancel-btn {
  background: #333;
  color: #d1d5db;
}

.cancel-btn:hover {
  background: #d1d5db;
}

html.dark-mode .cancel-btn:hover {
  background: #444;
}

.save-btn,
.submit-btn {
  background: linear-gradient(135deg, #0c713d 0%, #0a5a31 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 6px;
}

html.dark-mode .save-btn,
html.dark-mode .submit-btn {
  background: linear-gradient(135deg, #0f8a4a 0%, #0c713d 100%);
}

.save-btn:hover,
.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(12, 113, 61, 0.3);
}

.save-btn:disabled,
.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.replies-list {
  margin-top: 16px;
}

/* Tablet (max-width: 1024px) */
@media (max-width: 1024px) {
  .comment-item {
    margin-bottom: 18px;
  }

  .comment-item.is-reply {
    margin-left: 40px;
    margin-top: 14px;
  }

  .comment-bubble {
    padding: 15px;
  }
}

/* Tablet (max-width: 768px) */
@media (max-width: 768px) {
  .comment-item {
    margin-bottom: 16px;
  }

  .comment-item.is-reply {
    margin-left: 32px;
    margin-top: 12px;
  }

  .comment-main {
    gap: 10px;
  }

  .comment-avatar img {
    width: 42px;
    height: 42px;
  }

  .comment-bubble {
    padding: 14px;
    border-radius: 14px;
  }

  .comment-user-info {
    gap: 10px;
    margin-bottom: 7px;
  }

  .comment-username {
    font-size: 0.95rem;
  }

  .comment-time {
    font-size: 0.8rem;
  }

  .comment-text {
    font-size: 0.95rem;
    margin-bottom: 10px;
  }

  .comment-actions {
    gap: 14px;
  }

  .action-btn {
    font-size: 0.85rem;
    gap: 5px;
  }

  .reply-form {
    gap: 10px;
  }

  .user-avatar-small img {
    width: 34px;
    height: 34px;
  }

  .reply-input-wrapper textarea,
  .edit-form textarea {
    font-size: 0.85rem;
    padding: 9px 12px;
  }

  .cancel-btn,
  .save-btn,
  .submit-btn {
    padding: 7px 18px;
    font-size: 0.85rem;
  }

  .replies-list {
    margin-top: 14px;
  }
}

/* Mobile (max-width: 480px) */
@media (max-width: 480px) {
  .comment-item {
    margin-bottom: 14px;
  }

  .comment-item.is-reply {
    margin-left: 24px;
    margin-top: 10px;
  }

  .comment-main {
    gap: 8px;
  }

  .comment-avatar img {
    width: 38px;
    height: 38px;
  }

  .comment-bubble {
    padding: 12px;
    border-radius: 12px;
  }

  .comment-user-info {
    gap: 8px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  .comment-username {
    font-size: 0.9rem;
  }

  .comment-time {
    font-size: 0.75rem;
  }

  .comment-text {
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 8px;
  }

  .comment-actions {
    gap: 10px;
    flex-wrap: wrap;
  }

  .action-btn {
    font-size: 0.8rem;
    gap: 4px;
    padding: 3px 6px;
  }

  .action-btn i {
    font-size: 0.75rem;
  }

  .reply-form {
    gap: 8px;
    flex-direction: column;
  }

  .user-avatar-small {
    display: none;
  }

  .replying-to {
    font-size: 0.8rem;
    padding: 5px 8px;
    margin-bottom: 5px;
  }

  .reply-input-wrapper textarea,
  .edit-form textarea {
    font-size: 0.8rem;
    padding: 8px 10px;
    border-radius: 8px;
  }

  .reply-actions,
  .edit-actions {
    gap: 6px;
    margin-top: 6px;
  }

  .cancel-btn,
  .save-btn,
  .submit-btn {
    padding: 7px 16px;
    font-size: 0.8rem;
    border-radius: 6px;
    flex: 1;
  }

  .submit-btn i,
  .save-btn i {
    font-size: 0.75rem;
  }

  .replies-list {
    margin-top: 12px;
  }
}

/* Extra Small Mobile (max-width: 360px) */
@media (max-width: 360px) {
  .comment-item {
    margin-bottom: 12px;
  }

  .comment-item.is-reply {
    margin-left: 20px;
    margin-top: 8px;
  }

  .comment-main {
    gap: 6px;
  }

  .comment-avatar img {
    width: 34px;
    height: 34px;
  }

  .comment-bubble {
    padding: 10px;
    border-radius: 10px;
  }

  .comment-user-info {
    gap: 6px;
    margin-bottom: 5px;
  }

  .comment-username {
    font-size: 0.85rem;
  }

  .comment-time {
    font-size: 0.7rem;
  }

  .comment-text {
    font-size: 0.85rem;
    line-height: 1.45;
    margin-bottom: 7px;
  }

  .comment-actions {
    gap: 8px;
  }

  .action-btn {
    font-size: 0.75rem;
    padding: 2px 5px;
  }

  .reply-input-wrapper textarea,
  .edit-form textarea {
    font-size: 0.75rem;
    padding: 7px 9px;
  }

  .cancel-btn,
  .save-btn,
  .submit-btn {
    padding: 6px 14px;
    font-size: 0.75rem;
  }

  .replies-list {
    margin-top: 10px;
  }
}
</style>
