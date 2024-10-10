import type {Octokit} from '@octokit/rest'
import * as core from '@actions/core'
import {CommitsAdapter} from '../src/CommitsAdapter' // Adjust the import path as necessary

jest.mock('@octokit/rest')
jest.mock('@actions/core')

describe('CommitsAdapter', () => {
  let commitsAdapter: CommitsAdapter
  let octokitMock: jest.Mocked<Octokit>

  beforeEach(() => {
    octokitMock = {
      request: jest.fn()
    } as unknown as jest.Mocked<Octokit>
    commitsAdapter = new CommitsAdapter('fake-token')
    commitsAdapter.octokit = octokitMock as never
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return commits when the request is successful', async () => {
    const mockCommits = [{sha: '123', commit: {message: 'test commit'}}]
    octokitMock.request.mockResolvedValue({
      data: mockCommits,
      headers: {},
      status: 200,
      url: 'https://api.github.com/repos/user/repo/commits'
    })

    const result = await commitsAdapter.getCommitsFromUrl(
      'https://api.github.com/repos/user/repo/commits'
    )

    expect(result).toEqual(mockCommits)
    expect(octokitMock.request).toHaveBeenCalledWith(
      'https://api.github.com/repos/user/repo/commits',
      {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )
  })

  it('should throw an error and call core.setFailed when the request fails', async () => {
    const errorMessage = 'Request failed'
    octokitMock.request.mockRejectedValue(new Error(errorMessage))

    await expect(
      commitsAdapter.getCommitsFromUrl(
        'https://api.github.com/repos/user/repo/commits'
      )
    ).rejects.toThrow(errorMessage)
    expect(core.setFailed).toHaveBeenCalledWith(errorMessage)
  })

  it('should throw an error and call core.setFailed when headers are incorrect', async () => {
    const errorMessage = 'Bad headers'
    octokitMock.request.mockRejectedValue(new Error(errorMessage))

    await expect(
      commitsAdapter.getCommitsFromUrl(
        'https://api.github.com/repos/user/repo/commits'
      )
    ).rejects.toThrow(errorMessage)
    expect(core.setFailed).toHaveBeenCalledWith(errorMessage)
  })
})
