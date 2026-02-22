import { flagAddressDiscrepancies } from './flag-address-discrepancies'
import { ai } from '@/ai/genkit'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock the AI prompt
vi.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: vi.fn(() => vi.fn()),
    defineFlow: vi.fn((config, implementation) => implementation),
  },
}))

describe('flagAddressDiscrepancies', () => {
  let flagAddressDiscrepanciesPrompt: any

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
    flagAddressDiscrepanciesPrompt = ai.definePrompt({} as any)
  })

  it('should return a discrepant response when the AI prompt throws an error', async () => {
    // Arrange
    const input = {
      address: '123 Main St, Anytown, USA',
      googleMapsAddress: '123 Main Street, Anytown, USA',
    }
    const expectedOutput = {
      isDiscrepant: true,
      reason: 'AI check failed. Address requires manual review.',
    }

    // Mock the prompt to throw an error
    ;(flagAddressDiscrepanciesPrompt as any).mockRejectedValue(
      new Error('AI model failed'),
    )

    // Act
    const result = await flagAddressDiscrepancies(input)

    // Assert
    expect(result).toEqual(expectedOutput)
  })
})
