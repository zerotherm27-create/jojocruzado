import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  ratio: string;
  radius?: number;
  sizes?: string;
  priority?: boolean;
  maxHeight?: string;
  order?: number;
  className?: string;
  /* Fades the photo's outer edge to transparent so it dissolves into the section
     background instead of ending at a hard rectangle — used for portraits (hero,
     story band, About) that should feel part of the scene rather than a card.
     Not for ArticleCard thumbnails or the /resources artcard tiles, which are
     legitimate bordered cards and should stay crisp. Mutually exclusive with
     `radius`: a rounded corner plus a radial fade produces a visible hard clip
     right where the fade is already near-transparent, so `radius` is ignored
     when this is on. */
  edgeFade?: boolean;
};

/* Shared so the falloff is a one-line tweak in one place, not duplicated across
   call sites. Chosen by estimate against flat placeholder art — expect to retune
   once real photography is in place. */
const EDGE_FADE_MASK =
  "radial-gradient(ellipse 72% 78% at 50% 42%, #000 58%, transparent 100%)";

export default function SlotImage({
  src,
  alt,
  ratio,
  radius = 0,
  sizes = "(max-width: 900px) 100vw, 50vw",
  priority = false,
  maxHeight,
  className,
  edgeFade = false,
}: Props) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio,
        maxHeight,
        borderRadius: edgeFade ? 0 : radius,
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{
          objectFit: "cover",
          maskImage: edgeFade ? EDGE_FADE_MASK : undefined,
          WebkitMaskImage: edgeFade ? EDGE_FADE_MASK : undefined,
        }}
      />
    </div>
  );
}
