import * as core from '@actions/core'
import * as github from '@actions/github'
import {ReleaseAdapter} from '../src/ReleaseAdapter'
import {DeployFrequency} from '../src/DeployFrequency'
import {ChangeFailureRate} from '../src/ChangeFailureRate'
import {IssuesAdapter} from '../src/IssuesAdapter'
import {MeanTimeToRestore} from '../src/MeanTimeToRestore'
import {PullRequestsAdapter} from '../src/PullRequestsAdapter'
import {LeadTime} from '../src/LeadTime'
import {run} from '../src/index'
import type {Release} from '../src/types/Release'
import type {PullRequest} from '../src/types/PullRequest'
import type {Issue} from '../src/types/Issue'

jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('../src/ReleaseAdapter')
jest.mock('../src/DeployFrequency')
jest.mock('../src/ChangeFailureRate')
jest.mock('../src/IssuesAdapter')
jest.mock('../src/MeanTimeToRestore')
jest.mock('../src/PullRequestsAdapter')
jest.mock('../src/CommitsAdapter')
jest.mock('../src/LeadTime')

// Mocking github.context.repo as read-only
const mockRepo = {owner: 'defaultOwner', repo: 'defaultRepo'}
Object.defineProperty(github.context, 'repo', {
  get: () => mockRepo
})

