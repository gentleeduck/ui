import { Checkbox } from "@/registry/default/ui/checkbox"

export default function CheckboxDisabled() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox disabled id="terms2" />
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="terms2"
      >
        Accept terms and conditions
      </label>
    </div>
  )
}
