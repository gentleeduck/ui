'use client'
import { DuckLazyImage } from '@gentleduck/lazy/lazy-image'
import Image from 'next/image'
export function HH() {
  return (
    <div className="flex items-center justify-center gap-4 flex-col mt-16">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center gap-4 flex-col">
          <h4 className="text-lg font-bold">DuckLazyImage not optimized</h4>
          <DuckLazyImage
            src="https://zpgqhogoevbgpxustvmo.supabase.co/storage/v1/object/public/produc_imgs/Men/Relaxed%20Fit%20Appliqued%20sweatshirt/Relaxed%20Fit%20Appliqued%20sweatshirt%20-%20compressed/black%201.png"
            alt="Image 1"
            width={400}
            height={599.567}
          />
        </div>
        <div className="flex items-center justify-center gap-4 flex-col">
          <h4 className="text-lg font-bold">DuckLazyImage 2 optimized</h4>
          <DuckLazyImage
            src="https://media.discordapp.net/attachments/1154782542990409799/1350354561386418218/black_1_1.avif?ex=67d7c0af&is=67d66f2f&hm=260e3180e6d55d4f1c442999273dd5a1e7b8b42d3f6c79174998927920de7c80&=&format=webp&width=627&height=939"
            alt="Image 1"
            width={400}
            height={599.567}
          />
        </div>
        <div className="flex items-center justify-center gap-4 flex-col">
          <h4 className="text-lg font-bold">normal 1 not optimized</h4>
          <img
            src="https://zpgqhogoevbgpxustvmo.supabase.co/storage/v1/object/public/produc_imgs/Men/Relaxed%20Fit%20Appliqued%20sweatshirt/Relaxed%20Fit%20Appliqued%20sweatshirt%20-%20compressed/black%201.png"
            alt="Image 1"
            loading="lazy"
            width={400}
            height={599.567}
          />
        </div>
        <div className="flex items-center justify-center gap-4 flex-col">
          <h4 className="text-lg font-bold">normal 2 optimized</h4>
          <img
            src="https://media.discordapp.net/attachments/1154782542990409799/1350354561386418218/black_1_1.avif?ex=67d7c0af&is=67d66f2f&hm=260e3180e6d55d4f1c442999273dd5a1e7b8b42d3f6c79174998927920de7c80&=&format=webp&width=627&height=939"
            alt="Image 1"
            loading="lazy"
            width={400}
            height={599.567}
          />
        </div>
      </div>
    </div>
  )
}
