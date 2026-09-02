// Defines the footer.
const Footer = () => {
    // Returns the footer.
    return (
        // Holds the footer content.
        <footer className="flex justify-between w-full border-t border-mist-400 px-6 py-8 text-center text-sm text-mist-700 lg:w-[76vw] lg:border-x">
            {/* Displays the copyright. */}
            <p>© 2026 Klay Garcia</p>
            <a href="https://github.com/klaywork2005/lookback " target="_blank" rel="noopener noreferrer"  className="hover:underline hover:text-mist-600">Documentation</a>
        {/* Ends the footer. */}
        </footer>
    )
}

// Exports the footer.
export default Footer
