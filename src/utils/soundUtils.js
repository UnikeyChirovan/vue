// File: src/utils/soundUtils.js

// Web Audio API để tạo âm thanh
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Tạo âm thanh notification đơn giản
 */
function createBeepSound(frequency = 800, duration = 150) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + duration / 1000
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}

/**
 * Âm thanh khi nhận tin nhắn (trong chat window đang mở)
 */
export function playMessageSound() {
  try {
    // Âm "pop" nhẹ nhàng
    createBeepSound(600, 100);
  } catch (error) {
    console.error('Error playing message sound:', error);
  }
}

/**
 * Âm thanh thông báo (khi chat đang minimize hoặc đóng)
 */
export function playNotificationSound() {
  try {
    // Âm "ding" rõ ràng hơn
    const playNote = (freq, startTime, duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;
    playNote(800, now, 0.15);
    playNote(1000, now + 0.1, 0.15);
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
}

/**
 * Âm thanh khi gửi tin nhắn
 */
export function playSendSound() {
  try {
    createBeepSound(1200, 80);
  } catch (error) {
    console.error('Error playing send sound:', error);
  }
}

/**
 * Sử dụng file âm thanh có sẵn (tùy chọn)
 */
export class SoundManager {
  constructor() {
    this.sounds = {
      message: null,
      notification: null,
      send: null,
    };
    this.enabled = true;
  }

  /**
   * Tải file âm thanh
   * @param {string} type - 'message', 'notification', 'send'
   * @param {string} url - URL của file âm thanh
   */
  loadSound(type, url) {
    const audio = new Audio(url);
    audio.volume = 0.5;
    this.sounds[type] = audio;
  }

  /**
   * Phát âm thanh
   * @param {string} type - 'message', 'notification', 'send'
   */
  play(type) {
    if (!this.enabled) return;

    const sound = this.sounds[type];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((error) => {
        console.error('Error playing sound:', error);
      });
    } else {
      // Fallback sang beep sound
      switch (type) {
        case 'message':
          playMessageSound();
          break;
        case 'notification':
          playNotificationSound();
          break;
        case 'send':
          playSendSound();
          break;
      }
    }
  }

  /**
   * Bật/tắt âm thanh
   */
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume) {
    Object.values(this.sounds).forEach((sound) => {
      if (sound) sound.volume = volume;
    });
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

/*
===========================================
HƯỚNG DẪN SỬ DỤNG
===========================================

1. SỬ DỤNG BEEP SOUNDS (Mặc định)
   
   import { playMessageSound, playNotificationSound } from '@/utils/soundUtils';
   
   // Khi nhận tin nhắn trong chat đang mở
   playMessageSound();
   
   // Khi nhận tin nhắn từ chat minimize
   playNotificationSound();


2. SỬ DỤNG FILE ÂM THANH TÙY CHỈNH
   
   import { soundManager } from '@/utils/soundUtils';
   
   // Trong App.vue hoặc main.js
   soundManager.loadSound('message', '/sounds/message.mp3');
   soundManager.loadSound('notification', '/sounds/notification.mp3');
   soundManager.loadSound('send', '/sounds/send.mp3');
   
   // Sử dụng
   soundManager.play('message');
   soundManager.play('notification');
   soundManager.play('send');


3. THÊM TÙY CHỌN BẬT/TẮT ÂM THANH
   
   // Trong settings
   <n-switch 
     v-model:value="soundEnabled"
     @update:value="handleSoundToggle"
   />
   
   const handleSoundToggle = (value) => {
     soundManager.enabled = value;
     localStorage.setItem('sound_enabled', value);
   };


4. TẢI FILE ÂM THANH
   
   Đặt file trong thư mục public/sounds/:
   - message.mp3 (âm thanh nhẹ nhàng)
   - notification.mp3 (âm thanh rõ ràng)
   - send.mp3 (âm thanh whoosh)
   
   Hoặc tải miễn phí từ:
   - https://freesound.org/
   - https://mixkit.co/free-sound-effects/notification/
   - https://soundbible.com/


5. LƯU Ý BROWSER AUTOPLAY POLICY
   
   Một số browser chặn autoplay âm thanh. 
   Giải pháp: Phát âm thanh sau tương tác user đầu tiên
   
   // Trong App.vue mounted
   document.addEventListener('click', () => {
     audioContext.resume();
   }, { once: true });


6. TÍCH HỢP VỚI CHAT MANAGER
   
   File: ChatManager.vue
   
   import { playMessageSound, playNotificationSound } from '@/utils/soundUtils';
   
   watch(() => chatStore.openWindows, (windows) => {
     // Phát âm thanh khi có tin nhắn mới
     windows.forEach(window => {
       if (hasNewMessage(window)) {
         playMessageSound();
       }
     });
   }, { deep: true });
*/
