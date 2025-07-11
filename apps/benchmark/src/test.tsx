// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './style.css'
// // @ts-expect-error css
// import '@gentleduck/motion/css'
// // import { TableDemo } from '@gentleduck/registry-ui-duckui/table'
//
// // import { lazy } from 'react'
//
// // // import App from './App'
// // const App = lazy(() => import('./App'))
//
// import React from 'react'
//
// import { Atom, atom, useAtom, useAtomValue, useSetAtom } from '@gentleduck/state/primitive'
//
// export function TextAtom<Value>({
//   atom,
//   children,
// }: {
//   atom: Atom<Value>
//   children: (value: Value) => React.ReactNode
// }) {
//   const value = useAtomValue(atom)
//   return children(value)
// }
//
// const withRenderAtom = atom(0)
// const withRenderRenderAtom = atom(1)
// function WithRender() {
//   const [count] = useAtom(withRenderAtom)
//   const [render] = useAtom(withRenderRenderAtom)
//
//   return (
//     <>
//       <div className="flex flex-col gap-4 bg-blue-600 p-4 rounded-lg w-[550px] [&_*]:text-white">
//         <h6>Tree</h6>
//         <p>Renders : {render}</p>
//         <p>Count : {count}</p>
//
//         <div className="flex gap-8 bg-blue-500 p-4 rounded-lg justify-between">
//           <WithRenderLeft />
//           <WithRenderRight />
//         </div>
//       </div>
//     </>
//   )
// }
//
// function WithRenderLeaf() {
//   const [count, setCount] = useAtom(withRenderAtom)
//   const [render, setRender] = useAtom(withRenderRenderAtom)
//
//   return (
//     <>
//       <div className="flex flex-col gap-4 bg-blue-400 p-4 rounded-lg">
//         <h6>Leaf</h6>
//         <p>Renders : {render}</p>
//         <p>Count : {count}</p>
//         <button
//           onClick={() => {
//             setCount((c) => c + 1)
//             setRender((c) => c + 1)
//           }}>
//           Increment
//         </button>
//       </div>
//     </>
//   )
// }
//
// function WithRenderLeft() {
//   const [render] = useAtom(withRenderRenderAtom)
//
//   return (
//     <>
//       <div className="flex flex-col gap-4 bg-blue-700 p-4 rounded-lg w-[200px]">
//         <h6>Left</h6>
//         <p>Count : {render}</p>
//         <WithRenderLeaf />
//       </div>
//     </>
//   )
// }
//
// function WithRenderRight() {
//   const [render] = useAtom(withRenderRenderAtom)
//
//   return (
//     <>
//       <div className="flex flex-col gap-4 bg-blue-700 p-4 rounded-lg w-[200px]">
//         <h6>Right</h6>
//         <p>Count : {render}</p>
//       </div>
//     </>
//   )
// }
//
// const withNoRenderAtom = atom(0)
// const withNoRenderRenderAtom = atom(1)
// function WithNoRender() {
//   return (
//     <>
//       <div className="flex flex-col gap-4 bg-red-600 p-4 rounded-lg w-[550px] [&_*]:text-white">
//         <h6>Tree</h6>
//         <p>
//           Renders : <TextAtom atom={withNoRenderRenderAtom} children={(count) => <>{count}</>} />
//         </p>
//         <p>
//           Count :
//           <TextAtom atom={withNoRenderAtom} children={(count) => <>{count}</>} />
//         </p>
//
//         <div className="flex gap-8 bg-red-500 p-4 rounded-lg justify-between">
//           <WithNoRenderLeft />
//           <WithNoRenderRight />
//         </div>
//       </div>
//     </>
//   )
// }
//
// function WithNoRenderLeaf() {
//   const setCount = useSetAtom(withNoRenderAtom)
//
//   return (
//     <>
//       <div className="flex flex-col gap-4 bg-red-400 p-4 rounded-lg">
//         <h6>Leaf</h6>
//         <p>
//           Renders : <TextAtom atom={withNoRenderRenderAtom} children={(count) => <>{count}</>} />
//         </p>
//         <p>
//           Count :
//           <TextAtom atom={withNoRenderAtom} children={(count) => <>{count}</>} />
//         </p>
//         <button
//           onClick={() => {
//             setCount((c) => c + 1)
//           }}>
//           Increment
//         </button>
//       </div>
//     </>
//   )
// }
//
// function WithNoRenderLeft() {
//   return (
//     <>
//       <div className="flex flex-col gap-4 bg-red-700 p-4 rounded-lg w-[200px]">
//         <h6>Left</h6>
//         <p>
//           Count :
//           <TextAtom atom={withNoRenderAtom} children={(count) => <>{count}</>} />
//         </p>
//         <WithNoRenderLeaf />
//       </div>
//     </>
//   )
// }
//
// function WithNoRenderRight() {
//   return (
//     <>
//       <div className="flex flex-col gap-4 bg-red-700 p-4 rounded-lg w-[200px]">
//         <h6>Right</h6>
//         <p>
//           Count :
//           <TextAtom atom={withNoRenderAtom} children={(count) => <>{count}</>} />
//         </p>
//       </div>
//     </>
//   )
// }
//
// function Counter() {
//   return (
//     <div className="min-h-screen flex items-center justify-center gap-8">
//       <div className="grid gap-4">
//         <p>Duck-state</p>
//         <WithNoRender />
//       </div>
//       <div className="grid gap-4">
//         <p>Other-state</p>
//         <WithRender />
//       </div>
//     </div>
//   )
// }
//
// createRoot(document.getElementById('root') as HTMLElement).render(
//   <StrictMode>
//     <Counter />
//   </StrictMode>,
// )
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// p
//   <DuckTableFilter<typeof hi>
//     trigger={{
//       children: (
//         <>
//           <ChartPie className="!size-4" />
//           <span>Status</span>
//         </>
//       ),
//     }}
//     onValueChange={(value) => console.log(value)}
//     items={[
//       {
//         label: 'All',
//         value: 'all',
//       },
//       {
//         label: 'Active',
//         value: 'active',
//       },
//       {
//         label: 'Inactive',
//         value: 'inactive',
//       },
//     ]}
//     heading="Filter Status"
//   />
//   <DuckTableFilter
//     trigger={{
//       children: (
//         <>
//           <ChartPie className="!size-4" />
//           <span>Status</span>
//         </>
//       ),
//     }}
//     onValueChange={(value) => console.log(value)}
//     items={[
//       {
//         label: 'Inactive',
//         value: 'inactive',
//       },
//     ]}
//     heading="Filter Priority"
//   />
// </DuckTableRightSide>
//
