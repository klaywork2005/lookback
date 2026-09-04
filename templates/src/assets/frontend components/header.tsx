// Imports the logo.
import LookBackLogo from '../../app_images/LookBack.svg'

// Defines the header.
const Header = () => {
    // Returns the header.
    return (
        // Holds the header content.
        <header className=" sticky top-0 z-50 flex min-h-11 w-full items-center justify-left border-b border-mist-400 bg-neutral-100 px-4 py-4 lg:w-[76vw] lg:border-x">
            {/* Displays the logo. */}
            <img src={LookBackLogo} alt="LookBack" className="h-auto w-48 max-w-[65%] bg-neutral-100 sm:w-64" />

            {/* Holds the navigation links. */}
            <div className="flex flex-wrap items-center gap-6 pl-8 text-lg">
                {/* Links to the source repository. */}
                <a href="https://github.com/klaywork2005/lookback" target="_blank" rel="noopener noreferrer" className="hover:text-mist-600 hover:underline">
                    {/* Displays the repository label. */}
                    Repository
                {/* Ends the repository link. */}
                </a>

                {/* Links to the TMDB documentation. */}
                <a href="https://developer.themoviedb.org/docs/getting-started" target="_blank" rel="noopener noreferrer" className="hover:text-mist-600 hover:underline">
                    {/* Displays the API label. */}
                    TMDB API
                {/* Ends the API link. */}
                </a>
            {/* Ends the navigation links. */}
            </div>
        {/* Ends the header. */}
        </header>
    )
}

// Exports the header.
export default Header
