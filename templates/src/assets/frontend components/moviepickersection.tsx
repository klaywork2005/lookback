// Imports state support.
import { useState } from 'react'

// Defines the available picker steps.
type PickerStep = 'genres' | 'categories' | 'movie'

// Defines one movie returned by Django.
type MovieResult = {
    // Stores the TMDB identifier.
    tmdb_id: number
    // Stores the movie title.
    title: string
    // Stores the movie summary.
    overview: string
    // Stores the release date.
    release_date: string | null
    // Stores the runtime in minutes.
    runtime_minutes: number | null
    // Stores the production budget.
    budget: number | null
    // Stores the reported revenue.
    revenue: number | null
    // Stores the movie rating.
    vote_average: number | null
    // Stores the poster URL.
    poster_url: string | null
    // Stores the movie genres.
    genres: string[]
}

// Defines a successful movie response.
type MoviePickResponse = {
    // Stores the selected movie.
    movie: MovieResult
    // Stores the number of matching movies.
    match_count: number
}

// Formats a movie runtime.
const formatRuntime = (runtimeMinutes: number | null) => {
    // Handles a missing runtime.
    if (runtimeMinutes === null) {
        // Returns the missing runtime label.
        return 'Unknown runtime'
    }

    // Stores the complete hours.
    const hours = Math.floor(runtimeMinutes / 60)
    // Stores the remaining minutes.
    const minutes = runtimeMinutes % 60
    // Returns the formatted runtime.
    return `${hours}h ${minutes}m`
}

// Formats a movie money value.
const formatMoney = (amount: number | null) => {
    // Handles a missing money value.
    if (amount === null) {
        // Returns the missing money label.
        return 'Not reported'
    }

    // Returns the dollar value.
    return new Intl.NumberFormat('en-US', {
        // Uses United States currency formatting.
        style: 'currency',
        // Selects United States dollars.
        currency: 'USD',
        // Removes decimal places.
        maximumFractionDigits: 0,
    }).format(amount)
}

// Builds the selection button classes.
const selectionButtonClassName = (isSelected: boolean) => {
    // Selects the current state classes.
    const selectionClassName = isSelected ? 'border-mist-800 ring-4 ring-mist-800 shadow-md': 'border-mist-400'
    // Returns the complete class name.
    return [
        'min-h-16 min-w-0 w-full rounded-lg border bg-white px-4 py-3',
        'text-center text-base font-semibold text-mist-800 sm:text-lg',
        'transition duration-150',
        'hover:-translate-y-0.5 hover:border-mist-600 hover:shadow-md',
        // Shows the keyboard focus state.
        selectionClassName,
    ].join(' ')
}

