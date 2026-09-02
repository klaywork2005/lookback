// Imports the theatre animation.
import movieTheatreAnimation from '../../app_images/Movie Theatre.svg'

// Defines the hero section.
const HeroSection = () => {
    // Returns the hero section.
    return (
        // Holds the hero content.
        <section className="grid w-full gap-12 border-b border-mist-400 px-6 py-16 lg:min-h-[36rem] lg:grid-cols-2 lg:px-16 lg:py-28">
            {/* Holds the hero text. */}
            <div className="flex flex-col items-start justify-center">
                {/* Displays the main heading. */}
                <h1 className="max-w-3xl pb-4 text-4xl font-bold text-mist-800 sm:text-5xl">
                    {/* Displays the heading text. */}
                    Welcome to LookBack, the most useful Movie Night Picker on the planet.
                {/* Ends the main heading. */}
                </h1>

                {/* Displays the supporting heading. */}
                <h2 className="max-w-3xl pb-8 text-xl text-mist-800 opacity-70 sm:text-2xl">
                    {/* Displays the supporting text. */}
                    Uses the TMDB API to maintain an updated pool of movies and provides filters to find exactly what you want.
                {/* Ends the supporting heading. */}
                </h2>

                {/* Links to the movie picker. */}
                <a href="#movie-picker" className="w-60 rounded-lg border border-mist-400 bg-mist-800 px-3 py-2 text-center text-2xl font-semibold text-white active:ring-3 active:ring-mist-400 focus:ring-4 focus:ring-mist-500 transition duration-150 hover:-translate-y-0.5 hover:border-mist-900 hover:shadow-md">
                    {/* Displays the link label. */}
                    Begin Search
                {/* Ends the picker link. */}
                </a>
            {/* Ends the hero text. */}
            </div>

            {/* Holds the animation. */}
            <div className="flex h-120 min-h-20 items-stretch justify-center overflow-hidden rounded-lg lg:h-130">
                {/* Displays the animation. */}
                <img src={movieTheatreAnimation} alt="" aria-hidden="true" className="h-full w-full object-contain" />
            {/* Ends the animation area. */}
            </div>
        {/* Ends the hero section. */}
        </section>
    )
}

// Exports the hero section.
export default HeroSection
