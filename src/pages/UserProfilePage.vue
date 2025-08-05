<template>
    <q-page class="q-pa-md">
        <q-card>
            <q-card-section>
                <div class="text-h6">
                    Profile
                </div>
            </q-card-section>

            <q-card-section>
                <q-form class="full-width" @submit.prevent="onSubmit" >
                  <q-input v-model="firstName" type="text" label="First name" outlined class="q-mb-lg" :disable="authStore.loading" :maxlength="50"/>
                  <q-input v-model="lastName" type="text" label="Last name" outlined class="q-mb-lg" :disable="authStore.loading" :maxlength="50"/>
                  <q-btn label="Update" color="primary" type="submit" class="full-width" :loading="authStore.loading" :disable="authStore.loading"/>
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth';
import { onMounted, ref } from 'vue';

const authStore =useAuthStore()
const firstName = ref('')
const lastName = ref('')

onMounted(() => {
    firstName.value = authStore.user?.first_name || ''
    lastName.value = authStore.user?.last_name || ''
})

async function onSubmit() {
    await authStore.updateUserProfile({ first_name: firstName.value.trim(), last_name: lastName.value.trim() })
}

</script>