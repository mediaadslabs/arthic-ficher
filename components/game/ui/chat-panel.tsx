'use client'

import { useState, useRef, useEffect } from 'react'
import { useGameStore } from '@/lib/game/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { ChatChannel, ChatMessage } from '@/lib/game/types'
import { MessageCircle, Globe, Users, Lock, Send, X } from 'lucide-react'

interface ChatPanelProps {
  onClose: () => void
}

const CHAT_TABS: { id: ChatChannel; label: string; icon: typeof Globe }[] = [
  { id: 'world', label: 'World', icon: Globe },
  { id: 'clan', label: 'Clan', icon: Users },
  { id: 'private', label: 'Private', icon: Lock },
]

function formatChatTime(timestamp: number): string {
  const d = new Date(timestamp)
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0')
}

function ChatMessageRow({ message }: { message: ChatMessage }) {
  const isSystem = message.type === 'system'
  const isPrivate = message.type === 'private'
  return (
    <div className={`px-3 py-1.5 text-sm ${isSystem ? 'opacity-60' : ''}`}>
      <span className="text-[10px] text-slate-500 mr-2">{formatChatTime(message.timestamp)}</span>
      {isSystem ? (
        <span className="text-slate-400 italic">{message.content}</span>
      ) : (
        <>
          <span className={`font-semibold mr-1 ${isPrivate ? 'text-pink-400' : 'text-cyan-400'}`}>
            {message.senderName}
            {isPrivate && recipientLabel(message)}
          </span>
          <span className="text-slate-200">{message.content}</span>
        </>
      )}
    </div>
  )
}

function recipientLabel(msg: ChatMessage): string {
  if (msg.recipientName) return ` \u2192 ${msg.recipientName}`
  return ''
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const {
    player,
    sendWorldMessage,
    sendClanMessage,
    sendPrivateMessage,
    getChatMessages,
    markChatRead,
    addSystemMessage,
  } = useGameStore()

  const [activeTab, setActiveTab] = useState<ChatChannel>('world')
  const [message, setMessage] = useState('')
  const [privateTarget, setPrivateTarget] = useState<{ id: string; name: string } | null>(null)
  const [showPrivateInput, setShowPrivateInput] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const messages = activeTab === 'private' && privateTarget
    ? getChatMessages('private', privateTarget.id)
    : activeTab === 'world'
    ? getChatMessages('world')
    : activeTab === 'clan'
    ? getChatMessages('clan')
    : []

  useEffect(() => {
    markChatRead(activeTab, privateTarget?.id)
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 50)
  }, [activeTab, privateTarget, messages.length, markChatRead])

  useEffect(() => {
    if (showPrivateInput || activeTab !== 'private') {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [showPrivateInput, activeTab])

  const handleSend = () => {
    if (!message.trim() || !player) return
    if (activeTab === 'world') {
      sendWorldMessage(message)
    } else if (activeTab === 'clan') {
      if (!player.clanId) {
        addSystemMessage('clan', 'You are not in a clan.')
        return
      }
      sendClanMessage(message)
    } else if (activeTab === 'private') {
      if (privateTarget) {
        sendPrivateMessage(privateTarget.id, privateTarget.name, message)
      } else {
        addSystemMessage('private', 'Select a player to message first.')
      }
    }
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const startPrivateChat = (target: { id: string; name: string }) => {
    setPrivateTarget(target)
    setActiveTab('private')
    setShowPrivateInput(false)
  }

  const isPrivateTargetInMessages = activeTab === 'private' && privateTarget
  const chatPlaceholder = activeTab === 'world'
    ? 'Chat with everyone...'
    : activeTab === 'clan'
    ? 'Chat with your clan...'
    : privateTarget
    ? `Message ${privateTarget.name}...`
    : 'Select a player to message'

  return (
    <div className="fixed bottom-24 right-4 w-80 h-96 bg-slate-900/95 backdrop-blur-md border border-cyan-500/20 rounded-xl shadow-2xl flex flex-col z-50 pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <span className="text-white font-semibold text-sm">Chat</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as ChatChannel); setShowPrivateInput(false) }}>
        <TabsList className="bg-slate-800/50 mx-3 mt-2">
          {CHAT_TABS.map((tab) => {
            const Icon = tab.icon
            const unread = tab.id === 'world'
              ? player?.chat.unreadWorld || 0
              : tab.id === 'clan'
              ? player?.chat.unreadClan || 0
              : 0
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-1 text-xs data-[state=active]:bg-cyan-600/30 data-[state=active]:text-cyan-300"
              >
                <Icon className="w-3 h-3" />
                {tab.label}
                {unread > 0 && (
                  <span className="bg-red-500 text-white text-[9px] rounded-full px-1 min-w-[14px] text-center">
                    {unread}
                  </span>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* World Chat */}
        <TabsContent value="world" className="flex-1 flex flex-col m-0 p-0">
          <ScrollArea className="flex-1" ref={scrollRef}>
            <div className="py-2">
              {messages.length === 0 && (
                <p className="text-slate-500 text-xs text-center py-8">No messages yet. Say hello!</p>
              )}
              {messages.map((msg) => (
                <ChatMessageRow key={msg.id} message={msg} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Clan Chat */}
        <TabsContent value="clan" className="flex-1 flex flex-col m-0 p-0">
          <ScrollArea className="flex-1" ref={scrollRef}>
            <div className="py-2">
              {!player?.clanId && (
                <p className="text-yellow-400 text-xs text-center py-4">You are not in a clan. Create or join one to chat.</p>
              )}
              {messages.length === 0 && player?.clanId && (
                <p className="text-slate-500 text-xs text-center py-8">No clan messages yet.</p>
              )}
              {messages.map((msg) => (
                <ChatMessageRow key={msg.id} message={msg} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Private Chat */}
        <TabsContent value="private" className="flex-1 flex flex-col m-0 p-0">
          {isPrivateTargetInMessages ? (
            <>
              <div className="flex items-center justify-between px-3 py-1 border-b border-slate-700/30">
                <span className="text-xs text-pink-400">To: {privateTarget.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setPrivateTarget(null); setShowPrivateInput(false) }}
                  className="h-5 w-5 p-0 text-slate-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <ScrollArea className="flex-1" ref={scrollRef}>
                <div className="py-2">
                  {messages.map((msg) => (
                    <ChatMessageRow key={msg.id} message={msg} />
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <Lock className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-slate-500 text-xs text-center mb-3">Message another player privately</p>
              {showPrivateInput ? (
                <div className="flex gap-2 w-full">
                  <Input
                    placeholder="Player name..."
                    className="bg-slate-800 border-slate-600 text-white text-xs h-8"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const name = (e.target as HTMLInputElement).value.trim()
                        if (name && player) {
                          startPrivateChat({ id: `player_${name.toLowerCase()}`, name })
                        }
                      }
                    }}
                  />
                  <Button size="sm" className="h-8 text-xs" onClick={() => setShowPrivateInput(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-slate-600"
                  onClick={() => setShowPrivateInput(true)}
                >
                  Find Player
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Input */}
      <div className="p-3 border-t border-slate-700/50">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={chatPlaceholder}
            className="bg-slate-800 border-slate-600 text-white text-sm h-9 placeholder:text-slate-500"
            disabled={activeTab === 'clan' && !player?.clanId}
          />
          <Button
            size="icon"
            className="h-9 w-9 bg-cyan-600 hover:bg-cyan-500 shrink-0"
            onClick={handleSend}
            disabled={!message.trim() || (activeTab === 'clan' && !player?.clanId)}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
