'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/game/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Anchor, Ship, Waves, Play, Save, Settings, Trash2, Users, Database, Shield, Globe, Link, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { getRandomSpawnCountry, getSpawnPosition } from '@/lib/game/world-data'
import { format } from 'date-fns'
import { SettingsMenu } from './settings-menu'

interface StartMenuProps {
  onStartGame: () => void
}

export function StartMenu({ onStartGame }: StartMenuProps) {
  const { 
    initializePlayer, 
    loadFromSlot, 
    loadSaveSlots, 
    saveSlots, 
    deleteSlot,
    setGameState,
  } = useGameStore()
  
  const [showNewGame, setShowNewGame] = useState(false)
  const [showLoadGame, setShowLoadGame] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showCoopSettings, setShowCoopSettings] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [hasSaves, setHasSaves] = useState(false)

  useEffect(() => {
    loadSaveSlots().then(() => {
      const slots = useGameStore.getState().saveSlots
      setHasSaves(slots.some(s => s !== null))
    })
  }, [loadSaveSlots])

  const handleNewGame = () => {
    if (!playerName.trim()) return
    
    const spawnCountry = getRandomSpawnCountry()
    const spawnPosition = getSpawnPosition(spawnCountry)
    
    initializePlayer(playerName.trim(), spawnPosition)
    setGameState('playing')
    onStartGame()
  }

  const handleLoadGame = async (slotNumber: number) => {
    const success = await loadFromSlot(slotNumber)
    if (success) {
      setShowLoadGame(false)
      onStartGame()
    }
  }

  const handleDeleteSlot = async (slotNumber: number) => {
    await deleteSlot(slotNumber)
    const slots = useGameStore.getState().saveSlots
    setHasSaves(slots.some(s => s !== null))
  }

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Logo and title */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl scale-150" />
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-full border-2 border-cyan-500/30">
              <Ship className="w-16 h-16 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 mb-2 font-sans tracking-tight">
            Arctic Fisher
          </h1>
          <p className="text-cyan-200/70 text-lg tracking-wide flex items-center gap-2">
            <Waves className="w-4 h-4" />
            Brave the frozen seas
            <Anchor className="w-4 h-4" />
          </p>
        </div>

        {/* Menu buttons */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button
            onClick={() => setShowNewGame(true)}
            className="w-full h-14 text-lg bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 border border-cyan-400/30 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-105 text-white"
          >
            <Play className="w-5 h-5 mr-2" />
            New Voyage
          </Button>
          
          <Button
            onClick={() => setShowLoadGame(true)}
            disabled={!hasSaves}
            variant="outline"
            className="w-full h-14 text-lg border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10 hover:border-cyan-400/50 disabled:opacity-50 transition-all duration-300 hover:scale-105 bg-slate-800/50"
          >
            <Save className="w-5 h-5 mr-2" />
            Continue Voyage
          </Button>
          
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            className="w-full h-14 text-lg border-slate-500/30 text-slate-300 hover:bg-slate-500/10 hover:border-slate-400/50 transition-all duration-300 hover:scale-105 bg-slate-800/50"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>

          <Button
            onClick={() => setShowCoopSettings(true)}
            variant="outline"
            className="w-full h-14 text-lg border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 bg-slate-800/50"
          >
            <Users className="w-5 h-5 mr-2" />
            Cooperative
          </Button>
        </div>

        {/* Version */}
        <p className="absolute bottom-4 text-slate-500 text-sm">v1.0.0</p>
      </div>

      {/* New Game Dialog */}
      <Dialog open={showNewGame} onOpenChange={setShowNewGame}>
        <DialogContent className="bg-slate-900 border-cyan-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-400">New Voyage</DialogTitle>
            <DialogDescription className="text-slate-400">
              Enter your captain name to begin your arctic fishing adventure
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Captain Name</label>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500"
                maxLength={20}
                onKeyDown={(e) => e.key === 'Enter' && handleNewGame()}
              />
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400 mb-2">You will spawn in a random arctic region</p>
              <p className="text-xs text-slate-500">Visit an Inn to get jobs and earn gold. Use the marketplace to buy your first boat and fishing equipment.</p>
            </div>
            <Button
              onClick={handleNewGame}
              disabled={!playerName.trim()}
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
            >
              <Anchor className="w-4 h-4 mr-2" />
              Set Sail
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Load Game Dialog */}
      <Dialog open={showLoadGame} onOpenChange={setShowLoadGame}>
        <DialogContent className="bg-slate-900 border-cyan-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-400">Load Voyage</DialogTitle>
            <DialogDescription className="text-slate-400">
              Select a save slot to continue your adventure
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4 max-h-96 overflow-y-auto">
            {saveSlots.map((save, index) => (
              <Card 
                key={index}
                className={`bg-slate-800/50 border-slate-700 ${save ? 'hover:border-cyan-500/50 cursor-pointer' : 'opacity-50'} transition-all`}
              >
                <CardContent className="p-4">
                  {save ? (
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => handleLoadGame(save.slotNumber)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-cyan-400 font-semibold">{save.name}</span>
                          <span className="text-xs text-slate-500">Slot {save.slotNumber}</span>
                        </div>
                        <div className="text-sm text-slate-400">
                          {save.player.name} - Level {save.player.level}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {format(save.timestamp, 'MMM d, yyyy HH:mm')} - {formatPlayTime(save.playTime)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSlot(save.slotNumber)
                        }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 py-2">
                      Slot {index + 1} - Empty
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-slate-900 border-cyan-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-400">Settings</DialogTitle>
          </DialogHeader>
          <SettingsMenu inGame={false} />
        </DialogContent>
      </Dialog>

      {/* Cooperative Dialog */}
      <Dialog open={showCoopSettings} onOpenChange={setShowCoopSettings}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-purple-400 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Cooperative Mode
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure cooperative play, clans, and database connection
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Overview */}
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h3 className="text-purple-400 font-semibold mb-2">What is Cooperative Mode?</h3>
              <p className="text-slate-400 text-sm">
                Play with friends in the same arctic world! Fish together, share resources, 
                battle sea monsters as a crew, and explore the frozen seas as a team.
              </p>
            </div>

            {/* How to Start */}
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-semibold mb-2">How to Start</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <p>1. Start a New Voyage and enter the game</p>
                <p>2. Press Escape to open the Pause Menu</p>
                <p>3. Select "Co-op Settings" to configure</p>
                <p>4. Choose "Host Game" or "Join Game"</p>
                <p>5. Share session code with friends to play together</p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold mb-2">Features</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div className="bg-slate-700/50 rounded p-2">
                  <p className="text-white font-medium mb-1">👥 Shared World</p>
                  <p>See other players in real-time</p>
                </div>
                <div className="bg-slate-700/50 rounded p-2">
                  <p className="text-white font-medium mb-1">🎣 Team Fishing</p>
                  <p>Catch fish together, share loot</p>
                </div>
                <div className="bg-slate-700/50 rounded p-2">
                  <p className="text-white font-medium mb-1">⚔️ Co-op Combat</p>
                  <p>Fight pirates as a crew</p>
                </div>
                <div className="bg-slate-700/50 rounded p-2">
                  <p className="text-white font-medium mb-1">🤝 Trading</p>
                  <p>Trade items between players</p>
                </div>
                <div className="bg-slate-700/50 rounded p-2">
                  <p className="text-white font-medium mb-1">🗺️ Shared Maps</p>
                  <p>Discover treasures together</p>
                </div>
                <div className="bg-slate-700/50 rounded p-2">
                  <p className="text-white font-medium mb-1">📊 Shared XP</p>
                  <p>Level up as a team</p>
                </div>
              </div>
            </div>

            {/* Clan Creation */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Clan & Alliance System
              </h3>
              <div className="space-y-3 text-sm text-slate-400">
                <p>Form clans with other players to unlock shared bonuses and compete together:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-white">Create a Clan</strong> - Form your own crew (cost: 500 gold)</li>
                  <li><strong className="text-white">Clan Levels</strong> - Earn XP together, unlock clan-wide bonuses</li>
                  <li><strong className="text-white">Gold Bank</strong> - Contribute gold for clan upgrades</li>
                  <li><strong className="text-white">Leaderboards</strong> - Compete for the top fishing clan</li>
                  <li><strong className="text-white">Alliances</strong> - Form alliances with other clans</li>
                  <li><strong className="text-white">Roles</strong> - Owner, Officers, and Members with different permissions</li>
                </ul>
              </div>
            </div>

            {/* Database Configuration */}
            <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Database Configuration for Online Play
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                To enable online cooperative play across devices, you need a remote database. 
                Below are free alternatives with setup guides.
              </p>

              <div className="space-y-4">
                {/* Supabase */}
                <div className="bg-slate-700/30 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-semibold">Supabase</span>
                    </div>
                    <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded">Recommended</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Free tier includes: 500MB database, 5GB bandwidth, 50,000 monthly active users</p>
                    <ol className="list-decimal pl-4 mt-2 space-y-1">
                      <li>Go to <a href="https://supabase.com" target="_blank" className="text-cyan-400 hover:underline">supabase.com</a> and sign up for free</li>
                      <li>Create a new project (choose a strong database password)</li>
                      <li>Go to Project Settings → API → Project URL and anon/public key</li>
                      <li>Copy the Project URL and anon key</li>
                      <li>Create a table called <code className="text-cyan-300">saves</code> with columns: id (int8, PK), slotNumber (int8), name (text), player (jsonb), timestamp (int8), playTime (int8)</li>
                      <li>Under Authentication → Settings, disable Row Level Security for testing or create proper RLS policies</li>
                      <li>Enable Realtime if you want live cooperative updates</li>
                    </ol>
                    <div className="mt-2 bg-slate-800/50 rounded p-2">
                      <p className="text-cyan-300 text-xs font-mono">
                        Connection string template:<br/>
                        SUPABASE_URL=https://your-project.supabase.co<br/>
                        SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Appwrite */}
                <div className="bg-slate-700/30 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-pink-400" />
                    <span className="text-pink-400 font-semibold">Appwrite</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Free tier: 50,000 documents, 5GB storage, 100K monthly active users</p>
                    <ol className="list-decimal pl-4 mt-2 space-y-1">
                      <li>Go to <a href="https://appwrite.io" target="_blank" className="text-cyan-400 hover:underline">appwrite.io</a> and create a free account</li>
                      <li>Create a new project</li>
                      <li>Set up a database, create a collection called <code className="text-cyan-300">saves</code></li>
                      <li>Add attributes: slotNumber (integer), name (string), playerData (string/json), timestamp (integer), playTime (integer)</li>
                      <li>Get your Project ID and API endpoint from Settings</li>
                    </ol>
                  </div>
                </div>

                {/* Firebase */}
                <div className="bg-slate-700/30 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Firebase</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Free Spark plan: 1GB Firestore, 10GB download, 10K writes/day</p>
                    <ol className="list-decimal pl-4 mt-2 space-y-1">
                      <li>Go to <a href="https://firebase.google.com" target="_blank" className="text-cyan-400 hover:underline">firebase.google.com</a> and create a free account</li>
                      <li>Create a Firebase project</li>
                      <li>Enable Firestore Database (start in test mode)</li>
                      <li>Register a web app to get your config (apiKey, authDomain, projectId, etc.)</li>
                      <li>Create a collection called <code className="text-cyan-300">saves</code> with document fields matching the player data format</li>
                    </ol>
                  </div>
                </div>

                {/* Nhost */}
                <div className="bg-slate-700/30 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-semibold">Nhost</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Free tier: 2GB database, 10GB file storage, unlimited users</p>
                    <ol className="list-decimal pl-4 mt-2 space-y-1">
                      <li>Go to <a href="https://nhost.io" target="_blank" className="text-cyan-400 hover:underline">nhost.io</a> and sign up for free</li>
                      <li>Create a new project</li>
                      <li>Get your GraphQL endpoint and admin secret from Settings</li>
                      <li>Use the Hasura console to create the <code className="text-cyan-300">saves</code> table</li>
                    </ol>
                  </div>
                </div>

                {/* Quick tip */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3 text-xs text-yellow-300">
                  <p className="font-semibold mb-1">How to Configure:</p>
                  <p>Create a <code className="text-cyan-300">.env.local</code> file in the project root with your database credentials. The game will auto-detect the provider from the environment variables. All connections are handled through the database adapter layer.</p>
                  <pre className="mt-2 bg-slate-900/50 p-2 rounded text-cyan-300 text-xs">{`# .env.local example for Supabase
NEXT_PUBLIC_DB_PROVIDER=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# For local development, no changes needed (uses IndexedDB)`}</pre>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold mb-2">Quick Start</h3>
              <p className="text-slate-400 text-sm">
                Cooperative settings can be fully configured in-game from the Pause Menu. 
                Start a game, then invite friends!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
