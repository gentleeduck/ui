import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@gentleduck/registry-ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@gentleduck/registry-ui/alert'
import { AspectRatio } from '@gentleduck/registry-ui/aspect-ratio'
import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Kbd } from '@gentleduck/registry-ui/kbd'
import type { MdxComponentMap } from './mdx-component-registry.types'

export const mdxUiComponents = {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  AspectRatio,
  Badge,
  Button,
  Kbd,
} satisfies MdxComponentMap
