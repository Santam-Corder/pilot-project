// File Upload Manager - Handles file uploads and downloads with Firebase Storage
import { storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { doc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export class FileUploadManager {
    constructor(db) {
        this.db = db;
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
    }

    /**
     * Validate file before upload
     */
    validateFile(file) {
        if (!file) {
            return { valid: false, error: 'No file selected' };
        }

        if (file.size > this.maxFileSize) {
            return {
                valid: false,
                error: `File too large. Maximum size is ${this.maxFileSize / 1024 / 1024}MB`
            };
        }

        if (!this.allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: 'File type not allowed. Allowed types: PDF, Images, Word, Excel'
            };
        }

        return { valid: true };
    }

    /**
     * Upload file to Firebase Storage and update task document
     */
    async uploadFile(file, taskId, uploadedBy, isAdmin = false) {
        // Validate file
        const validation = this.validateFile(file);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        try {
            // Create storage reference
            const folder = isAdmin ? 'admin' : uploadedBy;
            const timestamp = Date.now();
            const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const storagePath = `task-attachments/${taskId}/${folder}/${timestamp}_${safeFileName}`;
            const storageRef = ref(storage, storagePath);

            // Upload file
            const snapshot = await uploadBytes(storageRef, file);

            // Get download URL
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Create attachment object
            const attachment = {
                name: file.name,
                url: downloadURL,
                storagePath: storagePath,
                uploadedBy: uploadedBy,
                uploadedAt: new Date().toISOString(),
                size: file.size,
                type: file.type
            };

            // Update Firestore task document
            const taskRef = doc(this.db, 'tasks', taskId);
            await updateDoc(taskRef, {
                attachments: arrayUnion(attachment)
            });

            return attachment;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Failed to upload file: ' + error.message);
        }
    }

    /**
     * Download file
     */
    async downloadFile(url, filename) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            // Create download link
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();

            // Clean up
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading file:', error);
            throw new Error('Failed to download file');
        }
    }

    /**
     * Delete file from storage and Firestore
     */
    async deleteFile(taskId, attachment) {
        try {
            // Delete from Storage
            const storageRef = ref(storage, attachment.storagePath);
            await deleteObject(storageRef);

            // Remove from Firestore
            const taskRef = doc(this.db, 'tasks', taskId);
            await updateDoc(taskRef, {
                attachments: arrayRemove(attachment)
            });

            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw new Error('Failed to delete file');
        }
    }

    /**
     * Get file icon based on type
     */
    getFileIcon(fileType) {
        if (fileType.includes('pdf')) return 'fa-file-pdf';
        if (fileType.includes('image')) return 'fa-file-image';
        if (fileType.includes('word')) return 'fa-file-word';
        if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'fa-file-excel';
        return 'fa-file';
    }

    /**
     * Get file icon color
     */
    getFileIconColor(fileType) {
        if (fileType.includes('pdf')) return '#e74c3c';
        if (fileType.includes('image')) return '#3498db';
        if (fileType.includes('word')) return '#2c3e50';
        if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '#27ae60';
        return '#95a5a6';
    }

    /**
     * Format file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}

// Create singleton instance
export const fileUploadManager = new FileUploadManager(null); // db will be set when imported
