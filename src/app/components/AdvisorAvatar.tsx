"use client";

import {useEffect, useState} from 'react';

const FALLBACK = '/images/default-avatar.svg';

export default function AdvisorAvatar({
  src, alt, size, className,
}: {
  src?: string | null;
  alt: string;
  size: number;
  className?: string;
}) {
  const [image, setImage] = useState(src?.trim() || FALLBACK);

  useEffect(() => setImage(src?.trim() || FALLBACK), [src]);

  return <img
    src={image}
    alt={alt}
    width={size}
    height={size}
    onError={() => setImage(FALLBACK)}
    className={className}
  />;
}
