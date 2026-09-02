// Imports the logo.
import LookBackLogo from '../../app_images/LookBack.svg'

// Defines the header.
const Header = () => {
    // Returns the header.
    return (
        // Holds the header content.
        <header className="sticky top-0 z-50 flex min-h-11 w-full items-center justify-left border-b border-mist-400 bg-neutral-100 px-4 py-4 lg:w-[76vw] lg:border-x">
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

            {/* Holds the search input. */}
            <div className="relative ml-auto w-48 shrink-0">
                {/* Holds the search icon. */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                    {/* Draws the search icon. */}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {/* Draws the search path. */}
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    {/* Ends the search icon. */}
                    </svg>
                {/* Ends the icon container. */}
                </div>

                {/* Accepts a movie title. */}
                <input type="search" placeholder="Search Movies..." className="w-48 rounded-lg border border-neutral-400 bg-neutral-100 py-2 pl-9 text-sm text-neutral-800 placeholder-neutral-500 transition-all focus:bg-white focus:ring-2 focus:ring-mist-400 focus:outline-none" />
            {/* Ends the search area. */}
            </div>

            {/* Holds the sign in button. */}
            <div className="ml-6 flex items-center">
                {/* Displays the sign in button. */}
                <button className="rounded-lg border border-mist-400 bg-white px-3 py-2 text-lg font-semibold hover:cursor-pointer active:ring-2 active:ring-mist-300 focus:ring-2 focus:ring-mist-400">
                    {/* Displays the button label. */}
                    Sign In
                {/* Ends the sign in button. */}
                </button>
            {/* Ends the sign in area. */}
            </div>
        {/* Ends the header. */}
        </header>
    )
}

// Exports the header.
export default Header
