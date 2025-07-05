import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@gentleduck/registry-ui-duckui/accordion'
import { Banknote } from 'lucide-react'
import { TbBrandMastercard, TbBrandPaypal } from 'react-icons/tb'
import { RiVisaLine } from 'react-icons/ri'
import { BsCreditCard } from 'react-icons/bs'
import { IoWalletOutline } from 'react-icons/io5'
import { FaApplePay, FaGooglePay } from 'react-icons/fa'
import { ToggleGroup, ToggleGroupItem } from '@gentleduck/registry-ui-duckui/toggle-group'
import { FaSortDown } from 'react-icons/fa'

export default function Accordion1Demo() {
  const [selectedValue, setSelectedValue] = React.useState({
    payingMethod: 'mastercard',
    wallet: 'paypal',
  })

  const handleSelection = (type: 'payingMethod' | 'wallet', value: string) => {
    setSelectedValue((prev) => ({ ...prev, [type]: value }))
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {/* Paying Methods Section */}
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:no-underline" icon={<FaSortDown />}>
          <div className="flex items-center gap-3">
            <div className="flex flex-col place-content-center rounded-lg bg-secondary p-2">
              <Banknote className="text-primary-foreground" size={35} />
            </div>
            <div className="flex flex-col items-start">
              <h5 className="text-xl">Paying Methods</h5>
              <p className="text-muted-foreground text-sm">Select your preferred payment method</p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ToggleGroup type="single">
            <ul className="flex items-center justify-center gap-4 p-4">
              {[
                {
                  value: 'mastercard',
                  label: 'Mastercard',
                  icon: <TbBrandMastercard />,
                  description: 'Credit card',
                },
                {
                  value: 'visa',
                  label: 'Visa',
                  icon: <RiVisaLine />,
                  description: 'Debit card',
                },
                {
                  value: 'duckcard',
                  label: 'Duckcard',
                  icon: <BsCreditCard />,
                  description: 'Credit card',
                },
              ].map(({ value, label, icon, description }) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  aria-selected={selectedValue.payingMethod === value}
                  className={`flex h-auto cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all duration-300 hover:bg-muted ${
                    selectedValue.payingMethod === value ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleSelection('payingMethod', value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSelection('payingMethod', value)}
                  role="button"
                  tabIndex={0}>
                  <div className="flex place-content-center rounded-lg bg-secondary p-2 [&>svg]:size-[35px] [&>svg]:text-muted">
                    {icon}
                  </div>
                  <div className="flex flex-col items-start">
                    <h5 className="font-semibold text-lg">{label}</h5>
                    <p className="font-semibold text-muted-foreground text-sm">{description}</p>
                  </div>
                </ToggleGroupItem>
              ))}
            </ul>
          </ToggleGroup>
        </AccordionContent>
      </AccordionItem>

      {/* Wallet Options Section */}
      <AccordionItem value="item-2">
        <AccordionTrigger className="hover:no-underline" icon={<FaSortDown />}>
          <div className="flex items-center gap-3">
            <div className="flex flex-col place-content-center rounded-lg bg-secondary p-2">
              <IoWalletOutline className="text-primary-foreground" size={35} />
            </div>
            <div className="flex flex-col items-start">
              <h5 className="text-xl">Wallet Options</h5>
              <p className="text-muted-foreground text-sm">Choose your digital wallet</p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ToggleGroup type="single">
            <ul className="flex items-center justify-center gap-4 p-4">
              {[
                {
                  value: 'paypal',
                  label: 'PayPal',
                  icon: <TbBrandPaypal />,
                  description: 'Digital wallet',
                },
                {
                  value: 'applepay',
                  label: 'Apple Pay',
                  icon: <FaApplePay />,
                  description: 'Digital wallet',
                },
                {
                  value: 'googlepay',
                  label: 'Google Pay',
                  icon: <FaGooglePay />,
                  description: 'Digital wallet',
                },
              ].map(({ value, label, icon, description }) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  aria-selected={selectedValue.wallet === value}
                  className={`flex h-auto cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all duration-300 hover:bg-muted ${
                    selectedValue.wallet === value ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleSelection('wallet', value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSelection('wallet', value)}
                  role="button"
                  tabIndex={0}>
                  <div className="flex place-content-center rounded-lg bg-secondary p-2 [&>svg]:size-[35px] [&>svg]:text-muted">
                    {icon}
                  </div>
                  <div className="flex flex-col items-start">
                    <h5 className="font-semibold text-lg">{label}</h5>
                    <p className="font-semibold text-muted-foreground text-sm">{description}</p>
                  </div>
                </ToggleGroupItem>
              ))}
            </ul>
          </ToggleGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
