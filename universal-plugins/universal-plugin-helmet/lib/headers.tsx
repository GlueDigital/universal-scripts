// These are the default headers that can be overriden on app code.
export const defaultHeaders = (store: {
  getState: () => { intl: { lang: string } }
}) => {
  const state = store && store.getState()
  const lang = state && state.intl.lang
  return (
    <>
      <html lang={lang} />
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width,minimum-scale=1,initial-scale=1"
      />
    </>
  )
}
