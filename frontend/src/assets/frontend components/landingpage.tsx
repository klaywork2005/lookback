const LandingPage = () => {
    return (
        <div className="bg-neutral-200 min-h-screen flex flex-col items-center w-full">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between bg-neutral-200 w-full max-w-[76vw] min-h-12 border-x border-b border-mist-400">
                <span className="shrink-0 font-bold">Hello World</span>
                {/* Wrap nav items gracefully */}
                <nav className="flex flex-wrap items-center gap-4 text-sm">
                    {/* Your nav links go here */}
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="border-x border-mist-400 w-full max-w-[76vw] min-h-screen flex-1 break-words">
                hello world
            </main>
        </div>
    );
}


export default LandingPage