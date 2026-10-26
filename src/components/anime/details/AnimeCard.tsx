
import Image from "next/image";
import Link from "next/link";
import type { AnimeItem } from "@/../server/src/types/anime.types";

type Props = {
    anime: AnimeItem;
    label?: string;
};

export default function AnimeCard({ anime, label }: Props) {
    const title = anime.title.english || anime.title.romaji;
    const image =
        anime.coverImage.extraLarge ||
        anime.coverImage.large ||
        anime.coverImage.medium;

    return (
        <Link
            href={`/anime/${anime.id}`}
            className="group block min-w-0"
        >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border/60 bg-surface">
                {image && (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 42vw, (max-width: 1024px) 25vw, 200px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

                {anime.score != null && (
                    <span className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white backdrop-blur">
                        ★ {(anime.score / 10).toFixed(1)}
                    </span>
                )}

                {label && (
                    <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-white">
                        {label}
                    </span>
                )}

                <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="line-clamp-2 text-sm font-semibold text-white transition group-hover:text-primary">
                        {title}
                    </p>
                    <p className="mt-1 text-xs text-white/65">
                        {anime.format || "ANIME"}
                        {anime.seasonYear ? ` · ${anime.seasonYear}` : ""}
                    </p>
                </div>
            </div>
        </Link>
    );
}
