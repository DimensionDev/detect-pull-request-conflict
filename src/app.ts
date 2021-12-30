import type { ApplicationFunction } from 'probot/lib/types'
import { handlePullRequest, handlePush } from './handle'

const onApp: ApplicationFunction = (app) => {
  app.on('push', handlePush)
  app.on('pull_request', handlePullRequest)
}

export = onApp
