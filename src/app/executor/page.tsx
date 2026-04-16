'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Terminal, 
  Play, 
  Square, 
  Trash2, 
  Copy, 
  Upload, 
  Zap,
  Shield,
  Minimize2,
  Maximize2,
  Code,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface LogEntry {
  id: number
  timestamp: string
  type: 'system' | 'info' | 'success' | 'warn' | 'error' | 'code'
  message: string
}

export default function ExecutorPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [selectedProcess, setSelectedProcess] = useState<string>('')
  const [isInjected, setIsInjected] = useState(false)
  const [isInjecting, setIsInjecting] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isEditorMinimized, setIsEditorMinimized] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const processes = [
    { id: 'roblox', name: 'Roblox Player Beta' },
    { id: 'robloxbeta', name: 'Roblox Studio' },
    { id: 'robloxplayer', name: 'Roblox Player' },
  ]

  const quickScripts = [
    { name: 'Dark Dex', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Babyhamsta/RBLX_Scripts/main/Universal/BypassedDarkDexV3.lua"))()' },
    { name: 'Remote Spy', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/infyiff/backup/main/SimpleSpyV3/main.lua"))()' },
    { name: 'Infinite Jump', code: 'local InfiniteJumpEnabled = true\ngame:GetService("UserInputService").JumpRequest:connect(function()\n\tif InfiniteJumpEnabled then\n\t\tgame:GetService"Players".LocalPlayer.Character:FindFirstChildOfClass\'Humanoid\':ChangeState("Jumping")\n\tend\nend)' },
  ]

  const addLog = (type: LogEntry['type'], message: string) => {
    const now = new Date()
    const timestamp = now.toLocaleTimeString('id-ID', { hour12: false })
    const id = Date.now()
    setLogs(prev => [...prev, { id, timestamp, type, message }])
  }

  useEffect(() => {
    addLog('system', 'Executor initialized successfully')
    addLog('info', 'Ready for injection. Select a process to begin.')
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom of logs
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [logs])

  const handleInject = async () => {
    if (!selectedProcess) {
      toast.error('Please select a target process')
      addLog('error', 'No target process selected')
      return
    }

    if (isInjected) {
      toast.warning('Already injected')
      addLog('warn', 'Injection already active')
      return
    }

    setIsInjecting(true)
    setProgress(0)
    addLog('system', `Starting injection into ${selectedProcess}...`)

    // Simulate injection progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10 + 5
        if (newProgress >= 10 && prev < 10) addLog('info', 'Initializing bridge...')
        if (newProgress >= 30 && prev < 30) addLog('warn', 'Bypassing anti-cheat...')
        if (newProgress >= 50 && prev < 50) addLog('info', 'Allocating memory...')
        if (newProgress >= 80 && prev < 80) addLog('info', 'Finalizing hook...')
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsInjecting(false)
          setIsInjected(true)
          addLog('success', 'Injection complete!')
          addLog('info', 'Ready for script execution')
          toast.success('Injection complete!')
        }
        return Math.min(newProgress, 100)
      })
    }, 200)
  }

  const handleExecute = () => {
    if (!isInjected) {
      toast.error('Please inject first')
      addLog('error', 'Not injected. Select a process and inject first.')
      return
    }

    if (!code.trim()) {
      toast.error('Please enter code to execute')
      addLog('error', 'No code to execute')
      return
    }

    setIsExecuting(true)
    addLog('code', `Executing script...`)
    addLog('code', code.substring(0, 100) + (code.length > 100 ? '...' : ''))

    // Simulate execution
    setTimeout(() => {
      addLog('success', 'Script executed successfully!')
      setIsExecuting(false)
      toast.success('Script executed!')
    }, 1000)
  }

  const handleStop = () => {
    if (isExecuting) {
      setIsExecuting(false)
      addLog('warn', 'Script execution stopped')
      toast.warning('Script stopped')
    }
  }

  const handleClearLogs = () => {
    setLogs([])
    addLog('system', 'Console cleared')
  }

  const handleCopyCode = () => {
    if (code.trim()) {
      navigator.clipboard.writeText(code)
      toast.success('Code copied to clipboard!')
      addLog('info', 'Code copied to clipboard')
    }
  }

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setCode(text)
      addLog('info', 'Code pasted from clipboard')
    } catch (error) {
      toast.error('Failed to paste')
      addLog('error', 'Failed to paste from clipboard')
    }
  }

  const handleLoadScript = (scriptCode: string) => {
    setCode(scriptCode)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
    addLog('info', 'Script loaded into editor')
    toast.success('Script loaded!')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.target as HTMLTextAreaElement
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newText = code.substring(0, start) + '    ' + code.substring(end)
      setCode(newText)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4
      }, 0)
    }

    // Ctrl/Cmd + Enter to execute
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleExecute()
    }
  }

  const lines = code.split('\n').length
  const chars = code.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-red-950">
      {/* Navbar */}
      <nav className="border-b border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="text-gray-400 hover:text-white"
              >
                <Shield className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-xl font-bold text-white">Script Executor</h1>
            </div>
            <Badge variant={isInjected ? "default" : "secondary"} className={isInjected ? "bg-green-900/30 text-green-400 border-green-900/30" : "bg-gray-800 text-gray-400 border-gray-700"}>
              {isInjected ? '● Connected' : '○ Disconnected'}
            </Badge>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Code Editor */}
          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl flex flex-col overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-white">Code Editor</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{chars} Chars</span>
                  <span>•</span>
                  <span>{lines} Lines</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyCode}
                  className="text-gray-400 hover:text-white"
                  disabled={!code.trim()}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePasteCode}
                  className="text-gray-400 hover:text-white"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditorMinimized(!isEditorMinimized)}
                  className="text-gray-400 hover:text-white"
                >
                  {isEditorMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Code Area */}
            {!isEditorMinimized && (
              <div className="flex-1 p-4">
                <Textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="-- Enter your Lua script here&#10;-- Press Ctrl+Enter to execute&#10;-- Use Tab for indentation"
                  className="w-full h-full min-h-[300px] bg-gray-800/50 border-gray-700 text-white font-mono text-sm resize-none focus:border-red-500"
                  spellCheck={false}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-800 flex gap-2">
              <Button
                onClick={handleInject}
                disabled={isInjecting || !selectedProcess}
                className={`flex-1 ${
                  isInjected
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                }`}
              >
                <Zap className="w-4 h-4 mr-2" />
                {isInjecting ? 'Injecting...' : isInjected ? 'Injected' : 'Inject'}
              </Button>
              <Button
                onClick={handleExecute}
                disabled={!isInjected || isExecuting}
                variant="outline"
                className="flex-1 border-red-900/50 text-red-400 hover:bg-red-950"
              >
                <Play className="w-4 h-4 mr-2" />
                {isExecuting ? 'Executing...' : 'Execute'}
              </Button>
              <Button
                onClick={handleStop}
                disabled={!isExecuting}
                variant="outline"
                size="icon"
                className="border-red-900/50 text-red-400 hover:bg-red-950"
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Right Panel - Controls & Terminal */}
          <div className="flex flex-col gap-6">
            {/* Process Selection */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-white mb-2 block">Target Process</label>
                  <Select value={selectedProcess} onValueChange={setSelectedProcess}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                      <SelectValue placeholder="Select a process" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {processes.map((process) => (
                        <SelectItem key={process.id} value={process.name} className="text-white">
                          {process.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {isInjecting && (
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-2">Progress</div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-red-700 transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{Math.round(progress)}%</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Scripts */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl p-4">
              <h3 className="text-sm font-medium text-white mb-3">Quick Scripts</h3>
              <div className="flex flex-wrap gap-2">
                {quickScripts.map((script, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadScript(script.code)}
                    className="border-red-900/50 text-red-400 hover:bg-red-950"
                  >
                    {script.name}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Terminal Output */}
            <Card className="flex-1 border-red-900/30 bg-gray-900/50 backdrop-blur-xl flex flex-col overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-white">Console Output</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearLogs}
                  className="text-gray-400 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Logs */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-2 font-mono text-sm">
                  {logs.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Terminal className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No output yet</p>
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div
                        key={log.id}
                        className={`flex gap-2 ${
                          log.type === 'error' ? 'text-red-400' :
                          log.type === 'success' ? 'text-green-400' :
                          log.type === 'warn' ? 'text-yellow-400' :
                          log.type === 'code' ? 'text-blue-400' :
                          log.type === 'system' ? 'text-purple-400' :
                          'text-gray-400'
                        }`}
                      >
                        <span className="opacity-50">[{log.timestamp}]</span>
                        <span>{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
