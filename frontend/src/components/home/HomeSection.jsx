const HomeSection = ({ id, children }) => {
    return (
        // <section
        //     className="min-h-dvh w-full flex items-center justify-center border border-white"
        //     id={id}
        // >
        //     {children}
        // </section>
        <section
            className="min-h-dvh w-full flex items-center justify-center"
            id={id}
        >
            {children}
        </section>
    );
};

export default HomeSection;
