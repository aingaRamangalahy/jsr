<template>
  <SidebarProvider :open="!collapsed" @update:open="$emit('update:collapsed', !$event)">
    <div class="has-[sidebar-wrapper]:w-full">
      <Sidebar>
        <SidebarHeader>
          <div class="flex items-center justify-between p-4">
            
            <div class="flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10 text-primary font-bold">
              <span class="text-xl">~/</span>
              <span class="text-2xl tracking-tight">js resources</span>
            </div>
            <slot name="header"></slot>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup v-for="group in adminNavigation" :key="group.title">
            <SidebarGroupLabel>{{ group.title }}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem v-for="item in group.items" :key="item.title">
                  <SidebarMenuButton
                    as-child
                    :is-active="isActive(item.path)"
                    @click="navigateTo(item.path)"
                  >
                    <a>{{ item.title }}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div class="mt-auto">
          <slot name="user-info"></slot>
          <slot name="footer"></slot>
        </div>
        <SidebarRail />
      </Sidebar>
    </div>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar'

const router = useRouter()
const props = defineProps<{
  collapsed?: boolean;
  mobile?: boolean;
}>()

defineEmits(['update:collapsed'])

// Define our admin navigation groups
const adminNavigation = [
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Overview',
        path: '/dashboard',
      }
    ]
  },
  {
    title: 'Content Management',
    items: [
      {
        title: 'Resources',
        path: '/resources',
      },
      {
        title: 'Categories',
        path: '/categories',
      },
      {
        title: 'Resource Types',
        path: '/types',
      },
      {
        title: 'Users',
        path: '/users',
      }
    ]
  },
  {
    title: 'Development',
    items: [
      {
        title: 'Components Test',
        path: '/components',
      }
    ]
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}

const isActive = (path: string) => {
  return router.currentRoute.value.path === path
}

// Add default export
defineOptions({
  name: 'AppSidebar'
})
</script>

<script lang="ts">
export default {}
</script>
