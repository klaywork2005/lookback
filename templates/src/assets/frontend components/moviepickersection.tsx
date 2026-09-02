// Imports state support.
import { useState } from 'react'

// Defines the available picker steps.
type PickerStep = 'genres' | 'categories' | 'movie'

// Stores the temporary movie result.
const placeholderMovie = {
    // Stores the movie title.
    title: 'Echoes Beyond Orion',
    // Stores the release year.
    year: 2026,
    // Stores the movie runtime.
    runtime: '1h 52m',
    // Stores the movie rating.
    rating: '6.7',
    // Stores the movie summary.
    overview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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

    // Opens the movie result step.
    const showMovie = () => {
        // Sets the current step to the movie result.
        setCurrentStep('movie')
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

    const getAnotherMovie = () => {
        Math.random 
    }
    // Starts the picker again.
    const startOver = () => {
        // Clears the selected genres.
        setSelectedGenres(new Set())
        // Clears the selected categories.
        setSelectedCategories(new Set())
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
                    {/* Renders the Award Season Royalty button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Award Season Royalty')} onClick={() => toggleCategory('Award Season Royalty')} className={selectionButtonClassName(selectedCategories.has('Award Season Royalty'))}>
                        {/* Displays the Award Season Royalty label. */}
                        Award Season Royalty
                    {/* Ends the Award Season Royalty button. */}
                    </button>

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

                    {/* Renders the Cult Obsessions button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Cult Obsessions')} onClick={() => toggleCategory('Cult Obsessions')} className={selectionButtonClassName(selectedCategories.has('Cult Obsessions'))}>
                        {/* Displays the Cult Obsessions label. */}
                        Cult Obsessions
                    {/* Ends the Cult Obsessions button. */}
                    </button>

                    {/* Renders the Hidden Gems button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Hidden Gems')} onClick={() => toggleCategory('Hidden Gems')} className={selectionButtonClassName(selectedCategories.has('Hidden Gems'))}>
                        {/* Displays the Hidden Gems label. */}
                        Hidden Gems
                    {/* Ends the Hidden Gems button. */}
                    </button>

                    {/* Renders the Midnight Madness button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Midnight Madness')} onClick={() => toggleCategory('Midnight Madness')} className={selectionButtonClassName(selectedCategories.has('Midnight Madness'))}>
                        {/* Displays the Midnight Madness label. */}
                        Midnight Madness
                    {/* Ends the Midnight Madness button. */}
                    </button>

                    {/* Renders the One Hit Wonders button. */}
                    <button type="button" aria-pressed={selectedCategories.has('One Hit Wonders')} onClick={() => toggleCategory('One Hit Wonders')} className={selectionButtonClassName(selectedCategories.has('One Hit Wonders'))}>
                        {/* Displays the One Hit Wonders label. */}
                        One Hit Wonders
                    {/* Ends the One Hit Wonders button. */}
                    </button>

                    {/* Renders the Sleeper Hits button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Sleeper Hits')} onClick={() => toggleCategory('Sleeper Hits')} className={selectionButtonClassName(selectedCategories.has('Sleeper Hits'))}>
                        {/* Displays the Sleeper Hits label. */}
                        Sleeper Hits
                    {/* Ends the Sleeper Hits button. */}
                    </button>

                    {/* Renders the Small Budget Standouts button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Small Budget Standouts')} onClick={() => toggleCategory('Small Budget Standouts')} className={selectionButtonClassName(selectedCategories.has('Small Budget Standouts'))}>
                        {/* Displays the Small Budget Standouts label. */}
                        Small Budget Standouts
                    {/* Ends the Small Budget Standouts button. */}
                    </button>

                    {/* Renders the Visual Feasts button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Visual Feasts')} onClick={() => toggleCategory('Visual Feasts')} className={selectionButtonClassName(selectedCategories.has('Visual Feasts'))}>
                        {/* Displays the Visual Feasts label. */}
                        Visual Feasts
                    {/* Ends the Visual Feasts button. */}
                    </button>

                    {/* Renders the Wild Cards button. */}
                    <button type="button" aria-pressed={selectedCategories.has('Wild Cards')} onClick={() => toggleCategory('Wild Cards')} className={selectionButtonClassName(selectedCategories.has('Wild Cards'))}>
                        {/* Displays the Wild Cards label. */}
                        Wild Cards
                    {/* Ends the Wild Cards button. */}
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

                {/* Holds the movie card. */}
                <article className="mx-auto mt-8 grid max-w-4xl overflow-hidden rounded-lg border border-mist-400 bg-white shadow-md md:grid-cols-[minmax(12rem,18rem)_1fr]">
                    {/* Holds the poster placeholder. */}
                    <div className="flex min-h-80 items-center justify-center bg-neutral-200 p-6 text-center text-xl font-semibold text-mist-700 md:min-h-112">
                        {/* Displays the poster placeholder label. */}
                        Movie Poster
                    {/* Ends the poster placeholder. */}
                    </div>

                    {/* Holds the movie information. */}
                    <div className="flex flex-col justify-center p-6 sm:p-8">
                        {/* Identifies the temporary result. */}
                        <p className="text-sm font-semibold tracking-widest text-mist-600 uppercase">
                            {/* Displays the temporary result label. */}
                            Your Movie
                        {/* Ends the temporary result label. */}
                        </p>

                        {/* Displays the movie title. */}
                        <h3 className="mt-2 text-3xl font-bold text-mist-800 sm:text-4xl">
                            {/* Displays the title text. */}
                            {placeholderMovie.title}
                        {/* Ends the movie title. */}
                        </h3>

                        {/* Holds the movie details. */}
                        <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-mist-700">
                            {/* Displays the release year. */}
                            <span className="rounded-lg border border-mist-400 bg-white px-4 py-2">{placeholderMovie.year}</span>
                            {/* Displays the runtime. */}
                            <span className="rounded-lg border border-mist-400 bg-white px-4 py-2">{placeholderMovie.runtime}</span>
                            {/* Displays the rating. */}
                            <span className="rounded-lg border border-mist-400 bg-white px-4 py-2">Rating {placeholderMovie.rating}</span>
                        {/* Ends the movie details. */}
                        </div>

                        {/* Displays the movie overview. */}
                        <p className="mt-6 text-lg leading-8 text-mist-700">
                            {/* Displays the overview text. */}
                            {placeholderMovie.overview}
                        {/* Ends the movie overview. */}
                        </p>

                        {/* Holds the applied filters. */}
                        <div className="mt-6 rounded-lg border border-mist-300 bg-neutral-100 p-4 text-sm text-mist-700">
                            {/* Displays the selected genres. */}
                            <p><span className="font-semibold">Genres:</span> {genreSummary}</p>
                            {/* Displays the selected categories. */}
                            <p className="mt-2"><span className="font-semibold">Categories:</span> {categorySummary}</p>
                        {/* Ends the applied filters. */}
                        </div>
                    {/* Ends the movie information. */}
                    </div>
                {/* Ends the movie card. */}
                </article>

                {/* Holds the movie controls. */}
                <div className="flex flex-wrap items-center justify-center gap-4">
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
        <section id="movie-picker" aria-labelledby="movie-picker-title" className="w-full min-w-0 scroll-mt-24 px-4 py-16 sm:px-6 lg:min-h-[36rem] lg:px-16 lg:py-10">
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
