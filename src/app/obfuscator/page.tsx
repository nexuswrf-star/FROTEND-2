'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Shield, 
  Copy, 
  Trash2, 
  Zap, 
  Lock, 
  ArrowLeft,
  CheckCircle,
  Code,
  Cpu,
  FileCode,
  Scissors,
  Shuffle
} from 'lucide-react'
import { toast } from 'sonner'

interface ObfuscatorOption {
  id: string
  name: string
  icon: any
  description: string
  badge?: string
}

interface ObfuscationResult {
  obfuscatedCode: string
  statistics: {
    originalSize: number
    obfuscatedSize: number
    sizeChange: string
    processingTime: string
    optionsUsed: string[]
  }
}

const obfuscatorOptions: ObfuscatorOption[] = [
  {
    id: 'vm',
    name: 'VM Obfuscation',
    icon: Cpu,
    description: 'Virtual Machine based obfuscation for maximum protection',
    badge: 'Advanced'
  },
  {
    id: 'encode',
    name: 'Encode',
    icon: Code,
    description: 'Base64 and string encoding techniques',
    badge: 'Basic'
  },
  {
    id: 'ascii',
    name: 'ASCII Encryption',
    icon: FileCode,
    description: 'Convert code to ASCII decimal/char codes',
  },
  {
    id: 'psu',
    name: 'PSU',
    icon: Lock,
    description: 'Protect String Utilities for string encryption',
    badge: 'Popular'
  },
  {
    id: 'minify',
    name: 'Minify',
    icon: Scissors,
    description: 'Remove whitespace and reduce code size',
  },
  {
    id: 'shuffle',
    name: 'Variable Shuffle',
    icon: Shuffle,
    description: 'Randomize variable and function names',
  },
  {
    id: 'controlflow',
    name: 'Control Flow',
    icon: Zap,
    description: 'Obfuscate control flow and add junk code',
    badge: 'Advanced'
  },
  {
    id: 'antitamp',
    name: 'Anti-Tamper',
    icon: Shield,
    description: 'Add anti-debug and anti-tamper protections',
    badge: 'Premium'
  }
]

export default function ObfuscatorPage() {
  const router = useRouter()
  const [inputCode, setInputCode] = useState('')
  const [outputCode, setOutputCode] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['encode'])
  const [isProcessing, setIsProcessing] = useState(false)
  const [statistics, setStatistics] = useState<ObfuscationResult['statistics'] | null>(null)

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  const handleObfuscate = async () => {
    if (!inputCode.trim()) {
      toast.error('Please enter some code to obfuscate')
      return
    }

    if (selectedOptions.length === 0) {
      toast.error('Please select at least one obfuscation option')
      return
    }

    // Check authentication
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to use the obfuscator')
      router.push('/login')
      return
    }

    setIsProcessing(true)

    try {
      const options = {
        minify: selectedOptions.includes('minify'),
        encode: selectedOptions.includes('encode'),
        ascii: selectedOptions.includes('ascii'),
        vm: selectedOptions.includes('vm'),
        psu: selectedOptions.includes('psu'),
        shuffle: selectedOptions.includes('shuffle'),
        controlflow: selectedOptions.includes('controlflow'),
        antitamp: selectedOptions.includes('antitamp'),
      }

      const response = await fetch('/api/obfuscate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code: inputCode, options }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Please login to continue')
          router.push('/login')
          return
        }
        throw new Error(data.error || 'Obfuscation failed')
      }

      setOutputCode(data.data.obfuscatedCode)
      setStatistics(data.data.statistics)
      toast.success('Code obfuscated successfully!')

    } catch (error: any) {
      toast.error(error.message || 'Error obfuscating code')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = () => {
    if (!outputCode) {
      toast.error('No code to copy')
      return
    }
    navigator.clipboard.writeText(outputCode)
    toast.success('Code copied to clipboard!')
  }

  const handleClear = () => {
    setInputCode('')
    setOutputCode('')
    setStatistics(null)
    toast.success('Cleared!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-red-950">
      {/* Navbar */}
      <nav className="border-b border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard')}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Code Obfuscator</h1>
                  <p className="text-xs text-gray-400">Protect your scripts</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-red-900/30 text-red-400 border-red-900/30">
                <Lock className="w-3 h-3 mr-1" />
                Secure
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Options */}
          <div className="lg:col-span-1">
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl sticky top-24">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-500" />
                  Obfuscation Options
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Select the protection methods you want to apply
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {obfuscatorOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = selectedOptions.includes(option.id)
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(option.id)}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-red-500 bg-red-950/30'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-red-600/20' : 'bg-gray-700'}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-red-400' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                              {option.name}
                            </h3>
                            {option.badge && (
                              <Badge variant="secondary" className={`text-xs ${
                                option.badge === 'Premium' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-900/30' :
                                option.badge === 'Advanced' ? 'bg-purple-900/30 text-purple-400 border-purple-900/30' :
                                'bg-green-900/30 text-green-400 border-green-900/30'
                              }`}>
                                {option.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{option.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right: Code Input/Output */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Code className="w-5 h-5 text-red-500" />
                      Input Code
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Paste your Lua code here
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700">
                      {inputCode.length} chars
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="-- Paste your Lua code here..."
                  className="min-h-[300px] bg-gray-950/50 border-gray-700 text-white font-mono text-sm resize-none"
                />
              </CardContent>
            </Card>

            {/* Output */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-500" />
                      Obfuscated Output
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Your protected code will appear here
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700">
                      {outputCode.length} chars
                    </Badge>
                    {outputCode && (
                      <Badge className="bg-green-900/30 text-green-400 border-green-900/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ready
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={outputCode}
                  readOnly
                  placeholder="-- Obfuscated code will appear here..."
                  className="min-h-[300px] bg-gray-950/50 border-gray-700 text-gray-300 font-mono text-sm resize-none"
                />
                {statistics && (
                  <div className="mt-4 p-4 rounded-lg bg-gray-800/50 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Original Size:</span>
                      <span className="text-white">{statistics.originalSize} bytes</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Obfuscated Size:</span>
                      <span className="text-white">{statistics.obfuscatedSize} bytes</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Size Change:</span>
                      <span className={statistics.sizeChange.startsWith('-') ? 'text-green-400' : 'text-red-400'}>
                        {statistics.sizeChange}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Processing Time:</span>
                      <span className="text-white">{statistics.processingTime}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleObfuscate}
                disabled={isProcessing || !inputCode.trim() || selectedOptions.length === 0}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Obfuscate Code
                  </>
                )}
              </Button>
              <Button
                onClick={handleCopy}
                disabled={!outputCode}
                variant="outline"
                className="border-red-900/50 text-red-400 hover:bg-red-950"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="border-gray-700 text-gray-400 hover:bg-gray-800"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            {/* Info Box */}
            <Card className="border-yellow-900/30 bg-yellow-950/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-200 mb-1">
                      Tips for Best Results
                    </h4>
                    <ul className="text-xs text-yellow-200/70 space-y-1">
                      <li>• Combine multiple obfuscation methods for maximum protection</li>
                      <li>• Test your obfuscated code in a safe environment first</li>
                      <li>• VM and Anti-Tamper options require Premium or Ultimate tier</li>
                      <li>• Always keep a backup of your original unobfuscated code</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
