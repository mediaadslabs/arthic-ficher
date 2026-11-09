'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/game/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Play, Save, FolderOpen, Settings, LogOut, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { SettingsMenu } from './settings-menu'

interface PauseMenuProps {
  onResume: () => void
  onMainMenu: () => void
}

export function PauseMenu({ onResume, onMainMenu }: PauseMenuProps) {
  const { 
    player,
    saveSlots, 
    loadSaveSlots, 
    saveToSlot, 
    loadFromSlot,
    deleteSlot,
    setGameState,
  } = useGameStore()
  
  const [showSave, setShowSave] = useState(false)
  const [showLoad, setShowLoad] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)

  const handleOpenSave = async () => {
    await loadSaveSlots()
    setShowSave(true)
  }

  const handleOpenLoad = async () => {
    await loadSaveSlots()
    setShowLoad(true)
  }

  const handleSave = async () => {
    if (selectedSlot === null) return
    
    const name = saveName.trim() || `Save ${selectedSlot}`
    await saveToSlot(selectedSlot, name)
    setShowSave(false)
    setSaveName('')
    setSelectedSlot(null)
  }

  const handleLoad = async (slotNumber: number) => {
    const success = await loadFromSlot(slotNumber)
    if (success) {
      setShowLoad(false)
      onResume()
    }
  }

  const handleDeleteSlot = async (slotNumber: number) => {
    await deleteSlot(slotNumber)
  }

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-cyan-500/30 rounded-xl p-8 shadow-2xl shadow-cyan-500/10 max-w-sm w-full mx-4">
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-2">Paused</h2>
        {player && (
          <p className="text-center text-slate-400 mb-6 text-sm">
            {player.name} - Level {player.level}
          </p>
        )}
        
        <div className="space-y-3">
          <Button
            onClick={onResume}
            className="w-full h-12 text-lg bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
          >
            <Play className="w-5 h-5 mr-2" />
            Resume
          </Button>
          
          <Button
            onClick={handleOpenSave}
            variant="outline"
            className="w-full h-12 border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10 bg-slate-800/50"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Game
          </Button>
          
          <Button
            onClick={handleOpenLoad}
            variant="outline"
            className="w-full h-12 border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10 bg-slate-800/50"
          >
            <FolderOpen className="w-5 h-5 mr-2" />
            Load Game
          </Button>
          
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            className="w-full h-12 border-slate-500/30 text-slate-300 hover:bg-slate-500/10 bg-slate-800/50"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>
          
          <div className="pt-2">
            <Button
              onClick={onMainMenu}
              variant="ghost"
              className="w-full h-12 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Main Menu
            </Button>
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      <Dialog open={showSave} onOpenChange={setShowSave}>
        <DialogContent className="bg-slate-900 border-cyan-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-400">Save Game</DialogTitle>
            <DialogDescription className="text-slate-400">
              Select a slot to save your progress
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4 max-h-80 overflow-y-auto">
            {[1, 2, 3, 4, 5].map((slotNumber) => {
              const save = saveSlots[slotNumber - 1]
              const isSelected = selectedSlot === slotNumber
              
              return (
                <Card 
                  key={slotNumber}
                  onClick={() => setSelectedSlot(slotNumber)}
                  className={`bg-slate-800/50 border-2 cursor-pointer transition-all ${
                    isSelected ? 'border-cyan-500' : 'border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <CardContent className="p-4">
                    {save ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-cyan-400 font-semibold">{save.name}</span>
                            <span className="text-xs text-slate-500">Slot {slotNumber}</span>
                          </div>
                          <div className="text-sm text-slate-400">
                            {save.player.name} - Level {save.player.level}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {format(save.timestamp, 'MMM d, yyyy HH:mm')}
                          </div>
                        </div>
                        <span className="text-xs text-yellow-400">Overwrite</span>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500 py-2">
                        Slot {slotNumber} - Empty
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          {selectedSlot !== null && (
            <div className="space-y-3 pt-4 border-t border-slate-700">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Save Name (Optional)</label>
                <Input
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder={`Save ${selectedSlot}`}
                  className="bg-slate-800 border-slate-600 text-white"
                  maxLength={30}
                />
              </div>
              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save to Slot {selectedSlot}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Load Dialog */}
      <Dialog open={showLoad} onOpenChange={setShowLoad}>
        <DialogContent className="bg-slate-900 border-cyan-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-400">Load Game</DialogTitle>
            <DialogDescription className="text-slate-400">
              Warning: Unsaved progress will be lost
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
                        onClick={() => handleLoad(save.slotNumber)}
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
        <DialogContent className="bg-slate-900 border-cyan-500/30 text-white max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-400">Settings</DialogTitle>
          </DialogHeader>
          <SettingsMenu inGame={true} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
