import { cn } from '@gentleduck/libs/cn'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@gentleduck/registry-ui-duckui/accordion'
import { ToggleGroup, ToggleGroupItem } from '@gentleduck/registry-ui-duckui/toggle-group'
import { Banknote } from 'lucide-react'
import React from 'react'
import { BsCreditCard } from 'react-icons/bs'
import { FaApplePay, FaGooglePay, FaSortDown } from 'react-icons/fa'
import { IoWalletOutline } from 'react-icons/io5'
import { RiVisaLine } from 'react-icons/ri'
import { TbBrandMastercard, TbBrandPaypal } from 'react-icons/tb'

export default function Accordion1Demo() {
  const [selectedValue, setSelectedValue] = React.useState({
    payingMethod: 'mastercard',
    wallet: 'paypal',
  })

  const handleSelection = (type: 'payingMethod' | 'wallet', value: string) => {
    setSelectedValue((prev) => ({ ...prev, [type]: value }))
  }

  return (
    <Accordion className="w-full" defaultValue={['item-1'] as const} open>
      {/* Paying Methods Section */}
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:no-underline" icon={<FaSortDown />}>
          <div className="flex items-center gap-3">
            <div className="flex flex-col place-content-center rounded-lg bg-secondary p-2">
              <Banknote className="text-muted-foreground" size={35} />
            </div>
            <div className="flex flex-col items-start">
              <h5 className="text-xl">Paying Methods</h5>
              <p className="text-muted-foreground text-sm">Select your preferred payment method</p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ToggleGroup className="gap-3" type="single">
            {[
              {
                description: 'Credit card',
                icon: <TbBrandMastercard />,
                label: 'Mastercard',
                value: 'mastercard',
              },
              {
                description: 'Debit card',
                icon: <RiVisaLine />,
                label: 'Visa',
                value: 'visa',
              },
              {
                description: 'Credit card',
                icon: <BsCreditCard />,
                label: 'Duckcard',
                value: 'duckcard',
              },
            ].map(({ value, label, icon, description }) => (
              <ToggleGroupItem
                aria-selected={selectedValue.payingMethod === value}
                className={cn(
                  'flex h-[90px] w-full cursor-pointer items-center gap-3 rounded-lg border p-2 transition-all duration-300 hover:bg-muted',
                  selectedValue.payingMethod === value ? 'bg-muted' : '',
                )}
                key={value}
                onClick={() => handleSelection('payingMethod', value)}
                tabIndex={0}
                value={value}>
                <div className="flex place-content-center rounded-lg bg-secondary p-2 text-white [&>svg]:size-[35px] [&>svg]:text-muted-foreground">
                  {icon}
                </div>
                <div className="flex w-full flex-col items-start">
                  <h5 className="w-full whitespace-nowrap font-semibold text-lg">{label}</h5>
                  <p className="w-full whitespace-nowrap font-semibold text-muted-foreground text-sm">{description}</p>
                </div>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </AccordionContent>
      </AccordionItem>

      {/* Wallet Options Section */}
      <AccordionItem value="item-2">
        <AccordionTrigger className="hover:no-underline" icon={<FaSortDown />}>
          <div className="flex items-center gap-3">
            <div className="flex flex-col place-content-center rounded-lg bg-secondary p-2">
              <IoWalletOutline className="text-muted-foreground" size={35} />
            </div>
            <div className="flex flex-col items-start">
              <h5 className="text-xl">Wallet Options</h5>
              <p className="text-muted-foreground text-sm">Choose your digital wallet</p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ToggleGroup className="gap-3" type="single">
            {[
              {
                description: 'Digital wallet',
                icon: <TbBrandPaypal />,
                label: 'PayPal',
                value: 'paypal',
              },
              {
                description: 'Digital wallet',
                icon: <FaApplePay />,
                label: 'Apple Pay',
                value: 'applepay',
              },
              {
                description: 'Digital wallet',
                icon: <FaGooglePay />,
                label: 'Google Pay',
                value: 'googlepay',
              },
            ].map(({ value, label, icon, description }) => (
              <ToggleGroupItem
                aria-selected={selectedValue.payingMethod === value}
                className={cn(
                  'flex h-[90px] w-full cursor-pointer items-center gap-3 rounded-lg border p-2 transition-all duration-300 hover:bg-muted',
                  selectedValue.payingMethod === value ? 'bg-muted' : '',
                )}
                key={value}
                onClick={() => handleSelection('payingMethod', value)}
                tabIndex={0}
                value={value}>
                <div className="flex place-content-center rounded-lg bg-secondary p-2 text-white [&>svg]:size-[35px] [&>svg]:text-muted-foreground">
                  {icon}
                </div>
                <div className="flex w-full flex-col items-start">
                  <h5 className="w-full whitespace-nowrap font-semibold text-lg">{label}</h5>
                  <p className="w-full whitespace-nowrap font-semibold text-muted-foreground text-sm">{description}</p>
                </div>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
