// // @ts-noCheck
// import React from 'react'
// import { cn } from '@/lib/utils'
// import { cva, VariantProps } from 'class-variance-authority'
// import { Button } from './button'
// import { HoverCardCustomView } from './hover-card'
// import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
//
// //TODO:
// // Image variant styling
// const imageVariants = cva('', {
//   variants: {
//     variant: {
//       default: '',
//       destructive: '',
//       outline: '',
//       secondary: '',
//       ghost: '',
//       link: '',
//     },
//     // size: {
//     //   default: 'h-10 px-4 py-2',
//     //   sm: 'h-9 rounded-md px-3',
//     //   lg: 'h-11 rounded-md px-8',
//     //   icon: 'h-10 w-10 p-0',
//     // },
//   },
//   defaultVariants: {
//     variant: 'default',
//     // size: 'default',
//   },
// })
//
// // Image component
// export interface ImageProps {
//   wrapper?: React.ComponentPropsWithoutRef<typeof Tooltip>
//   //FIX:
//   image: React.ImgHTMLAttributes<HTMLImageElement> &
//     VariantProps<typeof imageVariants> & {
//       type?: string
//       filename?: string
//       size?: string
//       url?: string
//     }
//   content?: React.ComponentPropsWithoutRef<typeof TooltipContent>
// }
//
// const Image = React.forwardRef<HTMLImageElement, ImageProps>(
//   ({ wrapper, image, content }, ref) => {
//     const { className, variant, size, url, ...props } = image ?? {}
//     const { className: contentClassName, ...contentProps } = content ?? {}
//
//     return (
//       <Tooltip {...wrapper}>
//         <TooltipTrigger asChild>
//           <img
//             className={cn(imageVariants({ variant }), 'p-0', className)}
//             ref={ref}
//             src={url}
//             {...props}
//           />
//         </TooltipTrigger>
//         <TooltipContent
//           className={cn(
//             'w-42 flex items-center justify-between gap-2',
//             contentClassName,
//           )}
//           {...contentProps}
//         >
//           <p className="text-sm">{props.alt}</p>
//           <p className="text-xs font-semibold">{size}</p>
//         </TooltipContent>
//       </Tooltip>
//     )
//   },
// )
//
// Image.displayName = 'Image'
//
// // ImageGroup component
// interface ImageGroupProps {
//   wrapper?: React.HTMLProps<HTMLDivElement>
//   imgs: ImageProps[]
//   max_imgs?: number
//   //FIX:
//   extra_button?: any
// }
//
// const ImageGroup = React.forwardRef<HTMLDivElement, ImageGroupProps>(
//   ({ wrapper, imgs, max_imgs }, ref) => {
//     const { className, ...props } = wrapper ?? {}
//     const max = max_imgs ?? imgs.length
//     return (
//       <div
//         ref={ref}
//         className={cn('flex items-center justify-start gap-2', className)}
//         {...props}
//       >
//         {imgs.map((img, idx) => {
//           const { className, ...imgProps } = img.image
//           return (
//             idx < max && (
//               <Image
//                 image={{
//                   ...imgProps,
//                   className: cn(
//                     'w-8 h-8 rounded-md border-muted-foreground/80 cursor-pointer',
//                     className,
//                   ),
//                 }}
//                 key={img.image.id || idx}
//                 wrapper={img.wrapper}
//               />
//             )
//           )
//         })}
//
//         {imgs.length > max && (
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center font-medium hover:opacity-80 cursor-pointer text-background text-sm">
//                 +{imgs.length - max}
//               </div>
//             </TooltipTrigger>
//             <TooltipContent
//               className={cn('w-42 flex flex-col justify-between px-2')}
//             >
//               {imgs.map(
//                 (img, idx) =>
//                   idx > max && (
//                     <div
//                       className="flex items-center justify-between gap-2 hover:bg-muted-foreground/20 py-2 px-3 rounded-md"
//                       key={idx}
//                     >
//                       <p className="text-sm">{img.image.alt}</p>
//                       <p className="text-xs font-semibold">{img.image.size}</p>
//                     </div>
//                   ),
//               )}
//             </TooltipContent>
//           </Tooltip>
//         )}
//       </div>
//     )
//   },
// )
//
// ImageGroup.displayName = 'ImageGroup'
//
// export { Image, ImageGroup, imageVariants }
