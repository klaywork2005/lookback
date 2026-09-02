// Imports state support.
import { useState } from 'react'

// Builds the genre button classes.
const genreButtonClassName = (isSelected: boolean) => {
    // Selects the current state classes.
    const selectionClassName = isSelected
        // Uses the selected state.
        ? 'border-mist-800 ring-4 ring-mist-800 shadow-md'
        // Uses the default state.
        : 'border-mist-400'

    // Returns the complete class name.
    return [
        // Sets the button shape and background.
        'min-h-12 min-w-0 w-full rounded-lg border bg-white px-3 py-2',
        // Sets the button text.
        'text-center text-base font-semibold text-mist-800 sm:text-lg',
        // Animates visual changes.
        'transition duration-150',
        // Shows the hover state.
        'hover:-translate-y-0.5 hover:border-mist-600 hover:shadow-md',
        // Shows the keyboard focus state.
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-mist-400',
        // Adds the current state classes.
        selectionClassName,
    // Joins the classes.
    ].join(' ')
}

// Defines the movie picker.
const MoviePickerSection = () => {
    // Stores the selected genres.
    const [selectedGenres, setSelectedGenres] = useState<Set<string>>(() => new Set())

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
    // Ends the toggle function.
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

            {/* Displays the genre heading. */}
            <h3 className="text-center text-2xl underline mt-10">
                {/* Displays the genre heading text. */}
                What Genres Are You Interested In Watching Today?
            {/* Ends the genre heading. */}
            </h3>

            {/* Holds the genre buttons. */}
            <div className="mt-8 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
                {/* Renders the Action button. */}
                <button type="button" aria-pressed={selectedGenres.has('Action')} onClick={() => toggleGenre('Action')} className={genreButtonClassName(selectedGenres.has('Action'))}>
                    {/* Displays the Action label. */}
                    Action
                {/* Ends the Action button. */}
                </button>

                {/* Renders the Adventure button. */}
                <button type="button" aria-pressed={selectedGenres.has('Adventure')} onClick={() => toggleGenre('Adventure')} className={genreButtonClassName(selectedGenres.has('Adventure'))}>
                    {/* Displays the Adventure label. */}
                    Adventure
                {/* Ends the Adventure button. */}
                </button>

                {/* Renders the Animation button. */}
                <button type="button" aria-pressed={selectedGenres.has('Animation')} onClick={() => toggleGenre('Animation')} className={genreButtonClassName(selectedGenres.has('Animation'))}>
                    {/* Displays the Animation label. */}
                    Animation
                {/* Ends the Animation button. */}
                </button>

                {/* Renders the Comedy button. */}
                <button type="button" aria-pressed={selectedGenres.has('Comedy')} onClick={() => toggleGenre('Comedy')} className={genreButtonClassName(selectedGenres.has('Comedy'))}>
                    {/* Displays the Comedy label. */}
                    Comedy
                {/* Ends the Comedy button. */}
                </button>

                {/* Renders the Crime button. */}
                <button type="button" aria-pressed={selectedGenres.has('Crime')} onClick={() => toggleGenre('Crime')} className={genreButtonClassName(selectedGenres.has('Crime'))}>
                    {/* Displays the Crime label. */}
                    Crime
                {/* Ends the Crime button. */}
                </button>

                {/* Renders the Documentary button. */}
                <button type="button" aria-pressed={selectedGenres.has('Documentary')} onClick={() => toggleGenre('Documentary')} className={genreButtonClassName(selectedGenres.has('Documentary'))}>
                    {/* Displays the Documentary label. */}
                    Documentary
                {/* Ends the Documentary button. */}
                </button>

                {/* Renders the Drama button. */}
                <button type="button" aria-pressed={selectedGenres.has('Drama')} onClick={() => toggleGenre('Drama')} className={genreButtonClassName(selectedGenres.has('Drama'))}>
                    {/* Displays the Drama label. */}
                    Drama
                {/* Ends the Drama button. */}
                </button>

                {/* Renders the Family button. */}
                <button type="button" aria-pressed={selectedGenres.has('Family')} onClick={() => toggleGenre('Family')} className={genreButtonClassName(selectedGenres.has('Family'))}>
                    {/* Displays the Family label. */}
                    Family
                {/* Ends the Family button. */}
                </button>

                {/* Renders the History button. */}
                <button type="button" aria-pressed={selectedGenres.has('History')} onClick={() => toggleGenre('History')} className={genreButtonClassName(selectedGenres.has('History'))}>
                    {/* Displays the History label. */}
                    History
                {/* Ends the History button. */}
                </button>

                {/* Renders the Horror button. */}
                <button type="button" aria-pressed={selectedGenres.has('Horror')} onClick={() => toggleGenre('Horror')} className={genreButtonClassName(selectedGenres.has('Horror'))}>
                    {/* Displays the Horror label. */}
                    Horror
                {/* Ends the Horror button. */}
                </button>

                {/* Renders the Music button. */}
                <button type="button" aria-pressed={selectedGenres.has('Music')} onClick={() => toggleGenre('Music')} className={genreButtonClassName(selectedGenres.has('Music'))}>
                    {/* Displays the Music label. */}
                    Music
                {/* Ends the Music button. */}
                </button>

                {/* Renders the Mystery button. */}
                <button type="button" aria-pressed={selectedGenres.has('Mystery')} onClick={() => toggleGenre('Mystery')} className={genreButtonClassName(selectedGenres.has('Mystery'))}>
                    {/* Displays the Mystery label. */}
                    Mystery
                {/* Ends the Mystery button. */}
                </button>

                {/* Renders the Romance button. */}
                <button type="button" aria-pressed={selectedGenres.has('Romance')} onClick={() => toggleGenre('Romance')} className={genreButtonClassName(selectedGenres.has('Romance'))}>
                    {/* Displays the Romance label. */}
                    Romance
                {/* Ends the Romance button. */}
                </button>

                {/* Renders the Science Fiction button. */}
                <button type="button" aria-pressed={selectedGenres.has('Science Fiction')} onClick={() => toggleGenre('Science Fiction')} className={genreButtonClassName(selectedGenres.has('Science Fiction'))}>
                    {/* Displays the Science Fiction label. */}
                    Science Fiction
                {/* Ends the Science Fiction button. */}
                </button>

                {/* Renders the TV Movie button. */}
                <button type="button" aria-pressed={selectedGenres.has('TV Movie')} onClick={() => toggleGenre('TV Movie')} className={genreButtonClassName(selectedGenres.has('TV Movie'))}>
                    {/* Displays the TV Movie label. */}
                    TV Movie
                {/* Ends the TV Movie button. */}
                </button>

                {/* Renders the Thriller button. */}
                <button type="button" aria-pressed={selectedGenres.has('Thriller')} onClick={() => toggleGenre('Thriller')} className={genreButtonClassName(selectedGenres.has('Thriller'))}>
                    {/* Displays the Thriller label. */}
                    Thriller
                {/* Ends the Thriller button. */}
                </button>

                {/* Renders the Western button. */}
                <button type="button" aria-pressed={selectedGenres.has('Western')} onClick={() => toggleGenre('Western')} className={genreButtonClassName(selectedGenres.has('Western'))}>
                    {/* Displays the Western label. */}
                    Western
                {/* Ends the Western button. */}
                </button>
            {/* Ends the genre buttons. */}
            </div>
            
            <div className='flex items-center justify-center gap-4'>
                <button className='h-14 min-h-12 max-h-16 mt-6 min-w-0 max-w-32 w-full rounded-lg border border-mist-900 bg-mist-600 text-white px-3 py-2 text-center text-base font-semibold sm:text-lg transition duration-150 hover:-translate-y-0.5 active:border-4 focus:'>
                    Clear
                </button>
                
                <button className='h-14 min-h-12 max-h-16 mt-6 min-w-0 max-w-32 w-full rounded-lg border bg-white px-3 py-2 text-center text-base font-semibold text-mist-800 sm:text-lg transition duration-150 hover:-translate-y-0.5 hover:border-mist-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-mist-400'>
                    Next
                </button>
            </div>
        {/* Ends the movie picker. */}
        </section>
    )
}

// Exports the movie picker.
export default MoviePickerSection
