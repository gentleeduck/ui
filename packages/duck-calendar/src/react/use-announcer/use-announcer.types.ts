export interface AnnouncerReturn {
  announce: (message: string) => void
  AnnouncerPortal: React.FC
}

export interface AnnouncementMessages {
  monthNavigation: (month: string, year: string) => string
  dateSelected: (date: string) => string
  rangeSelected: (from: string, to: string) => string
  dateDisabled: (date: string) => string
}
