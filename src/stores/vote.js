// stores/vote.js
import { defineStore } from 'pinia';
import api from '../services/axiosInterceptor';
import apiLinks from '../services/api-links';

export const useVoteStore = defineStore('vote', {
  state: () => ({
    userVoteChoice: null,
  }),
  actions: {
    async getUserVote() {
      const storedVote = sessionStorage.getItem('userVoteChoice');
      if (storedVote) {
        this.userVoteChoice = parseInt(storedVote);
      } else {
        try {
          const response = await api.get('/vote/getUserVote');
          if (response.data.vote) {
            this.userVoteChoice = parseInt(response.data.vote.choice);
            sessionStorage.setItem('userVoteChoice', this.userVoteChoice);
          }
        } catch (error) {
          this.userVoteChoice = null;
        }
      }
    },
    async vote(choice) {
      try {
        const response = await api.post('/vote/createOrUpdate', { choice });
        this.userVoteChoice = choice;
        sessionStorage.setItem('userVoteChoice', choice);
        return response.data.message;
      } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
      }
    },
  }
});
