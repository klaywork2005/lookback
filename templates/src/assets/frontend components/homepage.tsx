// Imports the footer.
import Footer from './footer'

// Imports the header.
import Header from './header'

// Imports the hero section.
import HeroSection from './herosection'

// Imports the movie picker.
import MoviePickerSection from './moviepickersection'

// Defines the home page.
const HomePage = () => {
    // Returns the home page.
    return (
        // Holds the full page.
        <div className="flex min-h-screen w-full flex-col items-center bg-neutral-100">
            {/* Renders the header. */}
            <Header />

            {/* Holds the main content. */}
            <main className="min-h-screen w-full flex-1 border-mist-400 p-4 lg:w-[76vw] lg:border-x">
                {/* Renders the hero section. */}
                <HeroSection />

                {/* Renders the movie picker. */}
                <MoviePickerSection />
            {/* Ends the main content. */}
            </main>

            {/* Renders the footer. */}
            <Footer />
        {/* Ends the full page. */}
        </div>
    )
}

// Exports the home page.
export default HomePage
