import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_DEV_URL

// Fetch user data by role
export const fetchUserByRole = async (role) => {
  const response = await fetch(`${API_URL}/api/users/${role}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user data')
  }
  return response.json()
}

// Custom hook to fetch user data
export const useUserData = (role) => {
  return useQuery({
    queryKey: ['user', role],
    queryFn: () => fetchUserByRole(role)
  })
}

// Fetch conversations for a specific user role
export const fetchConversationsByRole = async (role) => {
  const response = await fetch(`${API_URL}/api/conversations?role=${role}`)
  if (!response.ok) {
    throw new Error('Failed to fetch conversations')
  }
  return response.json()
}

// Custom hook to fetch conversations based on user role
export const useConversations = (role) => {
  return useQuery({
    queryKey: ['conversations', role],
    queryFn: () => fetchConversationsByRole(role),
  })
}

// Fetch messages for a specific conversation
export const fetchMessages = async (conversationId) => {
  const response = await fetch(`${API_URL}/api/messages/${conversationId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch messages')
  }
  return response.json()
}

// Custom hook to fetch messages for a conversation
export const useMessages = (conversationId) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId,
  })
} 