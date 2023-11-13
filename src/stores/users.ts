import { defineStore } from 'pinia'
import { User } from '../pages/users/types'
import { sleep } from '../services/utils'
import users from './mock/users'
import { computed, ref, watch } from 'vue'

const apiFetchUsers = async (pagination: { page: number; perPage: number }) => {
  await sleep(1000)
  return {
    data: users.slice((pagination.page - 1) * pagination.perPage, pagination.page * pagination.perPage),
    pagination: {
      page: pagination.page,
      perPage: pagination.perPage,
      total: users.length,
    },
  }
}

const apiAddUser = async (user: User) => {
  await sleep(1000)
  users.unshift(user)
  return users
}

const apiRemoveUser = async (user: User) => {
  await sleep(1000)
  users.splice(users.indexOf(user), 1)
  return users
}

export const useUsersStore = defineStore('users', () => {
  const users = ref([] as User[])
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    perPage: 10,
    total: 250,
  })

  const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.perPage))

  const load = async () => {
    loading.value = true
    const response = await apiFetchUsers(pagination.value)
    users.value = response.data
    pagination.value = response.pagination
    loading.value = false
  }

  watch([() => pagination.value.perPage, () => pagination.value.page], () => {
    load()
  })

  load()

  const addNewUser = async (user: User) => {
    loading.value = true
    users.value = await apiAddUser(user)
    loading.value = false
  }

  const removeUser = async (user: User) => {
    loading.value = true
    users.value = await apiRemoveUser(user)
    loading.value = false
  }

  return {
    users,
    loading,
    pagination,
    totalPages,
    load,
    addNewUser,
    removeUser,
  }
})
