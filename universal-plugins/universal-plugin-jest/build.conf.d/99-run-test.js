import { run } from 'jest'

const enhancer = (_, config) => {
  const args = [`--config=${JSON.stringify(config)}`]

  return () => run(args)
}

export const test = enhancer
