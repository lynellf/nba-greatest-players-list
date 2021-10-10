import { writeFileSync } from 'fs'

export function write(filename: string, content: string) {
  writeFileSync(filename, content)
}
