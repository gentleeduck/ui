export namespace IUseCopyToClipboard {
  export interface IOptions {
    timeout?: number
    onCopy?: () => void
    onError?: (err: unknown) => void
  }

  export interface IReturn {
    copyToClipboard: (value: string) => void
    isCopied: boolean
  }
}
