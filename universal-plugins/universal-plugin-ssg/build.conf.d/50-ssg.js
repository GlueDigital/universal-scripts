export const extraDefinitions = async (definitions, opts = {}) => {
  return { ...definitions, __SSG__: opts?.ssg ?? false }
}
