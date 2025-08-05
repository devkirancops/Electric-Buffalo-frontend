<template>
    <q-page class="q-pa-md">
        <q-card class="q-pa-lg" flat bordered>
            <q-card-section>
                <div class="text-h6">Tasks</div>

                <div class="row q-col-gutter-sm q-mt-md">
                    <q-input v-model="newTask" placeholder="Enter new task name" dense outlined class="col-6" :disable="taskStore.loading" />
                    <q-btn label="Add" color="primary" class="q-ml-sm" @click="addTask" :disable="taskStore.loading || !newTask.trim()" />
                </div>
            </q-card-section>

            <q-card-section>
                <q-spinner v-if="taskStore.loading" color="primary" size="md" />

                <q-list v-else>
                    <q-item v-for="task in taskStore.tasks" :key="task.entity_id" class="q-mb-xs">
                        <q-item-section>
                            <div v-if="editingTaskId === task.entity_id" class="row items-center q-gutter-sm">
                                <q-input 
                                    v-model="editingTaskName" 
                                    dense 
                                    outlined 
                                    class="col-grow"
                                    @keyup.enter="saveTask(task.entity_id)"
                                    @keyup.escape="cancelEdit"
                                />
                                <q-btn icon="check" size="sm" flat @click="saveTask(task.entity_id)" />
                                <q-btn icon="close" size="sm" flat @click="cancelEdit"/>
                            </div>
                            <div v-else :class="{ 'text-strike text-grey': task.is_completed }">
                                {{ task.name }}
                            </div>
                        </q-item-section>

                        <q-item-section v-if="editingTaskId !== task.entity_id" side>
                            <q-checkbox :model-value="task.is_completed" @update:model-value="completeTask(task)" :disable="taskStore.loading || task.is_completed"/>
                        </q-item-section>
                        
                        <q-item-section side v-if="editingTaskId !== task.entity_id">
                            <div v-if="editingTaskId === task.entity_id" class="row items-center q-gutter-sm">
                                <q-input v-model="editingTaskName" dense outlined class="col-grow" @keyup.enter="saveTask(task.entity_id)" @keyup.escape="cancelEdit" />
                                <q-btn icon="check" size="sm" flat @click="saveTask(task.entity_id)" />
                                <q-btn icon="close" size="sm" flat @click="cancelEdit" />
                            </div>
                        </q-item-section>

                        <q-item-section side v-if="editingTaskId !== task.entity_id">
                            <div class="row q-gutter-sm">
                                <q-btn icon="edit" size="sm" flat @click="startEdit(task)" :disable="taskStore.loading" />
                                <q-btn icon="delete" size="sm" flat @click="confirmDelete(task)" :disable="taskStore.loading" />
                            </div>
                        </q-item-section>
                    </q-item>

                    <div v-if="!taskStore.tasks.length" class="text-grey q-mt-md">No tasks</div>
                </q-list>
            </q-card-section>
        </q-card>

        <q-dialog v-model="showDeleteModal" persistent> 
            <q-card>
                <q-card-section class="row items-center">
                    <span class="q-ml-sm">Are you sure you want to delete this task?</span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn flat label="Delete" color="negative" @click="deleteTask" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useTaskStore } from 'stores/task'

const taskStore = useTaskStore()
const newTask = ref('')
const editingTaskId = ref(null)
const editingTaskName = ref('')
const showDeleteModal = ref(false)
const taskToDelete = ref(null)

onMounted(() => {
    taskStore.fetchTasks()
})

async function addTask() {
    const payload = { name: newTask.value.trim() }
    await taskStore.createTask(payload)
    newTask.value = ''
}

function startEdit(task) {
    editingTaskId.value = task.entity_id
    editingTaskName.value = task.name
}

function cancelEdit() {
    editingTaskId.value = null
    editingTaskName.value = ''
}

async function saveTask(taskId) {
    if (!editingTaskName.value.trim()) return
    await taskStore.updateTask(taskId, { name: editingTaskName.value.trim() })
    cancelEdit()
}

async function completeTask(task) {
    if (!task.is_completed) {
        await taskStore.completeTask(task.entity_id)
    }
}

function confirmDelete(task) {
    taskToDelete.value = task
    showDeleteModal.value = true
}

async function deleteTask() {
    if (taskToDelete.value) {
        await taskStore.deleteTask(taskToDelete.value.entity_id)
        showDeleteModal.value = false
        taskToDelete.value = null
    }
}
</script>

<style scoped>
.text-strike {
    text-decoration: line-through;
}
</style>