import { useState } from 'react'
import { useConversations } from '../services/api'

const accountTypes = [
  { id: 'BUSINESS', label: 'Business' },
  { id: 'GUEST', label: 'Guest' },
  { id: 'VENDOR', label: 'Vendor' }
]

export function Sidebar({ onSelectConversation, onRoleChange, currentRole }) {
  const { data: conversations, isLoading, error } = useConversations(currentRole)
  const [selectedId, setSelectedId] = useState(null)

  const handleRoleChange = (e) => {
    const newRole = e.target.value
    onRoleChange(newRole)
    setSelectedId(null)
  }

  const handleConversationSelect = (conversation) => {
    setSelectedId(conversation.id)
    onSelectConversation(conversation)
  }

  return (
    <aside className="fixed left-0 top-0 w-80 h-screen border-r bg-background flex flex-col">
      {/* Logo/Brand Section */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Conduit</h1>
      </div>

      {/* Account Section */}
      <div className="p-4 border-b">
        <div className="space-y-2">
          <label htmlFor="account-select" className="text-sm font-medium text-muted-foreground">
            Account
          </label>
          <select
            id="account-select"
            value={currentRole}
            onChange={handleRoleChange}
            className="w-full p-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            {accountTypes.map(account => (
              <option key={account.id} value={account.id}>
                {account.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Conversations Section */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-sm font-medium text-neutral-800">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading conversations...</div>
          ) : error ? (
            <div className="p-4 text-sm text-destructive">Error loading conversations</div>
          ) : conversations?.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No conversations found</div>
          ) : (
            <div className="flex flex-col">
              {conversations?.map(conversation => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationSelect(conversation)}
                  className={`w-full p-4 text-left cursor-pointer transition-colors ${
                    selectedId === conversation.id 
                      ? 'bg-neutral-100 hover:bg-neutral-200' 
                      : 'bg-white hover:bg-neutral-100'
                  }`}
                >
                  <div className="font-medium text-foreground">{conversation.recipient.name}</div>
                  <div className="text-sm text-neutral-600 truncate mb-2">
                    {conversation.lastMessage?.body || 'No messages yet'}
                  </div>
                  <div className="text-xs text-neutral-600">
                    {conversation.lastMessage 
                      ? new Date(conversation.lastMessage.createdAt).toLocaleString()
                      : new Date(conversation.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {accountTypes.find(a => a.id === currentRole)?.label.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {accountTypes.find(a => a.id === currentRole)?.label} User
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {currentRole.toLowerCase()}@example.com
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
} 