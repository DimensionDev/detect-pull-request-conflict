import type { Context } from 'probot'

const DEFAULT_OPTIONS = {
  enabled: true,
  label: 'has conflict',
}

const CONFIG_NAME = 'detect-pull-request-conflict.yml'

export async function handlePush(context: Context<'push'>) {
  const options = await context.config(CONFIG_NAME, DEFAULT_OPTIONS)
  if (!options?.enabled) return
  const { octokit } = context
  const pulls = await octokit.paginate(
    octokit.pulls.list,
    context.repo({ state: 'open', per_page: 100 }),
    ({ data }) => data.map((pull) => pull.number)
  )
  for (const pull_number of pulls) {
    const pull = await octokit.pulls.get(context.repo({ pull_number }))
    const { number, mergeable } = pull.data
    if (mergeable === null) continue
    await setLabel(context as any, number, !mergeable, options.label)
  }
}

export async function handlePullRequest(context: Context<'pull_request'>) {
  const options = await context.config(CONFIG_NAME, DEFAULT_OPTIONS)
  if (!options?.enabled) return
  const { number, mergeable } = context.payload.pull_request
  if (mergeable === null) return
  await setLabel(context as any, number, !mergeable, options.label)
}

async function setLabel(
  context: Context,
  issue_number: number,
  enabled: boolean,
  name: string | null
) {
  if (name === '' || name === null) return
  const { issues } = context.octokit
  try {
    if (enabled) {
      await issues.addLabels(context.repo({ issue_number, labels: [{ name }] }))
    } else {
      await issues.removeLabel(context.repo({ issue_number, name }))
    }
  } catch (error) {
    if (error instanceof Error) {
      context.log.error(error)
    }
  }
}
