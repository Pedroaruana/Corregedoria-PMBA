import { describe, it, expect } from 'vitest'
import { gerarProtocolo } from '@/utils/protocolo'

describe('gerarProtocolo', () => {
  it('should return a string in the format AR-YYYY/NNNN', () => {
    const protocolo = gerarProtocolo()
    expect(protocolo).toMatch(/^AR-\d{4}\/\d{4}$/)
  })

  it('should use the current year', () => {
    const protocolo = gerarProtocolo()
    const year = new Date().getFullYear().toString()
    expect(protocolo).toContain(`AR-${year}/`)
  })

  it('should generate a number between 1000 and 9999', () => {
    const protocolo = gerarProtocolo()
    const number = parseInt(protocolo.split('/')[1])
    expect(number).toBeGreaterThanOrEqual(1000)
    expect(number).toBeLessThanOrEqual(9999)
  })

  it('should generate different protocols on each call', () => {
    const results = new Set(Array.from({ length: 20 }, () => gerarProtocolo()))
    expect(results.size).toBeGreaterThan(1)
  })
})
