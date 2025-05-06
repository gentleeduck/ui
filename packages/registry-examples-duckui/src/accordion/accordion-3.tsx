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
            <div className="flex flex-col place-content-center bg-secondary p-2 rounded-lg">
              <Banknote className="text-primary-foreground" size={35} />
            </div>
            <div className="flex items-start flex-col">
              <h5 className="text-xl">Paying Methods</h5>
              <p className="text-sm text-muted-foreground">Select your preferred payment method</p>
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
                  className={`border rounded-lg p-4 flex items-center gap-3 hover:bg-muted transition-all duration-300 cursor-pointer h-auto ${
                    selectedValue.payingMethod === value ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleSelection('payingMethod', value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSelection('payingMethod', value)}
                  role="button"
                  tabIndex={0}>
                  <div className="flex place-content-center bg-secondary p-2 rounded-lg [&>svg]:text-muted [&>svg]:size-[35px]">
                    {icon}
                  </div>
                  <div className="flex items-start flex-col">
                    <h5 className="text-lg font-semibold">{label}</h5>
                    <p className="text-sm text-muted-foreground font-semibold">{description}</p>
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
            <div className="flex flex-col place-content-center bg-secondary p-2 rounded-lg">
              <IoWalletOutline className="text-primary-foreground" size={35} />
            </div>
            <div className="flex items-start flex-col">
              <h5 className="text-xl">Wallet Options</h5>
              <p className="text-sm text-muted-foreground">Choose your digital wallet</p>
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
                  className={`border rounded-lg p-4 flex items-center gap-3 hover:bg-muted transition-all duration-300 cursor-pointer h-auto ${
                    selectedValue.wallet === value ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleSelection('wallet', value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSelection('wallet', value)}
                  role="button"
                  tabIndex={0}>
                  <div className="flex place-content-center bg-secondary p-2 rounded-lg [&>svg]:text-muted [&>svg]:size-[35px]">
                    {icon}
                  </div>
                  <div className="flex items-start flex-col">
                    <h5 className="text-lg font-semibold">{label}</h5>
                    <p className="text-sm text-muted-foreground font-semibold">{description}</p>
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
