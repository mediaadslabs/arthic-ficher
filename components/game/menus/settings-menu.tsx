'use client'

import { useGameStore } from '@/lib/game/store'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Volume2, Music, Gamepad2, Monitor, HelpCircle, Users, Swords, Gift, Eye, Star, Coins } from 'lucide-react'

interface SettingsMenuProps {
  inGame?: boolean
}

export function SettingsMenu({ inGame = false }: SettingsMenuProps) {
  const { player, updateSettings } = useGameStore()
  
  // Use default settings if no player (menu screen)
  const settings = player?.settings ?? {
    masterVolume: 0.8,
    musicVolume: 0.6,
    sfxVolume: 0.8,
    graphicsQuality: 'high' as const,
    showTutorials: true,
    controlScheme: 'wasd' as const,
    cooperative: { enabled: false, maxPlayers: 4, sharedLoot: false, sharedXP: true, sharedGold: false, pvpEnabled: false, friendlyFire: false, tradeBetweenPlayers: true, showOtherPlayers: true, clanEnabled: false, clanTag: '', allianceEnabled: false, sharedWeather: false, voiceChat: false, minimapSharing: true },
    showFPS: false,
    autoSaveInterval: 300,
    language: 'en',
  }

  const handleVolumeChange = (key: 'masterVolume' | 'musicVolume' | 'sfxVolume', value: number[]) => {
    if (inGame && player) {
      updateSettings({ [key]: value[0] })
    }
  }

  const handleQualityChange = (value: 'low' | 'medium' | 'high') => {
    if (inGame && player) {
      updateSettings({ graphicsQuality: value })
    }
  }

  const handleControlChange = (value: 'wasd' | 'arrows') => {
    if (inGame && player) {
      updateSettings({ controlScheme: value })
    }
  }

  const handleTutorialToggle = (checked: boolean) => {
    if (inGame && player) {
      updateSettings({ showTutorials: checked })
    }
  }

  return (
    <div className="space-y-6 py-4">
      {/* Audio Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          Audio
        </h3>
        
        <div className="space-y-4 bg-slate-800/30 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-slate-300">Master Volume</Label>
              <span className="text-sm text-slate-500">{Math.round(settings.masterVolume * 100)}%</span>
            </div>
            <Slider
              value={[settings.masterVolume]}
              onValueChange={(v) => handleVolumeChange('masterVolume', v)}
              max={1}
              step={0.01}
              className="[&_[role=slider]]:bg-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-slate-300 flex items-center gap-2">
                <Music className="w-3 h-3" />
                Music Volume
              </Label>
              <span className="text-sm text-slate-500">{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <Slider
              value={[settings.musicVolume]}
              onValueChange={(v) => handleVolumeChange('musicVolume', v)}
              max={1}
              step={0.01}
              className="[&_[role=slider]]:bg-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-slate-300">Sound Effects</Label>
              <span className="text-sm text-slate-500">{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <Slider
              value={[settings.sfxVolume]}
              onValueChange={(v) => handleVolumeChange('sfxVolume', v)}
              max={1}
              step={0.01}
              className="[&_[role=slider]]:bg-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Graphics Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          Graphics
        </h3>
        
        <div className="space-y-4 bg-slate-800/30 p-4 rounded-lg">
          <div className="space-y-2">
            <Label className="text-slate-300">Quality</Label>
            <Select value={settings.graphicsQuality} onValueChange={handleQualityChange}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="low" className="text-white hover:bg-slate-700">Low</SelectItem>
                <SelectItem value="medium" className="text-white hover:bg-slate-700">Medium</SelectItem>
                <SelectItem value="high" className="text-white hover:bg-slate-700">High</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              {settings.graphicsQuality === 'low' && 'Best performance, reduced visual quality'}
              {settings.graphicsQuality === 'medium' && 'Balanced performance and visuals'}
              {settings.graphicsQuality === 'high' && 'Best visuals, may affect performance'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Gamepad2 className="w-4 h-4" />
          Controls
        </h3>
        
        <div className="space-y-4 bg-slate-800/30 p-4 rounded-lg">
          <div className="space-y-2">
            <Label className="text-slate-300">Movement Keys</Label>
            <Select value={settings.controlScheme} onValueChange={handleControlChange}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="wasd" className="text-white hover:bg-slate-700">WASD</SelectItem>
                <SelectItem value="arrows" className="text-white hover:bg-slate-700">Arrow Keys</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p>Movement: {settings.controlScheme === 'wasd' ? 'W/A/S/D' : 'Arrow Keys'}</p>
            <p>Interact: E or Enter</p>
            <p>Pause: Escape</p>
            <p>Quick Save: F5</p>
          </div>
        </div>
      </div>

      {/* Gameplay Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Gameplay
        </h3>
        
        <div className="space-y-4 bg-slate-800/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-300">Show Tutorials</Label>
              <p className="text-xs text-slate-500">Display helpful tips during gameplay</p>
            </div>
            <Switch
              checked={settings.showTutorials}
              onCheckedChange={handleTutorialToggle}
              className="data-[state=checked]:bg-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Cooperative Mode Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4" />
          Cooperative Mode
        </h3>
        
        <div className="space-y-4 bg-slate-800/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-300">Enable Cooperative</Label>
              <p className="text-xs text-slate-500">Play with friends in the same world</p>
            </div>
            <Switch
              checked={settings.cooperative?.enabled ?? false}
              onCheckedChange={(checked) => {
                if (inGame && player) {
                  updateSettings({
                    cooperative: { ...settings.cooperative, enabled: checked }
                  })
                }
              }}
              className="data-[state=checked]:bg-cyan-500"
              disabled={!inGame || !player}
            />
          </div>

          {settings.cooperative?.enabled && (
            <>
              <div className="space-y-2">
                <Label className="text-slate-300">Max Players</Label>
                <Select
                  value={String(settings.cooperative.maxPlayers)}
                  onValueChange={(v) => {
                    if (inGame && player) {
                      updateSettings({
                        cooperative: { ...settings.cooperative, maxPlayers: parseInt(v) }
                      })
                    }
                  }}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {[2, 3, 4, 6, 8].map(n => (
                      <SelectItem key={n} value={String(n)} className="text-white hover:bg-slate-700">
                        {n} Players
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Gift className="w-3 h-3" />
                    Shared Loot
                  </Label>
                  <p className="text-xs text-slate-500">All players share caught fish</p>
                </div>
                <Switch
                  checked={settings.cooperative.sharedLoot}
                  onCheckedChange={(checked) => {
                    if (inGame && player) {
                      updateSettings({
                        cooperative: { ...settings.cooperative, sharedLoot: checked }
                      })
                    }
                  }}
                  className="data-[state=checked]:bg-cyan-500"
                  disabled={!inGame || !player}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Star className="w-3 h-3" />
                    Shared XP
                  </Label>
                  <p className="text-xs text-slate-500">XP gained is shared with all players</p>
                </div>
                <Switch
                  checked={settings.cooperative.sharedXP}
                  onCheckedChange={(checked) => {
                    if (inGame && player) {
                      updateSettings({
                        cooperative: { ...settings.cooperative, sharedXP: checked }
                      })
                    }
                  }}
                  className="data-[state=checked]:bg-cyan-500"
                  disabled={!inGame || !player}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Coins className="w-3 h-3" />
                    Shared Gold
                  </Label>
                  <p className="text-xs text-slate-500">Gold earned is split among all players</p>
                </div>
                <Switch
                  checked={settings.cooperative.sharedGold}
                  onCheckedChange={(checked) => {
                    if (inGame && player) {
                      updateSettings({
                        cooperative: { ...settings.cooperative, sharedGold: checked }
                      })
                    }
                  }}
                  className="data-[state=checked]:bg-cyan-500"
                  disabled={!inGame || !player}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Swords className="w-3 h-3" />
                    PvP Enabled
                  </Label>
                  <p className="text-xs text-slate-500">Allow combat between players</p>
                </div>
                <Switch
                  checked={settings.cooperative.pvpEnabled}
                  onCheckedChange={(checked) => {
                    if (inGame && player) {
                      updateSettings({
                        cooperative: { ...settings.cooperative, pvpEnabled: checked }
                      })
                    }
                  }}
                  className="data-[state=checked]:bg-cyan-500"
                  disabled={!inGame || !player}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Swords className="w-3 h-3" />
                    Friendly Fire
                  </Label>
                  <p className="text-xs text-slate-500">Players can damage each other</p>
                </div>
                <Switch
                  checked={settings.cooperative.friendlyFire}
                  onCheckedChange={(checked) => {
                    if (inGame && player) {
                      updateSettings({
                        cooperative: { ...settings.cooperative, friendlyFire: checked }
                      })
                    }
                  }}
                  className="data-[state=checked]:bg-cyan-500"
                  disabled={!inGame || !player}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Gift className="w-3 h-3" />
                    Trade Between Players
                  </Label>
                  <p className="text-xs text-slate-500">Allow item trading between players</p>
                </div>
                <Switch
                  checked={settings.cooperative.tradeBetweenPlayers}
                  onCheckedChange={(checked) => {
                    if (inGame && player) {
                      updateSettings({
                        cooperative: { ...settings.cooperative, tradeBetweenPlayers: checked }
                      })
                    }
                  }}
                  className="data-[state=checked]:bg-cyan-500"
                  disabled={!inGame || !player}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Eye className="w-3 h-3" />
                    Show Other Players
                  </Label>
                  <p className="text-xs text-slate-500">Visualize other players in the world</p>
                </div>
                <Switch
                  checked={settings.cooperative.showOtherPlayers}
                  onCheckedChange={(checked) => {
                    if (inGame && player) {
                      updateSettings({
                        cooperative: { ...settings.cooperative, showOtherPlayers: checked }
                      })
                    }
                  }}
                  className="data-[state=checked]:bg-cyan-500"
                  disabled={!inGame || !player}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    Clan System
                  </Label>
                  <p className="text-xs text-slate-500">Enable player clans and alliances</p>
                </div>
                <Switch
                  checked={settings.cooperative.clanEnabled}
                  onCheckedChange={(checked) => {
                    if (inGame && player) {
                      updateSettings({
                        cooperative: { ...settings.cooperative, clanEnabled: checked }
                      })
                    }
                  }}
                  className="data-[state=checked]:bg-purple-500"
                  disabled={!inGame || !player}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    Clan Alliances
                  </Label>
                  <p className="text-xs text-slate-500">Allow alliances between clans</p>
                </div>
                <Switch
                  checked={settings.cooperative.allianceEnabled}
                  onCheckedChange={(checked) => {
                    if (inGame && player) {
                      updateSettings({
                        cooperative: { ...settings.cooperative, allianceEnabled: checked }
                      })
                    }
                  }}
                  className="data-[state=checked]:bg-purple-500"
                  disabled={!inGame || !player}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Eye className="w-3 h-3" />
                    Shared Weather
                  </Label>
                  <p className="text-xs text-slate-500">All players experience same weather</p>
                </div>
                <Switch
                  checked={settings.cooperative.sharedWeather}
                  onCheckedChange={(checked) => {
                    if (inGame && player) {
                      updateSettings({
                        cooperative: { ...settings.cooperative, sharedWeather: checked }
                      })
                    }
                  }}
                  className="data-[state=checked]:bg-cyan-500"
                  disabled={!inGame || !player}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Monitor className="w-3 h-3" />
                    Minimap Sharing
                  </Label>
                  <p className="text-xs text-slate-500">Show teammates on minimap</p>
                </div>
                <Switch
                  checked={settings.cooperative.minimapSharing}
                  onCheckedChange={(checked) => {
                    if (inGame && player) {
                      updateSettings({
                        cooperative: { ...settings.cooperative, minimapSharing: checked }
                      })
                    }
                  }}
                  className="data-[state=checked]:bg-cyan-500"
                  disabled={!inGame || !player}
                />
              </div>
            </>
          )}

          {!inGame && (
            <div className="bg-slate-700/30 rounded-lg p-3">
              <p className="text-slate-400 text-xs">
                <HelpCircle className="w-3 h-3 inline mr-1" />
                Cooperative settings can be configured during gameplay. Start a game first.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cooperative Instructions */}
      {settings.cooperative?.enabled && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            How to Play Co-op
          </h3>
          
          <div className="space-y-2 bg-slate-800/30 p-4 rounded-lg text-xs text-slate-400">
            <p><strong className="text-white">Hosting:</strong> Select "Host Game" from the pause menu to create a session. Share the session code with friends.</p>
            <p><strong className="text-white">Joining:</strong> Select "Join Game" and enter the session code from the host.</p>
            <p><strong className="text-white">Communication:</strong> Coordinate with your crew to fish in different zones for maximum efficiency.</p>
            <p><strong className="text-white">Trading:</strong> Meet other players at docks to trade items and tokens.</p>
            <p><strong className="text-white">Combat:</strong> Work together to take down sea monsters and pirates. Shared loot is split automatically.</p>
            <p className="text-yellow-400 mt-2">Tip: Assign roles! One player navigates while another fishes and a third watches for threats.</p>
          </div>
        </div>
      )}
    </div>
  )
}
