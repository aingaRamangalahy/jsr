<template>
  <div>
    <header class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">User Management</h1>
        <p class="text-muted-foreground">Manage users who access the JSR platform</p>
      </div>
      <Button @click="openCreateDialog">Add New User</Button>
    </header>

    <div class="rounded-md border">
      <Table>
        <TableCaption>List of users registered on the platform</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>GitHub ID</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="isLoading" class="h-24">
            <TableCell colspan="6" class="text-center">
              Loading users...
            </TableCell>
          </TableRow>
          <TableRow v-else-if="users.length === 0" class="h-24">
            <TableCell colspan="6" class="text-center">
              No users found. Create your first user by clicking "Add New User".
            </TableCell>
          </TableRow>
          <TableRow v-else v-for="user in users" :key="user.id">
            <TableCell>{{ user.name }}</TableCell>
            <TableCell>{{ user.email }}</TableCell>
            <TableCell>{{ user.githubId || 'N/A' }}</TableCell>
            <TableCell>{{ user.role }}</TableCell>
            <TableCell>{{ formatDate(user.createdAt) }}</TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end space-x-2">
                <Button variant="outline" size="sm" @click="openEditDialog(user)">
                  Edit
                </Button>
                <Button variant="destructive" size="sm" @click="openDeleteDialog(user)">
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Create/Edit User Dialog -->
    <Dialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ formTitle }}</DialogTitle>
          <DialogDescription>
            Fill in the details to {{ selectedUser ? 'update' : 'create' }} a user.
          </DialogDescription>
        </DialogHeader>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <label for="name">Name</label>
              <Input id="name" v-model="formData.name" required />
            </div>
            
            <div class="grid gap-2">
              <label for="email">Email</label>
              <Input id="email" v-model="formData.email" type="email" required />
            </div>
            
            <div class="grid gap-2">
              <label for="githubId">GitHub ID</label>
              <Input id="githubId" v-model="formData.githubId" />
            </div>
            
            <div class="grid gap-2">
              <label for="role">Role</label>
              <select 
                id="role" 
                v-model="formData.role" 
                class="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              @click="isDialogOpen = false"
              :disabled="isLoading"
            >
              Cancel
            </Button>
            <Button type="submit" :disabled="isLoading">
              {{ isLoading ? 'Saving...' : (selectedUser ? 'Update' : 'Create') }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            @click="isDeleteDialogOpen = false"
            :disabled="isLoading"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            @click="handleDelete"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Deleting...' : 'Delete' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <!-- Add Toaster component -->
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userService, type User } from '@/services/user.service'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'vue-sonner'

// Form state
const formTitle = ref('Create User')
const isDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const selectedUser = ref<User | null>(null)
const isLoading = ref(false)
const users = ref<User[]>([])

// Form data
const formData = ref({
  name: '',
  email: '',
  githubId: '',
  role: 'user' as 'user' | 'moderator' // Default role with proper type
})

// Load users on mount
onMounted(async () => {
  await fetchUsers()
})

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await userService.getUsers()
    if (response.data) {
      users.value = response.data
    }
  } catch (error) {
    toast.error('Failed to load users')
    console.error('Error fetching users:', error)
  } finally {
    isLoading.value = false
  }
}

const openCreateDialog = () => {
  formTitle.value = 'Create User'
  resetForm()
  selectedUser.value = null
  isDialogOpen.value = true
}

const openEditDialog = (user: User) => {
  formTitle.value = 'Edit User'
  selectedUser.value = user
  formData.value = {
    name: user.name,
    email: user.email,
    githubId: user.githubId || '',
    role: user.role
  }
  isDialogOpen.value = true
}

const openDeleteDialog = (user: User) => {
  selectedUser.value = user
  isDeleteDialogOpen.value = true
}

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    githubId: '',
    role: 'user'
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  try {
    if (selectedUser.value) {
      // Update user
      await userService.updateUser(selectedUser.value.id, formData.value)
      toast.success('User updated successfully')
    } else {
      // Create user
      await userService.createUser(formData.value)
      toast.success('User created successfully')
    }
    isDialogOpen.value = false
    await fetchUsers()
  } catch (error) {
    toast.error(selectedUser.value 
      ? 'Failed to update user' 
      : 'Failed to create user'
    )
    console.error('Error saving user:', error)
  } finally {
    isLoading.value = false
  }
}

const handleDelete = async () => {
  if (!selectedUser.value) return
  
  isLoading.value = true
  try {
    await userService.deleteUser(selectedUser.value.id)
    toast.success('User deleted successfully')
    isDeleteDialogOpen.value = false
    await fetchUsers()
  } catch (error) {
    toast.error('Failed to delete user')
    console.error('Error deleting user:', error)
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleDateString()
}

// Add default export
defineOptions({
  name: 'UsersPage'
})
</script> 