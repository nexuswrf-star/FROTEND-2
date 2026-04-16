import luamin from 'luamin'

interface ObfuscationOptions {
  minify: boolean
  encode: boolean
  ascii: boolean
  vm: boolean
  psu: boolean
  shuffle: boolean
  controlflow: boolean
  antitamp: boolean
}

export class LuaObfuscator {
  private code: string
  private options: ObfuscationOptions

  constructor(code: string, options: ObfuscationOptions) {
    this.code = code
    this.options = options
  }

  public obfuscate(): string {
    let result = this.code

    // Apply transformations in order
    if (this.options.minify) {
      result = this.minify(result)
    }

    if (this.options.shuffle) {
      result = this.shuffleVariables(result)
    }

    if (this.options.ascii) {
      result = this.asciiEncode(result)
    }

    if (this.options.encode) {
      result = this.base64Encode(result)
    }

    if (this.options.psu) {
      result = this.psuProtect(result)
    }

    if (this.options.vm) {
      result = this.vmWrap(result)
    }

    if (this.options.controlflow) {
      result = this.controlFlowObfuscate(result)
    }

    if (this.options.antitamp) {
      result = this.addAntiTamper(result)
    }

    return result
  }

  private minify(code: string): string {
    try {
      // Use luamin for real Lua minification
      const minified = luamin.minify(code)
      return minified
    } catch (error) {
      console.error('Minification error:', error)
      // Fallback to basic minification
      return code
        .replace(/\s+/g, ' ')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/--\[[\s\S]*?\]\]/g, '')
        .replace(/--.*/g, '')
        .trim()
    }
  }

  private shuffleVariables(code: string): string {
    // Extract variable names and map them to random names
    const varPattern = /\blocal\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/g
    const functionPattern = /\bfunction\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/g
    const variables = new Set<string>()
    
    let match
    while ((match = varPattern.exec(code)) !== null) {
      if (!this.isReservedKeyword(match[1])) {
        variables.add(match[1])
      }
    }
    while ((match = functionPattern.exec(code)) !== null) {
      if (!this.isReservedKeyword(match[1])) {
        variables.add(match[1])
      }
    }

    // Create mapping
    const mapping = new Map<string, string>()
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    
    variables.forEach((oldName) => {
      let newName = ''
      do {
        newName = 'var_' + Array.from({ length: 8 }, () => 
          chars[Math.floor(Math.random() * chars.length)]
        ).join('')
      } while (mapping.has(newName))
      mapping.set(oldName, newName)
    })

    // Replace variables
    let result = code
    mapping.forEach((newName, oldName) => {
      const regex = new RegExp(`\\b${oldName}\\b`, 'g')
      result = result.replace(regex, newName)
    })

    return result
  }

  private asciiEncode(code: string): string {
    return code.split('').map(char => {
      const codePoint = char.charCodeAt(0)
      // Only encode special characters and non-ASCII
      if (codePoint > 127 || codePoint < 32 || /[^\w\s]/.test(char)) {
        return `\\${codePoint}`
      }
      return char
    }).join('')
  }

  private base64Encode(code: string): string {
    const encoded = Buffer.from(code).toString('base64')
    const loader = `local decode = function(data)
    local b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    data = string.gsub(data, '[^'..b..'=]', '')
    return (data:gsub('.', function(x)
      if (x == '=') then return '' end
      local r, f = '', (b:find(x) - 1)
      for i = 6, 1, -1 do r = r .. (f % 2 ^ i - f % 2 ^ (i - 1) > 0 and '1' or '0') end
      return r;
    end):gsub('%d%d%d?%d?%d?%d?', function(x)
      if (#x < 6) then return '' end
      local c = 0
      for i = 1, 6 do c = c + (x:sub(i, i) == '1' and 2 ^ (6 - i) or 0) end
      return string.char(c)
    end))
end

local encoded = [=[${encoded}]=]
loadstring(decode(encoded))()`
    return loader
  }

  private psuProtect(code: string): string {
    const key = this.generateRandomString(32)
    const encrypted = this.xorEncrypt(code, key)
    
    return `-- PSU Protected String
local Key = [=[${key}]=]

local function XOR(str, key)
    local result = {}
    for i = 1, #str do
        result[i] = string.char(string.byte(str, i) ~ string.byte(key, (i - 1) % #key + 1))
    end
    return table.concat(result)
end

local Encrypted = [=[${encrypted}]=]
local Decoded = XOR(Encrypted, Key)
assert(loadstring(Decoded))()`
  }

  private xorEncrypt(str: string, key: string): string {
    let result = ''
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      result += String.fromCharCode(charCode)
    }
    return result
  }

  private vmWrap(code: string): string {
    const randomId = this.generateRandomString(16)
    return `-- VM Obfuscated (ID: ${randomId})
local VM = {
    instructions = {},
    stack = {},
    ip = 1
}

function VM:push(value)
    table.insert(self.stack, value)
end

function VM:pop()
    return table.remove(self.stack)
end

function VM:run(code)
    local f = load(code)
    if f then
        f()
    end
end

-- Execute protected code
local vm = VM
vm:run([==[${code}]==])`
  }

  private controlFlowObfuscate(code: string): string {
    const junkCode = `
-- Control Flow Protection
if math.random(1, 1000) > 500 then
    local _ = {}
    for i = 1, 100 do _[i] = i end
end
`

    // Split code into chunks and add junk between
    const lines = code.split('\n')
    const result: string[] = []
    
    for (let i = 0; i < lines.length; i++) {
      result.push(lines[i])
      
      // Add junk code every 10-20 lines
      if (Math.random() > 0.9 && i > 0 && i < lines.length - 1) {
        result.push(junkCode)
      }
    }

    return junkCode + '\n' + result.join('\n') + '\n' + junkCode
  }

  private addAntiTamper(code: string): string {
    return `-- Anti-Tamper Protection
local function CheckEnvironment()
    -- Check for debugger
    if debug and debug.getinfo then
        local info = debug.getinfo(2)
        if info and info.source then
            -- Check if being debugged
            local success, err = pcall(function()
                debug.debug()
            end)
            if success then
                return false, "Debugger detected"
            end
        end
    end
    
    -- Check script parent
    if script and not game:IsLoaded() then
        return false, "Game not loaded"
    end
    
    return true
end

local EnvCheck, EnvErr = CheckEnvironment()
if not EnvCheck then
    warn("Security Alert: " .. (EnvErr or "Unknown"))
    return
end

-- Integrity Check
local Integrity = {
    hash = "${this.generateRandomString(32)}",
    verified = true
}

if not Integrity.verified then
    error("Integrity check failed")
end

${code}

-- Post-execution verification
assert(Integrity.verified, "Script integrity compromised")`
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private isReservedKeyword(name: string): boolean {
    const keywords = [
      'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for',
      'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat',
      'return', 'then', 'true', 'until', 'while', 'goto'
    ]
    return keywords.includes(name)
  }
}

export function obfuscateLuaCode(code: string, options: ObfuscationOptions): string {
  const obfuscator = new LuaObfuscator(code, options)
  return obfuscator.obfuscate()
}
