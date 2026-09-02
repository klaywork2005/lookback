import LookBackLogo from '../../app_images/LookBack.svg'

const LandingPage = () => {
    return (
        /* Contains the landing page. */
        <div className="bg-neutral-100 min-h-screen flex flex-col items-center w-full">
            
            {/* Contains the logo, links, and search field. */}
            <header className="sticky top-0 z-50 flex items-center bg-neutral-100 w-full lg:w-[76vw] min-h-11 border-b lg:border-x border-mist-400 px-4 py-4 justify-left">
                <img
                    src={LookBackLogo}
                    alt="LookBack"
                    className="h-auto w-48 max-w-[65%] sm:w-64 bg-neutral-100"
                />
                <div className='flex flex-wrap items-center text-lg pl-8 gap-6'>
                    <a
                        href="https://github.com/klaywork2005/lookback"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-mist-600 hover:underline"
                    >
                        {/* Opens the source repository. */}
                        Repository
                    </a>
                    <a
                        href="https://developer.themoviedb.org/docs/getting-started"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-mist-600 hover:underline"
                    >
                        {/* Opens the TMDB documentation. */}
                        TMDB API
                    </a>
                </div>
                <div className="relative ml-auto w-48 shrink-0">
                    {/* Displays the search icon. */}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Accepts a movie title. */}
                    <input
                        type="search"
                        placeholder="Search Movies..."
                        className="w-48 pl-9 py-2 text-sm bg-neutral-100 text-neutral-800 placeholder-neutral-500 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-mist-400 focus:bg-white transition-all"
                    />
                </div>
            </header>

            {/* Contains the graph view. */}
            <main className="w-full lg:w-[76vw] min-h-screen lg:border-x border-mist-400 p-4 flex-1 break-words">
                hello world
            </main>
        </div>
    );
};

export default LandingPage
