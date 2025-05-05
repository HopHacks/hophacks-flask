export default function HomeSection({ id, img, children }) {    
    return (
        <section id={id} className="snap-start">
            <div
                className="bg-no-repeat bg-center bg-cover h-screen flex justify-center items-center"
                style={{ backgroundImage: `url(${img})` }}
            >
                {children}
            </div>        
        </section>
    )
}