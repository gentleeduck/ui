export namespace UseAnnouncer {
  export interface IAnnouncerReturn {
    announce: (message: string) => void
    AnnouncerPortal: React.FC
  }
}