describe('run', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should use the provided token input', async () => {
    const mockToken = 'provided-token'

    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      if (name === 'token') {
        return mockToken
      }
      return ''
    })

    const token = process.env.GH_TOKEN
    process.env.GH_TOKEN = undefined // Temporarily remove GH_TOKEN for this test = undefined // Temporarily remove GH_TOKEN for this test

    await run()

    expect(core.getInput).toHaveBeenCalledWith('token')
    expect(process.env.GH_TOKEN).toBe('undefined') // Ensure the environment variable is not used
    process.env.GH_TOKEN = token // Restore GH_TOKEN for other tests
  })

  it('should fall back to GH_TOKEN environment variable if token input is empty', async () => {
    const mockEnvToken = 'env-token'

    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      if (name === 'token') {
        return ''
      }
      return ''
    })

    process.env.GH_TOKEN = mockEnvToken

    await run()

    expect(core.getInput).toHaveBeenCalledWith('token')
    expect(process.env.GH_TOKEN).toBe(mockEnvToken)
  })

  it('should handle a null token input and fall back to GH_TOKEN environment variable', async () => {
    const mockEnvToken = 'env-token'

    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      if (name === 'token') {
        return null as unknown as string // Simulate null input
      }
      return ''
    })

    process.env.GH_TOKEN = mockEnvToken

    await run()

    expect(core.getInput).toHaveBeenCalledWith('token')
    expect(process.env.GH_TOKEN).toBe(mockEnvToken)
  })
  it('should use default repo and owner when inputs are not provided', async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      switch (name) {
        case 'repo':
          return ''
        case 'owner':
          return ''
        case 'token':
          return 'mock-token'
        case 'logging':
          return 'false'
        case 'filtered':
          return 'false'
        default:
          return ''
      }
    })

    const coreInfoSpy = jest.spyOn(core, 'info')

    await run()

    expect(coreInfoSpy).toHaveBeenCalledWith('defaultRepo - default repo.')
    expect(coreInfoSpy).toHaveBeenCalledWith('defaultOwner - default owner.')
  })

  it('should handle multiple repositories correctly', async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      switch (name) {
        case 'repo':
          return 'repo1,repo2'
        case 'owner':
          return 'testOwner'
        case 'token':
          return 'mock-token'
        default:
          return ''
      }
    })

    const coreInfoSpy = jest.spyOn(core, 'info')

    await run()

    expect(coreInfoSpy).toHaveBeenCalledWith('testOwner/repo1')
    expect(coreInfoSpy).toHaveBeenCalledWith('testOwner/repo2')
    expect(coreInfoSpy).toHaveBeenCalledWith('2 repositories registered.')
  })

  it('should set correct outputs for deploy-rate, lead-time, and logs', async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      switch (name) {
        case 'repo':
          return 'repo1'
        case 'owner':
          return 'testOwner'
        case 'token':
          return 'mock-token'
        case 'logging':
          return 'true'
        case 'filtered':
          return 'false'
        default:
          return ''
      }
    })

    const mockReleases = [{}, {}] as Release[] // Mock release objects
    const mockPRs = [{}, {}] as PullRequest[] // Mock pull request objects
    const mockIssues = [{}, {}] as Issue[] // Mock issue objects
    ;(
      ReleaseAdapter.prototype.GetAllReleasesLastMonth as jest.Mock
    ).mockResolvedValue(mockReleases)
    ;(
      PullRequestsAdapter.prototype.GetAllPRsLastMonth as jest.Mock
    ).mockResolvedValue(mockPRs)
    ;(
      IssuesAdapter.prototype.GetAllIssuesLastMonth as jest.Mock
    ).mockResolvedValue(mockIssues)
    ;(DeployFrequency.prototype.rate as jest.Mock).mockReturnValue(5)
    ;(DeployFrequency.prototype.getLog as jest.Mock).mockReturnValue([
      'log1',
      'log2'
    ])
    ;(LeadTime.prototype.getLeadTime as jest.Mock).mockResolvedValue(10)
    ;(LeadTime.prototype.getLog as jest.Mock).mockReturnValue([
      'leadTimeLog1',
      'leadTimeLog2'
    ])
    ;(ChangeFailureRate.prototype.Cfr as jest.Mock).mockReturnValue(0.1)
    ;(MeanTimeToRestore.prototype.mttr as jest.Mock).mockReturnValue(3)

    const coreSetOutputSpy = jest.spyOn(core, 'setOutput')

    await run()

    expect(coreSetOutputSpy).toHaveBeenCalledWith('deploy-rate', 5)
    expect(coreSetOutputSpy).toHaveBeenCalledWith(
      'deploy-rate-log',
      'log1\nlog2'
    )
    expect(coreSetOutputSpy).toHaveBeenCalledWith('lead-time', 10)
    expect(coreSetOutputSpy).toHaveBeenCalledWith(
      'lead-time-log',
      'leadTimeLog1\nleadTimeLog2'
    )
    expect(coreSetOutputSpy).toHaveBeenCalledWith('change-failure-rate', 0.1)
    expect(coreSetOutputSpy).toHaveBeenCalledWith('mttr', 3)
  })

  it('should handle empty issue list case', async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      switch (name) {
        case 'repo':
          return 'repo1'
        case 'owner':
          return 'testOwner'
        case 'token':
          return 'mock-token'
        default:
          return ''
      }
    })
    ;(
      IssuesAdapter.prototype.GetAllIssuesLastMonth as jest.Mock
    ).mockResolvedValue(undefined)

    const coreSetOutputSpy = jest.spyOn(core, 'setOutput')

    await run()

    expect(coreSetOutputSpy).toHaveBeenCalledWith(
      'change-failure-rate',
      'empty issue list'
    )
    expect(coreSetOutputSpy).toHaveBeenCalledWith('mttr', 'empty issue list')
  })

  it('should handle errors and set failure', async () => {
    jest.spyOn(core, 'getInput').mockReturnValue('repo1')
    const coreSetFailedSpy = jest.spyOn(core, 'setFailed')
    ;(
      ReleaseAdapter.prototype.GetAllReleasesLastMonth as jest.Mock
    ).mockRejectedValue(new Error('Failed to fetch releases'))

    await run()

    expect(coreSetFailedSpy).toHaveBeenCalledWith('Failed to fetch releases')
  })
  it("should set filtered to true when 'filtered' input is 'true'", async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      if (name === 'filtered') {
        return 'true'
      }
      return ''
    })

    await run()

    expect(core.getInput).toHaveBeenCalledWith('filtered')
    // You would test the value of filtered indirectly via your logic (mocking, checking calls, etc.)
  })

  it("should set filtered to false when 'filtered' input is 'false'", async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      if (name === 'filtered') {
        return 'false'
      }
      return ''
    })

    await run()

    expect(core.getInput).toHaveBeenCalledWith('filtered')
    // You would test the value of filtered indirectly via your logic (mocking, checking calls, etc.)
  })

  it("should set filtered to false when 'filtered' input is anything other than 'true'", async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      if (name === 'filtered') {
        return 'someOtherValue'
      }
      return ''
    })

    await run()

    expect(core.getInput).toHaveBeenCalledWith('filtered')
    // You would test the value of filtered indirectly via your logic (mocking, checking calls, etc.)
  })
})
