import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactFlowProvider } from 'reactflow'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Chat } from './components/Chat'
import { initializeSocket } from './services/socket'
import 'reactflow/dist/style.css'

const queryClient = new QueryClient()

function AppContent() {
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [currentUserRole, setCurrentUserRole] = useState(() => {
    // Get role from localStorage or default to BUSINESS
    return localStorage.getItem('userRole') || 'BUSINESS'
  })
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Initialize socket connection when app starts
    initializeSocket();
  }, []);

  // Update route when role changes
  useEffect(() => {
    const role = currentUserRole.toLowerCase()
    if (location.pathname !== `/${role}`) {
      navigate(`/${role}`)
    }
  }, [currentUserRole, navigate, location])

  // Update role when route changes
  useEffect(() => {
    const role = location.pathname.slice(1).toUpperCase()
    if (['BUSINESS', 'GUEST', 'VENDOR'].includes(role)) {
      setCurrentUserRole(role)
      localStorage.setItem('userRole', role)
    }
  }, [location])

  const handleRoleChange = (role) => {
    setCurrentUserRole(role)
    setSelectedConversation(null) // Reset selected conversation when role changes
    localStorage.setItem('userRole', role)
  }

  return (
    <div className="flex h-screen bg-neutral-100">
      <Sidebar 
        onSelectConversation={setSelectedConversation} 
        onRoleChange={handleRoleChange}
        currentRole={currentUserRole}
      />
      <main className="flex-1 min-w-0 ml-80">
        <Chat 
          conversation={selectedConversation} 
          currentUserRole={currentUserRole}
        />
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ReactFlowProvider>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/:role" element={<AppContent />} />
          </Routes>
        </ReactFlowProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
