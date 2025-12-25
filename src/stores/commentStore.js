import { defineStore } from 'pinia';
import api from '../services/axiosInterceptor';

export const useCommentStore = defineStore('comment', {
  state: () => ({
    comments: [],
    loading: false,
    currentPage: 1,
    lastPage: 1,
    total: 0,
    commentableType: null, // 'chapter' or 'episode'
    commentableId: null,
  }),

  actions: {
    async fetchChapterComments(chapterId, page = 1) {
      this.loading = true;
      this.commentableType = 'chapter';
      this.commentableId = chapterId;

      try {
        const response = await api.get(`/comments/chapter/${chapterId}`, {
          params: { page },
        });

        if (page === 1) {
          this.comments = response.data.data;
        } else {
          this.comments.push(...response.data.data);
        }

        this.currentPage = response.data.current_page;
        this.lastPage = response.data.last_page;
        this.total = response.data.total;
      } catch (error) {
        console.error('Lỗi khi tải comments:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchEpisodeComments(episodeId, page = 1) {
      this.loading = true;
      this.commentableType = 'episode';
      this.commentableId = episodeId;

      try {
        const response = await api.get(`/comments/episode/${episodeId}`, {
          params: { page },
        });

        if (page === 1) {
          this.comments = response.data.data;
        } else {
          this.comments.push(...response.data.data);
        }

        this.currentPage = response.data.current_page;
        this.lastPage = response.data.last_page;
        this.total = response.data.total;
      } catch (error) {
        console.error('Lỗi khi tải comments:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addComment(content, parentId = null) {
      try {
        const response = await api.post('/comments', {
          commentable_type: this.commentableType,
          commentable_id: this.commentableId,
          content,
          parent_id: parentId,
        });

        const newComment = response.data.comment;

        if (parentId) {
          const parentComment = this.comments.find((c) => c.id === parentId);
          if (parentComment) {
            if (!parentComment.replies) {
              parentComment.replies = [];
            }
            parentComment.replies.push(newComment);
          }
        } else {
          this.comments.unshift(newComment);
          this.total++;
        }

        return newComment;
      } catch (error) {
        console.error('Lỗi khi thêm comment:', error);
        throw error;
      }
    },

    async updateComment(commentId, content) {
      try {
        const response = await api.put(`/comments/${commentId}`, { content });
        const updatedComment = response.data.comment;

        const updateInList = (comments) => {
          for (let comment of comments) {
            if (comment.id === commentId) {
              comment.content = updatedComment.content;
              return true;
            }
            if (comment.replies && comment.replies.length > 0) {
              if (updateInList(comment.replies)) return true;
            }
          }
          return false;
        };

        updateInList(this.comments);
        return updatedComment;
      } catch (error) {
        console.error('Lỗi khi cập nhật comment:', error);
        throw error;
      }
    },

    async deleteComment(commentId) {
      try {
        await api.delete(`/comments/${commentId}`);

        const removeFromList = (comments) => {
          for (let i = 0; i < comments.length; i++) {
            if (comments[i].id === commentId) {
              comments.splice(i, 1);
              this.total--;
              return true;
            }
            if (comments[i].replies && comments[i].replies.length > 0) {
              if (removeFromList(comments[i].replies)) return true;
            }
          }
          return false;
        };

        removeFromList(this.comments);
      } catch (error) {
        console.error('Lỗi khi xóa comment:', error);
        throw error;
      }
    },

    async loadMore() {
      if (this.currentPage >= this.lastPage) return;

      const nextPage = this.currentPage + 1;
      if (this.commentableType === 'chapter') {
        await this.fetchChapterComments(this.commentableId, nextPage);
      } else if (this.commentableType === 'episode') {
        await this.fetchEpisodeComments(this.commentableId, nextPage);
      }
    },

    reset() {
      this.comments = [];
      this.loading = false;
      this.currentPage = 1;
      this.lastPage = 1;
      this.total = 0;
      this.commentableType = null;
      this.commentableId = null;
    },
  },

  getters: {
    hasMore: (state) => state.currentPage < state.lastPage,
    commentsCount: (state) => state.total,
  },
});
