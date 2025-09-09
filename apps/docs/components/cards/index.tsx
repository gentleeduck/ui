import { CardsActivityGoal } from './activity-goal'
import { CardsCalendar } from './calendar'
import { CardsChat } from './chat'
import { CardsCookieSettings } from './cookie-settings'
import { CardsCreateAccount } from './create-account'
import { CardsExerciseMinutes } from './exercise-minutes'
import { CardsForms } from './forms'
import { OrderForm } from './order-form'
import { CardsPayments } from './payment'
import { CardsReportIssue } from './report-issue'
import { CardsShare } from './share'
import { CardsStats } from './stats'
import { CardsTeamMembers } from './team-members'

export function CardsDemo() {
  return (
    <div className="md:grids-col-2 grid **:data-[slot=card]:shadow-none md:gap-4 lg:grid-cols-10 xl:grid-cols-11">
      <div className="grid gap-4 lg:col-span-4 xl:col-span-6 h-fit">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-4 h-fit">
          <OrderForm />
        </div>
        <CardsStats />
        <div className="grid gap-1 sm:grid-cols-[auto_1fr] md:hidden">
          <CardsCalendar />
          <div className="pt-3 sm:pt-0 sm:pl-2 xl:pl-4">
            <CardsActivityGoal />
          </div>
          <div className="pt-3 sm:col-span-2 xl:pt-4">
            <CardsExerciseMinutes />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 justify-start h-fit">
          <div className="flex flex-col gap-4 h-fit">
            <CardsForms />
            <CardsTeamMembers />
            <CardsCookieSettings />
          </div>
          <div className="flex flex-col gap-4 h-fit">
            <CardsCreateAccount />
            <CardsChat />
            <div className="hidden xl:block h-fit">
              <CardsReportIssue />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:col-span-6 xl:col-span-5">
        <div className="hidden gap-1 sm:grid-cols-[auto_1fr] md:grid">
          <CardsCalendar />
          <div className="pt-3 sm:pt-0 sm:pl-2 xl:pl-3">
            <CardsActivityGoal />
          </div>
          <div className="pt-3 sm:col-span-2 xl:pt-3">
            <CardsExerciseMinutes />
          </div>
        </div>
        <div className="hidden md:block">
          <CardsPayments />
        </div>
        <CardsShare />
        <div className="xl:hidden">
          <CardsReportIssue />
        </div>
      </div>
    </div>
  )
}
