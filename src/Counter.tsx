import { MotionValue, motion, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'

interface NumberProps {
  mv: MotionValue<number>
  number: number
  height: number
}

function Number({ mv, number, height }: NumberProps) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10
    let offset = (10 + number - placeValue) % 10
    let memo = offset * height
    if (offset > 5) {
      memo -= 10 * height
    }
    return memo
  })

  const style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return <motion.span style={{ ...style, y }}>{number}</motion.span>
}

interface DigitProps {
  place: number
  value: number
  height: number
  digitStyle?: React.CSSProperties
  digitClass?: string
}

function Digit({ place, value, height, digitStyle, digitClass }: DigitProps) {
  let valueRoundedToPlace = Math.floor(value / place)
  let animatedValue = useSpring(valueRoundedToPlace)

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace)
  }, [animatedValue, valueRoundedToPlace])

  return (
    <div style={digitStyle} className={digitClass}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  )
}

interface CounterProps {
  value: number
  fontSize?: number
  padding?: number
  places?: number[]
  gap?: number
  borderRadius?: number
  horizontalPadding?: number
  fontWeight?: React.CSSProperties['fontWeight']
  containerStyle?: React.CSSProperties
  containerClass?: string
  counterStyle?: React.CSSProperties
  digitStyle?: React.CSSProperties
  digitClass?: string
}

export default function Counter({
  value,
  fontSize = 100,
  padding = 0,
  places = [100, 10, 1],
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  fontWeight = 'bold',
  containerStyle,
  containerClass,
  counterStyle,
  digitStyle,
  digitClass,
}: CounterProps) {
  const height = fontSize + padding

  const defaultContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  }

  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    display: 'flex',
    gap: gap,
    overflow: 'hidden',
    borderRadius: borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    lineHeight: 1,
    fontWeight: fontWeight,
  }

  const defaultStyle: React.CSSProperties = {
    height,
    position: 'relative',
    width: '1ch',
    fontVariantNumeric: 'tabular-nums',
  }

  return (
    <div
      style={{ ...defaultContainerStyle, ...containerStyle }}
      className={containerClass ? containerClass : ''}
    >
      <div style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map((place) => (
          <Digit
            key={place}
            place={place}
            value={value}
            height={height}
            digitStyle={{ ...defaultStyle, ...digitStyle }}
            digitClass={digitClass}
          />
        ))}
      </div>
    </div>
  )
}
