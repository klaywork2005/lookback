// Defines the footer.
const Footer = () => {
    // Returns the footer.
    return (
        // Holds the footer content.
        <footer className="flex w-full flex-col items-center justify-between gap-8 border-t border-mist-400 px-6 py-8 text-center text-sm text-mist-700 lg:w-[76vw] lg:flex-row lg:border-x lg:text-left">
            {/* Holds the project information. */}
            <div>
                {/* Displays the copyright. */}
                <p>© 2026 Klay Garcia</p>
                {/* Links to the project documentation. */}
                <a href="https://github.com/klaywork2005/lookback" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block hover:text-mist-600 hover:underline">Documentation</a>
            {/* Ends the project information. */}
            </div>

            {/* Holds the TMDB attribution. */}
            <div className="flex max-w-xl flex-col items-center gap-3 lg:items-end">
                {/* Links the approved TMDB logo to TMDB. */}
                <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" aria-label="Visit TMDB">
                    {/* Displays the approved TMDB logo. */}
                    <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB" className="h-auto w-20" />
                {/* Ends the TMDB link. */}
                </a>
                {/* Displays the required TMDB notice. */}
                <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
            {/* Ends the TMDB attribution. */}
            </div>
        {/* Ends the footer. */}
        </footer>
    )
}

// Exports the footer.
export default Footer
