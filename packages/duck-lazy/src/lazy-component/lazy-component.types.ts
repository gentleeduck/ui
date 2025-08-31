/**
 * `UseLazyLoadOptions` is the return type of the `useLazyLoad` hook.
 * It provides the visibility state and a reference to the DOM element being observed by the IntersectionObserver.
 *
 * @interface
 * @property {boolean} isVisible - A boolean indicating if the element is currently visible in the viewport.
 * @property {React.RefObject<HTMLDivElement | null>} elementRef - A React ref object pointing to the DOM element being observed.
 *
 * @example
 * const { isVisible, elementRef } = useLazyLoad({
 *   rootMargin: '100px', // Starts loading the component when 100px is within the viewport
 *   threshold: 0.25, // Trigger when 25% of the component is visible
 * });
 */
export type UseLazyLoadReturn = {
  isVisible: boolean
  elementRef: React.RefObject<HTMLDivElement | null>
}

/**
 * `DuckLazyProps` defines the props for the `DuckLazyComponent` component.
 * It extends the basic HTML properties of a `div` element with an additional `options` prop to configure the `IntersectionObserver`.
 *
 * @interface
 * @extends {React.HTMLProps<HTMLDivElement>} - Extends default HTML div element props to allow for flexibility in the component.
 * @property {IntersectionObserverInit} [options] - Configuration for the IntersectionObserver to control when the lazy-loaded component becomes visible.
 *
 * @example
 * // Example of using DuckLazyProps
 * <DuckLazyComponent
 *   options={{
 *     rootMargin: '50px', // Starts rendering 50px earlier
 *     threshold: 0.5, // Trigger when 50% of the element is visible
 *   }}
 * >
 *   <div>This content is lazily loaded when 50% of it is in the viewport.</div>
 * </DuckLazyComponent>
 */
export interface DuckLazyProps extends React.HTMLProps<HTMLDivElement> {
  options?: IntersectionObserverInit
}
