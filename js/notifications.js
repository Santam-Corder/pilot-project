// Notification Manager - Handles browser notifications and sound alerts
export class NotificationManager {
    constructor() {
        this.audioContext = null;
        this.notificationsEnabled = false;
        this.soundsEnabled = true;
        this.init();
    }

    async init() {
        // Initialize Audio Context
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }

        // Request notification permission
        await this.requestPermission();
    }

    async requestPermission() {
        if (!("Notification" in window)) {
            console.warn("This browser does not support notifications");
            return false;
        }

        if (Notification.permission === "granted") {
            this.notificationsEnabled = true;
            return true;
        }

        if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            this.notificationsEnabled = permission === "granted";
            return this.notificationsEnabled;
        }

        return false;
    }

    playSound(type) {
        if (!this.soundsEnabled || !this.audioContext) return;

        // Different sounds for different events
        const soundConfigs = {
            'assign': { frequency: 800, duration: 0.15, type: 'sine' },      // High chime
            'accept': { frequency: 600, duration: 0.2, type: 'sine' },       // Success tone
            'decline': { frequency: 400, duration: 0.25, type: 'square' },   // Alert tone
            'complete': { frequency: 1000, duration: 0.15, type: 'sine' }    // Celebration
        };

        const config = soundConfigs[type] || soundConfigs['accept'];

        // Play a pleasant multi-tone sound
        if (type === 'complete') {
            // Celebration sound - play ascending notes
            this.playTone(800, 0.1);
            setTimeout(() => this.playTone(1000, 0.1), 100);
            setTimeout(() => this.playTone(1200, 0.15), 200);
        } else if (type === 'decline') {
            // Alert sound - play descending notes
            this.playTone(600, 0.1);
            setTimeout(() => this.playTone(400, 0.15), 100);
        } else {
            // Single tone for assign and accept
            this.playTone(config.frequency, config.duration, config.type);
        }
    }

    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        // Smooth envelope to avoid clicks
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    showNotification(title, body, type = 'assign') {
        // Play sound
        this.playSound(type);

        // Show browser notification
        if (this.notificationsEnabled && Notification.permission === "granted") {
            const notification = new Notification(title, {
                body: body,
                icon: this.getIconForType(type),
                badge: '/favicon.ico',
                tag: type + '-' + Date.now(), // Unique tag
                requireInteraction: false,
                silent: true // We handle sound ourselves
            });

            // Auto-close after 5 seconds
            setTimeout(() => notification.close(), 5000);

            // Optional: Handle notification click
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    }

    getIconForType(type) {
        // You can customize icons based on type
        const icons = {
            'assign': '🔔',
            'accept': '✅',
            'decline': '⚠️',
            'complete': '🎉'
        };

        // For now, return a data URL with emoji
        // In production, you'd use actual icon files
        return '/favicon.ico';
    }

    // Toggle sound on/off
    toggleSound(enabled) {
        this.soundsEnabled = enabled;
    }

    // Test notification
    test() {
        this.showNotification(
            'Test Notification',
            'This is a test notification with sound',
            'assign'
        );
    }
}

// Create singleton instance
export const notificationManager = new NotificationManager();
