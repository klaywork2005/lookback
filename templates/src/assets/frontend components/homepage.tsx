// Imports the footer.
import { useState } from 'react'
import type { DiscoveryRequest } from '../../discovery'
import MovieDiscoverySection from './moviediscoverysection'
import Footer from './footer'

// Imports the header.
import Header from './header'

// Imports the hero section.
import HeroSection from './herosection'

// Imports the movie picker.
import MoviePickerSection from './moviepickersection'

// Defines the home page.
const HomePage = () => {
    const [discoveryRequest, setDiscoveryRequest] = useState<DiscoveryRequest | null>(null)
    const exploreMovie = (tmdbId?: number) => {
        setDiscoveryRequest((current) => ({ tmdbId, sequence: (current?.sequence ?? 0) + 1 }))
    }
    const explorePickerMovie = (tmdbId: number) => {
        exploreMovie(tmdbId)
        document.getElementById('movie-discovery')?.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
            block: 'start',
        })
    }
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
                <MoviePickerSection onExploreMovie={explorePickerMovie} />

                <MovieDiscoverySection request={discoveryRequest} onExplore={exploreMovie} />
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
