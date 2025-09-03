import { spring } from './easing'

function motion(ref: HTMLElement | Element | null) {
  if (ref) {
    ref.animate(
      [
        { opacity: 0, transform: 'scale(0.8)', filter: 'blur(5px)' },
        { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
      ],
      {
        duration: 250,
        easing: spring,
      },
    )
  }
}

export default motion
