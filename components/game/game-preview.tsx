'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Ship, 
  Anchor, 
  Waves, 
  Fish, 
  Store, 
  Building2, 
  Gamepad2, 
  Compass,
  ArrowUp,
  ChevronRight,
  Monitor,
  Keyboard,
  Trophy,
  Coins,
  Terminal,
  FolderOpen,
  Package,
  Play,
  Rocket,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react'

export function GamePreview() {
  const [activeTab, setActiveTab] = useState<'features' | 'controls' | 'gameplay' | 'setup'>('features')
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCommand(id)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-900 overflow-auto">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl scale-150" />
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-full border-2 border-cyan-500/30">
              <Ship className="w-16 h-16 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 mb-3">
            Arctic Fisher
          </h1>
          <p className="text-cyan-200/70 text-lg flex items-center justify-center gap-2">
            <Waves className="w-4 h-4" />
            3D Arctic Fishing Adventure
            <Anchor className="w-4 h-4" />
          </p>
        </div>

        {/* WebGL Notice */}
        <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500/20 p-3 rounded-lg">
                <Monitor className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-400 mb-1">WebGL Required</h3>
                <p className="text-slate-300 text-sm mb-3">
                  This game requires WebGL for 3D graphics rendering. To play, deploy to Vercel or run locally with a WebGL-enabled browser.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-slate-500 text-slate-300">
                    Chrome
                  </Badge>
                  <Badge variant="outline" className="border-slate-500 text-slate-300">
                    Firefox
                  </Badge>
                  <Badge variant="outline" className="border-slate-500 text-slate-300">
                    Edge
                  </Badge>
                  <Badge variant="outline" className="border-slate-500 text-slate-300">
                    Safari
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-slate-800/50 p-1 rounded-lg w-fit mx-auto">
          {(['features', 'controls', 'gameplay', 'setup'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab 
                ? 'bg-cyan-600 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="grid md:grid-cols-2 gap-4">
            <FeatureCard
              icon={<Compass className="w-6 h-6" />}
              title="Open World Exploration"
              description="Explore 8 unique arctic regions including Norway, Alaska, Greenland, Iceland, and more. Navigate icy waters and discover hidden fishing spots."
              color="cyan"
            />
            <FeatureCard
              icon={<Ship className="w-6 h-6" />}
              title="4 Boat Tiers"
              description="Progress from a simple Dinghy to a massive Arctic Vessel. Each tier unlocks new fishing capabilities and greater storage."
              color="teal"
            />
            <FeatureCard
              icon={<Fish className="w-6 h-6" />}
              title="Diverse Fishing"
              description="Catch King Crabs, Atlantic Cod, Arctic Char, Salmon, and more using rods, crab traps, nets, and trawling equipment."
              color="blue"
            />
            <FeatureCard
              icon={<Building2 className="w-6 h-6" />}
              title="Inns & Jobs"
              description="Visit Inns across the world to accept fishing contracts. Complete jobs to earn gold and bonus XP rewards."
              color="purple"
            />
            <FeatureCard
              icon={<Store className="w-6 h-6" />}
              title="Marketplace"
              description="Buy new boats, fishing equipment, and upgrades. Sell your catch at different marketplaces for varying prices."
              color="green"
            />
            <FeatureCard
              icon={<Trophy className="w-6 h-6" />}
              title="Progression System"
              description="Gain XP from fishing and completing jobs. Level up to unlock better equipment and boat upgrades."
              color="amber"
            />
          </div>
        )}

        {/* Controls Tab */}
        {activeTab === 'controls' && (
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Keyboard className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-semibold text-white">Keyboard Controls</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <ControlItem keys={['W', 'ArrowUp']} action="Move Forward" />
                  <ControlItem keys={['S', 'ArrowDown']} action="Move Backward" />
                  <ControlItem keys={['A', 'ArrowLeft']} action="Turn Left" />
                  <ControlItem keys={['D', 'ArrowRight']} action="Turn Right" />
                  <ControlItem keys={['E', 'Enter']} action="Interact" />
                  <ControlItem keys={['Escape']} action="Pause Menu" />
                  <ControlItem keys={['F']} action="Start/Stop Fishing" />
                  <ControlItem keys={['Space']} action="Catch / Reel In" />
                  <ControlItem keys={['1', '2', '3', '4']} action="Select Equipment" />
                  <ControlItem keys={['F5']} action="Quick Save" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Gamepad2 className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-semibold text-white">Gameplay Tips</h3>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                    <span>Visit an <strong className="text-cyan-400">Inn</strong> first to get fishing jobs and earn starter gold</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                    <span>Buy your first <strong className="text-cyan-400">boat</strong> and <strong className="text-cyan-400">fishing rod</strong> from the Marketplace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                    <span>Look for <strong className="text-cyan-400">fishing zones</strong> indicated by fish markers on the water</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                    <span>Different fish appear in different regions - explore the arctic!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                    <span>Upgrade your boat to carry more fish and access deeper waters</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gameplay Tab */}
        {activeTab === 'gameplay' && (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <ArrowUp className="w-5 h-5 text-cyan-400" />
                  Progression Path
                </h3>
                <div className="space-y-4">
                  <ProgressionStep
                    step={1}
                    title="Spawn in Arctic Region"
                    description="Start your journey in a random arctic country. You begin with no boat and minimal gold."
                  />
                  <ProgressionStep
                    step={2}
                    title="Visit the Inn"
                    description="Find the nearest Inn to accept your first fishing contracts. Jobs provide guaranteed gold and XP."
                  />
                  <ProgressionStep
                    step={3}
                    title="Buy Your First Boat"
                    description="Head to the Marketplace and purchase a Dinghy to start fishing. Don't forget a fishing rod!"
                  />
                  <ProgressionStep
                    step={4}
                    title="Start Fishing"
                    description="Navigate to fishing zones and use your equipment to catch fish and crabs."
                  />
                  <ProgressionStep
                    step={5}
                    title="Sell & Upgrade"
                    description="Sell your catch at marketplaces. Save up for boat upgrades and better equipment."
                  />
                  <ProgressionStep
                    step={6}
                    title="Become a Legend"
                    description="Work your way up to the Arctic Vessel, complete legendary contracts, and master the frozen seas."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Ship className="w-5 h-5 text-cyan-400" />
                    Boat Tiers
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                      <span className="text-slate-300">Dinghy</span>
                      <span className="text-amber-400 flex items-center gap-1"><Coins className="w-3 h-3" /> 500</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                      <span className="text-slate-300">Trawler</span>
                      <span className="text-amber-400 flex items-center gap-1"><Coins className="w-3 h-3" /> 5,000</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                      <span className="text-slate-300">Cutter</span>
                      <span className="text-amber-400 flex items-center gap-1"><Coins className="w-3 h-3" /> 25,000</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                      <span className="text-slate-300">Arctic Vessel</span>
                      <span className="text-amber-400 flex items-center gap-1"><Coins className="w-3 h-3" /> 100,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Fish className="w-5 h-5 text-cyan-400" />
                    Valuable Catches
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                      <span className="text-slate-300">King Crab</span>
                      <span className="text-amber-400 flex items-center gap-1"><Coins className="w-3 h-3" /> 150</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                      <span className="text-slate-300">Atlantic Halibut</span>
                      <span className="text-amber-400 flex items-center gap-1"><Coins className="w-3 h-3" /> 80</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                      <span className="text-slate-300">Arctic Char</span>
                      <span className="text-amber-400 flex items-center gap-1"><Coins className="w-3 h-3" /> 45</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                      <span className="text-slate-300">Atlantic Cod</span>
                      <span className="text-amber-400 flex items-center gap-1"><Coins className="w-3 h-3" /> 25</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Setup Tab */}
        {activeTab === 'setup' && (
          <div className="space-y-6">
            {/* Prerequisites */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Prerequisites
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Node.js</h4>
                    <p className="text-slate-400 text-sm mb-2">Version 18.17 or later required</p>
                    <a 
                      href="https://nodejs.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 text-sm hover:underline"
                    >
                      Download Node.js
                    </a>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Package Manager</h4>
                    <p className="text-slate-400 text-sm mb-2">npm (included with Node.js), pnpm, or yarn</p>
                    <span className="text-slate-500 text-sm">npm comes pre-installed</span>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">WebGL Browser</h4>
                    <p className="text-slate-400 text-sm mb-2">Chrome, Firefox, Edge, or Safari</p>
                    <span className="text-slate-500 text-sm">Hardware acceleration enabled</span>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Code Editor</h4>
                    <p className="text-slate-400 text-sm mb-2">VS Code recommended</p>
                    <a 
                      href="https://code.visualstudio.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 text-sm hover:underline"
                    >
                      Download VS Code
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Installation Steps */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  Installation Steps
                </h3>
                <div className="space-y-6">
                  {/* Step 1 */}
                  <SetupStep
                    step={1}
                    title="Download the Project"
                    description="Download the project ZIP from v0 or clone from GitHub"
                    icon={<FolderOpen className="w-5 h-5" />}
                  >
                    <p className="text-slate-400 text-sm mb-3">
                      Click the three dots menu in the top right of the v0 interface and select{' '}
                      <strong className="text-white">{'"Download ZIP"'}</strong>, or use the shadcn CLI:
                    </p>
                    <CodeBlock 
                      code="npx shadcn@latest add https://v0.dev/chat/your-project-id"
                      id="download"
                      onCopy={copyToClipboard}
                      copied={copiedCommand === 'download'}
                    />
                  </SetupStep>

                  {/* Step 2 */}
                  <SetupStep
                    step={2}
                    title="Navigate to Project Directory"
                    description="Open terminal and change to the project folder"
                    icon={<Terminal className="w-5 h-5" />}
                  >
                    <CodeBlock 
                      code="cd arctic-fisher"
                      id="cd"
                      onCopy={copyToClipboard}
                      copied={copiedCommand === 'cd'}
                    />
                  </SetupStep>

                  {/* Step 3 */}
                  <SetupStep
                    step={3}
                    title="Install Dependencies"
                    description="Install all required npm packages"
                    icon={<Package className="w-5 h-5" />}
                  >
                    <div className="space-y-2">
                      <CodeBlock 
                        code="npm install"
                        id="npm-install"
                        onCopy={copyToClipboard}
                        copied={copiedCommand === 'npm-install'}
                        label="Using npm"
                      />
                      <p className="text-slate-500 text-sm text-center">or alternatively:</p>
                      <CodeBlock 
                        code="pnpm install"
                        id="pnpm-install"
                        onCopy={copyToClipboard}
                        copied={copiedCommand === 'pnpm-install'}
                        label="Using pnpm"
                      />
                      <CodeBlock 
                        code="yarn install"
                        id="yarn-install"
                        onCopy={copyToClipboard}
                        copied={copiedCommand === 'yarn-install'}
                        label="Using yarn"
                      />
                    </div>
                  </SetupStep>

                  {/* Step 4 */}
                  <SetupStep
                    step={4}
                    title="Start Development Server"
                    description="Run the game in development mode"
                    icon={<Play className="w-5 h-5" />}
                  >
                    <CodeBlock 
                      code="npm run dev"
                      id="dev"
                      onCopy={copyToClipboard}
                      copied={copiedCommand === 'dev'}
                    />
                    <p className="text-slate-400 text-sm mt-3">
                      Open <code className="bg-slate-700 px-2 py-1 rounded text-cyan-400">http://localhost:3000</code> in your browser
                    </p>
                  </SetupStep>

                  {/* Step 5 */}
                  <SetupStep
                    step={5}
                    title="Build for Production"
                    description="Create an optimized production build"
                    icon={<Rocket className="w-5 h-5" />}
                  >
                    <div className="space-y-2">
                      <CodeBlock 
                        code="npm run build"
                        id="build"
                        onCopy={copyToClipboard}
                        copied={copiedCommand === 'build'}
                        label="Build"
                      />
                      <CodeBlock 
                        code="npm run start"
                        id="start"
                        onCopy={copyToClipboard}
                        copied={copiedCommand === 'start'}
                        label="Start production server"
                      />
                    </div>
                  </SetupStep>
                </div>
              </CardContent>
            </Card>

            {/* Project Structure */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-cyan-400" />
                  Project Structure
                </h3>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-slate-300">
{`arctic-fisher/
├── app/
│   ├── layout.tsx          # Root layout with fonts & metadata
│   ├── page.tsx             # Main game page
│   └── globals.css          # Global styles & theme
├── components/
│   └── game/
│       ├── arctic-fisher.tsx    # Main game component
│       ├── game-scene.tsx       # 3D canvas & scene
│       ├── game-preview.tsx     # This preview page
│       ├── menus/
│       │   ├── start-menu.tsx   # Start/load game menu
│       │   ├── pause-menu.tsx   # In-game pause menu
│       │   └── settings-menu.tsx
│       ├── ui/
│       │   ├── game-hud.tsx     # Heads-up display
│       │   ├── inn-menu.tsx     # Inn job interface
│       │   ├── marketplace-menu.tsx
│       │   └── fishing-ui.tsx
│       ├── world/
│       │   ├── game-world.tsx   # World container
│       │   ├── ocean.tsx        # Animated ocean
│       │   ├── land-mass.tsx    # Arctic landmasses
│       │   └── location-marker.tsx
│       └── entities/
│           ├── boat.tsx         # Boat 3D models
│           └── player-controller.tsx
├── lib/
│   └── game/
│       ├── types.ts         # TypeScript interfaces
│       ├── store.ts         # Zustand game state
│       ├── database.ts      # Dexie IndexedDB
│       └── world-data.ts    # Regions & locations
└── package.json`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* NPM Scripts */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  Available NPM Scripts
                </h3>
                <div className="space-y-3">
                  <ScriptItem 
                    command="npm run dev" 
                    description="Start development server with hot reload on localhost:3000" 
                  />
                  <ScriptItem 
                    command="npm run build" 
                    description="Create optimized production build in .next folder" 
                  />
                  <ScriptItem 
                    command="npm run start" 
                    description="Start production server (requires build first)" 
                  />
                  <ScriptItem 
                    command="npm run lint" 
                    description="Run ESLint to check for code issues" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-400" />
                  Technology Stack
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <TechItem name="Next.js 16" description="React framework with App Router" />
                  <TechItem name="React 19" description="UI component library" />
                  <TechItem name="React Three Fiber" description="React renderer for Three.js" />
                  <TechItem name="Three.js" description="3D graphics library" />
                  <TechItem name="@react-three/drei" description="Useful R3F helpers" />
                  <TechItem name="Zustand" description="Lightweight state management" />
                  <TechItem name="Dexie.js" description="IndexedDB wrapper for saves" />
                  <TechItem name="Tailwind CSS 4" description="Utility-first CSS framework" />
                  <TechItem name="shadcn/ui" description="Accessible UI components" />
                  <TechItem name="TypeScript" description="Type-safe JavaScript" />
                </div>
              </CardContent>
            </Card>

            {/* Troubleshooting */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-amber-400" />
                  Troubleshooting
                </h3>
                <div className="space-y-4">
                  <TroubleshootItem
                    issue="WebGL context could not be created"
                    solutions={[
                      "Enable hardware acceleration in browser settings",
                      "Update your graphics drivers",
                      "Try a different browser (Chrome recommended)",
                      "Check if WebGL is enabled: visit webglreport.com"
                    ]}
                  />
                  <TroubleshootItem
                    issue="Module not found errors"
                    solutions={[
                      "Delete node_modules and package-lock.json",
                      "Run npm install again",
                      "Ensure Node.js version is 18.17+"
                    ]}
                  />
                  <TroubleshootItem
                    issue="Game runs slowly / low FPS"
                    solutions={[
                      "Lower graphics quality in game settings",
                      "Close other browser tabs",
                      "Disable browser extensions",
                      "Use a dedicated GPU if available"
                    ]}
                  />
                  <TroubleshootItem
                    issue="Save data not persisting"
                    solutions={[
                      "Ensure IndexedDB is not blocked",
                      "Check browser privacy/incognito mode",
                      "Clear browser storage and restart"
                    ]}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Deploy */}
            <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-cyan-400" />
                  Deploy to Vercel
                </h3>
                <p className="text-slate-300 mb-4">
                  The easiest way to deploy Arctic Fisher is using Vercel, the platform built by the creators of Next.js.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</div>
                    <p className="text-slate-400">Push your code to GitHub, GitLab, or Bitbucket</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</div>
                    <p className="text-slate-400">Go to <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">vercel.com/new</a> and import your repository</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">3</div>
                    <p className="text-slate-400">Click Deploy - Vercel will auto-detect Next.js settings</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-500 text-sm">
                    Or deploy directly from v0 by clicking the <strong className="text-white">Publish</strong> button in the top right corner.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>Built with Next.js, React Three Fiber, and Zustand</p>
          <p className="mt-1">Deploy to Vercel or run locally to experience the full 3D game</p>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  color: 'cyan' | 'teal' | 'blue' | 'purple' | 'green' | 'amber'
}) {
  const colorClasses = {
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    teal: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
      <CardContent className="p-5">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[color]}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}

function ControlItem({ keys, action }: { keys: string[]; action: string }) {
  return (
    <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <span key={i}>
            <kbd className="px-2 py-1 bg-slate-600 rounded text-xs text-white font-mono">
              {key === 'ArrowUp' ? '↑' : key === 'ArrowDown' ? '↓' : key === 'ArrowLeft' ? '��' : key === 'ArrowRight' ? '→' : key}
            </kbd>
            {i < keys.length - 1 && <span className="text-slate-500 mx-1">/</span>}
          </span>
        ))}
      </div>
      <span className="text-slate-300 text-sm">{action}</span>
    </div>
  )
}

function ProgressionStep({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-sm">
          {step}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </div>
  )
}

function SetupStep({ 
  step, 
  title, 
  description, 
  icon, 
  children 
}: { 
  step: number
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="border-l-2 border-cyan-600/30 pl-6 pb-2 relative">
      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold">
        {step}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-cyan-400">{icon}</span>
        <h4 className="font-semibold text-white">{title}</h4>
      </div>
      <p className="text-slate-500 text-sm mb-3">{description}</p>
      {children}
    </div>
  )
}

function CodeBlock({ 
  code, 
  id, 
  onCopy, 
  copied, 
  label 
}: { 
  code: string
  id: string
  onCopy: (code: string, id: string) => void
  copied: boolean
  label?: string
}) {
  return (
    <div>
      {label && <span className="text-slate-500 text-xs mb-1 block">{label}</span>}
      <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-3 group">
        <code className="flex-1 text-cyan-400 font-mono text-sm">{code}</code>
        <button
          onClick={() => onCopy(code, id)}
          className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>
    </div>
  )
}

function ScriptItem({ command, description }: { command: string; description: string }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg">
      <code className="bg-slate-900 px-3 py-1.5 rounded text-cyan-400 font-mono text-sm whitespace-nowrap">
        {command}
      </code>
      <span className="text-slate-400 text-sm">{description}</span>
    </div>
  )
}

function TechItem({ name, description }: { name: string; description: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
      <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
      <div>
        <span className="text-white font-medium">{name}</span>
        <span className="text-slate-500 text-sm ml-2">{description}</span>
      </div>
    </div>
  )
}

function TroubleshootItem({ issue, solutions }: { issue: string; solutions: string[] }) {
  return (
    <div className="p-4 bg-slate-700/30 rounded-lg">
      <h4 className="font-semibold text-amber-400 mb-2">{issue}</h4>
      <ul className="space-y-1">
        {solutions.map((solution, i) => (
          <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            {solution}
          </li>
        ))}
      </ul>
    </div>
  )
}
