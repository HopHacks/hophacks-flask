const HomeSection = ({ id, children }) => {
    return (
        <section className="h-screen w-full flex items-center justify-center" id={id}>
            {children}
        </section>
    );
};

export default HomeSection;