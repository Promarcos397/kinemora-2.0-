import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BASE_URL, API_KEY, IMG_PATH } from '../constants';
import { Movie } from '../types';

interface PageProps {
    onSelectMovie: (movie: Movie) => void;
    onPlay: (movie: Movie) => void;
    seekTime?: number;
}

const CHARACTER_SHOW_IDS = [
    17097, // Peppa Pig
    48433, // PAW Patrol
    1064,  // SpongeBob SquarePants
    116348, // Gabby's Dollhouse
    110906, // CoComelon
    65334, // Miraculous Ladybug
    75788, // The Boss Baby: Back in Business
    60572, // Pokémon
    116135, // The Cuphead Show!
    202613, // Kung Fu Panda: The Dragon Knight
    153520, // Sonic Prime
    60625, // Rick and Morty (wait, NOT KIDS! replaced below)
];

// Replace adult one with a kids one
const KIDS_SHOW_IDS = [
    17097, 48433, 1064, 116348, 110906, 65334, 75788, 60572, 116135, 202613, 153520,
    71225, // Ben 10
    40075, // Gravity Falls
    59427, // The Loud House
    27834, // Phineas and Ferb
];

const CharactersPage: React.FC<PageProps> = ({ onSelectMovie }) => {
    const { t } = useTranslation();
    const [characters, setCharacters] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const promises = KIDS_SHOW_IDS.map(id =>
                    fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`)
                        .then(res => res.json())
                );
                const results = await Promise.all(promises);

                // Map them to Movie objects and filter out missing ones
                const validShows = results.filter(res => res && res.id).map(res => ({
                    ...res,
                    media_type: 'tv'
                }));

                setCharacters(validShows);
            } catch (err) {
                console.error("Failed to load character shows:", err);
            }
        };
        fetchCharacters();
    }, []);

    return (
        <div className="pt-28 px-6 md:px-14 lg:px-20 pb-12 min-h-screen bg-[#141414]">
            {/* Title hidden for Netflix accurate UI but keeping header spacing */}
            <h2 className="sr-only">Characters</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 animate-fadeIn mt-6">
                {characters.map(show => (
                    <div
                        key={show.id}
                        className="group cursor-pointer flex flex-col items-center"
                        onClick={() => onSelectMovie(show)}
                    >
                        {/* The Circle Avatar */}
                        <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-transparent hover:border-white transition-all duration-300 shadow-2xl hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] relative bg-[#222]">
                            <img
                                src={`${IMG_PATH}${show.poster_path}`}
                                alt={show.name}
                                className="w-full h-full object-cover object-top scale-125 group-hover:scale-[1.4] transition-transform duration-500 ease-out"
                                loading="lazy"
                                draggable={false}
                            />
                        </div>

                        {/* Name label appearing on hover (optional, Netflix sometimes shows it or keeps it bare) */}
                        <p className="mt-4 text-white text-[15px] font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2 line-clamp-1">
                            {show.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CharactersPage;
