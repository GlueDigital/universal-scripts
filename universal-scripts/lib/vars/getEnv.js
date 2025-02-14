export const getEnvVariablesKeys = () =>
  Object.keys(process.env).filter((key) => key.startsWith('PUBLIC_'))
