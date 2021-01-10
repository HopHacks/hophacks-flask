import React from "react";
import { ParallaxBanner } from 'react-scroll-parallax';
import { ParallaxProvider } from 'react-scroll-parallax';

export default function Home() {
    return (
        <ParallaxProvider>
            <ParallaxBanner
                layers={[
                    {
                        image: '/images/f20/parallax1.webp',
                        image: '/images/f20/parallax1.png',
                        amount: 0.9,
                    },
                    {
                        image: '/images/f20/parallax2.webp',
                        image: '/images/f20/parallax2.png',
                        amount: 0.825,
                    },
                    {
                        image: '/images/f20/parallax3.webp',
                        image: '/images/f20/parallax3.png',
                        amount: 0.75,
                    },
                    {
                        image: '/images/f20/parallax4.webp',
                        image: '/images/f20/parallax4.png',
                        amount: 0.675,
                    },
                    {
                        image: '/images/f20/parallax5.webp',
                        image: '/images/f20/parallax5.png',
                        amount: 0.6,
                    },
                    {
                        image: '/images/f20/parallax6.webp',
                        image: '/images/f20/parallax6.png',
                        amount: 0.525,
                    },
                    {
                        image: '/images/f20/parallax7.webp',
                        image: '/images/f20/parallax7.png',
                        amount: 0.45,
                    },
                    {
                        image: '/images/f20/parallax8.webp',
                        image: '/images/f20/parallax8.png',
                        amount: 0.375,
                    },
                    {
                        image: '/images/f20/parallax9.webp',
                        image: '/images/f20/parallax9.png',
                        amount: 0.3,
                    },
                    {
                        image: '/images/f20/parallax10.webp',
                        image: '/images/f20/parallax10.png',
                        amount: 0.225,
                    },
                    {
                        image: '/images/f20/parallax11.webp',
                        image: '/images/f20/parallax11.png',
                        amount: 0.15,
                    },
                    {
                        image: '/images/f20/parallax12.webp',
                        image: '/images/f20/parallax12.png',
                        amount: 0.075,
                    },
                    {
                        image: '/images/f20/parallax13.webp',
                        image: '/images/f20/parallax13.png',
                        amount: 0,
                    },
                ]}

                style={{
                    height: '100%',
                }}
            />
        </ParallaxProvider>
    );

}
