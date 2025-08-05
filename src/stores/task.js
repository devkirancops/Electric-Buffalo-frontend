import { defineStore } from 'pinia';
import axios from 'config/axios'
import { useAuthStore } from './auth';
import { Notify } from 'quasar';

const DEFAULT_ERRORS = {
    FETCH_TASKS: 'Failed to fetch tasks',
    CREATE_TASK: 'Failed to create task',
    DELETE_TASK: 'Failed to delete task',
    UPDATE_TASK: 'Failed to update task',
    COMPLETE_TASK: 'Failed to complete task'
}

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: [],
        loading: false,
    }),

    actions: {
        async fetchTasks() {
            this.loading = true;
            const authStore = useAuthStore();

            try {
                const response = await axios.get('/tasks/')

                if (response.data?.success) {
                    this.tasks = response.data?.tasks || []
                    return true;
                }
                authStore.showErrorNotification(response.data?.message || DEFAULT_ERRORS.FETCH_TASKS)
                return false
            } catch (error) {
                return authStore.handleApiError(error, DEFAULT_ERRORS.FETCH_TASKS)
            } finally {
                this.loading = false
            }
        },

        async createTask(payload) {
            this.loading = true;
            const authStore = useAuthStore();

            try {
                const response = await axios.post('/tasks/', payload)

                if (response.data?.success) {
                    Notify.create({ message: 'Task created successfully', color: 'positive', position: 'top', timeout: 3000 })
                    this.tasks.push(response.data.task)
                    return true;
                }
                authStore.showErrorNotification(response.data?.message || DEFAULT_ERRORS.CREATE_TASK)
                return false
            } catch (error) {
                return authStore.handleApiError(error, DEFAULT_ERRORS.CREATE_TASK)
            } finally {
                this.loading = false
            }
        },

        async deleteTask(taskId) {
            this.loading = true;
            const authStore = useAuthStore();

            try {
                const response = await axios.delete(`/tasks/${taskId}`)

                if (response.data?.success) {
                    Notify.create({ message: 'Task deleted successfully', color: 'positive', position: 'top', timeout: 3000 })
                    this.tasks = this.tasks.filter(task => task.entity_id !== taskId)
                    return true;
                }
                authStore.showErrorNotification(response.data?.message || DEFAULT_ERRORS.DELETE_TASK)
                return false
            } catch (error) {
                return authStore.handleApiError(error, DEFAULT_ERRORS.DELETE_TASK)
            } finally {
                this.loading = false
            }
        },

        async updateTask(taskId, payload) {
            this.loading = true;
            const authStore = useAuthStore();

            try {
                const response = await axios.put(`/tasks/${taskId}`, payload)

                if (response.data?.success) {
                    Notify.create({ message: 'Task updated successfully', color: 'positive', position: 'top', timeout: 3000 })
                    const taskIndex = this.tasks.findIndex(task => task.entity_id === taskId)
                    if (taskIndex !== -1) { this.tasks[taskIndex] = response.data.task }
                    return true;
                }
                authStore.showErrorNotification(response.data?.message || DEFAULT_ERRORS.UPDATE_TASK)
                return false
            } catch (error) {
                return authStore.handleApiError(error, DEFAULT_ERRORS.UPDATE_TASK)
            } finally {
                this.loading = false
            }
        },

        async completeTask(taskId) {
            this.loading = true;
            const authStore = useAuthStore();

            try {
                const response = await axios.patch(`/tasks/${taskId}/complete`)

                if (response.data?.success) {
                    Notify.create({ message: 'Task completed successfully', color: 'positive', position: 'top', timeout: 3000 })
                    const taskIndex = this.tasks.findIndex(task => task.entity_id === taskId)
                    if (taskIndex !== -1) { this.tasks[taskIndex] = response.data.task }
                    return true;
                }
                authStore.showErrorNotification(response.data?.message || DEFAULT_ERRORS.COMPLETE_TASK)
                return false
            } catch (error) {
                return authStore.handleApiError(error, DEFAULT_ERRORS.COMPLETE_TASK)
            } finally {
                this.loading = false
            }
        },
    }

})