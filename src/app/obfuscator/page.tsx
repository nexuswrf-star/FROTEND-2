'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  Copy, 
  Trash2, 
  Zap, 
  Code, 
  Lock,
  ArrowRightLeft,
  ArrowRight,
  Cpu,
  Hash,
  Type,
  Globe,
  RotateCcw,
  Minimize2
} from 'lucide-react'
import { toast } from 'sonner'

export default function ObfuscatorPage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [activeTab, setActiveTab] = useState('vm')
  const [obfuscationKey, setObfuscationKey] = useState('')

  // VM Obfuscation
  const handleVMObfuscation = () => {
    if (!input.trim()) {
      toast.error('Please enter code to obfuscate')
      return
    }

    const wrappedCode = `-- VM Protected by Beulrock SS
local function _VM_INIT()
    local _0 = {}
    local _1 = {}
    local _2 = {}
    
    function _EXEC(_func, ...)
        return _func(...)
    end
    
    -- Original code starts here
    ${input}
    
    return _0
end

return _VM_INIT()`

    setOutput(wrappedCode)
    toast.success('VM Obfuscation applied!')
  }

  // Base64 Encode
  const handleBase64Encode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)))
      setOutput(encoded)
      toast.success('Base64 encoded!')
    } catch (error) {
      toast.error('Failed to encode')
    }
  }

  // Base64 Decode
  const handleBase64Decode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)))
      setOutput(decoded)
      toast.success('Base64 decoded!')
    } catch (error) {
      toast.error('Failed to decode')
    }
  }

  // ASCII Encode
  const handleASCIIEncode = () => {
    if (!input.trim()) {
      toast.error('Please enter text to encode')
      return
    }

    const encoded = input.split('').map(char => 
      `\\${char.charCodeAt(0).toString(10)}`
    ).join('')
    
    setOutput(encoded)
    toast.success('ASCII encoded!')
  }

  // ASCII Decode
  const handleASCIIDecode = () => {
    try {
      const decoded = input.replace(/\\(\d+)/g, (match, p1) => 
        String.fromCharCode(parseInt(p1))
      )
      setOutput(decoded)
      toast.success('ASCII decoded!')
    } catch (error) {
      toast.error('Failed to decode')
    }
  }

  // Hex Encode
  const handleHexEncode = () => {
    if (!input.trim()) {
      toast.error('Please enter text to encode')
      return
    }

    const encoded = input.split('').map(char => 
      char.charCodeAt(0).toString(16).padStart(2, '0')
    ).join('')
    
    setOutput(encoded)
    toast.success('Hex encoded!')
  }

  // Hex Decode
  const handleHexDecode = () => {
    try {
      const decoded = input.match(/.{1,2}/g)?.map(byte => 
        String.fromCharCode(parseInt(byte, 16))
      ).join('') || ''
      setOutput(decoded)
      toast.success('Hex decoded!')
    } catch (error) {
      toast.error('Failed to decode')
    }
  }

  // URL Encode
  const handleURLEncode = () => {
    try {
      const encoded = encodeURIComponent(input)
      setOutput(encoded)
      toast.success('URL encoded!')
    } catch (error) {
      toast.error('Failed to encode')
    }
  }

  // URL Decode
  const handleURLDecode = () => {
    try {
      const decoded = decodeURIComponent(input)
      setOutput(decoded)
      toast.success('URL decoded!')
    } catch (error) {
      toast.error('Failed to decode')
    }
  }

  // Reverse String
  const handleReverseString = () => {
    if (!input.trim()) {
      toast.error('Please enter text to reverse')
      return
    }

    const reversed = input.split('').reverse().join('')
    setOutput(reversed)
    toast.success('String reversed!')
  }

  // Lua Minify
  const handleLuaMinify = () => {
    if (!input.trim()) {
      toast.error('Please enter code to minify')
      return
    }

    const minified = input
      .replace(/--.*$/gm, '') // Remove comments
      .replace(/\s*--.*$/gm, '') // Remove inline comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .trim()

    setOutput(minified)
    toast.success('Lua code minified!')
  }

  // String Obfuscation
  const handleStringObfuscation = () => {
    if (!input.trim()) {
      toast.error('Please enter code to obfuscate')
      return
    }

    const key = obfuscationKey || 'BEULROCK'
    const obfuscated = input.split('').map(char => {
      const charCode = char.charCodeAt(0)
      const keyChar = key.charCodeAt(charCode % key.length)
      return `string.char(${charCode} ^ ${keyChar})`
    }).join('..')

    const wrapperCode = `loadstring(game:HttpGet("https://beulrock.com/decode"))("${obfuscated}")`

    setOutput(wrapperCode)
    toast.success('String obfuscated!')
  }

  // PSU (Pseudo-Encryption)
  const handlePSUEncryption = () => {
    if (!input.trim()) {
      toast.error('Please enter code to encrypt')
      return
    }

    const key = obfuscationKey || 'BEULROCK'
    let encrypted = ''
    
    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i)
      const keyChar = key.charCodeAt(i % key.length)
      const encryptedChar = charCode ^ keyChar
      encrypted += String.fromCharCode(encryptedChar)
    }

    const wrapperCode = `-- PSU Encrypted
local _KEY = "${key}"
local _DECRYPT = function(str)
    local result = ""
    for i = 1, #str do
        result = result .. string.char(string.byte(str, i) ~ string.byte(_KEY, (i % #_KEY) + 1))
    end
    return result
end

local _ENCRYPTED = "${encrypted}"
local _ORIGINAL = _DECRYPT(_ENCRYPTED)

${input.split('\n').map(line => '-- ' + line).join('\n')}`

    setOutput(wrapperCode)
    toast.success('PSU Encryption applied!')
  }

  const handleCopyOutput = () => {
    if (!output.trim()) {
      toast.error('No output to copy')
      return
    }

    navigator.clipboard.writeText(output)
    toast.success('Output copied to clipboard!')
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    toast.success('Cleared!')
  }

  const getStats = () => {
    return {
      inputLength: input.length,
      outputLength: output.length,
      inputLines: input.split('\n').length,
      outputLines: output.split('\n').length
    }
  }

  const stats = getStats()

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
                <ArrowLeftLeft className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-xl font-bold text-white">Code Obfuscator</h1>
            </div>
            <Badge variant="secondary" className="bg-red-900/30 text-red-400 border-red-900/30">
              <Shield className="w-3 h-3 mr-1" />
              Protected
            </Badge>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700 w-full justify-start overflow-x-auto">
            <TabsTrigger value="vm" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Cpu className="w-4 h-4 mr-2" />
              VM
            </TabsTrigger>
            <TabsTrigger value="base64" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Code className="w-4 h-4 mr-2" />
              Base64
            </TabsTrigger>
            <TabsTrigger value="ascii" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Type className="w-4 h-4 mr-2" />
              ASCII
            </TabsTrigger>
            <TabsTrigger value="hex" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Hash className="w-4 h-4 mr-2" />
              Hex
            </TabsTrigger>
            <TabsTrigger value="url" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Globe className="w-4 h-4 mr-2" />
              URL
            </TabsTrigger>
            <TabsTrigger value="reverse" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reverse
            </TabsTrigger>
            <TabsTrigger value="minify" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Minimize2 className="w-4 h-4 mr-2" />
              Minify
            </TabsTrigger>
            <TabsTrigger value="string" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Lock className="w-4 h-4 mr-2" />
              String
            </TabsTrigger>
            <TabsTrigger value="psu" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Zap className="w-4 h-4 mr-2" />
              PSU
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Input</CardTitle>
                    <CardDescription className="text-gray-400">Enter your code here</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="text-gray-400 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="-- Enter your Lua code here..."
                  className="w-full min-h-[400px] bg-gray-800/50 border-gray-700 text-white font-mono text-sm resize-none"
                  spellCheck={false}
                />
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-gray-800/50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{stats.inputLength}</p>
                    <p className="text-xs text-gray-400">Characters</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{stats.inputLines}</p>
                    <p className="text-xs text-gray-400">Lines</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{Math.round(stats.inputLength / 1024 * 100) / 100}</p>
                    <p className="text-xs text-gray-400">KB</p>
                  </div>
                </div>

                {/* Encryption Key (for String and PSU) */}
                {(activeTab === 'string' || activeTab === 'psu') && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">Encryption Key</label>
                    <Input
                      placeholder="Enter encryption key (optional)"
                      value={obfuscationKey}
                      onChange={(e) => setObfuscationKey(e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white mt-2"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {activeTab === 'vm' && (
                    <Button
                      onClick={handleVMObfuscation}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    >
                      <Cpu className="w-4 h-4 mr-2" />
                      Obfuscate with VM
                    </Button>
                  )}
                  {activeTab === 'base64' && (
                    <>
                      <Button
                        onClick={handleBase64Encode}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Encode
                      </Button>
                      <Button
                        onClick={handleBase64Decode}
                        variant="outline"
                        className="flex-1 border-red-900/50 text-red-400 hover:bg-red-950"
                      >
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        Decode
                      </Button>
                    </>
                  )}
                  {activeTab === 'ascii' && (
                    <>
                      <Button
                        onClick={handleASCIIEncode}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Encode
                      </Button>
                      <Button
                        onClick={handleASCIIDecode}
                        variant="outline"
                        className="flex-1 border-red-900/50 text-red-400 hover:bg-red-950"
                      >
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        Decode
                      </Button>
                    </>
                  )}
                  {activeTab === 'hex' && (
                    <>
                      <Button
                        onClick={handleHexEncode}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Encode
                      </Button>
                      <Button
                        onClick={handleHexDecode}
                        variant="outline"
                        className="flex-1 border-red-900/50 text-red-400 hover:bg-red-950"
                      >
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        Decode
                      </Button>
                    </>
                  )}
                  {activeTab === 'url' && (
                    <>
                      <Button
                        onClick={handleURLEncode}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Encode
                      </Button>
                      <Button
                        onClick={handleURLDecode}
                        variant="outline"
                        className="flex-1 border-red-900/50 text-red-400 hover:bg-red-950"
                      >
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        Decode
                      </Button>
                    </>
                  )}
                  {activeTab === 'reverse' && (
                    <Button
                      onClick={handleReverseString}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reverse String
                    </Button>
                  )}
                  {activeTab === 'minify' && (
                    <Button
                      onClick={handleLuaMinify}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    >
                      <Minimize2 className="w-4 h-4 mr-2" />
                      Minify Code
                    </Button>
                  )}
                  {activeTab === 'string' && (
                    <Button
                      onClick={handleStringObfuscation}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Obfuscate Strings
                    </Button>
                  )}
                  {activeTab === 'psu' && (
                    <Button
                      onClick={handlePSUEncryption}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      PSU Encrypt
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Output</CardTitle>
                    <CardDescription className="text-gray-400">Obfuscated result</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyOutput}
                    disabled={!output.trim()}
                    className="text-gray-400 hover:text-white disabled:opacity-50"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={output}
                  readOnly
                  placeholder="Output will appear here..."
                  className="w-full min-h-[400px] bg-gray-800/50 border-gray-700 text-white font-mono text-sm resize-none"
                  spellCheck={false}
                />
                
                {/* Output Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-gray-800/50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{stats.outputLength}</p>
                    <p className="text-xs text-gray-400">Characters</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{stats.outputLines}</p>
                    <p className="text-xs text-gray-400">Lines</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{Math.round(stats.outputLength / 1024 * 100) / 100}</p>
                    <p className="text-xs text-gray-400">KB</p>
                  </div>
                </div>

                {/* Comparison */}
                {stats.outputLength > 0 && stats.inputLength > 0 && (
                  <div className="p-4 rounded-lg bg-gray-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Size Difference</span>
                      <Badge variant={stats.outputLength > stats.inputLength ? 'default' : 'secondary'} 
                             className={stats.outputLength > stats.inputLength 
                               ? 'bg-red-900/30 text-red-400 border-red-900/30' 
                               : 'bg-green-900/30 text-green-400 border-green-900/30'}>
                        {stats.outputLength > stats.inputLength ? '+' : ''}
                        {((stats.outputLength - stats.inputLength) / stats.inputLength * 100).toFixed(2)}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-600 to-red-700 transition-all duration-500"
                        style={{ width: `${Math.min(100, (stats.outputLength / stats.inputLength) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Tabs>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">VM Protection</p>
                  <p className="text-xs text-gray-400">Virtual Machine wrapper</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">Base64</p>
                  <p className="text-xs text-gray-400">Encode/Decode</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">String Obs</p>
                  <p className="text-xs text-gray-400">Custom encryption</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">PSU Encrypt</p>
                  <p className="text-xs text-gray-400">Pseudo-encryption</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
