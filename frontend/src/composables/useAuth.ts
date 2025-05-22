import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

export function useAuth() {
  const authStore = useAuthStore()
  const isAuthModalOpen = ref(false)
  
  /**
   * Execute an action requiring authentication.
   * Shows auth modal if user is not authenticated.
   * 
   * @param callback - Function to execute if authenticated
   * @param options - Options
   * @returns Promise resolving to result of callback or false if not authenticated
   */
  const withAuth = async <T>(
    callback: () => Promise<T>, 
    options: { 
      redirectAfterLogin?: boolean,
      message?: string 
    } = {}
  ): Promise<T | false> => {
    // Check if user is authenticated
    if (authStore.isAuthenticated) {
      // User is authenticated, execute callback
      return await callback()
    }
    
    // User is not authenticated, show auth modal
    isAuthModalOpen.value = true
    
    // Return false to indicate authentication required
    return false
  }
  
  /**
   * Open the auth modal
   */
  const openAuthModal = () => {
    isAuthModalOpen.value = true
  }
  
  /**
   * Close the auth modal
   */
  const closeAuthModal = () => {
    isAuthModalOpen.value = false
  }
  
  return {
    isAuthModalOpen,
    withAuth,
    openAuthModal,
    closeAuthModal,
  }
} 