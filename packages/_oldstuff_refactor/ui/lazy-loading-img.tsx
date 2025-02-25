// // @ts-noCheck
// import React, { MutableRefObject, useEffect, useRef } from 'react'
//
// interface AsyncImageTypes extends React.ImgHTMLAttributes<HTMLImageElement> {
//   media?: string
//   ariaLabel?: string
//   alt?: string
//   clickable?: boolean
// }
//
// const LazyLoadingImg = (
//   imgRef: MutableRefObject<HTMLImageElement>,
//   wrapperRef: MutableRefObject<HTMLDivElement>,
// ) => {
//   imgRef.current.addEventListener('load', () => {
//     imgRef.current.complete && wrapperRef.current.classList.add('show--img')
//   })
// }
//
// const AsyncImage: React.FC<AsyncImageTypes> = ({
//   className,
//   src,
//   srcSet,
//   media,
//   ariaLabel,
//   clickable = false,
//   alt = 'img loading',
//   width = 275,
//   height = 384,
//   ...props
// }) => {
//   const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>
//   const imgRef = useRef() as MutableRefObject<HTMLImageElement>
//   const [srcy, setSrc] = React.useState(src)
//   useEffect(() => {
//     LazyLoadingImg(imgRef, wrapperRef)
//   }, [])
//
//   return (
//     <div
//       className="lazyLoaingImg-wrapper"
//       ref={wrapperRef}
//       onClick={() => {
//         if (srcy !== imgRef.current.src && clickable) {
//           wrapperRef.current.classList.remove('show--img')
//           LazyLoadingImg(imgRef, wrapperRef)
//         }
//       }}
//     >
//       <picture className="LazyLoadingImg">
//         <source srcSet={srcSet} media={media} />
//         <img
//           src={src}
//           loading="lazy"
//           className={`lazyLoadingImg__img ${className}`}
//           ref={imgRef}
//           {...props}
//           width={width}
//           height={height}
//           aria-label={ariaLabel}
//           alt={alt}
//         />
//       </picture>
//     </div>
//   )
// }
// AsyncImage.displayName = 'AsyncImage'
//
// export default AsyncImage
