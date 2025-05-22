<template>
  <MainLayout>
    <div class="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to the JSR Admin Dashboard</p>
      
      <div class="dashboard-stats">
        <div class="stat-card">
          <h3>Total Resources</h3>
          <div class="stat-value">{{ stats.totalResources || '--' }}</div>
        </div>
        <div class="stat-card">
          <h3>Pending Resources</h3>
          <div class="stat-value">{{ stats.pendingResources || '--' }}</div>
        </div>
        <div class="stat-card">
          <h3>Free Resources</h3>
          <div class="stat-value">{{ stats.freeResources || '--' }}</div>
        </div>
        <div class="stat-card">
          <h3>Paid Resources</h3>
          <div class="stat-value">{{ stats.paidResources || '--' }}</div>
        </div>
      </div>
      
      <div class="dashboard-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <router-link to="/resources?status=pending" class="action-card">
            <h3>Review Pending Resources</h3>
            <p>Approve or reject new resource submissions</p>
          </router-link>
          <router-link to="/categories" class="action-card">
            <h3>Manage Categories</h3>
            <p>Add, edit or remove resource categories</p>
          </router-link>
          <router-link to="/types" class="action-card">
            <h3>Manage Resource Types</h3>
            <p>Add, edit or remove resource types</p>
          </router-link>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import api from '../services/api'

interface DashboardStats {
  totalResources: number
  pendingResources: number
  freeResources: number
  paidResources: number
}

const stats = ref<DashboardStats>({
  totalResources: 0,
  pendingResources: 0,
  freeResources: 0,
  paidResources: 0
})

const fetchStats = async () => {
  try {
    // This endpoint would need to be implemented in the backend
    const response = await api.get('/api/v1/admin/stats')
    stats.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    // For development, set some dummy data
    stats.value = {
      totalResources: 120,
      pendingResources: 15,
      freeResources: 85,
      paidResources: 35
    }
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

h1 {
  margin-top: 0;
  color: #2c3e50;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
}

.stat-card h3 {
  margin-top: 0;
  color: #555;
  font-size: 1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 10px;
}

.dashboard-actions {
  margin-top: 40px;
}

h2 {
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.action-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  color: inherit;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-card h3 {
  margin-top: 0;
  color: #2c3e50;
}

.action-card p {
  color: #666;
  margin-bottom: 0;
}
</style> 