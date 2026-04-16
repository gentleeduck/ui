export namespace Announcer {
  export interface IAnnouncerReturn {
    announce: (message: string) => void
    AnnouncerPortal: React.FC
  }
}
