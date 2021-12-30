#!npx ts-node
import { run } from 'probot'
import appFn from '../src/app'

// https://probot.github.io/docs/configuration/

run(appFn)
