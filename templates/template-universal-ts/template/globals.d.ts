declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}

declare module '*.webp' {
  const value: string
  export default value
}

declare module '*.mp4' {
  const value: string
  export default value
}

declare module '*.webm' {
  const value: string
  export default value
}

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.sass' {
  const content: { [className: string]: string }
  export default content
}

declare const __SERVER__: boolean
declare const __CLIENT__: boolean
declare const __DEV__: boolean
declare const __PROD__: boolean
declare const __WATCH__: boolean