const HomeSection = ({ children }) => {
    return (
        <section className="h-screen w-full flex items-center justify-center snap-start">
            {children}
        </section>
    );
};

export default HomeSection;