// Defines the movie picker.
const MoviePickerSection = () => {
    // Stores the current picker step.
    const [currentStep, setCurrentStep] = useState<PickerStep>('genres')

    // Stores the selected genres.
    const [selectedGenres, setSelectedGenres] = useState<Set<string>>(() => new Set())

    // Stores the selected categories.
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(() => new Set())

    // Stores the selected movie result.
    const [selectedMovie, setSelectedMovie] = useState<MovieResult | null>(null)

    // Stores the number of matching movies.
    const [matchCount, setMatchCount] = useState(0)

    // Stores the request loading state.
    const [isLoadingMovie, setIsLoadingMovie] = useState(false)

    // Stores the request error message.
    const [movieError, setMovieError] = useState<string | null>(null)

    // Toggles one genre.
    const toggleGenre = (genre: string) => {
        // Updates the selected genres.
        setSelectedGenres((currentGenres) => {
            // Copies the current genres.
            const nextGenres = new Set(currentGenres)

            // Checks the selected state.
            if (nextGenres.has(genre)) {
                // Removes a selected genre.
                nextGenres.delete(genre)
            // Handles an unselected genre.
            } else {
                // Adds an unselected genre.
                nextGenres.add(genre)
            // Ends the state check.
            }

            // Returns the updated genres.
            return nextGenres
        // Ends the state update.
        })
    // Ends the genre toggle.
    }

    // Toggles one category.
    const toggleCategory = (category: string) => {
        // Updates the selected categories.
        setSelectedCategories((currentCategories) => {
            // Copies the current categories.
            const nextCategories = new Set(currentCategories)

            // Checks the selected state.
            if (nextCategories.has(category)) {
                // Removes a selected category.
                nextCategories.delete(category)
            // Handles an unselected category.
            } else {
                // Adds an unselected category.
                nextCategories.add(category)
            // Ends the state check.
            }

            // Returns the updated categories.
            return nextCategories
        // Ends the state update.
        })
    // Ends the category toggle.
    }

    // Clears every genre selection.
    const clearGenres = () => {
        // Replaces the selected genres with an empty set.
        setSelectedGenres(new Set())
    // Ends the genre clear action.
    }

    // Clears every category selection.
    const clearCategories = () => {
        // Replaces the selected categories with an empty set.
        setSelectedCategories(new Set())
    // Ends the category clear action.
    }

    // Requests and opens a movie result.
    const showMovie = async () => {
        // Sets the current step to the movie result.
        setCurrentStep('movie')
        // Starts the request loading state.
        setIsLoadingMovie(true)
        // Clears the previous request error.
        setMovieError(null)

        // Attempts to retrieve a movie.
        try {
            // Sends the selected filters to Django.
            const response = await fetch('/api/movies/pick/', {
                // Uses the endpoint request method.
                method: 'POST',
                // Describes the request body.
                headers: {
                    // Sets the JSON content type.
                    'Content-Type': 'application/json',
                },
                // Creates the request body.
                body: JSON.stringify({
                    // Sends every selected genre.
                    genres: Array.from(selectedGenres),
                    // Sends every selected category.
                    categories: Array.from(selectedCategories),
                }),
            })

            // Reads the JSON response.
            const responseData = await response.json() as Partial<MoviePickResponse> & { error?: string }

            // Checks for an unsuccessful response.
            if (!response.ok || responseData.movie === undefined) {
                // Reports the response error.
                throw new Error(responseData.error ?? 'Unable to find a matching movie.')
            }

            // Stores the returned movie.
            setSelectedMovie(responseData.movie)
            // Stores the returned match count.
            setMatchCount(responseData.match_count ?? 0)
        // Handles a failed request.
        } catch (error) {
            // Clears the previous movie result.
            setSelectedMovie(null)
            // Clears the previous match count.
            setMatchCount(0)
            // Stores a readable error message.
            setMovieError(error instanceof Error ? error.message : 'Unable to find a matching movie.')
        // Finishes the request.
        } finally {
            // Ends the request loading state.
            setIsLoadingMovie(false)
        }
    // Ends the movie action.
    }

    // Opens the category step.
    const showCategories = () => {
        // Sets the current step to categories.
        setCurrentStep('categories')
    // Ends the next action.
    }

    // Opens the genre step.
    const showGenres = () => {
        // Sets the current step to genres.
        setCurrentStep('genres')
    // Ends the back action.
    }

    // Starts the picker again.
    const startOver = () => {
        // Clears the selected genres.
        setSelectedGenres(new Set())
        // Clears the selected categories.
        setSelectedCategories(new Set())
        // Clears the selected movie.
        setSelectedMovie(null)
        // Clears the match count.
        setMatchCount(0)
        // Clears the request error.
        setMovieError(null)
        // Opens the genre step.
        setCurrentStep('genres')
    // Ends the restart action.
    }

    // Builds the genre step.
    const renderGenreStep = () => {
        // Returns the genre step.
        return (
            // Holds the genre step.
            <div>
                {/* Displays the genre heading. */}
                <h3 className="mt-10 text-center text-2xl underline">
                    {/* Displays the genre heading text. */}
                    What Genres Are You Interested In Watching Today?
                {/* Ends the genre heading. */}
                </h3>

                {/* Holds the genre buttons. */}
                <div className="mt-8 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
                    {/* Renders the Action button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Action')} onClick={() => toggleGenre('Action')} className={selectionButtonClassName(selectedGenres.has('Action'))}>
                        {/* Displays the Action label. */}
                        Action
                    {/* Ends the Action button. */}
                    </button>

                    {/* Renders the Adventure button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Adventure')} onClick={() => toggleGenre('Adventure')} className={selectionButtonClassName(selectedGenres.has('Adventure'))}>
                        {/* Displays the Adventure label. */}
                        Adventure
                    {/* Ends the Adventure button. */}
                    </button>

                    {/* Renders the Animation button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Animation')} onClick={() => toggleGenre('Animation')} className={selectionButtonClassName(selectedGenres.has('Animation'))}>
                        {/* Displays the Animation label. */}
                        Animation
                    {/* Ends the Animation button. */}
                    </button>

                    {/* Renders the Comedy button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Comedy')} onClick={() => toggleGenre('Comedy')} className={selectionButtonClassName(selectedGenres.has('Comedy'))}>
                        {/* Displays the Comedy label. */}
                        Comedy
                    {/* Ends the Comedy button. */}
                    </button>

                    {/* Renders the Crime button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Crime')} onClick={() => toggleGenre('Crime')} className={selectionButtonClassName(selectedGenres.has('Crime'))}>
                        {/* Displays the Crime label. */}
                        Crime
                    {/* Ends the Crime button. */}
                    </button>

                    {/* Renders the Documentary button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Documentary')} onClick={() => toggleGenre('Documentary')} className={selectionButtonClassName(selectedGenres.has('Documentary'))}>
                        {/* Displays the Documentary label. */}
                        Documentary
                    {/* Ends the Documentary button. */}
                    </button>

                    {/* Renders the Drama button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Drama')} onClick={() => toggleGenre('Drama')} className={selectionButtonClassName(selectedGenres.has('Drama'))}>
                        {/* Displays the Drama label. */}
                        Drama
                    {/* Ends the Drama button. */}
                    </button>

                    {/* Renders the Family button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Family')} onClick={() => toggleGenre('Family')} className={selectionButtonClassName(selectedGenres.has('Family'))}>
                        {/* Displays the Family label. */}
                        Family
                    {/* Ends the Family button. */}
                    </button>

                    {/* Renders the History button. */}
                    <button type="button" aria-pressed={selectedGenres.has('History')} onClick={() => toggleGenre('History')} className={selectionButtonClassName(selectedGenres.has('History'))}>
                        {/* Displays the History label. */}
                        History
                    {/* Ends the History button. */}
                    </button>

                    {/* Renders the Horror button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Horror')} onClick={() => toggleGenre('Horror')} className={selectionButtonClassName(selectedGenres.has('Horror'))}>
                        {/* Displays the Horror label. */}
                        Horror
                    {/* Ends the Horror button. */}
                    </button>

                    {/* Renders the Music button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Music')} onClick={() => toggleGenre('Music')} className={selectionButtonClassName(selectedGenres.has('Music'))}>
                        {/* Displays the Music label. */}
                        Music
                    {/* Ends the Music button. */}
                    </button>

                    {/* Renders the Mystery button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Mystery')} onClick={() => toggleGenre('Mystery')} className={selectionButtonClassName(selectedGenres.has('Mystery'))}>
                        {/* Displays the Mystery label. */}
                        Mystery
                    {/* Ends the Mystery button. */}
                    </button>

                    {/* Renders the Romance button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Romance')} onClick={() => toggleGenre('Romance')} className={selectionButtonClassName(selectedGenres.has('Romance'))}>
                        {/* Displays the Romance label. */}
                        Romance
                    {/* Ends the Romance button. */}
                    </button>

                    {/* Renders the Science Fiction button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Science Fiction')} onClick={() => toggleGenre('Science Fiction')} className={selectionButtonClassName(selectedGenres.has('Science Fiction'))}>
                        {/* Displays the Science Fiction label. */}
                        Science Fiction
                    {/* Ends the Science Fiction button. */}
                    </button>

                    {/* Renders the TV Movie button. */}
                    <button type="button" aria-pressed={selectedGenres.has('TV Movie')} onClick={() => toggleGenre('TV Movie')} className={selectionButtonClassName(selectedGenres.has('TV Movie'))}>
                        {/* Displays the TV Movie label. */}
                        TV Movie
                    {/* Ends the TV Movie button. */}
                    </button>

                    {/* Renders the Thriller button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Thriller')} onClick={() => toggleGenre('Thriller')} className={selectionButtonClassName(selectedGenres.has('Thriller'))}>
                        {/* Displays the Thriller label. */}
                        Thriller
                    {/* Ends the Thriller button. */}
                    </button>

                    {/* Renders the Western button. */}
                    <button type="button" aria-pressed={selectedGenres.has('Western')} onClick={() => toggleGenre('Western')} className={selectionButtonClassName(selectedGenres.has('Western'))}>
                        {/* Displays the Western label. */}
                        Western
                    {/* Ends the Western button. */}
                    </button>
                {/* Ends the genre buttons. */}
                </div>

                {/* Holds the genre controls. */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {/* Clears the selected genres. */}
                    <button type="button" onClick={clearGenres} className="mt-6 h-14 max-h-16 min-h-12 w-full max-w-32 min-w-0 rounded-lg border border-mist-900 bg-mist-500 px-4 py-3 text-center text-base font-semibold text-white transition duration-150 hover:-translate-y-0.5 active:border-2 sm:text-lg">
                        {/* Displays the Clear label. */}
                        Clear
                    {/* Ends the Clear button. */}
                    </button>

                    {/* Opens the category step. */}
                    <button type="button" onClick={showCategories} className="mt-6 h-14 max-h-16 min-h-12 w-full max-w-32 min-w-0 rounded-lg border border-mist-900 bg-mist-500 px-4 py-3 text-center text-base font-semibold text-white transition duration-150 hover:-translate-y-0.5 active:border-2 sm:text-lg">
                        {/* Displays the Next label. */}
                        Next
                    {/* Ends the Next button. */}
                    </button>
                    
                {/* Ends the genre controls. */}
                </div>
            {/* Ends the genre step. */}
            </div>
        )
    // Ends the genre renderer.
    }

    // Builds the category step.
    const renderCategoryStep = () => {
        // Returns the category step.
        return (
            // Holds the category step.
            <div>
                {/* Displays the category heading. */}
                <h3 className="mt-10 text-center text-2xl underline">
                    {/* Displays the category heading text. */}
                    What Kind of Movie Experience Do You Want?
                {/* Ends the category heading. */}
                </h3>

                {/* Holds the category buttons. */}
                <div className="mt-8 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
                    {/* Renders the Blockbuster Duds button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Blockbuster Duds')} onClick={() => toggleCategory('Blockbuster Duds')} className={selectionButtonClassName(selectedCategories.has('Blockbuster Duds'))}>
                        {/* Displays the Blockbuster Duds label. */}
                        Blockbuster Duds
                    {/* Ends the Blockbuster Duds button. */}
                    </button>

                    {/* Renders the Blockbuster Greats button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Blockbuster Greats')} onClick={() => toggleCategory('Blockbuster Greats')} className={selectionButtonClassName(selectedCategories.has('Blockbuster Greats'))}>
                        {/* Displays the Blockbuster Greats label. */}
                        Blockbuster Greats
                    {/* Ends the Blockbuster Greats button. */}
                    </button>

                    {/* Renders the Certified Classics button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Certified Classics')} onClick={() => toggleCategory('Certified Classics')} className={selectionButtonClassName(selectedCategories.has('Certified Classics'))}>
                        {/* Displays the Certified Classics label. */}
                        Certified Classics
                    {/* Ends the Certified Classics button. */}
                    </button>

                    {/* Renders the Crowd Favorites button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Crowd Favorites')} onClick={() => toggleCategory('Crowd Favorites')} className={selectionButtonClassName(selectedCategories.has('Crowd Favorites'))}>
                        {/* Displays the Crowd Favorites label. */}
                        Crowd Favorites
                    {/* Ends the Crowd Favorites button. */}
                    </button>

                    {/* Renders the Epic Runtime button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Epic Runtime')} onClick={() => toggleCategory('Epic Runtime')} className={selectionButtonClassName(selectedCategories.has('Epic Runtime'))}>
                        {/* Displays the Epic Runtime label. */}
                        Epic Runtime
                    {/* Ends the Epic Runtime button. */}
                    </button>

                    {/* Renders the Hidden Gems button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Hidden Gems')} onClick={() => toggleCategory('Hidden Gems')} className={selectionButtonClassName(selectedCategories.has('Hidden Gems'))}>
                        {/* Displays the Hidden Gems label. */}
                        Hidden Gems
                    {/* Ends the Hidden Gems button. */}
                    </button>

                    {/* Renders the International Picks button. */}
                    <button type="button" aria-pressed={selectedCategories.has('International Picks')} onClick={() => toggleCategory('International Picks')} className={selectionButtonClassName(selectedCategories.has('International Picks'))}>
                        {/* Displays the International Picks label. */}
                        International Picks
                    {/* Ends the International Picks button. */}
                    </button>

                    {/* Renders the New Releases button. */}
                    <button type="button" aria-pressed={selectedCategories.has('New Releases')} onClick={() => toggleCategory('New Releases')} className={selectionButtonClassName(selectedCategories.has('New Releases'))}>
                        {/* Displays the New Releases label. */}
                        New Releases
                    {/* Ends the New Releases button. */}
                    </button>

                    {/* Renders the Short and Sweet button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Short and Sweet')} onClick={() => toggleCategory('Short and Sweet')} className={selectionButtonClassName(selectedCategories.has('Short and Sweet'))}>
                        {/* Displays the Short and Sweet label. */}
                        Short and Sweet
                    {/* Ends the Short and Sweet button. */}
                    </button>

                    {/* Renders the Small Budget Standouts button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Small Budget Standouts')} onClick={() => toggleCategory('Small Budget Standouts')} className={selectionButtonClassName(selectedCategories.has('Small Budget Standouts'))}>
                        {/* Displays the Small Budget Standouts label. */}
                        Small Budget Standouts
                    {/* Ends the Small Budget Standouts button. */}
                    </button>

                    {/* Renders the Surprise Hits button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Surprise Hits')} onClick={() => toggleCategory('Surprise Hits')} className={selectionButtonClassName(selectedCategories.has('Surprise Hits'))}>
                        {/* Displays the Surprise Hits label. */}
                        Surprise Hits
                    {/* Ends the Surprise Hits button. */}
                    </button>

                    {/* Renders the Trending Now button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Trending Now')} onClick={() => toggleCategory('Trending Now')} className={selectionButtonClassName(selectedCategories.has('Trending Now'))}>
                        {/* Displays the Trending Now label. */}
                        Trending Now
                    {/* Ends the Trending Now button. */}
                    </button>
                {/* Ends the category buttons. */}
                </div>

                {/* Holds the category controls. */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {/* Clears the selected categories. */}
                    <button type="button" onClick={clearCategories} className="mt-6 h-14 max-h-16 min-h-12 w-full max-w-32 min-w-0 rounded-lg border border-mist-900 bg-mist-500 px-4 py-3 text-center text-base font-semibold text-white transition duration-150 hover:-translate-y-0.5 active:border-2 sm:text-lg">
                        {/* Displays the Clear label. */}
                        Clear
                    {/* Ends the Clear button. */}
                    </button>

                    {/* Opens the genre step. */}
                    <button type="button" onClick={showGenres} className="mt-6 h-14 max-h-16 min-h-12 w-full max-w-32 min-w-0 rounded-lg border border-mist-900 bg-mist-500 px-4 py-3 text-center text-base font-semibold text-white transition duration-150 hover:-translate-y-0.5 active:border-2 sm:text-lg">
                        {/* Displays the Back label. */}
                        Back
                    {/* Ends the Back button. */}
                    </button>

                    {/* Opens the movie result. */}
                    <button type="button" onClick={showMovie} className="mt-6 h-14 max-h-16 min-h-12 w-full max-w-32 min-w-0 rounded-lg border border-mist-900 bg-mist-500 px-4 py-3 text-center text-base font-semibold text-white transition duration-150 hover:-translate-y-0.5 active:border-2 sm:text-lg">
                        {/* Displays the Get Movie label. */}
                        Get Movie
                    {/* Ends the Get Movie button. */}
                    </button>
                {/* Ends the category controls. */}
                </div>
            {/* Ends the category step. */}
            </div>
        )
    // Ends the category renderer.
    }

    // Builds the movie result step.
    const renderMovieStep = () => {
        // Builds the selected genre summary.
        const genreSummary = selectedGenres.size > 0 ? Array.from(selectedGenres).join(', ') : 'Any genre'
        // Builds the selected category summary.
        const categorySummary = selectedCategories.size > 0 ? Array.from(selectedCategories).join(', ') : 'Any category'

        // Returns the movie result step.
        return (
            // Holds the movie result.
            <div className="mt-10">
                {/* Displays the result heading. */}
                <h3 className="text-center text-2xl underline">
                    {/* Displays the result heading text. */}
                    Your Movie Tonight
                {/* Ends the result heading. */}
                </h3>

                {/* Displays the loading state. */}
                {isLoadingMovie && (
                    // Holds the loading message.
                    <div role="status" className="mx-auto mt-8 max-w-4xl rounded-lg border border-mist-400 bg-white p-10 text-center shadow-md">
                        {/* Displays the loading heading. */}
                        <p className="text-2xl font-semibold text-mist-800">Finding your movie...</p>
                        {/* Displays the loading detail. */}
                        <p className="mt-3 text-lg text-mist-700">Checking every selected genre and category.</p>
                    {/* Ends the loading message. */}
                    </div>
                )}

                {/* Displays the request error. */}
                {!isLoadingMovie && movieError !== null && (
                    // Holds the request error.
                    <div role="alert" className="mx-auto mt-8 max-w-4xl rounded-lg border border-red-400 bg-white p-10 text-center shadow-md">
                        {/* Displays the error heading. */}
                        <p className="text-2xl font-semibold text-mist-800">No movie was selected</p>
                        {/* Displays the error detail. */}
                        <p className="mt-3 text-lg text-mist-700">{movieError}</p>
                    {/* Ends the request error. */}
                    </div>
                )}

                {/* Displays the selected movie. */}
                {!isLoadingMovie && selectedMovie !== null && (
                    // Holds the movie card.
                    <article className="mx-auto mt-8 grid max-w-4xl overflow-hidden rounded-lg border border-mist-400 bg-white shadow-md md:grid-cols-[minmax(12rem,18rem)_1fr]">
                        {/* Checks for a movie poster. */}
                        {selectedMovie.poster_url !== null ? (
                            // Displays the movie poster.
                            <img className="min-h-80 h-full w-full bg-neutral-200 object-cover md:min-h-112" src={selectedMovie.poster_url} alt={`${selectedMovie.title} poster`} />
                        // Handles a missing movie poster.
                        ) : (
                            // Holds the poster fallback.
                            <div className="flex min-h-80 items-center justify-center bg-neutral-200 p-6 text-center text-xl font-semibold text-mist-700 md:min-h-112">
                                {/* Displays the poster fallback label. */}
                                Poster unavailable
                            {/* Ends the poster fallback. */}
                            </div>
                        )}

                        {/* Holds the movie information. */}
                        <div className="flex flex-col justify-center p-6 sm:p-8">
                            {/* Identifies the selected result. */}
                            <p className="text-sm font-semibold tracking-widest text-mist-600 uppercase">
                                {/* Displays the selected result label. */}
                                Your Movie
                            {/* Ends the selected result label. */}
                            </p>

                            {/* Displays the movie title. */}
                            <h3 className="mt-2 text-3xl font-bold text-mist-800 sm:text-4xl">
                                {/* Displays the title text. */}
                                {selectedMovie.title}
                            {/* Ends the movie title. */}
                            </h3>

                            {/* Holds the movie details. */}
                            <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-mist-700">
                                {/* Displays the release year. */}
                                <span className="rounded-lg border border-mist-400 bg-white px-4 py-2">{selectedMovie.release_date?.slice(0, 4) ?? 'Unknown year'}</span>
                                {/* Displays the runtime. */}
                                <span className="rounded-lg border border-mist-400 bg-white px-4 py-2">{formatRuntime(selectedMovie.runtime_minutes)}</span>
                                {/* Displays the rating. */}
                                <span className="rounded-lg border border-mist-400 bg-white px-4 py-2">Rating {selectedMovie.vote_average?.toFixed(1) ?? 'Not rated'}</span>
                                {/* Displays the budget. */}
                                <span className="rounded-lg border border-mist-400 bg-white px-4 py-2">Budget {formatMoney(selectedMovie.budget)}</span>
                                {/* Displays the revenue. */}
                                <span className="rounded-lg border border-mist-400 bg-white px-4 py-2">Revenue {formatMoney(selectedMovie.revenue)}</span>
                            {/* Ends the movie details. */}
                            </div>

                            {/* Displays the movie genres. */}
                            <p className="mt-4 text-sm font-semibold text-mist-600">{selectedMovie.genres.join(', ')}</p>

                            {/* Displays the movie overview. */}
                            <p className="mt-6 text-lg leading-8 text-mist-700">
                                {/* Displays the overview text. */}
                                {selectedMovie.overview || 'No overview is available for this movie.'}
                            {/* Ends the movie overview. */}
                            </p>

                            {/* Holds the applied filters. */}
                            <div className="mt-6 rounded-lg border border-mist-300 bg-neutral-100 p-4 text-mist-700">
                                {/* Displays the selected genres. */}
                                <p><span className="font-semibold">Applied Genres:</span> {genreSummary}</p>
                                {/* Displays the selected categories. */}
                                <p className="mt-2"><span className="font-semibold">Applied Categories:</span> {categorySummary}</p>
                                {/* Displays the match count. */}
                                <p className="mt-2"><span className="font-semibold">Matching Movies:</span> {matchCount}</p>
                            {/* Ends the applied filters. */}
                            </div>
                        {/* Ends the movie information. */}
                        </div>
                    {/* Ends the movie card. */}
                    </article>
                )}

                {/* Holds the movie controls. */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {/* Requests another movie. */}
                    <button type="button" onClick={showMovie} disabled={isLoadingMovie} className="mt-6 h-14 max-h-16 min-h-12 w-full max-w-40 min-w-0 rounded-lg border border-mist-900 bg-mist-500 px-4 py-3 text-center text-base font-semibold text-white transition duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg">
                        {/* Displays the request label. */}
                        {isLoadingMovie ? 'Finding Movie' : selectedMovie === null ? 'Try Again' : 'Another Movie'}
                    {/* Ends the request button. */}
                    </button>

                    {/* Opens the category step. */}
                    <button type="button" onClick={showCategories} className="mt-6 h-14 max-h-16 min-h-12 w-full max-w-32 min-w-0 rounded-lg border border-mist-900 bg-mist-500 px-4 py-3 text-center text-base font-semibold text-white transition duration-150 hover:-translate-y-0.5 active:border-2 sm:text-lg">
                        {/* Displays the Back label. */}
                        Back
                    {/* Ends the Back button. */}
                    </button>

                    {/* Restarts the picker. */}
                    <button type="button" onClick={startOver} className="mt-6 h-14 max-h-16 min-h-12 w-full max-w-32 min-w-0 rounded-lg border border-mist-900 bg-mist-500 px-4 py-3 text-center text-base font-semibold text-white transition duration-150 hover:-translate-y-0.5 active:border-2 sm:text-lg">
                        {/* Displays the Start Over label. */}
                        Start Over
                    {/* Ends the Start Over button. */}
                    </button>
                {/* Ends the movie controls. */}
                </div>
            {/* Ends the movie result. */}
            </div>
        )
    // Ends the movie result renderer.
    }

    // Builds the current picker step.
    const renderCurrentStep = () => {
        // Checks for the genre step.
        if (currentStep === 'genres') {
            // Returns the genre step.
            return renderGenreStep()
        // Ends the genre check.
        }

        // Checks for the category step.
        if (currentStep === 'categories') {
            // Returns the category step.
            return renderCategoryStep()
        // Ends the category check.
        }

        // Returns the movie result step.
        return renderMovieStep()
    // Ends the current step renderer.
    }

    // Returns the movie picker.
    return (
        // Holds the movie picker.
        <section id="movie-picker" aria-labelledby="movie-picker-title" className="border-t border-mist-400 w-full min-w-0 scroll-mt-24 px-4 py-16 sm:px-6 lg:min-h-[36rem] lg:w-[76vw] lg:-translate-x-4 lg:px-16 lg:py-16">
            {/* Displays the section heading. */}
            <h2 id="movie-picker-title" className="pb-4 text-3xl font-bold text-mist-800 sm:text-4xl">
                {/* Displays the heading text. */}
                Find Your Movie:
            {/* Ends the section heading. */}
            </h2>

            {/* Holds the current picker step. */}
            <div>
                {/* Displays the current picker step. */}
                {renderCurrentStep()}
            {/* Ends the current picker step. */}
            </div>
        {/* Ends the movie picker. */}
        </section>
    )
}

// Exports the movie picker.
export default MoviePickerSection
