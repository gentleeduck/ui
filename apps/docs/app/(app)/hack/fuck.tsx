'use client'
import { DuckLazyImage } from '@gentelduck/lazy/lazy-image'
export function HH() {
  return (
    <div className="flex items-center justify-center gap-4">
      <DuckLazyImage
        src="https://zpgqhogoevbgpxustvmo.supabase.co/storage/v1/object/public/produc_imgs/Men/Relaxed%20Fit%20Appliqued%20sweatshirt/Relaxed%20Fit%20Appliqued%20sweatshirt%20-%20compressed/black%201.png"
        alt="Image 1"
        width={400}
        height={599.567}
      />
      <DuckLazyImage
        src="https://media.discordapp.net/attachments/1154782542990409799/1350354561386418218/black_1_1.avif?ex=67d66f2f&is=67d51daf&hm=59a1d024724bc093acb67c4d21cad1f83e7275313103b6084032a06c53bca5f6&=&format=webp&width=612&height=917"
        alt="Image 1"
        width={400}
        height={599.567}
      />

      <img
        src="https://zpgqhogoevbgpxustvmo.supabase.co/storage/v1/object/public/produc_imgs/Men/Relaxed%20Fit%20Appliqued%20sweatshirt/Relaxed%20Fit%20Appliqued%20sweatshirt%20-%20compressed/black%201.png"
        alt="Image 1"
        loading="lazy"
        height="599.567"
        width="400"
      />

      <img
        src="https://media.discordapp.net/attachments/1154782542990409799/1350354561386418218/black_1_1.avif?ex=67d66f2f&is=67d51daf&hm=59a1d024724bc093acb67c4d21cad1f83e7275313103b6084032a06c53bca5f6&=&format=webp&width=612&height=917"
        alt="Image 1"
        loading="lazy"
        height="599.567"
        width="400"
      />
    </div>
  )
}
